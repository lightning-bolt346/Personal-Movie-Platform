'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { ShareModal } from '@/components/ui/ShareModal';

interface Props {
  title: string;
  url?: string;
}

export function CollectionShareButton({ title, url }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? (url || window.location.href) : url;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-2.5 px-6 py-3 w-fit rounded-xl border border-white/10 bg-void-900/60 hover:bg-white hover:text-black backdrop-blur-md text-white transition-all active:scale-95 font-bold text-sm shadow-xl"
      >
        <Share2 size={18} className="transition-transform group-hover:scale-110" />
        <span>Share with anyone</span>
      </button>
      
      <ShareModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title={`Check out ${title} on ZIVOX`} 
        shareUrl={shareUrl} 
      />
    </>
  );
}
