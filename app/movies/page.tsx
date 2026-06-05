import { tmdb, getHeroItemsWithLogos } from '@/lib/tmdb';
import { JsonLd } from '@/components/seo/JsonLd';
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
  // Artificial delay to ensure loading animation is visible for at least 2 seconds as requested
  const fetchPromise = Promise.all([
    tmdb.getTrending('movie'),
    tmdb.getPopular('movie'),
    tmdb.getTopRated('movie'),
  ]);
  const delayPromise = new Promise(r => setTimeout(r, 2000));
  
  const [[trendingMovies, popMovies, topMovies]] = await Promise.all([
    fetchPromise,
    delayPromise
  ]);

  const top6Trending = trendingMovies.results?.slice(0, 6) || [];
  const heroItemsWithLogos = await getHeroItemsWithLogos(top6Trending);

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zivox-streaming.vercel.app';
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Watch Movies Free Online in HD — ZIVOX",
    "url": `${siteUrl}/movies`,
    "description": "Stream zivox online movie collections in HD without ads or registration. Watch free movies online, hindi dubbed movies watch online.",
  };

  return (
    <div className="flex flex-col min-h-screen pb-28 md:pb-20 bg-black -mt-[72px]">
      <JsonLd data={jsonLd} />
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
          title="🌟 Top Rated Movies"
          items={topMovies.results?.slice(0, 20) || []}
        />
        
        {/* Semantic SEO Block for Movies Page */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full mt-12 mb-8">
          <div className="bg-void-900/50 border border-zinc-800/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            <h2 className="text-xl md:text-2xl font-bold font-display text-white mb-4">Watch Free Movies Online in HD Without Registration</h2>
            <div className="prose prose-sm prose-invert max-w-none text-zinc-400 space-y-4">
              <p>
                Dive into the ultimate cinematic experience on ZIVOX. Our extensive movie collection allows you to <strong className="text-white">watch free movies online</strong> in crystal-clear HD and 4K quality. We believe that premium entertainment should be accessible to everyone, which is why ZIVOX requires no subscriptions, no credit cards, and absolutely no registration to start streaming.
              </p>
              <p>
                From the latest blockbuster hits and explosive action thrillers to heart-warming dramas, terrifying horror flicks, and critically acclaimed masterpieces, our library is updated daily. 
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-white font-bold text-base mb-2">Movie Streaming Features</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Instant Playback:</strong> Lightning-fast servers mean zero buffering.</li>
                    <li><strong>High Definition:</strong> Enjoy movies in 1080p and 4K UHD.</li>
                    <li><strong>Multi-Language Subs:</strong> Subtitles available in over 20 languages.</li>
                    <li><strong>Hindi Dubbed Movies:</strong> A massive selection of dual-audio and Hindi dubbed cinema.</li>
                  </ul>
                </div>
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
