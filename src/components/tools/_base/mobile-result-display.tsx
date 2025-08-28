"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Download, 
  Copy, 
  Share2, 
  MoreHorizontal, 
  ZoomIn, 
  ZoomOut,
  RotateCw,
  Maximize2,
  X
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

interface MobileResultDisplayProps {
  result: {
    imageUrl?: string;
    videoUrl?: string;
    type: 'image' | 'video';
  };
  originalPreview?: string | null;
  onDownload: () => void;
  onCopyUrl: () => void;
  onShare: () => void;
  onReset?: () => void;
  className?: string;
  showComparison?: boolean;
  title?: string;
}

export function MobileResultDisplay({
  result,
  originalPreview,
  onDownload,
  onCopyUrl,
  onShare,
  onReset,
  className,
  showComparison = true,
  title = "Result"
}: MobileResultDisplayProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);

  const resultUrl = result.imageUrl || result.videoUrl;
  if (!resultUrl) return null;

  const handleDownload = () => {
    onDownload();
    toast.success(`${result.type === 'video' ? 'Video' : 'Image'} downloaded!`);
  };

  const handleCopyUrl = () => {
    onCopyUrl();
    toast.success('URL copied to clipboard!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `AI Generated ${result.type === 'video' ? 'Video' : 'Image'}`,
          url: resultUrl
        });
      } catch (err) {
        // Fallback to copy URL
        onShare();
      }
    } else {
      onShare();
    }
  };

  const resetZoom = () => {
    setZoom(1);
    setRotation(0);
  };

  const MediaViewer = ({ inDialog = false }: { inDialog?: boolean }) => (
    <div className={cn(
      "relative group",
      inDialog && "max-h-[80vh] overflow-auto"
    )}>
      {result.type === 'video' ? (
        <video
          src={resultUrl}
          className={cn(
            "w-full rounded-lg shadow-lg",
            inDialog ? "max-h-full" : "max-h-64 sm:max-h-96"
          )}
          controls
          loop
          playsInline
          style={inDialog ? {
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transition: 'transform 0.2s ease'
          } : undefined}
        />
      ) : (
        <img
          src={resultUrl}
          alt="Generated result"
          className={cn(
            "w-full rounded-lg shadow-lg",
            inDialog ? "max-h-full object-contain" : "max-h-64 sm:max-h-96 object-contain"
          )}
          style={inDialog ? {
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transition: 'transform 0.2s ease'
          } : undefined}
        />
      )}
      
      {/* Overlay controls for non-dialog view */}
      {!inDialog && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/90 hover:bg-white h-8 w-8 p-0"
                >
                  <Maximize2 className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] max-h-[95vh] p-2">
                <div className="relative">
                  {/* Fullscreen controls */}
                  <div className="absolute top-2 right-2 z-10 flex gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setZoom(Math.min(zoom + 0.25, 3))}
                      className="bg-white/90 hover:bg-white h-8 w-8 p-0"
                    >
                      <ZoomIn className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setZoom(Math.max(zoom - 0.25, 0.5))}
                      className="bg-white/90 hover:bg-white h-8 w-8 p-0"
                    >
                      <ZoomOut className="h-3 w-3" />
                    </Button>
                    {result.type === 'image' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setRotation(rotation + 90)}
                        className="bg-white/90 hover:bg-white h-8 w-8 p-0"
                      >
                        <RotateCw className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={resetZoom}
                      className="bg-white/90 hover:bg-white"
                    >
                      Reset
                    </Button>
                  </div>
                  
                  <MediaViewer inDialog />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Badge variant="outline" className="text-xs">
          {result.type === 'video' ? 'Video' : 'Image'}
        </Badge>
      </div>
      
      {/* Comparison view for mobile */}
      {showComparison && originalPreview ? (
        <div className="space-y-4">
          {/* Mobile: Stacked comparison */}
          <div className="sm:hidden space-y-3">
            <div>
              <Badge variant="outline" className="mb-2 text-xs">Original</Badge>
              <img
                src={originalPreview}
                alt="Original"
                className="w-full max-h-48 object-contain rounded-lg shadow-lg"
              />
            </div>
            <div>
              <Badge variant="outline" className="mb-2 text-xs">Result</Badge>
              <MediaViewer />
            </div>
          </div>
          
          {/* Desktop: Side by side comparison */}
          <div className="hidden sm:grid sm:grid-cols-2 gap-4">
            <div>
              <Badge variant="outline" className="mb-2 text-xs">Original</Badge>
              <img
                src={originalPreview}
                alt="Original"
                className="w-full max-h-96 object-contain rounded-lg shadow-lg"
              />
            </div>
            <div>
              <Badge variant="outline" className="mb-2 text-xs">Result</Badge>
              <MediaViewer />
            </div>
          </div>
        </div>
      ) : (
        <MediaViewer />
      )}

      {/* Action buttons */}
      <div className="space-y-3">
        {/* Primary actions - always visible */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <Button onClick={handleDownload} variant="outline" className="h-11">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button onClick={handleShare} variant="outline" className="h-11">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button onClick={handleCopyUrl} variant="outline" className="h-11 hidden sm:flex">
            <Copy className="h-4 w-4 mr-2" />
            Copy URL
          </Button>
        </div>

        {/* Secondary actions */}
        <div className="flex gap-2">
          {onReset && (
            <Button 
              onClick={onReset}
              variant="outline" 
              className="flex-1 h-11"
            >
              Generate Another
            </Button>
          )}
          
          {/* Mobile: More actions dropdown */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-11 px-3">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCopyUrl}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy URL
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsFullscreen(true)}>
                  <Maximize2 className="h-4 w-4 mr-2" />
                  View Fullscreen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile-specific tips */}
      <Card className="bg-green-50 border-green-200 sm:hidden">
        <CardContent className="p-3">
          <div className="text-xs text-green-800 space-y-1">
            <p>💡 <strong>Tip:</strong> Tap and hold the image to save to your device</p>
            <p>📱 Use the share button to send via messaging apps</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}