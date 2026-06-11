import { tmdb, getHeroItemsWithLogos } from '@/lib/tmdb';
import { getCuratedCollections } from '@/lib/collectionsData';
import { HeroSlider } from '@/components/media/HeroSlider';
import { ContinueWatching } from '@/components/media/ContinueWatching';
import { RecommendedForYou } from '@/components/media/RecommendedForYou';
import { JsonLd } from '@/components/seo/JsonLd';
import { Suspense } from 'react';
import { ThemedLoader } from '@/components/ui/ThemedLoader';
import { PROVIDERS } from '@/lib/providers';
import nextDynamic from 'next/dynamic';
import { getSiteUrl } from '@/lib/utils';

const CollectionsRow = nextDynamic(() => import('@/components/media/CollectionsRow').then(mod => mod.CollectionsRow));
const TimeBasedWidget = nextDynamic(() => import('@/components/home/TimeBasedWidget').then(mod => mod.TimeBasedWidget));
import { ProvidersGrid } from '@/components/providers/ProvidersGrid';
const Top10Row = nextDynamic(() => import('@/components/media/Top10Row').then(mod => mod.Top10Row));
const HorizontalRow = nextDynamic(() => import('@/components/media/HorizontalRow').then(mod => mod.HorizontalRow));
const ProviderHeroShelf = nextDynamic(() => import('@/components/providers/ProviderHeroShelf').then(mod => mod.ProviderHeroShelf));

export const revalidate = 3600;

