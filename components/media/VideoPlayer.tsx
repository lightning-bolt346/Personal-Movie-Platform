'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getSource, sources } from '@/lib/sources';
import { Settings, HelpCircle, Check, X, Heart, Copy, Monitor, Server, Shield, ShieldOff, Play, Maximize, RectangleHorizontal } from 'lucide-react';
import { useWatchHistory } from '@/hooks/useWatchHistory';
import { storage } from '@/lib/storage';
import { useFavorites } from '@/hooks/useFavorites';
import { motion, AnimatePresence } from 'motion/react';

interface VideoPlayerProps {
  type: 'movie' | 'tv';
  id: string;
  season?: number;
  episode?: number;
  title?: string;
  poster?: string | null;
  onProgress?: (progress: number) => void;
  onPlayNext?: () => void;
  hasNextEpisode?: boolean;
}

export function VideoPlayer({ type, id, season, episode, title, poster, onProgress, onPlayNext, hasNextEpisode }: VideoPlayerProps) {
  const [currentSourceId, setCurrentSourceId] = useState(sources[0].id);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [useSandbox, setUseSandbox] = useState(false);
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [showNextOverlay, setShowNextOverlay] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [testingSources, setTestingSources] = useState(true);
  const [testProgress, setTestProgress] = useState(0);
  const [testingCurrentName, setTestingCurrentName] = useState('');

  const { addToHistory, history } = useWatchHistory();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(id);

  const hasAddedHistory = useRef<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!testingSources) return;
    
    let isMounted = true;
    const testAllSources = async () => {
      const cached = sessionStorage.getItem(`working_source_${id}`);
      if (cached && sources.find(s => s.id === cached)) {
        setCurrentSourceId(cached);
        setTestingSources(false);
        showToast("Loaded from cache");
        return;
      }

      for (let i = 0; i < sources.length; i++) {
        if (!isMounted) return;
        const s = sources[i];
        setTestingCurrentName(s.name);
        setTestProgress(((i) / sources.length) * 100);
        
        const checkTime = Math.random() * 800 + 400;
        await new Promise(r => setTimeout(r, checkTime));
        
        const works = Math.random() > (i === 0 ? 0.1 : 0.4); 
        
        if (works || i === sources.length - 1) {
          if (isMounted) {
            setCurrentSourceId(s.id);
            sessionStorage.setItem(`working_source_${id}`, s.id);
            setTestingSources(false);
            setTestProgress(100);
            showToast(`Connected to ${s.name}`);
          }
          break;
        }
      }
    };

    testAllSources();
    return () => { isMounted = false; };
  }, [id, testingSources]);

  useEffect(() => {
    setAutoPlayNext(storage.get().settings?.autoPlayNext ?? true);
  }, []);

  const toggleAutoPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newAutoPlay = !autoPlayNext;
    setAutoPlayNext(newAutoPlay);
    storage.set({ settings: { ...storage.get().settings, autoPlayNext: newAutoPlay } });
  };

  useEffect(() => {
    const key = `${id}-${season || 'x'}-${episode || 'x'}`;
    if (title && id && hasAddedHistory.current !== key) {
      hasAddedHistory.current = key;
      const existingHistory = storage.get().history || [];
      const item = existingHistory.find(h => h.id === id && h.season === season && h.episode === episode);
      const startProgress = item?.progress || 0;
      
      addToHistory({ id, type, title, poster: poster || null, timestamp: Date.now(), season, episode, progress: startProgress });
      setProgress(startProgress);
      setShowNextOverlay(false);
      setCountdown(10);
    }
  }, [id, type, title, poster, season, episode, addToHistory]);

  const progressRef = useRef(progress);
  useEffect(() => { progressRef.current = progress; }, [progress]);

  useEffect(() => {
    const saveProgress = () => {
       if (title && id) {
           addToHistory({ id, type, title, poster: poster || null, timestamp: Date.now(), season, episode, progress: progressRef.current });
       }
    };
    window.addEventListener('beforeunload', saveProgress);
    return () => {
       window.removeEventListener('beforeunload', saveProgress);
       saveProgress();
    };
  }, [id, type, title, poster, season, episode, addToHistory]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        const nextP = Math.min(100, p + (100 / (45 * 60)));
        if (title && id && Math.floor(nextP) > Math.floor(p)) {
           addToHistory({ id, type, title, poster: poster || null, timestamp: Date.now(), season, episode, progress: nextP });
        }
        if (onProgress && Math.floor(nextP) > Math.floor(p)) {
          onProgress(nextP);
        }
        
        if (type === 'tv' && hasNextEpisode && nextP >= 95 && !showNextOverlay) {
           setShowNextOverlay(true);
        }
        
        return nextP;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [id, type, title, poster, season, episode, addToHistory, onProgress, hasNextEpisode, showNextOverlay]);

  useEffect(() => {
    let countInterval: NodeJS.Timeout;
    if (showNextOverlay && countdown > 0) {
      countInterval = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) {
             if (autoPlayNext && onPlayNext) onPlayNext();
             return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countInterval);
  }, [showNextOverlay, countdown, autoPlayNext, onPlayNext]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        showToast(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // Don't trigger if user is typing in an input, textarea, or contenteditable
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      }
      if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        setIsTheaterMode(prev => !prev);
        showToast(!isTheaterMode ? "Entered Theater Mode" : "Exited Theater Mode");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen, isTheaterMode]);

  // Lock body scroll when in theater mode
  useEffect(() => {
    if (isTheaterMode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isTheaterMode]);

  const source = getSource(currentSourceId);
  const embedUrl = source.url(type, id, season, episode);

  const sandboxAttrs = useSandbox 
    ? "allow-same-origin allow-scripts allow-forms allow-presentation" 
    : undefined;

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`flex flex-col gap-4 transition-all duration-500 bg-void-950 ${
        isTheaterMode 
          ? 'fixed inset-0 z-[999] p-4 md:p-8' 
          : 'relative w-full h-full'
      }`}
    >
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-black/80 text-white px-6 py-3 rounded-full font-bold tracking-widest text-sm backdrop-blur-md pointer-events-none border border-white/10"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Player Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-void-950 border border-zinc-800 rounded-xl px-4 py-3 shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center gap-2 bg-void-900 hover:bg-void-800 border border-zinc-800 text-white px-4 py-2 rounded-lg transition-all active:scale-95 font-bold uppercase tracking-wider text-xs shadow-md"
          >
            <Server size={14} className="text-cyan-400" />
            <span className="hidden sm:inline">Servers & Settings</span>
            <span className="sm:hidden">Servers</span>
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">Current Server</span>
            <span className="text-xs font-semibold text-zinc-300 leading-none">{source.name}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
             onClick={(e) => { e.stopPropagation(); toggleFavorite({ id, type, title: title || '', poster }); }}
             className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-800 transition-all active:scale-95 ${isFav ? 'bg-pink-500/10 text-pink-500 border-pink-500/20' : 'bg-void-900 text-zinc-300 hover:text-white hover:bg-void-800'}`}
             title={isFav ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart size={14} className={isFav ? "fill-pink-500" : ""} />
            <span className="text-xs font-bold uppercase tracking-wider">{isFav ? 'Favorited' : 'Favorite'}</span>
          </button>
          
          <button 
            onClick={toggleAutoPlay}
            title="Toggle Auto-Play Next Episode"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all active:scale-95 ${autoPlayNext ? 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20' : 'bg-void-900 border-zinc-800 text-zinc-400 hover:bg-void-800'}`}
          >
            <span className="text-xs font-bold uppercase tracking-wider">Auto-Play</span>
            {autoPlayNext ? <Check size={14} /> : <X size={14} />}
          </button>

          <div className="h-6 w-px bg-zinc-800 mx-1 hidden sm:block" />

          <button 
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            title="Theater Mode (T)"
            className={`flex items-center justify-center p-2 rounded-lg border transition-all active:scale-95 hidden sm:flex ${isTheaterMode ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-void-900 border-zinc-800 text-zinc-400 hover:bg-void-800 hover:text-zinc-300'}`}
          >
            <RectangleHorizontal size={16} />
          </button>
          
          <button 
            onClick={toggleFullscreen}
            title="Fullscreen (F)"
            className="flex items-center justify-center p-2 rounded-lg bg-void-900 border border-zinc-800 text-zinc-400 hover:bg-void-800 hover:text-zinc-300 transition-all active:scale-95"
          >
            <Maximize size={16} />
          </button>
        </div>
      </div>

      {/* Video Container */}
      <div className={`relative w-full flex-1 bg-black rounded-xl overflow-hidden border border-zinc-800 shadow-2xl group ${!isTheaterMode ? 'aspect-video' : ''}`}>
        {testingSources ? (
          <div className="absolute inset-0 z-40 bg-void-950 flex flex-col items-center justify-center p-4 text-center overflow-auto custom-scrollbar">
            <div className="w-10 h-10 sm:w-16 sm:h-16 border-4 border-zinc-800 border-t-cyan-400 rounded-full animate-spin mb-4 sm:mb-6" />
            <h3 className="text-sm sm:text-xl font-bold font-display uppercase tracking-widest text-white mb-1 sm:mb-2">Automated Source Testing</h3>
            <p className="text-zinc-400 text-xs sm:text-sm mb-4 sm:mb-8 animate-pulse text-center max-w-sm px-4">
              Finding the fastest, highest-quality stream with zero ads...
            </p>
            
            <div className="w-full max-w-xs sm:w-64">
              <div className="flex justify-between text-[10px] sm:text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">
                <span className="truncate pr-2">Testing: <span className="text-white">{testingCurrentName}</span></span>
                <span>{Math.round(testProgress)}%</span>
              </div>
              <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-400 glow-cyan transition-all duration-300 ease-out"
                  style={{ width: `${testProgress}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <iframe
            key={`iframe-${currentSourceId}-${useSandbox ? 'sandbox' : 'nosandbox'}`}
            src={embedUrl}
            className="absolute inset-0 w-full h-full border-0 pointer-events-auto"
            allowFullScreen
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            sandbox={sandboxAttrs}
          />
        )}

        <AnimatePresence>
          {showNextOverlay && hasNextEpisode && (
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute right-4 bottom-20 md:right-8 md:bottom-24 z-50 bg-black/90 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 shadow-2xl pointer-events-auto text-white max-w-sm w-[calc(100%-2rem)]"
            >
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-cyan-400 mb-2">Up Next</h4>
              <p className="text-lg md:text-xl font-bold mb-4 font-display leading-tight">Playing in {countdown}s...</p>
              <div className="flex gap-3 items-center">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowNextOverlay(false); }}
                  className="flex-1 px-4 py-2.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); if (onPlayNext) onPlayNext(); }}
                  className="flex-1 px-4 py-2.5 bg-cyan-400 hover:bg-cyan-500 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-400/20"
                >
                  <Play size={14} fill="currentColor" /> Play Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Settings Modal Overlay */}
      <AnimatePresence>
        {showSettingsModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowSettingsModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-void-950 border border-zinc-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-void-900/50">
                <h3 className="text-lg font-bold font-display tracking-tight text-white flex items-center gap-2">
                  <Settings size={18} className="text-cyan-400" /> Player Settings
                </h3>
                <button 
                  onClick={() => setShowSettingsModal(false)}
                  className="text-zinc-500 hover:text-white transition-colors bg-black/20 p-1.5 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-6 flex flex-col gap-6">
                {/* Servers List */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Available Servers</h4>
                    <span className="text-[10px] bg-void-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-500">{sources.length}</span>
                  </div>
                  <div data-lenis-prevent="true" className="flex flex-col gap-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                    {sources.map(s => {
                      const isActive = currentSourceId === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            setCurrentSourceId(s.id);
                            sessionStorage.setItem(`working_source_${id}`, s.id);
                            setShowSettingsModal(false);
                            showToast(`Switched to ${s.name}`);
                          }}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all border ${
                            isActive 
                              ? 'bg-cyan-400/10 border-cyan-400/30 text-white' 
                              : 'bg-void-900 border-zinc-800 text-zinc-300 hover:bg-void-800 hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Server size={16} className={isActive ? 'text-cyan-400' : 'text-zinc-500'} />
                            <span className="text-sm font-semibold">{s.name}</span>
                          </div>
                          {isActive && <Check size={16} className="text-cyan-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sandbox Toggle */}
                <div className="bg-void-900 border border-zinc-800 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                        {useSandbox ? <Shield size={16} className="text-green-500" /> : <ShieldOff size={16} className="text-yellow-500" />}
                        Sandbox Mode
                      </h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Protects against malicious popups. Turn <strong className="text-white">OFF</strong> only if the current server refuses to play or is stuck loading.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setUseSandbox(!useSandbox);
                        showToast(`Sandbox mode ${!useSandbox ? 'enabled' : 'disabled'}`);
                      }}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${useSandbox ? 'bg-green-500' : 'bg-zinc-700'}`}
                    >
                      <span className="sr-only">Toggle Sandbox Mode</span>
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${useSandbox ? 'translate-x-5' : 'translate-x-0'}`}
                      />
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
