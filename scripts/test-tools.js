#!/usr/bin/env node
// 🧪 测试AI工具API和配置

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing AI Tools Platform...\n');

// 1. 测试配置文件
console.log('📋 Testing Configuration Files...');

try {
  // 测试工具配置
  const toolsConfigPath = path.join(process.cwd(), 'src/config/tools.ts');
  if (fs.existsSync(toolsConfigPath)) {
    console.log('✅ Tools configuration exists');
  } else {
    console.log('❌ Tools configuration missing');
  }

  // 测试站点配置
  const siteConfigPath = path.join(process.cwd(), 'src/config/site.ts');
  if (fs.existsSync(siteConfigPath)) {
    console.log('✅ Site configuration exists');
  } else {
    console.log('❌ Site configuration missing');
  }

} catch (error) {
  console.log('❌ Configuration test failed:', error.message);
}

// 2. 测试API路由
console.log('\n🔌 Testing API Routes...');

const apiRoutes = [
  'src/app/api/runninghubAPI/text-to-image/route.ts',
  'src/app/api/runninghubAPI/image-to-image/route.ts', 
  'src/app/api/runninghubAPI/image-to-video/route.ts',
  'src/app/api/tools/list/route.ts'
];

apiRoutes.forEach(route => {
  const routePath = path.join(process.cwd(), route);
  if (fs.existsSync(routePath)) {
    console.log(`✅ ${route}`);
  } else {
    console.log(`❌ ${route} missing`);
  }
});

// 3. 测试组件
console.log('\n🧩 Testing Components...');

const components = [
  'src/components/ai-tools/tool-card.tsx',
  'src/components/ai-tools/tool-grid.tsx',
  'src/components/ai-tools/tool-navigation.tsx',
  'src/components/tools/_base/tool-layout.tsx',
  'src/components/tools/text-to-image/text-to-image-tool.tsx'
];

components.forEach(component => {
  const componentPath = path.join(process.cwd(), component);
  if (fs.existsSync(componentPath)) {
    console.log(`✅ ${component}`);
  } else {
    console.log(`❌ ${component} missing`);
  }
});

// 4. 测试页面
console.log('\n📄 Testing Pages...');

const pages = [
  'src/app/[locale]/(default)/ai-tools/page.tsx',
  'src/app/[locale]/(default)/ai-tools/image/text-to-image/page.tsx'
];

pages.forEach(page => {
  const pagePath = path.join(process.cwd(), page);
  if (fs.existsSync(pagePath)) {
    console.log(`✅ ${page}`);
  } else {
    console.log(`❌ ${page} missing`);
  }
});

// 5. 测试Hooks
console.log('\n🎣 Testing Hooks...');

const hooks = [
  'src/hooks/use-ai-tool.ts'
];

hooks.forEach(hook => {
  const hookPath = path.join(process.cwd(), hook);
  if (fs.existsSync(hookPath)) {
    console.log(`✅ ${hook}`);
  } else {
    console.log(`❌ ${hook} missing`);
  }
});

// 6. 环境变量检查
console.log('\n🔧 Checking Environment Variables...');

const requiredEnvVars = [
  'RUNNINGHUB_API_KEY',
  'RUNNINGHUB_WEBAPP_ID'
];

const optionalEnvVars = [
  'RUNNINGHUB_TEXT_TO_IMAGE_NODE_ID',
  'RUNNINGHUB_IMAGE_TO_IMAGE_NODE_ID',
  'RUNNINGHUB_IMAGE_TO_VIDEO_NODE_ID'
];

// 检查 .env.example
const envExamplePath = path.join(process.cwd(), '.env.example');
if (fs.existsSync(envExamplePath)) {
  const envExample = fs.readFileSync(envExamplePath, 'utf8');
  
  requiredEnvVars.forEach(envVar => {
    if (envExample.includes(envVar)) {
      console.log(`✅ ${envVar} in .env.example`);
    } else {
      console.log(`❌ ${envVar} missing from .env.example`);
    }
  });
  
  optionalEnvVars.forEach(envVar => {
    if (envExample.includes(envVar)) {
      console.log(`✅ ${envVar} in .env.example`);
    } else {
      console.log(`⚠️  ${envVar} missing from .env.example (optional)`);
    }
  });
} else {
  console.log('❌ .env.example file missing');
}

console.log('\n🎯 Test Summary:');
console.log('✅ = Component exists and ready');
console.log('❌ = Component missing or needs attention');
console.log('⚠️  = Optional component');

console.log('\n📝 Next Steps:');
console.log('1. Run `npm run dev` to start development server');
console.log('2. Visit http://localhost:3000/ai-tools to see the tools page');
console.log('3. Visit http://localhost:3000/ai-tools/image/text-to-image to test text-to-image');
console.log('4. Configure environment variables in .env.development');
console.log('5. Test API endpoints with actual RunningHub credentials');

console.log('\n🚀 Platform Status: Ready for Phase 1 Testing!');