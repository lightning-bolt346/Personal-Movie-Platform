'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MediaDetails } from '@/types/tmdb';
import { getImageUrl } from '@/lib/tmdb';
import { useAmbientColor } from '@/hooks/useAmbientColor';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useFavorites } from '@/hooks/useFavorites';
import { useNotifications } from '@/hooks/useNotifications';
import { TrailerModal } from '@/components/media/TrailerModal';
import {
  CalendarDays, Clock, Bell, BellOff, Bookmark, Heart, Video,
  MapPin, Tv, Film, Radio, Check
} from 'lucide-react';
import { storage } from '@/lib/storage';

// ─── Types ────────────────────────────────────────────────────────────────────

export type UpcomingReason =
  | 'movie_unreleased'           // Movie not yet in theatres / on OTT
  | 'show_fully_upcoming'        // Show not yet aired at all
  | 'show_new_season_upcoming'   // Show has ≥1 aired season, new season not aired
  | 'show_mid_season';           // Show airing now, next episode in a few days

export interface UpcomingMeta {
  reason: UpcomingReason;
  /** The exact release/air date string (ISO) for the upcoming content */
  releaseDate?: string;
  /** For mid-season: the next episode air date */
  nextEpisodeDate?: string;
  /** For new_season: the upcoming season number */
  upcomingSeason?: number;
  /** For mid-season: next episode number */
  nextEpisodeNumber?: number;
  /** Human-readable where it will release (In Theatres, OTT, Netflix…) */
  platform?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCountdown(dateStr: string): { days: number; label: string } {
  const target = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return { days: 0, label: 'Releasing today!' };
  if (days === 1) return { days: 1, label: 'Releases tomorrow' };
  if (days < 7) return { days, label: `Releases in ${days} days` };
  if (days < 30) return { days, label: `Releases in ${Math.ceil(days / 7)} week${Math.ceil(days / 7) > 1 ? 's' : ''}` };
  const months = Math.ceil(days / 30);
  return { days, label: `Releases in ~${months} month${months > 1 ? 's' : ''}` };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getReleaseTypeLabel(meta: UpcomingMeta, media: MediaDetails): string {
  if (meta.platform) return meta.platform;
  if (meta.reason === 'movie_unreleased') return 'In Theatres';
  if (meta.reason === 'show_fully_upcoming') return 'New Show';
  if (meta.reason === 'show_new_season_upcoming') return `Season ${meta.upcomingSeason}`;
  if (meta.reason === 'show_mid_season') return `Episode ${meta.nextEpisodeNumber}`;
  return '';
}

function getReleaseIcon(meta: UpcomingMeta) {
  if (meta.reason === 'movie_unreleased') return Film;
  if (meta.reason === 'show_fully_upcoming') return Tv;
  if (meta.reason === 'show_new_season_upcoming') return Tv;
  return Radio;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function UpcomingBanner({
  media,
  meta,
}: {
  media: MediaDetails;
  meta: UpcomingMeta;
}) {
  const title = media.title || media.name || '';
  const idStr = media.id.toString();
  const mediaType = media.media_type === 'tv' || media.name ? 'tv' : 'movie';

  const trailer = media.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const [trailerOpen, setTrailerOpen] = useState(false);

  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { hasNotification, toggleNotification } = useNotifications();

  const onWatchlist = isInWatchlist(idStr);
  const onFavorites = isFavorite(idStr);
  const hasReminder = hasNotification(idStr);

  const bgColor = useAmbientColor(getImageUrl(media.poster_path || media.backdrop_path, 'w500'));


  const toggleReminder = () => {
    toggleNotification({
      id: idStr,
      type: ('title' in media || (media as any).media_type === 'movie') ? 'movie' : 'tv',
      title,
      poster: media.poster_path,
      releaseDate: meta.nextEpisodeDate || meta.releaseDate,
    });
  };

  useEffect(() => {
    if (bgColor) document.documentElement.style.setProperty('--ambient-color', bgColor);
    return () => { document.documentElement.style.removeProperty('--ambient-color'); };
  }, [bgColor]);

  const targetDate = meta.reason === 'show_mid_season' ? meta.nextEpisodeDate : meta.releaseDate;
  const countdown = targetDate ? formatCountdown(targetDate) : null;
  const ReleaseIcon = getReleaseIcon(meta);

  // ── Headline copy based on state ──
  const headlineText = (() => {
    if (meta.reason === 'movie_unreleased') return 'Coming Soon';
    if (meta.reason === 'show_fully_upcoming') return 'New Show Arriving';
    if (meta.reason === 'show_new_season_upcoming')
      return `Season ${meta.upcomingSeason} Coming Soon`;
    if (meta.reason === 'show_mid_season')
      return `Episode ${meta.nextEpisodeNumber} Drops Soon`;
    return 'Coming Soon';
  })();

  return (
    <>
    <div className="relative w-full rounded-3xl overflow-hidden bg-void-950 border border-white/5 shadow-2xl mt-4 md:mt-0">
      {/* Ambient backlight */}
      <div
        className="absolute inset-0 blur-[100px] opacity-30 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: bgColor }}
      />
      
      {/* Backdrop overlay for texture */}
      {media.backdrop_path && (
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-screen">
          <Image
            src={getImageUrl(media.backdrop_path, 'original')}
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-950/80 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-void-950/80 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-12 p-6 md:p-10">
        
        {/* ── Left: Vertical Portrait Poster ── */}
        <div className="w-full md:w-[320px] shrink-0 mx-auto md:mx-0">
          <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
            <Image
              src={getImageUrl(media.poster_path || media.backdrop_path, 'w780', media.title || media.name, (media.release_date || media.first_air_date || '').substring(0, 4))}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            {/* "COMING SOON" ribbon on poster */}
            <div
              className="absolute top-4 left-4 right-4 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-2xl"
              style={{
                background: 'color-mix(in srgb, var(--brand-500) 90%, transparent)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Clock size={14} className="animate-pulse" />
              {headlineText}
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* ── Right: Info section ── */}
        <div className="flex-1 flex flex-col justify-center">
          
          {/* Big Countdown Pill */}
          {countdown && (
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 w-max border"
              style={{
                background: 'rgba(255,255,255,0.05)',
                borderColor: 'rgba(255,255,255,0.1)',
                boxShadow: `0 0 30px ${bgColor ? bgColor + '30' : 'rgba(255,255,255,0.05)'}`
              }}>
              <CalendarDays size={18} className="text-brand-500" />
              <span className="text-white font-bold tracking-wide">{countdown.label}</span>
              <span className="text-white/40 px-2">|</span>
              <span className="text-white/60 font-semibold text-sm">{formatDate(targetDate!)}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black leading-tight mb-4 text-white">
            {title}
          </h1>

          {/* Release info row */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-md text-xs font-bold text-white uppercase tracking-wider">
              <ReleaseIcon size={14} className="text-white/50" />
              {getReleaseTypeLabel(meta, media)}
            </div>

            {/* Genres */}
            {media.genres?.map((g: { id: number; name: string }) => (
              <span key={g.id} className="text-xs font-bold text-white/60 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-md">
                {g.name}
              </span>
            ))}
          </div>

          {/* Overview */}
          {media.overview && (
            <p className="text-zinc-300 text-base md:text-lg leading-relaxed max-w-3xl mb-8">
              {media.overview}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Remind Me button */}
              <button
                onClick={toggleReminder}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl sm:rounded-2xl font-bold uppercase tracking-wider text-xs sm:text-sm transition-colors shadow-lg active:scale-95 ${
                  hasReminder
                    ? 'bg-premium-gradient-dark hover:bg-premium-gradient text-white shadow-brand-500/30'
                    : 'bg-white/10 hover:bg-white/20 text-white shadow-black/20'
                }`}
              >
                {hasReminder ? <Check size={16} /> : <Bell size={16} />}
                {hasReminder ? 'Reminder Set' : 'Remind Me'}
              </button>

            {/* Trailer */}
            {trailer && (
              <button
                onClick={() => setTrailerOpen(true)}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white px-8 py-4 rounded-xl transition-all active:scale-95 font-bold uppercase tracking-widest text-sm"
              >
                <Video size={18} /> Watch Trailer
              </button>
            )}

            {/* Watchlist */}
            <button
              onClick={() => toggleWatchlist({ id: idStr, type: mediaType as any, title, poster: media.poster_path })}
              className={`flex items-center justify-center gap-2 border px-5 py-4 rounded-xl transition-all active:scale-95 font-bold uppercase tracking-widest text-xs ${
                onWatchlist
                  ? 'bg-brand-500/10 border-brand-500/30 text-brand-500'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70'
              }`}
            >
              <Bookmark size={16} className={onWatchlist ? 'fill-brand-500' : ''} />
            </button>
            
            {/* Favorite */}
            <button
              onClick={() => toggleFavorite({ id: idStr, type: mediaType as any, title, poster: media.poster_path })}
              className={`flex items-center justify-center gap-2 border px-5 py-4 rounded-xl transition-all active:scale-95 font-bold uppercase tracking-widest text-xs ${
                onFavorites
                  ? 'bg-pink-500/10 border-pink-500/30 text-pink-500'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70'
              }`}
            >
              <Heart size={16} className={onFavorites ? 'fill-pink-500' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mid-season "next episode" strip ── */}
      {meta.reason === 'show_mid_season' && meta.nextEpisodeDate && (
        <div
          className="mt-6 flex items-center gap-4 px-5 py-4 rounded-xl border"
          style={{
            background: 'color-mix(in srgb, var(--brand-500) 6%, transparent)',
            borderColor: 'color-mix(in srgb, var(--brand-500) 20%, transparent)',
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'color-mix(in srgb, var(--brand-500) 15%, transparent)' }}
          >
            <Radio size={18} className="text-brand-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">
              Episode {meta.nextEpisodeNumber} airs on {formatDate(meta.nextEpisodeDate)}
            </p>
            <p className="text-xs text-white/50 mt-0.5">
              New episodes releasing — come back after it airs to watch.
            </p>
          </div>
          <div className="ml-auto text-right shrink-0">
            <p className="text-lg font-black text-brand-500">{countdown?.days}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wide">days left</p>
          </div>
        </div>
      )}

      {/* ── New season info strip ── */}
      {meta.reason === 'show_new_season_upcoming' && meta.releaseDate && (
        <div
          className="mt-6 flex items-center gap-4 px-5 py-4 rounded-xl border"
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderColor: 'rgba(255,255,255,0.08)',
          }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-white/6">
            <Tv size={18} className="text-white/60" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">
              Season {meta.upcomingSeason} premieres {formatDate(meta.releaseDate)}
            </p>
            <p className="text-xs text-white/45 mt-0.5">
              Existing seasons are available to watch below.
            </p>
          </div>
        </div>
      )}
      </div>

      <TrailerModal isOpen={trailerOpen} onClose={() => setTrailerOpen(false)} videoKey={trailer?.key || null} />
    </>
  );
}
