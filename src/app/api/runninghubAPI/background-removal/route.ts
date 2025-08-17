import { NextRequest, NextResponse } from 'next/server'

// 简单的内存缓存存储任务状态
const taskCache = new Map<string, any>()

export async function POST(request: NextRequest) {
  try {
    // 检查请求是否为文件上传
    const contentType = request.headers.get('content-type')
    
    if (contentType && contentType.includes('multipart/form-data')) {
      // 处理文件上传
      const formData = await request.formData()
      const file = formData.get('file') as File
      
      if (!file) {
        return NextResponse.json(
          { error: 'File is required' },
          { status: 400 }
        )
      }

      console.log('开始上传文件到RunningHub:', file.name)

      // 第一步：上传文件到RunningHub
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const uploadResponse = await fetch(`https://www.runninghub.cn/task/openapi/upload?apiKey=fb88fac46b0349c1986c9cbb4f14d44e`, {
        method: 'POST',
        body: uploadFormData
      })

      if (!uploadResponse.ok) {
        throw new Error(`File upload failed: ${uploadResponse.status}`)
      }

      const uploadResult = await uploadResponse.json()
      console.log('文件上传响应:', uploadResult)

      if (uploadResult.code !== 0 || !uploadResult.data || !uploadResult.data.fileName) {
        throw new Error(uploadResult.msg || 'File upload failed')
      }

      const fileId = uploadResult.data.fileName
      console.log('文件上传成功，fileId:', fileId)

      // 第二步：使用上传的文件ID创建AI任务
      const requestData = {
        webappId: "1956630770939035649",
        apiKey: "fb88fac46b0349c1986c9cbb4f14d44e",
        nodeInfoList: [
          {
            nodeId: "3",
            fieldName: "image",
            fieldValue: fileId, // 使用上传后的完整文件ID
            description: "image"
          }
        ]
      }

      console.log('提交抠图任务到RunningHub:', requestData)

      // 调用外部API提交任务
      const response = await fetch('https://www.runninghub.cn/task/openapi/ai-app/run', {
        method: 'POST',
        headers: {
          'Host': 'www.runninghub.cn',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const submitResult = await response.json()
      console.log('RunningHub响应:', submitResult)

      // 检查提交是否成功，获取任务ID
      if (submitResult.code === 0 && submitResult.data && submitResult.data.taskId) {
        const taskId = submitResult.data.taskId
        
        // 将任务信息存储到缓存
        taskCache.set(taskId, {
          status: 'running',
          fileId,
          type: 'background-removal',
          createdAt: new Date().toISOString()
        })

        // 任务提交成功，返回任务ID让前端轮询
        console.log(`抠图任务提交成功，taskId: ${taskId}`)
        
        return NextResponse.json({
          success: true,
          data: {
            taskId: taskId,
            status: 'submitted',
            message: '抠图处理任务已提交，请等待处理完成'
          }
        })
      } else {
        throw new Error('Failed to submit background removal task to RunningHub')
      }
    } else {
      // 兼容旧的JSON格式请求（使用已上传的文件ID）
      const { image } = await request.json()

      if (!image) {
        return NextResponse.json(
          { error: 'Image is required' },
          { status: 400 }
        )
      }

      // 构建请求数据 - 使用提供的图像ID
      const requestData = {
        webappId: "1956630770939035649",
        apiKey: "fb88fac46b0349c1986c9cbb4f14d44e",
        nodeInfoList: [
          {
            nodeId: "3",
            fieldName: "image",
            fieldValue: image,
            description: "image"
          }
        ]
      }

      console.log('提交抠图任务到RunningHub:', requestData)

      // 调用外部API提交任务
      const response = await fetch('https://www.runninghub.cn/task/openapi/ai-app/run', {
        method: 'POST',
        headers: {
          'Host': 'www.runninghub.cn',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const submitResult = await response.json()
      console.log('RunningHub响应:', submitResult)

      // 检查提交是否成功，获取任务ID
      if (submitResult.code === 0 && submitResult.data && submitResult.data.taskId) {
        const taskId = submitResult.data.taskId
        
        // 将任务信息存储到缓存
        taskCache.set(taskId, {
          status: 'running',
          image,
          type: 'background-removal',
          createdAt: new Date().toISOString()
        })

        // 任务提交成功，返回任务ID让前端轮询
        console.log(`抠图任务提交成功，taskId: ${taskId}`)
        
        return NextResponse.json({
          success: true,
          data: {
            taskId: taskId,
            status: 'submitted',
            message: '抠图处理任务已提交，请等待处理完成'
          }
        })
      } else {
        throw new Error('Failed to submit background removal task to RunningHub')
      }
    }

  } catch (error) {
    console.error('Background Removal API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process background removal',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET方法用于查询任务状态（可选）
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const taskId = url.searchParams.get('taskId')
  const debug = url.searchParams.get('debug')
  
  if (!taskId) {
    return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
  }
  
  // 如果是调试模式，直接查询RunningHub API
  if (debug === 'true') {
    try {
      console.log(`调试模式：查询抠图任务状态 ${taskId}`)
      const statusUrl = `https://www.runninghub.cn/task/openapi/status`
      
      const statusResponse = await fetch(statusUrl, {
        method: 'POST',
        headers: {
          'Host': 'www.runninghub.cn',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: "fb88fac46b0349c1986c9cbb4f14d44e",
          taskId: taskId
        })
      })
      
      if (statusResponse.ok) {
        const statusData = await statusResponse.json()
        console.log('调试模式 - RunningHub响应:', statusData)
        
        return NextResponse.json({
          success: true,
          debug: true,
          data: statusData,
          url: statusUrl,
          httpStatus: statusResponse.status
        })
      } else {
        return NextResponse.json({
          success: false,
          debug: true,
          error: `HTTP ${statusResponse.status}: ${statusResponse.statusText}`,
          url: statusUrl,
          httpStatus: statusResponse.status
        })
      }
    } catch (error) {
      return NextResponse.json({
        success: false,
        debug: true,
        error: error instanceof Error ? error.message : 'Unknown error',
        taskId
      })
    }
  }
  
  // 常规模式：从缓存获取
  const taskInfo = taskCache.get(taskId)
  if (!taskInfo) {
    return NextResponse.json({ error: 'Task not found in cache' }, { status: 404 })
  }
  
  return NextResponse.json({
    success: true,
    data: taskInfo
  })
}