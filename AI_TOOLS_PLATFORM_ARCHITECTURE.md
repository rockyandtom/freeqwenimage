# 🚀 AI工具平台架构方案

## 📋 概述

本文档描述了一个可快速复制、高可维护性的AI工具平台架构方案。该方案基于Next.js 15，采用敏捷开发思路，支持多AI提供商集成，具备强扩展性和团队协作友好性。

## 🎯 设计目标

- **快速复制**: 标准化结构，一键部署新项目
- **高可维护**: 清晰分层，单一数据源管理
- **强扩展性**: 插件化架构，支持新工具和提供商
- **团队友好**: 详细文档，自动化工具支持

## 🏗️ 核心架构

### 技术栈
- **前端**: Next.js 15 + TypeScript + Tailwind CSS
- **UI组件**: shadcn/ui + Radix UI
- **状态管理**: React Hooks + Context
- **国际化**: next-intl
- **部署**: Vercel + 自动化CI/CD

### 架构原则
1. **配置驱动**: 核心功能通过配置文件管理
2. **组件化**: 高度模块化的组件设计
3. **类型安全**: 完整的TypeScript类型定义
4. **API统一**: 标准化的API接口设计
5. **文档优先**: 完善的开发和维护文档

## 📁 项目结构

```
freeqwenimage/
├── 📋 docs/                            # 项目文档
├── 📦 templates/                       # 代码模板
├── 🔧 scripts/                         # 自动化脚本
├── 
├── src/
│   ├── 📱 app/                          # Next.js App Router
│   │   ├── [locale]/(default)/
│   │   │   ├── ai-tools/                # AI工具页面
│   │   │   └── ...                      # 其他页面
│   │   └── api/                         # API路由
│   │       ├── providers/               # AI提供商API
│   │       ├── tools/                   # 工具管理API
│   │       └── analytics/               # 统计分析API
│   │
│   ├── 🧩 components/                   # 组件库
│   │   ├── ui/                          # 基础UI组件
│   │   ├── tools/                       # AI工具组件
│   │   ├── blocks/                      # 页面区块组件
│   │   └── navigation/                  # 导航组件
│   │
│   ├── ⚙️ config/                      # 配置文件
│   │   ├── tools.ts                     # 工具配置 (核心)
│   │   ├── providers.ts                 # AI提供商配置
│   │   ├── site.ts                      # 站点配置
│   │   └── navigation.ts                # 导航配置
│   │
│   ├── 🔧 lib/                         # 工具库
│   │   ├── ai-providers/                # AI提供商SDK
│   │   ├── tools/                       # 工具管理
│   │   └── utils/                       # 通用工具
│   │
│   ├── 🎣 hooks/                       # React Hooks
│   ├── 📝 types/                       # TypeScript类型
│   └── 🌍 i18n/                        # 国际化
└── ...
```#
# 🎯 核心配置系统

### 工具配置 (src/config/tools.ts)

这是整个平台的核心配置文件，所有AI工具的信息都在这里统一管理：

```typescript
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
    description: 'Generate stunning images from text descriptions',
    category: 'image',
    href: '/ai-tools/image/text-to-image',
    apiEndpoint: '/api/providers/runninghub/text-to-image',
    icon: { input: '📝', output: '🖼️' },
    component: 'TextToImageTool',
    provider: 'runninghub',
    features: ['Multiple styles', 'High resolution', 'Fast generation'],
    status: 'active',
    pricing: 'freemium',
    metadata: {
      version: '1.0.0',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15',
      author: 'AI Team'
    }
  },
  // ... 其他工具配置
];
```

### 站点配置 (src/config/site.ts)

```typescript
export const SITE_CONFIG = {
  name: 'FreeQwenImage',
  description: 'AI-powered image and video generation platform',
  url: 'https://freeqwenimage.com',
  
  // 主导航配置
  navigation: [
    { name: 'Home', href: '/' },
    { name: 'AI Tools', href: '/ai-tools' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/posts' }
  ],
  
  // 主题配置
  theme: {
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6'
  },
  
  // 功能开关
  features: {
    userAuth: true,
    analytics: true,
    i18n: true,
    darkMode: true
  }
};
```

## 🔌 AI提供商架构

### 抽象基类 (src/lib/ai-providers/base.ts)

