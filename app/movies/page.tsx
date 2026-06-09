import { tmdb, getHeroItemsWithLogos } from '@/lib/tmdb';
import { JsonLd } from '@/components/seo/JsonLd';
import { getSiteUrl } from '@/lib/utils';
import { HeroSlider } from '@/components/media/HeroSlider';
import { RecommendedForYou } from '@/components/media/RecommendedForYou';
import { getCuratedCollections } from '@/lib/collectionsData';

import Link from 'next/link';
import Image from 'next/image';
import nextDynamic from 'next/dynamic';

const CollectionsRow = nextDynamic(() => import('@/components/media/CollectionsRow').then(mod => mod.CollectionsRow));
const Top10Row = nextDynamic(() => import('@/components/media/Top10Row').then(mod => mod.Top10Row));
const HorizontalRow = nextDynamic(() => import('@/components/media/HorizontalRow').then(mod => mod.HorizontalRow));

export const revalidate = 3600;

export const metadata = {
  title: 'Watch Movies Free Online in HD — ZIVOX',
  description: 'Stream zivox online movie collections in HD without ads or registration. Watch free movies online, hindi dubbed movies watch online, and top rated cinema free on Zivox.',
  openGraph: {
    title: 'Watch Movies Free Online in HD — ZIVOX',
    description: 'Stream zivox online movie collections in HD without ads or registration. Watch free movies online, hindi dubbed movies watch online, and top rated cinema free on Zivox.',
  },
};

const MOODS = [
  { label: 'Feel Good', image: '/lgotja3xMoJZbynwHfcQcJAEMWH.jpg', genre: '35', desc: 'Comedy & Laughter', color: '#f59e0b', bg: 'from-amber-600/30 to-amber-900/10' },
  { label: 'Thrilling', image: '/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg', genre: '53', desc: 'Edge-of-seat tension', color: '#ef4444', bg: 'from-red-600/30 to-red-900/10' },
  { label: 'Epic Adventure', image: '/iN41Ccw4DctL8npfmYg1j5Tr1eb.jpg', genre: '12', desc: 'Grand journeys', color: '#3b82f6', bg: 'from-blue-600/30 to-blue-900/10' },
  { label: 'Horror', image: '/vh7np635kDIcfO6x2Y9ElgLJsuI.jpg', genre: '27', desc: 'Spine-chilling scares', color: '#7c3aed', bg: 'from-purple-700/30 to-purple-900/10' },
  { label: 'Sci-Fi', image: '/2I1OFQJ0L9T0dpU6FobKFWV2PxX.jpg', genre: '878', desc: 'Future worlds', color: '#06b6d4', bg: 'from-cyan-600/30 to-cyan-900/10' },
  { label: 'Emotional', image: '/zfbjgQE1uSd9wiPTX4VzsLi0rGG.jpg', genre: '18', desc: 'Deep & moving drama', color: '#ec4899', bg: 'from-pink-600/30 to-pink-900/10' },
  { label: 'Classic Cinema', image: '/xnHVX37XZEp33hhCbYlQFq7ux1J.jpg', genre: '10749', desc: 'Timeless romance', color: '#84cc16', bg: 'from-lime-600/30 to-lime-900/10' },
  { label: 'Mystery', image: '/zTnAnYIn0Iv3cn0ZHlzLhou3ybm.jpg', genre: '9648', desc: 'Whodunit puzzles', color: '#f97316', bg: 'from-orange-600/30 to-orange-900/10' },
];

