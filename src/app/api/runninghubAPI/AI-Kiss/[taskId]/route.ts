import { NextResponse } from 'next/server';
import { checkTaskStatus, checkTaskResult } from '../../api';

export async function GET(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  const taskId = params.taskId;

  if (!taskId) {
    return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
  }

  try {
    const statusData = await checkTaskStatus(taskId);

    if (statusData.status === 'COMPLETED') {
      const resultData = await checkTaskResult(taskId);
      return NextResponse.json({
        status: 'COMPLETED',
        progress: 100,
        files: resultData.files,
      });
    } else if (statusData.status === 'ERROR' || statusData.status === 'FAILED') {
      return NextResponse.json({
        status: statusData.status,
        error: 'Task failed or resulted in an error.',
      });
    } else {
      return NextResponse.json({
        status: statusData.status,
        progress: statusData.progress || 0,
      });
    }
  } catch (error) {
    console.error(`Error checking task ${taskId}:`, error);
    return NextResponse.json({ error: 'Failed to check task status' }, { status: 500 });
  }
}