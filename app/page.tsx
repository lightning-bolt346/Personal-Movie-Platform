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
  // ─── Single cached render replaces 12+ parallel TMDB calls ────────────────
  // The page itself exports `revalidate = 3600`. This means Next.js will only
  // run this function and hit TMDB ONCE per hour. All other user requests
  // will be served the pre-rendered HTML from Vercel's Edge CDN instantly.

  const siteUrl = getSiteUrl();
  const [
    trending,
    popMovies,
    popTv,
    topMovies,
    topTv,
    popAnime,
    classicMovies,
    classicTv,
    underratedMovies,
    underratedTv,
    netflixData,
    primeData,
  ] = await Promise.all([
    tmdb.getTrending('all'),
    tmdb.getPopular('movie'),
    tmdb.getPopular('tv'),
    tmdb.getTopRated('movie'),
    tmdb.getTopRated('tv'),
    tmdb.getAnime('1').catch(() => ({ results: [] })),
    tmdb.discover('movie', {
      'primary_release_date.gte': '1980-01-01',
      'primary_release_date.lte': '2014-12-31',
      'vote_count.gte': '3000',
      sort_by: 'vote_average.desc',
    }).catch(() => ({ results: [] })),
    tmdb.discover('tv', {
      'first_air_date.gte': '1990-01-01',
      'first_air_date.lte': '2014-12-31',
      'vote_count.gte': '1500',
      sort_by: 'vote_average.desc',
    }).catch(() => ({ results: [] })),
    tmdb.discover('movie', {
      'vote_average.gte': '7.2',
      'vote_count.gte': '300',
      'vote_count.lte': '2500',
      sort_by: 'popularity.desc',
    }).catch(() => ({ results: [] })),
    tmdb.discover('tv', {
      'vote_average.gte': '7.5',
      'vote_count.gte': '200',
      'vote_count.lte': '2000',
      sort_by: 'popularity.desc',
    }).catch(() => ({ results: [] })),
    tmdb.discover('movie', {
      with_watch_providers: '8',
      watch_region: 'US',
      sort_by: 'popularity.desc',
    }).catch(() => ({ results: [] })),
    tmdb.discover('movie', {
      with_watch_providers: '9',
      watch_region: 'US',
      sort_by: 'popularity.desc',
    }).catch(() => ({ results: [] })),
  ]);

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
