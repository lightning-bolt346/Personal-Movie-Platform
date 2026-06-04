'use server';

import { tmdb, fetchTMDB } from '@/lib/tmdb';
import { Media, TMDBResponse } from '@/types/tmdb';

function fuzzyMatch(title: string, query: string): boolean {
  const cleanTitle = title.toLowerCase().trim();
  const cleanQuery = query.toLowerCase().trim();
  
  if (!cleanQuery) return true;
  
  // 1. Direct substring check
  if (cleanTitle.includes(cleanQuery)) return true;
  
  // 2. Word prefix check (e.g., query "was" matches "Wasseypur" in "Gangs of Wasseypur")
  const titleWords = cleanTitle.split(/[\s:,\-–—._]+/);
  if (titleWords.some(word => word.startsWith(cleanQuery))) return true;
  
  // 3. Acronym / Initials check (e.g. "g of w" or "gow" -> "Gangs of Wasseypur")
  const queryParts = cleanQuery.split(/\s+/).filter(Boolean);
  if (queryParts.length > 1) {
    let titleWordIdx = 0;
    let matchCount = 0;
    for (const part of queryParts) {
      while (titleWordIdx < titleWords.length) {
        if (titleWords[titleWordIdx].startsWith(part)) {
          matchCount++;
          titleWordIdx++;
          break;
        }
        titleWordIdx++;
      }
    }
    if (matchCount === queryParts.length) return true;
  } else {
    // Single word query acronym check (e.g. "gow" -> "Gangs of Wasseypur")
    const initials = titleWords
      .filter(w => w.length > 0)
      .map(w => w[0])
      .join('');
    if (initials.includes(cleanQuery)) return true;
  }
  
  // 4. Space-stripped substring check
  const titleNoSpaces = cleanTitle.replace(/\s+/g, '');
  const queryNoSpaces = cleanQuery.replace(/\s+/g, '');
  if (titleNoSpaces.includes(queryNoSpaces)) return true;

  return false;
}

export async function searchMedia(
  query: string,
  page: number = 1,
  includeAdult: boolean = false,
  language: string = 'en-US'
): Promise<TMDBResponse<Media>> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return {
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0,
    };
  }

  const include_adult = includeAdult ? 'true' : 'false';
  const params = {
    query: trimmedQuery,
    page: page.toString(),
    include_adult,
    language,
  };

  let moviesResults: Media[] = [];
  let tvResults: Media[] = [];
  let totalPages = 1;
  let totalResults = 0;

  try {
    const [moviesRes, tvRes] = await Promise.all([
      fetchTMDB<TMDBResponse<Media>>('/search/movie', params).catch(() => null),
      fetchTMDB<TMDBResponse<Media>>('/search/tv', params).catch(() => null),
    ]);

    if (moviesRes) {
      moviesResults = (moviesRes.results || []).map(item => ({ ...item, media_type: 'movie' }));
      totalPages = Math.max(totalPages, moviesRes.total_pages);
      totalResults += moviesRes.total_results;
    }
    if (tvRes) {
      tvResults = (tvRes.results || []).map(item => ({ ...item, media_type: 'tv' }));
      totalPages = Math.max(totalPages, tvRes.total_pages);
      totalResults += tvRes.total_results;
    }
  } catch (err) {
    console.error("Search fetch failed, using fallback:", err);
  }

  // Combine and de-duplicate by ID
  let results = [...moviesResults, ...tvResults].filter((item, index, self) =>
    index === self.findIndex((t) => t.id === item.id)
  );

  // If the query is short (< 4 chars) OR we found very few results (< 12), combine with fuzzy-matched trending/popular items
  const isShortQuery = trimmedQuery.length < 4;
  if ((isShortQuery || results.length < 12) && page === 1) {
    try {
      const [trendingRes, popularMovieRes, popularTvRes] = await Promise.all([
        tmdb.getTrending("all").catch(() => ({ results: [] })),
        tmdb.getPopular("movie").catch(() => ({ results: [] })),
        tmdb.getPopular("tv").catch(() => ({ results: [] })),
      ]);

      const pool = [
        ...(trendingRes.results || []),
        ...(popularMovieRes.results || []).map(m => ({ ...m, media_type: 'movie' as const })),
        ...(popularTvRes.results || []).map(t => ({ ...t, media_type: 'tv' as const })),
      ];

      const fuzzyMatches = pool
        .map(item => ({
          ...item,
          media_type: (item.media_type === 'person' ? 'movie' : item.media_type) || (item.name ? 'tv' : 'movie') as 'movie' | 'tv' | 'person'
        }))
        .filter(item => {
          const title = item.title || item.name || '';
          return title && fuzzyMatch(title, trimmedQuery);
        });

      // Merge fuzzy matches at the front (high relevance)
      results = [...fuzzyMatches, ...results].filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
      );
    } catch (e) {
      console.error("Fuzzy fallback matching failed:", e);
    }
  }

  // Filter out any 'person' media types
  results = results.filter(item => item.media_type !== 'person');

  // Sort by popularity desc
  results.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

  return {
    page,
    results,
    total_pages: totalPages,
    total_results: Math.max(results.length, totalResults),
  };
}

