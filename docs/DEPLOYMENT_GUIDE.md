# Deployment Guide

This guide covers deployment options and configurations for the FreeQwenImage AI Tools Platform.

## 🚀 Deployment Options

### 1. Vercel (Recommended)

Vercel provides the best experience for Next.js applications with automatic deployments and optimizations.

#### Prerequisites
- GitHub/GitLab/Bitbucket account
- Vercel account
- Environment variables configured

#### Steps

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository

2. **Configure Build Settings**
   ```
   Framework Preset: Next.js
   Build Command: pnpm build
   Output Directory: .next
   Install Command: pnpm install
   ```

3. **Environment Variables**
   Add the following environment variables in Vercel dashboard:
   ```env
   RUNNINGHUB_API_URL=https://api.runninghub.ai
   RUNNINGHUB_API_KEY=your_production_api_key
   NEXTAUTH_SECRET=your_production_secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

#### Custom Domain Setup

1. Go to your project settings in Vercel
2. Navigate to "Domains" tab
3. Add your custom domain
4. Configure DNS records as instructed

### 2. Netlify

Alternative deployment option with similar features to Vercel.

#### Steps

1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "New site from Git"
   - Connect your repository

2. **Build Settings**
   ```
   Build command: pnpm build && pnpm export
   Publish directory: out
   ```

3. **Environment Variables**
   Add environment variables in Netlify dashboard under "Site settings" > "Environment variables"

### 3. Docker Deployment

For containerized deployments on any platform.

#### Dockerfile

Create `Dockerfile` in project root:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1

RUN corepack enable pnpm && pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - RUNNINGHUB_API_URL=${RUNNINGHUB_API_URL}
      - RUNNINGHUB_API_KEY=${RUNNINGHUB_API_KEY}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    env_file:
      - .env.production
    restart: unless-stopped
```

#### Build and Run

```bash
# Build the image
docker build -t freeqwenimage .

# Run with docker-compose
docker-compose up -d
```

### 4. AWS Deployment

Deploy to AWS using various services.

#### AWS Amplify

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Connect your Git repository

2. **Build Settings**
   Create `amplify.yml`:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - corepack enable pnpm
           - pnpm install
       build:
         commands:
           - pnpm build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

#### AWS ECS with Fargate

1. **Create ECR Repository**
   ```bash
   aws ecr create-repository --repository-name freeqwenimage
   ```

2. **Build and Push Image**
   ```bash
   # Get login token
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

   # Build and tag image
   docker build -t freeqwenimage .
   docker tag freeqwenimage:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/freeqwenimage:latest

   # Push image
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/freeqwenimage:latest
   ```

3. **Create ECS Task Definition**
   ```json
   {
     "family": "freeqwenimage",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "256",
     "memory": "512",
     "executionRoleArn": "arn:aws:iam::<account-id>:role/ecsTaskExecutionRole",
     "containerDefinitions": [
       {
         "name": "freeqwenimage",
         "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/freeqwenimage:latest",
         "portMappings": [
           {
             "containerPort": 3000,
             "protocol": "tcp"
           }
         ],
         "environment": [
           {
             "name": "NODE_ENV",
             "value": "production"
           }
         ],
         "secrets": [
           {
             "name": "RUNNINGHUB_API_KEY",
             "valueFrom": "arn:aws:secretsmanager:us-east-1:<account-id>:secret:runninghub-api-key"
           }
         ]
       }
     ]
   }
   ```

## 🔧 Environment Configuration

### Required Environment Variables

```env
# API Configuration
RUNNINGHUB_API_URL=https://api.runninghub.ai
RUNNINGHUB_API_KEY=your_api_key

# Authentication
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=https://your-domain.com

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
NEXT_PUBLIC_HOTJAR_ID=your_hotjar_id

# Optional: Error Tracking
SENTRY_DSN=your_sentry_dsn
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project
```

### Development vs Production

#### Development (.env.development)
```env
RUNNINGHUB_API_URL=https://api-dev.runninghub.ai
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

#### Production (.env.production)
```env
RUNNINGHUB_API_URL=https://api.runninghub.ai
NEXTAUTH_URL=https://your-production-domain.com
NODE_ENV=production
```

## 🏗 Build Configuration

### Next.js Configuration

Update `next.config.mjs` for production:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react']
  },
  
  // Image optimization
  images: {
    domains: ['storage.runninghub.ai', 'your-cdn-domain.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30 // 30 days
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },
  
  // Redirects for old URLs
  async redirects() {
    return [
      {
        source: '/image-enhancer',
        destination: '/ai-tools/image/image-enhancer',
        permanent: true
      }
    ];
  },
  
  // Output configuration for static export
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  }
};

export default nextConfig;
```

### Package.json Scripts

Add deployment scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "build:analyze": "ANALYZE=true next build",
    "build:standalone": "BUILD_STANDALONE=true next build",
    "export": "next export",
    "deploy:vercel": "vercel --prod",
    "deploy:netlify": "netlify deploy --prod",
    "docker:build": "docker build -t freeqwenimage .",
    "docker:run": "docker run -p 3000:3000 freeqwenimage"
  }
}
```

## 🔍 Pre-deployment Checklist

### Code Quality
- [ ] All tests passing (`pnpm test`)
- [ ] TypeScript compilation successful (`pnpm type-check`)
- [ ] ESLint checks passing (`pnpm lint`)
- [ ] No console errors in browser

### Performance
- [ ] Lighthouse score > 90
- [ ] Bundle size optimized
- [ ] Images optimized
- [ ] API response times < 500ms

### Security
- [ ] Environment variables secured
- [ ] API keys not exposed in client code
- [ ] Security headers configured
- [ ] HTTPS enabled

### Functionality
- [ ] All AI tools working
- [ ] File uploads functioning
- [ ] Mobile responsiveness verified
- [ ] Cross-browser compatibility tested

## 📊 Monitoring and Analytics

### Performance Monitoring

Add performance monitoring to your deployment:

```typescript
// src/lib/monitoring.ts
export function initMonitoring() {
  // Web Vitals
  if (typeof window !== 'undefined') {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }
}
```

### Error Tracking

Configure Sentry for error tracking:

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

### Analytics

Add Google Analytics:

```typescript
// src/lib/gtag.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};
```

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Run tests
        run: pnpm test
      
      - name: Type check
        run: pnpm type-check
      
      - name: Lint
        run: pnpm lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🚨 Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   rm -rf .next node_modules
   pnpm install
   pnpm build
   ```

2. **Environment Variable Issues**
   - Verify all required variables are set
   - Check variable names match exactly
   - Ensure no trailing spaces in values

3. **API Connection Issues**
   - Verify API endpoints are accessible
   - Check API key permissions
   - Test API calls manually

4. **Memory Issues**
   - Increase memory allocation for build
   - Optimize bundle size
   - Use dynamic imports for large components

### Performance Issues

1. **Slow Page Loads**
   - Enable compression
   - Optimize images
   - Use CDN for static assets

2. **High Memory Usage**
   - Implement proper cleanup in useEffect
   - Avoid memory leaks in event listeners
   - Use React.memo for expensive components

## 📞 Support

For deployment support:
- 📖 [Documentation](docs/)
- 🐛 [Issue Tracker](https://github.com/your-repo/issues)
- 💬 [Discussions](https://github.com/your-repo/discussions)

## 📄 License

This deployment guide is part of the FreeQwenImage AI Tools Platform project.