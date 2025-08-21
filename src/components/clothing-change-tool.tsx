"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Upload, Image as ImageIcon, Loader2, Download, Wand2 } from "lucide-react"

interface ClothingChangeToolProps {
  className?: string
}

const clothingStyles = [
  { label: "Casual", value: "casual" },
  { label: "Formal", value: "formal" },
  { label: "Sporty", value: "sport" },
  { label: "Vintage", value: "vintage" },
  { label: "Streetwear", value: "street" },
  { label: "Elegant", value: "elegant" }
]

export default function ClothingChangeTool({ className }: ClothingChangeToolProps) {
  const [originalImage, setOriginalImage] = React.useState<File | null>(null)
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const [clothingPrompt, setClothingPrompt] = React.useState("")
  const [selectedStyle, setSelectedStyle] = React.useState("")
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [processedImage, setProcessedImage] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [taskId, setTaskId] = React.useState<string | null>(null)
  const [progress, setProgress] = React.useState(0)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setOriginalImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setProcessedImage(null)
      setError(null)
    }
  }

  const handleStyleSelect = (style: string) => {
    setSelectedStyle(style)
    const stylePrompts = {
      casual: "A casual, comfortable everyday outfit, like a t-shirt and jeans.",
      formal: "Formal business attire, such as a suit and tie or professional dress.",
      sport: "Athletic apparel, like a tracksuit and sneakers.",
      vintage: "Vintage-style clothing with nostalgic elements.",
      street: "Trendy streetwear, like a hoodie and a baseball cap.",
      elegant: "An elegant and fashionable outfit, such as a dress and high heels."
    }
    setClothingPrompt(stylePrompts[style as keyof typeof stylePrompts] || "")
  }

  const handleGenerate = async () => {
    if (!originalImage) {
      setError("Please upload an image first.")
      return
    }

    if (!clothingPrompt.trim()) {
      setError("Please describe the desired clothing style.")
      return
    }

    setIsProcessing(true)
    setError(null)
    setProcessedImage(null)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', originalImage)
      formData.append('prompt', clothingPrompt)

      const submitResponse = await fetch('/api/runninghubAPI/qwen-image-edit', {
        method: 'POST',
        body: formData
      })

      const submitResult = await submitResponse.json()

      if (!submitResponse.ok) {
        throw new Error(submitResult.error || 'Task submission failed.')
      }

      if (submitResult.success && submitResult.data?.taskId) {
        const newTaskId = submitResult.data.taskId
        setTaskId(newTaskId)
        await pollTaskStatus(newTaskId)
      } else {
        throw new Error('Invalid response format.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed.')
      setIsProcessing(false)
    }
  }

  const pollTaskStatus = async (currentTaskId: string) => {
    const maxAttempts = 60
    const delayMs = 2000
    let attempts = 0

    const poll = async (): Promise<void> => {
      try {
        attempts++
        setProgress(Math.min((attempts / maxAttempts) * 100, 95))

        const statusResponse = await fetch('/api/runninghubAPI/qwen-image-edit/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId: currentTaskId })
        })

        const statusResult = await statusResponse.json()

        if (!statusResponse.ok) {
          throw new Error(statusResult.error || 'Failed to query status.')
        }

        const taskStatus = statusResult.data?.status

        if (taskStatus === 'COMPLETED') {
          setProgress(100)
          
          const resultResponse = await fetch('/api/runninghubAPI/qwen-image-edit/result', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId: currentTaskId })
          })

          const resultData = await resultResponse.json()
          
          if (resultData.success && resultData.data?.imageUrl) {
            setProcessedImage(resultData.data.imageUrl)
          } else {
            throw new Error('Failed to get result.')
          }
          
          setIsProcessing(false)
          return
        } else if (taskStatus === 'failed' || taskStatus === 'ERROR') {
          throw new Error(statusResult.data?.errorMessage || 'Processing failed.')
        } else if (attempts >= maxAttempts) {
          throw new Error('Processing timed out.')
        } else {
          setTimeout(poll, delayMs)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Processing failed.')
        setIsProcessing(false)
      }
    }

    await poll()
  }

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a')
      link.href = processedImage
      link.download = `clothing-change-${Date.now()}.png`
      link.click()
    }
  }

  return (
    <div className={cn("w-full max-w-7xl mx-auto", className)}>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left side: Upload and settings */}
        <Card className="bg-background/50">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Customize Your Look</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">Upload Your Photo</label>
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Original"
                      className="max-w-full h-64 object-contain mx-auto rounded-md"
                    />
                  ) : (
                    <div className="space-y-2 text-muted-foreground">
                      <Upload className="w-12 h-12 mx-auto" />
                      <p className="font-semibold">Click to upload</p>
                      <p className="text-xs">Supports JPG, PNG, WEBP</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">Choose a Style</label>
              <div className="grid grid-cols-3 gap-2">
                {clothingStyles.map((style) => (
                  <Button
                    key={style.value}
                    type="button"
                    variant={selectedStyle === style.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStyleSelect(style.value)}
                  >
                    {style.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">Describe the Details</label>
              <Textarea
                value={clothingPrompt}
                onChange={(e) => setClothingPrompt(e.target.value)}
                placeholder="e.g., blue denim jacket, white t-shirt, black casual pants..."
                className="min-h-[100px] bg-background/70"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!originalImage || !clothingPrompt.trim() || isProcessing}
              className="w-full text-lg py-6"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing... {progress.toFixed(0)}%
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Right side: Result display */}
        <Card className="bg-background/50">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">AI-Generated Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative border border-muted rounded-lg min-h-[500px] bg-muted/20 flex items-center justify-center overflow-hidden">
              {isProcessing && !processedImage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                  <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                  <p className="text-lg font-semibold text-foreground">AI is working its magic...</p>
                  <div className="w-4/5 bg-muted rounded-full h-2.5 mt-4">
                    <div
                      className="bg-primary h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
              
              {processedImage && (
                <div className="w-full h-full">
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              
              {!isProcessing && !processedImage && !error && (
                <div className="text-center text-muted-foreground p-8">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">Your new look will appear here</h3>
                  <p className="text-sm">Upload an image and describe your desired style to get started.</p>
                </div>
              )}
              
              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/10 text-destructive p-8">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">An Error Occurred</h3>
                  <p className="text-sm text-center">{error}</p>
                </div>
              )}
            </div>
            {processedImage && (
              <Button
                onClick={handleDownload}
                className="w-full mt-4"
                variant="default"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Image
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}