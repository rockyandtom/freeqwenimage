#!/usr/bin/env node

/**
 * Comprehensive Test Runner
 * Runs all types of tests: unit, integration, API, and end-to-end
 */

const { spawn } = require('child_process');
const fs = require('fs');

// Test configuration
const TEST_CONFIG = {
  timeout: 300000, // 5 minutes per test suite
  retries: 2,
  parallel: false // Run sequentially to avoid conflicts
};

// Test suites to run
const TEST_SUITES = [
  {
    name: 'Environment Setup',
    command: 'node',
    args: ['scripts/test-env.js'],
    required: true,
    description: '检查环境变量和基础配置'
  },
  {
    name: 'API Tests',
    command: 'node',
    args: ['scripts/test-api.js', '--quick'],
    required: false,
    description: '测试API端点和集成'
  },
  {
    name: 'Unit Tests',
    command: 'npm',
    args: ['run', 'test', '--', '--passWithNoTests', '--verbose'],
    required: false,
    description: '运行组件和Hook单元测试'
  },
  {
    name: 'End-to-End Tests',
    command: 'npx',
    args: ['playwright', 'test', '--reporter=list'],
    required: false,
    description: '运行端到端用户流程测试'
  }
];

// Results tracking
const results = {
  passed: [],
  failed: [],
  skipped: [],
  startTime: Date.now()
};

function logSection(title) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🧪 ${title}`);
  console.log('='.repeat(60));
}

function logResult(suite, status, details = '') {
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${icon} [${timestamp}] ${suite.name}: ${status}${details ? ' - ' + details : ''}`);
  
  if (status === 'PASS') {
    results.passed.push(suite.name);
  } else if (status === 'FAIL') {
    results.failed.push({ name: suite.name, details });
  } else {
    results.skipped.push({ name: suite.name, reason: details });
  }
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'pipe',
      shell: true,
      ...options
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (data) => {
      stdout += data.toString();
      if (options.showOutput) {
        process.stdout.write(data);
      }
    });

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
      if (options.showOutput) {
        process.stderr.write(data);
      }
    });

    const timeout = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error(`Command timed out after ${TEST_CONFIG.timeout}ms`));
    }, TEST_CONFIG.timeout);

    child.on('close', (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve({ stdout, stderr, code });
      } else {
        reject(new Error(`Command failed with code ${code}\nStderr: ${stderr}`));
      }
    });

    child.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
}

