import './globals.css';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { WelcomeModal } from '@/components/ui/WelcomeModal';
import { NotificationToaster } from '@/components/ui/NotificationToaster';
import { GlobalLoader } from '@/components/ui/GlobalLoader';
import { Analytics } from '@vercel/analytics/react';
import { JsonLd } from '@/components/seo/JsonLd';
import { SecurityGuard } from '@/components/ui/SecurityGuard';
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zivox-streaming.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ZIVOX — Watch Movies, TV Shows & Anime Free in HD',
    template: '%s | ZIVOX',
  },
  description: 'ZIVOX is the ultimate free streaming platform. Watch the latest movies, TV shows, and anime in stunning HD quality online.',
  keywords: ['Zivox', 'Zivox tv', 'zivox anime', 'zivox shows', 'zivox vercel', 'zivox online movie', 'Zivox official', 'zivox app', 'watch free movies online', 'free HD movies', 'watch shows online free', 'watch anime free', 'free streaming sites', 'movies to watch free', 'online tv shows free', 'watch movies free 2026', 'no ads streaming', 'watch latest movies', 'free cinema online'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ZIVOX — Watch Movies, TV Shows & Anime Free in HD',
    description: 'ZIVOX is the ultimate free streaming platform. Watch the latest movies, TV shows, and anime in stunning HD quality online.',
    type: 'website',
    siteName: 'ZIVOX',
    url: siteUrl,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ZIVOX — Premium Streaming',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZIVOX — Watch Movies, TV Shows & Anime Free in HD',
    description: 'Premium free streaming. Watch the latest movies, TV shows, and anime in stunning HD quality.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'vrbomKYzEEs6XZErAY-s0kDR1hYHzBbmS0iHK3WVxTg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const globalSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "ZIVOX",
      "url": siteUrl,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${siteUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "ZIVOX Streaming",
      "url": siteUrl,
      "logo": `${siteUrl}/icon.png`,
      "sameAs": [
        "https://twitter.com/zivox"
      ]
    }
  ];

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${space.variable} ${mono.variable}`}>
      <head>
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                const originalReleasePointerCapture = Element.prototype.releasePointerCapture;
                Element.prototype.releasePointerCapture = function(pointerId) {
                  try {
                    originalReleasePointerCapture.call(this, pointerId);
                  } catch (e) {
                    if (e.name !== 'NotFoundError') {
                      throw e;
                    }
                  }
                };
              }
            `
          }}
        />
        <JsonLd data={globalSchema} />
      </head>
      <body className="bg-black text-zinc-100 min-h-screen flex flex-col font-body" suppressHydrationWarning>
        {/* Ambient Background — Zivox Dark Violet */}
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-black" style={{ contain: 'strict' }}>
          {/* Primary top-center deep violet core */}
          <div
            style={{
              position: 'absolute',
              top: '-30%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80%',
              height: '70%',
              background: 'radial-gradient(ellipse at center, rgba(76,20,200,0.18) 0%, rgba(50,10,130,0.08) 35%, rgba(50,10,130,0.02) 60%, transparent 80%)',
              animation: 'purple-beam 16s ease-in-out infinite',
              willChange: 'transform, opacity',
            }}
          />
          {/* Top-left cool blue accent */}
          <div
            style={{
              position: 'absolute',
              top: '-10%',
              left: '-5%',
              width: '40%',
              height: '45%',
              background: 'radial-gradient(ellipse at center, rgba(30,60,180,0.08) 0%, rgba(30,60,180,0.02) 40%, transparent 70%)',
              animation: 'purple-beam 22s ease-in-out infinite reverse',
              willChange: 'transform, opacity',
            }}
          />
          {/* Top-right warm violet accent */}
          <div
            style={{
              position: 'absolute',
              top: '-5%',
              right: '-5%',
              width: '35%',
              height: '40%',
              background: 'radial-gradient(ellipse at center, rgba(100,30,200,0.08) 0%, rgba(100,30,200,0.02) 40%, transparent 70%)',
              animation: 'purple-beam 19s ease-in-out infinite',
              willChange: 'transform, opacity',
            }}
          />
          {/* Very subtle warm bottom accent — prevents cold feel */}
          <div
            style={{
              position: 'absolute',
              bottom: '-10%',
              left: '30%',
              width: '40%',
              height: '30%',
              background: 'radial-gradient(ellipse at center, rgba(80,20,160,0.06) 0%, rgba(80,20,160,0.01) 45%, transparent 70%)',
            }}
          />
        </div>
        <GlobalLoader />
        <Navbar />
        <main className="flex-1 flex flex-col pb-20 md:pb-0 relative z-10 w-full min-h-screen">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <Footer />
        <ScrollToTop />
        <WelcomeModal />
        <NotificationToaster />
        <SecurityGuard />
        <Analytics />
        <GoogleAnalytics gaId="G-6RD41T4D6D" />
      </body>
    </html>
  );
}
