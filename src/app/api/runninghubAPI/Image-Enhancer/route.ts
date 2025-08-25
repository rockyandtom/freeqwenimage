import { NextResponse } from 'next/server';
import type { RunningHubTaskRequest, RunningHubTaskResponse } from '@/types/runninghub';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { imageUrl } = body;

        if (!imageUrl) {
            return new NextResponse('Image URL is required', { status: 400 });
        }

        // Check if API key and webapp ID are configured
        if (!process.env.RUNNINGHUB_API_KEY) {
            return new NextResponse('RunningHub API key is not configured', { status: 500 });
        }

        if (!process.env.RUNNINGHUB_WEBAPP_ID) {
            return new NextResponse('RunningHub Webapp ID is not configured', { status: 500 });
        }

        // 根据您提供的 curl 命令，Image Enhancer 使用 Node ID = 2
        const NODE_ID = '2';

        const response = await fetch('https://www.runninghub.cn/task/openapi/ai-app/run', {
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
                        nodeId: NODE_ID,
                        fieldName: 'image',
                        fieldValue: imageUrl, // 保持完整的文件 ID，包括 api/ 前缀
                        description: 'image'
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("RunningHub API error:", errorText);
            return new NextResponse(`Error from RunningHub API: ${errorText}`, { status: response.status });
        }

        const responseText = await response.text();
        let data: RunningHubTaskResponse;

        try {
            data = JSON.parse(responseText) as RunningHubTaskResponse;
        } catch (parseError) {
            console.error("Failed to parse RunningHub API response:", responseText);
            return new NextResponse(`Invalid response from RunningHub API: ${responseText}`, { status: 500 });
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('Error in Image-Enhancer API route:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}