async function runTestSuite(suite) {
  console.log(`\n🔄 Running ${suite.name}...`);
  console.log(`📝 ${suite.description}`);
  
  let retries = 0;
  
  while (retries <= TEST_CONFIG.retries) {
    try {
      const result = await runCommand(suite.command, suite.args, {
        showOutput: process.argv.includes('--verbose')
      });
      
      logResult(suite, 'PASS', `Completed in ${Math.round((Date.now() - Date.now()) / 1000)}s`);
      return true;
      
    } catch (error) {
      retries++;
      
      if (retries <= TEST_CONFIG.retries) {
        console.log(`⚠️  Attempt ${retries} failed, retrying... (${error.message})`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
      } else {
        logResult(suite, 'FAIL', error.message);
        
        if (suite.required) {
          console.log(`❌ Required test suite failed: ${suite.name}`);
          return false;
        }
        return true; // Continue with optional tests
      }
    }
  }
}

async function checkPrerequisites() {
  logSection('Prerequisites Check');
  
  // Check if development server is needed
  const needsServer = TEST_SUITES.some(suite => 
    suite.name.includes('API') || suite.name.includes('End-to-End')
  );
  
  if (needsServer) {
    console.log('🔍 Checking if development server is running...');
    
    try {
      const response = await fetch('http://localhost:3000/api/ping');
      if (response.ok) {
        console.log('✅ Development server is running');
      } else {
        console.log('❌ Development server is not responding');
        console.log('💡 Please start the server with: npm run dev');
        return false;
      }
    } catch (error) {
      console.log('❌ Development server is not running');
      console.log('💡 Please start the server with: npm run dev');
      
      if (!process.argv.includes('--skip-server-check')) {
        return false;
      }
    }
  }
  
  // Check if Playwright browsers are installed
  if (TEST_SUITES.some(suite => suite.name.includes('End-to-End'))) {
    console.log('🔍 Checking Playwright installation...');
    
    try {
      await runCommand('npx', ['playwright', '--version']);
      console.log('✅ Playwright is installed');
    } catch (error) {
      console.log('⚠️  Playwright may not be properly installed');
      console.log('💡 Run: npx playwright install');
    }
  }
  
  return true;
}

function generateReport() {
  logSection('Test Results Summary');
  
  const totalTime = Math.round((Date.now() - results.startTime) / 1000);
  const totalTests = results.passed.length + results.failed.length + results.skipped.length;
  
  console.log(`📊 Total Test Suites: ${totalTests}`);
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`⚠️  Skipped: ${results.skipped.length}`);
  console.log(`⏱️  Total Time: ${totalTime}s`);
  
  if (results.passed.length > 0) {
    console.log('\n✅ Passed Tests:');
    results.passed.forEach(name => console.log(`   - ${name}`));
  }
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed Tests:');
    results.failed.forEach(({ name, details }) => {
      console.log(`   - ${name}: ${details}`);
    });
  }
  
  if (results.skipped.length > 0) {
    console.log('\n⚠️  Skipped Tests:');
    results.skipped.forEach(({ name, reason }) => {
      console.log(`   - ${name}: ${reason}`);
    });
  }
  
  // Generate JSON report
  const report = {
    timestamp: new Date().toISOString(),
    duration: totalTime,
    summary: {
      total: totalTests,
      passed: results.passed.length,
      failed: results.failed.length,
      skipped: results.skipped.length,
      successRate: totalTests > 0 ? Math.round((results.passed.length / totalTests) * 100) : 0
    },
    results: {
      passed: results.passed,
      failed: results.failed,
      skipped: results.skipped
    }
  };
  
  fs.writeFileSync('test-results-comprehensive.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Detailed report saved to: test-results-comprehensive.json');
  
  // Return exit code
  return results.failed.length === 0 ? 0 : 1;
}

async function runAllTests() {
  console.log('🚀 Starting Comprehensive Test Suite...\n');
  
  // Check command line arguments
  if (process.argv.includes('--help')) {
    console.log('Usage: npm run test:all [options]');
    console.log('');
    console.log('Options:');
    console.log('  --help                Show this help message');
    console.log('  --verbose             Show detailed output from all tests');
    console.log('  --skip-server-check   Skip development server check');
    console.log('  --only-required       Run only required tests');
    console.log('');
    console.log('Test Suites:');
    TEST_SUITES.forEach(suite => {
      const required = suite.required ? '[REQUIRED]' : '[OPTIONAL]';
      console.log(`  ${required} ${suite.name}: ${suite.description}`);
    });
    process.exit(0);
  }
  
  // Check prerequisites
  const prerequisitesOk = await checkPrerequisites();
  if (!prerequisitesOk) {
    console.log('\n❌ Prerequisites check failed. Please fix the issues above and try again.');
    process.exit(1);
  }
  
  // Filter test suites based on arguments
  let suitesToRun = TEST_SUITES;
  if (process.argv.includes('--only-required')) {
    suitesToRun = TEST_SUITES.filter(suite => suite.required);
  }
  
  // Run test suites
  let allPassed = true;
  
  for (const suite of suitesToRun) {
    const suiteStartTime = Date.now();
    const passed = await runTestSuite(suite);
    
    if (!passed && suite.required) {
      allPassed = false;
      console.log(`\n❌ Critical test suite failed: ${suite.name}`);
      console.log('🛑 Stopping execution due to required test failure.');
      break;
    }
    
    // Add delay between test suites to avoid conflicts
    if (suitesToRun.indexOf(suite) < suitesToRun.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Generate final report
  const exitCode = generateReport();
  
  console.log('\n' + '='.repeat(60));
  if (exitCode === 0) {
    console.log('🎉 All tests completed successfully!');
  } else {
    console.log('💥 Some tests failed. Check the report above for details.');
  }
  console.log('='.repeat(60));
  
  process.exit(exitCode);
}

// Handle uncaught errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\n⚠️  Test execution interrupted by user');
  process.exit(1);
});

// Run the tests
runAllTests().catch(error => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
});