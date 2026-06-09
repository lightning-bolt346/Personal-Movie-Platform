'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Media } from '@/types/tmdb';
import { getImageUrl } from '@/lib/tmdb';
import { generateSlug, cn } from '@/lib/utils';
import { Sparkles, Sun, Moon, CloudSun, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimeBasedWidgetProps {
  items: Media[];
  variant?: 'desktop' | 'mobile';
}

const formatOverview = (text: string) => {
  if (!text) return '';
  const trimmed = text.trim();
  const maxLength = 140;
  if (trimmed.length <= maxLength) {
    const lastChar = trimmed.slice(-1);
    if (!['.', '!', '?', '"', '\'', ')'].includes(lastChar)) {
      return trimmed + '...';
    }
    return trimmed;
  }
  let truncated = trimmed.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.75) {
    truncated = truncated.substring(0, lastSpace);
  }
  return truncated.trim() + '...';
};

export function TimeBasedWidget({ items, variant = 'desktop' }: TimeBasedWidgetProps) {
  const [greeting, setGreeting] = useState('Good Evening');
  const [icon, setIcon] = useState(<Moon size={18} className="text-crimson-400" />);
  const [timeContext, setTimeContext] = useState('trending tonight');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      setGreeting('Good Morning');
      setIcon(<Sun size={18} className="text-yellow-400" />);
      setTimeContext('to start your day');
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good Afternoon');
      setIcon(<CloudSun size={18} className="text-orange-400" />);
      setTimeContext('for your afternoon break');
    } else if (hour >= 17 && hour < 22) {
      setGreeting('Good Evening');
      setIcon(<Moon size={18} className="text-crimson-400" />);
      setTimeContext('trending tonight');
    } else {
      setGreeting('Late Night');
      setIcon(<Sparkles size={18} className="text-purple-400" />);
      setTimeContext('for the night owls');
    }
  }, []);

  if (!mounted || !items || items.length === 0) return null;

  // Grab one random item from the pool for the widget recommendation
  const randomItem = items[Math.floor(Math.random() * items.length)];
  const title = randomItem.title || randomItem.name || '';
  const isMovie = randomItem.media_type === 'movie' || !randomItem.name;
  const href = `/watch/${isMovie ? 'movie' : 'tv'}/${generateSlug(randomItem.id.toString(), title)}`;

  // Mobile Variant (FIX 7: compact 48px height banner strip)
  if (variant === 'mobile') {
    return (
      <Link href={href} className="block px-4 mb-2">
        <div className="w-full h-[48px] bg-void-900 border border-white/5 rounded-lg flex items-center justify-between px-3 relative overflow-hidden transition-all active:scale-[0.98]">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-crimson-500" />
          
          <div className="flex items-center gap-2.5 z-10">
            {icon}
            <div className="flex flex-col">
              <span className="text-white/90 text-[13px] font-semibold leading-tight">{greeting}</span>
              <span className="text-white/50 text-[10px] leading-tight truncate max-w-[200px]">Watch: {title}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-crimson-500/20 z-10">
            <Play size={12} className="text-crimson-400 fill-crimson-400 ml-0.5" />
          </div>
          
          {/* Subtle background glow from the poster */}
          {randomItem.backdrop_path && (
            <div className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none z-0">
              <Image 
                src={getImageUrl(randomItem.backdrop_path, 'w500')} 
                alt="" 
                fill 
                className="object-cover blur-md" 
                unoptimized
              />
            </div>
          )}
        </div>
      </Link>
    );
  }

  // Desktop Variant
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="hidden md:flex flex-col mb-10 w-full max-w-[1800px] mx-auto px-14"
    >
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-xl font-display font-bold text-white tracking-tight">
          {greeting}, <span className="text-white/50 font-medium text-lg">here's {timeContext}</span>
        </h2>
      </div>
      
      <Link 
        href={href}
        className="group relative w-full h-[280px] rounded-2xl overflow-hidden bg-void-900 border border-white/5 hover:border-white/10 transition-all duration-500 shadow-2xl block"
      >
        {/* Animated Background Glow */}
        <div className="absolute inset-0 bg-crimson-500/20 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700" />

        <Image
          src={getImageUrl(randomItem.backdrop_path || randomItem.poster_path, 'original')}
          alt={title}
          fill
          className="object-cover opacity-60 group-hover:opacity-90 transition-all duration-700 group-hover:scale-[1.03] ease-out transform"
        />
        
        {/* Layered cinematic gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        
        <div className="absolute inset-0 p-10 flex flex-col justify-center max-w-2xl z-10">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xs font-bold text-crimson-400 uppercase tracking-widest mb-3 flex items-center gap-2"
          >
            <Sparkles size={14} className="animate-pulse" /> Featured Pick
          </motion.div>
          
          <h3 className="text-4xl md:text-5xl font-display font-black text-white mb-3 leading-tight drop-shadow-lg group-hover:translate-x-2 transition-transform duration-500 ease-out">
            {title}
          </h3>
          
          <p className="text-white/60 text-sm md:text-base line-clamp-2 mb-8 max-w-xl group-hover:text-white/80 transition-colors duration-500">
            {formatOverview(randomItem.overview)}
          </p>
          
          <div className="flex items-center gap-4">
            <div className="relative overflow-hidden flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-bold text-sm hover:scale-105 hover:bg-zinc-100 transition-all duration-300 group/btn shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <Play size={16} className="fill-black" /> 
              <span>Watch Now</span>
              
              {/* Button Shine Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]" />
            </div>
            
            <div className="px-4 py-3 rounded-full bg-white/5 border border-white/10 text-white font-medium text-sm hover:bg-white/10 transition-colors duration-300 backdrop-blur-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
              More Info
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}