// 🌐 站点配置文件

export const SITE_CONFIG = {
  name: 'FreeQwenImage',
  description: 'AI-powered image and video generation platform - Free, Fast, and Professional',
  url: 'https://freeqwenimage.com',
  
  // 主导航配置
  navigation: [
    { name: 'Home', href: '/' },
    { name: 'AI Tools', href: '/ai-tools' },
    { name: 'Photo Effects', href: '/ai-tools/image/image-to-image/Photo-Effects' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/posts' }
  ],
  
  // 主题配置
  theme: {
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6'
  },
  
  // 功能开关
  features: {
    userAuth: true,
    analytics: true,
    i18n: true,
    darkMode: true
  },
  
  // SEO配置
  seo: {
    keywords: ['AI image generator', 'text to image', 'image enhancer', 'AI tools', 'free AI', 'Nano Banana anime figure generator'],
    author: 'FreeQwenImage Team',
    twitterHandle: '@freeqwenimage'
  }
};

export const AI_TOOLS_CONFIG = {
  title: 'AI Tools Collection',
  description: 'Discover our comprehensive collection of AI-powered tools for image and video generation',
  categories: {
    image: {
      name: 'Image Tools',
      description: 'AI-powered image generation and enhancement tools',
      icon: '🖼️'
    },
    video: {
      name: 'Video Tools', 
      description: 'Create and edit videos with AI technology',
      icon: '🎬'
    },
    audio: {
      name: 'Audio Tools',
      description: 'AI audio processing and generation tools',
      icon: '🎵'
    },
    text: {
      name: 'Text Tools',
      description: 'AI-powered text processing and generation',
      icon: '📝'
    }
  }
};