'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Provider } from '@/lib/providers';
import { usePreferences } from '@/hooks/usePreferences';
import { Film, Tv, Globe } from 'lucide-react';
import React from 'react';
import { CustomDropdown } from '@/components/ui/CustomDropdown';

interface ProviderSidebarProps {
  provider: Provider;
}

const COUNTRY_CHIPS = [
  { id: 'ALL', flag: '🌍', label: 'Global (All Regions)' },
  { id: 'US', flag: '🇺🇸', label: 'United States' },
  { id: 'IN', flag: '🇮🇳', label: 'India' },
  { id: 'GB', flag: '🇬🇧', label: 'United Kingdom' },
  { id: 'JP', flag: '🇯🇵', label: 'Japan' },
  { id: 'KR', flag: '🇰🇷', label: 'South Korea' },
  { id: 'CA', flag: '🇨🇦', label: 'Canada' },
  { id: 'AU', flag: '🇦🇺', label: 'Australia' },
  { id: 'FR', flag: '🇫🇷', label: 'France' },
  { id: 'DE', flag: '🇩🇪', label: 'Germany' },
  { id: 'ES', flag: '🇪🇸', label: 'Spain' }
];

const LANGUAGES = [
  { value: '', label: 'Any Language' },
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'es', label: 'Spanish' },
  { value: 'ko', label: 'Korean' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ta', label: 'Tamil' },
  { value: 'te', label: 'Telugu' },
];

const GENRES = [
  { value: '', label: 'All Genres' },
  { value: '28', label: 'Action' },
  { value: '12', label: 'Adventure' },
  { value: '16', label: 'Animation' },
  { value: '35', label: 'Comedy' },
  { value: '80', label: 'Crime' },
  { value: '99', label: 'Documentary' },
  { value: '18', label: 'Drama' },
  { value: '10751', label: 'Family' },
  { value: '14', label: 'Fantasy' },
  { value: '36', label: 'History' },
  { value: '27', label: 'Horror' },
  { value: '10402', label: 'Music' },
  { value: '9648', label: 'Mystery' },
  { value: '10749', label: 'Romance' },
  { value: '878', label: 'Science Fiction' },
  { value: '53', label: 'Thriller' },
  { value: '10752', label: 'War' },
  { value: '37', label: 'Western' }
];

const SORTS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'primary_release_date.desc', label: 'Newest Releases' },
  { value: 'primary_release_date.asc', label: 'Oldest Releases' }
];

export function ProviderSidebar({ provider }: ProviderSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { preferences } = usePreferences();

  const activeType = searchParams.get('type') || 'movie';
  const activeGenre = searchParams.get('genre') || '';
  const activeSort = searchParams.get('sort') || 'popularity.desc';
  const activeRegion = searchParams.get('region') || 'ALL';
  const activeLang = searchParams.get('lang') || '';

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'ALL') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full md:w-64 shrink-0 flex flex-col gap-8 md:sticky md:top-24 h-max pb-8 z-20">
      
      {/* Media Type Tabs */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest px-1">Content Type</h3>
        <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-white/5">
          {provider.categories.includes('movie') && (
            <button
              onClick={() => updateParam('type', 'movie')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeType === 'movie' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/80'
              }`}
              style={activeType === 'movie' ? { backgroundColor: provider.color } : {}}
            >
              <Film size={16} /> Movies
            </button>
          )}
          {provider.categories.includes('tv') && (
            <button
              onClick={() => updateParam('type', 'tv')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeType === 'tv' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/80'
              }`}
              style={activeType === 'tv' ? { backgroundColor: provider.color } : {}}
            >
              <Tv size={16} /> Series
            </button>
          )}
        </div>
      </div>

      {/* Region Tag Cards */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest px-1">Regions</h3>
        <div className="flex flex-wrap gap-2">
          {COUNTRY_CHIPS.map(chip => {
            const isActive = activeRegion === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => updateParam('region', chip.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                  isActive 
                    ? 'border-transparent text-white' 
                    : 'border-white/10 bg-zinc-900/40 text-white/60 hover:bg-zinc-800 hover:text-white'
                }`}
                style={isActive ? { backgroundColor: provider.color } : {}}
                title={chip.label}
              >
                <span>{chip.flag}</span>
                {chip.id === 'ALL' ? 'Global' : chip.id}
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-white/30 px-1 mt-1 leading-tight">
          Global mode merges content from top regions to show a massive catalog.
        </p>
      </div>

      {/* Dropdowns for Genre, Sort, Lang */}
      <div className="flex flex-col gap-4">
        <CustomDropdown 
          label="Sort By" 
          options={SORTS} 
          value={activeSort} 
          onChange={(val) => updateParam('sort', val)} 
          color={provider.color} 
        />
        
        <CustomDropdown 
          label="Language" 
          options={LANGUAGES} 
          value={activeLang} 
          onChange={(val) => updateParam('lang', val)} 
          color={provider.color} 
        />

        <CustomDropdown 
          label="Genre" 
          options={GENRES} 
          value={activeGenre} 
          onChange={(val) => updateParam('genre', val)} 
          color={provider.color} 
        />
      </div>
      
    </div>
  );
}

