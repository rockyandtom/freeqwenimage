"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner";

export default function AiImageEnhancer() {
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [generatedImage, setGeneratedImage] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = React.useState<File | null>(null)
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)

  const handleClear = () => {
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

  const handleGenerate = async () => {
    if (!uploadedImage) {
      toast.error("Please upload an image");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const formData = new FormData();
      formData.append('file', uploadedImage);

      const response = await fetch('/api/runninghubAPI/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to start enhancement task');
      }

      if (result.success && result.taskId) {
        toast.info("Enhancement process started");
        pollTaskStatus(result.taskId);
      } else {
        throw new Error(result.error || 'Failed to get task ID');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      setIsGenerating(false);
    }
  };

  const pollTaskStatus = (taskId: string) => {
    const intervalId = setInterval(async () => {
      try {
        const statusResponse = await fetch("/api/runninghubAPI/status", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ taskId }),
        });

        const statusResult = await statusResponse.json();

        if (statusResult.success) {
          const { status, resultUrl } = statusResult.data;
          if (status === 'completed') {
            setGeneratedImage(resultUrl);
            setIsGenerating(false);
            clearInterval(intervalId);
            toast.success("Image enhancement successful!");
          } else if (status === 'failed') {
            setError(statusResult.error || 'Enhancement task failed');
            setIsGenerating(false);
            clearInterval(intervalId);
          }
          // if status is running or pending, do nothing and let it poll again
        } else {
          setError(statusResult.error || 'Failed to get task status');
          setIsGenerating(false);
          clearInterval(intervalId);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown polling error');
        setIsGenerating(false);
        clearInterval(intervalId);
      }
    }, 3000); // poll every 3 seconds
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Upload Image
          </label>
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
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="outline"
          onClick={handleClear}
          className="flex-1 sm:flex-none"
        >
          Clear
        </Button>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !uploadedImage}
          className="flex-1 sm:flex-none bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isGenerating ? "Enhancing..." : "Enhance Image"}
        </Button>
      </div>

      {isGenerating && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            Enhancing your image...
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Enhancement Error</span>
          </div>
          <p className="mt-2 text-red-600 text-sm">{error}</p>
        </div>
      )}

      {generatedImage && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
            Enhanced Image
          </h3>
          <div className="flex justify-center">
            <div className="relative max-w-2xl w-full">
              <img
                src={generatedImage}
                alt="Enhanced Qwen Image"
                className="w-full h-auto rounded-lg shadow-lg"
                onError={(e) => {
                  setError('Failed to load enhanced image')
                  setGeneratedImage(null)
                }}
              />
              <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    const link = document.createElement('a')
                    link.href = generatedImage
                    link.download = `enhanced-qwen-image-${Date.now()}.png`
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
                    toast.success('Image URL copied to clipboard!')
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