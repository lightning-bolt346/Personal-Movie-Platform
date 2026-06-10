'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, Copy, Check, Share2, Globe, Sparkles, Bookmark, X } from 'lucide-react';

interface DomainNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DomainNoticeModal({ isOpen, onClose }: DomainNoticeModalProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [mounted, setMounted] = useState(false);
  const newDomain = 'zivox-tv.vercel.app';

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-close modal after 13 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 13000); // 13000 ms = 13 seconds
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`https://${newDomain}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'ZIVOX - Premium HD Streaming',
      text: 'ZIVOX is migrating to a new domain! Save the new link to continue streaming free movies and TV shows in HD.',
      url: `https://${newDomain}`,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share API failed or cancelled', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.text} Access here: ${shareData.url}`);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (err) {
        console.error('Failed to share: ', err);
      }
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!mounted || !isOpen) return null;
  if (typeof window !== 'undefined' && window.location.hostname.includes('zivox-tv')) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6">
      {/* Scrollbar overrides */}
      <style dangerouslySetInnerHTML={{ __html: `
        .modal-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .modal-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .modal-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.2);
          border-radius: 9999px;
        }
        .modal-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.4);
        }
      ` }} />

      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal Card Container */}
      <div className="relative w-full max-w-md bg-[#05070f]/95 border border-blue-500/20 rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.15)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Background Glow Wrapper — Overflow hidden to prevent absolute child expansion causing scrollbars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-25%] left-[50%] -translate-x-[50%] w-[90%] h-[60%] bg-blue-600/10 rounded-full blur-[90px]" />
          <div className="absolute bottom-[-10%] right-[0%] w-[45%] h-[35%] bg-cyan-500/5 rounded-full blur-[70px]" />
        </div>

        {/* Close Cross Button — Absolute on the card */}
        <button
          onClick={handleClose}
          aria-label="Close Notice"
          className="absolute top-4 right-4 z-50 text-zinc-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 w-8 h-8 flex items-center justify-center rounded-xl active:scale-95"
        >
          <X size={16} />
        </button>

        {/* Scrollable Content Wrapper — Tighter bottom padding, scrollbar only displays if viewport is too short */}
        <div className="w-full max-h-[85vh] overflow-y-auto modal-scrollbar overscroll-contain pt-6 pb-6 px-5 sm:px-6 md:px-7 relative z-10">
          
          <div className="flex flex-col items-center text-center w-full">
            
            {/* Top Banner Alert Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[9px] sm:text-[10px] uppercase font-black tracking-widest mb-4 sm:mb-5 shrink-0">
              <Globe size={11} className="animate-pulse" />
              Domain Migration Alert
            </div>

            {/* Heading */}
            <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight leading-tight mb-2 shrink-0">
              IMPORTANT <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">DOMAIN MIGRATION</span>
            </h2>

            <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed mb-4 sm:mb-5 max-w-sm">
              This domain will be taken down today at <span className="text-red-400 font-bold">11:59 PM</span>. Please start using the new domain, and share and save it to ensure uninterrupted access to ZIVOX.
            </p>

            {/* Domain Display Card */}
            <div className="w-full bg-blue-950/20 border border-blue-500/15 rounded-2xl p-3 sm:p-4 mb-4 relative group overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <span className="block text-[8px] sm:text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-1">New Home Domain</span>
              
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <span className="text-base sm:text-lg font-mono font-black text-white select-all truncate">
                  {newDomain}
                </span>
                
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all active:scale-95 border shrink-0 ${
                    copied 
                      ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' 
                      : 'bg-blue-500/10 border-blue-500/25 text-blue-400 hover:bg-blue-500/20'
                  }`}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Warning / DNS Info Text */}
            <div className="text-left w-full mb-3 px-1 shrink-0">
              <p className="text-[9px] sm:text-[10px] text-zinc-500 leading-normal">
                ⚠️ <span className="font-bold text-zinc-400">Notice:</span> The new domain may not be active immediately, but it will be fully live and streaming within 24 hours.
              </p>
            </div>

            {/* Admin Message */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3.5 sm:p-4 mb-4 sm:mb-5 text-left w-full relative shrink-0">
              <div className="absolute top-3 right-3 text-blue-500/20">
                <Sparkles size={13} />
              </div>
              <div className="flex gap-2.5 sm:gap-3 items-start">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 shrink-0 flex items-center justify-center text-white font-black text-[10px] sm:text-xs shadow-md shadow-blue-500/20">
                  A
                </div>
                <div>
                  <span className="block text-[10px] sm:text-xs font-bold text-blue-300 uppercase tracking-wider">Message from the Admin</span>
                  <p className="text-zinc-450 text-[10px] sm:text-[11px] leading-relaxed mt-1">
                    "ZIVOX runs purely on local storage for your watch progress and history without ads or tracking. Since this site is moving, please **bookmark this page now** (Ctrl+D or ⌘+D) and share the new link with your friends so we all stay connected. Happy streaming!"
                  </p>
                </div>
              </div>
            </div>

            {/* Share Option Grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full mb-4 sm:mb-5 shrink-0">
              <button
                onClick={() => {
                  window.location.href = `https://${newDomain}${window.location.pathname}${window.location.search}`;
                }}
                className={`flex items-center justify-center gap-1.5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all active:scale-95 border bg-[#0b0c16] border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white hover:border-zinc-700`}
              >
                <Globe size={13} />
                Go to New Domain
              </button>
              <button
                onClick={handleShare}
                className={`flex items-center justify-center gap-1.5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all active:scale-95 border ${
                  shared 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-[#0b0c16] border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white hover:border-zinc-700'
                }`}
              >
                {shared ? <Check size={13} /> : <Share2 size={13} />}
                {shared ? 'Text Copied' : 'Share Domain'}
              </button>
            </div>

            {/* Primary CTA */}
            <button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-xs sm:text-sm py-3 sm:py-3.5 rounded-lg sm:rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/20 shrink-0"
            >
              I've Bookmarked & Saved it, Start Watching!
            </button>

          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
