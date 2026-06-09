'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useScrollRestore() {
  const pathname = usePathname();

  // Scroll restoration logic
  useEffect(() => {
    const key = `scroll_${pathname}`;
    const saved = sessionStorage.getItem(key);
    
    if (saved) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: parseInt(saved, 10), behavior: 'instant' });
      });
    }

    const saveScroll = () => {
      sessionStorage.setItem(key, String(window.scrollY));
    };

    window.addEventListener('scrollend', saveScroll, { passive: true });
    
    return () => window.removeEventListener('scrollend', saveScroll);
  }, [pathname]);

  // History stack tracking logic to handle back button behavior properly
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const sessionStack = sessionStorage.getItem('app_history_stack');
      let stack: string[] = sessionStack ? JSON.parse(sessionStack) : [];

      const isBackNav = sessionStorage.getItem('is_back_nav') === 'true';

      if (isBackNav) {
        // Clear back nav flag
        sessionStorage.removeItem('is_back_nav');
        
        // Find index of pathname in stack to slice it
        const idx = stack.lastIndexOf(pathname);
        if (idx !== -1) {
          stack = stack.slice(0, idx + 1);
        } else {
          stack = [pathname];
        }
      } else {
        // Normal forward navigation
        if (stack.length === 0) {
          stack.push(pathname);
        } else {
          const currentTop = stack[stack.length - 1];
          if (currentTop !== pathname) {
            stack.push(pathname);
          }
        }
      }

      sessionStorage.setItem('app_history_stack', JSON.stringify(stack));
    } catch (e) {
      console.error('Failed to update history stack:', e);
    }
  }, [pathname]);

  // Listen for browser popstate (back/forward) to set back nav flag
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      sessionStorage.setItem('is_back_nav', 'true');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
}
