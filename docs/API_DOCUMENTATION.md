# API Documentation

This document provides comprehensive information about the FreeQwenImage AI Tools Platform API endpoints.

## 🌐 Base URL

```
Development: http://localhost:3000
Production: https://your-domain.com
```

## 🔐 Authentication

Currently, the API uses server-side authentication with RunningHub. No client-side authentication is required for public endpoints.

### Environment Variables

```env
RUNNINGHUB_API_URL=https://api.runninghub.ai
RUNNINGHUB_API_KEY=your_api_key
```

## 📋 API Response Format

All API endpoints follow a consistent response format:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
  message?: string;
}
```

### Success Response Example

```json
{
  "success": true,
  "data": {
    "taskId": "task_123456",
    "status": "pending"
  }
}
```

### Error Response Example

```json
{
  "success": false,
  "error": "Invalid prompt provided",
  "code": 400,
  "message": "Validation failed"
}
```

## 🎨 AI Tools API Endpoints

### 1. Text to Image Generation

Generate images from text descriptions.

**Endpoint:** `POST /api/runninghubAPI/text-to-image`

**Request Body:**
```typescript
{
  prompt: string;           // Required: Text description
  style?: string;          // Optional: Art style
  width?: number;          // Optional: Image width (default: 1024)
  height?: number;         // Optional: Image height (default: 1024)
  steps?: number;          // Optional: Generation steps (default: 20)
  guidance?: number;       // Optional: Guidance scale (default: 7.5)
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/runninghubAPI/text-to-image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A beautiful sunset over mountains, digital art style",
    "style": "digital-art",
    "width": 1024,
    "height": 1024
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "taskId": "txt2img_123456",
    "status": "pending",
    "estimatedTime": 30
  }
}
```

### 2. Image to Image Transformation

Transform existing images with AI modifications.

**Endpoint:** `POST /api/runninghubAPI/image-to-image`

**Request Body:**
```typescript
{
  image: File | string;     // Required: Input image (file or base64)
  prompt: string;           // Required: Transformation description
  strength?: number;        // Optional: Transformation strength (0-1, default: 0.8)
  style?: string;          // Optional: Target style
  preserveStructure?: boolean; // Optional: Preserve original structure
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/runninghubAPI/image-to-image \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
    "prompt": "Transform this photo into a watercolor painting",
    "strength": 0.7,
    "style": "watercolor"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "taskId": "img2img_123456",
    "status": "pending",
    "originalImage": "https://storage.url/original.jpg",
    "estimatedTime": 25
  }
}
```

### 3. Image Enhancement

Enhance image quality and resolution.

**Endpoint:** `POST /api/runninghubAPI/image-enhancer`

**Request Body:**
```typescript
{
  image: File | string;     // Required: Input image
  enhanceType?: string;     // Optional: 'quality' | 'resolution' | 'both'
  scaleFactor?: number;     // Optional: Scale factor (1-4, default: 2)
  denoiseLevel?: number;    // Optional: Denoise level (0-1, default: 0.5)
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/runninghubAPI/image-enhancer \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
    "enhanceType": "both",
    "scaleFactor": 2,
    "denoiseLevel": 0.6
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "taskId": "enhance_123456",
    "status": "pending",
    "originalImage": "https://storage.url/original.jpg",
    "estimatedTime": 20
  }
}
```

### 4. Image to Video Conversion

Convert static images into dynamic videos.

**Endpoint:** `POST /api/runninghubAPI/image-to-video`

**Request Body:**
```typescript
{
  image: File | string;     // Required: Input image
  motion?: string;          // Optional: Motion type
  duration?: number;        // Optional: Video duration in seconds (default: 5)
  fps?: number;            // Optional: Frames per second (default: 24)
  quality?: string;        // Optional: 'low' | 'medium' | 'high'
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/runninghubAPI/image-to-video \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
    "motion": "zoom-in",
    "duration": 5,
    "fps": 24,
    "quality": "high"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "taskId": "img2vid_123456",
    "status": "pending",
    "originalImage": "https://storage.url/original.jpg",
    "estimatedTime": 60
  }
}
```

## 📊 Task Management API

### Check Task Status

Monitor the progress of AI generation tasks.

**Endpoint:** `GET /api/runninghubAPI/status/:taskId`

**Parameters:**
- `taskId` (string): The task ID returned from generation endpoints

**Example Request:**
```bash
curl -X GET http://localhost:3000/api/runninghubAPI/status/txt2img_123456
```

**Response (Pending):**
```json
{
  "success": true,
  "data": {
    "taskId": "txt2img_123456",
    "status": "running",
    "progress": 45,
    "estimatedTimeRemaining": 15,
    "message": "Generating image..."
  }
}
```

**Response (Completed):**
```json
{
  "success": true,
  "data": {
    "taskId": "txt2img_123456",
    "status": "completed",
    "progress": 100,
    "resultUrl": "https://storage.url/result.jpg",
    "imageUrl": "https://storage.url/result.jpg",
    "completedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Response (Failed):**
```json
{
  "success": false,
  "data": {
    "taskId": "txt2img_123456",
    "status": "failed",
    "progress": 0,
    "error": "Generation failed due to invalid parameters"
  }
}
```

### Task Status Values

| Status | Description |
|--------|-------------|
| `pending` | Task is queued and waiting to start |
| `running` | Task is currently being processed |
| `completed` | Task completed successfully |
| `failed` | Task failed due to an error |
| `cancelled` | Task was cancelled by user or system |

## 🛠 Tools Management API

### Get Tools List

Retrieve all available AI tools.

**Endpoint:** `GET /api/tools/list`

**Query Parameters:**
- `category` (optional): Filter by category ('image', 'video', 'audio', 'text')
- `status` (optional): Filter by status ('active', 'beta', 'coming-soon')
- `pricing` (optional): Filter by pricing ('free', 'freemium', 'pro')

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/tools/list?category=image&status=active"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "text-to-image",
      "name": "Text to Image",
      "description": "Generate images from text descriptions",
      "category": "image",
      "href": "/ai-tools/image/text-to-image",
      "apiEndpoint": "/api/runninghubAPI/text-to-image",
      "icon": {
        "input": "📝",
        "output": "🖼️"
      },
      "status": "active",
      "pricing": "free",
      "features": ["Multiple styles", "High resolution", "Fast generation"]
    }
  ]
}
```

### Get Tool Details

Get detailed information about a specific tool.

**Endpoint:** `GET /api/tools/:toolId`

**Parameters:**
- `toolId` (string): The unique tool identifier

**Example Request:**
```bash
curl -X GET http://localhost:3000/api/tools/text-to-image
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "text-to-image",
    "name": "Text to Image",
    "description": "Generate stunning images from text descriptions using advanced AI",
    "category": "image",
    "href": "/ai-tools/image/text-to-image",
    "apiEndpoint": "/api/runninghubAPI/text-to-image",
    "icon": {
      "input": "📝",
      "output": "🖼️"
    },
    "component": "TextToImageTool",
    "provider": "runninghub",
    "features": ["Multiple styles", "High resolution", "Fast generation"],
    "status": "active",
    "pricing": "free",
    "metadata": {
      "version": "1.0.0",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z",
      "author": "AI Tools Team"
    }
  }
}
```

### Get Tool Categories

Retrieve all available tool categories.

**Endpoint:** `GET /api/tools/categories`

**Example Request:**
```bash
curl -X GET http://localhost:3000/api/tools/categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "image",
      "name": "Image Tools",
      "description": "AI-powered image generation and editing tools",
      "icon": "🖼️",
      "toolCount": 4,
      "tools": ["text-to-image", "image-to-image", "image-enhancer"]
    },
    {
      "id": "video",
      "name": "Video Tools", 
      "description": "AI-powered video generation and editing tools",
      "icon": "🎥",
      "toolCount": 1,
      "tools": ["image-to-video"]
    }
  ]
}
```

## 📁 File Upload API

### Upload Files

Upload images for processing.

**Endpoint:** `POST /api/runninghubAPI/upload`

**Request:** Multipart form data
- `file`: Image file (JPEG, PNG, WebP)
- `type` (optional): Upload type ('image', 'avatar', 'temp')

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/runninghubAPI/upload \
  -F "file=@image.jpg" \
  -F "type=image"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fileId": "upload_123456",
    "url": "https://storage.url/uploaded-image.jpg",
    "filename": "image.jpg",
    "size": 1024000,
    "mimeType": "image/jpeg",
    "uploadedAt": "2024-01-15T10:30:00Z"
  }
}
```

