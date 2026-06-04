'use client';
import { useEffect, useState } from 'react';
import { useNotifications, NotificationItem } from '@/hooks/useNotifications';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, CalendarClock, Play } from 'lucide-react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/tmdb';
import Link from 'next/link';

export function NotificationToaster() {
  const { notifications, shownNotifications, markAsShown } = useNotifications();
  const [pendingToasts, setPendingToasts] = useState<NotificationItem[]>([]);
  const [activeToasts, setActiveToasts] = useState<NotificationItem[]>([]);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (hasChecked) return;
    const timer = setTimeout(() => {
      setHasChecked(true);
      if (!notifications || !notifications.length) return;
      
      const now = new Date();
      const toShow = notifications.filter(item => {
        if (!item.releaseDate) return false;
        if (shownNotifications?.includes(item.id)) return false;
        
        const releaseDate = new Date(item.releaseDate);
        const oneDayBefore = new Date(releaseDate.getTime() - (24 * 60 * 60 * 1000));
        return now >= oneDayBefore;
      });

      if (toShow.length > 0) {
        setPendingToasts(toShow);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [notifications, shownNotifications, hasChecked]);

  // Queue processor
  useEffect(() => {
    if (activeToasts.length < 3 && pendingToasts.length > 0) {
      const nextToast = pendingToasts[0];
      setPendingToasts(prev => prev.slice(1));
      setActiveToasts(prev => [...prev, nextToast]);
      markAsShown(nextToast.id);
    }
  }, [activeToasts.length, pendingToasts, markAsShown]);

  const dismissToast = (id: string) => {
    setActiveToasts(prev => prev.filter(t => t.id !== id));
  };

  if (activeToasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[500] flex flex-col gap-3 pointer-events-none w-[calc(100%-2rem)] md:w-[380px]">
      <AnimatePresence>
        {activeToasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: NotificationItem; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 20000); // 20 sec auto-dismiss
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  const isReleased = new Date() >= new Date(toast.releaseDate!);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="bg-void-950 border border-zinc-800 rounded-xl p-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] pointer-events-auto relative overflow-hidden group hover:border-zinc-700 transition-colors"
    >
      <Link 
        href={`/watch/${toast.type}/${toast.id}`} 
        onClick={() => onDismiss(toast.id)} 
        className="absolute inset-0 z-0" 
        aria-label={`Watch ${toast.title}`}
      />
      
      {/* Subtle top border glow for unreleased vs released */}
      <div 
        className="absolute top-0 left-0 right-0 h-[2px] opacity-70 z-0 pointer-events-none"
        style={{ background: isReleased ? 'linear-gradient(90deg, #10b981, transparent)' : 'linear-gradient(90deg, #f59e0b, transparent)' }}
      />

      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDismiss(toast.id); }}
        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-zinc-400 hover:text-white transition-colors z-20"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>

      <div className="flex gap-4 items-start relative z-10 pointer-events-none">
        {/* Poster */}
        {toast.poster ? (
          <div className="w-14 h-[84px] shrink-0 rounded-md overflow-hidden relative shadow-md bg-zinc-900 border border-zinc-800">
            <Image
              src={getImageUrl(toast.poster, 'w500')}
              alt={toast.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-14 h-[84px] shrink-0 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <Bell size={20} className="text-zinc-600" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-center gap-1.5 mb-1">
            {isReleased ? (
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-sm">
                <Play size={10} className="fill-emerald-400" /> Available Now
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-sm">
                <CalendarClock size={10} /> Coming Tomorrow
              </span>
            )}
          </div>
          
          <h4 className="font-bold text-white text-sm leading-snug line-clamp-2 mb-2 pr-4 group-hover:text-crimson-400 transition-colors">
            {toast.title}
          </h4>
          
          {isReleased ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-crimson-500">
              Watch Now <span aria-hidden="true">→</span>
            </span>
          ) : (
            <p className="text-xs text-zinc-500 font-medium">Releases {new Date(toast.releaseDate!).toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
