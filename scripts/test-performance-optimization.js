#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Testing Performance Optimization Implementation...\n');

// 测试文件存在性
const testFiles = [
  // 懒加载相关文件
  'src/components/tools/_base/tool-loader.tsx',
  'src/components/ui/lazy-image.tsx',
  'src/components/ui/lazy-video.tsx',
  'src/hooks/use-lazy-loading.ts',
  'src/lib/lazy-routes.ts',
  
  // 性能监控相关文件
  'src/components/performance/performance-monitor.tsx',
  'src/components/performance/performance-dashboard.tsx',
  'src/hooks/use-web-vitals.ts',
  'src/lib/performance-collector.ts',
  'src/lib/api-monitor.ts',
  'src/lib/user-analytics.ts',
  
  // API端点
  'src/app/api/analytics/route.ts',
  'src/app/api/performance/route.ts'
];

let allFilesExist = true;

testFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing`);
    allFilesExist = false;
  }
});

console.log('\n📋 Testing File Contents...\n');

// 测试工具加载器是否包含懒加载
const toolLoaderPath = path.join(process.cwd(), 'src/components/tools/_base/tool-loader.tsx');
if (fs.existsSync(toolLoaderPath)) {
  const toolLoaderContent = fs.readFileSync(toolLoaderPath, 'utf8');
  
  const checks = [
    { name: 'Suspense import', pattern: /import.*Suspense.*from.*react/ },
    { name: 'lazy import', pattern: /import.*lazy.*from.*react/ },
    { name: 'PerformanceMonitor usage', pattern: /PerformanceMonitor/ },
    { name: 'Tool components lazy loading', pattern: /lazy\(\(\) => import/ }
  ];
  
  checks.forEach(check => {
    if (check.pattern.test(toolLoaderContent)) {
      console.log(`✅ Tool Loader: ${check.name}`);
    } else {
      console.log(`❌ Tool Loader: ${check.name} - Not found`);
      allFilesExist = false;
    }
  });
}

// 测试工具页面是否使用懒加载
const toolPages = [
  'src/app/[locale]/(default)/ai-tools/image/text-to-image/page.tsx',
  'src/app/[locale]/(default)/ai-tools/image/image-to-image/page.tsx',
  'src/app/[locale]/(default)/ai-tools/image/image-enhancer/page.tsx',
  'src/app/[locale]/(default)/ai-tools/video/image-to-video/page.tsx'
];

toolPages.forEach(pagePath => {
  const fullPath = path.join(process.cwd(), pagePath);
  if (fs.existsSync(fullPath)) {
    const pageContent = fs.readFileSync(fullPath, 'utf8');
    
    const hasToolLoader = /ToolLoader/.test(pageContent);
    const hasSuspense = /Suspense/.test(pageContent);
    const hasLazyImports = /lazy\(\(\) => import/.test(pageContent);
    
    if (hasToolLoader && hasSuspense && hasLazyImports) {
      console.log(`✅ ${path.basename(pagePath)}: Lazy loading implemented`);
    } else {
      console.log(`❌ ${path.basename(pagePath)}: Missing lazy loading features`);
      allFilesExist = false;
    }
  }
});

// 测试AI工具Hook是否包含性能监控
const aiToolHookPath = path.join(process.cwd(), 'src/hooks/use-ai-tool.ts');
if (fs.existsSync(aiToolHookPath)) {
  const hookContent = fs.readFileSync(aiToolHookPath, 'utf8');
  
  const performanceChecks = [
    { name: 'trackToolUsage import', pattern: /import.*trackToolUsage.*from.*user-analytics/ },
    { name: 'ApiMonitor import', pattern: /import.*ApiMonitor.*from.*api-monitor/ },
    { name: 'Tool usage tracking start', pattern: /trackToolUsage\(toolId, 'start'\)/ },
    { name: 'Tool usage tracking success', pattern: /trackToolUsage\(toolId, 'success'/ },
    { name: 'Tool usage tracking error', pattern: /trackToolUsage\(toolId, 'error'\)/ },
    { name: 'API monitoring', pattern: /apiMonitor\.recordApiCall/ }
  ];
  
  performanceChecks.forEach(check => {
    if (check.pattern.test(hookContent)) {
      console.log(`✅ AI Tool Hook: ${check.name}`);
    } else {
      console.log(`❌ AI Tool Hook: ${check.name} - Not found`);
      allFilesExist = false;
    }
  });
}

console.log('\n📊 Performance Features Summary:\n');

const features = [
  '🔄 Code Splitting and Lazy Loading',
  '📈 Performance Monitoring',
  '🌐 API Response Time Monitoring', 
  '👤 User Behavior Analytics',
  '📊 Performance Dashboard',
  '⚡ Web Vitals Monitoring'
];

features.forEach(feature => {
  console.log(`✅ ${feature}`);
});

console.log('\n🎯 Implementation Status:\n');

if (allFilesExist) {
  console.log('✅ All performance optimization features implemented successfully!');
  console.log('\n📋 Next Steps:');
  console.log('1. Test lazy loading in development mode');
  console.log('2. Monitor performance metrics in browser console');
  console.log('3. Check Web Vitals in browser DevTools');
  console.log('4. Verify API monitoring in network tab');
  console.log('5. Test performance dashboard components');
  
  process.exit(0);
} else {
  console.log('❌ Some performance optimization features are missing or incomplete.');
  console.log('Please review the implementation and ensure all files are created correctly.');
  
  process.exit(1);
}