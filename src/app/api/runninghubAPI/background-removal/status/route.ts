import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { taskId } = await request.json()

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }

    console.log(`查询抠图任务状态: ${taskId}`)

    // 查询任务状态的API（根据RunningHub文档）
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

    if (!statusResponse.ok) {
      throw new Error(`Status query failed with HTTP ${statusResponse.status}`)
    }

    const statusData = await statusResponse.json()
    console.log('抠图任务状态响应:', statusData)
    
    // 根据RunningHub文档的实际API响应结构处理
    if (statusData.code === 0 && statusData.data) {
      const status = statusData.data; // data字段直接是状态字符串
      
      // 根据文档，状态值映射
      if (status === 'SUCCESS' || status === 'COMPLETED') {
        console.log('抠图任务已完成，获取结果...')
        
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
          console.log('抠图任务结果响应:', outputData)
          
          if (outputData.code === 0 && outputData.data && Array.isArray(outputData.data)) {
            // 提取处理后的图像URL
            const resultItem = outputData.data.find((item: any) => 
              item.fileUrl && (
                !item.fileType ||
                item.fileType.toLowerCase().includes('png') || 
                item.fileType.toLowerCase().includes('jpg') || 
                item.fileType.toLowerCase().includes('jpeg')
              )
            )
            
            if (resultItem && resultItem.fileUrl) {
              return NextResponse.json({
                success: true,
                data: {
                  taskId,
                  status: 'completed',
                  resultUrl: resultItem.fileUrl,
                  fileType: resultItem.fileType || 'unknown',
                  message: '抠图处理完成'
                }
              })
            } else {
              return NextResponse.json({
                success: false,
                error: 'Task completed but no valid result found'
              }, { status: 500 })
            }
          } else {
            return NextResponse.json({
              success: false,
              error: 'Failed to get task results'
            }, { status: 500 })
          }
        } else {
          return NextResponse.json({
            success: false,
            error: 'Failed to fetch task results'
          }, { status: 500 })
        }
        
      } else if (status === 'FAILED' || status === 'ERROR') {
        return NextResponse.json({
          success: false,
          error: 'Background removal task failed on RunningHub'
        }, { status: 500 })
      } else if (status === 'RUNNING' || status === 'PENDING') {
        return NextResponse.json({
          success: true,
          data: {
            taskId,
            status: 'running',
            message: `抠图任务正在处理中，状态: ${status}`
          }
        })
      } else {
        return NextResponse.json({
          success: true,
          data: {
            taskId,
            status: 'unknown',
            message: `未知状态: ${status}，继续等待`
          }
        })
      }
    } else {
      return NextResponse.json({
        success: false,
        error: `Status query failed: ${statusData.msg || 'Unknown error'}`
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Background removal status check error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to check background removal task status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}





