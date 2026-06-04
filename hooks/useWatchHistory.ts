'use client';
import { useState, useEffect, useCallback } from 'react';
import { storage, VoidStorage } from '@/lib/storage';

export interface HistoryItem {
  id: string; type: 'movie'|'tv'; title: string; poster?: string|null; timestamp: number; season?: number; episode?: number; progress?: number; release_date?: string; first_air_date?: string;
}

export function useWatchHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  useEffect(() => { 
    setHistory(storage.get().history || []); 
  }, []);
  
  const addToHistory = useCallback((item: HistoryItem) => {
    setHistory(prev => {
      const filtered = prev.filter(i => i.id !== item.id);
      const newHistory = [item, ...filtered].slice(0, 50);
      storage.set({ history: newHistory });
      return newHistory;
    });
  }, []);
  
  const clearHistory = useCallback(() => {
    setHistory([]);
    storage.set({ history: [] });
  }, []);
  
  const removeFromHistory = useCallback((id: string) => {
    setHistory(prev => {
      const newHistory = prev.filter(i => i.id !== id);
      storage.set({ history: newHistory });
      return newHistory;
    });
  }, []);
  
  return { history, addToHistory, clearHistory, removeFromHistory };
}
