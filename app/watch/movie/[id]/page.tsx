import { Metadata } from 'next';
import { tmdb, getImageUrl } from '@/lib/tmdb';
import { MovieClient } from './MovieClient';
import { MediaGrid } from '@/components/media/MediaGrid';
import { JsonLd } from '@/components/seo/JsonLd';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const isParty = !!resolvedSearchParams?.party;

  const movie = await tmdb.getDetails('movie', id);
  
  const defaultTitle = movie.title ? `${movie.title} - Watch Free on ZIVOX` : 'Watch Movies Free on ZIVOX';
  const title = isParty ? `🍿 You're invited to a Watch Party: ${movie.title}` : defaultTitle;
  const description = isParty ? `Join the watch party for ${movie.title} on ZIVOX. Stream it together in HD for free!` : (movie.overview || 'Stream movies in premium HD quality on ZIVOX.');
  const image = getImageUrl(movie.poster_path || movie.backdrop_path, 'w780');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
      type: 'video.movie',
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
  const movie = await tmdb.getDetails('movie', id);
  const similar = movie.similar?.results?.slice(0, 18) || [];
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    image: getImageUrl(movie.poster_path, 'w780'),
    description: movie.overview,
    dateCreated: movie.release_date,
    aggregateRating: movie.vote_count ? {
      '@type': 'AggregateRating',
      ratingValue: movie.vote_average,
      ratingCount: movie.vote_count,
    } : undefined,
  };

  return (
    <div className="flex flex-col gap-8 w-full pt-28 md:pt-32 pb-28 md:pb-20">
      <JsonLd data={jsonLd} />
      <MovieClient movie={movie} />
      {similar.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 w-full">
           <MediaGrid title="Similar Movies" items={similar} />
        </div>
      )}
    </div>
  );
}
