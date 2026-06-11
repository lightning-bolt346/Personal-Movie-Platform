import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },
  compress: true,
  images: {
    // ✅ CRITICAL FIX: To prevent hitting Vercel Hobby's strict "1,000 Source Images/month" limit,
    // we bypass Vercel's Image Optimization entirely. Instead, we fetch pre-compressed w500/w1280 
    // images directly from TMDB's CDN, resulting in 0 Vercel compute and 0 Vercel bandwidth used for images.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 604800, // 7 days
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [48, 96, 192, 256, 384],
  },
  turbopack: {},
  async headers() {
    return [
      // Security headers for all routes
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // Static assets — immutable, 1 year TTL
      {
        source: '/(.*)\\.(ico|png|jpg|jpeg|svg|webp|avif|woff|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Manifest — cache for 24 hours (already 100% cached, keep it that way)
      {
        source: '/manifest.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400' },
        ],
      },
      // Home data API — CDN cached for 1h, stale-while-revalidate for 24h
      {
        source: '/api/home-data',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
        ],
      },
      // Block bots from all API routes
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
      // Watch pages — CDN cache for 24h (ISR revalidation handles freshness)
      {
        source: '/watch/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=86400, stale-while-revalidate=604800' },
        ],
      },
      // Person pages — CDN cache for 24h
      {
        source: '/person/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=86400, stale-while-revalidate=604800' },
        ],
      },
      // Collection pages — CDN cache for 24h
      {
        source: '/collection/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=86400, stale-while-revalidate=604800' },
        ],
      },
    ];
  },
  webpack: (config, { dev }) => {
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = { ignored: /.*/ };
    }
    return config;
  },
};

export default nextConfig;
