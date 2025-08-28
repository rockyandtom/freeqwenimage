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
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const animationStyles = [
  { id: 'subtle', name: 'Subtle Motion', description: 'Gentle, natural movement' },
  { id: 'dynamic', name: 'Dynamic Action', description: 'Energetic, dramatic motion' },
  { id: 'cinematic', name: 'Cinematic', description: 'Movie-like camera movements' },
  { id: 'parallax', name: 'Parallax', description: 'Depth-based layered motion' },
  { id: 'morphing', name: 'Morphing', description: 'Shape transformations' },
  { id: 'zoom', name: 'Zoom Effect', description: 'Zoom in/out movements' },
  { id: 'pan', name: 'Pan Motion', description: 'Horizontal/vertical panning' },
  { id: 'rotate', name: 'Rotation', description: 'Rotating camera effects' }
];

const videoDurations = [
  { id: '2', name: '2 seconds', description: 'Quick animation' },
  { id: '4', name: '4 seconds', description: 'Standard duration' },
  { id: '6', name: '6 seconds', description: 'Extended animation' },
  { id: '8', name: '8 seconds', description: 'Long form content' }
];

export default function ImageToVideoTool() {
  const { execute, isLoading, result, error, progress, reset, retry, cancel } = useAITool('image-to-video');
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = React.useState('dynamic');
  const [duration, setDuration] = React.useState('4');
  const [motionStrength, setMotionStrength] = React.useState([0.7]);
  const [customPrompt, setCustomPrompt] = React.useState('');
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false);

  const videoRef = React.useRef<HTMLVideoElement>(null);

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
    formData.append('style', selectedStyle);
    formData.append('duration', duration);
    formData.append('motionStrength', motionStrength[0].toString());
    if (customPrompt.trim()) {
      formData.append('prompt', customPrompt.trim());
    }

    await execute(formData);
  };

  const handleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const handleDownload = () => {
    if (result?.videoUrl) {
      const link = document.createElement('a');
      link.href = result.videoUrl;
      link.download = `animated-video-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCopyUrl = () => {
    if (result?.videoUrl) {
      navigator.clipboard.writeText(result.videoUrl);
    }
  };

  const handleShare = async () => {
    if (result?.videoUrl && navigator.share) {
      try {
        await navigator.share({
          title: 'AI Generated Video',
          text: 'Check out this AI-generated video animation!',
          url: result.videoUrl
        });
      } catch (err) {
        handleCopyUrl();
      }
    } else {
      handleCopyUrl();
    }
  };

  const selectedStyleInfo = animationStyles.find(style => style.id === selectedStyle);
  const selectedDurationInfo = videoDurations.find(dur => dur.id === duration);

  return (
    <>
      <ToolLayout 
        title="Image to Video Generator" 
        description="Transform static images into dynamic videos with AI-powered animation"
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
              placeholder="Upload your image to animate"
            />
          </div>

        {/* Animation Style */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Animation Style
          </label>
          <Select value={selectedStyle} onValueChange={setSelectedStyle} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {animationStyles.map(style => (
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

        {/* Video Duration */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Video Duration
          </label>
          <Select value={duration} onValueChange={setDuration} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {videoDurations.map(dur => (
                <SelectItem key={dur.id} value={dur.id}>
                  <div>
                    <div className="font-medium">{dur.name}</div>
                    <div className="text-xs text-muted-foreground">{dur.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedDurationInfo && (
            <p className="text-xs text-muted-foreground mt-1">
              {selectedDurationInfo.description}
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
                    Motion Strength: {motionStrength[0]}
                  </label>
                  <Slider
                    value={motionStrength}
                    onValueChange={setMotionStrength}
                    max={1}
                    min={0.1}
                    step={0.1}
                    className="w-full"
                    disabled={isLoading}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Subtle (0.1)</span>
                    <span>Dramatic (1.0)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Custom Animation Prompt (Optional)
                  </label>
                  <Textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Describe specific motion you want... e.g., 'gentle swaying motion', 'camera slowly zooming in', 'elements floating upward'"
                    className="min-h-[60px] sm:min-h-[80px] resize-none text-sm sm:text-base"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Override the style preset with custom motion description
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

          {/* Generate Button */}
          <div className="flex gap-2">
            <Button 
              onClick={handleSubmit}
              disabled={isLoading || !selectedImage}
              className="flex-1 h-11 sm:h-12 text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating Video...
                </>
              ) : (
                'Generate Video'
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
            title="Creating your video animation..."
            description="Video generation may take 30-60 seconds depending on complexity"
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
          {result?.videoUrl && (
            <MobileResultDisplay
              result={{ videoUrl: result.videoUrl, type: 'video' }}
              originalPreview={imagePreview}
              onDownload={handleDownload}
              onCopyUrl={handleCopyUrl}
              onShare={handleShare}
              onReset={reset}
              showComparison={true}
              title="Generated Video"
            />
          )}

          {/* Tips Section */}
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-3 sm:p-4">
              <h4 className="font-medium text-purple-900 mb-2 text-sm sm:text-base">
                💡 Tips for better video results:
              </h4>
              <ul className="text-xs sm:text-sm text-purple-800 space-y-1">
                <li>• Use high-quality, well-lit images for best animation results</li>
                <li>• Images with clear subjects work better than busy, cluttered scenes</li>
                <li>• Try different animation styles to find the perfect motion for your image</li>
                <li>• Lower motion strength for subtle effects, higher for dramatic animations</li>
                <li>• Custom prompts can create unique motion effects beyond preset styles</li>
                <li>• Portrait and landscape orientations both work well</li>
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