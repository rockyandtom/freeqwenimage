/**
 * 应用配置系统
 * 管理所有可嵌入到工具区的应用
 */

export interface ApplicationConfig {
  id: string;                    // 应用唯一标识
  name: string;                  // 应用显示名称
  description: string;           // 应用描述
  icon: string;                  // 应用图标 (emoji)
  
  // 关联信息
  toolCategories: string[];      // 适用的工具类型 ['image', 'video', 'audio', 'text']
  relatedTools: string[];        // 相关的基础工具ID
  apiEndpoints: string[];        // 使用的API端点
  
  // 组件信息
  component: string;             // 应用组件名称
  originalPath: string;          // 原始页面路径（用于重定向）
  
  // 显示配置
  embedMode: 'inline' | 'modal' | 'replace';  // 嵌入模式
  priority: number;              // 显示优先级
  
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

/**
 * 应用配置列表
 * 基于现有的 /new-page 下的应用
 */
export const APPLICATIONS_CONFIG: ApplicationConfig[] = [
  {
    id: 'ai-effects',
    name: 'AI特效视频',
    description: '为图片添加AI特效，生成动态视频',
    icon: '🎬',
    toolCategories: ['video', 'image'],
    relatedTools: ['image-to-video', 'text-to-image'],
    apiEndpoints: ['/api/runninghubAPI/image-to-video'],
    component: 'AIEffectsApp',
    originalPath: '/new-page/AI-EFFECTS',
    embedMode: 'inline',
    priority: 1,
    status: 'active',
    pricing: 'free',
    metadata: {
      version: '1.0.0',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15',
      author: 'AI Team'
    }
  },
  {
    id: 'image-enhancer-app',
    name: 'AI图像增强器',
    description: '使用AI技术增强图像质量和细节',
    icon: '✨',
    toolCategories: ['image'],
    relatedTools: ['image-enhancer', 'text-to-image'],
    apiEndpoints: ['/api/runninghubAPI/Image-Enhancer'],
    component: 'ImageEnhancerApp',
    originalPath: '/new-page/image-editor/AI-Image-Enhancer',
    embedMode: 'inline',
    priority: 2,
    status: 'active',
    pricing: 'free',
    metadata: {
      version: '1.0.0',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15',
      author: 'AI Team'
    }
  },
  {
    id: 'qwen-edit',
    name: 'Qwen图像编辑',
    description: '基于Qwen的智能图像编辑和处理',
    icon: '🎨',
    toolCategories: ['image'],
    relatedTools: ['image-to-image', 'text-to-image'],
    apiEndpoints: ['/api/runninghubAPI/qwen-image-edit'],
    component: 'QwenEditApp',
    originalPath: '/new-page/image-editor/qwen-image-edit',
    embedMode: 'inline',
    priority: 3,
    status: 'active',
    pricing: 'free',
    metadata: {
      version: '1.0.0',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15',
      author: 'AI Team'
    }
  },
  {
    id: 'image-editor',
    name: '图像编辑器',
    description: '综合性的图像编辑和处理工具',
    icon: '🖼️',
    toolCategories: ['image'],
    relatedTools: ['image-to-image', 'image-enhancer', 'text-to-image'],
    apiEndpoints: ['/api/runninghubAPI/Image-Enhancer', '/api/runninghubAPI/image-to-image'],
    component: 'ImageEditorApp',
    originalPath: '/new-page/image-editor',
    embedMode: 'inline',
    priority: 4,
    status: 'active',
    pricing: 'free',
    metadata: {
      version: '1.0.0',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15',
      author: 'AI Team'
    }
  }
];

/**
 * 根据工具类型获取相关应用
 */
export function getApplicationsByToolCategory(category: string): ApplicationConfig[] {
  return APPLICATIONS_CONFIG.filter(app => 
    app.toolCategories.includes(category) && app.status === 'active'
  ).sort((a, b) => a.priority - b.priority);
}

/**
 * 根据工具ID获取相关应用
 */
export function getApplicationsByTool(toolId: string): ApplicationConfig[] {
  return APPLICATIONS_CONFIG.filter(app => 
    app.relatedTools.includes(toolId) && app.status === 'active'
  ).sort((a, b) => a.priority - b.priority);
}

/**
 * 根据应用ID获取应用配置
 */
export function getApplicationById(appId: string): ApplicationConfig | undefined {
  return APPLICATIONS_CONFIG.find(app => app.id === appId);
}

/**
 * 获取所有活跃应用
 */
export function getActiveApplications(): ApplicationConfig[] {
  return APPLICATIONS_CONFIG.filter(app => app.status === 'active')
    .sort((a, b) => a.priority - b.priority);
}