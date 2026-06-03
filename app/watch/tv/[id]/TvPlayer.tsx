'use client';
import { useState, useEffect, Suspense, useCallback } from 'react';
import { MediaDetails } from '@/types/tmdb';
import { getImageUrl } from '@/lib/tmdb';
import { getSeasonDetailsAction } from '@/app/actions';
import { VideoPlayer } from '@/components/media/VideoPlayer';
import { ChevronDown, Play, Star, CheckCircle2, Circle, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useWatchHistory } from '@/hooks/useWatchHistory';
import { storage } from '@/lib/storage';
import { getLanguageName } from '@/lib/utils';

import { TrailerModal } from '@/components/media/TrailerModal';
import { CastSection } from '@/components/media/CastSection';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useFavorites } from '@/hooks/useFavorites';
import { Bookmark, Heart, Video } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { useAmbientColor } from '@/hooks/useAmbientColor';
import { YoutubeBackgroundPlayer } from '@/components/media/YoutubeBackgroundPlayer';

function TvPlayerContent({ show }: { show: MediaDetails }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [season, setSeason] = useState(parseInt(searchParams.get('season') || '1'));
  const [episode, setEpisode] = useState(parseInt(searchParams.get('episode') || '1'));
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { history, addToHistory } = useWatchHistory();
  const [isPlaying, setIsPlaying] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const trailer = show.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');

  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const idStr = show.id.toString();
  const onWatchlist = isInWatchlist(idStr);
  const onFavorites = isFavorite(idStr);

  useEffect(() => {
    getSeasonDetailsAction(show.id.toString(), season).then(data => {
      setEpisodes(data.episodes || []);
    });
  }, [show.id, season]);

  // If URL params change via back/forward, resync
  useEffect(() => {
    const s = searchParams.get('season');
    const e = searchParams.get('episode');
    if (s) setSeason(parseInt(s));
    if (e) setEpisode(parseInt(e));
  }, [searchParams]);

  const goToEpisode = useCallback((s: number, e: number) => {
    setSeason(s);
    setEpisode(e);
    setIsPlaying(true); // Auto-play when explicitly selecting episode
    router.replace(`/watch/tv/${show.id}?season=${s}&episode=${e}`, { scroll: false });
  }, [router, show.id]);

  const playNextEpisode = useCallback(() => {
    const currentEpIndex = episodes.findIndex(ep => ep.episode_number === episode);
    if (currentEpIndex >= 0 && currentEpIndex < episodes.length - 1) {
      const nextEp = episodes[currentEpIndex + 1];
      goToEpisode(season, nextEp.episode_number);
    } else if (currentEpIndex === episodes.length - 1) {
      const currentSeasonIndex = show.seasons?.findIndex(s => s.season_number === season) ?? -1;
      if (currentSeasonIndex >= 0 && currentSeasonIndex < (show.seasons?.length || 0) - 1) {
         const nextSeasonIndex = show.seasons![currentSeasonIndex + 1];
         if (nextSeasonIndex.season_number > 0) {
             goToEpisode(nextSeasonIndex.season_number, 1);
         }
      }
    }
  }, [episodes, episode, season, goToEpisode, show.seasons]);

  const handleProgress = useCallback((progress: number) => {
     // Nothing needed here if VideoPlayer handles autoPlay
  }, []);

  const hasNextEpisode = () => {
    const currentEpIndex = episodes.findIndex(ep => ep.episode_number === episode);
    if (currentEpIndex >= 0 && currentEpIndex < episodes.length - 1) return true;
    if (currentEpIndex === episodes.length - 1) {
      const currentSeasonIndex = show.seasons?.findIndex(s => s.season_number === season) ?? -1;
      if (currentSeasonIndex >= 0 && currentSeasonIndex < (show.seasons?.length || 0) - 1) {
         const nextSeasonIndex = show.seasons![currentSeasonIndex + 1];
         if (nextSeasonIndex.season_number > 0) return true;
      }
    }
    return false;
  };

  const toggleWatched = (ep: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const isWatched = history.some(i => i.id === show.id.toString() && i.season === season && i.episode === ep.episode_number && (i.progress || 0) >= 95);
    
    addToHistory({
      id: show.id.toString(),
      type: 'tv',
      title: show.name || '',
      poster: show.poster_path,
      timestamp: Date.now(),
      season,
      episode: ep.episode_number,
      progress: isWatched ? 0 : 100 // Toggle 100% vs 0%
    });
  };

  const currentSeason = show.seasons?.find(s => s.season_number === season);

  const watchItem = history.find(i => i.id === show.id.toString() && i.season === season && i.episode === episode);
  const progress = watchItem?.progress || 0;
  const isWatched = progress >= 95;
  const continueWatching = progress > 0 && !isWatched;

  const bgColor = useAmbientColor(getImageUrl(show.poster_path || show.backdrop_path, 'w500'));

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
          className="fixed top-20 left-4 md:top-24 md:left-6 z-[200] flex items-center gap-2 px-4 py-2 rounded-full font-bold tracking-widest text-xs uppercase shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 border backdrop-blur-md"
          style={{
            backgroundColor: `color-mix(in srgb, ${bgColor} 15%, rgba(5,5,5,0.85))`,
            borderColor: `color-mix(in srgb, ${bgColor} 40%, transparent)`,
            color: 'white'
          }}
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
      </div>
      <div className={`flex gap-8 transition-all duration-500 ${isPlaying ? 'flex-col items-center justify-center' : 'flex-col xl:flex-row'}`}>
        <div className={`flex flex-col gap-6 w-full ${isPlaying ? 'xl:w-full' : 'flex-1'}`}>
          <div className="relative w-full max-w-5xl mx-auto">
            {/* Ambient Backlight */}
            <div 
              className="absolute inset-[-5%] blur-[80px] opacity-100 transition-colors duration-1000 ease-in-out pointer-events-none" 
              style={{ backgroundColor: bgColor }} 
            />
            
            <div className={`relative w-full rounded-2xl overflow-hidden border border-zinc-800 bg-void-950 group ${!isPlaying ? 'aspect-video md:aspect-[2.39/1] max-h-[520px]' : 'min-h-[300px] flex flex-col'}`}>
            {!isPlaying ? (
              <div className="absolute inset-0 z-10">
                <YoutubeBackgroundPlayer 
                  videoKey={trailer?.key || null} 
                  backdropPath={show.backdrop_path || show.poster_path} 
                  title={show.name || ''} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-950/20 to-transparent pointer-events-none" />
              </div>
            ) : (
              <VideoPlayer 
                  type="tv" 
                  id={show.id.toString()} 
                  season={season} 
                  episode={episode} 
                  title={show.name} 
                  poster={show.poster_path} 
                  onProgress={handleProgress} 
                  onPlayNext={playNextEpisode}
                  hasNextEpisode={hasNextEpisode()}
              />
            )}
          </div>
          </div>
          
          <div className={`flex flex-col gap-6 transition-all duration-500 origin-top ${isPlaying ? 'scale-y-0 h-0 opacity-0 overflow-hidden m-0' : 'scale-y-100 opacity-100'}`}>
            <div className="flex flex-col md:flex-row md:items-start justify-between flex-wrap gap-6">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black leading-tight mb-2">
                  {show.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-zinc-400">
                  <span className="text-green-500 font-bold">{(show.vote_average * 10).toFixed(0)}% Match</span>
                  <span>{show.first_air_date?.substring(0, 4)}</span>
                  <span>{show.number_of_seasons} Seasons</span>
                  {show.original_language && <span className="border border-zinc-700 bg-void-900 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold text-zinc-300">{getLanguageName(show.original_language)}</span>}
                  <span className="border border-zinc-700 bg-void-900 px-1.5 py-0.5 rounded text-[10px] uppercase">HD</span>
                  {show.episode_run_time?.[0] ? <span>~{show.episode_run_time[0]}m per EP</span> : null}
                  {show.status && <span className="border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 rounded text-[10px] uppercase">{show.status}</span>}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {show.genres?.map((g: any) => (
                    <span key={g.id} className="text-xs font-medium text-zinc-300 bg-void-900 border border-zinc-800 px-2 py-1 rounded-md">{g.name}</span>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-3 min-w-[200px] shrink-0">
                {!isPlaying && (
                  <button 
                    onClick={() => setIsPlaying(true)}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all active:scale-95 font-bold uppercase tracking-wider text-sm shadow-xl ${
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
                    onClick={() => toggleWatchlist({ id: idStr, type: 'tv', title: show.name || '', poster: show.poster_path })}
                    className={`flex items-center justify-center gap-1.5 border px-3 py-2.5 rounded-xl transition-all active:scale-95 font-bold uppercase tracking-wider text-[10px] ${onWatchlist ? 'bg-crimson-500/10 border-crimson-500/20 text-crimson-500' : 'bg-void-900 border-zinc-800 hover:bg-void-800 text-zinc-300'}`}
                  >
                    <Bookmark size={14} className={onWatchlist ? 'fill-crimson-500' : ''} /> {onWatchlist ? 'Watchlisted' : 'Watchlist'}
                  </button>
                  <button
                    onClick={() => toggleFavorite({ id: idStr, type: 'tv', title: show.name || '', poster: show.poster_path })}
                    className={`flex items-center justify-center gap-1.5 border px-3 py-2.5 rounded-xl transition-all active:scale-95 font-bold uppercase tracking-wider text-[10px] ${onFavorites ? 'bg-pink-500/10 border-pink-500/20 text-pink-500' : 'bg-void-900 border-zinc-800 hover:bg-void-800 text-zinc-300'}`}
                  >
                    <Heart size={14} className={onFavorites ? 'fill-pink-500' : ''} /> {onFavorites ? 'Favorited' : 'Favorite'}
                  </button>
                </div>
              </div>
            </div>
            
            <p className="text-zinc-300 text-lg leading-relaxed max-w-4xl">{show.overview}</p>
          </div>
        </div>
        
        <div className={`w-full flex flex-col gap-4 transition-all duration-500 delay-100 ${isPlaying ? 'xl:w-full max-w-5xl mx-auto' : 'xl:w-96'}`}>
          <div className="relative z-50">
            <Select 
              value={season}
              onChange={(val) => { setSeason(val as number); setEpisode(1); }}
              options={show.seasons?.filter(s => s.season_number > 0 && s.episode_count > 0).map(s => ({
                label: s.name,
                value: s.season_number,
                description: `(${s.episode_count} Episodes)`
              })) || []}
            />
          </div>
          
          <div className="bg-void-950 rounded-xl border border-zinc-800 overflow-hidden flex flex-col max-h-[600px] shadow-lg">
            <div className="p-4 border-b border-zinc-800">
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Episodes</h3>
            </div>
            <div data-lenis-prevent="true" className="overflow-y-auto flex-1 custom-scrollbar">
              {episodes.map(ep => {
                const isActive = ep.episode_number === episode;
                const epState = history.find(i => i.id === show.id.toString() && i.season === season && i.episode === ep.episode_number);
                const epProgress = epState?.progress || 0;
                const isWatched = epProgress >= 95;
                return (
                  <div
                    key={ep.id}
                    onClick={() => goToEpisode(season, ep.episode_number)}
                    role="button"
                    tabIndex={0}
                    className={`w-full flex flex-col gap-3 p-3 text-left transition-colors border-b border-zinc-800/50 last:border-0 relative overflow-hidden group cursor-pointer ${isActive ? 'bg-zinc-900/50' : 'hover:bg-zinc-900/30'}`}
                  >
                    <div className="flex gap-3">
                      <div className="relative w-32 aspect-video bg-void-950 rounded overflow-hidden flex-shrink-0 border border-zinc-800">
                        <Image src={getImageUrl(ep.still_path, 'w500')} alt={ep.name} fill sizes="128px" className="object-cover opacity-80" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Play size={16} className={isActive ? "text-crimson-500 fill-crimson-500" : "text-white opacity-0 group-hover:opacity-100 transition-opacity"} />
                        </div>
                        {epProgress > 0 && !isWatched && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-900 opacity-80">
                            <div className="h-full bg-crimson-500" style={{ width: `${Math.min(100, Math.max(0, epProgress))}%` }} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 py-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <h4 className={`text-xs font-semibold truncate pr-2 ${isActive ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                            {ep.episode_number}. {ep.name}
                          </h4>
                          <button onClick={(e) => toggleWatched(ep, e)} className="text-zinc-500 hover:text-white transition-colors" title={isWatched ? "Mark Unwatched" : "Mark Watched"}>
                            {isWatched ? <CheckCircle2 size={16} className="text-crimson-500" /> : <Circle size={16} />}
                          </button>
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-1 line-clamp-2 flex-1">{ep.overview}</p>
                        {ep.vote_average > 0 && (
                          <div className="flex items-center gap-1 mt-1 text-[10px] font-medium text-zinc-400">
                            <Star size={10} className="text-yellow-500 fill-yellow-500" /> {ep.vote_average.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <div className={`w-full transition-all duration-500 origin-top ${isPlaying ? 'scale-y-0 h-0 opacity-0 overflow-hidden' : 'scale-y-100 opacity-100'}`}>
        <CastSection cast={show.credits?.cast} crew={show.credits?.crew} createdBy={show.created_by} />
      </div>

      <TrailerModal isOpen={trailerOpen} onClose={() => setTrailerOpen(false)} videoKey={trailer?.key || null} />
    </div>
  );
}

export function TvPlayer({ show }: { show: MediaDetails }) {
  return (
    <Suspense fallback={<div className="h-96 w-full max-w-3xl mx-auto rounded-3xl bg-void-900 animate-pulse border border-zinc-800" />}>
      <TvPlayerContent show={show} />
    </Suspense>
  )
}
