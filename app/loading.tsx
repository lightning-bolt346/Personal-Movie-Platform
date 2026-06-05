'use client';
import { usePathname } from 'next/navigation';
import { ThemedLoader, LoaderTheme } from '@/components/ui/ThemedLoader';

export default function Loading() {
  const pathname = usePathname() || '';
  
  let theme: LoaderTheme = 'home';
  if (pathname.startsWith('/anime')) theme = 'anime';
  else if (pathname.startsWith('/movies')) theme = 'movies';
  else if (pathname.startsWith('/tv')) theme = 'tv';

  return <ThemedLoader theme={theme} />;
}
