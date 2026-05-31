import Link from "next/link";
import Image from "next/image";
import { Media } from "@/types/tmdb";
import { getImageUrl } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import { Bookmark, Trash2, Heart, Play, Star } from "lucide-react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useFavorites } from "@/hooks/useFavorites";
import { usePreferences } from "@/hooks/usePreferences";

export function MediaCard({
  media,
  className,
  onRemove,
  variant = 'default',
}: {
  media: Media & { progress?: number; season?: number; episode?: number; contextType?: 'history' | 'watchlist' | 'favorites' };
  className?: string;
  onRemove?: (id: string, type: 'history' | 'watchlist' | 'favorites') => void;
  variant?: 'default' | 'top10';
}) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { preferences } = usePreferences();

  const title = media.title || media.name;
  const type = media.media_type || (media.name ? "tv" : "movie");
  const isMovie = type === "movie";
  const year = (media.release_date || media.first_air_date || "").substring(0, 4);
  const href = `/watch/${isMovie ? "movie" : "tv"}/${media.id}${
    !isMovie && media.season && media.episode ? `?season=${media.season}&episode=${media.episode}` : ""
  }`;
  const onWatchlist = isInWatchlist(media.id.toString());
  const onFavorites = isFavorite(media.id.toString());

  const handleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWatchlist({ id: media.id.toString(), type: type as any, title: title || '', poster: media.poster_path });
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite({ id: media.id.toString(), type: type as any, title: title || '', poster: media.poster_path });
  };

  return (
    <div className="relative group block">
      <Link href={href} className={cn("relative block", className)}>
        {/*
          Card container:
          - overflow-hidden clips the poster scale
          - NO hover:scale here — scaling the outer container causes all children
            to recomposite and breaks overflow clipping during scroll
          - will-change: transform promotes to a GPU layer ahead of time
        */}
        <div
          className="relative aspect-[2/3] rounded-xl overflow-hidden cursor-pointer"
          style={{ background: '#111111' }}
        >
          {/* Poster — scale on hover only (transform = compositor-only, no repaint) */}
          <Image
            src={getImageUrl(media.poster_path, "w500")}
            alt={title || "Poster"}
            fill
            className={cn(
              "object-cover transition-transform duration-300 ease-out",
              variant === 'top10'
                ? "group-hover:-translate-y-1.5 group-hover:scale-[1.04]"
                : "group-hover:scale-[1.05]"
            )}
            referrerPolicy="no-referrer"
          />

          {/*
            Dark overlay that fades in on hover.
            Uses opacity transition (compositor-only) instead of brightness filter.
            CSS filter: brightness() forces rasterisation and breaks compositing.
          */}
          <div
            className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            style={{
              background: variant === 'top10'
                ? 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)'
                : 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.1) 100%)',
            }}
          />

          {/* Play button — translate-based animation, compositor-only */}
          <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-250">
            <div
              className="translate-y-3 group-hover:translate-y-0 transition-transform duration-250"
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(229,9,20,0.9)',
                  boxShadow: '0 0 18px rgba(229,9,20,0.5)',
                }}
              >
                <Play size={18} className="fill-white text-white ml-0.5" />
              </div>
            </div>
          </div>

          {/*
            Quick action buttons — slide in from the right.
            - No backdrop-filter: it samples pixels behind the element on every frame
              during scroll. With 20+ cards per row, this destroys scroll performance.
            - Solid dark background achieves the same visual result at zero GPU cost.
            - transition-[opacity,transform] only, never transition-all.
          */}
          <div className="absolute top-2 right-2 z-30 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-[opacity,transform] duration-200">
            <button
              onClick={handleWatchlist}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-[background-color,border-color] duration-150 active:scale-90"
              style={{
                background: onWatchlist ? '#e50914' : 'rgba(0,0,0,0.82)',
                border: `1px solid ${onWatchlist ? '#e50914' : 'rgba(255,255,255,0.2)'}`,
                // No backdropFilter — see comment above
              }}
              title={onWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            >
              <Bookmark size={12} className={`text-white ${onWatchlist ? 'fill-white' : ''}`} />
            </button>
            <button
              onClick={handleFavorite}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-[background-color,border-color] duration-150 active:scale-90"
              style={{
                background: onFavorites ? '#ec4899' : 'rgba(0,0,0,0.82)',
                border: `1px solid ${onFavorites ? '#ec4899' : 'rgba(255,255,255,0.2)'}`,
                // No backdropFilter
              }}
              title={onFavorites ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Heart size={12} className={`text-white ${onFavorites ? 'fill-white' : ''}`} />
            </button>
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

      {/* Remove button (watch history) */}
      {onRemove && media.contextType === 'history' && (
        <button
          onClick={(e) => { e.preventDefault(); onRemove(media.id.toString(), media.contextType!); }}
          className="absolute -top-2 -right-2 z-40 w-6 h-6 bg-void-900 hover:bg-crimson-500 border border-white/10 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-[opacity,background-color] duration-200 hover:scale-110 shadow-xl"
          title="Remove from History"
        >
          <Trash2 size={11} />
        </button>
      )}

      {/* Title & metadata */}
      <div className="mt-3 px-1">
        <p className="text-[13px] md:text-[14px] font-bold text-white/90 group-hover:text-white transition-colors duration-200 line-clamp-1 leading-tight tracking-tight">
          {title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {preferences.showRatings && media.vote_average ? (
            <span className="text-yellow-500 text-[11px] font-black tracking-wider flex items-center gap-0.5">
              <Star size={10} className="fill-yellow-500" /> {media.vote_average.toFixed(1)}
            </span>
          ) : null}
          {year && (
            <>
              {preferences.showRatings && media.vote_average ? <span className="text-white/20 text-[10px]">•</span> : null}
              <span className="text-white/40 text-[11px] font-medium">{year}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
