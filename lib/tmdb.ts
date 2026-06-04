import { TMDBResponse, Media, MediaDetails } from "@/types/tmdb";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function fetchTMDB<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<T> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey || apiKey === "YOUR_TMDB_API_KEY") {
    throw new Error("NO_API_KEY");
  }

  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.append("api_key", apiKey);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value),
  );

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000); // 8 second timeout

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`TMDB API Error: ${res.statusText}`);
    return res.json();
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

const MOCK_IDS = [
  {
    id: 157336,
    title: "Interstellar",
    type: "movie",
    bg: "/mbm8k3GFhXS0ROd9AD1gqYbIFbM.jpg",
    poster: "/gEU2QlsUUQZnSnDi8OUF0HQBhiH.jpg",
  },
  {
    id: 27205,
    title: "Inception",
    type: "movie",
    bg: "/s3TBrRGB1invgH3na56P5q2k4nZ.jpg",
    poster: "/oYuLEtOZeTCEiOeezPEhqN266n3.jpg",
  },
  {
    id: 1399,
    title: "Game of Thrones",
    type: "tv",
    bg: "/zZOMfX2hhegA0A5z3oP5JAlrK7c.jpg",
    poster: "/1XS1oqL89opfnbLl3WnZY1O1uJx.jpg",
  },
  {
    id: 550,
    title: "Fight Club",
    type: "movie",
    bg: "/hZkgoQYus5iQzjKXCZ9PNkZIN4F.jpg",
    poster: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  },
  {
    id: 63840,
    title: "Narcos",
    type: "tv",
    bg: null,
    poster: null,
  },
  {
    id: 155,
    title: "The Dark Knight",
    type: "movie",
    bg: "/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
    poster: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  },
];

const getMockMedia = (i: number, t: string = "movie"): Media => {
  const m = MOCK_IDS[i % MOCK_IDS.length];
  return {
    id: m.id,
    title: t === "tv" ? undefined : m.title,
    name: t === "tv" || m.type === "tv" ? m.title : undefined,
    overview:
      "This is premium fallback content. Please add a valid TMDB_API_KEY in your settings to view live data. " +
      m.title +
      " is a fantastic watch!",
    poster_path: m.poster,
    backdrop_path: m.bg,
    media_type: m.type as any,
    genre_ids: [12, 16],
    popularity: 900,
    vote_average: 9.0,
    vote_count: 1000,
    release_date: "2014-11-05",
    first_air_date: "2014-11-05",
  };
};

