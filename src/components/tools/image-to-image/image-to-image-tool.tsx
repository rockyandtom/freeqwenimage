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
  { id: 'cyberpunk', name: 'Cyberpunk', description: 'Futuristic cyberpunk aesthetic' }
];

export default function ImageToImageTool() {
  const { execute, isLoading, result, error, progress, reset, retry, cancel } = useAITool('image-to-image');
  const [prompt, setPrompt] = React.useState('');
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = React.useState('photorealistic');
  const [strength, setStrength] = React.useState([0.7]);
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      toast.error('Please select an image');
      return;
    }

    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('prompt', prompt.trim());
    formData.append('style', selectedStyle);
    formData.append('strength', strength[0].toString());

    await execute(formData);
  };

  const handleDownload = () => {
    if (result?.imageUrl) {
      const link = document.createElement('a');
      link.href = result.imageUrl;
      link.download = `transformed-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Image downloaded!');
    }
  };

  const handleCopyUrl = () => {
    if (result?.imageUrl) {
      navigator.clipboard.writeText(result.imageUrl);
      toast.success('Image URL copied to clipboard!');
    }
  };

  const handleShare = async () => {
    if (result?.imageUrl && navigator.share) {
      try {
        await navigator.share({
          title: 'AI Transformed Image',
          text: `Check out this AI-transformed image: ${prompt}`,
          url: result.imageUrl
        });
      } catch (err) {
        handleCopyUrl();
      }
    } else {
      handleCopyUrl();
    }
  };

  const selectedStyleInfo = stylePresets.find(style => style.id === selectedStyle);

  return (
    <>
      <ToolLayout 
        title="Image to Image Transformer" 
        description="Transform your images with AI using text prompts and style controls"
      >
        <div className="space-y-4 sm:space-y-6">
        {/* Image Upload Section */}
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
            placeholder="Upload your image to transform"
          />
        </div>

        {/* Prompt Section */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Transformation Prompt
          </label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe how you want to transform the image... e.g., 'turn this into a watercolor painting', 'make it look like a cyberpunk scene', 'convert to anime style'"
            className="min-h-[80px] sm:min-h-[100px] resize-none text-sm sm:text-base"
            disabled={isLoading}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-muted-foreground">
              Be specific about the style and changes you want
            </p>
            <p className="text-xs text-muted-foreground">
              {prompt.length}/500
            </p>
          </div>
        </div>

        {/* Style Preset */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Style Preset
          </label>
          <Select value={selectedStyle} onValueChange={setSelectedStyle} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stylePresets.map(style => (
                <SelectItem key={style.id} value={style.id}>
                  <div>
                    <div className="font-medium">{style.name}</div>
                    <div className="text-xs text-muted-foreground">{style.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedStyleInfo && (
            <p className="text-xs text-muted-foreground mt-1">
              {selectedStyleInfo.description}
            </p>
          )}
        </div>

        {/* Advanced Settings */}
        <div>
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
                    Transformation Strength: {strength[0]}
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

        {/* Generate Button */}
        <div className="flex gap-2">
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !selectedImage || !prompt.trim()}
            className="flex-1 h-11 sm:h-12 text-sm sm:text-base"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Transforming...
              </>
            ) : (
              'Transform Image'
            )}
          </Button>
          
          {isLoading && cancel && (
            <Button variant="outline" onClick={cancel} className="h-11 sm:h-12">
              Cancel
            </Button>
          )}
        </div>

        {/* Progress Display */}
        <MobileProgress
          progress={progress}
          isLoading={isLoading}
          title="Transforming your image..."
          description="This usually takes 15-45 seconds depending on complexity and style"
          onCancel={cancel}
          showCancel={!!cancel}
        />

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600 text-sm">{error}</p>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" onClick={() => handleSubmit()}>
                  Try Again
                </Button>
                <Button variant="outline" size="sm" onClick={reset}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Result Display */}
        {result?.imageUrl && (
          <MobileResultDisplay
            result={{ imageUrl: result.imageUrl, type: 'image' }}
            originalPreview={imagePreview}
            onDownload={handleDownload}
            onCopyUrl={handleCopyUrl}
            onShare={handleShare}
            onReset={reset}
            showComparison={true}
            title="Transformed Image"
          />
        )}

        {/* Tips Section */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 Tips for better transformations:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use clear, high-quality images for best results</li>
              <li>• Be specific about the style you want: "watercolor painting", "cyberpunk style"</li>
              <li>• Adjust transformation strength: lower for subtle changes, higher for dramatic effects</li>
              <li>• Try different style presets to find the perfect look</li>
              <li>• Combine style presets with custom prompts for unique results</li>
            </ul>
          </CardContent>
        </Card>
        </div>
      </ToolLayout>

      {/* Floating progress for mobile */}
      <FloatingProgress
        progress={progress}
        isLoading={isLoading}
        onCancel={cancel}
      />
    </>
  );
}