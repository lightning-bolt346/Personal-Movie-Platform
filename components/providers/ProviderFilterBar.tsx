'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Filter } from 'lucide-react';
import { Provider } from '@/lib/providers';
import { useState } from 'react';
import { usePreferences } from '@/hooks/usePreferences';
import { getContrastColor } from '@/lib/utils';

interface ProviderFilterBarProps {
  provider: Provider;
}

export function ProviderFilterBar({ provider }: ProviderFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const { preferences } = usePreferences();

  // Fallback to 'movie' if no type is selected, effectively removing the "All" state
  const activeType = searchParams.get('type') || 'movie';
  const activeLang = searchParams.get('lang') || '';
  const activeGenre = searchParams.get('genre') || '';
  const activeSort = searchParams.get('sort') || 'popularity.desc';
  const activeRegion = searchParams.get('region') || preferences.country || 'US';

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const types = [
    { value: 'movie', label: 'Movies' },
    { value: 'tv', label: 'Series' }
  ];

  const languages = [
    { value: '', label: 'Any Language' },
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'es', label: 'Spanish' },
    { value: 'ko', label: 'Korean' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ta', label: 'Tamil' },
    { value: 'te', label: 'Telugu' },
  ];

  const genres = [
    { value: '', label: 'Any Genre' },
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

  const sorts = [
    { value: 'popularity.desc', label: 'Popularity' },
    { value: 'vote_average.desc', label: 'Top Rated' },
    { value: 'primary_release_date.desc', label: 'Newest' },
    { value: 'primary_release_date.asc', label: 'Oldest' }
  ];

  const regions = [
    { value: 'IN', label: 'India' },
    { value: 'US', label: 'United States' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'AU', label: 'Australia' },
    { value: 'JP', label: 'Japan' },
    { value: 'KR', label: 'South Korea' },
    { value: 'FR', label: 'France' },
    { value: 'DE', label: 'Germany' }
  ];

  return (
    <div className="relative z-20 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 pb-2 pt-2 md:pb-4 md:pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center justify-between gap-4">
        
        {/* Type Tabs */}
        <div className="flex bg-zinc-900/50 p-1 rounded-full border border-white/5 overflow-x-auto no-scrollbar">
          {types.map((t) => {
            if (t.value && !provider.categories.includes(t.value as any)) return null;
            const isActive = activeType === t.value || (!activeType && !t.value);
            return (
              <button
                key={t.label}
                onClick={() => updateParam('type', t.value)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap"
                style={{
                  backgroundColor: isActive ? provider.color : 'transparent',
                  color: isActive ? getContrastColor(provider.color) : 'rgba(255,255,255,0.5)',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Mobile Filter Button */}
        <button 
          className="md:hidden flex items-center gap-2 bg-zinc-900 p-2 rounded-full border border-white/10"
          onClick={() => setIsMobileDrawerOpen(true)}
        >
          <Filter size={18} className="text-white" />
        </button>

        {/* Desktop Dropdowns */}
        <div className="hidden md:flex items-center gap-3">
          <select 
            value={activeRegion} 
            onChange={(e) => updateParam('region', e.target.value)}
            className="bg-zinc-900/80 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 cursor-pointer appearance-none pr-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjMgNiA2IDkgOSA2Ii8+PC9zdmc+')] bg-no-repeat bg-[position:calc(100%-10px)_center]"
          >
            {regions.map(r => <option key={r.value} value={r.value} className="bg-zinc-900">{r.label}</option>)}
          </select>
          <select 
            value={activeLang} 
            onChange={(e) => updateParam('lang', e.target.value)}
            className="bg-zinc-900/80 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 cursor-pointer appearance-none pr-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjMgNiA2IDkgOSA2Ii8+PC9zdmc+')] bg-no-repeat bg-[position:calc(100%-10px)_center]"
          >
            {languages.map(l => <option key={l.value} value={l.value} className="bg-zinc-900">{l.label}</option>)}
          </select>

          <select 
            value={activeGenre} 
            onChange={(e) => updateParam('genre', e.target.value)}
            className="bg-zinc-900/80 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 cursor-pointer appearance-none pr-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjMgNiA2IDkgOSA2Ii8+PC9zdmc+')] bg-no-repeat bg-[position:calc(100%-10px)_center]"
          >
            {genres.map(g => <option key={g.value} value={g.value} className="bg-zinc-900">{g.label}</option>)}
          </select>

          <select 
            value={activeSort} 
            onChange={(e) => updateParam('sort', e.target.value)}
            className="bg-zinc-900/80 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 cursor-pointer appearance-none pr-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjMgNiA2IDkgOSA2Ii8+PC9zdmc+')] bg-no-repeat bg-[position:calc(100%-10px)_center]"
          >
            {sorts.map(s => <option key={s.value} value={s.value} className="bg-zinc-900">{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileDrawerOpen(false)} />
          <div className="relative bg-zinc-950 rounded-t-3xl border-t border-white/10 p-6 flex flex-col gap-6 transform transition-transform animate-in slide-in-from-bottom-full duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Filters</h3>
              <button onClick={() => setIsMobileDrawerOpen(false)} className="text-zinc-400 hover:text-white">Close</button>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Region</label>
              <select value={activeRegion} onChange={(e) => updateParam('region', e.target.value)} className="bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none">
                {regions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Language</label>
              <select value={activeLang} onChange={(e) => updateParam('lang', e.target.value)} className="bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none">
                {languages.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Genre</label>
              <select value={activeGenre} onChange={(e) => updateParam('genre', e.target.value)} className="bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none">
                {genres.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Sort By</label>
              <select value={activeSort} onChange={(e) => updateParam('sort', e.target.value)} className="bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none">
                {sorts.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <button 
              className="w-full py-4 rounded-xl font-bold mt-4 transition-colors hover:brightness-110"
              style={{ backgroundColor: provider.color, color: getContrastColor(provider.color) }}
              onClick={() => setIsMobileDrawerOpen(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
