'use client';
import { useState, useEffect } from 'react';
import { AlertCircle, Copy, Check, ExternalLink, Bookmark, Share2, Sparkles } from 'lucide-react';

interface DomainNoticeModalProps {
  triggerShow: boolean;
}

export function DomainNoticeModal({ triggerShow }: DomainNoticeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const newDomain = 'zivox-tv.vercel.app';

  useEffect(() => {
    if (triggerShow) {
      const isClosed = localStorage.getItem('zivox-domain-notice-closed');
      if (!isClosed) {
        // Delay opening slightly for a smoother transition
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [triggerShow]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`https://${newDomain}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleClose = () => {
    localStorage.setItem('zivox-domain-notice-closed', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#0a0a14]/90 border border-blue-500/20 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Blue Ambient Glow behind content */}
        <div className="absolute top-[-20%] left-[50%] -translate-x-[50%] w-[80%] h-[50%] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[0%] w-[40%] h-[30%] bg-cyan-500/5 rounded-full blur-[60px] pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] uppercase font-black tracking-widest mb-6">
            <AlertCircle size={12} className="animate-pulse" />
            Critical Service Update
          </div>

          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight leading-tight mb-3">
            We Are Changing Our <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Domain</span>
          </h2>

          <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-6 max-w-md">
            To ensure ZIVOX remains fully online and immune to interruptions, we are migrating to a brand-new, private domain in the next <span className="text-blue-400 font-bold">24 hours</span>.
          </p>

          {/* Domain Box */}
          <div className="w-full bg-blue-950/20 border border-blue-500/15 rounded-2xl p-4 mb-6 relative group overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <span className="block text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">New Streaming Domain</span>
            
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
                {copied ? 'Copied' : 'Copy URL'}
              </button>
            </div>
          </div>

          {/* PM / CEO Message */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-6 text-left w-full">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 shrink-0 flex items-center justify-center text-white font-black text-xs shadow-md">
                Z
              </div>
              <div>
                <span className="block text-xs font-bold text-white uppercase tracking-wider">Message from the CEO</span>
                <p className="text-zinc-400 text-[11px] md:text-xs leading-normal mt-1">
                  "Dear community, ZIVOX runs purely on local storage for you, without trackings or ads. Since we're moving soon, please **bookmark the domain now** and share it with friends via Telegram or Discord so we all stay connected. Happy streaming!"
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={handleClose}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-sm py-3 px-6 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/20"
            >
              Saved it, start watching!
            </button>
            <a
              href={`https://${newDomain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 border border-zinc-800 bg-void-900 hover:bg-void-800 text-zinc-300 hover:text-white font-bold text-sm py-3 px-6 rounded-xl transition-all active:scale-95"
            >
              Test New URL <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
