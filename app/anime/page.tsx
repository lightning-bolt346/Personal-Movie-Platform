import { tmdb } from '@/lib/tmdb';
import { JsonLd } from '@/components/seo/JsonLd';
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

import { Suspense } from 'react';
import { ThemedLoader } from '@/components/ui/ThemedLoader';

async function AnimeDataFetcher() {
  // Artificial delay to ensure loading animation is visible for at least 2 seconds as requested
  const fetchPromise = Promise.all([
    tmdb.discover("tv", { with_genres: "16", with_original_language: "ja", sort_by: "popularity.desc", page: "1" }),
    tmdb.discover("tv", { with_genres: "16", with_original_language: "ja", sort_by: "popularity.desc", page: "2" }).catch(() => ({ results: [] })),
    tmdb.discover("tv", { with_genres: "16", with_original_language: "ja", sort_by: "vote_average.desc", "vote_count.gte": "100", page: "1" }),
    tmdb.discover("tv", { with_genres: "16", with_original_language: "ja", sort_by: "vote_average.desc", "vote_count.gte": "100", page: "2" }).catch(() => ({ results: [] })),
    tmdb.discover("tv", { with_genres: "16", with_original_language: "ja", sort_by: "vote_average.desc", "vote_count.gte": "100", page: "3" }).catch(() => ({ results: [] })),
    tmdb.discover("tv", { with_genres: "16", with_original_language: "ja", sort_by: "vote_average.desc", "vote_count.gte": "100", page: "4" }).catch(() => ({ results: [] })),
    tmdb.discover("tv", { with_genres: "16", with_original_language: "ja", sort_by: "vote_average.desc", "vote_count.gte": "100", page: "5" }).catch(() => ({ results: [] })),
  ]);
  const delayPromise = new Promise(r => setTimeout(r, 2000));
  
  const [[trendP1, trendP2, topP1, topP2, topP3, topP4, topP5]] = await Promise.all([
    fetchPromise,
    delayPromise
  ]);

  const trending = deduplicate([...(trendP1.results || []), ...(trendP2.results || [])]);
  const topRated = deduplicate([
    ...(topP1.results || []),
    ...(topP2.results || []),
    ...(topP3.results || []),
    ...(topP4.results || []),
    ...(topP5.results || [])
  ]);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Watch Anime Online",
          "description": "Watch the latest and most popular anime series online for free in HD quality on ZIVOX.",
          "url": "https://zivox.com/anime"
        }}
      />
      <AnimeDashboard trendingAnime={trending} topRatedAnime={topRated} />
      
      {/* Semantic SEO Block for Anime Page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full mt-12 mb-8 relative z-20">
        <div className="bg-void-900/50 border border-zinc-800/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <h2 className="text-xl md:text-2xl font-bold font-display text-white mb-4">Watch Anime Free Online — Subbed & Dubbed in HD</h2>
          <div className="prose prose-sm prose-invert max-w-none text-zinc-400 space-y-4">
            <p>
              Welcome to the ultimate Anime hub on ZIVOX. Our platform provides fans with a massive library to <strong className="text-white">watch anime free online</strong> in brilliant HD quality. From legendary Shonen battle series to slice-of-life, mecha, and isekai, ZIVOX brings you the best of Japanese animation without any registration or subscription fees.
            </p>
            <p>
              We understand that anime fans have different preferences, which is why we offer both original Japanese audio with precise English subtitles (Sub), as well as high-quality English dubs (Dub). Catch up on trending simulcasts, or dive into completed masterpieces from decades past.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="text-white font-bold text-base mb-2">Anime Features</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Sub & Dub Available:</strong> Seamlessly switch between audio formats.</li>
                  <li><strong>Ad-Free Experience:</strong> Enjoy uninterrupted episodes.</li>
                  <li><strong>Fast Servers:</strong> Lightning-fast streaming for action-packed sequences.</li>
                  <li><strong>Extensive Catalog:</strong> Browse thousands of shows across 20+ genres.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-bold text-base mb-2">Popular Anime Categories</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><a href="/genre/action" className="hover:text-white transition-colors">Action & Shonen</a></li>
                  <li><a href="/genre/fantasy" className="hover:text-white transition-colors">Isekai & Fantasy</a></li>
                  <li><a href="/genre/romance" className="hover:text-white transition-colors">Romance & Slice of Life</a></li>
                  <li><a href="/genre/animation" className="hover:text-white transition-colors">Trending Anime Movies</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AnimePage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Suspense fallback={<ThemedLoader theme="anime" />}>
        <AnimeDataFetcher />
      </Suspense>
    </div>
  );
}
