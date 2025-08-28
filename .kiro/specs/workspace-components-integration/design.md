# Design Document

## Overview

本设计文档旨在构建一个完整的AI工具区体验，整合现有的workspace组件和new-page应用。设计目标：

1. **统一工具区界面** - 左侧工具导航，中间工具操作，下方应用选择
2. **应用无缝集成** - 将new-page下的应用嵌入到工具区中
3. **充分利用现有资源** - 利用已接入的runninghubAPI和现有组件
4. **提升用户体验** - 在一个界面中提供基础工具和专业应用

## Architecture

### 当前状态分析

**现有资源：**
```
src/app/api/runninghubAPI/        # ✅ 已接入的API
├── text-to-image/               # 文生图API
├── image-to-image/              # 图生图API  
├── image-to-video/              # 图生视频API
├── Image-Enhancer/              # 图像增强API
├── qwen-image-edit/             # Qwen图像编辑API
├── AI-Kiss/                     # AI Kiss API
├── background-removal/          # 背景移除API
└── image-effects/               # 图像特效API

src/app/[locale]/(default)/new-page/  # ✅ 现有应用页面
├── AI-EFFECTS/                  # AI特效应用
└── image-editor/                # 图像编辑应用
    ├── AI-Image-Enhancer/       # AI图像增强应用
    └── qwen-image-edit/         # Qwen图像编辑应用

src/components/workspace/         # ❌ 需要整合的工作区组件
```

### 目标架构设计

**统一工具区界面：**
```
/ai-tools 工具区页面布局：
┌─────────────────────────────────────────────────────────────┐
│                    顶部工具信息栏                            │
├─────────┬───────────────────────────────────────────────────┤
│         │                                                   │
│  左侧   │                工具操作区                          │
│  工具   │           (当前选中的工具组件)                      │
│  导航   │                                                   │
│  栏     │                                                   │
├─────────┼───────────────────────────────────────────────────┤
│         │              应用选择器                            │
│  API    │         [AI特效] [图像增强] [Qwen编辑]             │
│  提供   ├───────────────────────────────────────────────────┤
│  商     │                                                   │
│  选择   │              应用内容区                            │
│         │        (选中应用的界面嵌入显示)                    │
└─────────┴───────────────────────────────────────────────────┘
```

**组件架构重组：**
```
src/components/ai-tools/          # ✅ 统一的AI工具平台组件
├── workspace/                   # 工作区组件
│   ├── workspace-layout.tsx     # 主布局（支持应用嵌入）
│   ├── workspace-main.tsx       # 主工作区
│   ├── workspace-sidebar.tsx    # 工具导航侧边栏
│   ├── provider-selector.tsx    # API提供商选择
│   └── app-selector.tsx         # 🆕 应用选择器
├── applications/                # 🆕 应用组件集成
│   ├── ai-effects-app.tsx       # AI特效应用组件
│   ├── image-enhancer-app.tsx   # 图像增强应用组件
│   └── qwen-edit-app.tsx        # Qwen编辑应用组件
├── tool-card.tsx               # 现有工具展示组件
├── tool-grid.tsx
└── tool-navigation.tsx
```

## Components and Interfaces

### 1. 组件迁移映射

| 当前位置 | 目标位置 | 说明 |
|---------|---------|------|
| `src/components/workspace/workspace-layout.tsx` | `src/components/ai-tools/workspace/workspace-layout.tsx` | 工作区主布局 |
| `src/components/workspace/workspace-main.tsx` | `src/components/ai-tools/workspace/workspace-main.tsx` | 工作区主内容区 |
| `src/components/workspace/workspace-sidebar.tsx` | `src/components/ai-tools/workspace/workspace-sidebar.tsx` | 工作区侧边栏 |
| `src/components/workspace/provider-selector.tsx` | `src/components/ai-tools/workspace/provider-selector.tsx` | API提供商选择器 |

### 2. Import路径更新

