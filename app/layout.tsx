import './globals.css';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SmoothScroll } from '@/components/layout/SmoothScroll';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
  title: 'ZIVOX — Premium Streaming',
  description: 'Cinematic streaming experience. Watch movies, TV shows, and anime in stunning quality on ZIVOX.',
  keywords: 'stream movies, watch tv shows, anime, free streaming, zivox',
  openGraph: {
    title: 'ZIVOX — Premium Streaming',
    description: 'Cinematic streaming experience. Watch movies, TV shows, and anime in stunning quality on ZIVOX.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${space.variable} ${mono.variable}`}>
      <body className="bg-black text-zinc-100 min-h-screen flex flex-col font-body" suppressHydrationWarning>
        <SmoothScroll>
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
                background: 'radial-gradient(ellipse at center, rgba(76,20,200,0.22) 0%, rgba(50,10,130,0.12) 45%, transparent 80%)',
                filter: 'blur(80px)',
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
                background: 'radial-gradient(ellipse at center, rgba(30,60,180,0.1) 0%, transparent 70%)',
                filter: 'blur(60px)',
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
                background: 'radial-gradient(ellipse at center, rgba(100,30,200,0.1) 0%, transparent 70%)',
                filter: 'blur(50px)',
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
                background: 'radial-gradient(ellipse at center, rgba(80,20,160,0.08) 0%, transparent 70%)',
                filter: 'blur(60px)',
              }}
            />
          </div>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}

