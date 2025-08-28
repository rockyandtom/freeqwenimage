// 🎯 AI工具平台核心配置
// 所有AI工具的统一管理配置

export interface ToolConfig {
  // 基础信息
  id: string;                    // 工具唯一标识
  name: string;                  // 工具显示名称
  description: string;           // 工具描述
  category: 'image' | 'video' | 'audio' | 'text';
  
  // 路由信息
  href: string;                  // 页面路径
  apiEndpoint: string;           // API端点
  
  // UI信息
  icon: {
    input: string;               // 输入图标 (emoji)
    output: string;              // 输出图标 (emoji)
  };
  
  // 功能信息
  component: string;             // 组件名称
  provider: string;              // AI提供商
  features: string[];            // 功能特性
  
  // 应用关联 (新增)
  relatedApps?: string[];        // 相关应用ID列表
  
  // 状态信息
  status: 'active' | 'beta' | 'coming-soon' | 'deprecated';
  pricing: 'free' | 'freemium' | 'pro';
  
  // 元数据
  metadata: {
    version: string;
    createdAt: string;
    updatedAt: string;
    author: string;
  };
}

export const TOOLS_CONFIG: ToolConfig[] = [
  {
    id: 'text-to-image',
    name: 'Text to Image',
    description: 'Generate stunning images from text descriptions using advanced AI',
    category: 'image',
    href: '/ai-tools/image/text-to-image',
    apiEndpoint: '/api/runninghubAPI/text-to-image',
    icon: { input: '📝', output: '🖼️' },
    component: 'TextToImageTool',
    provider: 'runninghub',
    features: ['Multiple styles', 'High resolution', 'Fast generation'],
    relatedApps: ['ai-effects', 'image-enhancer-app', 'qwen-edit'],
    status: 'active',
    pricing: 'free',
    metadata: {
      version: '1.0.0',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15',
      author: 'FreeQwenImage Team'
    }
  },
  {
    id: 'image-enhancer',
    name: 'AI Image Enhancer',
    description: 'Enhance and upscale your images with AI-powered technology',
    category: 'image',
    href: '/ai-tools/image/image-enhancer',
    apiEndpoint: '/api/runninghubAPI/Image-Enhancer',
    icon: { input: '🖼️', output: '✨' },
    component: 'ImageEnhancerTool',
    provider: 'runninghub',
    features: ['4x upscaling', 'Noise reduction', 'Detail enhancement'],
    relatedApps: ['image-enhancer-app', 'image-editor'],
    status: 'active',
    pricing: 'free',
    metadata: {
      version: '1.0.0',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15',
      author: 'FreeQwenImage Team'
    }
  },
  {
    id: 'image-to-image',
    name: 'Image to Image',
    description: 'Transform and edit images using AI-powered image-to-image generation',
    category: 'image',
    href: '/ai-tools/image/image-to-image',
    apiEndpoint: '/api/runninghubAPI/image-to-image',
    icon: { input: '🖼️', output: '🎨' },
    component: 'ImageToImageTool',
    provider: 'runninghub',
    features: ['Style transfer', 'Image editing', 'Creative transformation'],
    relatedApps: ['qwen-edit', 'image-editor'],
    status: 'active',
    pricing: 'free',
    metadata: {
      version: '1.0.0',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15',
      author: 'FreeQwenImage Team'
    }
  },
  {
    id: 'photo-effects',
    name: 'Photo Effects',
    description: 'Transform your photos into stunning anime figures with our AI-powered Nano Banana generator.',
    category: 'image',
    href: '/ai-tools/image/image-to-image/Photo-Effects',
    apiEndpoint: '/api/runninghubAPI/photo-effects',
    icon: { input: '🖼️', output: '🎨' },
    component: 'PhotoEffectsTool',
    provider: 'runninghub',
    features: ['anime', 'figure', 'character', 'transformation', 'AI'],
    relatedApps: [],
    status: 'active',
    pricing: 'free',
    metadata: {
      version: '1.0.0',
      createdAt: '2024-07-29',
      updatedAt: '2024-07-29',
      author: 'FreeQwenImage Team'
    }
  },
  {
    id: 'image-to-video',
    name: 'Image to Video',
    description: 'Create dynamic videos from static images using AI animation',
    category: 'video',
    href: '/ai-tools/video/image-to-video',
    apiEndpoint: '/api/runninghubAPI/image-to-video',
    icon: { input: '🖼️', output: '🎬' },
    component: 'ImageToVideoTool',
    provider: 'runninghub',
    features: ['AI animation', 'Multiple effects', 'HD output'],
    relatedApps: ['ai-effects'],
    status: 'active',
    pricing: 'free',
    metadata: {
      version: '1.0.0',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15',
      author: 'FreeQwenImage Team'
    }
  }
];

// 工具查询函数
export function getToolById(id: string): ToolConfig | undefined {
  return TOOLS_CONFIG.find(tool => tool.id === id);
}

export function getToolsByCategory(category: ToolConfig['category']): ToolConfig[] {
  return TOOLS_CONFIG.filter(tool => tool.category === category);
}

export function getActiveTools(): ToolConfig[] {
  return TOOLS_CONFIG.filter(tool => tool.status === 'active');
}

export function getToolCategories(): ToolConfig['category'][] {
  return Array.from(new Set(TOOLS_CONFIG.map(tool => tool.category)));
}