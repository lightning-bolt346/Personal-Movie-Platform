import { Metadata } from 'next';
import { tmdb, getImageUrl } from '@/lib/tmdb';
import { TvPlayer } from './TvPlayer';
import { MediaGrid } from '@/components/media/MediaGrid';
import { JsonLd } from '@/components/seo/JsonLd';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const isParty = !!resolvedSearchParams?.party;

  const show = await tmdb.getDetails('tv', id);
  
  const defaultTitle = show.name ? `${show.name} - Watch Free on ZIVOX` : 'Watch TV Shows Free on ZIVOX';
  const title = isParty ? `🍿 You're invited to a Watch Party: ${show.name}` : defaultTitle;
  const description = isParty ? `Join the watch party for ${show.name} on ZIVOX. Stream it together in HD for free!` : (show.overview || 'Stream TV shows in premium HD quality on ZIVOX.');
  const image = getImageUrl(show.poster_path || show.backdrop_path, 'w780');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
      type: 'video.tv_show',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function WatchTv({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const show = await tmdb.getDetails('tv', id);
  const similar = show.similar?.results?.slice(0, 18) || [];
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: show.name,
    image: getImageUrl(show.poster_path, 'w780'),
    description: show.overview,
    dateCreated: show.first_air_date,
    aggregateRating: show.vote_count ? {
      '@type': 'AggregateRating',
      ratingValue: show.vote_average,
      ratingCount: show.vote_count,
    } : undefined,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-28 md:pt-32 pb-28 md:pb-20 flex flex-col gap-8 w-full">
      <JsonLd data={jsonLd} />
      <TvPlayer show={show} />
      
      {similar.length > 0 && (
        <div className="mt-12 border-t border-zinc-800 pt-8">
          <MediaGrid title="Similar Shows" items={similar} />
        </div>
      )}
    </div>
  );
}
