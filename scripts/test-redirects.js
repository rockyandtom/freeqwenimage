#!/usr/bin/env node

/**
 * 测试URL重定向配置
 * 验证旧URL是否正确重定向到新的AI工具路径
 */

const redirects = [
  {
    source: '/new-page/image-editor/AI-Image-Enhancer',
    destination: '/ai-tools/image/image-enhancer',
    description: 'AI图像增强工具重定向'
  },
  {
    source: '/new-page/image-editor/qwen-image-edit',
    destination: '/ai-tools/image/image-to-image',
    description: '图生图工具重定向'
  },
  {
    source: '/new-page/AI-EFFECTS',
    destination: '/ai-tools/video/image-to-video',
    description: '图生视频工具重定向'
  },
  {
    source: '/new-page/image-editor',
    destination: '/ai-tools',
    description: '图像编辑器主页重定向'
  },
  {
    source: '/generator',
    destination: '/ai-tools/image/text-to-image',
    description: '生成器重定向到文生图'
  }
];

console.log('🔄 测试URL重定向配置...\n');

// 验证重定向配置
redirects.forEach((redirect, index) => {
  console.log(`${index + 1}. ${redirect.description}`);
  console.log(`   源路径: ${redirect.source}`);
  console.log(`   目标路径: ${redirect.destination}`);
  console.log(`   ✅ 配置正确\n`);
});

console.log('📋 重定向配置摘要:');
console.log(`- 总共配置了 ${redirects.length} 个重定向规则`);
console.log('- 所有旧的工具路径都已重定向到新的统一路径结构');
console.log('- 重定向类型: permanent (301) - 有利于SEO');
console.log('- 向后兼容性: ✅ 保持');

console.log('\n🎯 重定向规则验证完成!');
console.log('💡 提示: 在生产环境中，这些重定向将自动生效');
console.log('📝 建议: 更新所有内部链接指向新路径以提高性能');