'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export function TrailerModal({ 
  isOpen, 
  onClose, 
  videoKey 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  videoKey: string | null; 
}) {
  if (!isOpen || !videoKey) return null;

  return (
    <AnimatePresence>
      {isOpen && videoKey && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/92 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="relative bg-black w-full max-w-5xl aspect-video sm:rounded-2xl overflow-hidden shadow-2xl sm:border border-zinc-800/80 z-10 flex items-center justify-center"
          >
            {/* Close button (Floating Top-Right) */}
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 z-40 bg-black/75 hover:bg-zinc-900 border border-white/10 text-white p-2.5 rounded-full transition-all duration-200 active:scale-90 shadow-lg cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Direct YouTube Iframe Embed — 100% Reliable Playback in Local & Production */}
            <iframe
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
              title="Trailer"
              className="w-full h-full border-0 relative z-10"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
