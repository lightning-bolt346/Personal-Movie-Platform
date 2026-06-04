'use client';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useRef } from 'react';

// Note: AnimatePresence mode="wait" in the App Router layout causes blank screens
// because it blocks children from rendering until exit animation completes.
// Solution: CSS keyframe fade-in on pathname change — zero render blocking.
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.animation = 'none';
    // Force reflow so animation restarts
    void el.offsetHeight;
    el.style.animation = 'page-fade-in 0.28s cubic-bezier(0.22,1,0.36,1) both';
  }, [pathname]);

  return (
    <div
      ref={ref}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        animation: 'page-fade-in 0.28s cubic-bezier(0.22,1,0.36,1) both',
      }}
    >
      {children}
    </div>
  );
}
