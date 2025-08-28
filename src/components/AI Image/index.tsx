"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const aspectRatios = [
  { label: "1:1", value: "1:1" },
  { label: "16:9", value: "16:9" },
  { label: "9:16", value: "9:16" },
  { label: "4:3", value: "4:3" },
  { label: "3:4", value: "3:4" }
]

const randomPrompts = [
  "A cute cat playing in a beautiful garden with colorful flowers",
  "Futuristic city skyline at night with neon lights and flying cars",
  "Magical purple forest with glowing trees and mystical atmosphere",
  "Peaceful lake reflecting snow-capped mountains at sunset",
  "Cool robot warrior in cyberpunk style with advanced armor",
  "Majestic eagle flying over vast mountain landscape",
  "Underwater coral reef with tropical fish and vibrant colors"
]

const applications = [
  { label: "Image Generator", value: "image-generator", api: "/api/runninghubAPI" },
  { label: "Image Watermark Removal", value: "watermark-removal", api: "/api/runninghubAPI/image-effects" },
  { label: "Background Removal", value: "background-removal", api: "/api/runninghubAPI/background-removal" }
]

export default function AIImageGenerator() {
  const [prompt, setPrompt] = React.useState("")
  const [aspectRatio, setAspectRatio] = React.useState("1:1")
  const [negativePrompt, setNegativePrompt] = React.useState("")
  const [showNegativePrompt, setShowNegativePrompt] = React.useState(false)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [generatedImage, setGeneratedImage] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedApp, setSelectedApp] = React.useState("image-generator")
  const [uploadedImage, setUploadedImage] = React.useState<File | null>(null)
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)

  const handleClear = () => {
    setPrompt("")
    setNegativePrompt("")
    setAspectRatio("1:1")
    setShowNegativePrompt(false)
    setGeneratedImage(null)
    setError(null)
    setUploadedImage(null)
    setImagePreview(null)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRandom = () => {
    const randomPrompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)]
    setPrompt(randomPrompt)
  }

  const handleGenerate = async () => {
    const selectedApplication = applications.find(app => app.value === selectedApp)
    
    if (!selectedApplication) {
      alert("Please select an application")
      return
    }

    // 根据不同应用验证不同的输入
    if (selectedApp === "image-generator") {
      if (!prompt.trim()) {
        alert("Please enter a description")
        return
      }
    } else if (selectedApp === "watermark-removal" || selectedApp === "background-removal") {
      if (!uploadedImage) {
        alert("Please upload an image")
        return
      }
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedImage(null)

    try {
      // 根据选择的应用提交任务
      console.log(`提交${selectedApplication.label}任务...`)
      
      let requestBody: any
      if (selectedApp === "image-generator") {
        requestBody = {
          prompt: prompt.trim(),
          aspectRatio,
          negativePrompt: showNegativePrompt ? negativePrompt.trim() : ""
        }
      } else if (selectedApp === "watermark-removal" || selectedApp === "background-removal") {
        if (!uploadedImage) {
          throw new Error("No image uploaded")
        }
        // 对于图片上传，我们直接发送FormData到API
        // API会处理文件上传和任务提交
        const formData = new FormData()
        formData.append('file', uploadedImage)
        
        // 对于图生图应用，我们发送FormData而不是JSON
        const response = await fetch(selectedApplication.api, {
          method: 'POST',
          body: formData // 直接发送FormData，不设置Content-Type
        })

        const result = await response.json()
        console.log('任务提交响应:', result)

        if (!response.ok) {
          throw new Error(result.error || 'Failed to submit generation task')
        }

        if (result.success && result.data && result.data.taskId) {
          const taskId = result.data.taskId
          console.log(`任务提交成功，TaskID: ${taskId}，开始轮询状态...`)
          
          // 第二步：开始轮询任务状态
          await pollTaskStatus(taskId)
        } else {
          throw new Error('Invalid response from task submission')
        }
        return // 直接返回，不继续执行后面的逻辑
      }
      
      const response = await fetch(selectedApplication.api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const result = await response.json()
      console.log('任务提交响应:', result)

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit generation task')
      }

      if (result.success && result.data && result.data.taskId) {
        const taskId = result.data.taskId
        console.log(`任务提交成功，TaskID: ${taskId}，开始轮询状态...`)
        
        // 第二步：开始轮询任务状态
        await pollTaskStatus(taskId)
      } else {
        throw new Error('Invalid response from task submission')
      }
      
    } catch (error) {
      console.error("Generation failed:", error)
      setError(error instanceof Error ? error.message : 'Unknown error occurred')
      setIsGenerating(false)
    }
  }

  // 轮询任务状态的函数
  const pollTaskStatus = async (taskId: string) => {
    const maxAttempts = 200 // 最多轮询200次
    const delayMs = 3000 // 每3秒轮询一次
    let attempt = 0

    const poll = async (): Promise<void> => {
      try {
        attempt++
        const elapsedMinutes = (attempt * delayMs) / 60000
        console.log(`轮询任务状态 ${taskId}, 尝试 ${attempt}/${maxAttempts} (已等待 ${elapsedMinutes.toFixed(1)} 分钟)`)

        // 根据选择的应用调用不同的状态API
        const selectedApplication = applications.find(app => app.value === selectedApp)
        let statusApiUrl = '/api/runninghubAPI/status' // 默认文生图状态API
        
        if (selectedApp === "watermark-removal") {
          statusApiUrl = '/api/runninghubAPI/image-effects/status'
        } else if (selectedApp === "background-removal") {
          statusApiUrl = '/api/runninghubAPI/background-removal/status'
        }

        const statusResponse = await fetch(statusApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ taskId }),
        })

        const statusResult = await statusResponse.json()
        console.log('状态检查响应:', statusResult)

        if (statusResponse.ok && statusResult.success && statusResult.data) {
          const { status, imageUrl, resultUrl } = statusResult.data

          if (status === 'completed' && (imageUrl || resultUrl)) {
            const finalUrl = imageUrl || resultUrl
            console.log(`${selectedApplication?.label}完成!`, finalUrl)
            setGeneratedImage(finalUrl)
            setIsGenerating(false)
            return
          } else if (status === 'running' || status === 'unknown') {
            // 继续轮询
            if (attempt < maxAttempts) {
              setTimeout(poll, delayMs)
            } else {
              throw new Error(`图像生成超时，已等待 ${(maxAttempts * delayMs) / 60000} 分钟`)
            }
          } else {
            throw new Error(`任务处理失败，状态: ${status}`)
          }
        } else {
          throw new Error(statusResult.error || '状态检查失败')
        }
      } catch (error) {
        console.error(`轮询第 ${attempt} 次失败:`, error)
        if (attempt < maxAttempts) {
          console.log(`等待 ${delayMs}ms 后重试...`)
          setTimeout(poll, delayMs)
        } else {
          setError(error instanceof Error ? error.message : 'Unknown polling error')
          setIsGenerating(false)
        }
      }
    }

    // 开始轮询
    poll()
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* 标题 */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Free Qwen Image Generator
        </h2>
        <p className="text-muted-foreground">
          Transform your ideas into stunning images with advanced AI technology
        </p>
      </div>

      {/* 主要输入区域 */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        {/* 1. 输入内容 */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            {(selectedApp === "watermark-removal" || selectedApp === "background-removal") ? "Upload Image" : "Prompt Description"}
          </label>
          
          {(selectedApp === "watermark-removal" || selectedApp === "background-removal") ? (
            // 图片上传组件
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Click to upload image</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, JPEG up to 10MB</p>
                  </div>
                </label>
              </div>
              
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-w-md mx-auto rounded-lg border"
                  />
                  <button
                    onClick={() => {
                      setUploadedImage(null)
                      setImagePreview(null)
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          ) : (
            // 文本输入组件
            <Textarea
              placeholder="What would you like to see?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          )}
        </div>

        {/* 2. 宽高比 - 只在图像生成模式下显示 */}
        {selectedApp === "image-generator" && (
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Aspect Ratio
            </label>
            <div className="flex flex-wrap gap-2">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio.value}
                  onClick={() => setAspectRatio(ratio.value)}
                  className={cn(
                    "px-4 py-2 rounded-md border text-sm font-medium transition-colors",
                    aspectRatio === ratio.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 应用选择 */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Application
          </label>
          <div className="flex flex-wrap gap-2">
            {applications.map((app) => (
              <button
                key={app.value}
                onClick={() => setSelectedApp(app.value)}
                className={cn(
                  "px-4 py-2 rounded-md border text-sm font-medium transition-colors",
                  selectedApp === app.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {app.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. 负面提示词开关 - 只在图像生成模式下显示 */}
        {selectedApp === "image-generator" && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setShowNegativePrompt(!showNegativePrompt)}
                className={cn(
                  "text-sm font-medium transition-colors",
                  showNegativePrompt ? "text-foreground" : "text-muted-foreground"
                )}
              >
                Negative Prompt
              </button>
              <div 
                onClick={() => setShowNegativePrompt(!showNegativePrompt)}
                className={cn(
                  "w-8 h-4 rounded-full border cursor-pointer transition-colors",
                  showNegativePrompt ? "bg-primary border-primary" : "bg-input border-border"
                )}
              >
                <div className={cn(
                  "w-3 h-3 rounded-full bg-white transition-transform duration-200",
                  showNegativePrompt ? "translate-x-4" : "translate-x-0.5",
                  "mt-0.5"
                )} />
              </div>
            </div>
            
            {showNegativePrompt && (
              <Input
                placeholder="What you don't want to see..."
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
              />
            )}
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
          variant="outline"
          onClick={handleClear}
          className="flex-1 sm:flex-none"
        >
          Clear
        </Button>

        <Button
          variant="outline"
          onClick={handleRandom}
          className="flex-1 sm:flex-none"
        >
          Random
        </Button>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || (selectedApp === "image-generator" ? !prompt.trim() : !uploadedImage)}
          className="flex-1 sm:flex-none bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isGenerating 
            ? ((selectedApp === "watermark-removal" || selectedApp === "background-removal") ? "Processing..." : "Generating...") 
            : (selectedApp === "watermark-removal" ? "Remove Watermark" : 
               selectedApp === "background-removal" ? "Remove Background" : "Generate")
          }
        </Button>
      </div>

      {/* 生成状态显示 */}
      {isGenerating && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            Generating your image...
          </div>
        </div>
      )}

      {/* 错误显示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Generation Error</span>
          </div>
          <p className="mt-2 text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* 生成图片显示 */}
      {generatedImage && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
            Generated Image
          </h3>
          <div className="flex justify-center">
            <div className="relative max-w-2xl w-full">
              <img
                src={generatedImage}
                alt="Generated Qwen Image"
                className="w-full h-auto rounded-lg shadow-lg"
                onError={(e) => {
                  console.error('Image failed to load:', generatedImage)
                  setError('Failed to load generated image')
                  setGeneratedImage(null)
                }}
              />
              <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    const link = document.createElement('a')
                    link.href = generatedImage
                    link.download = `qwen-image-${Date.now()}.png`
                    link.click()
                  }}
                  className="flex-1 sm:flex-none"
                >
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedImage)
                    alert('Image URL copied to clipboard!')
                  }}
                  className="flex-1 sm:flex-none"
                >
                  Copy URL
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 工具集合页面入口 */}
      <div className="text-center py-8 border-t border-border">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Discover More AI Tools
          </h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Explore our complete collection of AI-powered tools for image enhancement, transformation, and video creation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/ai-tools'}
              className="flex-1 sm:flex-none"
            >
              🎨 All AI Tools
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/ai-tools/image'}
              className="flex-1 sm:flex-none"
            >
              🖼️ Image Tools
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/ai-tools/video'}
              className="flex-1 sm:flex-none"
            >
              🎬 Video Tools
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
