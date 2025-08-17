# 图像特效API文档

这是一个新接入的RunningHub图像特效应用API，用于对图像进行AI特效处理。

## API端点

### 1. 提交图像特效任务
- **端点**: `POST /api/runninghubAPI/image-effects`
- **描述**: 提交图像进行特效处理
- **请求参数**:
  ```json
  {
    "image": "图像文件名或URL" // 必需
  }
  ```
- **响应示例**:
  ```json
  {
    "success": true,
    "data": {
      "taskId": "任务ID",
      "status": "submitted",
      "message": "图像特效处理任务已提交，请等待处理完成"
    }
  }
  ```

### 2. 查询任务状态
- **端点**: `POST /api/runninghubAPI/image-effects/status`
- **描述**: 查询图像特效处理任务的状态
- **请求参数**:
  ```json
  {
    "taskId": "任务ID" // 必需
  }
  ```
- **响应示例** (处理中):
  ```json
  {
    "success": true,
    "data": {
      "taskId": "任务ID",
      "status": "running",
      "message": "图像特效任务正在处理中，状态: RUNNING"
    }
  }
  ```
- **响应示例** (完成):
  ```json
  {
    "success": true,
    "data": {
      "taskId": "任务ID",
      "status": "completed",
      "resultUrl": "处理后的文件URL",
      "fileType": "文件类型",
      "message": "图像特效处理完成"
    }
  }
  ```

### 3. GET方式查询缓存状态
- **端点**: `GET /api/runninghubAPI/image-effects?taskId=任务ID`
- **描述**: 从本地缓存查询任务状态（快速响应）
- **调试模式**: `GET /api/runninghubAPI/image-effects?taskId=任务ID&debug=true`

## RunningHub应用配置

- **webappId**: `1955923521295798274`
- **apiKey**: `fb88fac46b0349c1986c9cbb4f14d44e`
- **节点配置**:
  - nodeId: `220`
  - fieldName: `image`
  - description: `image`

## 使用流程

1. 调用 `/api/runninghubAPI/image-effects` 提交图像处理任务
2. 获取返回的 `taskId`
3. 使用 `taskId` 定期查询任务状态直到完成
4. 任务完成后获取处理结果的URL

## 支持的文件类型

- 输入: 图像文件（PNG, JPG, JPEG等）
- 输出: 可能是图像、视频或GIF，具体取决于特效类型

## 错误处理

所有API都包含完整的错误处理，返回详细的错误信息用于调试。

## 测试

使用 `debug/image-effects-api-test.http` 文件进行API测试。
