"use client"

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import WorkspaceSidebar from './workspace-sidebar';
import WorkspaceMain from './workspace-main';
import { TOOLS_CONFIG } from '@/config/tools';

export default function WorkspaceLayout() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // 从URL获取当前选中的工具和应用
  const [selectedTool, setSelectedTool] = useState(
    searchParams.get('tool') || 'text-to-image'
  );
  const [selectedApp, setSelectedApp] = useState(
    searchParams.get('app') || null
  );

  // 更新URL参数
  const updateURL = (tool: string, app: string | null = null) => {
    const params = new URLSearchParams();
    params.set('tool', tool);
    if (app) {
      params.set('app', app);
    }
    router.push(`/ai-tools?${params.toString()}`);
  };

  // 处理工具切换
  const handleToolChange = (toolId: string) => {
    setSelectedTool(toolId);
    setSelectedApp(null); // 切换工具时清除应用选择
    updateURL(toolId, null);
  };

  // 处理应用选择
  const handleAppSelect = (appId: string | null) => {
    setSelectedApp(appId);
    updateURL(selectedTool, appId);
  };

  // 获取当前工具配置
  const currentTool = TOOLS_CONFIG.find(tool => tool.id === selectedTool);

  return (
    <div className="h-screen flex bg-gray-50">
      {/* 左侧导航栏 */}
      <WorkspaceSidebar
        selectedTool={selectedTool}
        onToolChange={handleToolChange}
      />
      
      {/* 主工作区 */}
      <WorkspaceMain
        selectedTool={selectedTool}
        selectedApp={selectedApp}
        currentTool={currentTool}
        onAppSelect={handleAppSelect}
      />
    </div>
  );
}