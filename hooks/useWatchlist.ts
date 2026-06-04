'use client';
import { useState, useEffect, useCallback } from 'react';
import { storage } from '@/lib/storage';

export interface WatchlistItem {
  id: string; type: 'movie'|'tv'; title: string; poster?: string|null; addedAt: number; release_date?: string; first_air_date?: string;
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  
  useEffect(() => { 
    setWatchlist(storage.get().watchlist || []); 
  }, []);
  
  const toggleWatchlist = useCallback((item: Omit<WatchlistItem, 'addedAt'>) => {
    setWatchlist(prev => {
      const exists = prev.find(i => i.id === item.id);
      const newWatchlist = exists ? prev.filter(i => i.id !== item.id) : [{ ...item, addedAt: Date.now() }, ...prev];
      storage.set({ watchlist: newWatchlist });
      return newWatchlist;
    });
  }, []);
  
  const isInWatchlist = useCallback((id: string) => watchlist.some(i => i.id === id), [watchlist]);
  
  return { watchlist, toggleWatchlist, isInWatchlist };
}
