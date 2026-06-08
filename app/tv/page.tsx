import { tmdb, getHeroItemsWithLogos } from '@/lib/tmdb';
import { JsonLd } from '@/components/seo/JsonLd';
import { FilterableContent } from '@/components/media/FilterableContent';
import { HorizontalRow } from '@/components/media/HorizontalRow';
import { HeroSlider } from '@/components/media/HeroSlider';
import { Top10Row } from '@/components/media/Top10Row';
import { RecommendedForYou } from '@/components/media/RecommendedForYou';

export const revalidate = 3600;

export const metadata = {
  title: 'Watch TV Shows & Series Free Online in HD — ZIVOX',
  description: 'Stream zivox tv shows and the latest top-rated series for free in HD quality on Zivox. Watch shows online free, no ads, and no sign-up.',
  openGraph: {
    title: 'Watch TV Shows & Series Free Online in HD — ZIVOX',
    description: 'Stream zivox tv shows and the latest top-rated series for free in HD quality on Zivox. Watch shows online free, no ads, and no sign-up.',
  },
};

import { Suspense } from 'react';
import { ThemedLoader } from '@/components/ui/ThemedLoader';

async function TvDataFetcher() {
  const [trendingTv, popTv, topTv] = await Promise.all([
    tmdb.getTrending('tv'),
    tmdb.getPopular('tv'),
    tmdb.getTopRated('tv'),
  ]);

  const top6Trending = trendingTv.results?.slice(0, 6) || [];
  const heroItemsWithLogos = await getHeroItemsWithLogos(top6Trending);

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zivox-streaming.vercel.app';
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Watch TV Shows & Series Free Online in HD — ZIVOX",
    "url": `${siteUrl}/tv`,
    "description": "Stream zivox tv shows and the latest top-rated series for free in HD quality on Zivox. Watch shows online free, no ads.",
  };

  return (
    <div className="flex flex-col min-h-screen pb-28 md:pb-20 bg-black -mt-[72px]">
      <JsonLd data={jsonLd} />
      {/* Cinematic hero — full screen, sits behind nav */}
      <HeroSlider items={heroItemsWithLogos} />

      {/* Content rows */}
      <div className="flex flex-col relative z-20 mt-4 gap-8 md:gap-14">
        <RecommendedForYou mediaType="tv" />

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

        {/* Semantic SEO Block for TV Page */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full mt-12 mb-8">
          <div className="bg-void-900/50 border border-zinc-800/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            <h2 className="text-xl md:text-2xl font-bold font-display text-white mb-4">Watch TV Shows & Series Online Free in HD</h2>
            <div className="prose prose-sm prose-invert max-w-none text-zinc-400 space-y-4">
              <p>
                Binge-watch your favorite television with ZIVOX. Our platform is the best place to <strong className="text-white">watch TV shows online for free</strong> in stunning high definition. From gripping premium cable dramas to laugh-out-loud sitcoms and highly-anticipated season premieres, ZIVOX delivers endless television entertainment straight to your device.
              </p>
              <p>
                We track the latest episode releases in real-time, ensuring you never miss a cliffhanger. No sign-ups or subscription fees are required—just select your show, pick your season, and start streaming instantly.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-white font-bold text-base mb-2">Streaming Benefits</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Up-to-Date Episodes:</strong> New episodes are added within hours of broadcast.</li>
                    <li><strong>Smart Tracking:</strong> Use our Watchlist and Reminders features (saved locally) to track ongoing series.</li>
                    <li><strong>Cross-Device Compatibility:</strong> Stream perfectly on mobile, tablet, or desktop.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-2">Explore Genres</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><a href="/genre/drama" className="hover:text-white transition-colors">Premium Drama & Mystery</a></li>
                    <li><a href="/genre/comedy" className="hover:text-white transition-colors">Sitcoms & Comedy</a></li>
                    <li><a href="/genre/scifi-fantasy" className="hover:text-white transition-colors">Sci-Fi, Fantasy & Supernatural</a></li>
                    <li><a href="/genre/documentary" className="hover:text-white transition-colors">True Crime & Documentaries</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

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

export default function TvPage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Suspense fallback={<ThemedLoader theme="tv" />}>
        <TvDataFetcher />
      </Suspense>
    </div>
  );
}
