import { tmdb, getHeroItemsWithLogos } from '@/lib/tmdb';
import { FilterableContent } from '@/components/media/FilterableContent';
import { HorizontalRow } from '@/components/media/HorizontalRow';
import { HeroSlider } from '@/components/media/HeroSlider';
import { Top10Row } from '@/components/media/Top10Row';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Watch Movies Free Online in HD — ZIVOX',
  description: 'Stream zivox online movie collections in HD without ads or registration. Watch free movies online, hindi dubbed movies watch online, and top rated cinema free on Zivox.',
  openGraph: {
    title: 'Watch Movies Free Online in HD — ZIVOX',
    description: 'Stream zivox online movie collections in HD without ads or registration. Watch free movies online, hindi dubbed movies watch online, and top rated cinema free on Zivox.',
  },
};

export default async function MoviesPage() {
  const [trendingMovies, popMovies, topMovies] = await Promise.all([
    tmdb.getTrending('movie'),
    tmdb.getPopular('movie'),
    tmdb.getTopRated('movie'),
  ]);

  const top6Trending = trendingMovies.results?.slice(0, 6) || [];
  const heroItemsWithLogos = await getHeroItemsWithLogos(top6Trending);

  return (
    <div className="flex flex-col min-h-screen pb-28 md:pb-20 bg-black -mt-[72px]">
      {/* Cinematic hero — full screen, sits behind nav */}
      <HeroSlider items={heroItemsWithLogos} />

      {/* Content rows */}
      <div className="flex flex-col relative z-20 mt-4 gap-8 md:gap-14">
        {/* Top 10 Today — Custom UI */}
        <Top10Row
          title="Top 10 Movies Today"
          items={trendingMovies.results?.slice(0, 10) || []}
        />

        <HorizontalRow
          title="🍿 Popular Now"
          items={popMovies.results?.slice(0, 20) || []}
          seeAllHref="/movies"
        />

        <HorizontalRow
          title="🌟 Top Rated"
          items={topMovies.results?.slice(0, 20) || []}
          seeAllHref="/movies"
        />

        {/* Filterable sections */}
        <div className="mt-4 px-2">
          <FilterableContent sections={[
            { title: "Popular Movies", items: popMovies.results || [] },
            { title: "Top Rated", items: topMovies.results || [] },
          ]} />
        </div>
      </div>
    </div>
  );
}
