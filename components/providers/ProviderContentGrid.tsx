'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Provider } from '@/lib/providers';
import { Media } from '@/types/tmdb';
import { MediaCard } from '@/components/media/MediaCard';
import { discoverGlobalProviderAction, searchProviderAction } from '@/app/actions';
import { Loader2 } from 'lucide-react';

// Use a subset of regions for global fetch to avoid rate limits
const GLOBAL_REGIONS = ['US', 'IN', 'GB', 'JP', 'KR', 'ES', 'FR', 'DE'];

interface ProviderContentGridProps {
  provider: Provider;
}

export function ProviderContentGrid({ provider }: ProviderContentGridProps) {
  const searchParams = useSearchParams();

  const activeType = (searchParams.get('type') || 'movie') as 'movie' | 'tv';
  const activeLang = searchParams.get('lang') || '';
  const activeGenre = searchParams.get('genre') || '';
  const activeSort = searchParams.get('sort') || 'popularity.desc';
  const activeRegion = searchParams.get('region') || 'ALL';
  const activeSearch = searchParams.get('q') || '';
  
  const [items, setItems] = useState<Media[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);

  const fetchItems = useCallback(async (pageNum: number, reset = false) => {
    try {
      setLoading(true);
      const params: Record<string, string> = {
        sort_by: activeSort,
        page: pageNum.toString()
      };
      
      if (activeLang) params.with_original_language = activeLang;
      if (activeGenre) params.with_genres = activeGenre;

      let data;
      
      if (activeSearch) {
        // Run provider search
        data = await searchProviderAction(activeSearch, provider.id.toString(), activeType, activeRegion, pageNum);
      } else if (activeRegion === 'ALL') {
        // Fetch from multiple regions concurrently
        // Include provider's native region in the list to ensure local hits
        const regionsToHit = Array.from(new Set([provider.region, ...GLOBAL_REGIONS]));
        data = await discoverGlobalProviderAction(provider.id.toString(), activeType, params, regionsToHit);
      } else {
        // Single region fetch
        data = await discoverGlobalProviderAction(provider.id.toString(), activeType, params, [activeRegion]);
      }
      
      setItems(prev => {
        if (reset) return data.results || [];
        // Deduplicate
        const newItems = data.results || [];
        const existingIds = new Set(prev.map(i => i.id));
        return [...prev, ...newItems.filter((i: Media) => !existingIds.has(i.id))];
      });
      
      setHasMore(data.page < data.total_pages && data.page < 500); 
    } catch (error) {
      console.error('Failed to fetch provider content:', error);
    } finally {
      setLoading(false);
    }
  }, [activeType, activeLang, activeGenre, activeSort, provider.id, activeRegion, provider.region, activeSearch]);

  useEffect(() => {
    setPage(1);
    fetchItems(1, true);
  }, [fetchItems]);

  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchItems(nextPage, false);
      }
    }, { rootMargin: '300px' });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, page, fetchItems]);

  return (
    <div className="w-full flex flex-col">
      {items.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center w-full">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5 w-full">
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
              <div key={`skel-${i}`} className="w-full aspect-[2/3] bg-zinc-900/50 rounded-xl animate-pulse border border-white/5" />
            ))
          )}
        </div>
      )}
      
      {loading && items.length > 0 && (
        <div className="w-full py-8 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-white/50" />
        </div>
      )}
    </div>
  );
}
