export const GENRES_MAP: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance',
  878: 'Sci-Fi', 53: 'Thriller', 10752: 'War', 37: 'Western',
  10759: 'Action & Adv.', 10762: 'Kids', 10765: 'Sci-Fi & Fantasy',
};

// Helper for programmatic SEO URLs
export const slugify = (text: string) => {
  return text.toString().toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const getGenreBySlug = (slug: string) => {
  const entry = Object.entries(GENRES_MAP).find(([_, name]) => slugify(name) === slug);
  if (entry) {
    return { id: parseInt(entry[0], 10), name: entry[1], slug };
  }
  return null;
};

export const getAllGenres = () => {
  return Object.entries(GENRES_MAP).map(([id, name]) => ({
    id: parseInt(id, 10),
    name,
    slug: slugify(name),
  }));
};
