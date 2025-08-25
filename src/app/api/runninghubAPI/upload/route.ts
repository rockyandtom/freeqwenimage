import { NextResponse } from 'next/server';
import type { RunningHubUploadResponse, ApiResponse } from '@/types/runninghub';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return new NextResponse('File is required', { status: 400 });
    }

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    const response = await fetch(`https://www.runninghub.cn/task/openapi/upload?apiKey=${process.env.RUNNINGHUB_API_KEY}`, {
      method: 'POST',
      headers: {
        'Host': 'www.runninghub.cn'
      },
      body: uploadFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("RunningHub Upload API error:", errorText);
      return new NextResponse(`Error from RunningHub Upload API: ${errorText}`, { status: response.status });
    }

    const result = await response.json() as RunningHubUploadResponse;

    if (result.code !== 0) {
        return new NextResponse(result.msg || 'Upload failed', { status: 500 });
    }

    const apiResponse: ApiResponse<{ fileId: string }> = { 
      success: true, 
      fileId: result.data?.fileName || '' 
    };

    return NextResponse.json(apiResponse);

  } catch (error) {
    console.error('Error in upload API route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}