```typescript
export abstract class BaseAIProvider {
  abstract name: string;
  abstract baseUrl: string;
  abstract apiKey: string;

  abstract textToImage(params: TextToImageParams): Promise<AIResponse>;
  abstract imageToImage(params: ImageToImageParams): Promise<AIResponse>;
  abstract imageToVideo(params: ImageToVideoParams): Promise<AIResponse>;
  abstract enhanceImage(params: EnhanceImageParams): Promise<AIResponse>;
  
  abstract uploadFile(file: File): Promise<UploadResponse>;
  abstract getTaskStatus(taskId: string): Promise<TaskStatusResponse>;
  abstract getTaskResult(taskId: string): Promise<TaskResultResponse>;
}
```

### RunningHub实现 (src/lib/ai-providers/runninghub.ts)

```typescript
export class RunningHubProvider extends BaseAIProvider {
  name = 'RunningHub';
  baseUrl = 'https://www.runninghub.cn';
  apiKey = process.env.RUNNINGHUB_API_KEY!;

  async textToImage(params: TextToImageParams): Promise<AIResponse> {
    // RunningHub 文生图实现
    const response = await fetch(`${this.baseUrl}/task/openapi/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Host': 'www.runninghub.cn'
      },
      body: JSON.stringify({
        webappId: process.env.RUNNINGHUB_WEBAPP_ID,
        apiKey: this.apiKey,
        nodeInfoList: [
          {
            nodeId: process.env.RUNNINGHUB_TEXT_TO_IMAGE_NODE_ID,
            fieldName: "prompt",
            fieldValue: params.prompt,
            description: "Text prompt for image generation"
          }
        ]
      })
    });

    const result = await response.json();
    return {
      success: result.code === 0,
      data: result.data,
      error: result.msg
    };
  }

  // ... 其他方法实现
}
```

## 🛠️ 工具组件架构

### 基础工具组件 (src/components/tools/_base/base-tool.tsx)

```typescript
export interface BaseToolProps {
  tool: ToolConfig;
  onResult?: (result: any) => void;
  onError?: (error: string) => void;
}

export abstract class BaseTool<T extends BaseToolProps> extends React.Component<T> {
  abstract renderInputs(): React.ReactNode;
  abstract renderResults(): React.ReactNode;
  abstract handleSubmit(): Promise<void>;

