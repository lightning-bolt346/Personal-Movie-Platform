'use client';
import { PROVIDERS } from '@/lib/providers';
import { ProviderCard } from './ProviderCard';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function ProvidersGrid() {
  // Show top 12 providers for a clean 2x6 or 3x4 grid
  const topProviders = PROVIDERS.slice(0, 12);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex flex-col gap-5 relative z-20">
      <div className="flex items-center justify-between group cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 rounded-full bg-crimson-500 shadow-[0_0_12px_rgba(229,9,20,0.6)]" />
          <h2 className="text-xl md:text-2xl font-bold font-display text-white tracking-wide">
            Stream by Platform
          </h2>
        </div>
        <Link 
          href="/providers"
          className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-200"
        >
          <span>Explore All</span>
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Mobile view: horizontal scroll */}
      <div className="md:hidden flex overflow-x-auto gap-3 pb-4 px-1 -mx-1 hide-scrollbar" style={{ overscrollBehaviorX: 'contain', touchAction: 'pan-x' }}>
        {topProviders.map((p) => (
          <div key={p.id} className="flex-shrink-0 snap-center">
            <ProviderCard provider={p} size="sm" showName />
          </div>
        ))}
      </div>

      {/* Desktop view: Uniform Grid */}
      <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {topProviders.map((p) => (
          <ProviderCard key={p.id} provider={p} size="md" showName />
        ))}
      </div>
    </section>
  );
}
