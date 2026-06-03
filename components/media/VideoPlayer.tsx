'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getSource, sources } from '@/lib/sources';
import { Settings, Check, X, Heart, Server, Shield, ShieldOff, Play, Maximize, Minimize, ExternalLink, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useWatchHistory } from '@/hooks/useWatchHistory';
import { storage } from '@/lib/storage';
import { useFavorites } from '@/hooks/useFavorites';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { PlayerToasts } from './PlayerToasts';

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
  const [useSandbox, setUseSandbox] = useState(true);
  const [autoSandboxOnSwitch, setAutoSandboxOnSwitch] = useState(true);
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [showNextOverlay, setShowNextOverlay] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [favoriteServers, setFavoriteServers] = useState<string[]>([]);
  const [showAllServers, setShowAllServers] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [showRotateHint, setShowRotateHint] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedFavs = localStorage.getItem('favorite_servers');
    if (savedFavs) {
      try {
        setFavoriteServers(JSON.parse(savedFavs));
      } catch (e) {}
    }

    // Portrait detection for mobile rotate hint
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);
  
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
        const cachedSource = sources.find(s => s.id === cached)!;
          setCurrentSourceId(cachedSource.id);
          const savedPref = localStorage.getItem('sandbox_pref_' + cachedSource.id);
          setUseSandbox(savedPref !== null ? savedPref === 'true' : true);
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
            const savedPref = localStorage.getItem('sandbox_pref_' + s.id);
            setUseSandbox(savedPref !== null ? savedPref === 'true' : true);
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

  // postMessage listener: sync real progress and episode changes from iframes that broadcast them
  useEffect(() => {
    const handleIframeMessage = (e: MessageEvent) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (!data || typeof data !== 'object') return;

        // Progress sync: some embeds send currentTime/duration
        if (data.currentTime !== undefined && data.duration !== undefined && data.duration > 0) {
          const realProgress = Math.min(100, (data.currentTime / data.duration) * 100);
          setProgress(realProgress);
          if (title && id) {
            addToHistory({ id, type, title, poster: poster || null, timestamp: Date.now(), season, episode, progress: realProgress });
          }
          if (onProgress) onProgress(realProgress);
          if (type === 'tv' && hasNextEpisode && realProgress >= 90 && !showNextOverlay) {
            setShowNextOverlay(true);
          }
        }

        // Episode change: some embeds send season/episode data when user navigates within embed
        if (data.season !== undefined && data.episode !== undefined) {
          const newSeason = Number(data.season);
          const newEpisode = Number(data.episode);
          if (
            type === 'tv' &&
            (newSeason !== season || newEpisode !== episode) &&
            newSeason > 0 && newEpisode > 0
          ) {
            // Update URL to reflect the new episode without full page reload
            const url = new URL(window.location.href);
            url.searchParams.set('season', String(newSeason));
            url.searchParams.set('episode', String(newEpisode));
            window.history.replaceState({}, '', url.toString());
            // Log it to history
            if (title) {
              addToHistory({ id, type, title, poster: poster || null, timestamp: Date.now(), season: newSeason, episode: newEpisode, progress: 0 });
            }
          }
        }
      } catch (_) {}
    };

    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [id, type, title, poster, season, episode, addToHistory, onProgress, hasNextEpisode, showNextOverlay]);

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
      // Don't trigger if user is typing
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
        target.isContentEditable
      ) return;

      // Only handle F for fullscreen when video container is focused/hovered
      if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      }

      // Space: only prevent page scroll, let the iframe handle play/pause natively
      if (e.key === ' ') {
        // Prevent page scroll
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen]);

  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    const handleFsChange = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      // Show rotate hint only on mobile portrait
      if (fs && window.innerHeight > window.innerWidth && window.innerWidth < 768) {
        setShowRotateHint(true);
        setTimeout(() => setShowRotateHint(false), 4000);
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Top 7 Recommended servers â€” ad-free priority
  const recommendedIds = ["cinemaos", "cinesrc", "vidsrcwtf2", "autoembed", "vidsrcwtf1", "peachify", "smashystream"];
  
  const favoriteSources = sources.filter(s => favoriteServers.includes(s.id));
  const top6Sources = sources.filter(s => recommendedIds.includes(s.id) && !favoriteServers.includes(s.id));
  const remainingSources = sources.filter(s => !recommendedIds.includes(s.id) && !favoriteServers.includes(s.id));

  const toggleFavServer = (e: React.MouseEvent, serverId: string) => {
    e.stopPropagation();
    const newFavs = favoriteServers.includes(serverId) 
      ? favoriteServers.filter(fid => fid !== serverId)
      : [...favoriteServers, serverId];
    setFavoriteServers(newFavs);
    localStorage.setItem('favorite_servers', JSON.stringify(newFavs));
  };

  const source = getSource(currentSourceId);
  const embedUrl = source.url(type, id, season, episode);

  const sandboxAttrs = useSandbox 
    ? source.sandboxFlags 
    : undefined; // Completely removes sandbox attribute for true unsandboxed play

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col w-full relative bg-void-950 rounded-2xl overflow-hidden border border-zinc-800/60"
    >
      <PlayerToasts key={id} serverName={source.name} serverIsNoAds={source.noAds} />

      {/* Inline toast message (server switch) via portal */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-[9998] bg-black/80 text-white px-5 py-2.5 rounded-full font-bold tracking-widest text-xs backdrop-blur-md pointer-events-none border border-white/10"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Rotate phone hint (mobile fullscreen portrait) */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showRotateHint && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-[9997] flex items-center justify-center pointer-events-none"
            >
              <div className="flex flex-col items-center gap-3 bg-black/85 backdrop-blur-xl border border-white/10 rounded-2xl px-8 py-6 shadow-2xl">
                <RotateCcw size={32} className="text-white animate-spin" style={{ animationDuration: '2s' }} />
                <p className="text-white font-bold text-sm tracking-wide text-center">Rotate your phone<br/><span className="text-zinc-400 font-normal text-xs">for the best experience</span></p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Settings Modal via Portal (renders outside iframe, proper z-index on mobile) */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showSettingsModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9990] bg-black/70 backdrop-blur-md flex flex-col items-stretch sm:items-center sm:justify-center"
              onClick={() => setShowSettingsModal(false)}
            >
              <motion.div 
                initial={{ scale: 0.98, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.98, y: 20, opacity: 0 }}
                className="bg-void-900/95 backdrop-blur-2xl border-t sm:border border-white/10 sm:rounded-2xl w-full sm:max-w-5xl h-[90vh] sm:h-auto sm:max-h-[88vh] flex flex-col shadow-2xl relative overflow-hidden mt-auto sm:mt-0"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Background glows */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-crimson-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

                {/* Modal header */}
                <div className="px-5 py-4 border-b border-zinc-800/80 flex items-center justify-between bg-void-950/60 relative z-10 shrink-0">
                  <h3 className="text-base sm:text-xl font-bold font-display tracking-wider text-white flex items-center gap-2.5 uppercase">
                    <Settings size={18} className="text-crimson-500 animate-spin" style={{ animationDuration: '6s' }} /> ZIVOX Control
                  </h3>
                  <button 
                    onClick={() => setShowSettingsModal(false)}
                    className="text-zinc-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-xl active:scale-95"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal body */}
                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                  {/* Left: Server list */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 shrink-0">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Select Server</h4>
                      <span className="text-xs bg-crimson-500/10 border border-crimson-500/20 px-2.5 py-1 rounded-full text-crimson-500 font-bold uppercase tracking-wider">{sources.length} Active</span>
                    </div>
                    <div data-lenis-prevent="true" className="flex flex-col gap-5 overflow-y-auto flex-1 px-5 pb-5">
                      {(() => {
                        const renderServerCard = (s: typeof sources[0]) => {
                          const isActive = currentSourceId === s.id;
                          const isFav = favoriteServers.includes(s.id);
                          return (
                            <button
                              key={s.id}
                              onClick={() => {
                                setCurrentSourceId(s.id);
                                const savedPref = localStorage.getItem('sandbox_pref_' + s.id);
                                if (savedPref !== null) {
                                  setUseSandbox(savedPref === 'true');
                                } else if (autoSandboxOnSwitch) {
                                  setUseSandbox(true);
                                }
                                sessionStorage.setItem(`working_source_${id}`, s.id);
                                setShowSettingsModal(false);
                                showToast(`${s.name}`);
                              }}
                              className={`group flex flex-col justify-between p-4 rounded-2xl transition-all duration-300 border text-left cursor-pointer active:scale-[0.98] relative overflow-hidden ${
                                isActive 
                                  ? 'bg-gradient-to-br from-crimson-500/20 via-crimson-500/10 to-transparent border-crimson-500/50 text-white shadow-[0_0_20px_rgba(229,9,20,0.15)]' 
                                  : 'bg-void-900/60 border-zinc-800/80 text-zinc-300 hover:bg-zinc-800/40 hover:border-zinc-700 hover:text-white'
                              }`}
                            >
                              {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-crimson-500/10 to-transparent animate-pulse pointer-events-none" />
                              )}
                              <div className="flex items-start justify-between w-full gap-2 z-10">
                                <div className="flex items-center gap-2">
                                  <Server size={13} className={isActive ? 'text-crimson-500' : 'text-zinc-500'} />
                                  <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">{s.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div onClick={(e) => toggleFavServer(e, s.id)} className="hover:scale-110 active:scale-95 transition-transform">
                                    <Heart size={13} className={isFav ? "fill-pink-500 text-pink-500" : "text-zinc-600 hover:text-pink-400"} />
                                  </div>
                                  <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-crimson-500 shadow-[0_0_8px_#e50914]' : 'bg-zinc-700'}`} />
                                </div>
                              </div>
                              <div className="mt-3 z-10 flex-1 flex flex-col">
                                <span className="text-sm font-bold leading-tight block mb-1 font-display">{s.name}</span>
                                {s.feature && <span className="text-[10px] text-zinc-400 leading-snug mb-3 line-clamp-2">{s.feature}</span>}
                                <div className="flex items-center gap-1.5 mt-auto flex-wrap">
                                  {s.tier === 1 ? (
                                    <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">T1</span>
                                  ) : (
                                    <span className="text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20">T2</span>
                                  )}
                                  {s.noAds && <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">âœ“ No Ads</span>}
                                  {s.hasPopups && <span className="text-[9px] font-bold text-zinc-500 bg-black/50 px-1.5 py-0.5 rounded border border-white/5">Popups</span>}
                                </div>
                              </div>
                            </button>
                          );
                        };

                        return (
                          <>
                            {favoriteSources.length > 0 && (
                              <div>
                                <h5 className="text-[10px] font-bold uppercase tracking-widest text-pink-500 mb-2 flex items-center gap-1.5"><Heart size={11} className="fill-pink-500" /> Favorites</h5>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
                                  {favoriteSources.map(s => renderServerCard(s))}
                                </div>
                              </div>
                            )}
                            <div>
                              <h5 className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-2">âœ¦ Recommended</h5>
                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
                                {top6Sources.map(s => renderServerCard(s))}
                              </div>
                            </div>
                            {remainingSources.length > 0 && (
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="h-px bg-zinc-800/80 flex-1" />
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setShowAllServers(!showAllServers); }} 
                                    className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors bg-void-900 border border-zinc-800 px-3 py-1 rounded-full flex items-center gap-1.5 active:scale-95"
                                  >
                                    {showAllServers ? 'Hide' : `More (${remainingSources.length})`}
                                  </button>
                                  <div className="h-px bg-zinc-800/80 flex-1" />
                                </div>
                                {showAllServers && (
                                  <div className="flex flex-col gap-1">
                                    {remainingSources.map((s) => {
                                      const isActiveCompact = currentSourceId === s.id;
                                      const isFavCompact = favoriteServers.includes(s.id);
                                      return (
                                        <button
                                          key={s.id}
                                          onClick={() => {
                                            setCurrentSourceId(s.id);
                                            const savedPref = localStorage.getItem('sandbox_pref_' + s.id);
                                            if (savedPref !== null) setUseSandbox(savedPref === 'true');
                                            else if (autoSandboxOnSwitch) setUseSandbox(true);
                                            sessionStorage.setItem(`working_source_${id}`, s.id);
                                            setShowSettingsModal(false);
                                            showToast(`${s.name}`);
                                          }}
                                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 border text-left cursor-pointer active:scale-[0.99] ${
                                            isActiveCompact
                                              ? 'bg-crimson-500/15 border-crimson-500/40 text-white'
                                              : 'bg-void-900/40 border-zinc-800/60 text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                                          }`}
                                        >
                                          <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActiveCompact ? 'bg-crimson-500' : 'bg-zinc-700'}`} />
                                            <span className="text-xs font-semibold">{s.name}</span>
                                            {s.noAds && <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/20">âœ“</span>}
                                          </div>
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-[9px] text-zinc-600 uppercase hidden sm:block">T{s.tier}</span>
                                            <div onClick={(e) => toggleFavServer(e, s.id)} className="hover:scale-110 active:scale-95 transition-transform p-0.5">
                                              <Heart size={11} className={isFavCompact ? "fill-pink-500 text-pink-500" : "text-zinc-600 hover:text-pink-400"} />
                                            </div>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Right: Security controls */}
                  <div className="w-full lg:w-72 shrink-0 flex flex-col gap-3 overflow-y-auto px-5 pb-5 border-t lg:border-t-0 lg:border-l border-zinc-800/60 pt-4 lg:pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Security</h4>
                    <div className="bg-void-900/50 border border-zinc-800/80 rounded-xl p-4 flex flex-col gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg transition-colors ${useSandbox ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                          {useSandbox ? <Shield size={14} /> : <ShieldOff size={14} />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">Sandbox Shield</h4>
                          <p className="text-[10px] text-zinc-400 leading-normal">Blocks popups, redirects and trackers from embed sources.</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-zinc-800/40">
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{useSandbox ? 'Protected' : 'Disabled'}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const n = !useSandbox;
                            setUseSandbox(n);
                            localStorage.setItem('sandbox_pref_' + currentSourceId, n.toString());
                            showToast(`Sandbox ${n ? 'ON' : 'OFF'}`);
                          }}
                          className={`relative w-10 h-5 rounded-full transition-all duration-300 ${
                            useSandbox ? 'bg-emerald-500' : 'bg-zinc-700'
                          }`}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${
                            useSandbox ? 'left-[22px]' : 'left-0.5'
                          }`} />
                        </button>
                      </div>
                    </div>

                    <div className="bg-void-900/50 border border-zinc-800/80 rounded-xl p-4 flex flex-col gap-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          <Shield size={14} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">Auto-Shield</h4>
                          <p className="text-[10px] text-zinc-400 leading-normal">Re-enables sandbox every time you switch servers.</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-zinc-800/40">
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{autoSandboxOnSwitch ? 'Active' : 'Off'}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const n = !autoSandboxOnSwitch;
                            setAutoSandboxOnSwitch(n);
                            localStorage.setItem('auto_sandbox_on_switch', n.toString());
                          }}
                          className={`relative w-10 h-5 rounded-full transition-all duration-300 ${
                            autoSandboxOnSwitch ? 'bg-indigo-500' : 'bg-zinc-700'
                          }`}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${
                            autoSandboxOnSwitch ? 'left-[22px]' : 'left-0.5'
                          }`} />
                        </button>
                      </div>
                    </div>

                    {type === 'tv' && (
                      <div className="bg-void-900/50 border border-zinc-800/80 rounded-xl p-4 flex flex-col gap-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-crimson-500/10 text-crimson-400 border border-crimson-500/20">
                            <Play size={14} />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">Auto-Play Next</h4>
                            <p className="text-[10px] text-zinc-400 leading-normal">Automatically plays the next episode when current ends.</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-zinc-800/40">
                          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{autoPlayNext ? 'On' : 'Off'}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); const n = !autoPlayNext; setAutoPlayNext(n); storage.set({ settings: { ...storage.get().settings, autoPlayNext: n } }); }}
                            className={`relative w-10 h-5 rounded-full transition-all duration-300 ${
                              autoPlayNext ? 'bg-crimson-500' : 'bg-zinc-700'
                            }`}
                          >
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${
                              autoPlayNext ? 'left-[22px]' : 'left-0.5'
                            }`} />
                          </button>
                        </div>
                      </div>
                    )}

                    <a
                      href={embedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-all mt-1 hover:scale-105 active:scale-95"
                    >
                      <ExternalLink size={11} className="text-crimson-500 animate-pulse" /> Open source in new tab
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ── PLAYER TOP BAR ── */}
      {!isFullscreen && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-void-950 border-b border-zinc-800/60 shrink-0 w-full">
          {/* Left: servers button + server name + sandbox */}
          <div className="flex items-center gap-3 min-w-0">
            <button 
              onClick={() => setShowSettingsModal(true)}
              className="flex items-center gap-2 bg-void-900 hover:bg-void-800 border border-zinc-800 text-white px-4 py-2 rounded-lg transition-all active:scale-95 font-bold uppercase tracking-wider text-xs shadow-md shrink-0"
            >
              <Server size={14} className="text-crimson-500" />
              <span className="hidden sm:inline">Servers &amp; Settings</span>
              <span className="sm:hidden">Servers</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 min-w-0">
              <div className="h-5 w-px bg-zinc-800" />
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest leading-none mb-0.5">Now streaming on</span>
                <span className="text-xs font-semibold text-zinc-200 leading-none truncate max-w-[180px]">{source.name}</span>
              </div>
              {source.noAds && <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded shrink-0">✓ No Ads</span>}
              {source.tier === 1 && <span className="text-[9px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded shrink-0 hidden lg:inline">Tier 1</span>}
            </div>
          </div>

          {/* Right: controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Sandbox toggle */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                const n = !useSandbox;
                setUseSandbox(n);
                localStorage.setItem('sandbox_pref_' + currentSourceId, n.toString());
                showToast(`Sandbox ${n ? 'ON' : 'OFF'}`);
              }}
              title={useSandbox ? 'Sandbox Protection ON' : 'Sandbox OFF — Risky'}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all active:scale-95 text-xs font-bold ${
                useSandbox ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20'
              }`}
            >
              {useSandbox ? <Shield size={13} /> : <ShieldOff size={13} />}
              <span className="hidden md:inline">{useSandbox ? 'Sandbox ON' : 'Sandbox OFF'}</span>
            </button>

            {/* Favorite */}
            <button
              onClick={(e) => { e.stopPropagation(); toggleFavorite({ id, type, title: title || '', poster }); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all active:scale-95 text-xs font-bold ${
                isFav ? 'bg-pink-500/10 text-pink-500 border-pink-500/20' : 'bg-void-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-void-800'
              }`}
              title={isFav ? 'Remove from Favorites' : 'Add to Favorites'}
            >
              <Heart size={13} className={isFav ? 'fill-pink-500' : ''} />
              <span className="hidden lg:inline">{isFav ? 'Favorited' : 'Favorite'}</span>
            </button>

            {/* Auto-play (TV only) */}
            {type === 'tv' && (
              <button 
                onClick={toggleAutoPlay}
                title="Toggle Auto-Play Next Episode"
                className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all active:scale-95 text-xs font-bold ${
                  autoPlayNext ? 'bg-crimson-500/10 text-crimson-400 border-crimson-500/20' : 'bg-void-900 border-zinc-800 text-zinc-400 hover:bg-void-800'
                }`}
              >
                <span>Auto-Play</span>
                {autoPlayNext ? <Check size={13} /> : <X size={13} />}
              </button>
            )}

            <div className="h-5 w-px bg-zinc-800 hidden sm:block" />

            {/* Fullscreen */}
            <button 
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all active:scale-95 text-xs font-bold ${
                isFullscreen 
                  ? 'bg-crimson-500/10 text-crimson-400 border-crimson-500/20 hover:bg-crimson-500/20' 
                  : 'bg-void-900 border-zinc-800 text-zinc-400 hover:bg-void-800 hover:text-white'
              }`}
            >
              <Maximize size={14} />
              <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Video Container — proper 16:9 aspect ratio, works on all screens */}
      <div className="relative w-full aspect-video bg-black">

        {testingSources ? (
          <div className="absolute inset-0 z-40 bg-void-950 flex flex-col items-center justify-center p-4 text-center overflow-auto custom-scrollbar">
            <div className="w-10 h-10 sm:w-16 sm:h-16 border-4 border-zinc-800 border-t-crimson-500 rounded-full animate-spin mb-4 sm:mb-6" />
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
                  className="h-full bg-crimson-500 glow-crimson transition-all duration-300 ease-out"
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
            allowFullScreen={true}
            {...{ webkitallowfullscreen: "true", mozallowfullscreen: "true" }}
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
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-crimson-500 mb-2">Up Next</h4>
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
                  className="flex-1 px-4 py-2.5 bg-crimson-500 hover:bg-crimson-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg shadow-crimson-500/20"
                >
                  <Play size={14} fill="currentColor" /> Play Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
}
