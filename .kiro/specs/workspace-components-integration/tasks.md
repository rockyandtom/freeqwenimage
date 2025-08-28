# Implementation Plan

- [ ] 1. 创建应用配置系统
  - [x] 1.1 创建应用配置文件


    - 创建 `src/config/applications.ts` 文件
    - 定义 `ApplicationConfig` 接口和 `APPLICATIONS_CONFIG` 配置
    - 包含现有new-page应用的配置信息
    - _Requirements: 5.1, 5.2_




  - [ ] 1.2 扩展工具配置
    - 更新 `src/config/tools.ts` 文件
    - 在 `ToolConfig` 接口中添加 `relatedApps` 属性
    - 为现有工具配置添加相关应用关联
    - _Requirements: 5.3_

- [ ] 2. 创建ai-tools目录结构并迁移组件
  - [ ] 2.1 创建目录结构
    - 在 `src/components/ai-tools/` 下创建 `workspace` 子目录
    - 在 `src/components/ai-tools/` 下创建 `applications` 子目录
    - 确保目录结构符合设计文档的规划
    - _Requirements: 3.1, 3.3_

  - [ ] 2.2 迁移workspace组件
    - 将 `workspace-layout.tsx` 迁移到 `src/components/ai-tools/workspace/`
    - 将 `workspace-main.tsx` 迁移到 `src/components/ai-tools/workspace/`
    - 将 `workspace-sidebar.tsx` 迁移到 `src/components/ai-tools/workspace/`



    - 将 `provider-selector.tsx` 迁移到 `src/components/ai-tools/workspace/`
    - _Requirements: 3.1, 3.3_



- [ ] 3. 创建应用选择器和应用组件
  - [ ] 3.1 创建应用选择器组件
    - 创建 `src/components/ai-tools/workspace/app-selector.tsx`
    - 实现应用列表显示和选择功能
    - 根据当前工具类型过滤相关应用
    - _Requirements: 1.4, 2.1_



  - [ ] 3.2 创建应用包装组件
    - 创建 `src/components/ai-tools/applications/ai-effects-app.tsx`
    - 创建 `src/components/ai-tools/applications/image-enhancer-app.tsx`


    - 创建 `src/components/ai-tools/applications/qwen-edit-app.tsx`
    - 每个组件包装对应的原始应用内容
    - _Requirements: 4.1, 4.2_

- [x] 4. 增强workspace组件支持应用嵌入


  - [ ] 4.1 更新workspace-layout组件
    - 修改布局支持应用内容区域显示
    - 添加应用选择器的集成
    - 实现应用内容的动态加载和显示


    - _Requirements: 1.1, 2.2, 3.3_

  - [ ] 4.2 更新workspace-main组件
    - 支持在工具下方显示应用内容
    - 实现应用内容的嵌入模式切换


    - 保持工具和应用的状态同步
    - _Requirements: 1.2, 2.2_

- [x] 5. 更新页面引用和路由配置


  - [ ] 5.1 更新ai-tools页面
    - 修改 `src/app/[locale]/(default)/ai-tools/page.tsx`
    - 更新import路径指向新的workspace组件位置
    - 确保页面正常加载新的工具区界面
    - _Requirements: 3.1, 3.3_




  - [ ] 5.2 添加应用重定向
    - 在 `next.config.mjs` 中添加重定向规则
    - 将 `/new-page/*` 路径重定向到 `/ai-tools?app=*`
    - 保持向后兼容性和SEO友好
    - _Requirements: 4.3_

- [ ] 6. 实现应用动态加载系统
  - [ ] 6.1 创建应用加载Hook
    - 创建 `src/hooks/use-application.ts`
    - 实现应用的动态导入和状态管理
    - 支持应用的懒加载和错误处理
    - _Requirements: 4.1, 4.2_

  - [ ] 6.2 实现应用路由同步
    - 支持URL参数 `?tool=xxx&app=yyy` 的解析
    - 实现工具和应用状态的URL同步
    - 支持直接访问特定工具+应用组合
    - _Requirements: 2.2, 2.3_

