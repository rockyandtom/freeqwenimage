import {NextResponse} from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {imageUrl} = body;

        if (!imageUrl) {
            return new NextResponse('Image URL is required', {status: 400});
        }

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
                        nodeId: '2',
                        fieldName: 'image',
                        fieldValue: imageUrl,
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("RunningHub API error:", errorText);
            return new NextResponse(`Error from RunningHub API: ${errorText}`, {status: response.status});
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error in Image-Enhancer API route:', error);
        return new NextResponse('Internal Server Error', {status: 500});
    }
}