#### 主要更新点
```typescript
// 更新前
import WorkspaceLayout from "@/components/workspace/workspace-layout";

// 更新后  
import WorkspaceLayout from "@/components/ai-tools/workspace/workspace-layout";
```

#### 组件内部引用更新
```typescript
// workspace-layout.tsx 内部引用更新
// 更新前
import WorkspaceSidebar from './workspace-sidebar';
import WorkspaceMain from './workspace-main';

// 更新后（相对路径保持不变）
import WorkspaceSidebar from './workspace-sidebar';
import WorkspaceMain from './workspace-main';
```

### 3. 组件功能保持

所有组件的接口、props、功能逻辑完全保持不变：

```typescript
// WorkspaceLayout - 接口保持不变
export default function WorkspaceLayout() {
  // 现有逻辑完全保持
}

// WorkspaceMain - 接口保持不变  
interface WorkspaceMainProps {
  selectedTool: string;
  currentTool?: ToolConfig;
}

// WorkspaceSidebar - 接口保持不变
interface WorkspaceSidebarProps {
  selectedTool: string;
  onToolChange: (toolId: string) => void;
}
```

## Data Models

### 应用配置系统

新增应用配置文件 `src/config/applications.ts`：

```typescript
export interface ApplicationConfig {
  id: string;                    // 应用唯一标识
  name: string;                  // 应用显示名称
  description: string;           // 应用描述
  icon: string;                  // 应用图标
  
  // 关联信息
  toolCategories: string[];      // 适用的工具类型
  apiEndpoints: string[];        // 使用的API端点
  
  // 组件信息
  component: string;             // 应用组件名称
  originalPath: string;          // 原始页面路径（用于重定向）
  
  // 显示配置
  embedMode: 'inline' | 'modal' | 'replace';  // 嵌入模式
  priority: number;              // 显示优先级
  
  // 状态信息
  status: 'active' | 'beta' | 'coming-soon';
}

export const APPLICATIONS_CONFIG: ApplicationConfig[] = [
  {
    id: 'ai-effects',
    name: 'AI特效视频',
    description: '为图片添加AI特效，生成动态视频',
    icon: '🎬',
    toolCategories: ['video', 'image'],
    apiEndpoints: ['/api/runninghubAPI/image-to-video'],
    component: 'AIEffectsApp',
    originalPath: '/new-page/AI-EFFECTS',
    embedMode: 'inline',
    priority: 1,
    status: 'active'
  },
  {
    id: 'image-enhancer',
    name: 'AI图像增强',
    description: '使用AI技术增强图像质量',
    icon: '✨',
    toolCategories: ['image'],
    apiEndpoints: ['/api/runninghubAPI/Image-Enhancer'],
    component: 'ImageEnhancerApp',
    originalPath: '/new-page/image-editor/AI-Image-Enhancer',
    embedMode: 'inline',
    priority: 2,
    status: 'active'
  },
  {
    id: 'qwen-edit',
    name: 'Qwen图像编辑',
    description: '基于Qwen的智能图像编辑',
    icon: '🎨',
    toolCategories: ['image'],
    apiEndpoints: ['/api/runninghubAPI/qwen-image-edit'],
    component: 'QwenEditApp',
    originalPath: '/new-page/image-editor/qwen-image-edit',
    embedMode: 'inline',
    priority: 3,
    status: 'active'
  }
];
```

### 工具配置扩展

扩展现有的 `src/config/tools.ts`：

```typescript
// 在现有ToolConfig基础上添加
interface ToolConfig {
  // ... 现有属性
  
  // 新增应用关联
  relatedApps?: string[];        // 相关应用ID列表
}

// 更新工具配置，添加应用关联
export const TOOLS_CONFIG: ToolConfig[] = [
  {
    id: 'text-to-image',
    // ... 现有配置
    relatedApps: ['ai-effects', 'image-enhancer']
  },
  {
    id: 'image-to-video', 
    // ... 现有配置
    relatedApps: ['ai-effects']
  },
  // ... 其他工具配置
];
```

