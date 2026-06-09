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

  // Filter out 'person' media types and unreleased content
  const now = new Date().toISOString().split('T')[0];
  results = results.filter(item => {
    if (item.media_type === 'person') return false;
    
    // Check release dates. If in the future or completely missing (TBA), hide it.
    const releaseDate = item.release_date || item.first_air_date;
    if (!releaseDate) return false;
    if (releaseDate > now) return false;
    
    return true;
  });

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
    const now = new Date().toISOString().split('T')[0];
    return (res.results || []).filter(item => {
      if (item.media_type === 'person') return false;
      const releaseDate = item.release_date || item.first_air_date;
      if (!releaseDate) return false;
      if (releaseDate > now) return false;
      return true;
    });
  } catch (err) {
    console.error("Failed to fetch suggestions:", err);
    return [];
  }
}

export async function discoverMedia(type: "movie" | "tv", params: Record<string, string>) {
  return await tmdb.discover(type, params);
}

export async function getTopRatedAction(type: "movie" | "tv") {
  return await tmdb.getTopRated(type);
}

export async function getSeasonDetailsAction(tvId: string, seasonNumber: number) {
  return await tmdb.getSeasonDetails(tvId, seasonNumber);
}

export async function getTrailerAction(id: string, type: 'movie' | 'tv'): Promise<string | null> {
  try {
    const data = await fetchTMDB<any>(`/${type}/${id}/videos`);
    if (!data || !data.results) return null;
    
    // Find a YouTube trailer
    const trailer = data.results.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer') 
                 || data.results.find((v: any) => v.site === 'YouTube' && v.type === 'Teaser')
                 || data.results.find((v: any) => v.site === 'YouTube');
                 
    return trailer ? trailer.key : null;
  } catch (error) {
    return null;
  }
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

// ─── Collection Actions ───────────────────────────────────────────────────────

export async function getCollectionsAction(ids: number[], forceProxy: boolean = false) {
  const promises = ids.map(id => tmdb.getCollection(id.toString(), forceProxy));
  const data = await Promise.all(promises);
  return data.filter(Boolean);
}

export async function getDynamicCollectionsAction(pageChunk: number) {
  try {
    // A chunk of 1 fetches pages 1,2,3,4. Chunk 2 fetches 5,6,7,8.
    const startPage = (pageChunk - 1) * 4 + 1;
    const pagePromises = [];
    
    // Fetch 8 pages of data simultaneously (4 popular, 4 top rated = 160 movies!)
    for (let i = 0; i < 4; i++) {
      pagePromises.push(fetchTMDB<TMDBResponse<Media>>('/movie/popular', { page: String(startPage + i) }).catch(() => null));
      pagePromises.push(fetchTMDB<TMDBResponse<Media>>('/movie/top_rated', { page: String(startPage + i) }).catch(() => null));
    }
    
    const pagesData = await Promise.all(pagePromises);
    const allMovies: Media[] = [];
    pagesData.forEach(p => {
      if (p && p.results) allMovies.push(...p.results);
    });
    
    // Deduplicate movies to prevent redundant API calls
    const uniqueMovies = Array.from(new Map(allMovies.map(m => [m.id, m])).values());
    
    // 🔥 MASSIVE PARALLEL FETCH: Get full details for ~150 movies simultaneously
    const movieDetailsPromises = uniqueMovies.map(m => fetchTMDB<any>(`/movie/${m.id}`).catch(() => null));
    const movieDetails = await Promise.all(movieDetailsPromises);
    
    // Extract unique hidden collections
    const collectionIds = new Set<number>();
    movieDetails.forEach(movie => {
      if (movie && movie.belongs_to_collection) {
        collectionIds.add(movie.belongs_to_collection.id);
      }
    });
    
    // Fetch the actual collection payloads
    const collectionsData = await getCollectionsAction(Array.from(collectionIds), true);
    
    // Sort collections by popularity or movie count to make them look good
    const sortedCollections = collectionsData.sort((a, b) => (b.parts?.length || 0) - (a.parts?.length || 0));
    
    return {
      page: pageChunk,
      results: sortedCollections,
      total_pages: 50 // Arbitrarily high limit for infinite scrolling
    };
  } catch (e) {
    console.error("Dynamic collections failed:", e);
    return { page: pageChunk, results: [], total_pages: 50 };
  }
}

export async function searchCollectionsAction(query: string, page: number = 1) {
  // 1. Hit the standard Collection search
  const collectionRes = await tmdb.searchCollections(query, page);
  let results = collectionRes.results || [];
  
  // 2. The "Supercharged" Phase: Only on Page 1, we also search for Movies matching the query
  // This solves the problem where TMDB's collection search is bad, but movie search is great.
  if (page === 1) {
    try {
      // Search for movies with the query
      const movieRes = await fetchTMDB<TMDBResponse<Media>>("/search/movie", { query, page: '1' });
      const topMovies = (movieRes.results || []).slice(0, 5); // Take top 5 most relevant movies
      
      // Fetch full details for these 5 movies in parallel to find hidden collections
      const movieDetailsPromises = topMovies.map(m => fetchTMDB<any>(`/movie/${m.id}`).catch(() => null));
      const movieDetails = await Promise.all(movieDetailsPromises);
      
      // Extract unique collection IDs that we haven't already found in collectionRes
      const existingIds = new Set(results.map((c: any) => c.id));
      const newCollectionIds = new Set<number>();
      
      movieDetails.forEach(movie => {
        if (movie && movie.belongs_to_collection && !existingIds.has(movie.belongs_to_collection.id)) {
          newCollectionIds.add(movie.belongs_to_collection.id);
        }
      });
      
      // Fetch the actual collection data for these new hidden collections
      if (newCollectionIds.size > 0) {
        const newCollections = await getCollectionsAction(Array.from(newCollectionIds));
        // Prepend them to the results (since they are highly relevant from movie search)
        results = [...newCollections, ...results];
      }
    } catch (e) {
      console.error("Supercharged search failed gracefully:", e);
    }
  }

  return {
    ...collectionRes,
    results
  };
}

// ─── Provider Global Actions ──────────────────────────────────────────────────

export async function discoverGlobalProviderAction(
  providerId: string,
  type: 'movie' | 'tv',
  params: Record<string, string>,
  regions: string[]
) {
  try {
    const promises = regions.map(region => {
      const regionParams = { ...params, with_watch_providers: providerId, watch_region: region };
      return fetchTMDB<TMDBResponse<Media>>(`/discover/${type}`, regionParams).catch(() => null);
    });

    const responses = await Promise.all(promises);
    
    // Merge and deduplicate
    let allResults: Media[] = [];
    let maxPage = 1;
    let maxTotalPages = 1;

    responses.forEach(res => {
      if (res) {
        if (res.results) allResults.push(...res.results);
        if (res.page > maxPage) maxPage = res.page;
        if (res.total_pages > maxTotalPages) maxTotalPages = res.total_pages;
      }
    });

    // Deduplicate by ID
    const uniqueResults = Array.from(new Map(allResults.map(item => [item.id, item])).values());
    
    // Sort by popularity descending since that's the default
    uniqueResults.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

    return {
      page: params.page ? parseInt(params.page) : 1,
      results: uniqueResults,
      total_pages: maxTotalPages,
      total_results: uniqueResults.length
    };
  } catch (e) {
    console.error("Global provider fetch failed:", e);
    return { page: 1, results: [], total_pages: 1, total_results: 0 };
  }
}
