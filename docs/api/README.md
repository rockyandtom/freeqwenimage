# AI Tools Platform API Documentation

Generated on: 2025-08-26T14:40:00.000Z

## Overview

This document provides comprehensive documentation for the AI Tools Platform API. The platform offers a unified interface for various AI-powered tools including text-to-image generation, image enhancement, image-to-image transformation, and image-to-video conversion.

## Base URL

```
http://localhost:3000
```

## Authentication

Configure these environment variables:
- `RUNNINGHUB_API_KEY`: Your RunningHub API key
- `RUNNINGHUB_WEBAPP_ID`: Your webapp ID  
- `RUNNINGHUB_NODE_ID`: Node ID for processing

## API Endpoints

### Tools Management

#### GET /api/tools/list
获取所有可用AI工具列表

**Response:**
```json
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
```

#### GET /api/tools/categories
获取工具分类列表

**Response:**
```json
{
  "success": true,
  "data": ["image", "video", "audio", "text"]
}
```

#### GET /api/tools/stats
获取工具使用统计

**Response:**
```json
{
  "success": true,
  "data": {
    "totalTools": 4,
    "activeTools": 4,
    "totalUsage": 1250
  }
}
```

#### GET /api/tools/{toolId}
获取特定工具的详细信息

**Parameters:**
- `toolId` (path): 工具ID，例如 "text-to-image"

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "text-to-image",
    "name": "Text to Image",
    "description": "Generate images from text",
    "category": "image"
  }
}
```

### RunningHub API Integration

#### POST /api/runninghubAPI/upload
上传文件到RunningHub

**Parameters:**
- `file` (FormData): 要上传的文件

**Response:**
```json
{
  "success": true,
  "fileId": "api/files/12345.png"
}
```

#### POST /api/runninghubAPI/text-to-image
文本生成图像

**Parameters:**
- `prompt` (string): 图像生成提示词

**Response:**
```json
{
  "success": true,
  "data": {
    "taskId": "task_12345",
    "status": "pending"
  }
}
```

#### POST /api/runninghubAPI/image-to-image
图像到图像转换

**Parameters:**
- `imageUrl` (string): 源图像URL或文件ID
- `prompt` (string): 转换提示词

**Response:**
```json
{
  "success": true,
  "data": {
    "taskId": "task_12346",
    "status": "pending"
  }
}
```

#### POST /api/runninghubAPI/Image-Enhancer
图像增强处理

**Parameters:**
- `imageUrl` (string): 要增强的图像URL或文件ID

**Response:**
```json
{
  "code": 0,
  "data": {
    "taskId": "task_12347",
    "status": "pending"
  }
}
```

#### POST /api/runninghubAPI/image-to-video
图像生成视频

**Parameters:**
- `imageUrl` (string): 源图像URL或文件ID

**Response:**
```json
{
  "success": true,
  "data": {
    "taskId": "task_12348",
    "status": "pending"
  }
}
```

#### POST /api/runninghubAPI/status
查询任务状态

**Parameters:**
- `taskId` (string): 任务ID

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "completed",
    "progress": 100,
    "resultUrl": "https://example.com/result.png"
  }
}
```

### Analytics & Performance

#### GET /api/analytics
获取平台分析数据

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1000,
    "totalTasks": 5000,
    "successRate": 95.5
  }
}
```

#### GET /api/performance
获取性能指标

**Response:**
```json
{
  "success": true,
  "data": {
    "avgResponseTime": 250,
    "uptime": 99.9,
    "errorRate": 0.1
  }
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message description",
  "code": 400
}
```

## Status Codes

- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `429` - Rate Limited
- `500` - Internal Server Error

## Rate Limiting

The API implements rate limiting to ensure fair usage:

- **Upload endpoints**: 10 requests per minute
- **Processing endpoints**: 5 requests per minute
- **Query endpoints**: 100 requests per minute

## Task Status Flow

1. **pending** - Task is queued for processing
2. **running** - Task is currently being processed
3. **completed** - Task finished successfully
4. **failed** - Task encountered an error

## Best Practices

1. **Polling**: Use reasonable intervals (3-5 seconds) when polling task status
2. **Error Handling**: Always check the `success` field in responses
3. **File Upload**: Ensure files are in supported formats (PNG, JPG, JPEG)
4. **Timeouts**: Set appropriate timeouts for long-running operations
5. **Retry Logic**: Implement exponential backoff for failed requests

## Testing

Use the comprehensive test suite to verify API functionality:

```bash
# Run all tests
npm run test:api

# Run quick connectivity tests
npm run test:api -- --quick

# Run performance benchmarks
npm run test:api -- --performance

# Run error handling tests
npm run test:api -- --errors
```

## Support

For API support and questions:
- Check the troubleshooting guide
- Review test results for common issues
- Ensure environment variables are properly configured