  render() {
    return (
      <div className="tool-container max-w-4xl mx-auto p-6">
        <div className="tool-inputs mb-6">
          {this.renderInputs()}
        </div>
        <div className="tool-actions mb-6">
          <Button onClick={this.handleSubmit} className="w-full">
            Generate
          </Button>
        </div>
        <div className="tool-results">
          {this.renderResults()}
        </div>
      </div>
    );
  }
}
```

### 统一工具Hook (src/hooks/use-ai-tool.ts)

```typescript
export function useAITool(toolId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const execute = async (params: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 获取工具配置
      const tool = getToolById(toolId);
      if (!tool) {
        throw new Error(`Tool ${toolId} not found`);
      }

      // 调用对应API
      const response = await fetch(tool.apiEndpoint, {
        method: 'POST',
        headers: params instanceof FormData ? {} : {
          'Content-Type': 'application/json'
        },
        body: params instanceof FormData ? params : JSON.stringify(params)
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }

      // 如果返回taskId，开始轮询状态
      if (result.data?.taskId) {
        await pollTaskStatus(result.data.taskId);
      } else {
        setResult(result.data);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, isLoading, result, error };
}
```## 
📁 API架构设计

### 现有API保持兼容 (敏捷方案)

基于快速上线的原则，保持现有API结构不变，通过扩展的方式添加新功能：

```
src/app/api/
├── runninghubAPI/                      # 现有API (保持不变)
│   ├── Image-Enhancer/route.ts        # ✅ 已有 - 图像增强
│   ├── upload/route.ts                 # ✅ 已有 - 文件上传
│   ├── status/route.ts                 # ✅ 已有 - 状态查询
│   ├── text-to-image/route.ts         # 🆕 新增 - 文生图
│   ├── image-to-image/route.ts        # 🆕 新增 - 图生图
│   └── image-to-video/route.ts        # 🆕 新增 - 图生视频
├── tools/                              # 🆕 工具管理API
│   ├── list/route.ts                   # 工具列表
│   ├── [toolId]/route.ts               # 工具详情
│   └── categories/route.ts             # 工具分类
└── analytics/                          # 🆕 统计分析API
    ├── usage/route.ts                  # 使用统计
    └── health/route.ts                 # 健康检查
```

### API路由映射表

| 功能 | API路径 | 状态 | 说明 |
|------|---------|------|------|
| 图像增强 | `/api/runninghubAPI/Image-Enhancer` | ✅ 现有 | 保持不变 |
| 文件上传 | `/api/runninghubAPI/upload` | ✅ 现有 | 保持不变 |
| 状态查询 | `/api/runninghubAPI/status` | ✅ 现有 | 保持不变 |
| 文生图 | `/api/runninghubAPI/text-to-image` | 🆕 新增 | 复用现有模式 |
| 图生图 | `/api/runninghubAPI/image-to-image` | 🆕 新增 | 复用现有模式 |
| 图生视频 | `/api/runninghubAPI/image-to-video` | 🆕 新增 | 复用现有模式 |
| 工具列表 | `/api/tools/list` | 🆕 新增 | 统一管理 |

### 统一API响应格式

```typescript
// 标准API响应格式
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
  message?: string;
}

// RunningHub任务响应
export interface TaskResponse {
  success: boolean;
  data: {
    taskId: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    progress?: number;
    resultUrl?: string;
    imageUrl?: string;
  };
  error?: string;
}
```

## 🎨 页面架构设计

### 工具页面结构

所有AI工具页面采用统一的结构模板：

```
src/app/[locale]/(default)/ai-tools/
├── page.tsx                           # 工具集合页
├── [category]/                        # 分类页面
│   ├── page.tsx                      # 分类列表页
│   └── [tool]/                       # 具体工具页
│       └── page.tsx                  # 工具详情页
└── _components/                      # 工具页面专用组件
    ├── tool-card.tsx                 # 工具卡片
    ├── tool-grid.tsx                 # 工具网格
    ├── tool-navigation.tsx           # 工具导航
    └── category-filter.tsx           # 分类筛选
```

### 统一页面模板

```typescript
// 标准工具页面模板
export default function ToolPage() {
  return (
    <>
      <HeroBg />
      <section className="py-24">
        <div className="container">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="mx-auto mb-3 mt-4 max-w-6xl text-balance text-4xl font-bold lg:mb-7 lg:text-7xl">
              {content.H1_Main_Title}
            </h1>
            <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
              {content.H1_Sub_Title}
            </p>
          </div>

          {/* Tool Section */}
          <section id="ai-tool" className="py-16">
            <div className="container">
              <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl text-center">
                {content.Tool_Title}
              </h2>
              <div className="max-w-4xl mx-auto">
                <ToolComponent />
              </div>
            </div>
          </section>

          {/* Content Sections */}
          <div className="space-y-16">
            {content.Content_Sections.map((section, index) => (
              <ContentSection key={index} section={section} />
            ))}
          </div>

          {/* FAQ Section */}
          <FAQSection faq={content.FAQ_Section} />

          {/* Tool Navigation */}
          <ToolNavigation currentTool={toolId} />

          {/* CTA Section */}
          <CTASection />
        </div>
      </section>
    </>
  );
}
```

## 🧩 组件系统

### 工具组件标准化

所有AI工具组件都继承自基础工具类，确保一致的用户体验：

```typescript
// 基础工具组件接口
export interface ToolComponentProps {
  tool: ToolConfig;
  className?: string;
  onResult?: (result: any) => void;
  onError?: (error: string) => void;
}

// 统一工具布局
export const ToolLayout = ({ children, title, description }: ToolLayoutProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-6">
        {children}
      </div>
    </div>
  );
};
```

### 工具卡片组件

```typescript
// 统一工具卡片设计
export const ToolCard = ({ tool }: { tool: ToolConfig }) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        {/* 状态标签 */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2 text-2xl">
            <span>{tool.icon.input}</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span>{tool.icon.output}</span>
          </div>
          {tool.status === 'beta' && <Badge variant="secondary">Beta</Badge>}
          {tool.pricing === 'free' && <Badge variant="outline">Free</Badge>}
        </div>
        
        {/* 内容 */}
        <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {tool.description}
        </p>
        
        {/* 功能特性 */}
        <div className="flex flex-wrap gap-1 mb-4">
          {tool.features.slice(0, 3).map(feature => (
            <Badge key={feature} variant="outline" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>
        
        {/* 按钮 */}
        <Button asChild className="w-full">
          <Link href={tool.href}>
            Try Now
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
```##
 🚀 敏捷开发实施计划

### Phase 1: 基础架构 (1-2天)

#### 立即实施
1. **保持现有API不变**
   - ✅ `/api/runninghubAPI/Image-Enhancer` (图像增强)
   - ✅ `/api/runninghubAPI/upload` (文件上传)
   - ✅ `/api/runninghubAPI/status` (状态查询)

2. **添加新API路由**
   - 🆕 `/api/runninghubAPI/text-to-image` (文生图)
   - 🆕 `/api/runninghubAPI/image-to-image` (图生图)
   - 🆕 `/api/runninghubAPI/image-to-video` (图生视频)
   - 🆕 `/api/tools/list` (工具列表)

3. **创建核心配置**
   - 🆕 `src/config/tools.ts` (工具配置)
   - 🆕 `src/config/site.ts` (站点配置)

4. **创建工具集合页**
   - 🆕 `/ai-tools/page.tsx` (工具选择页)
   - 🆕 `src/components/tool-card.tsx` (工具卡片)

#### 环境变量扩展
```bash
# .env.development 添加
RUNNINGHUB_TEXT_TO_IMAGE_NODE_ID=1
RUNNINGHUB_IMAGE_TO_IMAGE_NODE_ID=3
RUNNINGHUB_IMAGE_TO_VIDEO_NODE_ID=4
```

### Phase 2: 页面重构 (2-3天)

#### 路径重构策略
```
现有路径 → 新路径 (保持重定向)

/ (首页AI Generator)                    → /ai-tools/image/text-to-image
/new-page/image-editor/qwen-image-edit  → /ai-tools/image/image-to-image
/new-page/image-editor/AI-Image-Enhancer → /ai-tools/image/image-enhancer
/new-page/AI-EFFECTS                    → /ai-tools/video/image-to-video
```

#### 重定向配置 (next.config.mjs)
```javascript
async redirects() {
  return [
    {
      source: '/new-page/image-editor/qwen-image-edit',
      destination: '/ai-tools/image/image-to-image',
      permanent: true,
    },
    {
      source: '/new-page/image-editor/AI-Image-Enhancer',
      destination: '/ai-tools/image/image-enhancer',
      permanent: true,
    },
    {
      source: '/new-page/AI-EFFECTS',
      destination: '/ai-tools/video/image-to-video',
      permanent: true,
    }
  ];
}
```

### Phase 3: 优化完善 (1周)

1. **添加工具导航组件**
2. **优化移动端体验**
3. **添加使用统计**
4. **完善错误处理**
5. **性能优化**

## 🔧 快速开发工具

### 创建新工具脚本 (scripts/create-tool.js)

```javascript
#!/usr/bin/env node
// 🛠️ 快速创建新AI工具

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createTool() {
  console.log('🛠️  Creating new AI tool...\n');
  
  // 收集工具信息
  const toolInfo = {
    id: await question('Tool ID (kebab-case): '),
    name: await question('Tool Name: '),
    description: await question('Description: '),
    category: await question('Category (image/video/audio/text): '),
    provider: await question('Provider (runninghub/openai/replicate): '),
    inputIcon: await question('Input Icon (emoji): '),
    outputIcon: await question('Output Icon (emoji): ')
  };

  // 验证输入
  if (!toolInfo.id || !toolInfo.name || !toolInfo.category) {
    console.error('❌ Required fields missing!');
    return;
  }

  // 创建文件
  await createToolFiles(toolInfo);
  
  console.log('\n✅ Tool created successfully!');
  console.log('\n📝 Next steps:');
  console.log(`1. Update src/config/tools.ts to add your tool configuration`);
  console.log(`2. Implement API logic in src/app/api/runninghubAPI/${toolInfo.id}/route.ts`);
  console.log(`3. Customize component in src/components/tools/${toolInfo.id}/`);
  console.log(`4. Test at /ai-tools/${toolInfo.category}/${toolInfo.id}`);
  console.log(`5. Add content to page template`);
}

async function createToolFiles(toolInfo) {
  const { id, name, description, category, provider, inputIcon, outputIcon } = toolInfo;
  
  // 1. 创建组件目录和文件
  const componentDir = `src/components/tools/${id}`;
  fs.mkdirSync(componentDir, { recursive: true });
  
  const componentTemplate = `"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ToolLayout } from "@/components/tools/_base/tool-layout"
import { useAITool } from "@/hooks/use-ai-tool"

export default function ${toPascalCase(id)}Tool() {
  const { execute, isLoading, result, error } = useAITool('${id}');
  const [inputValue, setInputValue] = React.useState('');

  const handleSubmit = async () => {
    await execute({ 
      // TODO: 根据工具类型定义参数
      input: inputValue 
    });
  };

  return (
    <ToolLayout title="${name}" description="${description}">
      <div className="space-y-6">
        {/* TODO: 实现输入界面 */}
        <div>
          <label className="block text-sm font-medium mb-2">Input</label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter your input..."
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={isLoading || !inputValue}
          className="w-full"
        >
          {isLoading ? 'Processing...' : 'Generate'}
        </Button>

        {/* 结果显示 */}
        {result && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Result</h3>
            {/* TODO: 根据工具类型显示结果 */}
            <div className="border rounded-lg p-4">
              Result will be displayed here
            </div>
          </div>
        )}

        {/* 错误显示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}`;

  fs.writeFileSync(`${componentDir}/${id}-tool.tsx`, componentTemplate);
  
  // 2. 创建API路由
  const apiDir = `src/app/api/runninghubAPI/${id}`;
  fs.mkdirSync(apiDir, { recursive: true });
  
  const apiTemplate = `import { NextRequest } from 'next/server';
import type { ApiResponse } from '@/types/runninghub';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: 验证输入参数
    if (!body.input) {
      return Response.json(
        { success: false, error: 'Input is required' },
        { status: 400 }
      );
    }

    // TODO: 调用${provider} API
    const response = await fetch('https://api.${provider}.com/v1/${id}', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${process.env.${provider.toUpperCase()}_API_KEY}\`
      },
      body: JSON.stringify({
        // TODO: 根据提供商API格式化参数
        input: body.input
      })
    });

    const result = await response.json();

    if (!response.ok) {
      return Response.json(
        { success: false, error: result.error || 'API request failed' },
        { status: response.status }
      );
    }

    const apiResponse: ApiResponse<{ taskId: string }> = {
      success: true,
      data: { taskId: result.taskId || result.id }
    };

    return Response.json(apiResponse);

  } catch (error) {
    console.error('${name} API error:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}`;

  fs.writeFileSync(`${apiDir}/route.ts`, apiTemplate);
  
  // 3. 创建页面
  const pageDir = `src/app/[locale]/(default)/ai-tools/${category}/${id}`;
  fs.mkdirSync(pageDir, { recursive: true });
  
  const pageTemplate = `import ${toPascalCase(id)}Tool from "@/components/tools/${id}/${id}-tool";
import { type Metadata } from "next";
import HeroBg from "@/components/blocks/hero/bg";
import { Badge } from "@/components/ui/badge";
import ToolNavigation from "@/components/ai-tools/tool-navigation";

export const metadata: Metadata = {
  title: "${name} - FreeQwenImage",
  description: "${description}",
};

const content = {
  "H1_Main_Title": "${name}: ${description}",
  "H1_Sub_Title": "${description}",
  "Tool_Title": "Try Our ${name}",
  "Content_Sections": [
    {
      "H2_Subtitle": "How ${name} Works",
      "Paragraphs": [
        "Our **${name}** uses advanced AI technology to ${description.toLowerCase()}. The process is simple, fast, and delivers professional-quality results.",
        "Whether you're a professional or just getting started, our **${name}** tool is designed to be intuitive and powerful, helping you achieve your creative goals with ease."
      ]
    }
  ],
  "FAQ_Section": {
    "Title": "Frequently Asked Questions about ${name}",
    "Subtitle": "Everything you need to know about our ${name} tool.",
    "FAQs": [
      {
        "Question": "What is ${name}?",
        "Answer": "**${name}** is an AI-powered tool that ${description.toLowerCase()}. It uses advanced machine learning algorithms to deliver high-quality results quickly and efficiently."
      },
      {
        "Question": "Is ${name} free to use?",
        "Answer": "Yes, our **${name}** tool is completely free to use. We believe in making powerful AI tools accessible to everyone."
      }
    ]
  }
};

export default function ${toPascalCase(id)}Page() {
  return (
    <>
      <HeroBg />
      <section className="py-24">
        <div className="container">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="mx-auto mb-3 mt-4 max-w-6xl text-balance text-4xl font-bold lg:mb-7 lg:text-7xl">
              {content.H1_Main_Title}
            </h1>
            <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
              {content.H1_Sub_Title}
            </p>
          </div>

          {/* Tool Section */}
          <section id="${id}-tool" className="py-16">
            <div className="container">
              <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl text-center">
                {content.Tool_Title}
              </h2>
              <div className="max-w-4xl mx-auto">
                <${toPascalCase(id)}Tool />
              </div>
            </div>
          </section>

          {/* Content Sections */}
          <div className="space-y-16">
            {content.Content_Sections.map((section, index) => (
              <section key={index} id={\`section-\${index + 1}\`} className="py-16">
                <div className="container">
                  <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl">
                    {section.H2_Subtitle}
                  </h2>
                  <div className="max-w-xl text-muted-foreground lg:max-w-none lg:text-lg space-y-6">
                    {section.Paragraphs.map((paragraph, pIndex) => (
                      <p key={pIndex}
                         dangerouslySetInnerHTML={{ __html: paragraph.replace(/\\*\\*(.*?)\\*\\*/g, '<strong class="font-bold text-foreground">$1</strong>') }}></p>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* FAQ Section */}
          <section id="faq" className="py-16">
            <div className="container">
              <div className="text-center">
                <Badge className="text-xs font-medium">FAQ</Badge>
                <h2 className="mt-4 text-4xl font-semibold">
                  {content.FAQ_Section.Title}
                </h2>
                <p className="mt-6 font-medium text-muted-foreground">
                  {content.FAQ_Section.Subtitle}
                </p>
              </div>
              <div className="mx-auto mt-14 grid gap-8 md:grid-cols-2 md:gap-12">
                {content.FAQ_Section.FAQs.map((faq, index) => (
                  <div key={index} className="flex gap-4">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-primary font-mono text-xs text-primary">{index + 1}</span>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold">{faq.Question}</h3>
                      </div>
                      <p className="text-md text-muted-foreground"
                         dangerouslySetInnerHTML={{ __html: faq.Answer.replace(/\\*\\*(.*?)\\*\\*/g, '<strong class="font-bold text-foreground">$1</strong>') }}></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Tool Navigation */}
          <ToolNavigation currentTool="${id}" />

          {/* CTA Section */}
          <section className="py-20">
            <div className="px-8">
              <div className='flex items-center justify-center rounded-2xl bg-[url("/imgs/masks/circle.svg")] bg-cover bg-center px-8 py-12 text-center md:p-16'>
                <div className="mx-auto max-w-(--breakpoint-md)">
                  <h2 className="mb-4 text-balance text-3xl font-semibold md:text-5xl">
                    Ready to Try ${name}?
                  </h2>
                  <p className="text-muted-foreground md:text-lg">
                    Experience the power of AI-driven ${category} processing.
                  </p>
                  <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                    <a href="#${id}-tool" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                      Try ${name} - It's Free!
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}`;

  fs.writeFileSync(`${pageDir}/page.tsx`, pageTemplate);
  
  // 4. 创建类型定义
  const typesTemplate = `// ${name} 工具类型定义

export interface ${toPascalCase(id)}Params {
  input: string;
  // TODO: 根据工具需求添加更多参数
}

export interface ${toPascalCase(id)}Response {
  success: boolean;
  data?: {
    taskId: string;
    result?: string;
  };
  error?: string;
}`;

  fs.writeFileSync(`src/types/${id}.d.ts`, typesTemplate);
  
  console.log(`✅ Created component: ${componentDir}/${id}-tool.tsx`);
  console.log(`✅ Created API route: ${apiDir}/route.ts`);
  console.log(`✅ Created page: ${pageDir}/page.tsx`);
  console.log(`✅ Created types: src/types/${id}.d.ts`);
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function toPascalCase(str) {
  return str.replace(/(^\w|-\w)/g, (match) => 
    match.replace('-', '').toUpperCase()
  );
}

// 运行脚本
if (require.main === module) {
  createTool().then(() => {
    rl.close();
  }).catch(console.error);
}

module.exports = { createTool };
```

### package.json 脚本配置

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    
    "create:tool": "node scripts/create-tool.js",
    "create:provider": "node scripts/create-provider.js",
    "create:page": "node scripts/create-page.js",
    
    "test:api": "node scripts/test-apis.js",
    "test:tools": "node scripts/test-tools.js",
    
    "deploy": "vercel --prod",
    "deploy:preview": "vercel",
    
    "docs:generate": "node scripts/generate-docs.js",
    "docs:serve": "serve docs",
    
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    
    "clone:project": "node scripts/clone-project.js"
  }
}
```