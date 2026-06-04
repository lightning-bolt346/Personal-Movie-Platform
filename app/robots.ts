import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zivox-streaming.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',      // internal API routes — no crawl value
          '/profile/',  // personal data pages
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
