'use client';
import { useState, useEffect, useCallback } from 'react';
import { storage } from '@/lib/storage';

export interface NotificationItem {
  id: string; type: 'movie'|'tv'; title: string; poster?: string|null; releaseDate?: string; addedAt: number;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [shownNotifications, setShownNotifications] = useState<string[]>([]);
  
  useEffect(() => { 
    const loadState = () => {
      const data = storage.get();
      setNotifications(data.notifications || []); 
      setShownNotifications(data.shownNotifications || []);
    };
    loadState();
    window.addEventListener('notifications-changed', loadState);
    return () => window.removeEventListener('notifications-changed', loadState);
  }, []);
  
  const toggleNotification = useCallback((item: Omit<NotificationItem, 'addedAt'>) => {
    setNotifications(prev => {
      const exists = prev.find(i => i.id === item.id);
      const newNotifications = exists ? prev.filter(i => i.id !== item.id) : [{ ...item, addedAt: Date.now() }, ...prev];
      
      const currentStorage = storage.get();
      currentStorage.notifications = newNotifications;
      storage.set(currentStorage);
      
      setTimeout(() => window.dispatchEvent(new Event('notifications-changed')), 0);
      return newNotifications;
    });
  }, []);
  
  const markAsShown = useCallback((id: string) => {
    setShownNotifications(prev => {
      if (prev.includes(id)) return prev;
      const newShown = [...prev, id];
      const currentStorage = storage.get();
      currentStorage.shownNotifications = newShown;
      storage.set(currentStorage);
      setTimeout(() => window.dispatchEvent(new Event('notifications-changed')), 0);
      return newShown;
    });
  }, []);
  
  const hasNotification = useCallback((id: string) => notifications.some(i => i.id === id), [notifications]);
  
  return { notifications, shownNotifications, toggleNotification, markAsShown, hasNotification };
}
