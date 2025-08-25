import { NextResponse } from 'next/server';
import type { 
  RunningHubOutputItem, 
  RunningHubOutputsResponse, 
  RunningHubStatusResponse,
  ApiResponse 
} from '@/types/runninghub';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { taskId } = body;

    if (!taskId) {
      return new NextResponse('Task ID is required', { status: 400 });
    }

    const response = await fetch('https://www.runninghub.cn/task/openapi/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Host': 'www.runninghub.cn'
      },
      body: JSON.stringify({
        apiKey: process.env.RUNNINGHUB_API_KEY,
        taskId: taskId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("RunningHub Status API error:", errorText);
      return new NextResponse(`Error from RunningHub Status API: ${errorText}`, { status: response.status });
    }

    const result = await response.json();
    
    if (result.code === 0) {
        let status = 'UNKNOWN';
        let progress = 0;
        
        // 根据 API 指南处理不同格式的状态数据
        if (typeof result.data === 'string') {
            const upperStatus = result.data.toUpperCase();
            if (upperStatus === 'SUCCESS' || upperStatus === 'COMPLETED') {
                status = 'COMPLETED';
                progress = 100;
            } else if (upperStatus === 'RUNNING' || upperStatus === 'PENDING') {
                status = 'RUNNING';
                progress = 50; // 默认进度
            } else if (upperStatus === 'FAILED' || upperStatus === 'ERROR') {
                status = 'ERROR';
            } else {
                status = result.data;
            }
        } else if (result.data && typeof result.data === 'object') {
            status = result.data.status || 'UNKNOWN';
            progress = result.data.progress || 0;
        }

        // 如果任务完成，获取结果
        if (status === 'COMPLETED') {
            const outputsResponse = await fetch('https://www.runninghub.cn/task/openapi/outputs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Host': 'www.runninghub.cn'
                },
                body: JSON.stringify({
                    apiKey: process.env.RUNNINGHUB_API_KEY,
                    taskId: taskId,
                }),
            });

            if (outputsResponse.ok) {
                const outputsText = await outputsResponse.text();
                let outputsResult: RunningHubOutputsResponse;
                
                try {
                    outputsResult = JSON.parse(outputsText) as RunningHubOutputsResponse;
                } catch (parseError) {
                    console.error("Failed to parse outputs response:", outputsText);
                    return NextResponse.json({ success: false, error: `Invalid outputs response: ${outputsText}` });
                }

                if (outputsResult.code === 0 && outputsResult.data && outputsResult.data.length > 0) {
                    // 根据 API 指南，过滤图像文件
                    const images = outputsResult.data
                        .filter((item: RunningHubOutputItem) => 
                            item.fileUrl && (
                                !item.fileType ||
                                item.fileType.toLowerCase().includes('png') || 
                                item.fileType.toLowerCase().includes('jpg') || 
                                item.fileType.toLowerCase().includes('jpeg')
                            )
                        )
                        .map((item: RunningHubOutputItem) => item.fileUrl);
                    
                    if (images.length > 0) {
                        return NextResponse.json({ 
                            success: true, 
                            data: { 
                                status: 'completed', 
                                resultUrl: images[0],
                                progress: 100
                            } 
                        });
                    }
                }
                
                return NextResponse.json({ success: false, error: outputsResult.msg || 'No valid images found in result' });
            } else {
                const errorText = await outputsResponse.text();
                return NextResponse.json({ success: false, error: `Failed to get task result: ${errorText}` });
            }
        } else {
            // 任务还在进行中或失败
            return NextResponse.json({ 
                success: true, 
                data: { 
                    status: status.toLowerCase(), 
                    progress: progress 
                } 
            });
        }
    } else {
        return NextResponse.json({ success: false, error: result.msg || 'Failed to get task status' });
    }

  } catch (error) {
    console.error('Error in status API route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}