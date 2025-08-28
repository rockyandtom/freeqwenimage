"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Zap, Clock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProviderSelectorProps {
  selectedTool: string;
  selectedProvider: string;
  onProviderChange: (providerId: string) => void;
}

// API提供商配置
const apiProviders = [
  {
    id: 'runninghub',
    name: 'RunningHub',
    description: '高质量AI图像生成',
    logo: '🚀',
    supportedTools: ['text-to-image', 'image-enhancer', 'image-to-video'],
    pricing: '免费',
    speed: '快速',
    quality: '高质量',
    features: ['无限制使用', '高分辨率输出', '多种风格'],
    color: 'blue'
  },
  {
    id: 'openai',
    name: 'OpenAI DALL-E',
    description: '创意图像生成专家',
    logo: '🤖',
    supportedTools: ['text-to-image', 'image-to-image'],
    pricing: '付费',
    speed: '中等',
    quality: '创意性强',
    features: ['创意性强', '理解复杂描述', '艺术风格丰富'],
    color: 'green'
  },
  {
    id: 'replicate',
    name: 'Replicate',
    description: '开源模型集合',
    logo: '🔄',
    supportedTools: ['image-to-video', 'video-to-video'],
    pricing: '按使用付费',
    speed: '较慢',
    quality: '多样化',
    features: ['开源模型', '多样化选择', '社区驱动'],
    color: 'purple'
  },
  {
    id: 'stability',
    name: 'Stability AI',
    description: '稳定扩散模型',
    logo: '🎨',
    supportedTools: ['text-to-image', 'image-to-image', 'image-enhancer'],
    pricing: '免费+付费',
    speed: '快速',
    quality: '专业级',
    features: ['开源友好', '可定制性强', '商业友好'],
    color: 'orange'
  }
];

export default function ProviderSelector({ 
  selectedTool, 
  selectedProvider, 
  onProviderChange 
}: ProviderSelectorProps) {
  // 筛选支持当前工具的提供商
  const availableProviders = apiProviders.filter(provider => 
    provider.supportedTools.includes(selectedTool)
  );

  const getSpeedIcon = (speed: string) => {
    switch (speed) {
      case '快速': return <Zap className="h-3 w-3 text-green-500" />;
      case '中等': return <Clock className="h-3 w-3 text-yellow-500" />;
      case '较慢': return <Clock className="h-3 w-3 text-red-500" />;
      default: return <Clock className="h-3 w-3 text-gray-500" />;
    }
  };

  const getQualityIcon = (quality: string) => {
    return <Star className="h-3 w-3 text-yellow-500" />;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">API 提供商</CardTitle>
        <p className="text-xs text-gray-500">
          选择适合的AI服务提供商
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {availableProviders.map((provider) => (
          <div
            key={provider.id}
            className={cn(
              "relative p-3 rounded-lg border-2 cursor-pointer transition-all",
              selectedProvider === provider.id
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:border-gray-300"
            )}
            onClick={() => onProviderChange(provider.id)}
          >
            {/* 选中标识 */}
            {selectedProvider === provider.id && (
              <div className="absolute top-2 right-2">
                <Check className="h-4 w-4 text-primary" />
              </div>
            )}

            {/* 提供商信息 */}
            <div className="flex items-start gap-3">
              <div className="text-2xl">{provider.logo}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm truncate">
                    {provider.name}
                  </h4>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs",
                      provider.pricing === '免费' && "border-green-200 text-green-700",
                      provider.pricing === '付费' && "border-red-200 text-red-700",
                      provider.pricing.includes('付费') && "border-yellow-200 text-yellow-700"
                    )}
                  >
                    {provider.pricing}
                  </Badge>
                </div>
                
                <p className="text-xs text-gray-600 mb-2">
                  {provider.description}
                </p>

                {/* 性能指标 */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1">
                    {getSpeedIcon(provider.speed)}
                    <span className="text-xs text-gray-600">{provider.speed}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getQualityIcon(provider.quality)}
                    <span className="text-xs text-gray-600">{provider.quality}</span>
                  </div>
                </div>

                {/* 特性列表 */}
                <div className="space-y-1">
                  {provider.features.slice(0, 2).map((feature, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full" />
                      <span className="text-xs text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {availableProviders.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">
              暂无支持此工具的提供商
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}