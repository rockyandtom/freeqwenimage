"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Camera, X, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface MobileFileUploadProps {
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  selectedFile?: File | null;
  preview?: string | null;
  accept?: string;
  maxSize?: number; // in MB
  disabled?: boolean;
  className?: string;
  supportCamera?: boolean;
  placeholder?: string;
}

export function MobileFileUpload({
  onFileSelect,
  onRemove,
  selectedFile,
  preview,
  accept = "image/*",
  maxSize = 10,
  disabled = false,
  className,
  supportCamera = true,
  placeholder = "Upload your image"
}: MobileFileUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return false;
    }

    if (accept === "image/*" && !file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return false;
    }

    return true;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    if (disabled) return;
    
    const file = event.dataTransfer.files[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const openFileSelector = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const openCamera = () => {
    if (!disabled && supportCamera) {
      cameraInputRef.current?.click();
    }
  };

  // Check if device supports camera
  const isMobile = typeof window !== 'undefined' && 
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  if (preview && selectedFile) {
    return (
      <Card className={cn("relative", className)}>
        <CardContent className="p-3 sm:p-4">
          <div className="relative">
            <img
              src={preview}
              alt="Selected file"
              className="w-full max-h-48 sm:max-h-64 object-contain rounded-lg"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0"
              onClick={onRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 text-xs sm:text-sm text-muted-foreground">
            {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Desktop/Tablet drag and drop area */}
      <div
        className={cn(
          "border-2 border-dashed border-gray-300 rounded-lg transition-colors",
          "hover:border-gray-400 cursor-pointer",
          "p-6 sm:p-8 text-center",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={openFileSelector}
      >
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
            {supportCamera && isMobile && (
              <div className="text-gray-400">or</div>
            )}
            {supportCamera && isMobile && (
              <Camera className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
            )}
          </div>
          
          <div>
            <p className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
              {placeholder}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              {supportCamera && isMobile 
                ? `Tap to browse files or take a photo • Up to ${maxSize}MB`
                : `Drop your file here or click to browse • Up to ${maxSize}MB`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Mobile-specific action buttons */}
      {isMobile && (
        <div className="flex gap-2 mt-3 sm:hidden">
          <Button
            variant="outline"
            className="flex-1 h-12"
            onClick={openFileSelector}
            disabled={disabled}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Gallery
          </Button>
          {supportCamera && (
            <Button
              variant="outline"
              className="flex-1 h-12"
              onClick={openCamera}
              disabled={disabled}
            >
              <Camera className="h-4 w-4 mr-2" />
              Camera
            </Button>
          )}
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
      
      {supportCamera && (
        <input
          ref={cameraInputRef}
          type="file"
          accept={accept}
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
      )}
    </div>
  );
}