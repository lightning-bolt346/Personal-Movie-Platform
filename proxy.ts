import { NextRequest, NextResponse } from 'next/server';

// ─── Bot Firewall ─────────────────────────────────────────────────────────────
//
// These bots consumed 128K of 154K total edge requests (83%) with near-zero
// cache hit rates, burning 18h+ of Active CPU time and 1.5M+ function invocations.
// Blocking them at the edge costs ZERO compute — they never touch Next.js functions.
//
// Strategy: return an immediate 200 with no content rather than a 403/robots
// directive, so crawlers don't retry aggressively.

const BOT_BLOCKLIST = [
  'meta-externalagent',       // 128K requests, 0.2% cached — the #1 killer
  'facebookexternalhit',      // 22 requests
  'Bytespider',               // TikTok crawler
  'AhrefsBot',
  'SemrushBot',
  'MJ12bot',
  'DotBot',
  'PetalBot',
  'SeznamBot',
  'BingPreview',
];

// Only apply the bot firewall to expensive dynamic routes.
// Static assets, manifest, and API health endpoints are excluded.
const PROTECTED_PATHS = [
  '/watch/',
  '/person/',
  '/collection/',
  '/collections',
  '/schedule',
  '/discover',
  '/genre/',
  '/year/',
  '/mood/',
  '/movies',
  '/tv',
  '/anime',
];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some((prefix) => pathname.startsWith(prefix));
}

function isBlockedBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_BLOCKLIST.some((bot) => ua.includes(bot.toLowerCase()));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // ─── Domain Migration Catch ─────────────────────────────────────────────────
  // If user or bot lands on the old domain, intercept ALL routes and show the
  // migration landing page. This instantly stops bots from spidering 5000+ links
  // on the old domain, slashing edge requests.
  if (hostname.includes('zivox-tv') && pathname !== '/moved') {
    return NextResponse.rewrite(new URL('/moved', request.url));
  }

  // Only apply to routes that cost real compute
  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const ua = request.headers.get('user-agent') || '';

  if (isBlockedBot(ua)) {
    // Return minimal 200 — bots interpret this as "seen, nothing to index"
    // and back off. A 403 causes aggressive retries.
    return new NextResponse(
      '<!DOCTYPE html><html><body></body></html>',
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-store, no-cache',
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
        },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  // Run on all paths except Next.js internals and static files
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.png|manifest.json|sw.js|robots.txt|sitemap.xml).*)',
  ],
};
