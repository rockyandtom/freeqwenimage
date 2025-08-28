"use client"

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TOOLS_CONFIG, getToolsByCategory } from '@/config/tools';
import { cn } from '@/lib/utils';

interface WorkspaceSidebarProps {
  selectedTool: string;
  onToolChange: (toolId: string) => void;
}

const toolCategories = [
  {
    id: 'image',
    name: '图像工具',
    icon: '🖼️',
    description: '图像生成与编辑'
  },
  {
    id: 'video', 
    name: '视频工具',
    icon: '🎬',
    description: '视频生成与处理'
  },
  {
    id: 'audio',
    name: '音频工具', 
    icon: '🎵',
    description: '音频生成与处理'
  },
  {
    id: 'text',
    name: '文本工具',
    icon: '📝', 
    description: '文本生成与处理'
  }
];

export default function WorkspaceSidebar({ selectedTool, onToolChange }: WorkspaceSidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* 顶部标题 */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">AI Workspace</h2>
        <p className="text-sm text-gray-500 mt-1">选择您需要的AI工具</p>
      </div>

      {/* 工具分类列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        {toolCategories.map((category) => {
          const categoryTools = getToolsByCategory(category.id as any).filter(
            tool => tool.status === 'active'
          );
          
          if (categoryTools.length === 0) return null;

          return (
            <div key={category.id} className="mb-6">
              {/* 分类标题 */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{category.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500">{category.description}</p>
                </div>
              </div>

              {/* 工具列表 */}
              <div className="space-y-1 ml-6">
                {categoryTools.map((tool) => (
                  <Button
                    key={tool.id}
                    variant={selectedTool === tool.id ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start h-auto p-3 text-left",
                      selectedTool === tool.id 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-gray-100"
                    )}
                    onClick={() => onToolChange(tool.id)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex items-center gap-1 text-sm">
                        <span>{tool.icon.input}</span>
                        <span className="text-xs">→</span>
                        <span>{tool.icon.output}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {tool.name}
                        </div>
                        <div className="text-xs opacity-75 truncate">
                          {tool.description}
                        </div>
                      </div>
                      {tool.status === 'beta' && (
                        <Badge variant="secondary" className="text-xs">
                          Beta
                        </Badge>
                      )}
                    </div>
                  </Button>
                ))}
              </div>

              {category.id !== 'text' && <Separator className="mt-4" />}
            </div>
          );
        })}
      </div>

      {/* 底部信息 */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>FreeQwenImage Workspace</p>
          <p className="mt-1">免费AI工具集合</p>
        </div>
      </div>
    </div>
  );
}