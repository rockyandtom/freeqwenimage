# AI Image Enhancer 故障排除指南

## 概述

本指南基于 [RunningHub API 官方文档](runninghub-api-guide.md) 提供完整的故障排除方案。

## 快速诊断

### 1. 运行自动诊断

```bash
# 检查环境变量配置
npm run test:env

# 测试完整的 API 流程（需要先启动开发服务器）
npm run dev  # 在另一个终端窗口
npm run test:api
```

## 常见问题与解决方案

### 问题 1: "Enhancement ErrorUnexpected token 'A', "APIKEY_USE"... is not valid JSON"

**根本原因**: RunningHub API 返回了非 JSON 格式的错误响应，通常是因为 API 密钥配置问题。

**解决步骤**:

1. **检查环境变量**:
   ```bash
   npm run test:env
   ```

2. **确保 `.env.development` 文件包含正确配置**:
   ```env
   RUNNINGHUB_API_KEY=fb88fac46b0349c1986c9cbb4f14d44e
   RUNNINGHUB_WEBAPP_ID=1958797744955613186
   RUNNINGHUB_NODE_ID=2
   ```

3. **重启开发服务器**:
   ```bash
   # 停止当前服务器 (Ctrl+C)
   npm run dev
   ```

4. **验证修复**:
   ```bash
   npm run test:api
   ```

### 问题 2: 文件上传失败

**可能原因**:
- 使用了错误的 API 端点
- 文件格式不支持
- 文件大小超限

**解决方案**:

1. **检查 API 端点**: 确保使用 `/task/openapi/upload`，不是 `/task/openapi/file/upload`

2. **文件要求**:
   - 支持格式: PNG, JPG, JPEG
   - 最大大小: 10MB
   - 确保文件未损坏

3. **测试上传**:
   ```bash
   curl -X POST http://localhost:3000/api/runninghubAPI/upload \
     -F "file=@test-image.jpg"
   ```

### 问题 3: 任务创建失败

**可能原因**:
- Node ID 配置错误
- 文件 ID 格式问题
- WebApp ID 不匹配

**解决方案**:

1. **检查 Node ID**: 确保使用正确的 Node ID (当前为 `2`)

2. **保持完整文件 ID**: 不要移除 `api/` 前缀
   ```javascript
   // ✅ 正确 - 保持完整 ID
   const fileId = "api/570626eea496318dabfcce26c1d5514e1c9089074e18a32a139e97939bbc75a4.png";
   
   // ❌ 错误 - 移除了前缀
   const fileId = "570626eea496318dabfcce26c1d5514e1c9089074e18a32a139e97939bbc75a4.png";
   ```

3. **验证 WebApp ID**: 确保与 RunningHub 控制台中的 ID 匹配

### 问题 4: 状态轮询超时

**可能原因**:
- 图像处理时间较长
- 网络连接不稳定
- API 服务负载过高

**解决方案**:

1. **增加轮询时间**: 复杂图像可能需要 2-5 分钟处理时间

2. **检查网络连接**: 确保能够访问 `www.runninghub.cn`

3. **手动检查状态**:
   ```bash
   curl -X POST http://localhost:3000/api/runninghubAPI/status \
     -H "Content-Type: application/json" \
     -d '{"taskId":"your-task-id"}'
   ```

### 问题 5: 结果图像无法显示

**可能原因**:
- Next.js 图像域名未配置
- 图像 URL 格式错误
- 网络访问限制

**解决方案**:

1. **检查 Next.js 配置**: 确保 `next.config.mjs` 包含:
   ```javascript
   images: {
     remotePatterns: [
       {
         protocol: "https",
         hostname: "rh-images.xiaoyaoyou.com",
       },
     ],
   }
   ```

2. **验证图像 URL**: 确保 URL 格式正确且可访问

3. **测试图像访问**: 在浏览器中直接访问图像 URL

## 开发调试技巧

### 1. 启用详细日志

在浏览器开发者工具中查看详细错误信息：

1. 打开开发者工具 (F12)
2. 切换到 "Console" 标签
3. 查看网络请求 (Network 标签)
4. 检查 API 响应内容

### 2. API 流程验证

完整的 API 调用流程应该是：

```
1. 上传图像 → 获取 fileId
   POST /api/runninghubAPI/upload
   
2. 创建增强任务 → 获取 taskId
   POST /api/runninghubAPI/Image-Enhancer
   
3. 轮询任务状态 → 获取结果
   POST /api/runninghubAPI/status (重复调用直到完成)
```

### 3. 手动测试 API

使用 curl 或 Postman 测试各个端点：

```bash
# 1. 测试上传
curl -X POST http://localhost:3000/api/runninghubAPI/upload \
  -F "file=@test.jpg"

# 2. 测试任务创建
curl -X POST http://localhost:3000/api/runninghubAPI/Image-Enhancer \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"api/your-file-id.jpg"}'

# 3. 测试状态查询
curl -X POST http://localhost:3000/api/runninghubAPI/status \
  -H "Content-Type: application/json" \
  -d '{"taskId":"your-task-id"}'
```

## 性能优化建议

### 1. 图像预处理

- 压缩大图像到合理尺寸 (< 2MB)
- 使用标准格式 (PNG, JPG)
- 避免过于复杂的图像

### 2. 用户体验优化

- 显示上传进度
- 提供清晰的错误信息
- 实现重试机制
- 添加取消功能

### 3. 错误处理

- 实现指数退避重试
- 提供用户友好的错误信息
- 记录详细的错误日志

## 联系支持

如果问题仍然存在，请提供以下信息：

1. **错误信息**: 完整的错误消息和堆栈跟踪
2. **环境信息**: 
   ```bash
   npm run test:env  # 环境变量状态
   node --version    # Node.js 版本
   npm --version     # npm 版本
   ```
3. **测试结果**: 
   ```bash
   npm run test:api  # API 测试结果
   ```
4. **浏览器信息**: 浏览器类型和版本
5. **网络信息**: 是否使用代理或 VPN
6. **图像信息**: 文件大小、格式、尺寸

## 相关文档

- [RunningHub API 官方指南](runninghub-api-guide.md)
- [Next.js 图像优化文档](https://nextjs.org/docs/basic-features/image-optimization)
- [项目 README](README.md)