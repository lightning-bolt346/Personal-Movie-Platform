import { tmdb } from '@/lib/tmdb';
import { AnimeDashboard } from '@/components/media/AnimeDashboard';
import { Media } from '@/types/tmdb';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Watch Anime Free Online — Sub & Dub in HD — ZIVOX',
  description: 'Stream zivox anime series for free in HD quality on Zivox. Watch free anime online with Japanese audio, subtitles, and dubbed options without ads.',
  openGraph: {
    title: 'Watch Anime Free Online — Sub & Dub in HD — ZIVOX',
    description: 'Stream zivox anime series for free in HD quality on Zivox. Watch free anime online with Japanese audio, subtitles, and dubbed options without ads.',
  },
};

function deduplicate(items: Media[]) {
  return items.filter((item, index, self) => 
    item && item.id && index === self.findIndex((t) => t.id === item.id)
  );
}

export default async function AnimePage() {
  // Concurrently fetch Trending Anime (Pages 1 & 2) and Top Rated Anime (Pages 1 to 5)
  const [trendP1, trendP2, topP1, topP2, topP3, topP4, topP5] = await Promise.all([
    tmdb.discover("tv", { with_genres: "16", with_original_language: "ja", sort_by: "popularity.desc", page: "1" }),
    tmdb.discover("tv", { with_genres: "16", with_original_language: "ja", sort_by: "popularity.desc", page: "2" }).catch(() => ({ results: [] })),
    tmdb.discover("tv", { with_genres: "16", with_original_language: "ja", sort_by: "vote_average.desc", "vote_count.gte": "100", page: "1" }),
    tmdb.discover("tv", { with_genres: "16", with_original_language: "ja", sort_by: "vote_average.desc", "vote_count.gte": "100", page: "2" }).catch(() => ({ results: [] })),
    tmdb.discover("tv", { with_genres: "16", with_original_language: "ja", sort_by: "vote_average.desc", "vote_count.gte": "100", page: "3" }).catch(() => ({ results: [] })),
    tmdb.discover("tv", { with_genres: "16", with_original_language: "ja", sort_by: "vote_average.desc", "vote_count.gte": "100", page: "4" }).catch(() => ({ results: [] })),
    tmdb.discover("tv", { with_genres: "16", with_original_language: "ja", sort_by: "vote_average.desc", "vote_count.gte": "100", page: "5" }).catch(() => ({ results: [] })),
  ]);

  const trending = deduplicate([...(trendP1.results || []), ...(trendP2.results || [])]);
  const topRated = deduplicate([
    ...(topP1.results || []),
    ...(topP2.results || []),
    ...(topP3.results || []),
    ...(topP4.results || []),
    ...(topP5.results || [])
  ]);

  return <AnimeDashboard trendingAnime={trending} topRatedAnime={topRated} />;
}
