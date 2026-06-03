'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getSource, sources } from '@/lib/sources';
import { Settings, HelpCircle, Check, X, Heart, Copy, Monitor, Server, Shield, ShieldOff, Play, Maximize, RectangleHorizontal, ExternalLink, ArrowRight } from 'lucide-react';
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [useSandbox, setUseSandbox] = useState(true);
  const [autoSandboxOnSwitch, setAutoSandboxOnSwitch] = useState(true);
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [showNextOverlay, setShowNextOverlay] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [favoriteServers, setFavoriteServers] = useState<string[]>([]);
  const [showAllServers, setShowAllServers] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedFavs = localStorage.getItem('favorite_servers');
    if (savedFavs) {
      try {
        setFavoriteServers(JSON.parse(savedFavs));
      } catch (e) {}
    }
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
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Top 7 Recommended servers — ad-free priority
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
      className="flex flex-col transition-all duration-500 w-full h-full relative gap-4 bg-void-950 rounded-2xl"
    >
      <PlayerToasts key={id} serverName={source.name} serverIsNoAds={source.noAds} />
      {mounted && typeof document !== 'undefined' && createPortal(
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
        </AnimatePresence>,
        document.body
      )}
      
      {/* Player Top Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 transition-all duration-500 relative z-50 bg-void-950 border border-zinc-800 rounded-xl p-3 sm:px-4 shadow-lg w-full">
        {/* Left Side / Row 1 */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowSettingsModal(true)}
              className="flex items-center gap-2 bg-void-900 hover:bg-void-800 border border-zinc-800 text-white px-3 sm:px-4 py-2 rounded-lg transition-all active:scale-95 font-bold uppercase tracking-wider text-xs shadow-md"
            >
              <Server size={14} className="text-crimson-500" />
              <span className="hidden sm:inline">Servers & Settings</span>
              <span className="sm:hidden">Servers</span>
            </button>
            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">Current Server</span>
              <span className="text-xs font-semibold text-zinc-300 leading-none truncate max-w-[100px] sm:max-w-none">{source.name}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="h-6 w-px bg-zinc-800 hidden sm:block" />
            <button 
              onClick={(e) => {
                e.stopPropagation();
                const newState = !useSandbox;
                setUseSandbox(newState);
                localStorage.setItem('sandbox_pref_' + currentSourceId, newState.toString());
                showToast(`Sandbox mode ${newState ? 'enabled' : 'disabled'}`);
              }}
              title={useSandbox ? "Sandbox ON (Click to Disable)" : "Sandbox OFF (Click to Enable)"}
              className={`flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-lg border transition-all active:scale-95 ${useSandbox ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}
            >
              {useSandbox ? <Shield size={14} /> : <ShieldOff size={14} />}
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Sandbox {useSandbox ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
        
        {/* Right Side / Row 2 */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto bg-black/20 sm:bg-transparent p-1.5 sm:p-0 rounded-lg border border-zinc-800/50 sm:border-none">
          <button
             onClick={(e) => { e.stopPropagation(); toggleFavorite({ id, type, title: title || '', poster }); }}
             className={`flex items-center justify-center gap-2 flex-1 sm:flex-none p-2 sm:px-3 sm:py-2 rounded-md sm:rounded-lg border transition-all active:scale-95 ${isFav ? 'bg-pink-500/10 text-pink-500 border-pink-500/20' : 'bg-void-900 border-zinc-800 text-zinc-300 hover:text-white hover:bg-void-800'}`}
             title={isFav ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart size={14} className={isFav ? "fill-pink-500" : ""} />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider hidden sm:inline">{isFav ? 'Favorited' : 'Favorite'}</span>
          </button>
          
          <button 
            onClick={toggleAutoPlay}
            title="Toggle Auto-Play Next Episode"
            className={`flex items-center justify-center gap-2 flex-1 sm:flex-none p-2 sm:px-3 sm:py-2 rounded-md sm:rounded-lg border transition-all active:scale-95 ${autoPlayNext ? 'bg-crimson-500/10 text-crimson-500 border-crimson-500/20' : 'bg-void-900 border-zinc-800 text-zinc-400 hover:bg-void-800'}`}
          >
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider hidden sm:inline">Auto-Play</span>
            {autoPlayNext ? <Check size={14} /> : <X size={14} />}
          </button>

          <div className="h-6 w-px bg-zinc-800 hidden sm:block" />
          
          <button 
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
            className={`flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-md sm:rounded-lg border transition-all active:scale-95 flex-1 sm:flex-none ${
              isFullscreen 
                ? 'bg-crimson-500/10 text-crimson-400 border-crimson-500/20 hover:bg-crimson-500/20' 
                : 'bg-void-900 border-zinc-800 text-zinc-400 hover:bg-void-800 hover:text-zinc-300'
            }`}
          >
            <Maximize size={16} />
            {isFullscreen && <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Exit FS</span>}
          </button>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative z-10 w-full flex-1 overflow-hidden group bg-black rounded-xl border border-zinc-800 shadow-2xl aspect-video">
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

      {/* Settings Modal Overlay */}
      <AnimatePresence>
        {showSettingsModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[200] bg-void-950/40 backdrop-blur-md flex items-center justify-center sm:p-6 p-0"
            onClick={() => setShowSettingsModal(false)}
          >
              <motion.div 
                initial={{ scale: 0.98, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.98, y: 20, opacity: 0 }}
                className="bg-void-900/60 backdrop-blur-2xl border border-white/10 sm:rounded-3xl max-w-6xl w-full h-full sm:h-auto sm:max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Premium floating background glows inside modal */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-crimson-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="p-6 sm:p-8 border-b border-zinc-800/80 flex items-center justify-between bg-void-950/60 relative z-10 shrink-0">
                  <h3 className="text-xl font-bold font-display tracking-wider text-white flex items-center gap-3 uppercase">
                    <Settings size={22} className="text-crimson-500 animate-spin" style={{ animationDuration: '6s' }} /> ZIVOX Control Panel
                  </h3>
                  <button 
                    onClick={() => setShowSettingsModal(false)}
                    className="text-zinc-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-xl active:scale-95"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-6 sm:p-8 flex flex-col lg:flex-row gap-8 relative z-10 overflow-y-auto lg:overflow-hidden flex-1 custom-scrollbar">
                  {/* Left Side: Premium Servers Grid Layout (3/4) */}
                  <div className="flex-none lg:flex-1 lg:w-3/4 flex flex-col">
                    <div className="flex items-center justify-between mb-4 shrink-0">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Select Stream Server</h4>
                      <span className="text-xs bg-crimson-500/10 border border-crimson-500/20 px-3 py-1 rounded-full text-crimson-500 font-bold uppercase tracking-wider">{sources.length} Servers Active</span>
                    </div>
                    <div data-lenis-prevent="true" className="flex flex-col gap-6 lg:overflow-y-auto custom-scrollbar pr-2 pb-4">
                      {(() => {
                        const renderServerCard = (s: any, title: string) => {
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
                                showToast(`Connected to ${title}`);
                              }}
                              className={`group flex flex-col justify-between p-5 rounded-2xl transition-all duration-300 border text-left cursor-pointer active:scale-[0.98] relative overflow-hidden ${
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
                                  <Server size={16} className={isActive ? 'text-crimson-500' : 'text-zinc-500 group-hover:text-zinc-400 transition-colors'} />
                                  <span className="text-[10px] font-mono font-bold text-zinc-500 group-hover:text-zinc-400 uppercase tracking-widest">{s.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div 
                                    onClick={(e) => toggleFavServer(e, s.id)}
                                    className="hover:scale-110 active:scale-95 transition-transform"
                                  >
                                    <Heart size={14} className={isFav ? "fill-pink-500 text-pink-500" : "text-zinc-600 hover:text-pink-400"} />
                                  </div>
                                  <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-crimson-500 shadow-[0_0_8px_#e50914]' : 'bg-zinc-700 group-hover:bg-zinc-600'}`} />
                                </div>
                              </div>

                              <div className="mt-6 z-10 flex-1 flex flex-col">
                                <span className="text-lg font-bold leading-tight group-hover:translate-x-1 transition-transform block mb-2 font-display">
                                  {title}
                                </span>
                                {s.feature && (
                                  <span className="text-xs text-zinc-400 leading-snug mb-4 flex-1 line-clamp-2">
                                    {s.feature}
                                  </span>
                                )}
                                <div className="flex items-center gap-2 mt-auto flex-wrap">
                                  {s.tier === 1 ? (
                                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">Tier 1</span>
                                  ) : (
                                    <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 px-2 py-1 rounded border border-amber-500/20">Tier 2</span>
                                  )}
                                  {s.noAds ? (
                                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 flex items-center gap-1">✓ No Ads</span>
                                  ) : s.hasPopups ? (
                                    <span className="text-[10px] font-bold text-zinc-500 bg-black/50 px-2 py-1 rounded border border-white/5">Popups</span>
                                  ) : null}
                                </div>
                              </div>
                            </button>
                          );
                        };
                        
                        return (
                          <>
                            {favoriteSources.length > 0 && (
                              <div>
                                <h5 className="text-[10px] font-bold uppercase tracking-widest text-pink-500 mb-3 flex items-center gap-2"><Heart size={12} className="fill-pink-500" /> Favorites</h5>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                  {favoriteSources.map((s, index) => renderServerCard(s, `Fav ${index + 1}`))}
                                </div>
                              </div>
                            )}

                            <div>
                              <h5 className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-3 flex items-center gap-2">Recommended</h5>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {top6Sources.map((s, index) => renderServerCard(s, `Server ${index + 1}`))}
                              </div>
                            </div>

                            {remainingSources.length > 0 && (
                              <div>
                                <div className="flex items-center gap-4 mb-3 mt-2">
                                  <div className="h-px bg-zinc-800/80 flex-1" />
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setShowAllServers(!showAllServers); }} 
                                    className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors bg-void-900 border border-zinc-800 px-4 py-1.5 rounded-full flex items-center gap-2 active:scale-95 cursor-pointer"
                                  >
                                    {showAllServers ? 'Hide Extra Servers' : `More Servers (${remainingSources.length})`}
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
                                            if (savedPref !== null) {
                                              setUseSandbox(savedPref === 'true');
                                            } else if (autoSandboxOnSwitch) {
                                              setUseSandbox(true);
                                            }
                                            sessionStorage.setItem(`working_source_${id}`, s.id);
                                            setShowSettingsModal(false);
                                            showToast(`Connected to ${s.name}`);
                                          }}
                                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 border text-left cursor-pointer active:scale-[0.99] group ${
                                            isActiveCompact
                                              ? 'bg-crimson-500/15 border-crimson-500/40 text-white'
                                              : 'bg-void-900/40 border-zinc-800/60 text-zinc-400 hover:bg-zinc-800/50 hover:text-white hover:border-zinc-700'
                                          }`}
                                        >
                                          <div className="flex items-center gap-2.5">
                                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActiveCompact ? 'bg-crimson-500' : 'bg-zinc-700'}`} />
                                            <span className="text-xs font-semibold">{s.name}</span>
                                            {s.noAds && <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">No Ads</span>}
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <span className="text-[9px] text-zinc-600 uppercase tracking-wider hidden sm:block">T{s.tier}</span>
                                            <div
                                              onClick={(e) => toggleFavServer(e, s.id)}
                                              className="hover:scale-110 active:scale-95 transition-transform p-0.5"
                                            >
                                              <Heart size={12} className={isFavCompact ? "fill-pink-500 text-pink-500" : "text-zinc-600 hover:text-pink-400"} />
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

                  {/* Right Side: Premium Sandbox Switches & Security Panel (1/4) */}
                  <div className="w-full lg:w-1/4 shrink-0 flex flex-col gap-4 lg:overflow-y-auto custom-scrollbar pr-1 pb-4 border-t lg:border-t-0 lg:border-l border-zinc-800/60 pt-6 lg:pt-0 lg:pl-6">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-2">Security Controls</h4>
                    
                    {/* Sandbox Mode */}
                    <div className="bg-void-900/50 border border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between gap-4 hover:border-zinc-700/80 transition-all duration-300 relative group">
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-lg transition-colors ${useSandbox ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                          {useSandbox ? <Shield size={16} /> : <ShieldOff size={16} />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Sandbox Shield</h4>
                          <p className="text-[10px] text-zinc-400 leading-normal">
                            {useSandbox 
                              ? "Protects your browser by strictly blocking pop-ups and external domain redirects." 
                              : "Disabled. Embedded players run unrestricted. Beware of malicious redirects."
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2.5 border-t border-zinc-800/40">
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Shield Protection</span>
                        <button
                          onClick={() => {
                            const newState = !useSandbox;
                            setUseSandbox(newState);
                            localStorage.setItem('sandbox_pref_' + currentSourceId, newState.toString());
                            showToast(`Sandbox mode ${newState ? 'enabled' : 'disabled'}`);
                          }}
                          className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${useSandbox ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-zinc-800'}`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-300 ease-in-out ${useSandbox ? 'translate-x-4' : 'translate-x-0'}`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Auto-Sandbox on Switch */}
                    <div className="bg-void-900/50 border border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between gap-4 hover:border-zinc-700/80 transition-all duration-300 relative group">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          <Monitor size={16} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Auto-Shield Toggle</h4>
                          <p className="text-[10px] text-zinc-400 leading-normal">
                            Automatically resets and activates Sandbox Mode every single time you switch stream servers.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2.5 border-t border-zinc-800/40">
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Auto Protect</span>
                        <button
                          onClick={() => setAutoSandboxOnSwitch(!autoSandboxOnSwitch)}
                          className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${autoSandboxOnSwitch ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-zinc-800'}`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-300 ease-in-out ${autoSandboxOnSwitch ? 'translate-x-4' : 'translate-x-0'}`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Provider Diagnostics Setup */}
                    <div className="mt-auto pt-6">
                      <div className="pt-4 border-t border-zinc-800/60 flex justify-center">
                         <Link href={`/test-sources?id=${id}&type=${type}${season ? `&season=${season}` : ''}${episode ? `&episode=${episode}` : ''}`} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95">
                            <ExternalLink size={11} className="text-crimson-500 animate-pulse" /> Test Providers Settings
                         </Link>
                      </div>
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

