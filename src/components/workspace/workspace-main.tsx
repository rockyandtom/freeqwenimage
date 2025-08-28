"use client"

import { Suspense, lazy } from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ToolConfig } from '@/config/tools';
import { getApplicationById } from '@/config/applications';
import AppSelector from './app-selector';

interface WorkspaceMainProps {
  selectedTool: string;
  selectedApp?: string | null;
  currentTool?: ToolConfig;
  onAppSelect: (appId: string | null) => void;
}

// 动态导入工具组件
const getToolComponent = (toolId: string) => {
  switch (toolId) {
    case 'text-to-image':
      return lazy(() => import('@/components/tools/text-to-image/text-to-image-tool'));
    case 'image-to-image':
      return lazy(() => import('@/components/tools/image-to-image/image-to-image-tool'));
    case 'image-enhancer':
      return lazy(() => import('@/components/tools/image-enhancer/image-enhancer-tool'));
    case 'image-to-video':
      return lazy(() => import('@/components/tools/image-to-video/image-to-video-tool'));
    default:
      return lazy(() => import('@/components/tools/text-to-image/text-to-image-tool'));
  }
};

// 动态导入应用组件
const getAppComponent = (appId: string) => {
  switch (appId) {
    case 'ai-effects':
      return lazy(() => import('./applications/ai-effects-app'));
    case 'image-enhancer-app':
      return lazy(() => import('./applications/image-enhancer-app'));
    case 'qwen-edit':
      return lazy(() => import('./applications/qwen-edit-app'));
    case 'image-editor':
      return lazy(() => import('./applications/image-editor-app'));
    default:
      return null;
  }
};

// 加载中组件
const ToolLoadingSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-8 w-64" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-64 w-full" />
  </div>
);

export default function WorkspaceMain({
  selectedTool,
  selectedApp,
  currentTool,
  onAppSelect
}: WorkspaceMainProps) {
  const ToolComponent = getToolComponent(selectedTool);
  const AppComponent = selectedApp ? getAppComponent(selectedApp) : null;
  const currentApp = selectedApp ? getApplicationById(selectedApp) : null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 顶部工具信息栏 */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {currentTool && (
              <>
                <div className="flex items-center gap-2 text-2xl">
                  <span>{currentTool.icon.input}</span>
                  <span className="text-gray-400">→</span>
                  <span>{currentTool.icon.output}</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {currentTool.name}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {currentTool.description}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentTool?.status === 'beta' && (
              <Badge variant="secondary">Beta</Badge>
            )}
            {currentTool?.status === 'coming-soon' && (
              <Badge variant="outline">即将推出</Badge>
            )}
            <Badge variant="outline" className="capitalize">
              {currentTool?.category}
            </Badge>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 应用选择器 */}
        <AppSelector
          currentTool={currentTool}
          selectedApp={selectedApp}
          onAppSelect={onAppSelect}
        />

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {selectedApp && AppComponent ? (
              // 显示选中的应用
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-lg">{currentApp?.icon}</span>
                  <h2 className="text-xl font-bold text-gray-900">
                    {currentApp?.name}
                  </h2>
                  {currentApp?.status === 'beta' && (
                    <Badge variant="secondary">Beta</Badge>
                  )}
                </div>
                <Suspense fallback={<ToolLoadingSkeleton />}>
                  <AppComponent />
                </Suspense>
              </div>
            ) : (
              // 显示基础工具
              <Suspense fallback={<ToolLoadingSkeleton />}>
                <ToolComponent />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}