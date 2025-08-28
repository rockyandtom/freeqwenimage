"use client"

import Link from 'next/link';
import { ArrowLeft, ArrowRight, TrendingUp, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TOOLS_CONFIG, getToolById, getToolsByCategory } from '@/config/tools';
import { useToolStats } from '@/hooks/use-tool-stats';

interface ToolNavigationProps {
  currentTool: string;
  className?: string;
}

// 智能推荐算法
function getRecommendedTools(currentTool: string, toolStats?: Array<{id: string; totalUses: number}>): typeof TOOLS_CONFIG {
  const currentToolConfig = getToolById(currentTool);
  if (!currentToolConfig) return [];

  // 推荐逻辑：
  // 1. 工作流相关的工具（例如：文生图 -> 图生图 -> 图生视频）
  // 2. 同分类的其他工具
  // 3. 热门工具
  
  const sameCategory = getToolsByCategory(currentToolConfig.category)
    .filter(tool => tool.id !== currentTool && tool.status === 'active');
  
  const workflowRelated = getWorkflowRelatedTools(currentTool);
  
  // 使用真实统计数据排序热门工具
  const popularTools = TOOLS_CONFIG
    .filter(tool => tool.status === 'active' && tool.id !== currentTool)
    .sort((a, b) => {
      const aStats = toolStats?.find((s: {id: string; totalUses: number}) => s.id === a.id);
      const bStats = toolStats?.find((s: {id: string; totalUses: number}) => s.id === b.id);
      return (bStats?.totalUses || 0) - (aStats?.totalUses || 0);
    });

  // 合并并去重，优先级：工作流相关 > 同分类 > 热门
  const recommended = [
    ...workflowRelated,
    ...sameCategory,
    ...popularTools
  ].filter((tool, index, arr) => 
    arr.findIndex(t => t.id === tool.id) === index
  ).slice(0, 3);

  return recommended;
}

// 获取工作流相关的工具
function getWorkflowRelatedTools(currentTool: string): typeof TOOLS_CONFIG {
  const workflows: Record<string, string[]> = {
    'text-to-image': ['image-to-image', 'image-enhancer', 'image-to-video'],
    'image-enhancer': ['image-to-image', 'image-to-video', 'text-to-image'],
    'image-to-image': ['image-to-video', 'image-enhancer', 'text-to-image'],
    'image-to-video': ['image-to-image', 'image-enhancer', 'text-to-image']
  };

  const relatedIds = workflows[currentTool] || [];
  return relatedIds
    .map(id => getToolById(id))
    .filter(Boolean)
    .filter(tool => tool!.status === 'active') as typeof TOOLS_CONFIG;
}

export default function ToolNavigation({ currentTool, className = '' }: ToolNavigationProps) {
  const { stats, loading, getToolStats, formatUsageCount, trackUsage } = useToolStats();
  
  const currentIndex = TOOLS_CONFIG.findIndex(tool => tool.id === currentTool);
  const prevTool = currentIndex > 0 ? TOOLS_CONFIG[currentIndex - 1] : null;
  const nextTool = currentIndex < TOOLS_CONFIG.length - 1 ? TOOLS_CONFIG[currentIndex + 1] : null;
  
  // 获取智能推荐的工具
  const recommendedTools = getRecommendedTools(currentTool, stats?.tools);
  const currentToolConfig = getToolById(currentTool);

  // 处理工具点击事件，记录使用统计
  const handleToolClick = (toolId: string) => {
    trackUsage(toolId, 'navigate');
  };

  return (
    <section className={`py-16 bg-gradient-to-b from-background to-muted/20 ${className}`}>
      <div className="container">
        {/* 移动端优化的工具导航 */}
        <div className="mb-8 sm:mb-12">
          {/* 移动端：垂直布局 */}
          <div className="sm:hidden space-y-3">
            {/* 查看所有工具按钮 - 移动端置顶 */}
            <Button asChild variant="default" className="w-full h-12 bg-primary hover:bg-primary/90">
              <Link href="/ai-tools" className="flex items-center justify-center gap-2">
                <Star className="h-4 w-4" />
                View All Tools
              </Link>
            </Button>
            
            {/* 上一个/下一个工具 - 移动端并排 */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                {prevTool ? (
                  <Button asChild variant="outline" className="w-full h-16 p-3">
                    <Link href={prevTool.href} className="flex flex-col items-center gap-1">
                      <ArrowLeft className="h-4 w-4" />
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Previous</div>
                        <div className="text-xs font-medium truncate max-w-20">{prevTool.name}</div>
                      </div>
                    </Link>
                  </Button>
                ) : (
                  <div className="h-16"></div>
                )}
              </div>
              
              <div>
                {nextTool ? (
                  <Button asChild variant="outline" className="w-full h-16 p-3">
                    <Link href={nextTool.href} className="flex flex-col items-center gap-1">
                      <ArrowRight className="h-4 w-4" />
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Next</div>
                        <div className="text-xs font-medium truncate max-w-20">{nextTool.name}</div>
                      </div>
                    </Link>
                  </Button>
                ) : (
                  <div className="h-16"></div>
                )}
              </div>
            </div>
          </div>

          {/* 桌面端：原有布局 */}
          <div className="hidden sm:flex justify-between items-center gap-4">
            <div className="flex-1">
              {prevTool ? (
                <Button asChild variant="outline" className="flex items-center gap-3 h-auto p-4">
                  <Link href={prevTool.href}>
                    <ArrowLeft className="h-4 w-4 flex-shrink-0" />
                    <div className="text-left min-w-0">
                      <div className="text-xs text-muted-foreground">Previous Tool</div>
                      <div className="font-medium truncate">{prevTool.name}</div>
                    </div>
                  </Link>
                </Button>
              ) : (
                <div className="h-16"></div>
              )}
            </div>
            
            <div className="flex-shrink-0">
              <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
                <Link href="/ai-tools" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  View All Tools
                </Link>
              </Button>
            </div>
            
            <div className="flex-1 flex justify-end">
              {nextTool ? (
                <Button asChild variant="outline" className="flex items-center gap-3 h-auto p-4">
                  <Link href={nextTool.href}>
                    <div className="text-right min-w-0">
                      <div className="text-xs text-muted-foreground">Next Tool</div>
                      <div className="font-medium truncate">{nextTool.name}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 flex-shrink-0" />
                  </Link>
                </Button>
              ) : (
                <div className="h-16"></div>
              )}
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}