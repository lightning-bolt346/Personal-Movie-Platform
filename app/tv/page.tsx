import { tmdb, getHeroItemsWithLogos } from '@/lib/tmdb';
import { FilterableContent } from '@/components/media/FilterableContent';
import { HorizontalRow } from '@/components/media/HorizontalRow';
import { HeroSlider } from '@/components/media/HeroSlider';
import { Top10Row } from '@/components/media/Top10Row';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Watch TV Shows & Series Free Online in HD — ZIVOX',
  description: 'Stream zivox tv shows and the latest top-rated series for free in HD quality on Zivox. Watch shows online free, no ads, and no sign-up.',
  openGraph: {
    title: 'Watch TV Shows & Series Free Online in HD — ZIVOX',
    description: 'Stream zivox tv shows and the latest top-rated series for free in HD quality on Zivox. Watch shows online free, no ads, and no sign-up.',
  },
};

export default async function TvPage() {
  const [trendingTv, popTv, topTv] = await Promise.all([
    tmdb.getTrending('tv'),
    tmdb.getPopular('tv'),
    tmdb.getTopRated('tv'),
  ]);

  const top6Trending = trendingTv.results?.slice(0, 6) || [];
  const heroItemsWithLogos = await getHeroItemsWithLogos(top6Trending);

  return (
    <div className="flex flex-col min-h-screen pb-28 md:pb-20 bg-black -mt-[72px]">
      {/* Cinematic hero — full screen, sits behind nav */}
      <HeroSlider items={heroItemsWithLogos} />

      {/* Content rows */}
      <div className="flex flex-col relative z-20 mt-4 gap-8 md:gap-14">
        {/* Top 10 Today — Custom UI */}
        <Top10Row
          title="Top 10 Series Today"
          items={trendingTv.results?.slice(0, 10) || []}
        />

        <HorizontalRow
          title="🌟 Top Rated Series"
          items={topTv.results?.slice(0, 20) || []}
          seeAllHref="/tv"
        />

        {/* Filterable sections */}
        <div className="mt-4 px-2">
          <FilterableContent sections={[
            { title: "📺 Popular TV Shows", items: popTv.results || [] },
            { title: "💎 Top Rated", items: topTv.results || [] },
          ]} />
        </div>
      </div>
    </div>
  );
}
