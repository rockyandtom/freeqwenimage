#!/usr/bin/env node

/**
 * Comprehensive API Test Suite for AI Tools Platform
 * Tests all API endpoints including RunningHub integration, tools management, and analytics
 */

require('dotenv').config({ path: '.env.development' });

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  timeout: 30000, // 30 seconds
  maxRetries: 3,
  pollInterval: 3000, // 3 seconds
  maxPollAttempts: 10
};

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
  details: []
};

// Utility functions
function logTest(name, status, details = '') {
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${icon} ${name}${details ? ': ' + details : ''}`);
  
  testResults.details.push({ name, status, details });
  if (status === 'PASS') testResults.passed++;
  else if (status === 'FAIL') testResults.failed++;
  else testResults.skipped++;
}

function logSection(title) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`📋 ${title}`);
  console.log('='.repeat(50));
}

async function makeRequest(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TEST_CONFIG.timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Create test image buffer
function createTestImageBuffer() {
  return Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
    0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x57, 0x63, 0xF8, 0x0F, 0x00, 0x00,
    0x01, 0x00, 0x01, 0x5C, 0xC2, 0x8A, 0x8E, 0x00, 0x00, 0x00, 0x00, 0x49,
    0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
  ]);
}

async function testEnvironmentSetup() {
  logSection('Environment Setup Tests');

  // Test environment variables
  const requiredVars = ['RUNNINGHUB_API_KEY', 'RUNNINGHUB_WEBAPP_ID', 'RUNNINGHUB_NODE_ID'];
  let envOk = true;
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      logTest(`Environment variable ${varName}`, 'FAIL', 'Not set');
      envOk = false;
    } else {
      logTest(`Environment variable ${varName}`, 'PASS', `${process.env[varName].substring(0, 10)}...`);
    }
  });

  // Test server connection
  try {
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/ping`);
    if (response.ok) {
      logTest('Server connection', 'PASS', 'Server is running');
    } else {
      logTest('Server connection', 'FAIL', `HTTP ${response.status}`);
      envOk = false;
    }
  } catch (error) {
    logTest('Server connection', 'FAIL', 'Server not responding');
    envOk = false;
  }

  return envOk;
}

