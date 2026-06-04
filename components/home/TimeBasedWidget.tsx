'use client';
import { useState, useEffect } from 'react';
import { Media } from '@/types/tmdb';
import { MediaCard } from '@/components/media/MediaCard';
import { Sparkles, Moon, Sun, Coffee } from 'lucide-react';

export function TimeBasedWidget({ items }: { items: Media[] }) {
  const [greeting, setGreeting] = useState('');
  const [Icon, setIcon] = useState<any>(null);
  const [filteredItems, setFilteredItems] = useState<Media[]>([]);
  const [subtitle, setSubtitle] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    let selectedGenreIds: number[] = [];

    let blockId = '';

    if (hour >= 5 && hour < 12) {
      setGreeting('Good Morning');
      setSubtitle('Start your day right with these light watches');
      setIcon(() => Coffee);
      selectedGenreIds = [35, 10751, 16]; // Comedy, Family, Animation
      blockId = 'morning';
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Good Afternoon');
      setSubtitle('Perfect picks for a midday break');
      setIcon(() => Sun);
      selectedGenreIds = [28, 12, 878]; // Action, Adventure, Sci-Fi
      blockId = 'afternoon';
    } else if (hour >= 18 && hour < 22) {
      setGreeting('Good Evening');
      setSubtitle('Prime time entertainment for tonight');
      setIcon(() => Sparkles);
      selectedGenreIds = [18, 53, 80]; // Drama, Thriller, Crime
      blockId = 'evening';
    } else {
      setGreeting('Late Night Owls');
      setSubtitle('Midnight thrills and mind-bending stories');
      setIcon(() => Moon);
      selectedGenreIds = [27, 9648, 878]; // Horror, Mystery, Sci-Fi
      blockId = 'night';
    }

    // Check if we already have recommendations saved for this specific block today
    const dateStr = new Date().toDateString();
    const cacheKey = `timeBasedWidget_${blockId}_${dateStr}`;
    
    try {
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        const cachedIds = JSON.parse(cachedData);
        const cachedItems = cachedIds.map((id: number) => items.find(i => i.id === id)).filter(Boolean);
        
        if (cachedItems.length === 4) {
          setFilteredItems(cachedItems);
          return; // Skip new generation if we have a valid cache
        }
      }
    } catch (e) {
      // Ignore cache errors
    }

    // Shuffle the entire pool so it's different every time
    const shuffledItems = [...items].sort(() => 0.5 - Math.random());
    
    // Filter by genre
    const matched = shuffledItems.filter(item => 
      item.genre_ids?.some(id => selectedGenreIds.includes(id))
    );
    
    // Separate into movies and tv shows
    // TMDB objects usually have 'title' for movies and 'name' for tv shows,
    // or 'media_type' if it's a mixed response.
    const movies = matched.filter(item => item.media_type === 'movie' || item.title);
    const shows = matched.filter(item => item.media_type === 'tv' || item.name);
    
    let finalSelection: Media[] = [];
    
    if (movies.length >= 2 && shows.length >= 2) {
      finalSelection = [...movies.slice(0, 2), ...shows.slice(0, 2)];
    } else {
      // Fallback: if we don't have enough matching genres, just pick random from the pool
      const fallbackMovies = shuffledItems.filter(item => item.media_type === 'movie' || item.title);
      const fallbackShows = shuffledItems.filter(item => item.media_type === 'tv' || item.name);
      finalSelection = [...fallbackMovies.slice(0, 2), ...fallbackShows.slice(0, 2)];
    }
    
    // Shuffle the final 4 items so they aren't always Movie, Movie, Show, Show in order
    const randomizedFinal = finalSelection.sort(() => 0.5 - Math.random());
    setFilteredItems(randomizedFinal);
    
    // Save to local storage
    try {
      localStorage.setItem(cacheKey, JSON.stringify(randomizedFinal.map(i => i.id)));
    } catch (e) {
      // Ignore storage errors
    }
  }, [items]);

  if (!filteredItems.length || !Icon) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl mx-4 md:mx-8 mb-4 border border-white/5 bg-gradient-to-br from-zinc-900/50 to-black p-6 md:p-8">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <Icon size={120} />
      </div>
      
      <div className="flex items-center gap-3 mb-2 relative z-10">
        <Icon className="text-crimson-500 w-6 h-6 md:w-8 md:h-8" />
        <h2 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight">
          {greeting}
        </h2>
      </div>
      <p className="text-zinc-400 text-sm mb-6 relative z-10">{subtitle}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        {filteredItems.map(item => (
          <MediaCard key={item.id} media={item} />
        ))}
      </div>
    </div>
  );
}