async function HomeDataFetcher() {
  // ─── Single cached fetch replaces 12+ parallel TMDB calls ────────────────
  // /api/home-data is cached at the CDN for 1h — this function runs at most
  // once per hour regardless of traffic. All other requests hit CDN for free.
  const siteUrl = getSiteUrl();
  const homeDataUrl = `${siteUrl}/api/home-data`;

  let trending: any, popMovies: any, popTv: any, topMovies: any, topTv: any;
  let popAnime: any, classicMovies: any, classicTv: any, underratedMovies: any;
  let underratedTv: any, netflixData: any, primeData: any;

  try {
    const res = await fetch(homeDataUrl, {
      next: { revalidate: 3600 }, // Respect the same 1h cache window
    });

    if (!res.ok) throw new Error(`Home data fetch failed: ${res.status}`);

    const data = await res.json();
    trending = data.trending;
    popMovies = data.popMovies;
    popTv = data.popTv;
    topMovies = data.topMovies;
    topTv = data.topTv;
    popAnime = data.popAnime ?? { results: [] };
    classicMovies = data.classicMovies ?? { results: [] };
    classicTv = data.classicTv ?? { results: [] };
    underratedMovies = data.underratedMovies ?? { results: [] };
    underratedTv = data.underratedTv ?? { results: [] };
    netflixData = data.netflixData ?? { results: [] };
    primeData = data.primeData ?? { results: [] };
  } catch {
    // Graceful fallback — individual TMDB calls if the cached route fails
    const fallback = await Promise.all([
      tmdb.getTrending('all'),
      tmdb.getPopular('movie'),
      tmdb.getPopular('tv'),
      tmdb.getTopRated('movie'),
      tmdb.getTopRated('tv'),
    ]);
    [trending, popMovies, popTv, topMovies, topTv] = fallback;
    popAnime = { results: [] };
    classicMovies = { results: [] };
    classicTv = { results: [] };
    underratedMovies = { results: [] };
    underratedTv = { results: [] };
    netflixData = { results: [] };
    primeData = { results: [] };
  }

  // Extract and interleave movie and tv items to ensure a balanced cinematic mix in the Hero slider
  const trendingResults = trending.results || [];
  const trendingMovies = trendingResults.filter((item: any) => item.media_type === 'movie');
  const trendingTvs = trendingResults.filter((item: any) => item.media_type === 'tv');

  const mixedHeroItems: any[] = [];
  const maxLen = Math.max(trendingMovies.length, trendingTvs.length);
  for (let i = 0; i < maxLen; i++) {
    if (trendingMovies[i] && mixedHeroItems.length < 6) mixedHeroItems.push(trendingMovies[i]);
    if (trendingTvs[i] && mixedHeroItems.length < 6) mixedHeroItems.push(trendingTvs[i]);
  }

  // Fallback to normal slice if for some reason we don't have enough mixed items
  if (mixedHeroItems.length < 6) {
    const remaining = trendingResults.filter((item: any) => !mixedHeroItems.includes(item));
    mixedHeroItems.push(...remaining.slice(0, 6 - mixedHeroItems.length));
  }

  const heroItemsWithLogos = await getHeroItemsWithLogos(mixedHeroItems);
  
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
            '@id': `${siteUrl}/#website`,
            name: 'ZIVOX',
            alternateName: ['Zivox TV', 'Zivox Anime', 'Zivox Shows', 'Zivox Movies', 'Zivox App', 'Zivox Official'],
            url: siteUrl,
            description: 'Free premium streaming platform for movies, TV shows, and anime in HD quality without ads.',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${siteUrl}/search?q={search_term_string}`,
              },
              'query-input': 'required name=search_term_string',
            },
          },
          {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'ZIVOX',
            alternateName: ['Zivox App', 'Zivox Official'],
            url: siteUrl,
            logo: {
              '@type': 'ImageObject',
              url: `${siteUrl}/icon.png`,
            }
          }
        ]
      }} />
      {/* Cinematic hero — full screen, sits behind nav */}
      <HeroSlider items={heroItemsWithLogos} />

      <div className="md:hidden block mt-4 z-20 relative">
        <TimeBasedWidget items={widgetPool} variant="mobile" />
      </div>

      {/* Content rows */}
      <div className="flex flex-col relative z-20 pb-[calc(64px+env(safe-area-inset-bottom,0px))] md:pb-16 md:mt-4 gap-6 md:gap-10">
        
        {/* Priority Rows (Above Fold) */}
        <ContinueWatching />
        <RecommendedForYou mediaType="all" />

        {/* Movie Collections — curated iconic franchises */}
        {collectionsData.length > 0 && <CollectionsRow collections={collectionsData} />}

        <div className="hidden md:block">
          <TimeBasedWidget items={widgetPool} variant="desktop" />
        </div>

        <ProvidersGrid />

        {/* Top 10 Today — Custom UI */}
        <Top10Row
          title="Top 10 Today"
          items={trending.results?.slice(0, 10) || []}
        />

        <HorizontalRow
          title="Popular Movies"
          items={popMovies.results?.slice(0, 20) || []}
          seeAllHref="/movies"
        />

        <HorizontalRow
          title="Trending TV Shows"
          items={popTv.results?.slice(0, 20) || []}
          seeAllHref="/tv"
        />

        <HorizontalRow
          title="Anime Corner"
          items={popAnime.results?.slice(0, 20) || []}
          seeAllHref="/anime"
        />

        {/* Provider Shelves */}
        <ProviderHeroShelf provider={PROVIDERS.find(p => p.id === 8)!} title="Trending on Netflix" items={netflixData.results?.slice(0, 20) || []} />
        <ProviderHeroShelf provider={PROVIDERS.find(p => p.id === 9)!} title="New on Prime Video" items={primeData.results?.slice(0, 20) || []} />

        <HorizontalRow
          title="Top Rated TV Shows"
          items={topTv.results?.slice(0, 20) || []}
          seeAllHref="/tv"
        />
        
        {/* Semantic SEO Block for Home Page */}
        <div className="px-4 md:px-14 pb-8">
          <div className="bg-white/[0.02] border border-zinc-800/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            <h2 className="text-xl md:text-2xl font-bold font-display text-white mb-4">Watch Movies & TV Shows Free Online in HD</h2>
            <div className="prose prose-sm prose-invert max-w-none text-zinc-400 space-y-4">
              <p>
                Welcome to <strong>ZIVOX</strong>, your premier destination to <a href="/movies" className="text-brand-500 hover:underline">watch free movies online</a> and stream the latest TV series in stunning 1080p and 4K HD quality.
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
  const siteUrl = getSiteUrl();
  
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
