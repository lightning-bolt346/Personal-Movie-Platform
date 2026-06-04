'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { Copy, MessageCircle, Share2, Twitter, Facebook, Check } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  shareUrl?: string;
  subtitle?: string;
  children?: React.ReactNode; // For extra custom copy buttons
}

export function ShareModal({ isOpen, onClose, title, shareUrl, subtitle, children }: ShareModalProps) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl || window.location.href);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative bg-void-900/95 backdrop-blur-2xl border border-white/10 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* purple gradient top */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-purple-900/30 to-transparent pointer-events-none" />
            <div className="p-6 relative">
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-6 sm:hidden" />
              <div className="flex items-center justify-between mb-0.5">
                <h3 className="text-base font-bold text-white">Share</h3>
                {subtitle && (
                  <span className="text-[10px] font-bold text-zinc-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {subtitle}
                  </span>
                )}
              </div>
              <p className="text-xs text-white/40 mb-5 truncate">{title}</p>

              {/* Social grid */}
              {(() => {
                const urlToShare = shareUrl || window.location.href;
                return (
                  <div className="grid grid-cols-4 gap-2.5 mb-4">
                    {[
                      { label: 'WhatsApp', color: '#25D366', bg: 'rgba(37,211,102,0.12)', href: `https://wa.me/?text=${encodeURIComponent(`Check out "${title}" on ZIVOX ▶ ${urlToShare}`)}`, icon: <MessageCircle size={18} /> },
                      { label: 'Telegram', color: '#29A8EB', bg: 'rgba(41,168,235,0.12)', href: `https://t.me/share/url?url=${encodeURIComponent(urlToShare)}&text=${encodeURIComponent(`Check out "${title}" on ZIVOX`)}`, icon: <Share2 size={18} /> },
                      { label: 'Twitter', color: '#1DA1F2', bg: 'rgba(29,161,242,0.12)', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Checking out "${title}" on ZIVOX`)}&url=${encodeURIComponent(urlToShare)}`, icon: <Twitter size={18} /> },
                      { label: 'Facebook', color: '#1877F2', bg: 'rgba(24,119,242,0.12)', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlToShare)}`, icon: <Facebook size={18} /> },
                      { label: 'Reddit', color: '#FF4500', bg: 'rgba(255,69,0,0.12)', href: `https://reddit.com/submit?url=${encodeURIComponent(urlToShare)}&title=${encodeURIComponent(`Checking out "${title}" on ZIVOX`)}`, icon: <Share2 size={18} /> },
                      { label: 'Threads', color: '#fff', bg: 'rgba(255,255,255,0.08)', href: `https://threads.net/intent/post?text=${encodeURIComponent(`Checking out "${title}" on ZIVOX ${urlToShare}`)}`, icon: <MessageCircle size={18} /> },
                      { label: 'Instagram', color: '#E4405F', bg: 'rgba(228,64,95,0.12)', href: `https://www.instagram.com/`, icon: <Share2 size={18} /> },
                      { label: 'Pinterest', color: '#E60023', bg: 'rgba(230,0,35,0.12)', href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(urlToShare)}&description=${encodeURIComponent(`Checking out "${title}" on ZIVOX`)}`, icon: <Share2 size={18} /> },
                    ].map(item => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all active:scale-95 hover:brightness-125"
                        style={{ background: item.bg, color: item.color }}
                      >
                        {item.icon}
                        <span className="text-[9px] font-bold" style={{ color: 'rgba(255,255,255,0.55)' }}>{item.label}</span>
                      </a>
                    ))}
                  </div>
                );
              })()}

              {/* Default Copy Link */}
              <button
                onClick={handleCopy}
                className={`w-full flex items-center gap-3 px-4 py-3.5 border rounded-2xl transition-all active:scale-[0.98] ${
                  copied 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${copied ? 'bg-emerald-500/20' : 'bg-white/10'}`}>
                  {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} className="text-white/70" />}
                </div>
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-sm font-bold">{copied ? 'Copied to Clipboard' : 'Copy Link'}</span>
                  <span className={`text-[11px] ${copied ? 'text-emerald-500/70' : 'text-white/40'}`}>Standard page link</span>
                </div>
              </button>

              {/* Extra children */}
              {children}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
