import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/auth/', '/admin/', '/chat/', '/settings/', '/profile/', '/api/', '/accept-terms/'],
      },
    ],
    sitemap: 'https://tokenanalytix.com/sitemap.xml',
  }
}
