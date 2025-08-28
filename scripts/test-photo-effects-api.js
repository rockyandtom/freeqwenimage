#!/usr/bin/env node

/**
 * Photo Effects API 测试脚本
 * 用于验证API是否正常工作
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

async function testUploadAPI() {
  log('\n📤 测试上传API...', 'blue');
  
  try {
    // 创建一个测试图片文件（1x1像素的PNG）
    const testImagePath = path.join(__dirname, 'test-image.png');
    const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    fs.writeFileSync(testImagePath, testImageBuffer);
    
    const formData = new FormData();
    const file = new File([testImageBuffer], 'test-image.png', { type: 'image/png' });
    formData.append('file', file);
    
    const response = await fetch('http://localhost:3000/api/runninghubAPI/upload', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (result.success) {
      log('  ✅ 上传API测试成功', 'green');
      log(`  📁 文件ID: ${result.data.fileId}`, 'green');
      return result.data.fileId;
    } else {
      log('  ❌ 上传API测试失败', 'red');
      log(`  🔍 错误: ${result.error}`, 'red');
      return null;
    }
  } catch (error) {
    log('  ❌ 上传API测试失败', 'red');
    log(`  🔍 错误: ${error.message}`, 'red');
    return null;
  }
}

async function testPhotoEffectsAPI(imageUrl) {
  log('\n🎨 测试Photo Effects API...', 'blue');
  
  try {
    const response = await fetch('http://localhost:3000/api/runninghubAPI/photo-effects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ imageUrl })
    });
    
    const result = await response.json();
    
    if (result.success) {
      log('  ✅ Photo Effects API测试成功', 'green');
      log(`  🆔 任务ID: ${result.data.taskId}`, 'green');
      log(`  📊 状态: ${result.data.taskStatus}`, 'green');
      return result.data.taskId;
    } else {
      log('  ❌ Photo Effects API测试失败', 'red');
      log(`  🔍 错误: ${result.error}`, 'red');
      return null;
    }
  } catch (error) {
    log('  ❌ Photo Effects API测试失败', 'red');
    log(`  🔍 错误: ${error.message}`, 'red');
    return null;
  }
}

async function testStatusAPI(taskId) {
  log('\n📊 测试状态检查API...', 'blue');
  
  try {
    const response = await fetch('http://localhost:3000/api/runninghubAPI/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ taskId })
    });
    
    const result = await response.json();
    
    if (result.success) {
      log('  ✅ 状态检查API测试成功', 'green');
      log(`  📊 状态: ${result.data.status}`, 'green');
      log(`  📈 进度: ${result.data.progress}%`, 'green');
      return result.data;
    } else {
      log('  ❌ 状态检查API测试失败', 'red');
      log(`  🔍 错误: ${result.error}`, 'red');
      return null;
    }
  } catch (error) {
    log('  ❌ 状态检查API测试失败', 'red');
    log(`  🔍 错误: ${error.message}`, 'red');
    return null;
  }
}

async function main() {
  log('🚀 Photo Effects API 测试工具', 'blue');
  log('================================', 'blue');
  
  // 检查开发服务器是否运行
  try {
    const healthCheck = await fetch('http://localhost:3000');
    if (!healthCheck.ok) {
      log('❌ 开发服务器未运行，请先启动 npm run dev', 'red');
      return;
    }
    log('✅ 开发服务器正在运行', 'green');
  } catch (error) {
    log('❌ 无法连接到开发服务器，请先启动 npm run dev', 'red');
    return;
  }
  
  // 测试上传API
  const fileId = await testUploadAPI();
  if (!fileId) {
    log('\n❌ 上传API测试失败，停止测试', 'red');
    return;
  }
  
  // 测试Photo Effects API
  const taskId = await testPhotoEffectsAPI(fileId);
  if (!taskId) {
    log('\n❌ Photo Effects API测试失败，停止测试', 'red');
    return;
  }
  
  // 测试状态检查API
  const statusData = await testStatusAPI(taskId);
  if (!statusData) {
    log('\n❌ 状态检查API测试失败', 'red');
    return;
  }
  
  // 总结
  log('\n📊 测试结果总结:', 'blue');
  log('  ✅ 所有API测试通过', 'green');
  log('  💡 Photo Effects功能应该可以正常工作', 'blue');
  log('  🔧 如果仍有问题，请检查浏览器控制台和服务器日志', 'yellow');
}

// 运行主函数
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testUploadAPI,
  testPhotoEffectsAPI,
  testStatusAPI
};
