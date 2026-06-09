import { discoverMedia } from '@/app/actions';
import { MediaCard } from '@/components/media/MediaCard';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { ArrowLeft, Sparkles, Film, Tv } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 86400; // Cache for 24 hours

const MOODS = [
  { slug: 'need-a-laugh', label: 'Need a Laugh', genreId: 35, image: '/lgotja3xMoJZbynwHfcQcJAEMWH.jpg', color: '#f59e0b', description: 'Handpicked comedies guaranteed to boost your serotonin levels.' },
  { slug: 'terrify-me', label: 'Terrify Me', genreId: 27, image: '/vh7np635kDIcfO6x2Y9ElgLJsuI.jpg', color: '#7c3aed', description: 'Keep the lights on. The most chilling horror films and series.' },
  { slug: 'make-me-cry', label: 'Make Me Cry', genreId: 18, image: '/zfbjgQE1uSd9wiPTX4VzsLi0rGG.jpg', color: '#ec4899', description: 'Emotional masterworks that will tug at your heartstrings.' },
  { slug: 'mind-bending', label: 'Mind-Bending', genreId: 878, image: '/2I1OFQJ0L9T0dpU6FobKFWV2PxX.jpg', color: '#06b6d4', description: 'Sci-Fi and psychological thrillers that will make you question reality.' },
  { slug: 'romantic', label: 'Romantic', genreId: 10749, image: '/xnHVX37XZEp33hhCbYlQFq7ux1J.jpg', color: '#e50914', description: 'Epic love stories and feel-good rom-coms for date night.' },
  { slug: 'adrenaline', label: 'Adrenaline', genreId: 28, image: '/6zg7A9ICOthNR2TSXlT51KvXrsA.jpg', color: '#ef4444', description: 'Explosive action and high-stakes adventures.' },
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const mood = MOODS.find(m => m.slug === resolvedParams.slug);
  if (!mood) return { title: 'Mood Not Found' };
  
  return {
    title: `${mood.label} Movies & Shows`,
    description: mood.description,
  };
}

export default async function MoodPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const mood = MOODS.find(m => m.slug === resolvedParams.slug);
  
  if (!mood) {
    notFound();
  }

  // Fetch best movies and tv shows concurrently
  const [moviesRes, tvRes] = await Promise.all([
    discoverMedia('movie', {
      with_genres: mood.genreId.toString(),
      sort_by: 'popularity.desc',
      'vote_count.gte': '1000', // Ensure high quality
      page: '1'
    }),
    discoverMedia('tv', {
      with_genres: mood.genreId.toString(),
      sort_by: 'popularity.desc',
      'vote_count.gte': '500',
      page: '1'
    })
  ]);

  const movies = moviesRes.results?.slice(0, 12).map(m => ({ ...m, media_type: 'movie' })) || [];
  const shows = tvRes.results?.slice(0, 12).map(t => ({ ...t, media_type: 'tv' })) || [];

  return (
    <div className="relative min-h-screen bg-void-950 pb-20">
      <AnimatedBackground />
      
      {/* Dynamic Hero Header */}
      <div className="relative h-[40vh] min-h-[400px] w-full flex flex-col justify-end p-8 md:p-16 overflow-hidden">
        {/* Background Image with Parallax-like effect */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w1280${mood.image})` }}
        />
        {/* Gradients */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-void-950 via-void-950/80 to-transparent" />
        <div 
          className="absolute inset-0 z-0 opacity-40 mix-blend-overlay"
          style={{ background: `radial-gradient(circle at 70% 30%, ${mood.color}, transparent 60%)` }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <Link href="/discover" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm font-bold tracking-wide uppercase">
            <ArrowLeft size={16} /> Back to Discover
          </Link>
          
          <h1 className="text-5xl md:text-7xl font-display font-black text-white drop-shadow-2xl mb-4 tracking-tighter" style={{ textShadow: `0 0 40px ${mood.color}80` }}>
            {mood.label}
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl font-medium leading-relaxed">
            {mood.description}
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 -mt-12 space-y-16">
        
        {/* Top Movies */}
        {movies.length > 0 && (
          <section className="bg-void-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white flex items-center gap-3">
                <div className="p-2 rounded-xl bg-brand-500/20 text-brand-500">
                  <Film size={24} />
                </div>
                Essential Movies
              </h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movies.map((item, i) => (
                <div key={item.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}>
                  <MediaCard media={item as any} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Top Shows */}
        {shows.length > 0 && (
          <section className="bg-void-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white flex items-center gap-3">
                <div className="p-2 rounded-xl bg-brand-500/20 text-brand-500">
                  <Tv size={24} />
                </div>
                Binge-Worthy Series
              </h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {shows.map((item, i) => (
                <div key={item.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}>
                  <MediaCard media={item as any} />
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
