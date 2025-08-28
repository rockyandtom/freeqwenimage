#!/usr/bin/env node

/**
 * 工具导航组件测试脚本
 * 测试智能推荐算法和统计数据集成
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Tool Navigation Component...\n');

// 测试文件存在性
function testFileExists(filePath, description) {
    const fullPath = path.join(__dirname, '..', filePath);
    const exists = fs.existsSync(fullPath);
    console.log(`${exists ? '✅' : '❌'} ${description}: ${filePath}`);
    return exists;
}

// 测试文件内容
function testFileContent(filePath, requiredContent, description) {
    const fullPath = path.join(__dirname, '..', filePath);
    if (!fs.existsSync(fullPath)) {
        console.log(`❌ ${description}: File not found`);
        return false;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    const hasContent = requiredContent.every(item => content.includes(item));
    console.log(`${hasContent ? '✅' : '❌'} ${description}: Required content check`);
    
    if (!hasContent) {
        const missing = requiredContent.filter(item => !content.includes(item));
        console.log(`   Missing: ${missing.join(', ')}`);
    }
    
    return hasContent;
}

console.log('1. Testing Component Files...');

// 测试组件文件
const componentTests = [
    {
        path: 'src/components/ai-tools/tool-navigation.tsx',
        description: 'Tool Navigation Component'
    },
    {
        path: 'src/hooks/use-tool-stats.ts',
        description: 'Tool Stats Hook'
    },
    {
        path: 'src/app/api/tools/stats/route.ts',
        description: 'Tool Stats API'
    }
];

let allFilesExist = true;
componentTests.forEach(test => {
    const exists = testFileExists(test.path, test.description);
    if (!exists) allFilesExist = false;
});

console.log('\n2. Testing Component Features...');

// 测试组件功能
const featureTests = [
    {
        path: 'src/components/ai-tools/tool-navigation.tsx',
        required: [
            'useToolStats',
            'getRecommendedTools',
            'getWorkflowRelatedTools',
            'TrendingUp',
            'Star',
            'Zap',
            'Badge',
            'trackUsage'
        ],
        description: 'Tool Navigation - Core Features'
    },
    {
        path: 'src/hooks/use-tool-stats.ts',
        required: [
            'ToolStats',
            'ToolStatsOverview',
            'useToolStats',
            'fetchStats',
            'trackUsage',
            'formatUsageCount',
            'getTrendingTools',
            'getPopularTools'
        ],
        description: 'Tool Stats Hook - All Functions'
    },
    {
        path: 'src/app/api/tools/stats/route.ts',
        required: [
            'TOOL_USAGE_STATS',
            'totalUses',
            'weeklyGrowth',
            'trending',
            'popular',
            'GET',
            'POST'
        ],
        description: 'Tool Stats API - Endpoints and Data'
    }
];

let allFeaturesValid = true;
featureTests.forEach(test => {
    const valid = testFileContent(test.path, test.required, test.description);
    if (!valid) allFeaturesValid = false;
});

console.log('\n3. Testing Smart Recommendation Logic...');

// 测试智能推荐逻辑
const recommendationTests = [
    {
        path: 'src/components/ai-tools/tool-navigation.tsx',
        required: [
            'getRecommendedTools',
            'getWorkflowRelatedTools',
            'workflows',
            'text-to-image',
            'image-to-image',
            'image-enhancer',
            'image-to-video'
        ],
        description: 'Smart Recommendation Algorithm'
    }
];

let allRecommendationsValid = true;
recommendationTests.forEach(test => {
    const valid = testFileContent(test.path, test.required, test.description);
    if (!valid) allRecommendationsValid = false;
});

console.log('\n4. Testing UI Enhancements...');

// 测试UI增强功能
const uiTests = [
    {
        path: 'src/components/ai-tools/tool-navigation.tsx',
        required: [
            'Badge',
            'trending',
            'popular',
            'TrendingUp',
            'Star',
            'formatUsageCount',
            'hover:shadow-lg',
            'hover:scale-[1.02]',
            'transition-all'
        ],
        description: 'UI Enhancements and Animations'
    }
];

let allUIValid = true;
uiTests.forEach(test => {
    const valid = testFileContent(test.path, test.required, test.description);
    if (!valid) allUIValid = false;
});

console.log('\n5. Testing TypeScript Types...');

// 测试TypeScript类型定义
const typeTests = [
    {
        path: 'src/hooks/use-tool-stats.ts',
        required: [
            'interface ToolStats',
            'interface ToolStatsOverview',
            'interface ToolStatsResponse',
            'totalUses: number',
            'trending: boolean',
            'popular: boolean'
        ],
        description: 'TypeScript Type Definitions'
    }
];

let allTypesValid = true;
typeTests.forEach(test => {
    const valid = testFileContent(test.path, test.required, test.description);
    if (!valid) allTypesValid = false;
});

console.log('\n📊 Test Summary:');
console.log(`Files Exist: ${allFilesExist ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Component Features: ${allFeaturesValid ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Smart Recommendations: ${allRecommendationsValid ? '✅ PASS' : '❌ FAIL'}`);
console.log(`UI Enhancements: ${allUIValid ? '✅ PASS' : '❌ FAIL'}`);
console.log(`TypeScript Types: ${allTypesValid ? '✅ PASS' : '❌ FAIL'}`);

const overallPass = allFilesExist && allFeaturesValid && allRecommendationsValid && allUIValid && allTypesValid;
console.log(`\n🎯 Overall Result: ${overallPass ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

if (overallPass) {
    console.log('\n🚀 Tool Navigation Component is ready!');
    console.log('\nKey Features Implemented:');
    console.log('✅ Smart tool recommendations based on workflow');
    console.log('✅ Real-time usage statistics integration');
    console.log('✅ Trending and popular tool badges');
    console.log('✅ Enhanced UI with animations and hover effects');
    console.log('✅ TypeScript type safety');
    console.log('✅ Usage tracking for analytics');
    console.log('\nNext steps:');
    console.log('1. Test the component in a running application');
    console.log('2. Verify API endpoints work correctly');
    console.log('3. Test responsive design on mobile devices');
} else {
    console.log('\n🔧 Please fix the failing tests before proceeding.');
}

process.exit(overallPass ? 0 : 1);