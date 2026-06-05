'use client';
import { useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Media } from '@/types/tmdb';
import { MediaCard } from './MediaCard';
import { motion } from 'motion/react';

interface Top10RowProps {
  title: string;
  items: Media[];
}

function Top10Card({ item, index }: { item: Media; index: number }) {
  return (
    <div
      className="relative flex items-end group/top10 flex-shrink-0"
      style={{ width: 'clamp(210px, 24vw, 290px)' }}
    >
      <div
        className="absolute bottom-[-16px] left-0 z-0 text-transparent pointer-events-none select-none font-display font-black leading-none tracking-tighter"
        style={{ fontSize: 'clamp(9rem, 18vw, 15rem)', WebkitTextStroke: '3px rgba(255,255,255,0.2)' }}
      >
        <span className="group-hover/top10:text-white transition-colors duration-300">
          {index + 1}
        </span>
      </div>
      <div className="relative z-10 w-[60%] ml-auto h-full">
        <MediaCard media={item} variant="top10" />
      </div>
    </div>
  );
}

export function Top10Row({ title, items }: Top10RowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'right' ? el.clientWidth * 0.75 : -(el.clientWidth * 0.75), behavior: 'smooth' });
    setTimeout(checkScroll, 400);
  };


  if (!items || items.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative group/row"
    >
      <div className="w-full max-w-[1800px] mx-auto px-6 md:px-14 mb-4">
        <h2 className="font-display font-black text-white tracking-tighter text-3xl md:text-4xl flex items-center gap-3">
          <span className="text-4xl md:text-5xl">🏆</span> {title}
        </h2>
      </div>

      <button
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        className={`absolute left-6 md:left-14 top-1/2 -translate-y-1/2 z-30 w-12 h-12
          flex items-center justify-center rounded-full transition-[opacity,transform] duration-200
          ${canScrollLeft ? 'opacity-0 group-hover/row:opacity-100 hover:scale-110 active:scale-95' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(6,6,6,0.9)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 4px 24px rgba(0,0,0,0.8)' }}
      >
        <ChevronLeft size={24} className="text-white" />
      </button>
      <button
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        className={`absolute right-6 md:right-14 top-1/2 -translate-y-1/2 z-30 w-12 h-12
          flex items-center justify-center rounded-full transition-[opacity,transform] duration-200
          ${canScrollRight ? 'opacity-0 group-hover/row:opacity-100 hover:scale-110 active:scale-95' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(6,6,6,0.9)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 4px 24px rgba(0,0,0,0.8)' }}
      >
        <ChevronRight size={24} className="text-white" />
      </button>

      <div className="absolute left-0 top-0 bottom-0 w-[4%] z-20 pointer-events-none transition-opacity duration-300"
        style={{ background: 'linear-gradient(to right, #05010a, transparent)', opacity: canScrollLeft ? 1 : 0 }} />
      <div className="absolute right-0 top-0 bottom-0 w-[4%] z-20 pointer-events-none transition-opacity duration-300"
        style={{ background: 'linear-gradient(to left, #05010a, transparent)', opacity: canScrollRight ? 1 : 0 }} />

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-2 overflow-x-auto overflow-y-hidden no-scrollbar scroll-smooth overscroll-x-contain"
        style={{
          paddingLeft: 'max(1.5rem, calc((100vw - 1800px) / 2 + 3.5rem))',
          paddingRight: 'max(1.5rem, calc((100vw - 1800px) / 2 + 3.5rem))',
          paddingTop: '64px',
          paddingBottom: '32px',
          touchAction: 'pan-x pan-y',
        }}
      >
        {items.slice(0, 10).map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="h-full">
            <Top10Card item={item} index={idx} />
          </div>
        ))}
        <div className="flex-shrink-0 w-8" aria-hidden="true" />
      </div>
    </motion.section>
  );
}
