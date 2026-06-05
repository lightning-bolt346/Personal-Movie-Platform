'use client';
import { Media } from '@/types/tmdb';
import { MediaCard } from './MediaCard';
import { ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function MediaGrid({ title, items, onRemove }: { title?: string; items: Media[]; onRemove?: (id: string, type: 'history'|'watchlist'|'favorites'|'notifications') => void }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="relative z-20 px-4 md:px-12 py-6">
      {title && (
        <h3 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
          {title}
          <ChevronRight className="w-5 h-5 text-zinc-500" />
        </h3>
      )}
      <motion.div layout="position" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <motion.div
              layout="position"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              key={`${item.media_type || (item.name ? 'tv' : 'movie')}-${item.id}-${index}`}
            >
               <MediaCard media={item} onRemove={onRemove} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
