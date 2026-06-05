'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Provider } from '@/lib/providers';
import { Media } from '@/types/tmdb';
import { MediaCard } from '@/components/media/MediaCard';
import { usePreferences } from '@/hooks/usePreferences';

interface ProviderContentGridProps {
  provider: Provider;
}

export function ProviderContentGrid({ provider }: ProviderContentGridProps) {
  const searchParams = useSearchParams();
  const { preferences } = usePreferences();

  const activeType = searchParams.get('type') || 'movie';
  const activeLang = searchParams.get('lang') || '';
  const activeGenre = searchParams.get('genre') || '';
  const activeSort = searchParams.get('sort') || 'popularity.desc';
  const activeRegion = searchParams.get('region') || preferences.country || 'US';
  
  const [items, setItems] = useState<Media[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);

  const fetchItems = useCallback(async (pageNum: number, reset = false) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('with_watch_providers', provider.id.toString());
      params.append('watch_region', activeRegion);
      params.append('sort_by', activeSort);
      params.append('page', pageNum.toString());
      if (activeLang) params.append('with_original_language', activeLang);
      if (activeGenre) params.append('with_genres', activeGenre);

      // We fetch from our own Next.js API route to proxy the TMDB request safely on the client
      // Wait, we can just fetch via a server action or API route.
      // Since TMDB tokens shouldn't be exposed, let's use an API route or server action.
      // Wait! Do we have a server action for this? 
      // Instead, we can create a simple Server Action in lib/actions.ts or similar.
      // For now, let's just assume we hit a local API route `api/discover?type=${activeType}&...`
      const res = await fetch(`/api/discover?type=${activeType}&${params.toString()}`);
      const data = await res.json();
      
      setItems(prev => {
        if (reset) return data.results || [];
        // Deduplicate
        const newItems = data.results || [];
        const existingIds = new Set(prev.map(i => i.id));
        return [...prev, ...newItems.filter((i: Media) => !existingIds.has(i.id))];
      });
      
      setHasMore(data.page < data.total_pages && data.page < 500); // TMDB limits to 500 pages
    } catch (error) {
      console.error('Failed to fetch provider content:', error);
    } finally {
      setLoading(false);
    }
  }, [activeType, activeLang, activeGenre, activeSort, provider.id, activeRegion]);

  useEffect(() => {
    setPage(1);
    fetchItems(1, true);
  }, [fetchItems]);

  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => {
          const next = prev + 1;
          fetchItems(next);
          return next;
        });
      }
    }, { rootMargin: '300px' });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, fetchItems]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {items.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-zinc-500 text-lg">No content found matching these filters.</p>
          <button 
            onClick={() => {
            window.history.pushState({}, '', `/providers/${provider.slug}`);
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="mt-4 px-6 py-2 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {items.map((item, index) => {
            if (items.length === index + 1) {
              return (
                <div ref={lastElementRef} key={`${item.id}-${index}`} className="w-full">
                  <MediaCard media={item} />
                </div>
              );
            }
            return (
              <div key={`${item.id}-${index}`} className="w-full">
                <MediaCard media={item} />
              </div>
            );
          })}
          
          {loading && (
            // Skeleton loaders
            Array.from({ length: 10 }).map((_, i) => (
              <div key={`skel-${i}`} className="w-full aspect-[2/3] bg-zinc-900 rounded-xl animate-pulse" />
            ))
          )}
        </div>
      )}
    </div>
  );
}
