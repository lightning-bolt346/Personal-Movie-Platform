'use client';
import { ReactLenis, useLenis } from 'lenis/react';
import { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export { useLenis };

function ScrollResetter() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      gestureOrientation: 'vertical'
    }}>
      <ScrollResetter />
      {children}
    </ReactLenis>
  );
}
