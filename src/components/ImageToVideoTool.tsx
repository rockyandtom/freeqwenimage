'use client'

import * as React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Video, Loader2 } from 'lucide-react'
import { Progress } from "@/components/ui/progress"

export function ImageToVideoTool() {
  const [startFrame, setStartFrame] = React.useState<File | null>(null)
  const [endFrame, setEndFrame] = React.useState<File | null>(null)
  const [startFramePreview, setStartFramePreview] = React.useState<string | null>(null)
  const [endFramePreview, setEndFramePreview] = React.useState<string | null>(null)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [generatedVideo, setGeneratedVideo] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [progress, setProgress] = React.useState(0)
  const [taskId, setTaskId] = React.useState<string | null>(null)

  const pollTaskStatus = async (taskId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/runninghubAPI/AI-Kiss/${taskId}`)
        const data = await res.json()

        if (res.ok) {
          setProgress(data.progress || 0)
          if (data.status === 'COMPLETED') {
            setGeneratedVideo(data.files[0])
            setIsProcessing(false)
            clearInterval(interval)
          } else if (data.status === 'ERROR' || data.status === 'FAILED') {
            setError('Video generation failed.')
            setIsProcessing(false)
            clearInterval(interval)
          }
        } else {
          setError(data.error || 'Failed to check task status.')
          setIsProcessing(false)
          clearInterval(interval)
        }
      } catch (err) {
        setError('An error occurred while checking task status.')
        setIsProcessing(false)
        clearInterval(interval)
      }
    }, 5000)
  }

  const handleStartFrameUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setStartFrame(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setStartFramePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEndFrameUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setEndFrame(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setEndFramePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!startFrame || !endFrame) {
      setError('Please upload both start and end frame images.')
      return
    }

    setIsProcessing(true)
    setError(null)
    setGeneratedVideo(null)
    setProgress(0)
    setTaskId(null)

    try {
      const formData = new FormData()
      formData.append('start_frame', startFrame)
      formData.append('end_frame', endFrame)

      const response = await fetch('/api/runninghubAPI/AI-Kiss', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate video.')
      }

      const result = await response.json()
      if (result.data && result.data.taskId) {
        setTaskId(result.data.taskId)
        pollTaskStatus(result.data.taskId)
      } else {
        throw new Error('Failed to get task ID.')
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.')
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Image to Video Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Controls */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Start Frame</label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleStartFrameUpload}
                  className="hidden"
                  id="start-frame-upload"
                />
                <label htmlFor="start-frame-upload" className="cursor-pointer w-full">
                  {startFramePreview ? (
                    <img src={startFramePreview} alt="Start Frame" className="max-w-full h-48 object-contain mx-auto" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground mt-2">Click to upload</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Frame</label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEndFrameUpload}
                  className="hidden"
                  id="end-frame-upload"
                />
                <label htmlFor="end-frame-upload" className="cursor-pointer w-full">
                  {endFramePreview ? (
                    <img src={endFramePreview} alt="End Frame" className="max-w-full h-48 object-contain mx-auto" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground mt-2">Click to upload</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
            <Button onClick={handleGenerate} disabled={isProcessing || !startFrame || !endFrame} className="w-full">
              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Video className="mr-2 h-4 w-4" />}
              Generate Video
            </Button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          {/* Right Column: Result */}
          <div className="border-2 border-dashed rounded-lg p-4 h-full min-h-[440px] flex items-center justify-center">
            {isProcessing ? (
              <div className="flex flex-col items-center text-muted-foreground w-full max-w-sm">
                <Loader2 className="w-16 h-16 animate-spin" />
                <p className="mt-4">Generating your video...</p>
                <Progress value={progress} className="w-full mt-4" />
                <p className="text-sm mt-2">Estimated time: 10-15 minutes</p>
                <p className="text-xs text-muted-foreground mt-1">({progress}%)</p>
              </div>
            ) : generatedVideo ? (
              <div className="w-full">
                <h3 className="text-lg font-semibold mb-2 text-center">Generated Video:</h3>
                <video src={generatedVideo} controls className="w-full rounded-lg" />
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <Video className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">AI-Generated Result</h3>
                <p className="mt-2">Your generated video will appear here.</p>
                <p className="text-sm">Upload start and end frames to get started.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}