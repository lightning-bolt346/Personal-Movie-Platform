'use client';
import { useState, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Media } from "@/types/tmdb";
import { getImageUrl } from "@/lib/tmdb";
import { cn, generateSlug } from "@/lib/utils";
import { Bookmark, Trash2, Heart, Play, Star, Plus, Check, ArrowRight, Bell, BellOff } from "lucide-react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useFavorites } from "@/hooks/useFavorites";
import { usePreferences } from "@/hooks/usePreferences";
import { useNotifications } from "@/hooks/useNotifications";
import { useRouter } from "next/navigation";

export const MediaCard = memo(function MediaCard({
  media,
  className,
  onRemove,
  variant = 'default',
  isUpcoming = false,
}: {
  media: Media & { progress?: number; season?: number; episode?: number; contextType?: 'history' | 'watchlist' | 'favorites' | 'notifications' };
  className?: string;
  onRemove?: (id: string, type: 'history' | 'watchlist' | 'favorites' | 'notifications') => void;
  variant?: 'default' | 'top10';
  isUpcoming?: boolean;
}) {
  const router = useRouter();
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { preferences } = usePreferences();
  const { hasNotification, toggleNotification } = useNotifications();

  const title = media.title || media.name;
  const type = media.media_type || (media.name ? "tv" : "movie");
  const isMovie = type === "movie";
  const year = (media.release_date || media.first_air_date || "").substring(0, 4);
  const href = `/watch/${isMovie ? "movie" : "tv"}/${generateSlug(media.id.toString(), title)}${
    !isMovie && media.season && media.episode ? `?season=${media.season}&episode=${media.episode}` : ""
  }`;
  const onWatchlist = isInWatchlist(media.id.toString());
  const onFavorites = isFavorite(media.id.toString());

  const handleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist({ id: media.id.toString(), type: type as any, title: title || '', poster: media.poster_path });
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({ id: media.id.toString(), type: type as any, title: title || '', poster: media.poster_path });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (window.innerWidth < 768) {
      if (!isMobileExpanded) {
        e.preventDefault();
        setIsMobileExpanded(true);
      }
    }
  };

  const toggleReminder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleNotification({
      id: media.id.toString(),
      type: type as 'movie'|'tv',
      title: title || '',
      poster: media.poster_path,
      releaseDate: media.release_date || media.first_air_date
    });
  };

  const isReminded = hasNotification(media.id.toString());

  const handleReminderClick = (e: React.MouseEvent) => {
    toggleReminder(e);
  };

  return (
    <div className="relative group block" onMouseLeave={() => setIsMobileExpanded(false)}>
      <Link href={href} className={cn("relative block", className)} onClick={handleCardClick}>
        <div
          className="relative aspect-[2/3] rounded-xl overflow-hidden cursor-pointer will-change-transform"
          style={{
            background: 'linear-gradient(135deg, #0d0d0f 0%, #141418 40%, #0d0d0f 100%)',
          }}
        >
          {/* Shimmer skeleton shown while poster loads */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite linear',
            }}
          />
          {/* Poster */}
          <Image
            src={getImageUrl(media.poster_path, "w500", title, year)}
            alt={title || "Poster"}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 15vw"
            className={cn(
              "object-cover transition-transform duration-300 ease-out",
              variant === 'top10'
                ? "group-hover:-translate-y-1.5 group-hover:scale-[1.04]"
                : "group-hover:scale-[1.05]"
            )}
            referrerPolicy="no-referrer"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAYAAABLLYUHAAAAGklEQVQI12NgYGD4z8BQDwAEgAF/QualIQAAAABJRU5ErkJggg=="
          />

          {/* Top Left Badges */}
          <div className="absolute top-2 left-2 z-20 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden md:flex">
             {preferences.showRatings && media.vote_average ? (
               <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md border border-white/10 px-2 py-1 rounded-md shadow-lg">
                 <Star size={10} className="text-yellow-400 fill-yellow-400" />
                 <span className="text-white text-[10px] font-bold">{media.vote_average.toFixed(1)}</span>
               </div>
             ) : null}
          </div>

          {/* Desktop Hover Overlay */}
          <div
            className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 hidden md:flex flex-col justify-end p-3.5 z-10"
            style={{
              background: variant === 'top10'
                ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)'
                : 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
            }}
          >
            <h3 className="text-white font-bold text-[14px] leading-tight truncate drop-shadow-md">{title}</h3>
            <p className="text-white/60 font-semibold text-[11px] mt-0.5 drop-shadow-md">{year} • {isMovie ? 'Movie' : 'Series'}</p>
          </div>

          {/* Desktop Play Button */}
          <div className="absolute inset-0 z-20 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-250">
            <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-250">
              {!isUpcoming && (
                <div className="w-12 h-12 bg-black/60 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-md">
                  <Play size={20} className="text-white fill-white ml-1" />
                </div>
              )}
            </div>
          </div>

          {/* Desktop Quick Actions */}
          <div className="absolute top-2 right-2 z-30 flex-col gap-1.5 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-[opacity,transform] duration-200 hidden md:flex">
            <button
              onClick={handleWatchlist}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-[background-color,border-color] duration-150 active:scale-90 shadow-lg"
              style={{
                background: onWatchlist ? '#e50914' : 'rgba(0,0,0,0.82)',
                border: `1px solid ${onWatchlist ? '#e50914' : 'rgba(255,255,255,0.2)'}`,
              }}
              title={onWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            >
              <Bookmark size={12} className={`text-white ${onWatchlist ? 'fill-white' : ''}`} />
            </button>
            {isUpcoming && (
              <button
                onClick={handleReminderClick}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-[background-color,border-color] duration-150 active:scale-90 shadow-lg"
                style={{
                  background: isReminded ? '#e50914' : 'rgba(0,0,0,0.82)',
                  border: `1px solid ${isReminded ? '#e50914' : 'rgba(255,255,255,0.2)'}`,
                }}
                title={isReminded ? "Remove Reminder" : "Set Reminder"}
              >
                {isReminded ? <BellOff size={12} className="text-white" /> : <Bell size={12} className="text-white" />}
              </button>
            )}
            {(media.contextType === 'history' || media.contextType === 'favorites') && (
              <button
                onClick={handleFavorite}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-[background-color,border-color] duration-150 active:scale-90 shadow-lg"
                style={{
                  background: onFavorites ? '#ec4899' : 'rgba(0,0,0,0.82)',
                  border: `1px solid ${onFavorites ? '#ec4899' : 'rgba(255,255,255,0.2)'}`,
                }}
                title={onFavorites ? "Remove from Favorites" : "Add to Favorites"}
              >
                <Heart size={12} className={`text-white ${onFavorites ? 'fill-white' : ''}`} />
              </button>
            )}
          </div>

          {/* MOBILE EXPANDED OVERLAY */}
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/30 transition-opacity duration-300 md:hidden z-50 flex flex-col justify-between ${
              isMobileExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
             <div className="flex justify-end p-2 gap-1.5">
                <button 
                  className="w-8 h-8 bg-black/50 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm active:scale-90 transition-transform pointer-events-auto" 
                  onClick={handleWatchlist}
                >
                   {onWatchlist ? <Check size={14} className="text-white"/> : <Plus size={14} className="text-white" />}
                </button>
                {isUpcoming && (
                  <button
                    className="w-8 h-8 bg-black/50 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm active:scale-90 transition-transform pointer-events-auto"
                    onClick={handleReminderClick}
                  >
                    {isReminded ? <BellOff size={14} className="text-white"/> : <Bell size={14} className="text-white" />}
                  </button>
                )}
                {(media.contextType === 'history' || media.contextType === 'favorites') && (
                  <button
                    onClick={handleFavorite}
                    className="w-8 h-8 bg-black/50 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm active:scale-90 transition-transform pointer-events-auto"
                  >
                    <Heart size={14} className={`text-white ${onFavorites ? 'fill-white' : ''}`} />
                  </button>
                )}
             </div>
             
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 {!isUpcoming && (
                   <div className="w-12 h-12 bg-black/60 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-md">
                       <Play size={20} className="text-white fill-white ml-1" />
                   </div>
                 )}
             </div>

             <div className="p-3 mt-auto relative z-10 pointer-events-none">
                <h3 className="text-white font-bold text-[13px] leading-tight truncate drop-shadow-md">{title}</h3>
                <p className="text-white/60 font-semibold text-[11px] mt-0.5 drop-shadow-md">{year} • {isMovie ? 'Movie' : 'Series'}</p>
             </div>
          </div>

          {/* Progress bar */}
          {media.progress !== undefined && media.progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 z-30">
              <div
                className="h-full rounded-r-full"
                style={{
                  width: `${Math.min(100, Math.max(0, media.progress))}%`,
                  background: 'linear-gradient(to right, #e50914, #ff3d47)',
                  boxShadow: '0 0 8px rgba(229,9,20,0.5)',
                }}
              />
            </div>
          )}
        </div>
      </Link>

      {/* Remove button (history / notifications) */}
      {onRemove && (media.contextType === 'history' || media.contextType === 'notifications') && (
        <button
          onClick={(e) => { e.preventDefault(); onRemove(media.id.toString(), media.contextType!); }}
          className="absolute -top-2 -right-2 z-40 w-6 h-6 bg-void-900 hover:bg-crimson-500 border border-white/10 text-white rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-[opacity,background-color] duration-200 hover:scale-110 shadow-xl"
          title={`Remove from ${media.contextType === 'history' ? 'History' : 'Notifications'}`}
        >
          <Trash2 size={11} />
        </button>
      )}

  </div>
  );
});
