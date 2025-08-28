#!/usr/bin/env node

/**
 * 移动端优化验证脚本
 * 验证任务6的完成情况
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 验证移动端优化实现...\n');

const checks = [];

// 检查移动端优化组件是否存在
function checkMobileComponents() {
  const components = [
    'src/components/tools/_base/mobile-file-upload.tsx',
    'src/components/tools/_base/mobile-progress.tsx', 
    'src/components/tools/_base/mobile-result-display.tsx',
    'src/components/ai-tools/mobile-quick-actions.tsx'
  ];

  components.forEach(component => {
    const filePath = path.join(process.cwd(), component);
    if (fs.existsSync(filePath)) {
      checks.push({ name: `✅ ${component}`, status: 'PASS' });
    } else {
      checks.push({ name: `❌ ${component}`, status: 'FAIL' });
    }
  });
}

// 检查工具组件是否已更新为移动端优化版本
function checkToolComponents() {
  const toolComponents = [
    'src/components/tools/text-to-image/text-to-image-tool.tsx',
    'src/components/tools/image-to-image/image-to-image-tool.tsx',
    'src/components/tools/image-enhancer/image-enhancer-tool.tsx',
    'src/components/tools/image-to-video/image-to-video-tool.tsx'
  ];

  toolComponents.forEach(component => {
    const filePath = path.join(process.cwd(), component);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // 检查是否包含移动端优化组件的导入
      const hasMobileImports = content.includes('MobileFileUpload') || 
                              content.includes('MobileProgress') || 
                              content.includes('MobileResultDisplay');
      
      // 检查是否包含响应式类名
      const hasResponsiveClasses = content.includes('sm:') || content.includes('md:') || content.includes('lg:');
      
      if (hasMobileImports && hasResponsiveClasses) {
        checks.push({ name: `✅ ${component} - 移动端优化`, status: 'PASS' });
      } else {
        checks.push({ name: `❌ ${component} - 移动端优化`, status: 'FAIL' });
      }
    } else {
      checks.push({ name: `❌ ${component} - 文件不存在`, status: 'FAIL' });
    }
  });
}

// 检查基础布局组件是否已优化
function checkBaseComponents() {
  const baseComponents = [
    'src/components/tools/_base/tool-layout.tsx',
    'src/components/tools/_base/tool-header.tsx'
  ];

  baseComponents.forEach(component => {
    const filePath = path.join(process.cwd(), component);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // 检查是否包含响应式设计
      const hasResponsiveDesign = content.includes('sm:') && (content.includes('px-4') || content.includes('p-3 sm:p-4'));
      
      if (hasResponsiveDesign) {
        checks.push({ name: `✅ ${component} - 响应式设计`, status: 'PASS' });
      } else {
        checks.push({ name: `❌ ${component} - 响应式设计`, status: 'FAIL' });
      }
    } else {
      checks.push({ name: `❌ ${component} - 文件不存在`, status: 'FAIL' });
    }
  });
}

// 检查导航组件是否已优化
function checkNavigationComponents() {
  const navComponents = [
    'src/components/ai-tools/tool-navigation.tsx',
    'src/components/ai-tools/tool-card.tsx',
    'src/components/ai-tools/tool-grid.tsx'
  ];

  navComponents.forEach(component => {
    const filePath = path.join(process.cwd(), component);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // 检查是否包含移动端特定的布局优化
      const hasMobileOptimization = content.includes('sm:hidden') || 
                                   content.includes('grid-cols-1') ||
                                   content.includes('flex-col sm:flex-row');
      
      if (hasMobileOptimization) {
        checks.push({ name: `✅ ${component} - 移动端导航优化`, status: 'PASS' });
      } else {
        checks.push({ name: `❌ ${component} - 移动端导航优化`, status: 'FAIL' });
      }
    } else {
      checks.push({ name: `❌ ${component} - 文件不存在`, status: 'FAIL' });
    }
  });
}

// 检查移动端特性
function checkMobileFeatures() {
  const mobileFileUpload = path.join(process.cwd(), 'src/components/tools/_base/mobile-file-upload.tsx');
  
  if (fs.existsSync(mobileFileUpload)) {
    const content = fs.readFileSync(mobileFileUpload, 'utf8');
    
    // 检查相机支持
    const hasCameraSupport = content.includes('capture="environment"') && content.includes('supportCamera');
    
    // 检查触摸友好的界面
    const hasTouchFriendly = content.includes('h-12') || content.includes('p-3');
    
    if (hasCameraSupport) {
      checks.push({ name: '✅ 相机拍照支持', status: 'PASS' });
    } else {
      checks.push({ name: '❌ 相机拍照支持', status: 'FAIL' });
    }
    
    if (hasTouchFriendly) {
      checks.push({ name: '✅ 触摸友好界面', status: 'PASS' });
    } else {
      checks.push({ name: '❌ 触摸友好界面', status: 'FAIL' });
    }
  }

  // 检查浮动进度指示器
  const mobileProgress = path.join(process.cwd(), 'src/components/tools/_base/mobile-progress.tsx');
  if (fs.existsSync(mobileProgress)) {
    const content = fs.readFileSync(mobileProgress, 'utf8');
    const hasFloatingProgress = content.includes('FloatingProgress') && content.includes('fixed bottom-4');
    
    if (hasFloatingProgress) {
      checks.push({ name: '✅ 浮动进度指示器', status: 'PASS' });
    } else {
      checks.push({ name: '❌ 浮动进度指示器', status: 'FAIL' });
    }
  }
}

// 运行所有检查
function runAllChecks() {
  console.log('📱 检查移动端优化组件...');
  checkMobileComponents();
  
  console.log('\n🔧 检查工具组件优化...');
  checkToolComponents();
  
  console.log('\n🏗️ 检查基础组件优化...');
  checkBaseComponents();
  
  console.log('\n🧭 检查导航组件优化...');
  checkNavigationComponents();
  
  console.log('\n✨ 检查移动端特性...');
  checkMobileFeatures();
}

// 显示结果
function showResults() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 移动端优化验证结果');
  console.log('='.repeat(60));
  
  const passed = checks.filter(check => check.status === 'PASS').length;
  const failed = checks.filter(check => check.status === 'FAIL').length;
  
  checks.forEach(check => {
    console.log(check.name);
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ 通过: ${passed}`);
  console.log(`❌ 失败: ${failed}`);
  console.log(`📊 总计: ${checks.length}`);
  
  const successRate = ((passed / checks.length) * 100).toFixed(1);
  console.log(`🎯 成功率: ${successRate}%`);
  
  if (failed === 0) {
    console.log('\n🎉 所有移动端优化检查都已通过！');
    console.log('📱 移动端体验优化已完成');
  } else {
    console.log(`\n⚠️  还有 ${failed} 项需要修复`);
  }
  
  console.log('\n' + '='.repeat(60));
}

// 主函数
function main() {
  try {
    runAllChecks();
    showResults();
    
    // 如果有失败的检查，退出码为1
    const failed = checks.filter(check => check.status === 'FAIL').length;
    process.exit(failed > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('❌ 验证过程中出现错误:', error.message);
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = { main, checks };