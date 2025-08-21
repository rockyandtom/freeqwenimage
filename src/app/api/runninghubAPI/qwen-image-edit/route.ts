import { NextResponse } from 'next/server';
import { uploadImage, generateImage } from '../api';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const prompt = formData.get('prompt') as string;

    if (!file) {
      return NextResponse.json({ success: false, error: 'File is required' }, { status: 400 });
    }

    if (!prompt) {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    // 1. Upload image
    const uploadResult = await uploadImage(file);
    if (!uploadResult.success) {
      throw new Error('Upload failed');
    }

    // 2. Generate image task
    const generateResult = await generateImage(uploadResult.fileId, prompt);
    if (!generateResult.success) {
      throw new Error('Task creation failed');
    }

    return NextResponse.json({ success: true, data: generateResult.data });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}