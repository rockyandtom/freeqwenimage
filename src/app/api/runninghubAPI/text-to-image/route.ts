import { NextRequest } from 'next/server';
import type { ApiResponse } from '@/types/runninghub';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证输入参数
    if (!body.prompt) {
      return Response.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // 调用RunningHub API
    const response = await fetch('https://www.runninghub.cn/task/openapi/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Host': 'www.runninghub.cn'
      },
      body: JSON.stringify({
        webappId: process.env.RUNNINGHUB_WEBAPP_ID,
        apiKey: process.env.RUNNINGHUB_API_KEY,
        nodeInfoList: [
          {
            nodeId: process.env.RUNNINGHUB_TEXT_TO_IMAGE_NODE_ID || "1",
            fieldName: "prompt",
            fieldValue: body.prompt,
            description: "Text prompt for image generation"
          }
        ]
      })
    });

    const result = await response.json();

    if (!response.ok || result.code !== 0) {
      return Response.json(
        { success: false, error: result.msg || 'API request failed' },
        { status: response.status }
      );
    }

    const apiResponse: ApiResponse<{ taskId: string }> = {
      success: true,
      data: { taskId: result.data.taskId }
    };

    return Response.json(apiResponse);

  } catch (error) {
    console.error('Text to Image API error:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}