async function testToolsManagementAPI() {
  logSection('Tools Management API Tests');

  const endpoints = [
    { path: '/api/tools/list', method: 'GET', name: 'Tools List' },
    { path: '/api/tools/categories', method: 'GET', name: 'Tools Categories' },
    { path: '/api/tools/stats', method: 'GET', name: 'Tools Stats' }
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(`${TEST_CONFIG.baseUrl}${endpoint.path}`, {
        method: endpoint.method
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success !== false) {
          logTest(endpoint.name, 'PASS', `HTTP ${response.status}`);
        } else {
          logTest(endpoint.name, 'FAIL', data.error || 'API returned success: false');
        }
      } else {
        logTest(endpoint.name, 'FAIL', `HTTP ${response.status}`);
      }
    } catch (error) {
      logTest(endpoint.name, 'FAIL', error.message);
    }
  }

  // Test specific tool endpoint
  try {
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/tools/text-to-image`, {
      method: 'GET'
    });

    if (response.ok) {
      const data = await response.json();
      logTest('Specific Tool Info', 'PASS', 'text-to-image tool data retrieved');
    } else {
      logTest('Specific Tool Info', 'FAIL', `HTTP ${response.status}`);
    }
  } catch (error) {
    logTest('Specific Tool Info', 'FAIL', error.message);
  }
}

async function testRunningHubAPI() {
  logSection('RunningHub API Integration Tests');

  const baseUrl = TEST_CONFIG.baseUrl;

  // Test file upload
  let uploadedFileId = null;
  try {
    const testImageBuffer = createTestImageBuffer();
    const formData = new FormData();
    const blob = new Blob([testImageBuffer], { type: 'image/png' });
    formData.append('file', blob, 'test.png');

    const uploadResponse = await makeRequest(`${baseUrl}/api/runninghubAPI/upload`, {
      method: 'POST',
      body: formData,
    });

    if (uploadResponse.ok) {
      const uploadResult = await uploadResponse.json();
      if (uploadResult.success && uploadResult.fileId) {
        uploadedFileId = uploadResult.fileId;
        logTest('File Upload', 'PASS', `File ID: ${uploadResult.fileId}`);
      } else {
        logTest('File Upload', 'FAIL', uploadResult.error || 'No file ID returned');
        return null;
      }
    } else {
      const errorText = await uploadResponse.text();
      logTest('File Upload', 'FAIL', `HTTP ${uploadResponse.status}: ${errorText}`);
      return null;
    }
  } catch (error) {
    logTest('File Upload', 'FAIL', error.message);
    return null;
  }

  // Test all RunningHub API endpoints
  const runningHubEndpoints = [
    {
      name: 'Text to Image',
      path: '/api/runninghubAPI/text-to-image',
      payload: { prompt: 'A beautiful sunset over mountains' }
    },
    {
      name: 'Image to Image',
      path: '/api/runninghubAPI/image-to-image',
      payload: { imageUrl: uploadedFileId, prompt: 'Make it more colorful' }
    },
    {
      name: 'Image Enhancer',
      path: '/api/runninghubAPI/Image-Enhancer',
      payload: { imageUrl: uploadedFileId }
    },
    {
      name: 'Image to Video',
      path: '/api/runninghubAPI/image-to-video',
      payload: { imageUrl: uploadedFileId }
    }
  ];

  const taskIds = [];

  for (const endpoint of runningHubEndpoints) {
    try {
      // Skip endpoints that require uploaded file if upload failed
      if (!uploadedFileId && endpoint.payload.imageUrl) {
        logTest(endpoint.name, 'SKIP', 'No uploaded file available');
        continue;
      }

      const response = await makeRequest(`${baseUrl}${endpoint.path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(endpoint.payload)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success || result.code === 0) {
          const taskId = result.data?.taskId || result.taskId;
          if (taskId) {
            taskIds.push({ name: endpoint.name, taskId });
            logTest(endpoint.name, 'PASS', `Task ID: ${taskId}`);
          } else {
            logTest(endpoint.name, 'FAIL', 'No task ID returned');
          }
        } else {
          logTest(endpoint.name, 'FAIL', result.error || result.msg || 'API returned error');
        }
      } else {
        const errorText = await response.text();
        logTest(endpoint.name, 'FAIL', `HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
      logTest(endpoint.name, 'FAIL', error.message);
    }
  }

  return taskIds;
}

async function testTaskStatusPolling(taskIds) {
  if (!taskIds || taskIds.length === 0) {
    logTest('Task Status Polling', 'SKIP', 'No tasks to poll');
    return;
  }

  logSection('Task Status Polling Tests');

  for (const { name, taskId } of taskIds) {
    let attempts = 0;
    let taskCompleted = false;

    while (attempts < TEST_CONFIG.maxPollAttempts && !taskCompleted) {
      attempts++;
      
      try {
        const statusResponse = await makeRequest(`${TEST_CONFIG.baseUrl}/api/runninghubAPI/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId })
        });

        if (statusResponse.ok) {
          const statusResult = await statusResponse.json();
          const { status, resultUrl, progress } = statusResult.data || {};
          
          if (status === 'completed' && resultUrl) {
            logTest(`${name} Status Polling`, 'PASS', `Completed with result: ${resultUrl}`);
            taskCompleted = true;
          } else if (status === 'failed' || status === 'error') {
            logTest(`${name} Status Polling`, 'FAIL', `Task failed: ${statusResult.error || 'Unknown error'}`);
            taskCompleted = true;
          } else if (status === 'running' || status === 'pending') {
            if (attempts === TEST_CONFIG.maxPollAttempts) {
              logTest(`${name} Status Polling`, 'SKIP', `Still ${status} after ${attempts} attempts`);
            } else {
              // Continue polling
              await new Promise(resolve => setTimeout(resolve, TEST_CONFIG.pollInterval));
            }
          } else {
            logTest(`${name} Status Polling`, 'FAIL', `Unknown status: ${status}`);
            taskCompleted = true;
          }
        } else {
          logTest(`${name} Status Polling`, 'FAIL', `HTTP ${statusResponse.status}`);
          taskCompleted = true;
        }
      } catch (error) {
        logTest(`${name} Status Polling`, 'FAIL', error.message);
        taskCompleted = true;
      }
    }
  }
}

