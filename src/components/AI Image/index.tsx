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

export default function AIImageGenerator() {
  const [prompt, setPrompt] = React.useState("")
  const [aspectRatio, setAspectRatio] = React.useState("1:1")
  const [negativePrompt, setNegativePrompt] = React.useState("")
  const [showNegativePrompt, setShowNegativePrompt] = React.useState(false)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [generatedImage, setGeneratedImage] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const handleClear = () => {
    setPrompt("")
    setNegativePrompt("")
    setAspectRatio("1:1")
    setShowNegativePrompt(false)
    setGeneratedImage(null)
    setError(null)
  }

  const handleRandom = () => {
    const randomPrompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)]
    setPrompt(randomPrompt)
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Please enter a description")
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedImage(null)

    try {
      const response = await fetch('/api/runninghubAPI', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          aspectRatio,
          negativePrompt: showNegativePrompt ? negativePrompt.trim() : ""
        }),
      })

      const result = await response.json()
      console.log('完整API响应:', result)

      if (!response.ok) {
        console.error('API响应错误:', result)
        let errorMessage = result.error || 'Failed to generate image'
        if (result.details) {
          errorMessage += `\n详细信息: ${result.details}`
        }
        if (result.taskId) {
          errorMessage += `\n任务ID: ${result.taskId}`
        }
        if (result.debugInfo) {
          errorMessage += `\n调试信息: ${result.debugInfo}`
        }
        throw new Error(errorMessage)
      }

      if (result.success && result.data) {
        console.log('API Response:', result.data)
        
        // 检查返回的数据结构 - 尝试多种可能的路径获取imageUrl
        let imageUrl = null
        
        if (result.data.imageUrl) {
          imageUrl = result.data.imageUrl
        } else if (result.data.status === 'completed' && result.data.imageUrl) {
          imageUrl = result.data.imageUrl
        } else if (result.data.url) {
          imageUrl = result.data.url
        } else if (result.data.image_url) {
          imageUrl = result.data.image_url
        } else if (result.data.result && result.data.result.imageUrl) {
          imageUrl = result.data.result.imageUrl
        } else if (result.data.result && result.data.result.url) {
          imageUrl = result.data.result.url
        } else if (result.data.output && result.data.output.imageUrl) {
          imageUrl = result.data.output.imageUrl
        } else if (result.data.output && result.data.output.url) {
          imageUrl = result.data.output.url
        }
        
        if (imageUrl) {
          console.log('Found image URL:', imageUrl)
          setGeneratedImage(imageUrl)
        } else {
          console.error('Complete API response for debugging:', JSON.stringify(result, null, 2))
          setError(`图像生成完成但未收到图像URL。请检查控制台输出的完整API响应格式。状态: ${result.data.status || '未知'}`)
        }
      } else {
        console.error('API response error:', result)
        throw new Error(result.error || 'Image generation failed')
      }
      
    } catch (error) {
      console.error("Generation failed:", error)
      setError(error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* 标题 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Free Qwen Image Generator
        </h1>
        <p className="text-muted-foreground">
          Transform your ideas into stunning images with advanced AI technology
        </p>
      </div>

      {/* 主要输入区域 */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        {/* 1. 提示词 */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Prompt Description
          </label>
          <Textarea
            placeholder="What would you like to see?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>

        {/* 2. 宽高比 */}
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

        {/* 3. 负面提示词开关 */}
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
          disabled={isGenerating || !prompt.trim()}
          className="flex-1 sm:flex-none bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isGenerating ? "Generating..." : "Generate"}
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
    </div>
  )
}
