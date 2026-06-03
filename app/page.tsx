import { tmdb, getHeroItemsWithLogos } from '@/lib/tmdb';
import { HeroSlider } from '@/components/media/HeroSlider';
import { ContinueWatching } from '@/components/media/ContinueWatching';
import { HorizontalRow } from '@/components/media/HorizontalRow';
import { Top10Row } from '@/components/media/Top10Row';
import { RecommendedForYou } from '@/components/media/RecommendedForYou';
import { JsonLd } from '@/components/seo/JsonLd';

export default async function Home() {
  const [trending, popMovies, popTv, topMovies, topTv, popAnime] = await Promise.all([
    tmdb.getTrending('all'),
    tmdb.getPopular('movie'),
    tmdb.getPopular('tv'),
    tmdb.getTopRated('movie'),
    tmdb.getTopRated('tv'),
    tmdb.getAnime('1').catch(() => ({ results: [] })),
  ]);

  const top6Trending = trending.results?.slice(0, 6) || [];
  
  const heroItemsWithLogos = await getHeroItemsWithLogos(top6Trending);

  return (
    <div className="flex flex-col min-h-screen -mt-[72px]">
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'ZIVOX',
        url: process.env.NEXT_PUBLIC_APP_URL || 'https://zivox-streaming.vercel.app',
        description: 'Free premium streaming platform for movies, TV shows, and anime in HD quality.',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL || 'https://zivox-streaming.vercel.app'}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      }} />
      {/* Cinematic hero — full screen, sits behind nav */}
      <HeroSlider items={heroItemsWithLogos} />

      {/* Content rows */}
      <div className="flex flex-col relative z-20 pb-28 md:pb-16 mt-4 gap-8 md:gap-14">
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

        <HorizontalRow
          title="💎 Top Rated TV Shows"
          items={topTv.results?.slice(0, 20) || []}
          seeAllHref="/tv"
        />
      </div>
    </div>
  );
}
