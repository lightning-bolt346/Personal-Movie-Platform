import { tmdb, getHeroItemsWithLogos } from '@/lib/tmdb';
import { HeroSlider } from '@/components/media/HeroSlider';
import { ContinueWatching } from '@/components/media/ContinueWatching';
import { HorizontalRow } from '@/components/media/HorizontalRow';
import { Top10Row } from '@/components/media/Top10Row';
import { RecommendedForYou } from '@/components/media/RecommendedForYou';
import { TimeBasedWidget } from '@/components/home/TimeBasedWidget';
import { CollectionsRow } from '@/components/media/CollectionsRow';
import { JsonLd } from '@/components/seo/JsonLd';

export default async function Home() {
  const [trending, popMovies, popTv, topMovies, topTv, popAnime, classicMovies, classicTv, underratedMovies, underratedTv] = await Promise.all([
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

  return (
    <div className="flex flex-col min-h-screen -mt-[72px]">
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': `${process.env.NEXT_PUBLIC_APP_URL || 'https://zivox-streaming.vercel.app'}/#website`,
            name: 'ZIVOX',
            alternateName: ['Zivox TV', 'Zivox Anime', 'Zivox Shows', 'Zivox Movies', 'Zivox Vercel', 'zivox online movie', 'zivox hindi movie'],
            url: process.env.NEXT_PUBLIC_APP_URL || 'https://zivox-streaming.vercel.app',
            description: 'Free premium streaming platform for movies, TV shows, and anime in HD quality. The ultimate alternative to Netmirror, Pikashow, Fmovies, and 123movies.',
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
        <TimeBasedWidget items={widgetPool} />
        <ContinueWatching />
        <RecommendedForYou />

        {/* Top 10 Today — Custom UI */}
        <Top10Row
          title="Top 10 Today"
          items={trending.results?.slice(0, 10) || []}
        />

        <HorizontalRow
          title="🔥 Trending Now"
          items={trending.results?.slice(6, 20) || []}
          seeAllHref="/movies"
        />

        <HorizontalRow
          title="🍿 Popular Movies"
          items={popMovies.results?.slice(0, 20) || []}
          seeAllHref="/movies"
        />

        <HorizontalRow
          title="🌟 Top Rated Movies"
          items={topMovies.results?.slice(0, 20) || []}
          seeAllHref="/movies"
        />

        <HorizontalRow
          title="📺 Popular TV Shows"
          items={popTv.results?.slice(0, 20) || []}
          seeAllHref="/tv"
        />

        <HorizontalRow
          title="🌸 Anime Corner"
          items={popAnime.results?.slice(0, 20) || []}
          seeAllHref="/anime"
        />

        {/* Movie Collections — curated iconic franchises */}
        <CollectionsRow />

        <HorizontalRow
          title="💎 Top Rated TV Shows"
          items={topTv.results?.slice(0, 20) || []}
          seeAllHref="/tv"
        />
      </div>
    </div>
  );
}
