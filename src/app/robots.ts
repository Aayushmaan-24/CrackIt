import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'CCBot'],
        disallow: '/',
      },
    ],
    sitemap: 'https://crack-it-zeta.vercel.app/sitemap.xml',
  }
}