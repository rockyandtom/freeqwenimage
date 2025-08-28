# FreeQwenImage AI Tools Platform 故障排除指南

## 概述

本指南为 FreeQwenImage AI 工具平台提供全面的故障排除方案，涵盖所有 AI 工具（文生图、图生图、图像增强、图生视频）的常见问题和解决方案。

## 快速诊断

### 1. 运行自动诊断

```bash
# 检查环境变量配置
pnpm test:env

# 测试所有 API 端点（需要先启动开发服务器）
pnpm dev  # 在另一个终端窗口
pnpm test:api

# 测试特定工具
pnpm test:tools

# 运行完整测试套件
pnpm test:all
```

### 2. 平台健康检查

```bash
# 检查平台集成状态
node scripts/verify-platform.js

# 测试工具导航
node scripts/test-tool-navigation.js

# 验证 API 路由
node scripts/test-api-routes.js
```

## 常见问题与解决方案

### 问题 1: API 连接错误 - "Unexpected token 'A', "APIKEY_USE"... is not valid JSON"

**根本原因**: RunningHub API 返回了非 JSON 格式的错误响应，通常是因为 API 密钥配置问题。

**影响工具**: 所有 AI 工具（文生图、图生图、图像增强、图生视频）

**解决步骤**:

1. **检查环境变量**:
   ```bash
   pnpm test:env
   ```

2. **确保 `.env.development` 文件包含正确配置**:
   ```env
   RUNNINGHUB_API_URL=https://api.runninghub.ai
   RUNNINGHUB_API_KEY=your_api_key
   RUNNINGHUB_WEBAPP_ID=your_webapp_id
   ```

3. **重启开发服务器**:
   ```bash
   # 停止当前服务器 (Ctrl+C)
   pnpm dev
   ```

4. **验证修复**:
   ```bash
   pnpm test:api
   ```

### 问题 2: 工具页面无法访问 - 404 错误

**根本原因**: 路由配置问题或页面文件缺失。

**解决步骤**:

1. **检查路由结构**:
   ```
   src/app/[locale]/(default)/ai-tools/
   ├── page.tsx                    # 工具集合页面
   ├── image/
   │   ├── text-to-image/page.tsx
   │   ├── image-to-image/page.tsx
   │   ├── image-enhancer/page.tsx
   │   └── page.tsx
   └── video/
       ├── image-to-video/page.tsx
       └── page.tsx
   ```

2. **验证工具配置**:
   ```bash
   # 检查工具配置是否正确
   node -e "console.log(require('./src/config/tools.ts'))"
   ```

3. **测试导航**:
   ```bash
   node scripts/test-tool-navigation.js
   ```

### 问题 3: 特定工具功能异常

#### 3.1 文生图 (Text-to-Image) 问题

**常见症状**:
- 提示词无法提交
- 生成过程卡住
- 结果图像不显示

**解决方案**:

1. **检查 API 端点**:
   ```bash
   curl -X POST http://localhost:3000/api/runninghubAPI/text-to-image \
     -H "Content-Type: application/json" \
     -d '{"prompt":"test prompt"}'
   ```

2. **验证 Node ID**: 确保使用正确的 Node ID (文生图通常为 `1`)

3. **检查提示词长度**: 确保提示词不超过限制（通常 < 500 字符）

#### 3.2 图生图 (Image-to-Image) 问题

**常见症状**:
- 图像上传失败
- 转换参数无效
- 处理时间过长

**解决方案**:

1. **检查图像格式**:
   - 支持格式: PNG, JPG, JPEG, WebP
   - 最大大小: 10MB
   - 推荐尺寸: 512x512 到 2048x2048

2. **测试上传功能**:
   ```bash
   curl -X POST http://localhost:3000/api/runninghubAPI/upload \
     -F "file=@test-image.jpg"
   ```

3. **验证转换参数**:
   ```javascript
   // 检查参数范围
   strength: 0.1 - 1.0  // 转换强度
   guidance: 1.0 - 20.0 // 引导强度
   steps: 10 - 50       // 生成步数
   ```

#### 3.3 图像增强 (Image Enhancer) 问题

**常见症状**:
- 增强效果不明显
- 处理失败
- 结果质量差

**解决方案**:

1. **检查输入图像质量**:
   - 避免过度压缩的图像
   - 确保图像清晰度足够
   - 推荐最小尺寸: 256x256

2. **调整增强参数**:
   ```javascript
   // 优化参数设置
   scaleFactor: 2 - 4    // 放大倍数
   denoiseLevel: 0.1 - 0.9 // 降噪级别
   ```

#### 3.4 图生视频 (Image-to-Video) 问题

**常见症状**:
- 视频生成失败
- 处理时间极长
- 视频质量差

**解决方案**:

1. **优化输入图像**:
   - 使用高质量图像
   - 确保主体清晰
   - 避免过于复杂的场景

2. **调整视频参数**:
   ```javascript
   // 推荐参数
   duration: 3 - 10      // 视频时长（秒）
   fps: 12 - 30         // 帧率
   quality: 'medium'    // 质量设置
   ```

### 问题 4: 文件上传失败

**可能原因**:
- 使用了错误的 API 端点
- 文件格式不支持
- 文件大小超限
- 网络连接问题

**解决方案**:

1. **检查 API 端点**: 确保使用正确的上传端点 `/api/runninghubAPI/upload`

2. **文件要求**:
   - 支持格式: PNG, JPG, JPEG, WebP
   - 最大大小: 10MB
   - 确保文件未损坏

3. **测试上传**:
   ```bash
   curl -X POST http://localhost:3000/api/runninghubAPI/upload \
     -F "file=@test-image.jpg"
   ```

4. **检查浏览器兼容性**:
   - 确保浏览器支持 File API
   - 检查是否启用了 JavaScript
   - 清除浏览器缓存

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