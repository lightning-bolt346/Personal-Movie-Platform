'use client';
import { useEffect, useState } from 'react';
import { usePreferences } from '@/hooks/usePreferences';
import { discoverMedia } from '@/app/actions';
import { Media } from '@/types/tmdb';
import { MediaGrid } from '@/components/media/MediaGrid';
import { ThemedLoader } from '@/components/ui/ThemedLoader';

export function RecommendedClient({ mediaType }: { mediaType: 'movie' | 'tv' | 'all' }) {
  const { preferences } = usePreferences();
  const [recommendations, setRecommendations] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (preferences.preferredGenres.length === 0 && preferences.originalLanguage.length === 0) {
      if (preferences.locationAutoDetected) {
         // Auto location done but no prefs? Default empty means global fetch. 
      } else {
         // Wait for auto location
         return;
      }
    }

    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const baseParams: Record<string, string> = {
          sort_by: 'popularity.desc',
          include_adult: preferences.adultContent ? 'true' : 'false'
        };

        if (preferences.preferredGenres.length > 0) {
          baseParams.with_genres = preferences.preferredGenres.join('|');
        }

        const langs = preferences.originalLanguage || [];
        const nativeLangs = langs.filter(l => l !== 'en');
        const hasEnglish = langs.includes('en');

        let combinedResults: any[] = [];

        const fetchByType = async (type: 'movie' | 'tv') => {
          let typeResults: any[] = [];
          if (nativeLangs.length > 0 && hasEnglish) {
            const nativeData = await discoverMedia(type, { ...baseParams, with_original_language: nativeLangs.join('|') });
            const enData = await discoverMedia(type, { ...baseParams, with_original_language: 'en' });
            
            let natives = (nativeData.results || []).slice(0, 20);
            const maxEnglish = Math.floor(natives.length * (3 / 7));
            let engs = natives.length === 0 ? (enData.results?.slice(0, 20) || []) : (enData.results?.slice(0, maxEnglish || 6) || []);

            const finalArr = [];
            let nIdx = 0, eIdx = 0;
            while (nIdx < natives.length || eIdx < engs.length) {
              if (nIdx < natives.length) finalArr.push(natives[nIdx++]);
              if (nIdx < natives.length) finalArr.push(natives[nIdx++]);
              if (eIdx < engs.length) finalArr.push(engs[eIdx++]);
            }
            typeResults = finalArr;
          } else if (langs.length > 0) {
            const p1 = await discoverMedia(type, { ...baseParams, with_original_language: langs.join('|'), page: '1' });
            const p2 = await discoverMedia(type, { ...baseParams, with_original_language: langs.join('|'), page: '2' });
            typeResults = [...(p1.results || []), ...(p2.results || [])];
          } else {
            const p1 = await discoverMedia(type, { ...baseParams, page: '1' });
            const p2 = await discoverMedia(type, { ...baseParams, page: '2' });
            typeResults = [...(p1.results || []), ...(p2.results || [])];
          }
          return typeResults.map(item => ({ ...item, media_type: type }));
        };

        if (mediaType === 'all') {
          const [movies, tvShows] = await Promise.all([fetchByType('movie'), fetchByType('tv')]);
          
          let mIdx = 0, tIdx = 0;
          while (mIdx < movies.length || tIdx < tvShows.length) {
            if (mIdx < movies.length) combinedResults.push(movies[mIdx++]);
            if (mIdx < movies.length) combinedResults.push(movies[mIdx++]);
            if (tIdx < tvShows.length) combinedResults.push(tvShows[tIdx++]);
          }
        } else {
          combinedResults = await fetchByType(mediaType);
        }

        const seen = new Set();
        const uniqueResults = combinedResults.filter(item => {
           if (seen.has(item.id)) return false;
           seen.add(item.id);
           return true;
        });

        if (uniqueResults.length > 0) {
          setRecommendations(uniqueResults);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [preferences.preferredGenres, preferences.adultContent, preferences.originalLanguage, preferences.locationAutoDetected, mediaType]);

  if (loading) {
    return <div className="mt-32"><ThemedLoader /></div>;
  }

  if (recommendations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center mt-32">
        <p className="text-6xl mb-4" style={{ filter: 'grayscale(1)', opacity: 0.3 }}>🎬</p>
        <p className="text-xl font-display font-bold text-white/30 mb-1">No recommendations found</p>
        <p className="text-sm text-white/20">Try adjusting your preferences or watching more content.</p>
      </div>
    );
  }

  const titles = {
    'movie': 'Recommended Movies',
    'tv': 'Recommended TV Shows',
    'all': 'Recommended For You'
  };

  return (
    <div className="w-full mt-32 max-w-[1800px] mx-auto min-h-screen">
      <MediaGrid title={titles[mediaType]} items={recommendations} />
    </div>
  );
}
