import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '../api';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const startFrame = formData.get('start_frame') as File;
    const endFrame = formData.get('end_frame') as File;

    if (!startFrame || !endFrame) {
      return NextResponse.json({ error: 'Missing start_frame or end_frame' }, { status: 400 });
    }

    const [startFrameUpload, endFrameUpload] = await Promise.all([
      uploadImage(startFrame),
      uploadImage(endFrame)
    ]);

    if (!startFrameUpload.success || !endFrameUpload.success) {
      throw new Error('Image upload failed');
    }

    const response = await fetch('https://www.runninghub.cn/task/openapi/ai-app/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Host': 'www.runninghub.cn'
      },
      body: JSON.stringify({
        webappId: "1955909545925246978",
        apiKey: process.env.RUNNINGHUB_API_KEY || "fb88fac46b0349c1986c9cbb4f14d44e",
        nodeInfoList: [
          {
            nodeId: "186",
            fieldName: "image",
            fieldValue: startFrameUpload.fileId,
            description: "image"
          },
          {
            nodeId: "187",
            fieldName: "image",
            fieldValue: endFrameUpload.fileId,
            description: "image"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('runninghub.cn API error:', errorText);
      return NextResponse.json({ error: 'Failed to call runninghub.cn API' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}