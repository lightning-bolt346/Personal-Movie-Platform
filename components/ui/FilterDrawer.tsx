'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Filter, Check } from 'lucide-react';
import { createPortal } from 'react-dom';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  setType: (v: string) => void;
  genres: string[];
  setGenres: (v: string[]) => void;
  year: string;
  setYear: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
  onApply: () => void;
}

import { GENRES_MAP } from '@/lib/genres';

const GENRES = Object.entries(GENRES_MAP).map(([value, label]) => ({ value, label }));

const YEARS = [
  { value: 'all', label: 'Any Year' },
  { value: '2024', label: '2024' },
  { value: '2023', label: '2023' },
  { value: '2022', label: '2022' },
  { value: '2020s', label: '2020s' },
  { value: '2010s', label: '2010s' },
  { value: '2000s', label: '2000s' },
  { value: 'older', label: 'Older' },
];

const SORTS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'primary_release_date.desc', label: 'Newest Releases' },
];

const TYPES = [
  { value: 'movie', label: 'Movies' },
  { value: 'tv', label: 'TV Shows' },
  { value: 'anime', label: 'Anime' },
];

export function FilterDrawer({
  isOpen, onClose, type, setType, genres, setGenres, year, setYear, sort, setSort, onApply
}: FilterDrawerProps) {
  
  // Local state for the drawer so changes aren't applied until clicking "Apply"
  const [localType, setLocalType] = useState(type);
  const [localGenres, setLocalGenres] = useState(genres);
  const [localYear, setLocalYear] = useState(year);
  const [localSort, setLocalSort] = useState(sort);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      setLocalType(type);
      setLocalGenres(genres);
      setLocalYear(year);
      setLocalSort(sort);
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, type, genres, year, sort, onClose]);

  const handleToggleGenre = (g: string) => {
    setLocalGenres(prev => 
      prev.includes(g) ? prev.filter(id => id !== g) : [...prev, g]
    );
  };

  const handleApply = () => {
    setType(localType);
    setGenres(localGenres);
    setYear(localYear);
    setSort(localSort);
    onApply();
    onClose();
  };

  const handleReset = () => {
    setLocalType('movie');
    setLocalGenres([]);
    setLocalYear('all');
    setLocalSort('popularity.desc');
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300]"
          />
          
          {/* Drawer */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Advanced Filters"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-void-950 border-l border-zinc-800 z-[310] flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-xl font-display font-bold flex items-center gap-2">
                <Filter size={20} className="text-brand-500" /> Advanced Filters
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div data-lenis-prevent="true" className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar">
              
              {/* Type */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Media Type</h3>
                <div className="flex gap-2 p-1 bg-void-900 rounded-lg">
                  {TYPES.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setLocalType(t.value)}
                      className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${localType === t.value ? 'bg-zinc-700 text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Sort By</h3>
                <div className="grid grid-cols-1 gap-2">
                  {SORTS.map(s => (
                    <button
                      key={s.value}
                      onClick={() => setLocalSort(s.value)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg border text-sm font-bold transition-all ${localSort === s.value ? 'bg-brand-500/10 border-brand-500/30 text-white' : 'bg-void-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                    >
                      {s.label}
                      {localSort === s.value && <Check size={16} className="text-brand-500" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Release Year</h3>
                <div className="flex flex-wrap gap-2">
                  {YEARS.map(y => (
                    <button
                      key={y.value}
                      onClick={() => setLocalYear(y.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${localYear === y.value ? 'bg-white text-black border-white' : 'bg-void-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'}`}
                    >
                      {y.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Genres (Multi-select)</h3>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map(g => {
                    const isActive = localGenres.includes(g.value);
                    return (
                      <button
                        key={g.value}
                        onClick={() => handleToggleGenre(g.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${isActive ? 'bg-brand-500 border-brand-500 text-white shadow-[0_0_10px_rgba(var(--brand-500),0.3)]' : 'bg-void-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'}`}
                      >
                        {g.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              
            </div>

            <div className="p-6 border-t border-zinc-800 flex gap-3 bg-void-950">
              <button 
                onClick={handleReset}
                className="px-6 py-3 rounded-xl border border-zinc-700 text-zinc-300 font-bold uppercase tracking-wider text-xs hover:bg-zinc-800 transition-colors"
              >
                Reset
              </button>
              <button 
                onClick={handleApply}
                className="flex-1 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-500/20 active:scale-95"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
