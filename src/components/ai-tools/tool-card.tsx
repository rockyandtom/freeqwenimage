"use client"

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ToolConfig } from '@/config/tools';

interface ToolCardProps {
  tool: ToolConfig;
  className?: string;
  showCategory?: boolean;
}

export default function ToolCard({ tool, className = '', showCategory = false }: ToolCardProps) {
  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 sm:hover:-translate-y-1 border-0 shadow-lg ${className}`}>
      <CardContent className="p-4 sm:p-6">
        {/* 移动端优化的工具状态标识 */}
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <div className="flex items-center space-x-1 sm:space-x-2 text-lg sm:text-2xl">
            <span>{tool.icon.input}</span>
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span>{tool.icon.output}</span>
          </div>
          <div className="flex flex-wrap gap-1 max-w-20 sm:max-w-none">
            {showCategory && (
              <Badge variant="secondary" className="text-xs capitalize">
                <span className="hidden sm:inline">{tool.category}</span>
                <span className="sm:hidden">{tool.category.charAt(0).toUpperCase()}</span>
              </Badge>
            )}
            {tool.status === 'beta' && <Badge variant="secondary" className="text-xs">Beta</Badge>}
            {tool.pricing === 'free' && <Badge variant="outline" className="text-xs">Free</Badge>}
          </div>
        </div>
        
        {/* 工具信息 */}
        <h3 className="text-base sm:text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {tool.name}
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
        
        {/* 功能特性 - 移动端显示更少 */}
        <div className="flex flex-wrap gap-1 mb-4 sm:mb-6">
          {/* 移动端只显示2个特性 */}
          {tool.features.slice(0, 2).map(feature => (
            <Badge key={feature} variant="outline" className="text-xs">
              {feature}
            </Badge>
          ))}
          {/* 桌面端显示3个特性 */}
          <div className="hidden sm:contents">
            {tool.features.slice(2, 3).map(feature => (
              <Badge key={feature} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
          {tool.features.length > 2 && (
            <Badge variant="outline" className="text-xs sm:hidden">
              +{tool.features.length - 2}
            </Badge>
          )}
          {tool.features.length > 3 && (
            <Badge variant="outline" className="text-xs hidden sm:inline-flex">
              +{tool.features.length - 3}
            </Badge>
          )}
        </div>
        
        {/* 操作按钮 */}
        <Button asChild className="w-full h-10 sm:h-auto group-hover:bg-primary/90 transition-colors text-sm sm:text-base">
          <Link href={tool.href}>
            <span className="hidden sm:inline">Try {tool.name}</span>
            <span className="sm:hidden">Try Now</span>
            <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}