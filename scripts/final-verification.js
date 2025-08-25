#!/usr/bin/env node

/**
 * 最终验证脚本：确保 AI Image Enhancer 配置完全正确
 */

require('dotenv').config({ path: '.env.development' });

async function finalVerification() {
  console.log('🔍 Final verification of AI Image Enhancer configuration...\n');

  // 1. 检查环境变量
  console.log('1. Environment Variables Check:');
  const requiredVars = {
    'RUNNINGHUB_API_KEY': 'fb88fac46b0349c1986c9cbb4f14d44e',
    'RUNNINGHUB_WEBAPP_ID': '1958797744955613186',
    'RUNNINGHUB_NODE_ID': '2'
  };

  let envOk = true;
  for (const [key, expectedValue] of Object.entries(requiredVars)) {
    const actualValue = process.env[key];
    if (actualValue === expectedValue) {
      console.log(`   ✅ ${key}: ${actualValue}`);
    } else {
      console.log(`   ❌ ${key}: Expected "${expectedValue}", got "${actualValue}"`);
      envOk = false;
    }
  }

  if (!envOk) {
    console.log('\n❌ Environment variables are not correctly configured!');
    return;
  }

  // 2. 检查 API 路由文件
  console.log('\n2. API Route Files Check:');
  const fs = require('fs');
  const path = require('path');

  const routeFiles = [
    'src/app/api/runninghubAPI/upload/route.ts',
    'src/app/api/runninghubAPI/Image-Enhancer/route.ts',
    'src/app/api/runninghubAPI/status/route.ts'
  ];

  for (const file of routeFiles) {
    if (fs.existsSync(file)) {
      console.log(`   ✅ ${file} exists`);
    } else {
      console.log(`   ❌ ${file} missing`);
      envOk = false;
    }
  }

  // 3. 检查组件文件
  console.log('\n3. Component Files Check:');
  const componentFile = 'src/components/ai-image-enhancer.tsx';
  if (fs.existsSync(componentFile)) {
    console.log(`   ✅ ${componentFile} exists`);
  } else {
    console.log(`   ❌ ${componentFile} missing`);
    envOk = false;
  }

  // 4. 检查页面文件
  console.log('\n4. Page Files Check:');
  const pageFile = 'src/app/[locale]/(default)/new-page/image-editor/AI-Image-Enhancer/page.tsx';
  if (fs.existsSync(pageFile)) {
    console.log(`   ✅ ${pageFile} exists`);
  } else {
    console.log(`   ❌ ${pageFile} missing`);
    envOk = false;
  }

  // 5. 检查 Next.js 配置
  console.log('\n5. Next.js Configuration Check:');
  const nextConfigFile = 'next.config.mjs';
  if (fs.existsSync(nextConfigFile)) {
    const configContent = fs.readFileSync(nextConfigFile, 'utf8');
    if (configContent.includes('rh-images.xiaoyaoyou.com')) {
      console.log(`   ✅ Image domain configured in ${nextConfigFile}`);
    } else {
      console.log(`   ⚠️  Image domain not found in ${nextConfigFile}`);
    }
  } else {
    console.log(`   ❌ ${nextConfigFile} missing`);
  }

  console.log('\n' + '='.repeat(60));

  if (envOk) {
    console.log('✅ All configurations are correct!');
    console.log('\n🚀 Ready to use AI Image Enhancer:');
    console.log('   1. Start the development server: npm run dev');
    console.log('   2. Visit: http://localhost:3000/[locale]/new-page/image-editor/AI-Image-Enhancer');
    console.log('   3. Upload an image and click "Enhance Image"');
    
    console.log('\n🧪 Available test commands:');
    console.log('   - npm run test:env    # Check environment variables');
    console.log('   - npm run test:curl   # Verify curl command match');
    console.log('   - npm run test:api    # Test full API workflow');
  } else {
    console.log('❌ Some configurations are incorrect!');
    console.log('Please fix the issues above before using AI Image Enhancer.');
  }
}

finalVerification();