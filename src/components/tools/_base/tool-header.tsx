"use client"

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Info, History, Settings, Share2, MoreHorizontal } from 'lucide-react';
import { ToolConfig } from '@/config/tools';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ToolHeaderProps {
  tool: ToolConfig;
  onShowInfo?: () => void;
  onShowHistory?: () => void;
  onShowSettings?: () => void;
  onShare?: () => void;
  className?: string;
}

export function ToolHeader({ 
  tool, 
  onShowInfo, 
  onShowHistory, 
  onShowSettings, 
  onShare,
  className = '' 
}: ToolHeaderProps) {
  const hasActions = onShowInfo || onShowHistory || onShowSettings || onShare;

  return (
    <Card className={`mb-4 sm:mb-6 ${className}`}>
      <CardContent className="p-3 sm:p-4">
        {/* Mobile-first responsive layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Tool Info */}
          <div className="flex items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center space-x-2 text-xl sm:text-2xl flex-shrink-0">
              <span>{tool.icon.input}</span>
              <span className="text-muted-foreground">→</span>
              <span>{tool.icon.output}</span>
            </div>
            
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-base sm:text-lg truncate">{tool.name}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-1">
                {tool.description}
              </p>
            </div>
          </div>
          
          {/* Tool Status & Actions */}
          <div className="flex items-center justify-between sm:justify-end gap-2">
            {/* Status Badges */}
            <div className="flex gap-1 flex-wrap">
              {tool.status === 'beta' && (
                <Badge variant="secondary" className="text-xs">Beta</Badge>
              )}
              {tool.pricing === 'free' && (
                <Badge variant="outline" className="text-xs">Free</Badge>
              )}
              <Badge variant="outline" className="capitalize text-xs">
                {tool.category}
              </Badge>
            </div>
            
            {/* Action Buttons - Desktop */}
            {hasActions && (
              <>
                <div className="hidden sm:flex gap-1">
                  {onShowInfo && (
                    <Button variant="ghost" size="sm" onClick={onShowInfo}>
                      <Info className="h-4 w-4" />
                    </Button>
                  )}
                  {onShowHistory && (
                    <Button variant="ghost" size="sm" onClick={onShowHistory}>
                      <History className="h-4 w-4" />
                    </Button>
                  )}
                  {onShowSettings && (
                    <Button variant="ghost" size="sm" onClick={onShowSettings}>
                      <Settings className="h-4 w-4" />
                    </Button>
                  )}
                  {onShare && (
                    <Button variant="ghost" size="sm" onClick={onShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {/* Action Buttons - Mobile Dropdown */}
                <div className="sm:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onShowInfo && (
                        <DropdownMenuItem onClick={onShowInfo}>
                          <Info className="h-4 w-4 mr-2" />
                          Info
                        </DropdownMenuItem>
                      )}
                      {onShowHistory && (
                        <DropdownMenuItem onClick={onShowHistory}>
                          <History className="h-4 w-4 mr-2" />
                          History
                        </DropdownMenuItem>
                      )}
                      {onShowSettings && (
                        <DropdownMenuItem onClick={onShowSettings}>
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </DropdownMenuItem>
                      )}
                      {onShare && (
                        <DropdownMenuItem onClick={onShare}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Features */}
        <div className="flex flex-wrap gap-1 mt-3">
          {tool.features.map(feature => (
            <Badge key={feature} variant="outline" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}