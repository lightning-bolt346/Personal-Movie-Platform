'use client';

import { Heart } from 'lucide-react';
import Link from 'next/link';

export function DonationButton() {
  return (
    <div className="relative group flex items-center justify-center">
      <Link
        href="/support"
        className="text-white/60 hover:text-brand-400 transition-all duration-300 hover:scale-110 active:scale-95 p-1"
        aria-label="Support Zivox TV"
      >
        <Heart size={17} strokeWidth={2} />
      </Link>
      
      {/* Tooltip */}
      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 backdrop-blur-md border border-white/10 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        Support
      </div>
    </div>
  );
}
