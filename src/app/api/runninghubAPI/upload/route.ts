import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        console.log('Upload API called with file:', {
            name: file?.name,
            size: file?.size,
            type: file?.type
        });

        // 验证文件是否存在
        if (!file) {
            return NextResponse.json({
                success: false,
                error: 'File is required'
            }, { status: 400 });
        }

        // 验证文件类型
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type.toLowerCase())) {
            return NextResponse.json({
                success: false,
                error: 'Invalid file type. Only JPG, PNG, WebP, and GIF are allowed.'
            }, { status: 400 });
        }

        // 验证文件大小 (最大 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({
                success: false,
                error: 'File size must be less than 10MB'
            }, { status: 400 });
        }

        // 使用硬编码的API密钥
        const API_KEY = 'fb88fac46b0349c1986c9cbb4f14d44e';

        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        console.log('Uploading to RunningHub...');
        const response = await fetch(`https://www.runninghub.cn/task/openapi/upload?apiKey=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Host': 'www.runninghub.cn'
            },
            body: uploadFormData,
        });

        console.log('Upload response status:', response.status);
        const responseText = await response.text();
        console.log('Upload response text:', responseText);

        let result;
        try {
            result = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Failed to parse response:', parseError);
            return NextResponse.json({
                success: false,
                error: 'Invalid response from RunningHub API',
                details: responseText
            }, { status: 502 });
        }

        console.log('Parsed result:', result);

        if (result.code !== 0) {
            return NextResponse.json({
                success: false,
                error: result.msg || 'Upload failed',
                details: { code: result.code, response: result }
            }, { status: 500 });
        }

        // 确保返回完整的文件ID（包括api/前缀）
        const fileId = result.data?.fileName || '';
        console.log('File ID returned:', fileId);

        return NextResponse.json({
            success: true,
            data: { fileId }
        });

    } catch (error: any) {
        console.error('Upload error:', error);
        
        return NextResponse.json({
            success: false,
            error: 'Internal Server Error',
            details: error.message
        }, { status: 500 });
    }
}