import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const startTime = Date.now();
    const endpoint = '/api/runninghubAPI/photo-effects';
    
    try {
        const body = await request.json();
        const { imageUrl } = body;

        console.log('Photo Effects API called with imageUrl:', imageUrl);

        // 验证输入参数
        if (!imageUrl) {
            return NextResponse.json({
                success: false,
                error: 'Image URL is required'
            }, { status: 400 });
        }

        // 使用原来的Nano Banana动漫手办生成器API配置
        const requestBody = {
            webappId: "1960913221911810050",
            apiKey: "fb88fac46b0349c1986c9cbb4f14d44e",
            nodeInfoList: [
                {
                    nodeId: "5",
                    fieldName: "image",
                    fieldValue: imageUrl, // 保持完整的文件ID，包括api/前缀
                    description: "image"
                }
            ]
        };

        console.log('Sending request to RunningHub:', requestBody);

        const response = await fetch('https://www.runninghub.cn/task/openapi/ai-app/run', {
            method: 'POST',
            headers: {
                'Host': 'www.runninghub.cn',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody),
        });

        console.log('RunningHub response status:', response.status);
        const responseText = await response.text();
        console.log('RunningHub response text:', responseText);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Failed to parse RunningHub response:', parseError);
            return NextResponse.json({
                success: false,
                error: 'Invalid response from RunningHub API',
                details: responseText
            }, { status: 502 });
        }

        console.log('Parsed RunningHub response:', data);

        if (data.code !== 0) {
            // 特殊处理任务队列已满的情况
            if (data.code === 421 && data.msg === 'TASK_QUEUE_MAXED') {
                return NextResponse.json({
                    success: false,
                    error: 'Task queue is full. Please try again later.',
                    details: { code: data.code, message: 'The AI service is currently busy. Please wait a moment and try again.' }
                }, { status: 429 }); // 使用429 Too Many Requests状态码
            }
            
            // 特殊处理API余额不足的情况
            if (data.code === 433) {
                const errorMsg = data.msg || '';
                if (errorMsg.includes('API balance is insufficient')) {
                    return NextResponse.json({
                        success: false,
                        error: 'API余额不足，请联系管理员充值',
                        details: { code: data.code, message: 'The API balance is insufficient. Please contact administrator to recharge.' }
                    }, { status: 402 }); // 使用402 Payment Required状态码
                }
            }
            
            return NextResponse.json({
                success: false,
                error: data.msg || 'Failed to start AI task',
                details: { code: data.code, response: data }
            }, { status: 500 });
        }

        const duration = Date.now() - startTime;
        console.log(`API call completed in ${duration}ms`);
        
        return NextResponse.json({
            success: true,
            data: {
                taskId: data.data?.taskId,
                clientId: data.data?.clientId,
                webSocketUrl: data.data?.netWssUrl,
                taskStatus: data.data?.taskStatus || 'RUNNING'
            }
        });

    } catch (error: any) {
        const duration = Date.now() - startTime;
        console.error('Photo Effects API error:', error);
        
        return NextResponse.json({
            success: false,
            error: 'Failed to process photo effects request',
            details: error.message
        }, { status: 500 });
    }
}
