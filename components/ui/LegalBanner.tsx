import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export function LegalBanner() {
  return (
    <div className="mt-20 mb-12 w-full px-4 md:px-14 max-w-[1800px] mx-auto">
      <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900/60 to-black border border-zinc-800/60 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 group">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-crimson-500 to-crimson-700"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-crimson-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-crimson-500/10 transition-colors duration-700"></div>
        
        <div className="p-4 bg-zinc-900/80 rounded-2xl text-zinc-400 shrink-0 border border-zinc-800 shadow-inner">
          <ShieldAlert size={28} className="text-crimson-500/80" />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-white font-bold text-lg font-display tracking-wide mb-2">Legal Disclaimer</h3>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            ZIVOX is a search engine that indexes publicly available streaming links. We do not host, store, or distribute any video content. All media is hosted by non-affiliated third parties.
          </p>
        </div>
        
        <div className="shrink-0 w-full md:w-auto">
          <Link href="/dmca" className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-sm transition-colors border border-zinc-700 hover:border-zinc-600 shadow-sm">
            Read DMCA Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
