import Link from 'next/link';
import Image from 'next/image';
import { Provider } from '@/lib/providers';

interface ProviderCardProps {
  provider: Provider;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

export function ProviderCard({ provider, size = 'md', showName = false }: ProviderCardProps) {
  // Dimensions mapping - much larger for borderless look
  const dims = {
    sm: { w: 100, h: 50, logoH: 36 },
    md: { w: 130, h: 70, logoH: 48 },
    lg: { w: 160, h: 80, logoH: 56 },
  }[size];

  return (
    <Link 
      href={`/providers/${provider.slug}`}
      className="group relative flex flex-col items-center justify-center transition-all duration-300 select-none hover:-translate-y-1.5"
      style={{
        width: dims.w,
        height: dims.h,
        '--brand': provider.color,
      } as React.CSSProperties}
    >
      <div className="flex items-center justify-center w-full h-full relative z-10">
        <div className="relative w-full flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ height: dims.logoH }}>
          <Image
            src={provider.logo}
            alt={`${provider.name} logo`}
            fill
            className="object-contain filter drop-shadow-sm opacity-90 group-hover:opacity-100 transition-all duration-300"
            sizes={`${dims.w}px`}
            priority={size === 'lg'}
          />
        </div>
      </div>
      
      {showName && (
        <div className="absolute -bottom-6 opacity-0 group-hover:opacity-100 group-hover:-bottom-1 transition-all duration-300 w-full text-center pb-1 z-20 pointer-events-none">
          <span className="text-[10px] font-bold tracking-widest uppercase text-white bg-black/90 px-3 py-1 rounded-full backdrop-blur-xl shadow-2xl border border-zinc-800">
            {provider.name}
          </span>
        </div>
      )}

      {/* Intense glow just behind the logo on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none"
        style={{ background: `radial-gradient(circle at center, ${provider.color}, transparent 60%)`, filter: 'blur(10px)' }}
      />
    </Link>
  );
}
