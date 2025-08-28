"use client"

import * as React from "react"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Zap, 
  Image as ImageIcon, 
  Video, 
  Sparkles, 
  ArrowRight,
  TrendingUp
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TOOLS_CONFIG } from "@/config/tools"
import { cn } from "@/lib/utils"

interface MobileQuickActionsProps {
  className?: string;
  currentTool?: string;
}

// 快速操作配置
const quickActions = [
  {
    id: 'text-to-image',
    title: 'Generate Image',
    description: 'Create from text',
    icon: ImageIcon,
    color: 'bg-blue-500',
    href: '/ai-tools/image/text-to-image'
  },
  {
    id: 'image-enhancer',
    title: 'Enhance Photo',
    description: 'Improve quality',
    icon: Sparkles,
    color: 'bg-green-500',
    href: '/ai-tools/image/image-enhancer'
  },
  {
    id: 'image-to-image',
    title: 'Transform Style',
    description: 'Change appearance',
    icon: Zap,
    color: 'bg-purple-500',
    href: '/ai-tools/image/image-to-image'
  },
  {
    id: 'image-to-video',
    title: 'Animate Image',
    description: 'Create video',
    icon: Video,
    color: 'bg-orange-500',
    href: '/ai-tools/video/image-to-video'
  }
];

function MobileQuickActions({ className, currentTool }: MobileQuickActionsProps) {
  // 过滤掉当前工具
  const availableActions = quickActions.filter(action => action.id !== currentTool);

  return (
    <div className={cn("sm:hidden", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Quick Actions
        </h3>
        <p className="text-sm text-muted-foreground">
          Jump to popular AI tools
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {availableActions.slice(0, 4).map((action) => {
          const tool = TOOLS_CONFIG.find(t => t.id === action.id);
          const Icon = action.icon;
          
          return (
            <Card key={action.id} className="group hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <Link href={action.href} className="block">
                  <div className="flex flex-col items-center text-center space-y-2">
                    {/* 图标 */}
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-white",
                      action.color
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                    
                    {/* 标题和描述 */}
                    <div>
                      <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                        {action.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>

                    {/* 状态标识 */}
                    {tool && (
                      <div className="flex gap-1">
                        {tool.status === 'beta' && (
                          <Badge variant="secondary" className="text-xs">
                            Beta
                          </Badge>
                        )}
                        {tool.pricing === 'free' && (
                          <Badge variant="outline" className="text-xs">
                            Free
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 查看全部工具 */}
      <div className="mt-4">
        <Button asChild variant="outline" className="w-full">
          <Link href="/ai-tools" className="flex items-center justify-center gap-2">
            View All Tools
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

// 浮动快速操作按钮
export function FloatingQuickAction({ 
  toolId, 
  className 
}: { 
  toolId: string; 
  className?: string; 
}) {
  const action = quickActions.find(a => a.id === toolId);
  if (!action) return null;

  const Icon = action.icon;

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-40 sm:hidden",
      className
    )}>
      <Button asChild size="lg" className={cn(
        "w-14 h-14 rounded-full shadow-lg",
        action.color,
        "hover:scale-110 transition-transform"
      )}>
        <Link href={action.href}>
          <Icon className="h-6 w-6 text-white" />
        </Link>
      </Button>
    </div>
  );
}

export default MobileQuickActions;