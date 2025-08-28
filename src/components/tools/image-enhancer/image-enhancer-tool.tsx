"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ToolLayout } from "@/components/tools/_base/tool-layout"
import { MobileFileUpload } from "@/components/tools/_base/mobile-file-upload"
import { MobileProgress, FloatingProgress } from "@/components/tools/_base/mobile-progress"
import { MobileResultDisplay } from "@/components/tools/_base/mobile-result-display"
import { useAITool } from "@/hooks/use-ai-tool"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"

export default function ImageEnhancerTool() {
  const { execute, isLoading, result, error, progress, reset, retry, cancel } = useAITool('image-enhancer');
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

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

    const formData = new FormData();
    formData.append('image', selectedImage);

    await execute(formData);
  };

  const handleDownload = () => {
    if (result?.imageUrl) {
      const link = document.createElement('a');
      link.href = result.imageUrl;
      link.download = `enhanced-image-${Date.now()}.png`;
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
          title: 'AI Enhanced Image',
          text: 'Check out this AI-enhanced image!',
          url: result.imageUrl
        });
      } catch (err) {
        handleCopyUrl();
      }
    } else {
      handleCopyUrl();
    }
  };

  return (
    <>
      <ToolLayout 
        title="AI Image Enhancer" 
        description="Enhance image quality with advanced AI technology - improve resolution, reduce noise, and optimize colors"
      >
        <div className="space-y-4 sm:space-y-6">
          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Image to Enhance
            </label>
            
            <MobileFileUpload
              onFileSelect={handleImageSelect}
              onRemove={removeImage}
              selectedFile={selectedImage}
              preview={imagePreview}
              disabled={isLoading}
              supportCamera={true}
              placeholder="Upload your image to enhance"
            />
          </div>

          {/* Enhance Button */}
          <div className="flex gap-2">
            <Button 
              onClick={handleSubmit}
              disabled={isLoading || !selectedImage}
              className="flex-1 h-11 sm:h-12 text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Enhancing...
                </>
              ) : (
                'Enhance Image'
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
            title="Enhancing your image..."
            description="This usually takes 15-30 seconds depending on image size"
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
              title="Enhanced Image"
            />
          )}

          {/* Tips Section */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-3 sm:p-4">
              <h4 className="font-medium text-green-900 mb-2 text-sm sm:text-base">
                💡 Tips for better enhancement:
              </h4>
              <ul className="text-xs sm:text-sm text-green-800 space-y-1">
                <li>• Use clear, well-lit images for best results</li>
                <li>• Higher resolution input images produce better enhancements</li>
                <li>• The AI works best with photos rather than graphics or text</li>
                <li>• Processing may take 15-30 seconds depending on image size</li>
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