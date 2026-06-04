"use client";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useFavorites } from "@/hooks/useFavorites";
import { useNotifications } from "@/hooks/useNotifications";
import { MediaGrid } from "@/components/media/MediaGrid";
import { Trash2, User, Heart, Bell } from "lucide-react";
import Link from "next/link";
import { Media } from "@/types/tmdb";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

export default function ProfilePage() {
  const { history, clearHistory, removeFromHistory } = useWatchHistory();
  const { watchlist, toggleWatchlist } = useWatchlist();
  const { favorites, toggleFavorite } = useFavorites();
  const { notifications, toggleNotification } = useNotifications();

  const handleRemove = (id: string, type: 'history'|'watchlist'|'favorites'|'notifications') => {
    if (type === 'history') {
      removeFromHistory(id);
    } else if (type === 'watchlist') {
      const item = watchlist.find(i => i.id.toString() === id);
      if (item) toggleWatchlist({ id: item.id.toString(), type: item.type, title: item.title, poster: item.poster });
    } else if (type === 'favorites') {
      const item = favorites.find(i => i.id.toString() === id);
      if (item) toggleFavorite({ id: item.id.toString(), type: item.type, title: item.title, poster: item.poster });
    } else if (type === 'notifications') {
      const item = notifications.find(i => i.id.toString() === id);
      if (item) toggleNotification({ id: item.id.toString(), type: item.type, title: item.title, poster: item.poster });
    }
  };

  // Convert history items to Media format for MediaGrid
  const historyMedia = history.map((item) => ({
    ...item,
    media_type: item.type,
    poster_path: item.poster,
    contextType: 'history',
  })) as unknown as Media[];

  const watchlistMedia = watchlist.map((item) => ({
    ...item,
    media_type: item.type,
    poster_path: item.poster,
    contextType: 'watchlist',
  })) as unknown as Media[];

  const favoritesMedia = favorites.map((item) => ({
    ...item,
    media_type: item.type,
    poster_path: item.poster,
    contextType: 'favorites',
  })) as unknown as Media[];

  const notificationsMedia = notifications.map((item) => ({
    ...item,
    media_type: item.type,
    poster_path: item.poster,
    contextType: 'notifications',
  })) as unknown as Media[];

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-12 py-32 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 pb-8 border-b border-zinc-800">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-crimson-500 to-crimson-900 flex items-center justify-center shadow-2xl">
          <User size={40} className="text-white" />
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white mb-2">
            My Profile
          </h1>
          <p className="text-zinc-400 font-medium">
            Manage your watch history and saved list
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold font-display uppercase tracking-wider">
            My Watchlist
          </h2>
          <span className="text-sm font-mono text-zinc-500">
            {watchlist.length} ITEMS
          </span>
        </div>
        {watchlist.length > 0 ? (
          <MediaGrid items={watchlistMedia} onRemove={handleRemove} />
        ) : (
          <div className="h-48 rounded-xl border border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-500">
            <p>Your watchlist is empty.</p>
            <Link
              href="/"
              className="text-crimson-500 hover:text-crimson-400 mt-2 font-medium"
            >
              Discover movies
            </Link>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold font-display uppercase tracking-wider flex items-center gap-2">
            <Heart size={24} className="text-pink-500" /> My Favorites
          </h2>
          <span className="text-sm font-mono text-zinc-500">
            {favorites.length} ITEMS
          </span>
        </div>
        {favorites.length > 0 ? (
          <MediaGrid items={favoritesMedia} onRemove={handleRemove} />
        ) : (
          <div className="h-48 rounded-xl border border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-500">
            <p>You haven&apos;t added any favorites yet.</p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-display uppercase tracking-wider">
              Watch History
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-mono text-zinc-500 hidden sm:block">
              {history.length} TITLES
            </span>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-crimson-500 transition-colors bg-void-900 px-3 py-1.5 rounded-lg border border-zinc-800"
              >
                <Trash2 size={14} /> Clear History
              </button>
            )}
          </div>
        </div>
        {history.length > 0 ? (
          <MediaGrid items={historyMedia} onRemove={handleRemove} />
        ) : (
          <div className="h-48 rounded-xl border border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-500">
            <p>No watch history yet.</p>
          </div>
        )}
      </div>

      <div className="space-y-6 pt-12 border-t border-zinc-800/50">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold font-display uppercase tracking-wider flex items-center gap-2">
            <Bell size={24} className="text-crimson-500" /> Upcoming Notifications
          </h2>
          <span className="text-sm font-mono text-zinc-500">
            {notifications.length} ITEMS
          </span>
        </div>
        {notifications.length > 0 ? (
          <MediaGrid items={notificationsMedia} onRemove={handleRemove} />
        ) : (
          <div className="h-48 rounded-xl border border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-500">
            <p>You haven&apos;t set any notifications yet.</p>
            <Link
              href="/schedule"
              className="text-crimson-500 hover:text-crimson-400 mt-2 font-medium"
            >
              Browse Schedule
            </Link>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
