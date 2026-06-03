import { MetadataRoute } from 'next';
import { tmdb } from '@/lib/tmdb';
import { getAllGenres } from '@/lib/genres';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zivox-streaming.vercel.app';
  
  // Get trending movies and TV shows to add to sitemap
  const trendingMovies = await tmdb.getTrending('movie');
  const trendingTv = await tmdb.getTrending('tv');
  
  const movieUrls = (trendingMovies.results || []).map((movie) => ({
    url: `${baseUrl}/watch/movie/${movie.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  
  const tvUrls = (trendingTv.results || []).map((show) => ({
    url: `${baseUrl}/watch/tv/${show.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const genreUrls = getAllGenres().map((genre) => ({
    url: `${baseUrl}/genre/${genre.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Year-based collection pages (2020-2026)
  const yearUrls = Array.from({ length: 7 }, (_, i) => 2020 + i).map((year) => ({
    url: `${baseUrl}/year/${year}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/movies`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tv`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/anime`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/discover`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...genreUrls,
    ...yearUrls,
    ...movieUrls,
    ...tvUrls,
  ];
}
