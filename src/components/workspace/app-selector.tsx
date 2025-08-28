"use client"


import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ApplicationConfig, getApplicationsByTool } from '@/config/applications';
import { ToolConfig } from '@/config/tools';

interface AppSelectorProps {
  currentTool?: ToolConfig;
  selectedApp?: string | null;
  onAppSelect: (appId: string | null) => void;
}

export default function AppSelector({
  currentTool,
  selectedApp,
  onAppSelect
}: AppSelectorProps) {
  // 获取与当前工具相关的应用
  const relatedApps = currentTool?.relatedApps 
    ? getApplicationsByTool(currentTool.id)
    : [];

  if (!currentTool || relatedApps.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="mb-3">
        <h3 className="text-sm font-medium text-gray-900 mb-1">
          相关应用
        </h3>
        <p className="text-xs text-gray-500">
          选择应用来获得更丰富的功能体验
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* 基础工具选项 */}
        <Button
          variant={!selectedApp ? "default" : "outline"}
          size="sm"
          onClick={() => onAppSelect(null)}
          className="h-auto p-3 flex flex-col items-start gap-1"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{currentTool.icon.input}</span>
            <span className="text-xs font-medium">基础工具</span>
          </div>
          <span className="text-xs text-muted-foreground">
            使用核心AI功能
          </span>
        </Button>

        {/* 应用选项 */}
        {relatedApps.map((app) => (
          <AppCard
            key={app.id}
            app={app}
            isSelected={selectedApp === app.id}
            onSelect={() => onAppSelect(app.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface AppCardProps {
  app: ApplicationConfig;
  isSelected: boolean;
  onSelect: () => void;
}

function AppCard({ app, isSelected, onSelect }: AppCardProps) {
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      size="sm"
      onClick={onSelect}
      className="h-auto p-3 flex flex-col items-start gap-1 min-w-[120px]"
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{app.icon}</span>
        <span className="text-xs font-medium">{app.name}</span>
        {app.status === 'beta' && (
          <Badge variant="secondary" className="text-xs px-1 py-0">
            Beta
          </Badge>
        )}
      </div>
      <span className="text-xs text-muted-foreground text-left">
        {app.description}
      </span>
    </Button>
  );
}