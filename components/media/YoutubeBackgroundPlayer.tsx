'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/tmdb';

interface YoutubeBackgroundPlayerProps {
  videoKey: string | null;
  backdropPath: string | null;
  title: string;
}

export function YoutubeBackgroundPlayer({ videoKey, backdropPath, title }: YoutubeBackgroundPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!videoKey) {
      setFailed(true);
      return;
    }

    setIsPlaying(false);
    setFailed(false);

    let isMounted = true;
    
    // Generous 12-second failsafe timeout to prevent premature cutoffs on slow connections
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        // Dev-only: track failsafe triggers without leaking video keys to production
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.debug('[YoutubeBackgroundPlayer] Failsafe triggered, falling back to poster.');
        }
        setFailed(true);
      }
    }, 12000);

    const handleMessage = (e: MessageEvent) => {
      if (!isMounted) return;
      if (!e.origin.includes('youtube.com') && !e.origin.includes('youtube-nocookie.com')) return;

      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        
        // Handle player state changes
        if (data.event === 'infoDelivery' && data.info) {
          if (data.info.playerState === 1) {
            setIsPlaying(true);
            clearTimeout(timeoutId);
          }
          if (data.info.errorCode) {
            setFailed(true);
            clearTimeout(timeoutId);
          }
        }
        
        if (data.event === 'onStateChange' && data.info === 1) {
          setIsPlaying(true);
          clearTimeout(timeoutId);
        }

        if (data.event === 'onError') {
          setFailed(true);
          clearTimeout(timeoutId);
        }
      } catch (err) {}
    };

    window.addEventListener('message', handleMessage);

    return () => {
      isMounted = false;
      window.removeEventListener('message', handleMessage);
      clearTimeout(timeoutId);
    };
  }, [videoKey]);

  return (
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
      {/* 1. Backdrop Poster (Always rendered behind, visible initially or if playback fails) */}
      <Image
        src={getImageUrl(backdropPath, 'original')}
        alt={title}
        fill
        sizes="100vw"
        className={`object-cover transition-opacity duration-1000 ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-60'}`}
        priority
      />

      {/* 2. YouTube Background Iframe (Fades in dynamically only when play is confirmed!) */}
      {videoKey && !failed && (
        <div 
          className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none transition-opacity duration-1000 ${
            isPlaying ? 'opacity-60' : 'opacity-0'
          }`}
        >
          <iframe
            ref={iframeRef}
            src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&mute=1&controls=0&disablekb=1&loop=1&playlist=${videoKey}&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&enablejsapi=1`}
            className="w-full h-full md:w-[150%] md:h-[150%] md:-translate-x-[16.6%] md:-translate-y-[16.6%] max-w-none border-0"
            allow="autoplay; encrypted-media"
            style={{ border: 0 }}
          />
        </div>
      )}
    </div>
  );
}
