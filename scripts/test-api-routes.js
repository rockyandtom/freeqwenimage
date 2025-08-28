#!/usr/bin/env node

/**
 * API路由测试脚本
 * 测试所有RunningHub API端点的实现
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing API Route Implementations...\n');

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

console.log('1. Testing API Route Files...');

// 测试API路由文件存在性
const apiRoutes = [
    {
        path: 'src/app/api/runninghubAPI/Image-Enhancer/route.ts',
        description: 'Image Enhancer API Route'
    },
    {
        path: 'src/app/api/runninghubAPI/image-to-image/route.ts',
        description: 'Image-to-Image API Route'
    },
    {
        path: 'src/app/api/runninghubAPI/image-to-video/route.ts',
        description: 'Image-to-Video API Route'
    },
    {
        path: 'src/app/api/runninghubAPI/upload/route.ts',
        description: 'Upload API Route'
    },
    {
        path: 'src/app/api/runninghubAPI/status/route.ts',
        description: 'Status API Route'
    },
    {
        path: 'src/lib/api-utils.ts',
        description: 'API Utilities'
    }
];

let allFilesExist = true;
apiRoutes.forEach(route => {
    const exists = testFileExists(route.path, route.description);
    if (!exists) allFilesExist = false;
});

console.log('\n2. Testing API Route Content...');

// 测试统一错误处理的实现
const errorHandlingTests = [
    {
        path: 'src/app/api/runninghubAPI/Image-Enhancer/route.ts',
        required: ['logApiRequest', 'logApiResponse', 'createErrorResponse', 'validateEnvironmentConfig'],
        description: 'Image Enhancer - Unified Error Handling'
    },
    {
        path: 'src/app/api/runninghubAPI/image-to-image/route.ts',
        required: ['logApiRequest', 'logApiResponse', 'createErrorResponse', 'validateEnvironmentConfig'],
        description: 'Image-to-Image - Unified Error Handling'
    },
    {
        path: 'src/app/api/runninghubAPI/image-to-video/route.ts',
        required: ['logApiRequest', 'logApiResponse', 'createErrorResponse', 'validateEnvironmentConfig'],
        description: 'Image-to-Video - Unified Error Handling'
    },
    {
        path: 'src/app/api/runninghubAPI/upload/route.ts',
        required: ['validateFileType', 'validateFileSize', 'logApiRequest', 'createErrorResponse'],
        description: 'Upload - File Validation'
    },
    {
        path: 'src/app/api/runninghubAPI/status/route.ts',
        required: ['normalizeTaskStatus', 'calculateProgress', 'logApiRequest', 'createErrorResponse'],
        description: 'Status - Task Status Standardization'
    }
];

let allContentValid = true;
errorHandlingTests.forEach(test => {
    const valid = testFileContent(test.path, test.required, test.description);
    if (!valid) allContentValid = false;
});

console.log('\n3. Testing API Utilities...');

// 测试API工具函数
const utilityTests = [
    {
        path: 'src/lib/api-utils.ts',
        required: [
            'ApiErrorType',
            'logApiRequest',
            'logApiResponse',
            'createErrorResponse',
            'validateEnvironmentConfig',
            'validateFileType',
            'validateFileSize',
            'normalizeTaskStatus',
            'calculateProgress'
        ],
        description: 'API Utilities - All Functions'
    }
];

utilityTests.forEach(test => {
    const valid = testFileContent(test.path, test.required, test.description);
    if (!valid) allContentValid = false;
});

console.log('\n4. Testing Node ID Configuration...');

// 测试Node ID配置
const nodeIdTests = [
    {
        path: 'src/app/api/runninghubAPI/Image-Enhancer/route.ts',
        required: ["NODE_ID = '2'"],
        description: 'Image Enhancer - Node ID 2'
    },
    {
        path: 'src/app/api/runninghubAPI/image-to-image/route.ts',
        required: ["NODE_ID = '3'"],
        description: 'Image-to-Image - Node ID 3'
    },
    {
        path: 'src/app/api/runninghubAPI/image-to-video/route.ts',
        required: ["NODE_ID = '4'"],
        description: 'Image-to-Video - Node ID 4'
    }
];

let allNodeIdsCorrect = true;
nodeIdTests.forEach(test => {
    const valid = testFileContent(test.path, test.required, test.description);
    if (!valid) allNodeIdsCorrect = false;
});

console.log('\n5. Testing API Endpoint Consistency...');

// 测试API端点一致性
const endpointTests = [
    {
        path: 'src/app/api/runninghubAPI/Image-Enhancer/route.ts',
        required: ['https://www.runninghub.cn/task/openapi/ai-app/run'],
        description: 'Image Enhancer - Correct Endpoint'
    },
    {
        path: 'src/app/api/runninghubAPI/image-to-image/route.ts',
        required: ['https://www.runninghub.cn/task/openapi/ai-app/run'],
        description: 'Image-to-Image - Correct Endpoint'
    },
    {
        path: 'src/app/api/runninghubAPI/image-to-video/route.ts',
        required: ['https://www.runninghub.cn/task/openapi/ai-app/run'],
        description: 'Image-to-Video - Correct Endpoint'
    }
];

let allEndpointsCorrect = true;
endpointTests.forEach(test => {
    const valid = testFileContent(test.path, test.required, test.description);
    if (!valid) allEndpointsCorrect = false;
});

console.log('\n📊 Test Summary:');
console.log(`Files Exist: ${allFilesExist ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Error Handling: ${allContentValid ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Node IDs: ${allNodeIdsCorrect ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Endpoints: ${allEndpointsCorrect ? '✅ PASS' : '❌ FAIL'}`);

const overallPass = allFilesExist && allContentValid && allNodeIdsCorrect && allEndpointsCorrect;
console.log(`\n🎯 Overall Result: ${overallPass ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

if (overallPass) {
    console.log('\n🚀 API routes are ready for testing with a running server!');
    console.log('Next steps:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Test the endpoints with the existing test-api.js script');
    console.log('3. Verify file upload and task processing workflows');
} else {
    console.log('\n🔧 Please fix the failing tests before proceeding.');
}

process.exit(overallPass ? 0 : 1);