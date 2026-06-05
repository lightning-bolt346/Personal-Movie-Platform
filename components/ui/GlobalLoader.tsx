'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { ThemedLoader, LoaderTheme } from './ThemedLoader';

export function GlobalLoader() {
  const pathname = usePathname();
  const validPaths = ['/', '/movies', '/tv', '/anime'];
  const [isLoading, setIsLoading] = useState(() => validPaths.includes(pathname));
  const [theme, setTheme] = useState<LoaderTheme>(() => getThemeFromPath(pathname));

  function getThemeFromPath(p: string): LoaderTheme {
    if (p.startsWith('/anime')) return 'anime';
    if (p.startsWith('/movies')) return 'movies';
    if (p.startsWith('/tv')) return 'tv';
    return 'home';
  }

  // Lock body scroll when loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  useEffect(() => {
    // Listen for manual trigger from Navbar
    const handleTrigger = (e: Event) => {
      const customEvent = e as CustomEvent;
      const targetPath = customEvent.detail;
      setTheme(getThemeFromPath(targetPath));
      setIsLoading(true);
      
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };

    window.addEventListener('trigger-loader', handleTrigger);
    return () => window.removeEventListener('trigger-loader', handleTrigger);
  }, []);

  useEffect(() => {
    // Auto-trigger on direct URL loads or normal next.js navigation
    if (!validPaths.includes(pathname)) {
      setIsLoading(false);
      return;
    }

    setTheme(getThemeFromPath(pathname));
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.15, filter: "blur(10px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[10000] pointer-events-none"
        >
          <ThemedLoader theme={theme} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
