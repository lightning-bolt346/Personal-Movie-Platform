'use client';
import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      onClick={scrollUp}
      aria-label="Scroll to top"
      className={`fixed bottom-24 md:bottom-8 right-5 md:right-8 z-[9999] flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 shadow-2xl ${
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{
        background: 'linear-gradient(135deg, #e50914 0%, #b00610 100%)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 4px 24px rgba(229,9,20,0.35), 0 2px 8px rgba(0,0,0,0.5)',
      }}
    >
      <ChevronUp size={20} className="text-white" strokeWidth={2.5} />
    </button>
  );
}
