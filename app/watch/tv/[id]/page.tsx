import { Metadata } from 'next';
import { tmdb, getImageUrl } from '@/lib/tmdb';
import { TvPlayer } from './TvPlayer';
import { MediaGrid } from '@/components/media/MediaGrid';
import { LegalBanner } from '@/components/ui/LegalBanner';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateSlug, getSiteUrl } from '@/lib/utils';

export const revalidate = 3600; // 1 hour ISR

const siteUrl = getSiteUrl();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const rawId = id.split('-')[0];

  const show = await tmdb.getDetails('tv', rawId);

  const title = show.name
    ? `Watch ${show.name} in HD on ZIVOX`
    : 'Watch TV Shows in HD on ZIVOX';

  const rawDesc = show.overview || 'Stream TV shows in premium HD quality on ZIVOX.';
  const description = rawDesc.length > 160 ? rawDesc.slice(0, 157) + '...' : rawDesc;

  // Prefer backdrop for a cinematic 16:9 Open Graph large image preview
  const image = getImageUrl(show.backdrop_path || show.poster_path, 'original');
  const slug = generateSlug(rawId, show.name);
  const canonicalUrl = `${siteUrl}/watch/tv/${slug}`;

  const genreKeywords = show.genres?.map((g: { name: string }) => g.name) ?? [];
  const year = show.first_air_date?.substring(0, 4) ?? '';
  const keywords = [
    show.name,
    `watch ${show.name} free`,
    `${show.name} all episodes`,
    `${show.name} HD`,
    `${show.name} ${year}`,
    `${show.name} stream online`,
    ...genreKeywords,
    'free streaming',
    'watch tv shows free',
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
      images: [{ url: image, width: 1280, height: 720, alt: show.name ?? 'Show preview' }],
      type: 'video.tv_show',
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

export default async function WatchTv({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rawId = id.split('-')[0];
  const show = await tmdb.getDetails('tv', rawId);
  const similar = show.similar?.results?.slice(0, 18) || [];

  const actors =
    show.credits?.cast
      ?.slice(0, 10)
      .map((c: { name: string }) => ({ '@type': 'Person', name: c.name })) ?? [];

  const creators =
    show.created_by
      ?.slice(0, 3)
      .map((c: { name: string }) => ({ '@type': 'Person', name: c.name })) ?? [];

  const slug = generateSlug(rawId, show.name);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: show.name,
    url: `${siteUrl}/watch/tv/${slug}`,
    image: getImageUrl(show.poster_path, 'w780'),
    description: show.overview,
    datePublished: show.first_air_date,
    inLanguage: show.original_language ?? 'en',
    genre: show.genres?.map((g: { name: string }) => g.name) ?? [],
    numberOfSeasons: show.number_of_seasons,
    numberOfEpisodes: show.number_of_episodes,
    creator: creators.length > 0 ? creators : undefined,
    actor: actors.length > 0 ? actors : undefined,
    aggregateRating:
      show.vote_count && show.vote_count > 50
        ? {
            '@type': 'AggregateRating',
            ratingValue: Number(show.vote_average.toFixed(1)),
            bestRating: 10,
            worstRating: 1,
            ratingCount: show.vote_count,
          }
        : undefined,
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'TV Shows', item: `${siteUrl}/tv` },
      { '@type': 'ListItem', position: 3, name: show.name, item: `${siteUrl}/watch/tv/${slug}` },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-28 md:pt-32 pb-28 md:pb-20 flex flex-col gap-8 w-full">
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbLd} />
      <TvPlayer show={show} />

      {similar.length > 0 && (
        <div className="mt-12 border-t border-zinc-800 pt-8">
          <MediaGrid title="More Like This" items={similar} />
        </div>
      )}
      <div className="mt-8">
        <LegalBanner />
      </div>
    </div>
  );
}
