import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { taskId } = body;

        console.log('Status API called with taskId:', taskId);

        if (!taskId) {
            return NextResponse.json({
                success: false,
                error: 'Task ID is required'
            }, { status: 400 });
        }

        // 使用硬编码的API密钥
        const API_KEY = 'fb88fac46b0349c1986c9cbb4f14d44e';

        const response = await fetch('https://www.runninghub.cn/task/openapi/status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Host': 'www.runninghub.cn'
            },
            body: JSON.stringify({
                apiKey: API_KEY,
                taskId: taskId,
            }),
        });

        console.log('Status response status:', response.status);
        const responseText = await response.text();
        console.log('Status response text:', responseText);

        let result;
        try {
            result = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Failed to parse status response:', parseError);
            return NextResponse.json({
                success: false,
                error: 'Invalid response from RunningHub API',
                details: responseText
            }, { status: 502 });
        }

        if (result.code !== 0) {
            return NextResponse.json({
                success: false,
                error: result.msg || 'Failed to get task status',
                details: { code: result.code, taskId }
            }, { status: 502 });
        }

        let status = 'UNKNOWN';
        let progress = 0;
        
        // 根据文档处理状态信息
        if (typeof result.data === 'string') {
            // 状态映射 - 完全按照文档
            if (result.data === 'SUCCESS' || result.data === 'COMPLETED') {
                status = 'COMPLETED';
                progress = 100;
            } else if (result.data === 'RUNNING' || result.data === 'PENDING') {
                status = 'RUNNING';
                progress = 50;  // 默认进度
            } else if (result.data === 'FAILED' || result.data === 'ERROR') {
                status = 'ERROR';
            } else {
                status = result.data;
            }
        } else if (result.data && typeof result.data === 'object') {
            // 对象格式的状态
            status = result.data.status || 'UNKNOWN';
            progress = result.data.progress || 0;
        }

        // 如果任务完成，获取结果
        if (status === 'COMPLETED') {
            try {
                const outputsResponse = await fetch('https://www.runninghub.cn/task/openapi/outputs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Host': 'www.runninghub.cn'
                    },
                    body: JSON.stringify({
                        apiKey: API_KEY,
                        taskId: taskId,
                    }),
                });

                const outputsText = await outputsResponse.text();
                console.log('Outputs response text:', outputsText);

                let outputsResult;
                try {
                    outputsResult = JSON.parse(outputsText);
                } catch (parseError) {
                    console.error('Failed to parse outputs response:', parseError);
                    return NextResponse.json({
                        success: false,
                        error: 'Invalid outputs response from RunningHub API',
                        details: outputsText
                    }, { status: 502 });
                }

                if (outputsResult.code === 0 && outputsResult.data && outputsResult.data.length > 0) {
                    // 过滤和分类输出文件
                    const images = outputsResult.data
                        .filter((item: any) => 
                            item.fileUrl && (
                                !item.fileType ||
                                item.fileType.toLowerCase().includes('png') || 
                                item.fileType.toLowerCase().includes('jpg') || 
                                item.fileType.toLowerCase().includes('jpeg') ||
                                item.fileType.toLowerCase().includes('webp')
                            )
                        )
                        .map((item: any) => item.fileUrl);
                    
                    const videos = outputsResult.data
                        .filter((item: any) => 
                            item.fileUrl && item.fileType && (
                                item.fileType.toLowerCase().includes('mp4') ||
                                item.fileType.toLowerCase().includes('mov') ||
                                item.fileType.toLowerCase().includes('avi') ||
                                item.fileType.toLowerCase().includes('webm')
                            )
                        )
                        .map((item: any) => item.fileUrl);
                    
                    return NextResponse.json({ 
                        success: true, 
                        data: { 
                            status: 'completed', 
                            resultUrl: images[0] || videos[0] || outputsResult.data[0]?.fileUrl,
                            images,
                            videos,
                            progress: 100,
                            taskId
                        }
                    });
                }
            } catch (error: any) {
                console.error('Error getting outputs:', error);
                return NextResponse.json({
                    success: false,
                    error: 'Failed to get task outputs',
                    details: error.message
                }, { status: 500 });
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                status,
                progress,
                taskId
            }
        });

    } catch (error: any) {
        console.error('Status API error:', error);
        
        return NextResponse.json({
            success: false,
            error: 'Failed to check task status',
            details: error.message
        }, { status: 500 });
    }
}