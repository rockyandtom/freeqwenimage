#!/usr/bin/env node

/**
 * Photo Effects 完整流程测试
 */

const fs = require('fs');
const path = require('path');

// 颜色输出
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testCompleteFlow() {
  log('🚀 测试Photo Effects完整流程', 'blue');
  log('================================', 'blue');
  
  try {
    // 1. 测试上传API
    log('\n📤 步骤1: 测试上传API', 'yellow');
    
    // 创建一个测试图片文件（1x1像素的PNG）
    const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    
    const formData = new FormData();
    const file = new File([testImageBuffer], 'test-image.png', { type: 'image/png' });
    formData.append('file', file);
    
    const uploadResponse = await fetch('http://localhost:3000/api/runninghubAPI/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!uploadResponse.ok) {
      throw new Error(`上传失败: ${uploadResponse.status}`);
    }
    
    const uploadResult = await uploadResponse.json();
    
    if (!uploadResult.success) {
      throw new Error(`上传失败: ${uploadResult.error}`);
    }
    
    const fileId = uploadResult.data.fileId;
    log(`  ✅ 上传成功，文件ID: ${fileId}`, 'green');
    
    // 2. 测试Photo Effects API
    log('\n🎨 步骤2: 测试Photo Effects API', 'yellow');
    
    const photoEffectsResponse = await fetch('http://localhost:3000/api/runninghubAPI/photo-effects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ imageUrl: fileId })
    });
    
    if (!photoEffectsResponse.ok) {
      throw new Error(`Photo Effects API失败: ${photoEffectsResponse.status}`);
    }
    
    const photoEffectsResult = await photoEffectsResponse.json();
    
    if (!photoEffectsResult.success) {
      throw new Error(`Photo Effects API失败: ${photoEffectsResult.error}`);
    }
    
    const taskId = photoEffectsResult.data.taskId;
    log(`  ✅ Photo Effects API成功，任务ID: ${taskId}`, 'green');
    
    // 3. 测试状态检查API
    log('\n📊 步骤3: 测试状态检查API', 'yellow');
    
    const statusResponse = await fetch('http://localhost:3000/api/runninghubAPI/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ taskId })
    });
    
    if (!statusResponse.ok) {
      throw new Error(`状态检查失败: ${statusResponse.status}`);
    }
    
    const statusResult = await statusResponse.json();
    
    if (!statusResult.success) {
      throw new Error(`状态检查失败: ${statusResult.error}`);
    }
    
    log(`  ✅ 状态检查成功，状态: ${statusResult.data.status}`, 'green');
    log(`  📈 进度: ${statusResult.data.progress}%`, 'green');
    
    // 总结
    log('\n📊 测试结果总结:', 'blue');
    log('  ✅ 所有API测试通过', 'green');
    log('  💡 Photo Effects功能应该可以正常工作', 'blue');
    log('  🔧 如果仍有问题，请检查浏览器控制台和服务器日志', 'yellow');
    
  } catch (error) {
    log('\n❌ 测试失败', 'red');
    log(`  🔍 错误: ${error.message}`, 'red');
    log('  💡 请检查开发服务器是否运行，以及API是否正确配置', 'yellow');
  }
}

// 运行测试
if (require.main === module) {
  testCompleteFlow().catch(console.error);
}

module.exports = { testCompleteFlow };
