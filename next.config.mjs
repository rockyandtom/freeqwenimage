import bundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: process.env.NODE_ENV === "production",
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  
  // 生产环境优化 - 简化配置避免兼容性问题
  experimental: {
    optimizePackageImports: [
      "@radix-ui/react-icons",
      "lucide-react",
    ],
  },
  
  // 图片优化配置
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rh-images.xiaoyaoyou.com",
      },
      {
        protocol: "https",
        hostname: "storage.runninghub.ai",
      },
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_CDN_DOMAIN?.replace("https://", "") || "cdn.your-domain.com",
      },
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: process.env.NODE_ENV === "production" ? 60 * 60 * 24 * 30 : 60, // 30 days in production
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // 性能优化
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // 编译优化
  modularizeImports: {
    "@radix-ui/react-icons": {
      transform: "@radix-ui/react-icons/dist/{{member}}",
    },
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{kebabCase member}}",
    },
  },
  
  // SEO优化重定向和路径重构
  async redirects() {
    return [
      // 旧路径重定向到新的AI工具路径结构
      {
        source: '/new-page/image-editor/qwen-image-edit',
        destination: '/ai-tools/image/image-to-image',
        permanent: true,
      },
      {
        source: '/new-page/image-editor/AI-Image-Enhancer',
        destination: '/ai-tools/image/image-enhancer',
        permanent: true,
      },
      {
        source: '/new-page/AI-EFFECTS',
        destination: '/ai-tools/video/image-to-video',
        permanent: true,
      },
      {
        source: '/new-page/image-editor',
        destination: '/ai-tools',
        permanent: true,
      },
      // 应用重定向到工具区 (新增)
      {
        source: '/new-page/AI-EFFECTS',
        destination: '/ai-tools?tool=image-to-video&app=ai-effects',
        permanent: false,
      },
      {
        source: '/new-page/image-editor/AI-Image-Enhancer',
        destination: '/ai-tools?tool=image-enhancer&app=image-enhancer-app',
        permanent: false,
      },
      {
        source: '/new-page/image-editor/qwen-image-edit',
        destination: '/ai-tools?tool=image-to-image&app=qwen-edit',
        permanent: false,
      },
      {
        source: '/new-page/image-editor',
        destination: '/ai-tools?tool=image-enhancer&app=image-editor',
        permanent: false,
      },
      // 首页AI生成器重定向到专门的文生图页面
      {
        source: '/generator',
        destination: '/ai-tools/image/text-to-image',
        permanent: false,
      },
    ];
  },
  
  // Headers for SEO, security, and performance
  async headers() {
    const isProduction = process.env.NODE_ENV === "production";
    
    return [
      {
        source: "/(.*)",
        headers: [
          // Security headers
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options", 
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Performance headers
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          // CSP header for production
          ...(isProduction ? [{
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://api.runninghub.ai https://www.google-analytics.com",
              "media-src 'self' https: blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join("; ")
          }] : []),
        ],
      },
      // Static assets caching
      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Content-Type",
            value: "application/xml",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Content-Type", 
            value: "text/plain",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
      // API routes headers
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },
  
  // Webpack optimization for production
  webpack: (config, { isServer, dev }) => {
    if (!dev && !isServer) {
      // Production client-side optimizations
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    
    // Resolve fallbacks for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
};

export default withBundleAnalyzer(withNextIntl(withMDX(nextConfig)));