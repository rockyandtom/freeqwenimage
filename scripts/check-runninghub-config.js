#!/usr/bin/env node

/**
 * RunningHub 配置检查脚本
 * 用于验证环境变量和API连接
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

function checkEnvironmentVariables() {
  log('\n🔍 检查环境变量配置...', 'blue');
  
  const requiredVars = [
    'RUNNINGHUB_API_KEY',
    'RUNNINGHUB_WEBAPP_ID'
  ];
  
  const optionalVars = [
    'RUNNINGHUB_API_URL'
  ];
  
  let allConfigured = true;
  
  // 检查必需的环境变量
  log('\n必需的环境变量:', 'yellow');
  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (value) {
      log(`  ✅ ${varName}: ${value.substring(0, 8)}...`, 'green');
    } else {
      log(`  ❌ ${varName}: 未设置`, 'red');
      allConfigured = false;
    }
  }
  
  // 检查可选的环境变量
  log('\n可选的环境变量:', 'yellow');
  for (const varName of optionalVars) {
    const value = process.env[varName];
    if (value) {
      log(`  ✅ ${varName}: ${value}`, 'green');
    } else {
      log(`  ⚠️  ${varName}: 未设置 (使用默认值)`, 'yellow');
    }
  }
  
  return allConfigured;
}

function checkEnvFiles() {
  log('\n📁 检查环境变量文件...', 'blue');
  
  const envFiles = [
    '.env',
    '.env.local',
    '.env.development',
    '.env.production'
  ];
  
  for (const envFile of envFiles) {
    const envPath = path.join(process.cwd(), envFile);
    if (fs.existsSync(envPath)) {
      log(`  ✅ ${envFile} 文件存在`, 'green');
      
      // 读取文件内容
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n');
      
      // 检查是否包含RunningHub配置
      const hasRunningHubConfig = lines.some(line => 
        line.includes('RUNNINGHUB_') && !line.startsWith('#')
      );
      
      if (hasRunningHubConfig) {
        log(`    📝 包含RunningHub配置`, 'green');
      } else {
        log(`    ⚠️  不包含RunningHub配置`, 'yellow');
      }
    } else {
      log(`  ❌ ${envFile} 文件不存在`, 'red');
    }
  }
}

function testRunningHubConnection() {
  log('\n🌐 测试RunningHub API连接...', 'blue');
  
  const apiKey = process.env.RUNNINGHUB_API_KEY;
  const webappId = process.env.RUNNINGHUB_WEBAPP_ID;
  
  if (!apiKey || !webappId) {
    log('  ❌ 缺少必要的环境变量，无法测试连接', 'red');
    return;
  }
  
  // 这里可以添加实际的API连接测试
  log('  ⚠️  API连接测试需要在实际运行时进行', 'yellow');
  log('  📋 请运行应用并尝试上传图片来测试连接', 'blue');
}

function generateEnvTemplate() {
  log('\n📝 生成环境变量模板...', 'blue');
  
  const template = `# RunningHub API Configuration
# 请将以下值替换为您的实际配置

# RunningHub API Key (从RunningHub平台获取)
RUNNINGHUB_API_KEY=your_api_key_here

# RunningHub WebApp ID (从RunningHub平台获取)
RUNNINGHUB_WEBAPP_ID=your_webapp_id_here

# RunningHub API Base URL (通常不需要修改)
RUNNINGHUB_API_URL=https://www.runninghub.cn

# 其他配置
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
`;
  
  const templatePath = path.join(process.cwd(), '.env.template');
  fs.writeFileSync(templatePath, template);
  log(`  ✅ 模板已生成: ${templatePath}`, 'green');
}

function main() {
  log('🚀 RunningHub 配置检查工具', 'blue');
  log('================================', 'blue');
  
  // 检查环境变量文件
  checkEnvFiles();
  
  // 检查环境变量
  const envConfigured = checkEnvironmentVariables();
  
  // 测试连接
  testRunningHubConnection();
  
  // 生成模板
  generateEnvTemplate();
  
  // 总结
  log('\n📊 检查结果总结:', 'blue');
  if (envConfigured) {
    log('  ✅ 环境变量配置完整', 'green');
    log('  💡 建议: 运行应用并测试Photo Effects功能', 'blue');
  } else {
    log('  ❌ 环境变量配置不完整', 'red');
    log('  💡 建议: 创建 .env.local 文件并填入正确的配置', 'yellow');
    log('  📋 参考 .env.template 文件中的配置格式', 'blue');
  }
  
  log('\n🔧 故障排除:', 'blue');
  log('  1. 确保 .env.local 文件存在并包含正确的配置', 'yellow');
  log('  2. 重启开发服务器以加载新的环境变量', 'yellow');
  log('  3. 检查RunningHub平台的API密钥和WebApp ID是否正确', 'yellow');
  log('  4. 查看浏览器控制台和服务器日志以获取详细错误信息', 'yellow');
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = {
  checkEnvironmentVariables,
  checkEnvFiles,
  testRunningHubConnection,
  generateEnvTemplate
};
