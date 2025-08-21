import { NextResponse } from 'next/server';
import { checkTaskStatus } from '@/app/api/runninghubAPI/api';

export async function POST(req: Request) {
  try {
    const { taskId } = await req.json();

    if (!taskId) {
      return NextResponse.json({ success: false, error: 'Task ID is required' }, { status: 400 });
    }

    const result = await checkTaskStatus(taskId);

    if (result.success) {
      return NextResponse.json({ success: true, data: { status: result.status, progress: result.progress } });
    } else {
      return NextResponse.json({ success: false, error: result.error || 'Failed to get status' }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}