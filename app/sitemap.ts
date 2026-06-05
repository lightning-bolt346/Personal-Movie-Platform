import { MetadataRoute } from 'next';
import { tmdb } from '@/lib/tmdb';
import { getAllGenres } from '@/lib/genres';
import { generateSlug } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zivox-streaming.vercel.app';

  // Fetch trending + popular + discover concurrently for a richer sitemap (pages 1-3)
  const [trendingMovies, trendingTv, popMovies1, popMovies2, popMovies3, popTv1, popTv2, popTv3] = await Promise.all([
    tmdb.getTrending('movie').catch(() => ({ results: [] as any[] })),
    tmdb.getTrending('tv').catch(() => ({ results: [] as any[] })),
    tmdb.discover('movie', { sort_by: 'popularity.desc', page: '1' }).catch(() => ({ results: [] as any[] })),
    tmdb.discover('movie', { sort_by: 'popularity.desc', page: '2' }).catch(() => ({ results: [] as any[] })),
    tmdb.discover('movie', { sort_by: 'popularity.desc', page: '3' }).catch(() => ({ results: [] as any[] })),
    tmdb.discover('tv', { sort_by: 'popularity.desc', page: '1' }).catch(() => ({ results: [] as any[] })),
    tmdb.discover('tv', { sort_by: 'popularity.desc', page: '2' }).catch(() => ({ results: [] as any[] })),
    tmdb.discover('tv', { sort_by: 'popularity.desc', page: '3' }).catch(() => ({ results: [] as any[] })),
  ]);

  // Deduplicate by id
  const allMovies = [...(trendingMovies.results || []), ...(popMovies1.results || []), ...(popMovies2.results || []), ...(popMovies3.results || [])]
    .filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i);
  const allTv = [...(trendingTv.results || []), ...(popTv1.results || []), ...(popTv2.results || []), ...(popTv3.results || [])]
    .filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i);

  const movieUrls = allMovies.map((movie) => ({
    url: `${baseUrl}/watch/movie/${generateSlug(movie.id, movie.title)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const tvUrls = allTv.map((show) => ({
    url: `${baseUrl}/watch/tv/${generateSlug(show.id, show.name)}`,
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

  // Year-based pages (2018–2026)
  const yearUrls = Array.from({ length: 9 }, (_, i) => 2018 + i).map((year) => ({
    url: `${baseUrl}/year/${year}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/movies`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.95 },
    { url: `${baseUrl}/tv`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.95 },
    { url: `${baseUrl}/anime`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/discover`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },
    { url: `${baseUrl}/schedule`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/guide`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...genreUrls,
    ...yearUrls,
    ...movieUrls,
    ...tvUrls,
  ];
}
