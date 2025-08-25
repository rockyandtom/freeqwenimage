#!/usr/bin/env node

/**
 * Test script to verify environment variables are properly configured
 */

require('dotenv').config({ path: '.env.development' });

console.log('🔍 Checking environment variables...\n');

const requiredVars = [
  'RUNNINGHUB_API_KEY',
  'RUNNINGHUB_WEBAPP_ID',
  'RUNNINGHUB_NODE_ID'
];

const optionalVars = [
  'DATABASE_URL',
  'AUTH_SECRET',
  'STRIPE_PUBLIC_KEY',
  'STRIPE_PRIVATE_KEY'
];

let hasErrors = false;

console.log('📋 Required Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
    hasErrors = true;
  }
});

console.log('\n📋 Optional Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`⚠️  ${varName}: NOT SET`);
  }
});

console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.log('❌ Some required environment variables are missing!');
  console.log('Please check your .env.development file.');
  process.exit(1);
} else {
  console.log('✅ All required environment variables are configured!');
  console.log('You can now run the application.');
}