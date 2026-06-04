'use client';
import { useState, useEffect, useCallback } from 'react';
import { storage } from '@/lib/storage';

export interface NotificationItem {
  id: string; type: 'movie'|'tv'; title: string; poster?: string|null; releaseDate?: string; addedAt: number;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  useEffect(() => { 
    setNotifications(storage.get().notifications || []); 
  }, []);
  
  const toggleNotification = useCallback((item: Omit<NotificationItem, 'addedAt'>) => {
    setNotifications(prev => {
      const exists = prev.find(i => i.id === item.id);
      const newNotifications = exists ? prev.filter(i => i.id !== item.id) : [{ ...item, addedAt: Date.now() }, ...prev];
      storage.set({ notifications: newNotifications });
      return newNotifications;
    });
  }, []);
  
  const hasNotification = useCallback((id: string) => notifications.some(i => i.id === id), [notifications]);
  
  return { notifications, toggleNotification, hasNotification };
}