## 📈 Analytics API

### Usage Statistics

Get tool usage statistics (admin only).

**Endpoint:** `GET /api/analytics/usage`

**Query Parameters:**
- `period` (optional): Time period ('day', 'week', 'month', 'year')
- `toolId` (optional): Specific tool ID
- `startDate` (optional): Start date (ISO string)
- `endDate` (optional): End date (ISO string)

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/analytics/usage?period=week&toolId=text-to-image"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "week",
    "toolId": "text-to-image",
    "totalRequests": 1250,
    "successfulRequests": 1180,
    "failedRequests": 70,
    "averageProcessingTime": 25.5,
    "dailyBreakdown": [
      {
        "date": "2024-01-15",
        "requests": 180,
        "successful": 170,
        "failed": 10
      }
    ]
  }
}
```

## ❌ Error Codes

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable - External API down |

### Custom Error Codes

| Code | Error Type | Description |
|------|------------|-------------|
| 1001 | VALIDATION_ERROR | Invalid input parameters |
| 1002 | FILE_TOO_LARGE | Uploaded file exceeds size limit |
| 1003 | UNSUPPORTED_FORMAT | File format not supported |
| 2001 | API_ERROR | External API error |
| 2002 | TIMEOUT_ERROR | Request timeout |
| 2003 | QUOTA_EXCEEDED | API quota exceeded |
| 3001 | TASK_NOT_FOUND | Task ID not found |
| 3002 | TASK_EXPIRED | Task has expired |

## 🔄 Rate Limiting

### Current Limits

- **Per IP**: 100 requests per minute
- **Per Tool**: 10 concurrent tasks per IP
- **File Upload**: 50MB per file, 100MB per hour per IP

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642262400
```

