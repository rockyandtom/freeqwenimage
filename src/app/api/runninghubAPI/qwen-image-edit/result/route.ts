import { NextResponse } from 'next/server';
import { checkTaskResult } from '@/app/api/runninghubAPI/api';

export async function POST(req: Request) {
  try {
    const { taskId } = await req.json();

    if (!taskId) {
      return NextResponse.json({ success: false, error: 'Task ID is required' }, { status: 400 });
    }

    const result = await checkTaskResult(taskId);

    if (result.success && result.images && result.images.length > 0) {
      return NextResponse.json({ success: true, data: { imageUrl: result.images[0] } });
    } else if (result.success) {
      return NextResponse.json({ success: false, error: 'No images found in result' }, { status: 404 });
    } else {
      return NextResponse.json({ success: false, error: result.error || 'Failed to get result' }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}