"use client"

import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info, History, Settings } from 'lucide-react';
import { ToolConfig } from '@/config/tools';

interface ToolLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
  tool?: ToolConfig;
  showHeader?: boolean;
  showBadges?: boolean;
  actions?: ReactNode;
}

export function ToolLayout({ 
  title, 
  description, 
  children, 
  className = '',
  tool,
  showHeader = true,
  showBadges = true,
  actions
}: ToolLayoutProps) {
  return (
    <div className={`w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      <Card className="border-0 shadow-lg">
        {showHeader && (
          <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
            {/* Mobile-optimized header layout */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                {tool && (
                  <div className="flex items-center space-x-2 text-xl sm:text-2xl">
                    <span>{tool.icon.input}</span>
                    <span className="text-muted-foreground">→</span>
                    <span>{tool.icon.output}</span>
                  </div>
                )}
              </div>
              
              {showBadges && tool && (
                <div className="flex gap-1 sm:gap-2 justify-center sm:justify-end flex-wrap">
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
              )}
            </div>
            
            <CardTitle className="text-xl sm:text-2xl font-bold mb-2 px-2 sm:px-0">{title}</CardTitle>
            <p className="text-muted-foreground text-sm sm:text-base px-2 sm:px-0 leading-relaxed">{description}</p>
            
            {tool && (
              <div className="flex flex-wrap gap-1 mt-3 sm:mt-4 justify-center">
                {tool.features.slice(0, 4).map(feature => (
                  <Badge key={feature} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            )}
            
            {actions && (
              <div className="flex gap-2 mt-3 sm:mt-4 justify-center flex-wrap">
                {actions}
              </div>
            )}
          </CardHeader>
        )}
        
        <CardContent className="p-4 sm:p-6 pt-0">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}