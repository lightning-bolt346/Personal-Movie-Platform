'use client';
import { useState, useEffect, useCallback } from 'react';
import { storage } from '@/lib/storage';

export interface FavoriteItem {
  id: string; type: 'movie'|'tv'; title: string; poster?: string|null; addedAt: number; release_date?: string; first_air_date?: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  
  useEffect(() => { 
    setFavorites(storage.get().favorites || []); 
  }, []);
  
  const toggleFavorite = useCallback((item: Omit<FavoriteItem, 'addedAt'>) => {
    setFavorites(prev => {
      const exists = prev.find(i => i.id === item.id);
      const newFavorites = exists ? prev.filter(i => i.id !== item.id) : [{ ...item, addedAt: Date.now() }, ...prev];
      storage.set({ favorites: newFavorites });
      return newFavorites;
    });
  }, []);
  
  const isFavorite = useCallback((id: string) => favorites.some(i => i.id === id), [favorites]);
  
  return { favorites, toggleFavorite, isFavorite };
}
