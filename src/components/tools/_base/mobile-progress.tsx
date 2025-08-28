"use client"

import * as React from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileProgressProps {
  progress: number;
  isLoading: boolean;
  title?: string;
  description?: string;
  onCancel?: () => void;
  showCancel?: boolean;
  className?: string;
  variant?: 'default' | 'compact';
}

export function MobileProgress({
  progress,
  isLoading,
  title = "Processing...",
  description,
  onCancel,
  showCancel = true,
  className,
  variant = 'default'
}: MobileProgressProps) {
  if (!isLoading) return null;

  if (variant === 'compact') {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            {title}
          </span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="w-full h-2" />
        {description && (
          <p className="text-xs text-muted-foreground text-center">
            {description}
          </p>
        )}
      </div>
    );
  }

  return (
    <Card className={cn("border-blue-200 bg-blue-50", className)}>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {/* Header with cancel button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
              <h3 className="font-medium text-blue-900">{title}</h3>
            </div>
            {showCancel && onCancel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-blue-800">
              <span>Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress 
              value={progress} 
              className="w-full h-3 bg-blue-100" 
            />
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-blue-700 text-center leading-relaxed">
              {description}
            </p>
          )}

          {/* Mobile-specific tips */}
          <div className="sm:hidden">
            <div className="text-xs text-blue-600 bg-blue-100 rounded-lg p-3 space-y-1">
              <p>💡 <strong>Tip:</strong> Keep this tab active for best performance</p>
              <p>📱 You can minimize the app but don't close the tab</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Floating progress indicator for mobile
export function FloatingProgress({
  progress,
  isLoading,
  onCancel,
  className
}: {
  progress: number;
  isLoading: boolean;
  onCancel?: () => void;
  className?: string;
}) {
  if (!isLoading) return null;

  return (
    <div className={cn(
      "fixed bottom-4 left-4 right-4 z-50 sm:hidden",
      "bg-white border border-gray-200 rounded-lg shadow-lg p-3",
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
          <span className="text-sm font-medium">Processing...</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{progress}%</span>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel} className="h-6 w-6 p-0">
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      <Progress value={progress} className="w-full h-2" />
    </div>
  );
}