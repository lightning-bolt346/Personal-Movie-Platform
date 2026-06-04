'use client';
import { motion, AnimatePresence } from 'motion/react';
import { X, Settings } from 'lucide-react';
import { usePreferences } from '@/hooks/usePreferences';
import { useEffect } from 'react';

const GENRES = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 878, name: "Sci-Fi" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 16, name: "Animation" },
  { id: 14, name: "Fantasy" },
  { id: 53, name: "Thriller" },
];

const LANGUAGES = [
  { id: 'en', name: 'English' },
  { id: 'hi', name: 'Hindi' },
  { id: 'ko', name: 'Korean' },
  { id: 'ja', name: 'Japanese' },
  { id: 'es', name: 'Spanish' },
  { id: 'fr', name: 'French' },
  { id: 'de', name: 'German' },
  { id: 'zh', name: 'Chinese' },
  { id: 'ru', name: 'Russian' }
];

export function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { preferences, updatePreferences } = usePreferences();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleToggleGenre = (id: number) => {
    let current = [...preferences.preferredGenres];
    if (current.includes(id)) current = current.filter(g => g !== id);
    else current.push(id);
    updatePreferences({ preferredGenres: current });
  };

  const handleToggleLang = (id: string) => {
    let current = [...preferences.originalLanguage];
    if (current.includes(id)) current = current.filter(l => l !== id);
    else current.push(id);
    updatePreferences({ originalLanguage: current });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[301] w-[90%] max-w-2xl bg-void-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-zinc-800 bg-black/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-crimson-500/20 flex items-center justify-center">
                  <Settings size={20} className="text-crimson-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white leading-tight">Preferences</h2>
                  <p className="text-xs text-zinc-400">Customize your Voidstream experience</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-8 no-scrollbar">
              
              {/* Genres */}
              <section>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-crimson-500 rounded-full"></span>
                  Favorite Genres
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {GENRES.map(genre => {
                    const isSelected = preferences.preferredGenres.includes(genre.id);
                    return (
                      <button
                        key={genre.id}
                        onClick={() => handleToggleGenre(genre.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          isSelected 
                            ? 'bg-crimson-500 text-white shadow-lg shadow-crimson-500/20' 
                            : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                        }`}
                      >
                        {genre.name}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Languages */}
              <section>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-crimson-500 rounded-full"></span>
                  Preferred Languages
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {LANGUAGES.map(lang => {
                    const isSelected = preferences.originalLanguage.includes(lang.id);
                    return (
                      <button
                        key={lang.id}
                        onClick={() => handleToggleLang(lang.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          isSelected 
                            ? 'bg-crimson-500 text-white shadow-lg shadow-crimson-500/20' 
                            : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                        }`}
                      >
                        {lang.name}
                      </button>
                    );
                  })}
                </div>
                {preferences.originalLanguage.length === 0 && (
                  <p className="text-xs text-zinc-500 mt-3 italic">Showing all global content by default.</p>
                )}
              </section>

              {/* Toggles */}
              <section className="space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-crimson-500 rounded-full"></span>
                  Display Settings
                </h3>
                
                <button 
                  onClick={() => updatePreferences({ adultContent: !preferences.adultContent })}
                  className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-left"
                >
                  <div>
                    <h4 className="font-semibold text-white">Include Mature Content</h4>
                    <p className="text-zinc-400 text-xs mt-0.5">Show 18+ and restricted content in recommendations</p>
                  </div>
                  <div className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${preferences.adultContent ? 'bg-crimson-500' : 'bg-black/50 border border-white/20'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${preferences.adultContent ? 'translate-x-7' : 'translate-x-1'}`} />
                  </div>
                </button>

                <button 
                  onClick={() => updatePreferences({ showRatings: !preferences.showRatings })}
                  className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-left"
                >
                  <div>
                    <h4 className="font-semibold text-white">Show Content Ratings</h4>
                    <p className="text-zinc-400 text-xs mt-0.5">Display IMDb/TMDB star ratings on movie cards</p>
                  </div>
                  <div className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${preferences.showRatings ? 'bg-crimson-500' : 'bg-black/50 border border-white/20'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${preferences.showRatings ? 'translate-x-7' : 'translate-x-1'}`} />
                  </div>
                </button>
              </section>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