export default async function MoviesPage() {
  const [trendingMovies, popMovies, topMovies, hiddenGems, trueStories, acclaimed, thisYear] = await Promise.all([
    tmdb.getTrending('movie'),
    tmdb.getPopular('movie'),
    tmdb.getTopRated('movie'),
    // All-time hidden gems: high rating, not super popular — no date filter
    tmdb.discover('movie', { 'vote_average.gte': '7.4', 'vote_count.gte': '500', 'vote_count.lte': '3000', sort_by: 'vote_average.desc' }),
    tmdb.discover('movie', { with_keywords: '188065' }),
    tmdb.discover('movie', { 'vote_average.gte': '8.0', 'vote_count.gte': '5000', sort_by: 'vote_average.desc' }),
    tmdb.discover('movie', { 'primary_release_date.gte': '2026-01-01', sort_by: 'popularity.desc' }),
  ]);

  const top6Trending = trendingMovies.results?.slice(0, 6) || [];
  const heroItemsWithLogos = await getHeroItemsWithLogos(top6Trending);
  
  const collectionsData = await getCuratedCollections();

  const siteUrl = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Watch Movies Free Online in HD — ZIVOX",
    "url": `${siteUrl}/movies`,
    "description": "Stream zivox online movie collections in HD without ads or registration. Watch free movies online, hindi dubbed movies watch online.",
  };

  return (
    <div className="flex flex-col min-h-screen pb-[calc(64px+env(safe-area-inset-bottom,0px))] md:pb-20 bg-[#050505] -mt-[72px]">
      <JsonLd data={jsonLd} />
      <h1 className="sr-only">Movies</h1>
      {/* Cinematic hero */}
      <HeroSlider items={heroItemsWithLogos} />

      {/* Content rows */}
      <div className="flex flex-col relative z-20 mt-4 gap-6 md:gap-10">
        
        <RecommendedForYou mediaType="movie" />

        <Top10Row
          title="Top 10 Movies Today"
          items={trendingMovies.results?.slice(0, 10) || []}
        />

        {collectionsData.length > 0 && <CollectionsRow collections={collectionsData} />}


        <HorizontalRow
          title="Popular Now"
          items={popMovies.results?.slice(0, 20) || []}
        />

        <HorizontalRow
          title="Hidden Gems"
          items={hiddenGems.results?.slice(0, 20) || []}
        />

        <HorizontalRow
          title="Critically Acclaimed"
          items={acclaimed.results?.slice(0, 20) || []}
        />


        <HorizontalRow
          title="Based on True Stories"
          items={trueStories.results?.slice(0, 20) || []}
        />

        <HorizontalRow
          title="Released This Year"
          items={thisYear.results?.slice(0, 20) || []}
        />

        {/* Browse by Mood */}
        <div className="px-4 md:px-14 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 md:w-1.5 md:h-6 rounded-full bg-[#e50914]" />
            <h2 className="text-lg md:text-2xl font-display font-bold text-white tracking-tight">
              Browse by Mood
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {MOODS.map((mood) => (
              <Link
                key={mood.genre}
                href={`/genre/${mood.genre}?type=movie`}
                className={`group relative flex flex-col justify-end p-4 md:p-5 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border border-white/[0.05] hover:border-white/20`}
                style={{
                  minHeight: '120px',
                }}
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w500${mood.image}`}
                  alt={mood.label}
                  fill
                  className="object-cover opacity-50 group-hover:opacity-70 transition-all duration-500 group-hover:scale-[1.05]"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at center, ${mood.color}30 0%, transparent 80%)` }}
                />
                
                <div className="relative z-10 w-full">
                  <p className="text-white font-black font-display text-lg md:text-xl leading-tight tracking-tight drop-shadow-md">
                    {mood.label}
                  </p>
                  <p className="text-white/60 text-xs mt-0.5 leading-tight font-medium">
                    {mood.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Semantic SEO Block */}
        <div className="px-4 md:px-14 pb-8 mt-4">
          <div className="bg-white/[0.02] border border-zinc-800/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            <h2 className="text-xl md:text-2xl font-bold font-display text-white mb-4">Watch Free Movies Online in HD Without Registration</h2>
            <div className="prose prose-sm prose-invert max-w-none text-zinc-400 space-y-4">
              <p>
                Dive into the ultimate cinematic experience on ZIVOX. Our extensive movie collection allows you to <strong className="text-white">watch free movies online</strong> in crystal-clear HD and 4K quality.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-white font-bold text-base mb-2">Top Movie Genres</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><a href="/genre/action" className="hover:text-white transition-colors">Action & Adventure</a></li>
                    <li><a href="/genre/comedy" className="hover:text-white transition-colors">Comedy & Romance</a></li>
                    <li><a href="/genre/horror" className="hover:text-white transition-colors">Horror & Thriller</a></li>
                    <li><a href="/genre/science-fiction" className="hover:text-white transition-colors">Sci-Fi & Fantasy</a></li>
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