export const tmdb = {
  getTrending: async (type: "all" | "movie" | "tv" = "all") =>
    fetchTMDB<TMDBResponse<Media>>(`/trending/${type}/week`).catch(() => ({
      page: 1,
      results: Array.from({ length: 12 }).map((_, i) =>
        getMockMedia(i, type === "all" ? "movie" : type),
      ),
      total_pages: 1,
      total_results: 12,
    })),
  getPopular: async (type: "movie" | "tv") =>
    fetchTMDB<TMDBResponse<Media>>(`/${type}/popular`).catch(() => ({
      page: 1,
      results: Array.from({ length: 12 }).map((_, i) => getMockMedia(i, type)),
      total_pages: 1,
      total_results: 12,
    })),
  getTopRated: async (type: "movie" | "tv") =>
    fetchTMDB<TMDBResponse<Media>>(`/${type}/top_rated`).catch(() => ({
      page: 1,
      results: Array.from({ length: 12 }).map((_, i) => getMockMedia(i, type)),
      total_pages: 1,
      total_results: 12,
    })),
  getDetails: async (type: "movie" | "tv", id: string) =>
    fetchTMDB<MediaDetails>(`/${type}/${id}`, {
      append_to_response: "credits,similar,videos",
    }).catch(
      () =>
        ({
          ...getMockMedia(parseInt(id, 10) || 0, type),
          genres: [],
          status: "Released",
          tagline: "Fallback loaded!",
        }) as any,
    ),
  getSeasonDetails: async (tvId: string, seasonNumber: number) =>
    fetchTMDB<any>(`/tv/${tvId}/season/${seasonNumber}`).catch(() => ({
      episodes: Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        episode_number: i + 1,
        name: `Episode ${i + 1}`,
        overview: "This is a mock episode overview because the API key is missing.",
        still_path: null,
      })),
    })),
  search: async (query: string, includeAdult: boolean = false) => {
    try {
      const include_adult = includeAdult ? 'true' : 'false';
      const page1 = await fetchTMDB<TMDBResponse<Media>>("/search/multi", { query, page: "1", include_adult });
      
      let results = [...page1.results];
      if (page1.total_pages > 1) {
        try {
          const page2 = await fetchTMDB<TMDBResponse<Media>>("/search/multi", { query, page: "2", include_adult });
          results = [...results, ...page2.results];
        } catch (e) {
          // ignore page 2 failure
        }
      }
      
      return {
        ...page1,
        results: results.filter((item, index, self) => 
          index === self.findIndex((t) => t.id === item.id)
        )
      };
    } catch (err) {
      return {
        page: 1,
        results: Array.from({ length: 12 }).map((_, i) =>
          getMockMedia(i, "movie"),
        ),
        total_pages: 1,
        total_results: 12,
      };
    }
  },
  getAnime: async (page: string = "1") =>
    fetchTMDB<TMDBResponse<Media>>("/discover/tv", {
      with_genres: "16",
      with_original_language: "ja",
      page,
    }).catch(() => ({
      page: 1,
      results: Array.from({ length: 12 }).map((_, i) => getMockMedia(i, "tv")),
      total_pages: 1,
      total_results: 12,
    })),
  discover: async (type: "movie" | "tv", params: Record<string, string> = {}) =>
    fetchTMDB<TMDBResponse<Media>>(`/discover/${type}`, params).catch(() => ({
      page: 1,
      results: Array.from({ length: 12 }).map((_, i) => getMockMedia(i, type)),
      total_pages: 1,
      total_results: 12,
    })),
  getPerson: async (id: string) =>
    fetchTMDB<any>(`/person/${id}`, {
      append_to_response: "combined_credits",
    }).catch(() => null),
  getImages: async (type: "movie" | "tv", id: string) =>
    fetchTMDB<any>(`/${type}/${id}/images`, { include_image_language: "en,null" }).catch(() => null),
  getCollection: async (id: string) =>
    fetchTMDB<any>(`/collection/${id}`).catch(() => null),
};

export const getImageUrl = (
  path: string | null,
  size: "original" | "w500" | "w780" = "original",
) => {
  if (!path || path === "/xoarZqQav1T9r6TzylsB2x1q0v6.jpg" || path === "/vWpeqwGcGZAm724HwO2yK8xLheP.jpg") return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600'%3E%3Crect width='400' height='600' fill='%2318181b'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='24' fill='%2352525b' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export async function getHeroItemsWithLogos(items: Media[]) {
  return Promise.all(
    items.map(async (item) => {
      try {
        const type = (item.media_type === 'person' ? 'movie' : item.media_type) || (item.name ? 'tv' : 'movie');
        
        // Fetch both images and details concurrently
        const [images, details] = await Promise.all([
          tmdb.getImages(type as 'movie' | 'tv', item.id.toString()),
          tmdb.getDetails(type as 'movie' | 'tv', item.id.toString())
        ]);
        
        let logo_path = null;
        if (images && images.logos && images.logos.length > 0) {
          // Prefer english logos, fallback to first available
          const logo = images.logos.find((l: any) => l.iso_639_1 === 'en') || images.logos[0];
          logo_path = logo?.file_path;
        }
        
        return {
          ...item,
          ...(logo_path ? { logo_path } : {}),
          ...(details.number_of_seasons ? { number_of_seasons: details.number_of_seasons } : {})
        };
      } catch (e) {
        return item;
      }
    })
  );
}
