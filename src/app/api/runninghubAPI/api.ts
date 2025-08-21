const API_BASE_URL = 'https://www.runninghub.cn';
const API_KEY = process.env.RUNNINGHUB_API_KEY || 'fb88fac46b0349c1986c9cbb4f14d44e';
const WEBAPP_ID = '1958091611945185282';

async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/task/openapi/upload?apiKey=${API_KEY}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status}`);
  }

  const result = await response.json();

  if (result.code !== 0) {
    throw new Error(result.msg || 'Upload failed');
  }

  return {
    success: true,
    fileId: result.data.fileName,
  };
}

async function generateImage(imageId: string, prompt: string) {
  const data = {
    webappId: WEBAPP_ID,
    apiKey: API_KEY,
    nodeInfoList: [
      {
        nodeId: "71",
        fieldName: "image",
        fieldValue: imageId,
        "description": "image"
      },
      {
        nodeId: "73",
        fieldName: "prompt",
        fieldValue: prompt,
        "description": "prompt"
      }
    ],
  };

  const response = await fetch(`${API_BASE_URL}/task/openapi/ai-app/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Host': 'www.runninghub.cn',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Task creation failed: ${response.status}`);
  }

  const result = await response.json();

  if (result.code !== 0 || !result.data) {
    throw new Error(result.msg || 'Task creation failed');
  }

  return {
    success: true,
    data: {
      taskId: result.data.taskId,
      clientId: result.data.clientId,
      webSocketUrl: result.data.netWssUrl,
      taskStatus: result.data.taskStatus || 'RUNNING',
    },
  };
}

async function checkTaskStatus(taskId: string) {
    const response = await fetch(`${API_BASE_URL}/task/openapi/status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Host': 'www.runninghub.cn'
        },
        body: JSON.stringify({
            apiKey: API_KEY,
            taskId: taskId
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to get status: ${response.status}`);
    }

    const result = await response.json();

    if (result.code !== 0) {
        throw new Error(result.msg || 'Failed to get status');
    }

    let status = 'UNKNOWN';
    let progress = 0;
    let rawStatus = '';

    if (typeof result.data === 'string') {
        rawStatus = result.data;
    } else if (result.data && typeof result.data === 'object') {
        rawStatus = result.data.status || 'UNKNOWN';
        progress = result.data.progress || 0;
    }

    const upperStatus = rawStatus.toUpperCase();

    if (upperStatus === 'SUCCESS' || upperStatus === 'COMPLETED') {
        status = 'COMPLETED';
        progress = 100;
    } else if (upperStatus === 'RUNNING' || upperStatus === 'PENDING') {
        status = 'RUNNING';
        if (progress === 0) progress = 50; // Default progress for running
    } else if (upperStatus === 'FAILED' || upperStatus === 'ERROR') {
        status = 'ERROR';
    } else {
        status = rawStatus; // Keep original if not a standard status
    }

    return {
        success: true,
        status,
        progress
    };
}

async function checkTaskResult(taskId: string) {
    const response = await fetch(`${API_BASE_URL}/task/openapi/outputs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Host': 'www.runninghub.cn'
        },
        body: JSON.stringify({
            apiKey: API_KEY,
            taskId: taskId
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to get result: ${response.status}`);
    }

    const result = await response.json();

    if (result.code !== 0) {
        throw new Error(result.msg || 'Failed to get result');
    }

    let files: string[] = [];

    if (result.data && Array.isArray(result.data)) {
        files = result.data
            .filter((item: { fileUrl: string; }) => item.fileUrl)
            .map((item: { fileUrl: string; }) => item.fileUrl);
    }

    return {
        success: true,
        files
    };
}

export { uploadImage, generateImage, checkTaskStatus, checkTaskResult };