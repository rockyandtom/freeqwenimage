import { NextRequest, NextResponse } from 'next/server'

// 简单的内存缓存存储任务状态
const taskCache = new Map<string, any>()

export async function POST(request: NextRequest) {
  try {
    const { prompt, aspectRatio = "1:1", negativePrompt = "" } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // 构建请求数据
    const requestData = {
      webappId: "1952568382849781761",
      apiKey: "fb88fac46b0349c1986c9cbb4f14d44e",
      nodeInfoList: [
        {
          nodeId: "1",
          fieldName: "aspect_ratio",
          fieldValue: aspectRatio,
          description: "aspect_ratio"
        },
        {
          nodeId: "5",
          fieldName: "prompt",
          fieldValue: prompt,
          description: "prompt"
        },
        {
          nodeId: "6",
          fieldName: "prompt",
          fieldValue: negativePrompt,
          description: "prompt"
        }
      ]
    }

    console.log('提交任务到RunningHub:', requestData)

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

    // 检查提交是否成功，获取任务ID（RunningHub使用code:0表示成功）
    if (submitResult.code === 0 && submitResult.data && submitResult.data.taskId) {
      const taskId = submitResult.data.taskId
      
      // 将任务信息存储到缓存
      taskCache.set(taskId, {
        status: 'running',
        prompt,
        aspectRatio,
        negativePrompt,
        createdAt: new Date().toISOString()
      })

      // 开始轮询任务状态
      try {
        console.log(`开始轮询任务状态，taskId: ${taskId}`)
        const finalResult = await pollTaskStatus(taskId)
        console.log('轮询完成，最终结果:', finalResult)
        
        return NextResponse.json({
          success: true,
          data: finalResult
        })
      } catch (pollError) {
        console.error('轮询过程中发生错误:', pollError)
        return NextResponse.json({
          success: false,
          error: '图像生成超时或失败',
          details: pollError instanceof Error ? pollError.message : 'Unknown polling error',
          taskId: taskId,
          debugInfo: '任务已提交到RunningHub，但轮询状态时出现问题'
        }, { status: 500 })
      }
      
    } else {
      throw new Error('Failed to submit task to RunningHub')
    }

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// 轮询任务状态的函数 (10分钟超时：200次 × 3秒 = 600秒)
async function pollTaskStatus(taskId: string, maxAttempts = 200, delayMs = 3000) {
  console.log(`开始轮询任务 ${taskId}，最大尝试次数: ${maxAttempts}，间隔: ${delayMs}ms，总超时时间: ${(maxAttempts * delayMs) / 1000}秒`)
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const elapsedMinutes = (attempt * delayMs) / 60000
      console.log(`轮询任务状态 ${taskId}, 尝试 ${attempt + 1}/${maxAttempts} (已等待 ${elapsedMinutes.toFixed(1)} 分钟)`)
      
      // 查询任务状态的API（根据RunningHub文档）
      const statusUrl = `https://www.runninghub.cn/task/openapi/status`
      console.log('请求状态URL:', statusUrl)
      
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

      console.log(`状态查询响应码: ${statusResponse.status}`)
      
      if (!statusResponse.ok) {
        console.error(`状态查询失败，HTTP状态: ${statusResponse.status}, 状态文本: ${statusResponse.statusText}`)
        throw new Error(`Status query failed with HTTP ${statusResponse.status}`)
      }

      const statusData = await statusResponse.json()
      console.log(`任务状态响应 (尝试 ${attempt + 1}):`, JSON.stringify(statusData, null, 2))
      
      // 根据RunningHub文档的实际API响应结构处理
      if (statusData.code === 0 && statusData.data) {
        console.log('任务状态:', statusData.data)
        
        const status = statusData.data; // data字段直接是状态字符串
        
        // 根据文档，状态值映射
        if (status === 'SUCCESS' || status === 'COMPLETED') {
          console.log('任务已完成，获取结果...')
          
          // 调用outputs API获取结果
          const outputResponse = await fetch('https://www.runninghub.cn/task/openapi/outputs', {
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
          
          if (outputResponse.ok) {
            const outputData = await outputResponse.json()
            console.log('任务结果响应:', JSON.stringify(outputData, null, 2))
            
            if (outputData.code === 0 && outputData.data && Array.isArray(outputData.data)) {
              // 提取图像URL（根据文档格式）
              const imageItem = outputData.data.find((item: any) => 
                item.fileUrl && (
                  !item.fileType ||
                  item.fileType.toLowerCase().includes('png') || 
                  item.fileType.toLowerCase().includes('jpg') || 
                  item.fileType.toLowerCase().includes('jpeg')
                )
              )
              
              if (imageItem && imageItem.fileUrl) {
                const imageUrl = imageItem.fileUrl
                console.log('成功提取图像URL:', imageUrl)
                
                // 更新缓存
                taskCache.set(taskId, {
                  ...taskCache.get(taskId),
                  status: 'completed',
                  imageUrl: imageUrl,
                  completedAt: new Date().toISOString()
                })
                
                return {
                  taskId,
                  status: 'completed',
                  imageUrl: imageUrl
                }
              } else {
                console.error('结果中未找到图像文件:', outputData)
                throw new Error('Task completed but no valid image found in results')
              }
            } else {
              console.error('获取结果失败:', outputData)
              throw new Error('Failed to get task results')
            }
          } else {
            console.error('获取结果请求失败:', outputResponse.status)
            throw new Error('Failed to fetch task results')
          }
          
        } else if (status === 'FAILED' || status === 'ERROR') {
          throw new Error('Task failed on RunningHub')
        } else if (status === 'RUNNING' || status === 'PENDING') {
          console.log(`任务仍在运行中，状态: ${status}`)
          // 继续轮询
        } else {
          console.log(`未知状态: ${status}，继续轮询`)
        }
      } else {
        console.log('状态查询响应格式异常:', JSON.stringify(statusData, null, 2))
        if (statusData.code !== 0) {
          throw new Error(`Status query failed: ${statusData.msg || 'Unknown error'}`)
        }
      }
      
      // 等待后重试
      if (attempt < maxAttempts - 1) {
        console.log(`等待 ${delayMs}ms 后进行下一次轮询...`)
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
      
    } catch (error) {
      console.error(`轮询第 ${attempt + 1} 次失败:`, error)
      
      // 记录详细的错误信息
      if (error instanceof Error) {
        console.error('错误详情:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        })
      }
      
      // 如果是最后一次尝试，抛出错误
      if (attempt === maxAttempts - 1) {
        console.error(`轮询失败，已达到最大尝试次数 ${maxAttempts}`)
        throw new Error(`轮询失败，已尝试 ${maxAttempts} 次（${(maxAttempts * delayMs) / 60000} 分钟）。最后错误: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
      
      // 非最后一次尝试，等待后继续
      if (attempt < maxAttempts - 1) {
        console.log(`第 ${attempt + 1} 次轮询失败，等待 ${delayMs}ms 后重试...`)
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }
  }
  
  console.error(`轮询超时，任务 ${taskId} 在 ${maxAttempts} 次尝试后仍未完成`)
  throw new Error(`图像生成超时，已等待 ${(maxAttempts * delayMs) / 60000} 分钟。任务ID: ${taskId}。请稍后手动查看RunningHub控制台获取结果。`)
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
      console.log(`调试模式：查询任务状态 ${taskId}`)
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
