import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/utils';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: [
      // ── Googlebot: limited crawl — only browse pages, not compute-heavy renders
      {
        userAgent: 'Googlebot',
        allow: ['/$', '/movies', '/tv', '/anime', '/search', '/about'],
        disallow: [
          '/api/',
          '/watch/',     // 80K requests, heavy SSR — don't let google crawl these
          '/person/',    // 25K requests, 0% cached — too expensive to crawl
          '/collection/',
          '/discover',
          '/schedule',
          '/profile',
        ],
      },
      // ── Known abusive crawlers — block entirely
      {
        userAgent: [
          'meta-externalagent',
          'facebookexternalhit',
          'Bytespider',
          'AhrefsBot',
          'SemrushBot',
          'MJ12bot',
          'DotBot',
          'PetalBot',
        ],
        disallow: ['/'],
      },
      // ── All other bots — full block
      {
        userAgent: '*',
        disallow: ['/', '/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
