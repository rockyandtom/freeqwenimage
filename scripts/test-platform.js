#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing AI Tools Platform Implementation...\n');

// Test file structure
const requiredFiles = [
  // Main pages
  'src/app/[locale]/(default)/ai-tools/page.tsx',
  'src/app/[locale]/(default)/ai-tools/image/page.tsx',
  'src/app/[locale]/(default)/ai-tools/video/page.tsx',
  'src/app/[locale]/(default)/ai-tools/image/image-to-image/page.tsx',
  'src/app/[locale]/(default)/ai-tools/video/image-to-video/page.tsx',
  
  // Components
  'src/components/ai-tools/tool-card.tsx',
  'src/components/ai-tools/tool-grid.tsx',
  'src/components/ai-tools/tool-navigation.tsx',
  'src/components/tools/image-to-image/image-to-image-tool.tsx',
  'src/components/tools/image-to-video/image-to-video-tool.tsx',
  'src/components/tools/_base/tool-layout.tsx',
  'src/components/tools/_base/tool-header.tsx',
  
  // APIs
  'src/app/api/tools/list/route.ts',
  'src/app/api/tools/[toolId]/route.ts',
  'src/app/api/tools/categories/route.ts',
  'src/app/api/runninghubAPI/image-to-image/route.ts',
  'src/app/api/runninghubAPI/image-to-video/route.ts',
  
  // Config and hooks
  'src/config/tools.ts',
  'src/hooks/use-ai-tool.ts',
  'src/components/ui/slider.tsx'
];

let passedTests = 0;
let totalTests = requiredFiles.length;

console.log('📁 Checking file structure...');
requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
    passedTests++;
  } else {
    console.log(`❌ ${file} - Missing`);
  }
});

console.log(`\n📊 File Structure Test: ${passedTests}/${totalTests} files found\n`);

// Test configuration
console.log('⚙️ Testing configuration...');
try {
  const toolsConfigPath = path.join(process.cwd(), 'src/config/tools.ts');
  if (fs.existsSync(toolsConfigPath)) {
    const configContent = fs.readFileSync(toolsConfigPath, 'utf8');
    
    // Check for required tools
    const requiredTools = ['text-to-image', 'image-enhancer', 'image-to-image', 'image-to-video'];
    let configTests = 0;
    
    requiredTools.forEach(tool => {
      if (configContent.includes(`id: '${tool}'`)) {
        console.log(`✅ Tool configured: ${tool}`);
        configTests++;
      } else {
        console.log(`❌ Tool missing: ${tool}`);
      }
    });
    
    console.log(`📊 Configuration Test: ${configTests}/${requiredTools.length} tools configured\n`);
  }
} catch (error) {
  console.log('❌ Error reading configuration:', error.message);
}

// Test API endpoints
console.log('🔌 Testing API structure...');
const apiEndpoints = [
  'src/app/api/tools/list/route.ts',
  'src/app/api/tools/categories/route.ts',
  'src/app/api/runninghubAPI/text-to-image/route.ts',
  'src/app/api/runninghubAPI/image-to-image/route.ts',
  'src/app/api/runninghubAPI/image-to-video/route.ts'
];

let apiTests = 0;
apiEndpoints.forEach(endpoint => {
  const filePath = path.join(process.cwd(), endpoint);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('export async function') && (content.includes('GET') || content.includes('POST'))) {
      console.log(`✅ API endpoint: ${endpoint}`);
      apiTests++;
    } else {
      console.log(`⚠️ API endpoint incomplete: ${endpoint}`);
    }
  } else {
    console.log(`❌ API endpoint missing: ${endpoint}`);
  }
});

console.log(`📊 API Test: ${apiTests}/${apiEndpoints.length} endpoints ready\n`);

// Test component structure
console.log('🧩 Testing component structure...');
const componentTests = [
  {
    file: 'src/components/ai-tools/tool-card.tsx',
    shouldContain: ['ToolCard', 'ToolConfig', 'export default']
  },
  {
    file: 'src/components/tools/image-to-image/image-to-image-tool.tsx',
    shouldContain: ['ImageToImageTool', 'useAITool', 'FormData']
  },
  {
    file: 'src/hooks/use-ai-tool.ts',
    shouldContain: ['useAITool', 'useState', 'useCallback']
  }
];

let componentTestsPassed = 0;
componentTests.forEach(test => {
  const filePath = path.join(process.cwd(), test.file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasAllRequired = test.shouldContain.every(item => content.includes(item));
    
    if (hasAllRequired) {
      console.log(`✅ Component structure: ${test.file}`);
      componentTestsPassed++;
    } else {
      console.log(`⚠️ Component incomplete: ${test.file}`);
      const missing = test.shouldContain.filter(item => !content.includes(item));
      console.log(`   Missing: ${missing.join(', ')}`);
    }
  } else {
    console.log(`❌ Component missing: ${test.file}`);
  }
});

console.log(`📊 Component Test: ${componentTestsPassed}/${componentTests.length} components ready\n`);

// Summary
const totalScore = passedTests + apiTests + componentTestsPassed;
const maxScore = totalTests + apiEndpoints.length + componentTests.length;

console.log('🎯 Implementation Summary:');
console.log(`📁 Files: ${passedTests}/${totalTests}`);
console.log(`🔌 APIs: ${apiTests}/${apiEndpoints.length}`);
console.log(`🧩 Components: ${componentTestsPassed}/${componentTests.length}`);
console.log(`📊 Overall: ${totalScore}/${maxScore} (${Math.round(totalScore/maxScore*100)}%)\n`);

if (totalScore === maxScore) {
  console.log('🎉 All tests passed! Platform implementation is complete.');
} else if (totalScore >= maxScore * 0.8) {
  console.log('✅ Platform implementation is mostly complete. Minor issues to address.');
} else {
  console.log('⚠️ Platform implementation needs more work. Please check the failed tests above.');
}

console.log('\n🚀 Next steps:');
console.log('1. Run `npm run dev` to start the development server');
console.log('2. Visit http://localhost:3000/ai-tools to test the platform');
console.log('3. Test individual tools and API endpoints');
console.log('4. Check mobile responsiveness');
console.log('5. Verify all links and navigation work correctly');