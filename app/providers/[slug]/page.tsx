import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PROVIDERS, Provider } from '@/lib/providers';
import { tmdb } from '@/lib/tmdb';
import { Media } from '@/types/tmdb';
import { ProviderFilterBar } from '@/components/providers/ProviderFilterBar';
import { ProviderContentGrid } from '@/components/providers/ProviderContentGrid';
import { ProviderHeroShelf } from '@/components/providers/ProviderHeroShelf';
import { BackButton } from '@/components/ui/BackButton';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return PROVIDERS.map((provider) => ({
    slug: provider.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const provider = PROVIDERS.find((p) => p.slug === resolvedParams.slug);
  
  if (!provider) {
    return {
      title: 'Provider Not Found',
    };
  }

  return {
    title: `Watch on ${provider.name} — Movies & TV Shows | ZIVOX`,
    description: `Browse all ${provider.name} content on ZIVOX. Stream ${provider.name} movies and TV series in HD free. Updated list of everything on ${provider.name}.`,
    alternates: {
      canonical: `/providers/${provider.slug}`
    }
  };
}

export default async function ProviderPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const provider = PROVIDERS.find((p) => p.slug === resolvedParams.slug);

  if (!provider) {
    notFound();
  }

  // Fetch trending shelf data only if provider has it
  let trendingData: { results: Media[] } = { results: [] };
  if (provider.hasTrending) {
    try {
      trendingData = await tmdb.discover('movie', {
        with_watch_providers: provider.id.toString(),
        watch_region: provider.region,
        sort_by: 'popularity.desc'
      });
    } catch (e) {
      console.error(`Failed to fetch trending for ${provider.name}`);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-black -mt-[72px]">
      {/* Hero Section */}
      <div 
        className="relative w-full h-[280px] md:h-[360px] flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Animated Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-b ${provider.gradient} opacity-80`}></div>
        <div 
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{ backgroundImage: 'url("/noise.png")' }}
        ></div>

        <div className="absolute top-[80px] w-full max-w-7xl mx-auto px-4 sm:px-6 z-50">
          <BackButton />
        </div>

        <div className="relative z-10 flex flex-col items-center mt-[100px]">
          <div className="w-[120px] h-[60px] md:w-[200px] md:h-[100px] relative mb-4">
            <Image
              src={provider.logo}
              alt={provider.name}
              fill
              className="object-contain filter drop-shadow-lg"
              priority
            />
          </div>
          
          <p className="text-zinc-300 text-sm md:text-lg font-medium tracking-wide drop-shadow-md text-center px-4">
            {provider.tagline}
          </p>
          
          <div className="flex items-center gap-2 mt-4 text-xs font-bold tracking-widest uppercase text-white/50">
            {provider.categories.includes('movie') && <span>Movies</span>}
            {provider.categories.length === 2 && <span className="w-1 h-1 rounded-full bg-white/30" />}
            {provider.categories.includes('tv') && <span>Series</span>}
          </div>
        </div>
        
        {/* Bottom fade out */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-10"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-20 flex flex-col w-full" style={{ backgroundColor: provider.bgAccent }}>
        {/* Trending Shelf (SSR) */}
        {provider.hasTrending && trendingData.results.length > 0 && (
          <div className="pt-8 pb-4">
            <ProviderHeroShelf 
              provider={provider} 
              title={`Trending on ${provider.name}`} 
              items={trendingData.results.slice(0, 20)} 
            />
          </div>
        )}

        {/* Sticky Filter Bar */}
        <ProviderFilterBar provider={provider} />

        {/* Client-side Infinite Scroll Grid */}
        <ProviderContentGrid provider={provider} />
      </div>
    </div>
  );
}
