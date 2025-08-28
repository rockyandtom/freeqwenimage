import { NextResponse } from 'next/server';
import type { RunningHubTaskRequest, RunningHubTaskResponse } from '@/types/runninghub';
import { 
    logApiRequest, 
    logApiResponse, 
    logApiError,
    createErrorResponse, 
    validateEnvironmentConfig,
    parseRunningHubResponse,
    ApiErrorType 
} from '@/lib/api-utils';

export async function POST(request: Request) {
    const startTime = Date.now();
    const endpoint = '/api/runninghubAPI/image-to-video';
    
    try {
        const body = await request.json();
        const { imageUrl, prompt } = body;

        logApiRequest(endpoint, 'POST', { 
            imageUrl: imageUrl ? 'provided' : 'missing',
            prompt: prompt ? 'provided' : 'optional'
        });

        // 验证输入参数
        if (!imageUrl) {
            return createErrorResponse({
                type: ApiErrorType.VALIDATION_ERROR,
                message: 'Image URL is required',
                statusCode: 400
            });
        }

        // 验证环境配置
        const configError = validateEnvironmentConfig();
        if (configError) {
            return createErrorResponse(configError);
        }

        // 图生视频使用 Node ID = 4
        const NODE_ID = '4';

        // 构建节点信息列表
        const nodeInfoList = [
            {
                nodeId: NODE_ID,
                fieldName: 'image',
                fieldValue: imageUrl,
                description: 'Source image for video generation'
            }
        ];

        // 如果提供了prompt，添加到节点信息中
        if (prompt && prompt.trim()) {
            nodeInfoList.push({
                nodeId: NODE_ID,
                fieldName: 'prompt',
                fieldValue: prompt.trim(),
                description: 'Text prompt for video generation'
            });
        }

        const requestBody: RunningHubTaskRequest = {
            webappId: process.env.RUNNINGHUB_WEBAPP_ID!,
            apiKey: process.env.RUNNINGHUB_API_KEY!,
            nodeInfoList,
        };

        const response = await fetch('https://www.runninghub.cn/task/openapi/ai-app/run', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Host': 'www.runninghub.cn'
            },
            body: JSON.stringify(requestBody),
        });

        const data = await parseRunningHubResponse<RunningHubTaskResponse>(response);
        
        const duration = Date.now() - startTime;
        logApiResponse(endpoint, true, duration);
        
        return NextResponse.json(data);

    } catch (error: any) {
        const duration = Date.now() - startTime;
        logApiError(endpoint, error);
        logApiResponse(endpoint, false, duration, error.message);

        if (error.message.includes('RunningHub API error')) {
            return createErrorResponse({
                type: ApiErrorType.EXTERNAL_API_ERROR,
                message: error.message,
                statusCode: 502
            });
        }

        if (error.message.includes('Invalid JSON response')) {
            return createErrorResponse({
                type: ApiErrorType.PARSE_ERROR,
                message: error.message,
                statusCode: 502
            });
        }

        return createErrorResponse({
            type: ApiErrorType.INTERNAL_ERROR,
            message: 'Internal Server Error',
            statusCode: 500
        });
    }
}