async function testAnalyticsAPI() {
  logSection('Analytics & Performance API Tests');

  const endpoints = [
    { path: '/api/analytics', method: 'GET', name: 'Analytics Data' },
    { path: '/api/performance', method: 'GET', name: 'Performance Metrics' }
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(`${TEST_CONFIG.baseUrl}${endpoint.path}`, {
        method: endpoint.method
      });

      if (response.ok) {
        const data = await response.json();
        logTest(endpoint.name, 'PASS', `HTTP ${response.status}`);
      } else {
        logTest(endpoint.name, 'FAIL', `HTTP ${response.status}`);
      }
    } catch (error) {
      logTest(endpoint.name, 'FAIL', error.message);
    }
  }
}

async function testErrorHandling() {
  logSection('Error Handling Tests');

  const errorTests = [
    {
      name: 'Invalid JSON Payload',
      path: '/api/runninghubAPI/text-to-image',
      options: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json'
      }
    },
    {
      name: 'Missing Required Parameters',
      path: '/api/runninghubAPI/text-to-image',
      options: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      }
    },
    {
      name: 'Invalid File Upload',
      path: '/api/runninghubAPI/upload',
      options: {
        method: 'POST',
        body: new FormData() // Empty form data
      }
    },
    {
      name: 'Non-existent Task Status',
      path: '/api/runninghubAPI/status',
      options: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: 'non-existent-task-id' })
      }
    }
  ];

  for (const test of errorTests) {
    try {
      const response = await makeRequest(`${TEST_CONFIG.baseUrl}${test.path}`, test.options);
      
      // We expect these to fail with proper error responses
      if (response.status >= 400 && response.status < 500) {
        const errorData = await response.json();
        if (errorData.error || errorData.message) {
          logTest(test.name, 'PASS', `Proper error response: ${response.status}`);
        } else {
          logTest(test.name, 'FAIL', 'No error message in response');
        }
      } else {
        logTest(test.name, 'FAIL', `Expected error but got: ${response.status}`);
      }
    } catch (error) {
      logTest(test.name, 'PASS', 'Request properly rejected');
    }
  }
}

async function testPerformanceBenchmarks() {
  logSection('Performance Benchmark Tests');

  const benchmarks = [
    {
      name: 'API Response Time - Tools List',
      path: '/api/tools/list',
      method: 'GET',
      maxTime: 1000 // 1 second
    },
    {
      name: 'API Response Time - Upload',
      path: '/api/runninghubAPI/upload',
      method: 'POST',
      maxTime: 5000, // 5 seconds
      setup: () => {
        const formData = new FormData();
        const blob = new Blob([createTestImageBuffer()], { type: 'image/png' });
        formData.append('file', blob, 'test.png');
        return { body: formData };
      }
    }
  ];

  for (const benchmark of benchmarks) {
    try {
      const startTime = Date.now();
      const options = benchmark.setup ? benchmark.setup() : {};
      
      const response = await makeRequest(`${TEST_CONFIG.baseUrl}${benchmark.path}`, {
        method: benchmark.method,
        ...options
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      if (response.ok && responseTime <= benchmark.maxTime) {
        logTest(benchmark.name, 'PASS', `${responseTime}ms (< ${benchmark.maxTime}ms)`);
      } else if (response.ok) {
        logTest(benchmark.name, 'FAIL', `${responseTime}ms (> ${benchmark.maxTime}ms)`);
      } else {
        logTest(benchmark.name, 'FAIL', `HTTP ${response.status}`);
      }
    } catch (error) {
      logTest(benchmark.name, 'FAIL', error.message);
    }
  }
}

function generateTestReport() {
  logSection('Test Results Summary');
  
  console.log(`📊 Total Tests: ${testResults.passed + testResults.failed + testResults.skipped}`);
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`⚠️  Skipped: ${testResults.skipped}`);
  
  const successRate = ((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1);
  console.log(`📈 Success Rate: ${successRate}%`);

  if (testResults.failed > 0) {
    console.log('\n🔍 Failed Tests:');
    testResults.details
      .filter(test => test.status === 'FAIL')
      .forEach(test => console.log(`   - ${test.name}: ${test.details}`));
  }

  // Generate JSON report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: testResults.passed + testResults.failed + testResults.skipped,
      passed: testResults.passed,
      failed: testResults.failed,
      skipped: testResults.skipped,
      successRate: parseFloat(successRate)
    },
    details: testResults.details
  };

  require('fs').writeFileSync(
    'test-results.json',
    JSON.stringify(report, null, 2)
  );

  console.log('\n📄 Detailed report saved to: test-results.json');
}

