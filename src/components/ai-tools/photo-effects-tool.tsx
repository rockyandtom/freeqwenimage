"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ToolLayout } from "@/components/tools/_base/tool-layout"
import { MobileFileUpload } from "@/components/tools/_base/mobile-file-upload"
import { MobileProgress, FloatingProgress } from "@/components/tools/_base/mobile-progress"
import { MobileResultDisplay } from "@/components/tools/_base/mobile-result-display"
import { useAITool } from "@/hooks/use-ai-tool"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const stylePresets = [
  { id: 'photorealistic', name: 'Photorealistic', description: 'Natural, photo-like results' },
  { id: 'artistic', name: 'Artistic', description: 'Painterly, artistic style' },
  { id: 'anime', name: 'Anime', description: 'Japanese animation style' },
  { id: 'digital-art', name: 'Digital Art', description: 'Modern digital artwork' },
  { id: 'oil-painting', name: 'Oil Painting', description: 'Classic oil painting style' },
  { id: 'watercolor', name: 'Watercolor', description: 'Soft watercolor effect' },
  { id: 'sketch', name: 'Sketch', description: 'Hand-drawn sketch style' },
]

export function PhotoEffectsTool() {
  const [prompt, setPrompt] = React.useState("")
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null)
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = React.useState(stylePresets[0].id)
  const [strength, setStrength] = React.useState([0.6])
  const [showAdvanced, setShowAdvanced] = React.useState(false)

  const { result, isLoading, progress, execute, reset, error } = useAITool("photo-effects", {
    onSuccess: (data) => {
      toast.success("Image generated successfully!")
    },
    onError: (error) => {
      toast.error(error)
    }
  })

  const handleImageSelect = (file: File) => {
    setSelectedImage(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleSubmit = async () => {
    if (!selectedImage || !prompt.trim()) {
      toast.warning("Please upload an image and enter a prompt.")
      return
    }

    const formData = new FormData()
    formData.append("image", selectedImage)
    formData.append("prompt", prompt)
    formData.append("style", selectedStyle)
    formData.append("strength", String(strength[0]))
    
    execute(formData)
  }

  const handleReset = () => {
    reset()
    setPrompt("")
    removeImage()
  }

  return (
    <>
             <ToolLayout 
         title="Photo Effects" 
         description="Apply stunning artistic effects to your photos with AI."
       >
        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Image
            </label>
            <MobileFileUpload
              onFileSelect={handleImageSelect}
              onRemove={removeImage}
              selectedFile={selectedImage}
              preview={imagePreview}
              disabled={isLoading}
              supportCamera={true}
              placeholder="Upload an image to apply effects"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Describe the effect you want
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'A vibrant, colorful painting in the style of Van Gogh'"
              className="h-24"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Style Preset
            </label>
            <div className="flex flex-wrap gap-2">
              {stylePresets.map((preset) => (
                <Badge
                  key={preset.id}
                  variant={selectedStyle === preset.id ? "default" : "outline"}
                  onClick={() => !isLoading && setSelectedStyle(preset.id)}
                  className="cursor-pointer"
                >
                  {preset.name}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="mb-3"
          >
            Advanced Settings {showAdvanced ? '▼' : '▶'}
          </Button>
          
          {showAdvanced && (
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Effect Strength: {strength[0]}
                  </label>
                  <Slider
                    value={strength}
                    onValueChange={setStrength}
                    max={1}
                    min={0.1}
                    step={0.1}
                    className="w-full"
                    disabled={isLoading}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Subtle (0.1)</span>
                    <span>Strong (1.0)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !selectedImage || !prompt.trim()}
            className="flex-1 h-11 sm:h-12 text-sm sm:text-base"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Applying Effect...
              </>
            ) : (
              'Apply Effect'
            )}
          </Button>
        </div>
      </ToolLayout>

             {isLoading && <FloatingProgress progress={progress} isLoading={isLoading} />}
      
             {result && result.images && result.images.length > 0 && (
         <MobileResultDisplay
           result={{
             imageUrl: result.images[0].url,
             type: 'image'
           }}
           onDownload={() => {
             const link = document.createElement('a')
             link.href = result.images[0].url
             link.download = 'photo-effect.png'
             document.body.appendChild(link)
             link.click()
             document.body.removeChild(link)
           }}
           onCopyUrl={() => {
             navigator.clipboard.writeText(result.images[0].url)
           }}
           onShare={() => {
             if (navigator.share) {
               navigator.share({
                 title: 'AI Generated Photo Effect',
                 url: result.images[0].url
               })
             }
           }}
           onReset={reset}
         />
       )}
    </>
  )
}

export default PhotoEffectsTool;