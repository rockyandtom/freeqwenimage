import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || 'https://freeqwenimage.com'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          'en': `${baseUrl}/`,
          'zh': `${baseUrl}/zh/`,
        },
      },
    },
    {
      url: `${baseUrl}/zh/`,
      lastModified: new Date(),
      changeFrequency: 'daily', 
      priority: 1.0,
      alternates: {
        languages: {
          'en': `${baseUrl}/`,
          'zh': `${baseUrl}/zh/`,
        },
      },
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          'en': `${baseUrl}/pricing`,
          'zh': `${baseUrl}/zh/pricing`,
        },
      },
    },
    {
      url: `${baseUrl}/zh/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          'en': `${baseUrl}/pricing`,
          'zh': `${baseUrl}/zh/pricing`,
        },
      },
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
      alternates: {
        languages: {
          'en': `${baseUrl}/posts`,
          'zh': `${baseUrl}/zh/posts`,
        },
      },
    },
    {
      url: `${baseUrl}/zh/posts`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
      alternates: {
        languages: {
          'en': `${baseUrl}/posts`,
          'zh': `${baseUrl}/zh/posts`,
        },
      },
    },
  ]
}