## Error Handling

### 迁移风险控制

1. **分步迁移** - 逐个组件迁移，每步验证功能正常
2. **Import检查** - 使用TypeScript编译检查确保所有引用正确更新
3. **功能测试** - 每次迁移后测试对应功能
4. **回滚准备** - 保留原文件直到确认迁移成功

### 潜在问题处理

1. **相对路径问题** - 组件内部相对引用需要检查
2. **动态导入路径** - 确保lazy import路径正确
3. **构建错误** - 及时发现和修复TypeScript错误

## Testing Strategy

### 验证步骤

1. **编译验证**
   ```bash
   npm run build
   # 确保没有TypeScript错误
   ```

2. **功能验证**
   ```bash
   npm run dev
   # 访问 /ai-tools 页面
   # 测试工具切换功能
   # 验证所有工具正常加载
   ```

3. **回归测试**
   - 验证所有AI工具页面正常工作
   - 确认工作区布局和交互正常
   - 测试API提供商选择功能

## Implementation Benefits

### 架构优势

1. **符合设计原则** - 遵循架构文档中定义的分层和模块化原则
2. **提升内聚性** - AI工具相关组件统一管理，便于维护
3. **消除命名歧义** - workspace组件明确归属于ai-tools模块
4. **便于扩展** - 新增AI工具功能时结构清晰

### 开发体验改进

1. **更直观的文件组织** - 开发者能快速定位AI工具相关组件
2. **更好的代码组织** - 相关功能聚集，减少跨目录查找
3. **更强的一致性** - 与架构文档保持一致，便于团队协作

### 维护性提升

1. **单一职责** - ai-tools目录专门管理AI工具相关组件
2. **清晰边界** - 组件职责和归属更加明确
3. **便于重构** - 未来优化时影响范围更可控

## Migration Strategy

### 分阶段实施策略

#### 第一阶段：快速上线（当前实施）
1. **组件整合** - 将workspace组件迁移到ai-tools模块
2. **应用嵌入** - 通过包装组件将new-page应用集成到工具区
3. **重定向设置** - 保持原有路径可访问，设置重定向到工具区
4. **功能验证** - 确保所有功能正常工作

**优势：**
- 快速实现统一的工具区体验
- 保持向后兼容性
- 降低实施风险

#### 第二阶段：路径统一（后期优化）
1. **标准化路径** - 将所有应用迁移到 `/ai-tools/applications/[app-id]`
2. **页面重构** - 按照统一标准重构应用页面
3. **清理冗余** - 删除原有的new-page目录
4. **更新重定向** - 修改重定向规则指向新路径

**最终目标结构：**
```
src/app/[locale]/(default)/ai-tools/
├── page.tsx                     # 工具区主页
├── applications/                # 统一的应用页面目录
│   ├── ai-effects/
│   │   └── page.tsx            # AI特效应用页面
│   ├── image-enhancer/
│   │   └── page.tsx            # 图像增强应用页面
│   └── qwen-edit/
│       └── page.tsx            # Qwen编辑应用页面
└── [category]/                  # 工具分类页面（现有）
    └── [tool]/
        └── page.tsx
```

### 新应用开发规范

#### 统一开发流程
1. **应用配置** - 在 `src/config/applications.ts` 中添加配置
2. **页面创建** - 在 `/ai-tools/applications/[app-id]/` 下创建页面
3. **组件包装** - 在 `src/components/ai-tools/applications/` 下创建包装组件
4. **工具关联** - 在工具配置中添加应用关联

#### 开发工具支持
- 扩展 `scripts/create-tool.js` 支持应用创建
- 创建专门的 `scripts/create-app.js` 脚本
- 提供应用开发模板和最佳实践指南

### 迁移原则

1. **分阶段实施** - 先快速上线，后优化统一
2. **保持兼容性** - 确保用户和SEO不受影响
3. **逐步优化** - 在稳定运行基础上进行结构优化
4. **标准化管理** - 建立统一的开发和维护规范