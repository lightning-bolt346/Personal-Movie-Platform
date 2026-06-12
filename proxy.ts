import { NextRequest, NextResponse } from 'next/server';

// ─── Bot Firewall ─────────────────────────────────────────────────────────────
//
// Blocks known aggressive crawlers at the Vercel Edge before they can
// burn compute or function invocations. Returns a minimal 200 so they
// don't retry — a 403 triggers aggressive re-crawls.
//
// NOTE: For complete protection, pair with Cloudflare Bot Fight Mode
// so bots are blocked at the DNS level before reaching Vercel at all.

const BOT_BLOCKLIST = [
  'meta-externalagent',     // #1 killer — 5.8K+ req/hr at 0% cache rate
  'facebookexternalhit',
  'Bytespider',             // TikTok scraper
  'AhrefsBot',
  'SemrushBot',
  'MJ12bot',
  'DotBot',
  'PetalBot',
  'SeznamBot',
  'BingPreview',
  'GPTBot',                 // OpenAI scraper
  'ClaudeBot',              // Anthropic scraper
  'Applebot',               // Apple scraper (high volume)
  'YandexBot',
  'baiduspider',
  'DataForSeoBot',
  'serpstatbot',
];

// Only fire the firewall on expensive server-rendered routes.
// Static assets, API endpoints, and the homepage are excluded.
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
  '/search',
  '/recommended/',
  '/providers',
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

  // 308 Permanent Redirect: old Vercel subdomains → real custom domain
  // This trains bots and browsers to never use the old URLs again.
  const hostname = request.headers.get('host') || '';
  if (
    hostname.includes('zivox-tv.vercel.app') ||
    hostname.includes('zivox-streaming.vercel.app')
  ) {
    return NextResponse.redirect(
      `https://www.zivoxtv.live${pathname}${request.nextUrl.search}`,
      { status: 308 }
    );
  }

  // Only apply bot firewall to routes that cost real compute
  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const ua = request.headers.get('user-agent') || '';

  if (isBlockedBot(ua)) {
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
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.png|manifest.json|sw.js|robots.txt|sitemap.xml).*)',
  ],
};
