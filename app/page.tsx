import { tmdb, getHeroItemsWithLogos } from '@/lib/tmdb';
import { getCuratedCollections } from '@/lib/collectionsData';
import { HeroSlider } from '@/components/media/HeroSlider';
import { ContinueWatching } from '@/components/media/ContinueWatching';
import { HorizontalRow } from '@/components/media/HorizontalRow';
import { Top10Row } from '@/components/media/Top10Row';
import { RecommendedForYou } from '@/components/media/RecommendedForYou';
import { TimeBasedWidget } from '@/components/home/TimeBasedWidget';
import { CollectionsRow } from '@/components/media/CollectionsRow';
import { JsonLd } from '@/components/seo/JsonLd';
import { Suspense } from 'react';
import { ThemedLoader } from '@/components/ui/ThemedLoader';
import { ProvidersGrid } from '@/components/providers/ProvidersGrid';
import { ProviderHeroShelf } from '@/components/providers/ProviderHeroShelf';
import { PROVIDERS } from '@/lib/providers';

export const dynamic = 'force-dynamic';

async function HomeDataFetcher() {
  // Artificial delay to ensure loading animation is visible for at least 2 seconds as requested
  const fetchPromise = Promise.all([
    tmdb.getTrending('all'),
    tmdb.getPopular('movie'),
    tmdb.getPopular('tv'),
    tmdb.getTopRated('movie'),
    tmdb.getTopRated('tv'),
    tmdb.getAnime('1').catch(() => ({ results: [] })),
    tmdb.discover('movie', { 'primary_release_date.gte': '1980-01-01', 'primary_release_date.lte': '2014-12-31', 'vote_count.gte': '3000', 'sort_by': 'vote_average.desc' }),
    tmdb.discover('tv', { 'first_air_date.gte': '1990-01-01', 'first_air_date.lte': '2014-12-31', 'vote_count.gte': '1500', 'sort_by': 'vote_average.desc' }),
    tmdb.discover('movie', { 'vote_average.gte': '7.2', 'vote_count.gte': '300', 'vote_count.lte': '2500', 'sort_by': 'popularity.desc' }),
    tmdb.discover('tv', { 'vote_average.gte': '7.5', 'vote_count.gte': '200', 'vote_count.lte': '2000', 'sort_by': 'popularity.desc' }),
    tmdb.discover('movie', { with_watch_providers: '8', watch_region: 'US', sort_by: 'popularity.desc' }).catch(() => ({ results: [] })),
    tmdb.discover('movie', { with_watch_providers: '9', watch_region: 'US', sort_by: 'popularity.desc' }).catch(() => ({ results: [] })),
    tmdb.discover('movie', { with_watch_providers: '337', watch_region: 'US', sort_by: 'popularity.desc' }).catch(() => ({ results: [] })),
    tmdb.discover('movie', { with_watch_providers: '1899', watch_region: 'US', sort_by: 'popularity.desc' }).catch(() => ({ results: [] })),
    tmdb.discover('movie', { with_watch_providers: '122', watch_region: 'IN', sort_by: 'popularity.desc' }).catch(() => ({ results: [] })),
  ]);
  const delayPromise = new Promise(r => setTimeout(r, 2000));
  
  const [[trending, popMovies, popTv, topMovies, topTv, popAnime, classicMovies, classicTv, underratedMovies, underratedTv, netflixData, primeData, disneyData, maxData, hotstarData]] = await Promise.all([
    fetchPromise,
    delayPromise
  ]);

  const top6Trending = trending.results?.slice(0, 6) || [];
  const heroItemsWithLogos = await getHeroItemsWithLogos(top6Trending);
  
  // Use classics and underrated gems for the time-based recommendations
  const widgetPool = [
    ...(classicMovies.results || []), 
    ...(classicTv.results || []), 
    ...(underratedMovies.results || []), 
    ...(underratedTv.results || []),
    ...(topMovies.results || []),
    ...(topTv.results || [])
  ];

  // Fetch fresh collection data for the curated row
  const collectionsData = await getCuratedCollections();

  return (
    <div className="flex flex-col min-h-screen -mt-[72px]">
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': `${process.env.NEXT_PUBLIC_APP_URL || 'https://zivox-streaming.vercel.app'}/#website`,
            name: 'ZIVOX',
            alternateName: ['Zivox TV', 'Zivox Anime', 'Zivox Shows', 'Zivox Movies', 'Zivox App', 'Zivox Official'],
            url: process.env.NEXT_PUBLIC_APP_URL || 'https://zivox-streaming.vercel.app',
            description: 'Free premium streaming platform for movies, TV shows, and anime in HD quality without ads.',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL || 'https://zivox-streaming.vercel.app'}/search?q={search_term_string}`,
              },
              'query-input': 'required name=search_term_string',
            },
          },
          {
            '@type': 'Organization',
            '@id': `${process.env.NEXT_PUBLIC_APP_URL || 'https://zivox-streaming.vercel.app'}/#organization`,
            name: 'ZIVOX',
            alternateName: ['Zivox App', 'Zivox Official'],
            url: process.env.NEXT_PUBLIC_APP_URL || 'https://zivox-streaming.vercel.app',
            logo: {
              '@type': 'ImageObject',
              url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://zivox-streaming.vercel.app'}/icon.png`,
            }
          }
        ]
      }} />
      {/* Cinematic hero — full screen, sits behind nav */}
      <HeroSlider items={heroItemsWithLogos} />

      {/* Content rows */}
      <div className="flex flex-col relative z-20 pb-28 md:pb-16 mt-4 gap-8 md:gap-14">
        {/* Movie Collections — curated iconic franchises */}
        {collectionsData.length > 0 && <CollectionsRow collections={collectionsData} />}

        <TimeBasedWidget items={widgetPool} />
        
        <ContinueWatching />

        <RecommendedForYou />

        <ProvidersGrid />

        {/* Top 10 Today — Custom UI */}
        <Top10Row
          title="Top 10 Today"
          items={trending.results?.slice(0, 10) || []}
        />

        <HorizontalRow
          title="🔥 Popular Movies"
          items={popMovies.results?.slice(0, 20) || []}
          seeAllHref="/movies"
        />

        <HorizontalRow
          title="📺 Trending TV Shows"
          items={popTv.results?.slice(0, 20) || []}
          seeAllHref="/tv"
        />

        <HorizontalRow
          title="🌸 Anime Corner"
          items={popAnime.results?.slice(0, 20) || []}
          seeAllHref="/anime"
        />

        {/* Provider Shelves */}
        <ProviderHeroShelf provider={PROVIDERS.find(p => p.id === 8)!} title="Trending on Netflix" items={netflixData.results?.slice(0, 20) || []} />
        <ProviderHeroShelf provider={PROVIDERS.find(p => p.id === 9)!} title="New on Prime Video" items={primeData.results?.slice(0, 20) || []} />
        <ProviderHeroShelf provider={PROVIDERS.find(p => p.id === 337)!} title="Trending on Disney+" items={disneyData.results?.slice(0, 20) || []} />
        <ProviderHeroShelf provider={PROVIDERS.find(p => p.id === 1899)!} title="Trending on Max" items={maxData.results?.slice(0, 20) || []} />
        <ProviderHeroShelf provider={PROVIDERS.find(p => p.id === 122)!} title="Trending on Hotstar" items={hotstarData.results?.slice(0, 20) || []} />

        <HorizontalRow
          title="💎 Top Rated TV Shows"
          items={topTv.results?.slice(0, 20) || []}
          seeAllHref="/tv"
        />
        
        {/* Semantic SEO Block for Home Page */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full mt-12 mb-8">
          <div className="bg-void-900/50 border border-zinc-800/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            <h2 className="text-xl md:text-2xl font-bold font-display text-white mb-4">Watch Movies & TV Shows Free Online in HD</h2>
            <div className="prose prose-sm prose-invert max-w-none text-zinc-400 space-y-4">
              <p>
                Welcome to <strong>ZIVOX</strong>, your premier destination to <a href="/movies" className="text-crimson-400 hover:underline">watch free movies online</a> and stream the latest TV series in stunning 1080p and 4K HD quality. Whether you're looking for Hollywood blockbusters, critically acclaimed indie films, or ongoing television episodes, ZIVOX offers an unparalleled streaming experience without the need for registration or expensive subscriptions.
              </p>
              <p>
                As a leading 2026 streaming platform, ZIVOX features a massive library of constantly updated content. From <a href="/anime" className="text-pink-400 hover:underline">subbed and dubbed Anime</a> to classic cinema and trending internet series, our fast servers ensure buffer-free playback on any device.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-white font-bold text-base mb-2">Why Choose ZIVOX?</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>No Registration Required:</strong> Start watching instantly.</li>
                    <li><strong>Premium HD Quality:</strong> 1080p and 4K streams available.</li>
                    <li><strong>Massive Library:</strong> Over 100,000 titles spanning all genres.</li>
                    <li><strong>Daily Updates:</strong> New episodes and theatrical releases added daily.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-2">Popular Categories</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><a href="/movies" className="hover:text-white transition-colors">Free HD Movies Online</a></li>
                    <li><a href="/tv" className="hover:text-white transition-colors">Binge-Watch TV Series</a></li>
                    <li><a href="/anime" className="hover:text-white transition-colors">Top Anime Releases</a></li>
                    <li><a href="/discover" className="hover:text-white transition-colors">Discover New Cinematic Gems</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zivox-streaming.vercel.app';
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "ZIVOX - Watch Free Movies and TV Shows",
    "url": siteUrl,
    "description": "Stream ZIVOX online movie collections in HD without ads or registration. Watch free movies online, hindi dubbed movies, and top rated cinema.",
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <JsonLd data={jsonLd} />
      <Suspense fallback={<ThemedLoader theme="home" />}>
        <HomeDataFetcher />
      </Suspense>
    </div>
  );
}
