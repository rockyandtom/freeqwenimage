#!/usr/bin/env node

/**
 * API Documentation Generator
 * Generates comprehensive API documentation from route files and test results
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  outputDir: 'docs/api',
  testResultsFile: 'test-results.json'
};

function generateAPIDocumentation() {
  console.log('📚 Generating API Documentation...');

  // Create output directory
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  // Generate main documentation
  const mainDoc = `# AI Tools Platform API Documentation

Generated on: ${new Date().toISOString()}

## Overview

This document provides comprehensive documentation for the AI Tools Platform API.

## Base URL

\`\`\`
http://localhost:3000
\`\`\`

## Authentication

Configure these environment variables:
- \`RUNNINGHUB_API_KEY\`: Your RunningHub API key
- \`RUNNINGHUB_WEBAPP_ID\`: Your webapp ID  
- \`RUNNINGHUB_NODE_ID\`: Node ID for processing

## API Endpoints

### Tools Management

#### GET /api/tools/list
获取所有可用AI工具列表

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "text-to-image",
      "name": "Text to Image",
      "category": "image",
      "status": "active"
    }
  ]
}
\`\`\`

#### GET /api/tools/categories
获取工具分类列表

#### GET /api/tools/stats
获取工具使用统计

### RunningHub API Integration

#### POST /api/runninghubAPI/upload
上传文件到RunningHub

**Parameters:**
- \`file\` (FormData): 要上传的文件

#### POST /api/runninghubAPI/text-to-image
文本生成图像

**Parameters:**
- \`prompt\` (string): 图像生成提示词

#### POST /api/runninghubAPI/image-to-image
图像到图像转换

**Parameters:**
- \`imageUrl\` (string): 源图像URL或文件ID
- \`prompt\` (string): 转换提示词

#### POST /api/runninghubAPI/Image-Enhancer
图像增强处理

**Parameters:**
- \`imageUrl\` (string): 要增强的图像URL或文件ID

#### POST /api/runninghubAPI/image-to-video
图像生成视频

**Parameters:**
- \`imageUrl\` (string): 源图像URL或文件ID

#### POST /api/runninghubAPI/status
查询任务状态

**Parameters:**
- \`taskId\` (string): 任务ID

### Analytics & Performance

#### GET /api/analytics
获取平台分析数据

#### GET /api/performance
获取性能指标

## Error Handling

All endpoints return consistent error responses:

\`\`\`json
{
  "success": false,
  "error": "Error message description",
  "code": 400
}
\`\`\`

## Status Codes

- \`200\` - Success
- \`400\` - Bad Request
- \`401\` - Unauthorized
- \`404\` - Not Found
- \`429\` - Rate Limited
- \`500\` - Internal Server Error
`;

  fs.writeFileSync(path.join(CONFIG.outputDir, 'README.md'), mainDoc);

  console.log('✅ API Documentation generated successfully!');
  console.log(`📁 Documentation saved to: ${CONFIG.outputDir}/README.md`);
}

// Run if called directly
if (require.main === module) {
  try {
    generateAPIDocumentation();
  } catch (error) {
    console.error('❌ Error generating documentation:', error.message);
    process.exit(1);
  }
}

module.exports = { generateAPIDocumentation };