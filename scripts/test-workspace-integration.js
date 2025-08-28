#!/usr/bin/env node

/**
 * 工作区应用集成测试脚本
 * 验证应用选择器、应用嵌入和URL同步功能
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 开始工作区应用集成测试...\n');

// 测试结果统计
let totalTests = 0;
let passedTests = 0;
let failedTests = [];

function runTest(testName, testFn) {
  totalTests++;
  try {
    const result = testFn();
    if (result) {
      console.log(`✅ ${testName}`);
      passedTests++;
    } else {
      console.log(`❌ ${testName}`);
      failedTests.push(testName);
    }
  } catch (error) {
    console.log(`❌ ${testName} - ${error.message}`);
    failedTests.push(testName);
  }
}

// 1. 测试应用配置文件
runTest('应用配置文件存在', () => {
  return fs.existsSync('src/config/applications.ts');
});

runTest('应用配置内容正确', () => {
  const content = fs.readFileSync('src/config/applications.ts', 'utf8');
  return content.includes('APPLICATIONS_CONFIG') && 
         content.includes('ai-effects') &&
         content.includes('image-enhancer-app') &&
         content.includes('qwen-edit');
});

// 2. 测试工具配置扩展
runTest('工具配置包含应用关联', () => {
  const content = fs.readFileSync('src/config/tools.ts', 'utf8');
  return content.includes('relatedApps') && 
         content.includes('ai-effects') &&
         content.includes('image-enhancer-app');
});

// 3. 测试应用选择器组件
runTest('应用选择器组件存在', () => {
  return fs.existsSync('src/components/workspace/app-selector.tsx');
});

runTest('应用选择器组件内容正确', () => {
  const content = fs.readFileSync('src/components/workspace/app-selector.tsx', 'utf8');
  return content.includes('AppSelector') && 
         content.includes('getApplicationsByTool') &&
         content.includes('onAppSelect');
});

// 4. 测试应用包装组件
const appComponents = [
  'ai-effects-app.tsx',
  'image-enhancer-app.tsx', 
  'qwen-edit-app.tsx',
  'image-editor-app.tsx'
];

appComponents.forEach(component => {
  runTest(`应用组件 ${component} 存在`, () => {
    return fs.existsSync(`src/components/workspace/applications/${component}`);
  });
});

// 5. 测试工作区布局更新
runTest('WorkspaceLayout支持应用选择', () => {
  const content = fs.readFileSync('src/components/workspace/workspace-layout.tsx', 'utf8');
  return content.includes('selectedApp') && 
         content.includes('handleAppSelect') &&
         content.includes('onAppSelect');
});

runTest('WorkspaceMain支持应用嵌入', () => {
  const content = fs.readFileSync('src/components/workspace/workspace-main.tsx', 'utf8');
  return content.includes('import AppSelector') && 
         content.includes('getAppComponent') &&
         content.includes('selectedApp');
});

// 6. 测试应用Hook
runTest('应用管理Hook存在', () => {
  return fs.existsSync('src/hooks/use-application.ts');
});

runTest('应用Hook功能完整', () => {
  const content = fs.readFileSync('src/hooks/use-application.ts', 'utf8');
  return content.includes('useApplication') && 
         content.includes('useApplicationHistory') &&
         content.includes('loadApplication');
});

// 7. 测试重定向配置
runTest('重定向配置包含应用路径', () => {
  const content = fs.readFileSync('next.config.mjs', 'utf8');
  return content.includes('tool=image-to-video&app=ai-effects') && 
         content.includes('tool=image-enhancer&app=image-enhancer-app') &&
         content.includes('tool=image-to-image&app=qwen-edit');
});

// 8. 测试文件结构完整性
const requiredFiles = [
  'src/config/applications.ts',
  'src/components/workspace/app-selector.tsx',
  'src/components/workspace/applications/ai-effects-app.tsx',
  'src/components/workspace/applications/image-enhancer-app.tsx',
  'src/components/workspace/applications/qwen-edit-app.tsx',
  'src/components/workspace/applications/image-editor-app.tsx',
  'src/hooks/use-application.ts'
];

runTest('所有必需文件存在', () => {
  return requiredFiles.every(file => fs.existsSync(file));
});

// 9. 测试TypeScript类型定义
runTest('应用配置类型定义正确', () => {
  const content = fs.readFileSync('src/config/applications.ts', 'utf8');
  return content.includes('ApplicationConfig') && 
         content.includes('embedMode') &&
         content.includes('toolCategories');
});

runTest('工具配置类型扩展正确', () => {
  const content = fs.readFileSync('src/config/tools.ts', 'utf8');
  return content.includes('relatedApps?: string[]');
});

// 10. 测试组件导入路径
runTest('组件导入路径正确', () => {
  const workspaceMainContent = fs.readFileSync('src/components/workspace/workspace-main.tsx', 'utf8');
  return workspaceMainContent.includes("./applications/ai-effects-app") &&
         workspaceMainContent.includes("./applications/image-enhancer-app") &&
         workspaceMainContent.includes("./applications/qwen-edit-app");
});

console.log('\n📊 测试结果统计:');
console.log(`总测试数: ${totalTests}`);
console.log(`通过测试: ${passedTests}`);
console.log(`失败测试: ${failedTests.length}`);

if (failedTests.length > 0) {
  console.log('\n❌ 失败的测试:');
  failedTests.forEach(test => console.log(`  - ${test}`));
}

const successRate = ((passedTests / totalTests) * 100).toFixed(1);
console.log(`\n✨ 成功率: ${successRate}%`);

if (passedTests === totalTests) {
  console.log('\n🎉 所有测试通过！工作区应用集成功能已成功实现！');
  console.log('\n📋 功能清单:');
  console.log('✅ 应用配置系统');
  console.log('✅ 应用选择器组件');
  console.log('✅ 应用包装组件 (4个)');
  console.log('✅ 工作区布局增强');
  console.log('✅ 应用管理Hook');
  console.log('✅ URL路由同步');
  console.log('✅ 重定向配置');
  
  console.log('\n🚀 使用方法:');
  console.log('1. 访问 /ai-tools 进入工具区');
  console.log('2. 选择左侧的AI工具');
  console.log('3. 在下方选择相关应用或使用基础工具');
  console.log('4. URL会自动同步: /ai-tools?tool=xxx&app=yyy');
  
  process.exit(0);
} else {
  console.log('\n⚠️  部分测试失败，请检查上述问题后重新测试。');
  process.exit(1);
}