#!/usr/bin/env node

/**
 * 测试脚本：验证 API 调用是否与提供的 curl 命令匹配
 */

require('dotenv').config({ path: '.env.development' });

async function testCurlMatch() {
  console.log('🧪 Testing API call matches the provided curl command...\n');

  // 您提供的 curl 命令参数
  const expectedParams = {
    webappId: "1958797744955613186",
    apiKey: "fb88fac46b0349c1986c9cbb4f14d44e",
    nodeInfoList: [{
      nodeId: "2",
      fieldName: "image",
      fieldValue: "pasted/a81f2ad629c3426f9ceb91ef1bf5964fa82851cda250995ddf61bbcdf975cd72.png",
      description: "image"
    }]
  };

  console.log('📋 Expected parameters from curl command:');
  console.log(JSON.stringify(expectedParams, null, 2));

  console.log('\n📋 Current environment variables:');
  console.log(`RUNNINGHUB_API_KEY: ${process.env.RUNNINGHUB_API_KEY}`);
  console.log(`RUNNINGHUB_WEBAPP_ID: ${process.env.RUNNINGHUB_WEBAPP_ID}`);
  console.log(`RUNNINGHUB_NODE_ID: ${process.env.RUNNINGHUB_NODE_ID}`);

  // 验证匹配
  let isMatch = true;
  
  if (process.env.RUNNINGHUB_API_KEY !== expectedParams.apiKey) {
    console.log('\n❌ API Key mismatch!');
    console.log(`Expected: ${expectedParams.apiKey}`);
    console.log(`Current:  ${process.env.RUNNINGHUB_API_KEY}`);
    isMatch = false;
  } else {
    console.log('\n✅ API Key matches');
  }

  if (process.env.RUNNINGHUB_WEBAPP_ID !== expectedParams.webappId) {
    console.log('\n❌ WebApp ID mismatch!');
    console.log(`Expected: ${expectedParams.webappId}`);
    console.log(`Current:  ${process.env.RUNNINGHUB_WEBAPP_ID}`);
    isMatch = false;
  } else {
    console.log('✅ WebApp ID matches');
  }

  if (process.env.RUNNINGHUB_NODE_ID !== expectedParams.nodeInfoList[0].nodeId) {
    console.log('\n❌ Node ID mismatch!');
    console.log(`Expected: ${expectedParams.nodeInfoList[0].nodeId}`);
    console.log(`Current:  ${process.env.RUNNINGHUB_NODE_ID}`);
    isMatch = false;
  } else {
    console.log('✅ Node ID matches');
  }

  console.log('\n' + '='.repeat(50));
  
  if (isMatch) {
    console.log('✅ All parameters match the curl command!');
    console.log('\n🚀 Testing actual API call...');
    
    try {
      // 测试实际的 API 调用
      const testImageUrl = "pasted/test-image.png"; // 使用测试图像 URL
      
      const response = await fetch('http://localhost:3000/api/runninghubAPI/Image-Enhancer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: testImageUrl,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ API call successful!');
        console.log('Response:', JSON.stringify(result, null, 2));
      } else {
        const errorText = await response.text();
        console.log('❌ API call failed:', errorText);
      }
    } catch (error) {
      console.log('❌ API test failed:', error.message);
      console.log('💡 Make sure the development server is running: npm run dev');
    }
  } else {
    console.log('❌ Parameters do not match the curl command!');
    console.log('Please update the environment variables to match.');
  }
}

testCurlMatch();