#!/usr/bin/env node

/**
 * Production deployment script for FreeQwenImage AI Tools Platform
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, description) {
  log(`\n${description}...`, 'blue');
  try {
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed`, 'green');
  } catch (error) {
    log(`❌ ${description} failed`, 'red');
    process.exit(1);
  }
}

function checkEnvironment() {
  log('\n🔍 Checking environment...', 'cyan');
  
  // Check if production environment file exists
  const prodEnvPath = path.join(process.cwd(), '.env.production');
  if (!fs.existsSync(prodEnvPath)) {
    log('❌ .env.production file not found', 'red');
    log('Please create .env.production based on .env.production.example', 'yellow');
    process.exit(1);
  }

  // Check required environment variables
  const requiredVars = [
    'RUNNINGHUB_API_KEY',
    'RUNNINGHUB_WEBAPP_ID',
    'NEXT_PUBLIC_WEB_URL',
  ];

  const envContent = fs.readFileSync(prodEnvPath, 'utf8');
  const missingVars = requiredVars.filter(varName => {
    const regex = new RegExp(`^${varName}\\s*=\\s*"?([^"\\n]+)"?`, 'm');
    const match = envContent.match(regex);
    return !match || !match[1] || match[1].includes('your_') || match[1].includes('example');
  });

  if (missingVars.length > 0) {
    log('❌ Missing or incomplete environment variables:', 'red');
    missingVars.forEach(varName => log(`   - ${varName}`, 'red'));
    log('Please update .env.production with actual values', 'yellow');
    process.exit(1);
  }

  log('✅ Environment configuration looks good', 'green');
}

function runTests() {
  log('\n🧪 Running tests...', 'cyan');
  
  // Type checking
  execCommand('pnpm type-check', 'TypeScript type checking');
  
  // Linting
  execCommand('pnpm lint', 'ESLint checking');
  
  // Unit tests
  execCommand('pnpm test --run', 'Unit tests');
  
  // API tests
  execCommand('pnpm test:api', 'API endpoint tests');
}

function buildApplication() {
  log('\n🏗️ Building application...', 'cyan');
  
  // Clean previous build
  execCommand('rm -rf .next', 'Cleaning previous build');
  
  // Build application
  execCommand('NODE_ENV=production pnpm build', 'Building Next.js application');
  
  // Verify build output
  const buildPath = path.join(process.cwd(), '.next');
  if (!fs.existsSync(buildPath)) {
    log('❌ Build output not found', 'red');
    process.exit(1);
  }
  
  log('✅ Build completed successfully', 'green');
}

function generateSitemap() {
  log('\n🗺️ Generating sitemap...', 'cyan');
  
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${process.env.NEXT_PUBLIC_WEB_URL || 'https://your-domain.com'}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${process.env.NEXT_PUBLIC_WEB_URL || 'https://your-domain.com'}/ai-tools</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${process.env.NEXT_PUBLIC_WEB_URL || 'https://your-domain.com'}/ai-tools/image/text-to-image</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${process.env.NEXT_PUBLIC_WEB_URL || 'https://your-domain.com'}/ai-tools/image/image-to-image</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${process.env.NEXT_PUBLIC_WEB_URL || 'https://your-domain.com'}/ai-tools/image/image-enhancer</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${process.env.NEXT_PUBLIC_WEB_URL || 'https://your-domain.com'}/ai-tools/video/image-to-video</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemapContent);
  log('✅ Sitemap generated', 'green');
}

function generateRobotsTxt() {
  log('\n🤖 Generating robots.txt...', 'cyan');
  
  const robotsContent = `User-agent: *
Allow: /

# AI Tools
Allow: /ai-tools
Allow: /ai-tools/image/text-to-image
Allow: /ai-tools/image/image-to-image
Allow: /ai-tools/image/image-enhancer
Allow: /ai-tools/video/image-to-video

# Disallow API routes
Disallow: /api/

# Disallow admin routes
Disallow: /admin/

# Sitemap
Sitemap: ${process.env.NEXT_PUBLIC_WEB_URL || 'https://your-domain.com'}/sitemap.xml`;

  fs.writeFileSync(path.join(process.cwd(), 'public', 'robots.txt'), robotsContent);
  log('✅ robots.txt generated', 'green');
}

function optimizeAssets() {
  log('\n⚡ Optimizing assets...', 'cyan');
  
  // Compress images if imagemin is available
  try {
    execSync('which imagemin', { stdio: 'ignore' });
    execCommand('imagemin public/images/* --out-dir=public/images/', 'Compressing images');
  } catch (error) {
    log('⚠️ imagemin not found, skipping image compression', 'yellow');
  }
  
  log('✅ Asset optimization completed', 'green');
}

function performSecurityCheck() {
  log('\n🔒 Performing security check...', 'cyan');
  
  // Check for sensitive data in environment files
  const envFiles = ['.env.production', '.env.local'];
  envFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for placeholder values
      const placeholders = ['your_', 'example', 'changeme', 'placeholder'];
      const hasPlaceholders = placeholders.some(placeholder => 
        content.toLowerCase().includes(placeholder)
      );
      
      if (hasPlaceholders) {
        log(`⚠️ ${file} contains placeholder values`, 'yellow');
      }
    }
  });
  
  // Check for exposed secrets in build
  const buildDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(buildDir)) {
    // This is a simplified check - in production, use proper secret scanning tools
    log('✅ Basic security check completed', 'green');
  }
}

function deployToVercel() {
  log('\n🚀 Deploying to Vercel...', 'cyan');
  
  try {
    // Check if Vercel CLI is installed
    execSync('which vercel', { stdio: 'ignore' });
    
    // Deploy to production
    execCommand('vercel --prod --yes', 'Deploying to Vercel');
    
    log('✅ Deployment to Vercel completed', 'green');
  } catch (error) {
    log('⚠️ Vercel CLI not found, skipping automatic deployment', 'yellow');
    log('Please deploy manually using Vercel dashboard or install Vercel CLI', 'yellow');
  }
}

function deployToNetlify() {
  log('\n🚀 Deploying to Netlify...', 'cyan');
  
  try {
    // Check if Netlify CLI is installed
    execSync('which netlify', { stdio: 'ignore' });
    
    // Build for static export if needed
    execCommand('pnpm export', 'Exporting static files');
    
    // Deploy to production
    execCommand('netlify deploy --prod --dir=out', 'Deploying to Netlify');
    
    log('✅ Deployment to Netlify completed', 'green');
  } catch (error) {
    log('⚠️ Netlify CLI not found, skipping automatic deployment', 'yellow');
    log('Please deploy manually using Netlify dashboard or install Netlify CLI', 'yellow');
  }
}

function main() {
  log('🚀 Starting production deployment for FreeQwenImage AI Tools Platform', 'bright');
  
  const args = process.argv.slice(2);
  const skipTests = args.includes('--skip-tests');
  const skipDeploy = args.includes('--skip-deploy');
  const deployTarget = args.find(arg => arg.startsWith('--deploy='))?.split('=')[1];
  
  try {
    // Pre-deployment checks
    checkEnvironment();
    
    if (!skipTests) {
      runTests();
    } else {
      log('⚠️ Skipping tests (--skip-tests flag)', 'yellow');
    }
    
    // Build process
    buildApplication();
    generateSitemap();
    generateRobotsTxt();
    optimizeAssets();
    performSecurityCheck();
    
    // Deployment
    if (!skipDeploy) {
      if (deployTarget === 'vercel') {
        deployToVercel();
      } else if (deployTarget === 'netlify') {
        deployToNetlify();
      } else {
        log('🎯 Build completed successfully!', 'green');
        log('To deploy, run:', 'cyan');
        log('  - For Vercel: pnpm deploy:vercel', 'cyan');
        log('  - For Netlify: pnpm deploy:netlify', 'cyan');
        log('  - Or use your preferred deployment method', 'cyan');
      }
    } else {
      log('⚠️ Skipping deployment (--skip-deploy flag)', 'yellow');
    }
    
    log('\n🎉 Production deployment process completed!', 'bright');
    log('🔗 Your AI Tools Platform is ready for production use', 'green');
    
  } catch (error) {
    log('\n❌ Deployment failed', 'red');
    console.error(error);
    process.exit(1);
  }
}

// Run the deployment script
if (require.main === module) {
  main();
}

module.exports = {
  checkEnvironment,
  runTests,
  buildApplication,
  generateSitemap,
  generateRobotsTxt,
  optimizeAssets,
  performSecurityCheck,
};