export async function getSearchSuggestions(): Promise<Media[]> {
  try {
    const res = await tmdb.getTrending("all");
    return (res.results || []).filter(item => item.media_type !== 'person');
  } catch (err) {
    console.error("Failed to fetch suggestions:", err);
    return [];
  }
}

export async function discoverMedia(type: "movie" | "tv", params: Record<string, string>) {
  return await tmdb.discover(type, params);
}

export async function getSeasonDetailsAction(tvId: string, seasonNumber: number) {
  return await tmdb.getSeasonDetails(tvId, seasonNumber);
}

// ─── Schedule Action ──────────────────────────────────────────────────────────

export interface ScheduleParams {
  tab: 'released' | 'upcoming';
  type: 'all' | 'movie' | 'tv';
  gte: string;   // e.g. "2026-06-01"
  lte: string;   // e.g. "2026-06-30"
  country: string; // single country code, e.g. "US"
  page: number;
}

// Retry with exponential backoff — prevents silent TMDB rate-limit drops
async function fetchTMDBWithRetry<T>(url: string, params: Record<string, string>, retries = 2): Promise<T | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetchTMDB<T>(url, params);
    } catch (err) {
      if (attempt === retries) {
        console.error(`[TMDB] Failed after ${retries + 1} attempts for ${url}:`, err);
        return null;
      }
      await new Promise(r => setTimeout(r, 600 * Math.pow(2, attempt))); // 600ms, 1.2s
    }
  }
  return null;
}

export async function fetchScheduleAction(params: ScheduleParams): Promise<TMDBResponse<Media>> {
  const { tab, type, gte, lte, page, country } = params;

  const movieSort = tab === 'released' ? 'primary_release_date.desc' : 'primary_release_date.asc';
  const tvSort    = tab === 'released' ? 'first_air_date.desc'        : 'first_air_date.asc';

  const baseParams: Record<string, string> = {
    language:        'en-US',
    include_adult:   'false',
    'vote_count.gte': '0',
    with_origin_country: country,
    page:            String(page),
  };

  const fetchMovies = type !== 'tv';
  const fetchTv     = type !== 'movie';

  let movieResults: Media[] = [];
  let tvResults:    Media[] = [];
  let maxTotalPages = 1;

  // Fetch movie + tv sequentially to be respectful of rate limits.
  // Each call is its own retried request.
  if (fetchMovies) {
    const res = await fetchTMDBWithRetry<TMDBResponse<Media>>('/discover/movie', {
      language:            'en-US',
      include_adult:       'false',
      sort_by:             movieSort,
      'release_date.gte':  gte,
      'release_date.lte':  lte,
      region:              country,          // use region for movies (wider match)
      page:                String(page),
    });
    if (res?.results) {
      movieResults = res.results.map(item => ({
        ...item,
        media_type: 'movie' as const,
        origin_country: item.origin_country?.length ? item.origin_country : [country],
      }));
      maxTotalPages = Math.max(maxTotalPages, res.total_pages);
    }
  }

  if (fetchTv) {
    const res = await fetchTMDBWithRetry<TMDBResponse<Media>>('/discover/tv', {
      language:              'en-US',
      include_adult:         'false',
      sort_by:               tvSort,
      'first_air_date.gte':  gte,
      'first_air_date.lte':  lte,
      with_origin_country:   country,        // origin country works well for TV
      page:                  String(page),
    });
    if (res?.results) {
      tvResults = res.results.map(item => ({
        ...item,
        media_type: 'tv' as const,
        origin_country: item.origin_country?.length ? item.origin_country : [country],
      }));
      maxTotalPages = Math.max(maxTotalPages, res.total_pages);
    }
  }

  // Combine and dedupe by (id, media_type)
  const seen = new Set<string>();
  const combined: Media[] = [];
  for (const item of [...movieResults, ...tvResults]) {
    const key = `${item.media_type}-${item.id}`;
    if (!seen.has(key)) { seen.add(key); combined.push(item); }
  }

  return {
    page,
    results: combined,
    total_pages: Math.max(1, maxTotalPages),
    total_results: combined.length,
  };
}