- [ ] 7. 测试和验证功能完整性
  - [ ] 7.1 基础功能测试
    - 测试工具区页面正常加载
    - 验证工具切换功能正常
    - 测试应用选择器显示和交互
    - _Requirements: 1.1, 1.4_

  - [ ] 7.2 应用集成测试
    - 测试每个应用在工具区中正常显示
    - 验证应用功能与原始页面一致
    - 测试应用与工具的协同工作
    - _Requirements: 2.1, 2.2, 4.1, 4.2_

  - [ ] 7.3 路由和导航测试
    - 测试URL参数的正确解析和同步
    - 验证重定向规则正常工作
    - 测试浏览器前进后退功能
    - _Requirements: 2.2, 2.3, 4.3_

- [ ] 8. 清理和优化
  - [ ] 8.1 清理原有目录
    - 确认所有功能迁移完成后删除 `src/components/workspace/`
    - 保留 `src/app/[locale]/(default)/new-page/` 作为重定向源
    - 清理不再使用的import和依赖
    - _Requirements: 3.1, 3.3_

  - [ ] 8.2 性能优化
    - 实现应用组件的懒加载
    - 优化工具区的渲染性能
    - 添加加载状态和错误边界
    - _Requirements: 4.1, 4.2_

- [ ] 9. 第一阶段验证和上线
  - [ ] 9.1 完整功能测试
    - 进行端到端的用户流程测试
    - 验证所有API调用正常工作
    - 测试不同设备和浏览器的兼容性
    - _Requirements: 1.1, 1.2, 1.4, 2.1, 2.2_

  - [ ] 9.2 构建和部署验证
    - 运行生产构建确保无错误
    - 验证所有静态资源正确加载
    - 测试生产环境的完整功能
    - _Requirements: 3.1, 3.3, 4.1, 4.2_

- [ ] 10. 第二阶段：应用页面统一迁移（后期优化）
  - [ ] 10.1 规划统一路径结构
    - 设计最终的应用页面路径规范：`/ai-tools/applications/[app-id]`
    - 制定应用页面的标准化模板和组件结构
    - 确保新路径符合SEO和用户体验最佳实践
    - _Requirements: 4.3, 5.1_

  - [ ] 10.2 迁移现有应用页面
    - 将 `/new-page/AI-EFFECTS` 迁移到 `/ai-tools/applications/ai-effects`
    - 将 `/new-page/image-editor/AI-Image-Enhancer` 迁移到 `/ai-tools/applications/image-enhancer`
    - 将 `/new-page/image-editor/qwen-image-edit` 迁移到 `/ai-tools/applications/qwen-edit`
    - 保持页面内容和功能完全一致
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ] 10.3 更新重定向规则
    - 修改 `next.config.mjs` 中的重定向规则
    - 将原有路径重定向到新的统一路径
    - 确保搜索引擎和用户书签的兼容性
    - _Requirements: 4.3_

  - [ ] 10.4 清理原有页面目录
    - 确认所有应用页面迁移完成后删除 `src/app/[locale]/(default)/new-page/`
    - 更新应用配置中的 `originalPath` 为新路径
    - 清理不再使用的组件和依赖
    - _Requirements: 4.3, 5.1_

- [ ] 11. 建立新应用开发规范（长期维护）
  - [ ] 11.1 创建应用开发模板
    - 基于统一路径创建应用页面模板
    - 提供标准的应用组件结构和样式指南
    - 建立应用与工具区集成的最佳实践
    - _Requirements: 5.1, 5.2_

  - [ ] 11.2 更新开发工具和脚本
    - 修改 `scripts/create-tool.js` 支持创建应用页面
    - 创建 `scripts/create-app.js` 专门用于创建新应用
    - 更新应用配置的自动化管理工具
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ] 11.3 完善文档和指南
    - 更新架构文档，反映最终的统一结构
    - 创建新应用开发指南和最佳实践文档
    - 建立应用质量检查和审核流程
    - _Requirements: 5.1, 5.2, 5.3_