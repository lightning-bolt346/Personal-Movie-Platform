import { Metadata } from 'next';
import { tmdb, getImageUrl } from '@/lib/tmdb';
import { MovieClient } from './MovieClient';
import { MediaGrid } from '@/components/media/MediaGrid';
import { LegalBanner } from '@/components/ui/LegalBanner';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateSlug } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zivox-streaming.vercel.app';

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { id } = await params;
  const rawId = id.split('-')[0];
  const resolvedSearchParams = await searchParams;
  const isParty = !!resolvedSearchParams?.party;

  const movie = await tmdb.getDetails('movie', rawId);

  const defaultTitle = movie.title
    ? `Watch ${movie.title} Free in HD | ZIVOX`
    : 'Watch Movies Free in HD | ZIVOX';
  const title = isParty
    ? `🍿 Watch Party: ${movie.title} | ZIVOX`
    : defaultTitle;

  // Truncate description to ≤160 chars for Google
  const rawDesc = isParty
    ? `Join the watch party for ${movie.title} on ZIVOX. Stream it together in HD for free!`
    : movie.overview || 'Stream movies in premium HD quality on ZIVOX.';
  const description = rawDesc.length > 160 ? rawDesc.slice(0, 157) + '...' : rawDesc;

  const image = getImageUrl(movie.poster_path || movie.backdrop_path, 'w780');
  const slug = generateSlug(rawId, movie.title);
  const canonicalUrl = `${siteUrl}/watch/movie/${slug}`;

  const genreKeywords = movie.genres?.map((g: { name: string }) => g.name) ?? [];
  const year = movie.release_date?.substring(0, 4) ?? '';
  const keywords = [
    movie.title,
    `watch ${movie.title} free`,
    `${movie.title} full movie`,
    `${movie.title} HD`,
    `${movie.title} ${year}`,
    `${movie.title} online`,
    ...genreKeywords,
    'free streaming',
    'watch free',
    'ZIVOX',
  ].filter(Boolean) as string[];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      images: [{ url: image, width: 780, alt: movie.title ?? 'Movie poster' }],
      type: 'video.movie',
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function WatchMovie({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rawId = id.split('-')[0];
  const movie = await tmdb.getDetails('movie', rawId);
  const similar = movie.similar?.results?.slice(0, 18) || [];

  // ── Rich JSON-LD: Movie schema ─────────────────────────────────────────────
  const directors =
    movie.credits?.crew
      ?.filter((c: { job: string }) => c.job === 'Director')
      .slice(0, 3)
      .map((c: { name: string }) => ({ '@type': 'Person', name: c.name })) ?? [];

  const actors =
    movie.credits?.cast
      ?.slice(0, 10)
      .map((c: { name: string }) => ({ '@type': 'Person', name: c.name })) ?? [];

  const slug = generateSlug(rawId, movie.title);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    url: `${siteUrl}/watch/movie/${slug}`,
    image: getImageUrl(movie.poster_path, 'w780'),
    description: movie.overview,
    datePublished: movie.release_date,
    inLanguage: movie.original_language ?? 'en',
    genre: movie.genres?.map((g: { name: string }) => g.name) ?? [],
    director: directors.length > 0 ? directors : undefined,
    actor: actors.length > 0 ? actors : undefined,
    aggregateRating:
      movie.vote_count && movie.vote_count > 50
        ? {
            '@type': 'AggregateRating',
            ratingValue: Number(movie.vote_average.toFixed(1)),
            bestRating: 10,
            worstRating: 1,
            ratingCount: movie.vote_count,
          }
        : undefined,
  };

  return (
    <div className="flex flex-col gap-8 w-full pt-28 md:pt-32 pb-28 md:pb-20">
      <JsonLd data={jsonLd} />
      <MovieClient movie={movie} />
      {similar.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 w-full">
          <MediaGrid title="More Like This" items={similar} />
        </div>
      )}
      <LegalBanner />
    </div>
  );
}
