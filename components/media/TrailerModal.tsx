'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Youtube, AlertCircle } from 'lucide-react';

export function TrailerModal({ isOpen, onClose, videoKey }: { isOpen: boolean, onClose: () => void, videoKey: string | null }) {
  const [isPlayable, setIsPlayable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !videoKey) {
      setLoading(true);
      setIsPlayable(null);
      return;
    }

    setLoading(true);
    setIsPlayable(null);

    let isMounted = true;
    
    // Failsafe timeout: if it doesn't confirm playability in 2.2 seconds, assume it is age-restricted
    const timeoutId = setTimeout(() => {
      if (isMounted && isPlayable === null) {
        console.log(`Trailer modal playability timeout for video: ${videoKey}. Falling back to YouTube redirect.`);
        setIsPlayable(false);
        setLoading(false);
      }
    }, 2200);

    const handleMessage = (e: MessageEvent) => {
      if (!isMounted) return;
      if (!e.origin.includes('youtube.com') && !e.origin.includes('youtube-nocookie.com')) return;

      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        
        if (data.event === 'infoDelivery' && data.info) {
          if (data.info.playerState === 1) {
            setIsPlayable(true);
            setLoading(false);
            clearTimeout(timeoutId);
          }
          if (data.info.errorCode) {
            setIsPlayable(false);
            setLoading(false);
            clearTimeout(timeoutId);
          }
        }
        
        if (data.event === 'onStateChange' && data.info === 1) {
          setIsPlayable(true);
          setLoading(false);
          clearTimeout(timeoutId);
        }

        if (data.event === 'onError') {
          setIsPlayable(false);
          setLoading(false);
          clearTimeout(timeoutId);
        }
      } catch (err) {}
    };

    window.addEventListener('message', handleMessage);

    return () => {
      isMounted = false;
      window.removeEventListener('message', handleMessage);
      clearTimeout(timeoutId);
    };
  }, [isOpen, videoKey, isPlayable]);

  return (
    <AnimatePresence>
      {isOpen && videoKey && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative bg-black w-full max-w-5xl aspect-video sm:rounded-2xl overflow-hidden shadow-2xl sm:border border-zinc-800 z-10 flex items-center justify-center"
          >
            {/* Close button (Floating Top-Right) */}
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 z-40 bg-black/70 hover:bg-zinc-900 border border-white/10 text-white p-2.5 rounded-full transition-all duration-200 active:scale-90"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* 1. LOADING SPINNER */}
            {loading && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 text-center">
                <div className="w-10 h-10 border-4 border-zinc-850 border-t-crimson-500 rounded-full animate-spin mb-4" />
                <span className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Verifying Trailer Stream...</span>
              </div>
            )}

            {/* 2. AGE-RESTRICTED WARNING SCREEN (Rendered if checked as unplayable) */}
            {isPlayable === false && (
              <div className="absolute inset-0 w-full h-full flex items-center justify-center z-20 bg-black">
                {/* High quality YouTube video thumbnail poster backdrop */}
                <div 
                  className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-sm scale-105 opacity-40 z-0"
                  style={{ backgroundImage: `url('https://img.youtube.com/vi/${videoKey}/maxresdefault.jpg'), url('https://img.youtube.com/vi/${videoKey}/hqdefault.jpg')` }}
                />
                
                {/* Vignette overlays to lock contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black z-10" />

                {/* Branded Frosted Glass Warning Panel */}
                <div className="relative z-20 flex flex-col items-center max-w-md p-6 sm:p-8 bg-zinc-950/85 border border-zinc-800 rounded-2xl text-center shadow-2xl backdrop-blur-md mx-4 animate-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-full bg-crimson-500/10 border border-crimson-500/25 flex items-center justify-center mb-4">
                    <AlertCircle className="text-crimson-500" size={24} />
                  </div>
                  <h3 className="text-lg font-bold font-display uppercase tracking-wider text-white mb-2">Age-Restricted Video</h3>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6">
                    This trailer contains mature content restricted by YouTube. To protect your streaming experience, we cannot embed it directly, but you can play it safely in a new tab!
                  </p>
                  <a 
                    href={`https://www.youtube.com/watch?v=${videoKey}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-crimson-500 hover:bg-crimson-600 text-white font-bold uppercase tracking-wider text-xs px-6 py-3 rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-crimson-500/35 border border-crimson-400/20"
                  >
                    <Youtube size={16} fill="currentColor" /> Watch on YouTube
                  </a>
                </div>
              </div>
            )}

            {/* 3. STANDARD PLAYABLE EMBED PLAYER (Rendered initially hidden, fades in if playable) */}
            {isPlayable !== false && (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0&enablejsapi=1`}
                title="Trailer"
                className={`w-full h-full border-0 transition-opacity duration-500 relative z-10 ${isPlayable ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
