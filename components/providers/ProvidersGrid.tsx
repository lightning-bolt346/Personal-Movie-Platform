import { PROVIDERS } from '@/lib/providers';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight } from 'lucide-react';

const TOP_PROVIDERS = [
  'netflix', 'prime-video', 'disney-plus', 'max', 'jiohotstar', 
  'apple-tv-plus', 'hulu', 'sonyliv', 'crunchyroll', 'zee5',
  'paramount-plus', 'peacock',
];

export function ProvidersGrid() {
  const providers = TOP_PROVIDERS
    .map(slug => PROVIDERS.find(p => p.slug === slug))
    .filter(Boolean) as typeof PROVIDERS;

  return (
    <section className="w-full flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-14">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 md:w-1.5 md:h-6 rounded-full bg-brand-500" />
          <h2 className="text-lg md:text-2xl font-display font-bold text-white tracking-tight">
            Stream by Platform
          </h2>
        </div>
        <Link
          href="/providers"
          className="flex items-center gap-1 text-xs font-semibold text-white/40 hover:text-white transition-colors duration-200 group"
        >
          Explore All
          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-200" />
        </Link>
      </div>

      {/* Scrolling Row */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 md:px-14 pb-6 pt-2">
        {providers.map((p) => (
          <Link
            key={p.id}
            href={`/providers/${p.slug}`}
            className="group relative flex-shrink-0 flex flex-col items-center justify-center rounded-2xl overflow-hidden border border-white/[0.07] hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl snap-start"
            style={{
              width: 'clamp(140px, 16vw, 180px)',
              height: 'clamp(90px, 10vw, 110px)',
              background: `linear-gradient(135deg, ${p.color}22 0%, #0a0a0a 100%)`,
            }}
          >
            {/* Ambient glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at center, ${p.color}30 0%, transparent 70%)`,
              }}
            />

            {/* Logo */}
            <div className="relative w-[75%] h-[44px] md:h-[52px] flex items-center justify-center">
              <Image
                src={p.logo}
                alt={p.name}
                fill
                className="object-contain opacity-85 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"
                sizes="130px"
              />
            </div>

            {/* Name on hover */}
            <div className="absolute bottom-0 left-0 right-0 h-[28px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
              style={{ background: `${p.color}30` }}
            >
              <span className="text-[10px] font-bold text-white/80 tracking-wider uppercase truncate px-2">
                {p.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
