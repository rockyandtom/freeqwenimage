"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Download, Share2, Upload, X, RefreshCw } from "lucide-react"
import { ToolLayout } from "@/components/tools/_base/tool-layout"
import { useAITool } from "@/hooks/use-ai-tool"

export default function PhotoEffectsTool() {
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null)
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [result, setResult] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [taskId, setTaskId] = React.useState<string | null>(null)
  const [progress, setProgress] = React.useState<number>(0)
  const [isPolling, setIsPolling] = React.useState(false)
  const [taskStatus, setTaskStatus] = React.useState<string>('')
  
  // 使用useRef存储取消函数，防止组件重新渲染时丢失
  const cancelPollingRef = React.useRef<(() => void) | null>(null)
  // 使用useRef存储任务开始时间
  const taskStartTimeRef = React.useRef<number>(0)

  const { execute: executeAITool } = useAITool('photo-effects')

  // 智能进度计算函数
  const calculateProgress = (status: string, attempts: number) => {
    const elapsedTime = Date.now() - taskStartTimeRef.current
    const maxTime = 5 * 60 * 1000 // 5分钟超时时间
    
    switch (status) {
      case 'PENDING':
        // 等待状态：10%-30%，基于时间线性增长
        return Math.min(10 + (elapsedTime / maxTime) * 20, 30)
      case 'RUNNING':
        // 运行状态：30%-90%，基于时间线性增长
        return Math.min(30 + (elapsedTime / maxTime) * 60, 90)
      case 'COMPLETED':
        // 完成状态：100%
        return 100
      case 'FAILED':
      case 'ERROR':
        // 失败状态：0%
        return 0
      default:
        // 默认状态：基于轮询次数，10%-50%
        return Math.min(10 + (attempts * 3), 50)
    }
  }

  // 组件卸载时清理轮询
  React.useEffect(() => {
    return () => {
      if (cancelPollingRef.current) {
        cancelPollingRef.current()
        cancelPollingRef.current = null
      }
    }
  }, [])

  // 从localStorage恢复结果状态
  React.useEffect(() => {
    const savedResult = localStorage.getItem('photo-effects-result')
    const savedTaskId = localStorage.getItem('photo-effects-taskId')
    const savedProgress = localStorage.getItem('photo-effects-progress')
    
    if (savedResult) {
      setResult(savedResult)
    }
    if (savedTaskId) {
      setTaskId(savedTaskId)
    }
         if (savedProgress && savedTaskId) {
       const progress = parseInt(savedProgress)
       if (progress < 100) {
         // 如果进度未完成，继续轮询
         setProgress(progress)
         setIsPolling(true)
         pollTaskStatus(savedTaskId).then(cancelPolling => {
           if (cancelPolling) {
             cancelPollingRef.current = cancelPolling
           }
         })
       } else {
         setProgress(progress)
       }
     }
  }, [])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Image size must be less than 10MB')
        return
      }
      
      setSelectedImage(file)
      setError(null)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (error) setError(null)
  }

  const handleSubmit = async () => {
    if (!selectedImage) {
      setError('Please upload an image first')
      return
    }

    // 清理之前的轮询
    if (cancelPollingRef.current) {
      cancelPollingRef.current()
      cancelPollingRef.current = null
    }

    // 清理localStorage中的旧数据
    localStorage.removeItem('photo-effects-result')
    localStorage.removeItem('photo-effects-taskId')
    localStorage.removeItem('photo-effects-progress')

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      // 第一步：上传图片
      const uploadFormData = new FormData()
      uploadFormData.append('file', selectedImage)

      const uploadResponse = await fetch('/api/runninghubAPI/upload', {
        method: 'POST',
        body: uploadFormData
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image')
      }

      const uploadResult = await uploadResponse.json()
      if (!uploadResult.success || !uploadResult.data?.fileId) {
        throw new Error(uploadResult.error || 'Upload failed')
      }

      const imageUrl = uploadResult.data.fileId

      // 第二步：调用Photo Effects API
      const response = await fetch('/api/runninghubAPI/photo-effects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imageUrl
        })
      })

      const result = await response.json()
      console.log('Photo Effects API response:', result)
      
      if (!result.success) {
        // 特殊处理任务队列已满的情况
        if (result.error && result.error.includes('Task queue is full')) {
          throw new Error('AI服务当前繁忙，请稍后再试。')
        }
        // 特殊处理API余额不足的情况
        if (result.error && result.error.includes('API余额不足')) {
          throw new Error('API余额不足，请联系管理员充值。')
        }
        // 特殊处理429状态码（任务队列满）
        if (response.status === 429) {
          throw new Error('AI服务当前繁忙，请稍后再试。')
        }
        throw new Error(result.error || 'Failed to generate anime figure')
      }

      setTaskId(result.data?.taskId)
      console.log('Starting to poll task status for taskId:', result.data?.taskId)
      
      // 记录任务开始时间
      taskStartTimeRef.current = Date.now()
      
      // 重置进度并开始轮询任务状态
      setProgress(0)
      setIsPolling(true)
      setTaskStatus('PENDING')
      
      // 保存任务ID和进度到localStorage
      localStorage.setItem('photo-effects-taskId', result.data?.taskId)
      localStorage.setItem('photo-effects-progress', '0')
      
             // 存储取消函数
       pollTaskStatus(result.data.taskId).then(cancelPolling => {
         if (cancelPolling) {
           cancelPollingRef.current = cancelPolling
         }
       })

    } catch (err: any) {
      setError(err.message || 'Failed to generate anime figure. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const pollTaskStatus = async (taskId: string) => {
    let attempts = 0
    const maxAttempts = 60 // 最多轮询5分钟
    let isCancelled = false // 添加取消标志

    const poll = async () => {
      // 检查是否已取消
      if (isCancelled) {
        console.log('Polling cancelled')
        return
      }

      if (attempts >= maxAttempts) {
        if (!isCancelled) {
          setError('Task timeout. Please try again.')
          setIsPolling(false)
        }
        return
      }

      try {
        const response = await fetch('/api/runninghubAPI/status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ taskId })
        })
        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to check task status')
        }

        const status = result.data?.status
        console.log(`Status check ${attempts + 1}: ${status}`)
        
        // 检查是否已取消
        if (isCancelled) return
        
        // 更新任务状态
        setTaskStatus(status)
        
        // 使用智能进度计算
        const calculatedProgress = calculateProgress(status, attempts)
        setProgress(calculatedProgress)
        
        // 保存进度到localStorage
        localStorage.setItem('photo-effects-progress', calculatedProgress.toString())
        
        if (status === 'completed' || status === 'COMPLETED') {
          const resultUrl = result.data?.resultUrl || result.data?.images?.[0]
          console.log('Task completed, setting result:', resultUrl)
          if (!isCancelled) {
            setResult(resultUrl)
            setIsPolling(false)
            setProgress(100)
            // 保存到localStorage
            if (resultUrl) {
              localStorage.setItem('photo-effects-result', resultUrl)
              localStorage.setItem('photo-effects-progress', '100')
            }
          }
          return
        } else if (status === 'failed' || status === 'ERROR') {
          if (!isCancelled) {
            setIsPolling(false)
            setError(result.data?.error || 'Task failed')
          }
          return
        } else {
          // 继续轮询 - 先递增attempts，再设置下一次轮询
          attempts++
          if (!isCancelled) {
            setTimeout(() => poll(), 5000) // 5秒后再次检查
          }
        }
      } catch (err: any) {
        console.error('Polling error:', err)
        if (!isCancelled) {
          setError(err.message || 'Failed to check task status')
          setIsPolling(false)
        }
      }
    }

    // 返回取消函数
    const cancelPolling = () => {
      isCancelled = true
      setIsPolling(false)
    }

    poll()
    return cancelPolling
  }

  const handleDownload = () => {
    if (result) {
      const link = document.createElement('a')
      link.href = result
      link.download = 'anime-figure.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleShare = () => {
    if (result && navigator.share) {
      navigator.share({
        title: 'My Anime Figure - Generated with Nano Banana',
        text: 'Check out this amazing anime figure I created with Nano Banana!',
        url: window.location.href
      })
    }
  }

  const handleReset = () => {
    // 清理轮询
    if (cancelPollingRef.current) {
      cancelPollingRef.current()
      cancelPollingRef.current = null
    }
    
    // 清理localStorage
    localStorage.removeItem('photo-effects-result')
    localStorage.removeItem('photo-effects-taskId')
    localStorage.removeItem('photo-effects-progress')
    
    // 重置状态
    setResult(null)
    setTaskId(null)
    setProgress(0)
    setIsPolling(false)
    setTaskStatus('')
    setError(null)
    
    // 重置任务开始时间
    taskStartTimeRef.current = 0
  }

  return (
    <ToolLayout 
      title="Photo Effects - Nano Banana Anime Figure Generator" 
      description="Create stunning anime figures with our AI-powered Nano Banana generator"
    >
             <div className="space-y-6">
         {/* Image Upload Section */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <span>📸</span>
               Upload Your Image
             </CardTitle>
             <CardDescription>
               Upload an image to transform it into an anime figure. Supported formats: JPG, PNG, WebP (max 10MB).
             </CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
             {!imagePreview ? (
               <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                 <input
                   type="file"
                   accept="image/*"
                   onChange={handleImageUpload}
                   className="hidden"
                   id="image-upload"
                   disabled={isLoading}
                 />
                 <label htmlFor="image-upload" className="cursor-pointer">
                   <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                   <p className="text-lg font-medium text-gray-900 mb-2">
                     Click to upload or drag and drop
                   </p>
                   <p className="text-sm text-gray-500">
                     PNG, JPG, WebP up to 10MB
                   </p>
                 </label>
               </div>
             ) : (
               <div className="relative">
                 <img
                   src={imagePreview}
                   alt="Preview"
                   className="w-full max-w-md mx-auto rounded-lg border"
                 />
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={removeImage}
                   className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                   disabled={isLoading}
                 >
                   <X className="h-4 w-4" />
                 </Button>
               </div>
             )}
           </CardContent>
         </Card>

                   {/* Generate Button */}
                     <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <span>✨</span>
                 Generate Anime Figure
               </CardTitle>
               <CardDescription>
                 Click the button below to transform your uploaded image into an anime figure using our AI technology.
               </CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
               <Button 
                 onClick={handleSubmit}
                 disabled={isLoading || !selectedImage}
                 className="w-full"
                 size="lg"
               >
                 {isLoading ? (
                   <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Generating Anime Figure...
                   </>
                 ) : (
                   'Generate Anime Figure'
                 )}
               </Button>
               
                               {/* 进度条显示 */}
                {isPolling && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">生成进度</span>
                      <span className="font-medium">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                    <div className="text-xs text-muted-foreground text-center">
                      {taskStatus === 'PENDING' && '正在等待任务开始...'}
                      {taskStatus === 'RUNNING' && '正在生成动漫手办，请稍候...'}
                      {taskStatus === 'COMPLETED' && '任务完成！'}
                      {!taskStatus && '正在连接服务器...'}
                    </div>
                    {taskId && (
                      <div className="text-xs text-muted-foreground text-center">
                        任务ID: {taskId}
                      </div>
                    )}
                  </div>
                )}
             </CardContent>
           </Card>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Result Display */}
        {result && (
          <Card>
            <CardHeader>
                             <CardTitle className="flex items-center justify-between">
                 <span>✨ Generated Anime Figure</span>
                 <div className="flex gap-2">
                   <Button variant="outline" size="sm" onClick={handleDownload}>
                     <Download className="mr-2 h-4 w-4" />
                     Download
                   </Button>
                   <Button variant="outline" size="sm" onClick={handleShare}>
                     <Share2 className="mr-2 h-4 w-4" />
                     Share
                   </Button>
                   <Button variant="outline" size="sm" onClick={handleReset}>
                     <RefreshCw className="mr-2 h-4 w-4" />
                     重新开始
                   </Button>
                 </div>
               </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square w-full max-w-md mx-auto overflow-hidden rounded-lg border">
                <img
                  src={result}
                  alt="Generated anime figure"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Your anime figure has been generated successfully! You can download it or share it with others.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

                 {/* Tips Section */}
         <Card>
           <CardHeader>
             <CardTitle>💡 Tips for Better Results</CardTitle>
           </CardHeader>
           <CardContent>
                           <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Upload a clear, high-quality image for best transformation results</li>
                <li>• The AI will automatically transform your image into an anime figure style</li>
                <li>• Supported formats: JPG, PNG, WebP (max 10MB)</li>
                <li>• For best results, use images with good lighting and clear subjects</li>
                <li>• The transformation process typically takes 30-60 seconds</li>
                <li>• You can try different images to get varied anime figure styles</li>
              </ul>
           </CardContent>
         </Card>
      </div>
    </ToolLayout>
  )
}
