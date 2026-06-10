'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, AlertCircle } from 'lucide-react';

interface ValidationFeedbackModalProps {
  message: {
    type: 'success' | 'error';
    title: string;
    text: string;
  } | null;
  onClose: () => void;
}

export function ValidationFeedbackModal({ message, onClose }: ValidationFeedbackModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !message) return null;

  const isSuccess = message.type === 'success';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative bg-void-950 border rounded-3xl w-full max-w-sm p-6 sm:p-8 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl flex flex-col items-center text-center z-10 ${
            isSuccess ? 'border-brand-500/20' : 'border-red-500/20'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ambient Glow */}
          <div 
            className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[80px] pointer-events-none ${
              isSuccess ? 'bg-brand-500/20' : 'bg-red-500/20'
            }`} 
          />

          <div 
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 relative z-10 border ${
              isSuccess 
                ? 'bg-brand-500/10 border-brand-500/20 text-brand-500' 
                : 'bg-red-500/10 border-red-500/20 text-red-500'
            }`}
          >
            {isSuccess ? <Check size={32} /> : <AlertCircle size={32} />}
            <div 
              className={`absolute inset-0 rounded-full animate-ping ${
                isSuccess ? 'bg-brand-500/20' : 'bg-red-500/20'
              }`} 
              style={{ animationDuration: '2s' }} 
            />
          </div>

          <h2 className="text-xl font-bold font-display text-white mb-3 relative z-10">
            {message.title}
          </h2>
          
          <p className="text-sm text-zinc-400 mb-8 leading-relaxed relative z-10">
            {message.text}
          </p>

          <button
            onClick={onClose}
            className={`w-full py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-all relative z-10 flex justify-center items-center gap-2 ${
              isSuccess 
                ? 'bg-brand-500 hover:bg-brand-400 text-black shadow-[0_0_20px_rgba(255,165,80,0.3)]' 
                : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-white/5'
            }`}
          >
            {isSuccess ? 'Awesome!' : 'Close'}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
