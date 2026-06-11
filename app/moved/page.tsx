import { Metadata } from 'next';
import Link from 'next/link';
import { Copy, ExternalLink, ArrowRight, Home } from 'lucide-react';
import { CopyButton } from './CopyButton';

export const metadata: Metadata = {
  title: 'ZIVOX has moved to a new home',
  description: 'We have migrated to a new domain. Please update your bookmarks.',
  robots: {
    index: false,
    follow: false,
  }
};

export default function MovedPage() {
  const newUrl = "https://zivox-streaming.vercel.app";

  return (
    <div className="min-h-[100dvh] bg-void-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center text-center">
        {/* Animated Icon */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-[2px] mb-8 shadow-2xl shadow-brand-500/20 animate-pulse">
          <div className="w-full h-full bg-void-950 rounded-[14px] flex items-center justify-center">
            <Home className="text-brand-400" size={32} />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md">
          We've moved to a new home.
        </h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-md mx-auto mb-10 leading-relaxed">
          Sorry for the inconvenience, but ZIVOX is no longer available at this address. We've migrated to a faster, fully optimized platform. 
          Please update your bookmarks to our new permanent home.
        </p>

        {/* URL Card */}
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md mb-8">
          <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-3">Our New Address</p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 flex items-center overflow-hidden">
              <span className="text-brand-400 font-mono text-sm truncate mr-4">
                {newUrl}
              </span>
            </div>
            <CopyButton text={newUrl} />
          </div>
        </div>

        {/* Call to Action */}
        <a 
          href={newUrl}
          className="group relative flex items-center justify-center gap-3 w-full sm:w-auto bg-white text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all hover:bg-zinc-200 active:scale-95 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            Continue to ZIVOX <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </a>
      </div>
    </div>
  );
}