## 🧪 Testing the API

### Using cURL

```bash
# Test text-to-image generation
curl -X POST http://localhost:3000/api/runninghubAPI/text-to-image \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A beautiful landscape"}'

# Check task status
curl -X GET http://localhost:3000/api/runninghubAPI/status/task_123456

# Get tools list
curl -X GET http://localhost:3000/api/tools/list
```

### Using JavaScript/TypeScript

```typescript
// Text to image generation
const response = await fetch('/api/runninghubAPI/text-to-image', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'A beautiful landscape',
    style: 'photorealistic'
  })
});

const result = await response.json();

if (result.success) {
  // Poll for status
  const statusResponse = await fetch(`/api/runninghubAPI/status/${result.data.taskId}`);
  const status = await statusResponse.json();
  console.log('Task status:', status.data.status);
}
```

### Test Script

Use the provided test script:

```bash
# Run API tests
pnpm test:api

# Run specific endpoint test
node scripts/test-api.js --endpoint=text-to-image
```

## 📝 Changelog

### Version 1.0.0 (2024-01-15)
- Initial API release
- Text-to-image generation
- Image-to-image transformation
- Image enhancement
- Image-to-video conversion
- Task status monitoring
- Tools management endpoints

### Version 1.1.0 (Planned)
- Batch processing support
- Webhook notifications
- Advanced filtering options
- Performance improvements

## 🆘 Support

For API support and questions:

- 📖 [Documentation](docs/)
- 🐛 [Issue Tracker](https://github.com/your-repo/issues)
- 💬 [API Discussions](https://github.com/your-repo/discussions)
- 📧 Email: api-support@your-domain.com

## 📄 License

This API documentation is part of the FreeQwenImage AI Tools Platform and is subject to the same license terms.