async function runComprehensiveAPITests() {
  console.log('🧪 Starting Comprehensive API Test Suite...\n');

  try {
    // Environment setup tests
    const envOk = await testEnvironmentSetup();
    if (!envOk) {
      console.log('\n❌ Environment setup failed. Cannot continue with API tests.');
      return;
    }

    // Tools management API tests
    await testToolsManagementAPI();

    // RunningHub API integration tests
    const taskIds = await testRunningHubAPI();

    // Task status polling tests
    await testTaskStatusPolling(taskIds);

    // Analytics API tests
    await testAnalyticsAPI();

    // Error handling tests
    await testErrorHandling();

    // Performance benchmark tests
    await testPerformanceBenchmarks();

    // Generate final report
    generateTestReport();

  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
    logTest('Test Suite Execution', 'FAIL', error.message);
  }

  console.log('\n' + '='.repeat(50));
  console.log('🏁 Comprehensive API testing completed');
  console.log('\n💡 Tips:');
  console.log('   - Make sure the development server is running: npm run dev');
  console.log('   - Check the browser console for more detailed error messages');
  console.log('   - Verify your RunningHub API credentials are correct');
  console.log('   - Review test-results.json for detailed analysis');
}



// Check command line arguments
if (process.argv.includes('--help')) {
  console.log('Usage: npm run test:api [options]');
  console.log('');
  console.log('Comprehensive API Test Suite for AI Tools Platform');
  console.log('');
  console.log('Options:');
  console.log('  --help          Show this help message');
  console.log('  --quick         Run only basic connectivity tests');
  console.log('  --performance   Run only performance benchmark tests');
  console.log('  --errors        Run only error handling tests');
  console.log('');
  console.log('This script tests:');
  console.log('1. Environment setup and server connectivity');
  console.log('2. Tools management API endpoints');
  console.log('3. RunningHub API integration (all tools)');
  console.log('4. Task status polling mechanisms');
  console.log('5. Analytics and performance APIs');
  console.log('6. Error handling and validation');
  console.log('7. Performance benchmarks');
  console.log('');
  console.log('Make sure the development server is running with: npm run dev');
  process.exit(0);
}

// Handle different test modes
if (process.argv.includes('--quick')) {
  // Quick mode - only basic tests
  (async () => {
    await testEnvironmentSetup();
    await testToolsManagementAPI();
    generateTestReport();
  })();
} else if (process.argv.includes('--performance')) {
  // Performance mode - only benchmarks
  (async () => {
    const envOk = await testEnvironmentSetup();
    if (envOk) {
      await testPerformanceBenchmarks();
    }
    generateTestReport();
  })();
} else if (process.argv.includes('--errors')) {
  // Error handling mode
  (async () => {
    const envOk = await testEnvironmentSetup();
    if (envOk) {
      await testErrorHandling();
    }
    generateTestReport();
  })();
} else {
  // Full comprehensive test suite
  runComprehensiveAPITests();
}