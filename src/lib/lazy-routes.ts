import { lazy } from 'react';

// 懒加载工具页面组件
export const LazyToolPages = {
  // 图像工具页面
  'text-to-image': lazy(() => import('@/app/[locale]/(default)/ai-tools/image/text-to-image/page')),
  'image-to-image': lazy(() => import('@/app/[locale]/(default)/ai-tools/image/image-to-image/page')),
  'image-enhancer': lazy(() => import('@/app/[locale]/(default)/ai-tools/image/image-enhancer/page')),
  
  // 视频工具页面
  'image-to-video': lazy(() => import('@/app/[locale]/(default)/ai-tools/video/image-to-video/page')),
  
  // 分类页面
  'image-tools': lazy(() => import('@/app/[locale]/(default)/ai-tools/image/page')),
  'video-tools': lazy(() => import('@/app/[locale]/(default)/ai-tools/video/page')),
  'ai-tools-main': lazy(() => import('@/app/[locale]/(default)/ai-tools/page')),
} as const;

// 懒加载工具组件
export const LazyToolComponents = {
  'text-to-image': lazy(() => import('@/components/tools/text-to-image/text-to-image-tool')),
  'image-to-image': lazy(() => import('@/components/tools/image-to-image/image-to-image-tool')),
  'image-enhancer': lazy(() => import('@/components/tools/image-enhancer/image-enhancer-tool')),
  'image-to-video': lazy(() => import('@/components/tools/image-to-video/image-to-video-tool')),
} as const;

// 懒加载UI组件
export const LazyUIComponents = {
  'tool-navigation': lazy(() => import('@/components/ai-tools/tool-navigation')),
  'tool-grid': lazy(() => import('@/components/ai-tools/tool-grid')),
  'tool-card': lazy(() => import('@/components/ai-tools/tool-card')),
  'mobile-quick-actions': lazy(() => import('@/components/ai-tools/mobile-quick-actions')),
} as const;

// 懒加载区块组件
export const LazyBlockComponents = {
  'hero-bg': lazy(() => import('@/components/blocks/hero/bg')),
} as const;

// 工具类型定义
export type ToolPageId = keyof typeof LazyToolPages;
export type ToolComponentId = keyof typeof LazyToolComponents;
export type UIComponentId = keyof typeof LazyUIComponents;
export type BlockComponentId = keyof typeof LazyBlockComponents;

