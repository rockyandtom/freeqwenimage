#!/usr/bin/env node

/**
 * 测试首页工具入口更新
 * 验证导航菜单和工具链接是否正确更新到新的统一路径
 */

const fs = require('fs');
const path = require('path');

console.log('🏠 测试首页工具入口更新...\n');

// 检查英文配置文件
const enConfigPath = path.join(__dirname, '../src/i18n/pages/landing/en.json');
const zhConfigPath = path.join(__dirname, '../src/i18n/pages/landing/zh.json');

function checkConfig(configPath, language) {
  console.log(`📄 检查${language}配置文件: ${path.basename(configPath)}`);
  
  if (!fs.existsSync(configPath)) {
    console.log(`   ❌ 配置文件不存在`);
    return false;
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
  // 检查导航菜单
  const navItems = config.header.nav.items;
  let hasAITools = false;
  let hasPopularTools = false;
  let hasOldLinks = false;

  navItems.forEach(item => {
    if (item.title.includes('AI Tools') || item.title.includes('AI工具')) {
      hasAITools = true;
      console.log(`   ✅ 找到AI工具菜单: ${item.title}`);
      
      // 检查子菜单
      item.children.forEach(child => {
        if (child.url.startsWith('/ai-tools')) {
          console.log(`      ✅ 子菜单链接正确: ${child.title} -> ${child.url}`);
        } else {
          console.log(`      ❌ 子菜单链接错误: ${child.title} -> ${child.url}`);
        }
      });
    }
    
    if (item.title.includes('Popular Tools') || item.title.includes('热门工具')) {
      hasPopularTools = true;
      console.log(`   ✅ 找到热门工具菜单: ${item.title}`);
    }
    
    // 检查是否还有旧链接
    if (item.url && (item.url.includes('/new-page') || item.url.includes('AI-EFFECTS'))) {
      hasOldLinks = true;
      console.log(`   ❌ 发现旧链接: ${item.title} -> ${item.url}`);
    }
    
    if (item.children) {
      item.children.forEach(child => {
        if (child.url.includes('/new-page') || child.url.includes('AI-EFFECTS')) {
          hasOldLinks = true;
          console.log(`   ❌ 发现旧子菜单链接: ${child.title} -> ${child.url}`);
        }
      });
    }
  });

  // 检查页脚
  const footerItems = config.footer.nav.items;
  let footerHasOldLinks = false;

  footerItems.forEach(section => {
    if (section.children) {
      section.children.forEach(child => {
        if (child.url.includes('/new-page') || child.url.includes('AI-EFFECTS')) {
          footerHasOldLinks = true;
          console.log(`   ❌ 页脚发现旧链接: ${child.title} -> ${child.url}`);
        }
      });
    }
  });

  console.log(`   📊 检查结果:`);
  console.log(`      - AI工具菜单: ${hasAITools ? '✅' : '❌'}`);
  console.log(`      - 热门工具菜单: ${hasPopularTools ? '✅' : '❌'}`);
  console.log(`      - 导航无旧链接: ${!hasOldLinks ? '✅' : '❌'}`);
  console.log(`      - 页脚无旧链接: ${!footerHasOldLinks ? '✅' : '❌'}`);
  
  return hasAITools && hasPopularTools && !hasOldLinks && !footerHasOldLinks;
}

// 检查AI生成器组件
function checkAIGeneratorComponent() {
  console.log(`\n🎨 检查AI生成器组件工具入口...`);
  
  const componentPath = path.join(__dirname, '../src/components/AI Image/index.tsx');
  
  if (!fs.existsSync(componentPath)) {
    console.log(`   ❌ AI生成器组件不存在`);
    return false;
  }

  const componentContent = fs.readFileSync(componentPath, 'utf8');
  
  // 检查是否包含工具集合页面入口
  const hasToolsEntry = componentContent.includes('Discover More AI Tools');
  const hasAllToolsButton = componentContent.includes('/ai-tools');
  const hasImageToolsButton = componentContent.includes('/ai-tools/image');
  const hasVideoToolsButton = componentContent.includes('/ai-tools/video');

  console.log(`   📊 检查结果:`);
  console.log(`      - 工具发现区域: ${hasToolsEntry ? '✅' : '❌'}`);
  console.log(`      - 所有工具按钮: ${hasAllToolsButton ? '✅' : '❌'}`);
  console.log(`      - 图像工具按钮: ${hasImageToolsButton ? '✅' : '❌'}`);
  console.log(`      - 视频工具按钮: ${hasVideoToolsButton ? '✅' : '❌'}`);

  return hasToolsEntry && hasAllToolsButton && hasImageToolsButton && hasVideoToolsButton;
}

// 执行检查
const enResult = checkConfig(enConfigPath, '英文');
console.log('');
const zhResult = checkConfig(zhConfigPath, '中文');
const componentResult = checkAIGeneratorComponent();

console.log('\n🎯 首页工具入口更新验证结果:');
console.log(`- 英文配置: ${enResult ? '✅ 通过' : '❌ 失败'}`);
console.log(`- 中文配置: ${zhResult ? '✅ 通过' : '❌ 失败'}`);
console.log(`- AI生成器组件: ${componentResult ? '✅ 通过' : '❌ 失败'}`);

const allPassed = enResult && zhResult && componentResult;
console.log(`\n📋 总体结果: ${allPassed ? '✅ 所有检查通过' : '❌ 部分检查失败'}`);

if (allPassed) {
  console.log('\n🎉 首页工具入口更新成功!');
  console.log('💡 用户现在可以通过以下方式发现工具:');
  console.log('   - 导航菜单中的"AI工具"和"热门工具"');
  console.log('   - AI生成器底部的工具发现区域');
  console.log('   - 所有旧链接都已重定向到新路径');
} else {
  console.log('\n⚠️  请检查失败的项目并进行修复');
}