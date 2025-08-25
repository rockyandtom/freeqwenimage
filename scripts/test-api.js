#!/usr/bin/env node

/**
 * Test script to verify RunningHub API integration based on the official guide
 */

require('dotenv').config({ path: '.env.development' });

async function testRunningHubAPI() {
  console.log('🧪 Testing RunningHub API integration...\n');

  const baseUrl = 'http://localhost:3000';

  try {
    // Test 1: Check environment variables
    console.log('1. Checking environment variables...');
    const requiredVars = ['RUNNINGHUB_API_KEY', 'RUNNINGHUB_WEBAPP_ID', 'RUNNINGHUB_NODE_ID'];
    let envOk = true;
    
    requiredVars.forEach(varName => {
      if (!process.env[varName]) {
        console.log(`❌ ${varName} is not set`);
        envOk = false;
      } else {
        console.log(`✅ ${varName}: ${process.env[varName].substring(0, 10)}...`);
      }
    });

    if (!envOk) {
      console.log('❌ Environment variables not properly configured');
      return;
    }

    // Test 2: Check if server is running
    console.log('\n2. Testing server connection...');
    try {
      const pingResponse = await fetch(`${baseUrl}/api/ping`);
      if (pingResponse.ok) {
        console.log('✅ Server is running');
      } else {
        console.log('❌ Server is not responding');
        return;
      }
    } catch (error) {
      console.log('❌ Server is not running. Please start with: npm run dev');
      return;
    }

    // Test 3: Test upload endpoint with a real image
    console.log('\n3. Testing upload endpoint...');
    
    // Create a simple test image (1x1 pixel PNG) - based on API guide
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x57, 0x63, 0xF8, 0x0F, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x5C, 0xC2, 0x8A, 0x8E, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    const formData = new FormData();
    const blob = new Blob([testImageBuffer], { type: 'image/png' });
    formData.append('file', blob, 'test.png');

    const uploadResponse = await fetch(`${baseUrl}/api/runninghubAPI/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.log('❌ Upload endpoint failed:', errorText);
      return;
    }

    const uploadResult = await uploadResponse.json();
    console.log('✅ Upload endpoint working');
    console.log('   File ID:', uploadResult.fileId);

    if (!uploadResult.success || !uploadResult.fileId) {
      console.log('❌ Upload failed:', uploadResult.error || 'No file ID returned');
      return;
    }

    // Test 4: Test Image-Enhancer endpoint
    console.log('\n4. Testing Image-Enhancer endpoint...');
    
    const enhanceResponse = await fetch(`${baseUrl}/api/runninghubAPI/Image-Enhancer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageUrl: uploadResult.fileId, // 保持完整的文件 ID，包括 api/ 前缀
      }),
    });

    if (!enhanceResponse.ok) {
      const errorText = await enhanceResponse.text();
      console.log('❌ Image-Enhancer endpoint failed:', errorText);
      return;
    }

    const enhanceResult = await enhanceResponse.json();
    console.log('✅ Image-Enhancer endpoint working');
    console.log('   Task ID:', enhanceResult.data?.taskId);
    console.log('   Response code:', enhanceResult.code);

    if (enhanceResult.code !== 0 || !enhanceResult.data?.taskId) {
      console.log('❌ Enhancement task creation failed:', enhanceResult.msg || 'No task ID returned');
      return;
    }

    // Test 5: Test status endpoint with polling
    console.log('\n5. Testing status endpoint with polling...');
    
    const taskId = enhanceResult.data.taskId;
    let attempts = 0;
    const maxAttempts = 10; // 最多尝试10次，每次间隔3秒
    
    while (attempts < maxAttempts) {
      attempts++;
      console.log(`   Attempt ${attempts}/${maxAttempts}: Checking task status...`);
      
      const statusResponse = await fetch(`${baseUrl}/api/runninghubAPI/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: taskId,
        }),
      });

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text();
        console.log('❌ Status endpoint failed:', errorText);
        break;
      }

      const statusResult = await statusResponse.json();
      console.log(`   Status: ${statusResult.data?.status || 'unknown'}`);
      
      if (statusResult.success) {
        const { status, resultUrl, progress } = statusResult.data;
        
        if (status === 'completed' && resultUrl) {
          console.log('✅ Task completed successfully!');
          console.log('   Result URL:', resultUrl);
          break;
        } else if (status === 'failed' || status === 'error') {
          console.log('❌ Task failed:', statusResult.error || 'Unknown error');
          break;
        } else if (status === 'running' || status === 'pending') {
          console.log(`   Task is ${status}, progress: ${progress || 0}%`);
          if (attempts < maxAttempts) {
            console.log('   Waiting 3 seconds before next check...');
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
        } else {
          console.log(`   Unknown status: ${status}`);
        }
      } else {
        console.log('❌ Status check failed:', statusResult.error);
        break;
      }
    }

    if (attempts >= maxAttempts) {
      console.log('⚠️  Polling timeout reached. Task may still be processing.');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  console.log('\n' + '='.repeat(50));
  console.log('🏁 RunningHub API testing completed');
  console.log('\n💡 Tips:');
  console.log('   - Make sure the development server is running: npm run dev');
  console.log('   - Check the browser console for more detailed error messages');
  console.log('   - Verify your RunningHub API credentials are correct');
}

// Check command line arguments
if (process.argv.includes('--help')) {
  console.log('Usage: npm run test:api');
  console.log('');
  console.log('This script tests the RunningHub API integration by:');
  console.log('1. Checking environment variables');
  console.log('2. Testing server connection');
  console.log('3. Uploading a test image');
  console.log('4. Creating an enhancement task');
  console.log('5. Polling task status until completion');
  console.log('');
  console.log('Make sure the development server is running with: npm run dev');
  process.exit(0);
}

testRunningHubAPI();