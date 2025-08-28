"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ToolLayout } from "@/components/tools/_base/tool-layout"
import { MobileProgress, FloatingProgress } from "@/components/tools/_base/mobile-progress"
import { MobileResultDisplay } from "@/components/tools/_base/mobile-result-display"
import { useAITool } from "@/hooks/use-ai-tool"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"

export default function TextToImageTool() {
  const { execute, isLoading, result, error, progress, reset, cancel } = useAITool('text-to-image');
  const [prompt, setPrompt] = React.useState('');

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    await execute({ prompt: prompt.trim() });
  };

  const handleDownload = () => {
    if (result?.imageUrl) {
      const link = document.createElement('a');
      link.href = result.imageUrl;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCopyUrl = () => {
    if (result?.imageUrl) {
      navigator.clipboard.writeText(result.imageUrl);
    }
  };

  const handleShare = async () => {
    if (result?.imageUrl && navigator.share) {
      try {
        await navigator.share({
          title: 'AI Generated Image',
          text: `Check out this AI-generated image: ${prompt}`,
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
        title="Text to Image Generator" 
        description="Transform your text descriptions into stunning AI-generated images"
      >
        <div className="space-y-4 sm:space-y-6">
          {/* Input Section */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Describe the image you want to create
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A beautiful sunset over a mountain lake with reflections in the water, photorealistic, high quality..."
              className="min-h-[80px] sm:min-h-[100px] resize-none text-sm sm:text-base"
              disabled={isLoading}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-muted-foreground">
                Be descriptive for better results
              </p>
              <p className="text-xs text-muted-foreground">
                {prompt.length}/500
              </p>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex gap-2">
            <Button 
              onClick={handleSubmit}
              disabled={isLoading || !prompt.trim()}
              className="flex-1 h-11 sm:h-12 text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Image'
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
            title="Generating your image..."
            description="This usually takes 10-30 seconds depending on complexity"
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
              onDownload={handleDownload}
              onCopyUrl={handleCopyUrl}
              onShare={handleShare}
              onReset={reset}
              showComparison={false}
              title="Generated Image"
            />
          )}

          {/* Tips Section */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-3 sm:p-4">
              <h4 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">
                💡 Tips for better results:
              </h4>
              <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
                <li>• Be specific about style, colors, and composition</li>
                <li>• Include quality keywords like "high quality", "detailed", "professional"</li>
                <li>• Mention the type of shot: "close-up", "wide angle", "portrait"</li>
                <li>• Add artistic styles: "photorealistic", "oil painting", "digital art"</li>
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