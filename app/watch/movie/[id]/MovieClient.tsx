'use client';
import { useState, useEffect } from 'react';
import { MediaDetails } from '@/types/tmdb';
import { VideoPlayer } from '@/components/media/VideoPlayer';
import { TrailerModal } from '@/components/media/TrailerModal';
import { CastSection } from '@/components/media/CastSection';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useFavorites } from '@/hooks/useFavorites';
import { useRouter } from 'next/navigation';
import { Bookmark, Heart, Play, PlayCircle, Video, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/tmdb';
import { useWatchHistory } from '@/hooks/useWatchHistory';
import { getLanguageName } from '@/lib/utils';
import { useAmbientColor } from '@/hooks/useAmbientColor';
import { YoutubeBackgroundPlayer } from '@/components/media/YoutubeBackgroundPlayer';

export function MovieClient({ movie }: { movie: MediaDetails }) {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const trailer = movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');

  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { history } = useWatchHistory();
  const idStr = movie.id.toString();
  const onWatchlist = isInWatchlist(idStr);
  const onFavorites = isFavorite(idStr);

  const watchItem = history.find(i => i.id === idStr);
  const progress = watchItem?.progress || 0;
  const isWatched = progress >= 95;
  const continueWatching = progress > 0 && !isWatched;

  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '';

  const bgColor = useAmbientColor(getImageUrl(movie.poster_path || movie.backdrop_path, 'w500'));

  useEffect(() => {
    if (bgColor) {
      document.documentElement.style.setProperty('--ambient-color', bgColor);
    }
    return () => {
      document.documentElement.style.removeProperty('--ambient-color');
    };
  }, [bgColor]);

  return (
    <div className="flex flex-col gap-12 w-full max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Fixed Back Button */}
        <button 
          onClick={() => isPlaying ? setIsPlaying(false) : router.back()} 
          className="fixed top-14 left-4 md:left-6 z-[200] flex items-center gap-2 px-4 py-2 rounded-full font-bold tracking-widest text-xs uppercase shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 border backdrop-blur-md"
          style={{
            backgroundColor: `color-mix(in srgb, ${bgColor} 15%, rgba(5,5,5,0.85))`,
            borderColor: `color-mix(in srgb, ${bgColor} 40%, transparent)`,
            color: 'white'
          }}
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
        
        <div className="flex-1 flex flex-col gap-6">
          <div className="relative w-full max-w-5xl mx-auto">
            {/* Ambient Backlight */}
            <div 
              className="absolute inset-[-5%] blur-[80px] opacity-100 transition-colors duration-1000 ease-in-out pointer-events-none" 
              style={{ backgroundColor: bgColor }} 
            />
            
            <div className={`relative w-full rounded-2xl overflow-hidden border border-zinc-800 bg-void-950 group ${!isPlaying ? 'aspect-video md:aspect-[2.39/1] max-h-[520px] cursor-pointer' : 'min-h-[300px] flex flex-col'}`}
              onClick={() => !isPlaying && setIsPlaying(true)}
            >
            {!isPlaying ? (
              <div className="absolute inset-0 z-10">
                <YoutubeBackgroundPlayer 
                  videoKey={trailer?.key || null} 
                  backdropPath={movie.backdrop_path || movie.poster_path} 
                  title={movie.title || ''} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-950/20 to-transparent pointer-events-none" />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:opacity-100 opacity-80 shadow-2xl"
                    style={{
                      background: `radial-gradient(circle, ${bgColor || 'rgba(229,9,20,0.9)'} 0%, rgba(0,0,0,0.7) 100%)`,
                      boxShadow: `0 0 40px 10px ${bgColor || 'rgba(229,9,20,0.3)'}`,
                    }}
                  >
                    <Play size={28} fill="white" className="text-white ml-1" />
                  </div>
                </div>
              </div>
            ) : (
              <VideoPlayer type="movie" id={movie.id.toString()} title={movie.title} poster={movie.poster_path} />
            )}
          </div>
          </div>
          
          <div className={`flex flex-col gap-6 transition-all duration-500 ease-in-out origin-top ${isPlaying ? 'scale-y-0 h-0 opacity-0 overflow-hidden mt-0' : 'scale-y-100 opacity-100'}`}>
            <div className="flex flex-col md:flex-row md:items-start justify-between flex-wrap gap-6">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black leading-tight mb-2">
                  {movie.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-zinc-400">
                  <span className="text-green-500 font-bold">{(movie.vote_average * 10).toFixed(0)}% Match</span>
                  <span>{movie.release_date?.substring(0, 4)}</span>
                  <span>{runtime}</span>
                  {movie.original_language && <span className="border border-zinc-700 bg-void-900 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold text-zinc-300">{getLanguageName(movie.original_language)}</span>}
                  <span className="border border-zinc-700 bg-void-900 px-1.5 py-0.5 rounded text-[10px] uppercase">HD</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {movie.genres?.map((g: { id: number, name: string }) => (
                    <span key={g.id} className="text-xs font-medium text-zinc-300 bg-void-900 border border-zinc-800 px-2 py-1 rounded-md">{g.name}</span>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-3 min-w-[200px] shrink-0">
                {!isPlaying && (
                  <button 
                    onClick={() => setIsPlaying(true)}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all font-bold uppercase tracking-wider text-sm shadow-xl active:scale-95 ${
                      continueWatching 
                        ? 'bg-crimson-500 hover:bg-crimson-600 text-white shadow-crimson-500/20' 
                        : 'bg-white hover:bg-gray-200 text-black shadow-white/10'
                    }`}
                  >
                    <Play fill="currentColor" size={20} />
                    {continueWatching ? 'Continue Watching' : 'Play'}
                  </button>
                )}
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {trailer && (
                    <button
                       onClick={() => setTrailerOpen(true)}
                      className="col-span-2 flex items-center justify-center gap-2 bg-void-900 hover:bg-void-800 border border-zinc-800 text-white px-4 py-2.5 rounded-xl transition-all active:scale-95 font-bold uppercase tracking-wider text-xs"
                    >
                      <Video size={16} /> Watch Trailer
                    </button>
                  )}
                  <button
                    onClick={() => toggleWatchlist({ id: idStr, type: 'movie', title: movie.title || '', poster: movie.poster_path })}
                    className={`flex items-center justify-center gap-1.5 border px-3 py-2.5 rounded-xl transition-all active:scale-95 font-bold uppercase tracking-wider text-[10px] ${onWatchlist ? 'bg-crimson-500/10 border-crimson-500/20 text-crimson-500' : 'bg-void-900 border-zinc-800 hover:bg-void-800 text-zinc-300'}`}
                  >
                    <Bookmark size={14} className={onWatchlist ? 'fill-crimson-500' : ''} /> {onWatchlist ? 'Watchlisted' : 'Watchlist'}
                  </button>
                  <button
                    onClick={() => toggleFavorite({ id: idStr, type: 'movie', title: movie.title || '', poster: movie.poster_path })}
                    className={`flex items-center justify-center gap-1.5 border px-3 py-2.5 rounded-xl transition-all active:scale-95 font-bold uppercase tracking-wider text-[10px] ${onFavorites ? 'bg-pink-500/10 border-pink-500/20 text-pink-500' : 'bg-void-900 border-zinc-800 hover:bg-void-800 text-zinc-300'}`}
                  >
                    <Heart size={14} className={onFavorites ? 'fill-pink-500' : ''} /> {onFavorites ? 'Favorited' : 'Favorite'}
                  </button>
                </div>
              </div>
            </div>
            
            <p className="text-zinc-300 text-lg leading-relaxed max-w-4xl">{movie.overview}</p>
          </div>
        </div>
      </div>
      
      <div className={`w-full transition-all duration-500 origin-top ${isPlaying ? 'scale-y-0 h-0 opacity-0 overflow-hidden' : 'scale-y-100 opacity-100'}`}>
        <CastSection cast={movie.credits?.cast} crew={movie.credits?.crew} />
      </div>

      <TrailerModal isOpen={trailerOpen} onClose={() => setTrailerOpen(false)} videoKey={trailer?.key || null} />
    </div>
  );
}
