'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { X, Play, Zap, Shield, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Check if user has seen the modal before
    const hasSeen = localStorage.getItem('zivox_welcome_seen');
    if (!hasSeen) {
      localStorage.setItem('zivox_welcome_seen', 'true');
      // Small delay for dramatic effect
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    localStorage.setItem('zivox_welcome_seen', 'true');
  };

  const handleLearnMore = () => {
    closeModal();
    router.push('/guide');
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" style={{ perspective: '1000px' }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-zinc-950/90 border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(229,9,20,0.15)] flex flex-col z-10"
          >
            {/* Top decorative gradient line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-crimson-600 via-purple-600 to-crimson-600" />

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors z-20"
            >
              <X size={20} />
            </button>

            {/* Header Content */}
            <div className="pt-10 pb-6 px-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(229,9,20,0.15),transparent_70%)]" />
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-crimson-500 to-purple-600 rounded-2xl flex items-center justify-center mb-5 rotate-3 shadow-xl border border-white/10 relative z-10">
                <Play className="text-white fill-white w-8 h-8 -mr-1" />
              </div>
              <h2 className="text-3xl font-display font-black tracking-tight text-white mb-2 relative z-10">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-crimson-500 to-purple-400">ZIVOX</span>
              </h2>
              <p className="text-zinc-400 text-sm font-medium relative z-10">
                The ultimate streaming experience. Zero ads. Pure cinematic bliss.
              </p>
            </div>

            {/* Features */}
            <div className="px-8 py-2 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-crimson-500/10 border border-crimson-500/20 text-crimson-400 mt-0.5">
                  <Zap size={18} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-[15px]">Multiple High-Speed Servers</h4>
                  <p className="text-zinc-500 text-xs mt-1">If one server acts up, you have 7+ premium backups to choose from instantly.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mt-0.5">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-[15px]">Smart Tracking & Resumes</h4>
                  <p className="text-zinc-500 text-xs mt-1">We automatically save your watch progress locally. Pick up exactly where you left off.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mt-0.5">
                  <Shield size={18} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-[15px]">100% Ad-Free Experience</h4>
                  <p className="text-zinc-500 text-xs mt-1">No sign-ups, no pop-ups, no tracking. Just pure uninterrupted streaming.</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="p-8 pt-6 flex flex-col gap-3">
              <button
                onClick={handleLearnMore}
                className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
              >
                Learn How To Use Zivox
              </button>
              
              <button
                onClick={closeModal}
                className="w-full py-3 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-400 font-bold uppercase tracking-widest text-xs transition-colors hover:bg-zinc-800 hover:text-white"
              >
                Skip & Start Watching
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
