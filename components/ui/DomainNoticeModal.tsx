'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, Copy, Check, Share2, Globe, Sparkles, Bookmark } from 'lucide-react';

interface DomainNoticeModalProps {
  triggerShow: boolean;
}

export function DomainNoticeModal({ triggerShow }: DomainNoticeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [mounted, setMounted] = useState(false);
  const newDomain = 'zivox-tv.vercel.app';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (triggerShow) {
      // Show every time playback is triggered
      setIsOpen(true);
    }
  }, [triggerShow]);

  // Lock body scroll when modal is open for a premium application feel
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
      // Fallback: Copy share message to clipboard
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
    setIsOpen(false);
  };

  if (!mounted || !isOpen) return null;

  // Render via portal directly into document.body to prevent parent container transformation issues
  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal Dialog Box */}
      <div className="relative w-full max-w-lg bg-[#05070f]/95 border border-blue-500/20 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(59,130,246,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cinematic Ambient Blue Glow */}
        <div className="absolute top-[-25%] left-[50%] -translate-x-[50%] w-[90%] h-[60%] bg-blue-600/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[0%] w-[45%] h-[35%] bg-cyan-500/5 rounded-full blur-[70px] pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          
          {/* Top Banner Alert Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] uppercase font-black tracking-widest mb-6">
            <Globe size={12} className="animate-pulse" />
            Domain Migration Alert
          </div>

          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight leading-tight mb-3">
            IMPORTANT <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">DOMAIN MIGRATION</span>
          </h2>

          <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-6 max-w-md">
            Our current address will soon stop working. Please copy and save the new domain below to ensure you have uninterrupted access to ZIVOX.
          </p>

          {/* Domain Display Card */}
          <div className="w-full bg-blue-950/20 border border-blue-500/15 rounded-2xl p-4 mb-6 relative group overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <span className="block text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">New Home Domain</span>
            
            <div className="flex items-center justify-between gap-4">
              <span className="text-lg md:text-xl font-mono font-black text-white select-all">
                {newDomain}
              </span>
              
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 border ${
                  copied 
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' 
                    : 'bg-blue-500/10 border-blue-500/25 text-blue-400 hover:bg-blue-500/20'
                }`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Warning / DNS Info Text */}
          <div className="text-left w-full mb-4 px-1">
            <p className="text-[10px] text-zinc-500 leading-normal">
              ⚠️ <span className="font-bold text-zinc-400">Notice:</span> The new domain may not be active immediately, but it will be fully live and streaming within 24 hours.
            </p>
          </div>

          {/* Admin Message */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-6 text-left w-full relative">
            <div className="absolute top-3 right-3 text-blue-500/20">
              <Sparkles size={14} />
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 shrink-0 flex items-center justify-center text-white font-black text-xs shadow-md shadow-blue-500/20">
                A
              </div>
              <div>
                <span className="block text-xs font-bold text-blue-300 uppercase tracking-wider">Message from the Admin</span>
                <p className="text-zinc-400 text-[11px] md:text-xs leading-relaxed mt-1">
                  "ZIVOX runs purely on local storage for your watch progress and history without ads or tracking. Since this site is moving, please **bookmark this page now** (Ctrl+D or ⌘+D) and share the new link with your friends so we all stay connected. Happy streaming!"
                </p>
              </div>
            </div>
          </div>

          {/* Share Option Grid */}
          <div className="grid grid-cols-2 gap-3 w-full mb-6">
            <button
              onClick={handleCopy}
              className={`flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold transition-all active:scale-95 border ${
                copied 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-[#0b0c16] border-zinc-800 text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              {copied ? <Check size={14} /> : <Bookmark size={14} />}
              {copied ? 'Domain Saved' : 'Save Domain'}
            </button>
            <button
              onClick={handleShare}
              className={`flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold transition-all active:scale-95 border ${
                shared 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-[#0b0c16] border-zinc-800 text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              {shared ? <Check size={14} /> : <Share2 size={14} />}
              {shared ? 'Message Copied' : 'Share with Friends'}
            </button>
          </div>

          {/* Primary CTA */}
          <button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-sm py-3.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/20"
          >
            I've Bookmarked & Saved it, Start Watching!
          </button>

        </div>
      </div>
    </div>,
    document.body
  );
}
