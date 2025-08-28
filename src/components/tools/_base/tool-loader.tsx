'use client';

import { Suspense, lazy, ComponentType } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import PerformanceMonitor from '@/components/performance/performance-monitor';
import { PerformanceCollector } from '@/lib/performance-collector';

// 工具组件映射
const toolComponents = {
  'text-to-image': lazy(() => import('@/components/tools/text-to-image/text-to-image-tool')),
  'image-to-image': lazy(() => import('@/components/tools/image-to-image/image-to-image-tool')),
  'image-enhancer': lazy(() => import('@/components/tools/image-enhancer/image-enhancer-tool')),
  'image-to-video': lazy(() => import('@/components/tools/image-to-video/image-to-video-tool')),
};

type ToolId = keyof typeof toolComponents;

interface ToolLoaderProps {
  toolId: ToolId;
  className?: string;
}

// 加载状态组件
function ToolLoadingSkeleton() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6 space-y-6">
        {/* 工具标题骨架 */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        {/* 输入区域骨架 */}
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        
        {/* 结果区域骨架 */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="aspect-square w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 错误边界组件
function ToolErrorFallback({ toolId }: { toolId: string }) {
  return (
    <Card className="w-full max-w-4xl mx-auto border-destructive">
      <CardContent className="p-6 text-center">
        <div className="space-y-4">
          <div className="text-destructive">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">工具加载失败</h3>
          <p className="text-muted-foreground">
            无法加载 {toolId} 工具组件。请刷新页面重试。
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            重新加载
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ToolLoader({ toolId, className }: ToolLoaderProps) {
  const ToolComponent = toolComponents[toolId];

  if (!ToolComponent) {
    return <ToolErrorFallback toolId={toolId} />;
  }

  const handleMetrics = (metrics: any) => {
    const collector = PerformanceCollector.getInstance();
    collector.addMetrics(`tool-${toolId}`, metrics);
  };

  return (
    <div className={className}>
      <PerformanceMonitor componentName={`tool-${toolId}`} onMetrics={handleMetrics}>
        <Suspense fallback={<ToolLoadingSkeleton />}>
          <ToolComponent />
        </Suspense>
      </PerformanceMonitor>
    </div>
  );
}

// 导出工具ID类型供其他组件使用
export type { ToolId };