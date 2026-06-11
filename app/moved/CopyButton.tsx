'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <button 
      onClick={handleCopy}
      className="w-full sm:w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-colors active:scale-95"
      title="Copy URL"
    >
      {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} className="text-white" />}
    </button>
  );
}
