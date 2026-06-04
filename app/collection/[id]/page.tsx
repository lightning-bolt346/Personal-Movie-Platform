import { Metadata } from 'next';
import { tmdb, getImageUrl } from '@/lib/tmdb';
import { MediaGrid } from '@/components/media/MediaGrid';
import { generateSlug } from '@/lib/utils';
import Image from 'next/image';
import { BackButton } from '@/components/ui/BackButton';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const rawId = id.split('-')[0];
  const collection = await tmdb.getCollection(rawId);
  
  if (!collection) return { title: 'Collection Not Found' };
  
  return {
    title: `${collection.name} - ZIVOX`,
    description: collection.overview,
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rawId = id.split('-')[0];
  const collection = await tmdb.getCollection(rawId);
  
  if (!collection) {
    return <div className="pt-32 text-center text-white">Collection not found.</div>;
  }

  // Map parts to Media type format so MediaGrid can render them
  const items = collection.parts.map((part: any) => ({
    ...part,
    media_type: 'movie'
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-50">
        <BackButton />
      </div>
      {/* Hero Header */}
      <div className="relative w-full h-[50vh] md:h-[60vh]">
        <div className="absolute inset-0 bg-void-950/80 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-950/60 to-transparent z-10" />
        
        {collection.backdrop_path && (
          <Image
            src={getImageUrl(collection.backdrop_path, 'original')}
            alt={collection.name}
            fill
            priority
            className="object-cover object-top opacity-50"
          />
        )}
        
        <div className="absolute inset-0 z-20 flex flex-col justify-end max-w-7xl mx-auto px-4 pb-12">
          <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-4 drop-shadow-lg">
            {collection.name}
          </h1>
          <p className="text-zinc-300 max-w-3xl text-sm md:text-base leading-relaxed drop-shadow-md">
            {collection.overview}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 w-full -mt-8 relative z-30 pb-20">
        <MediaGrid title={`${items.length} Movies`} items={items} />
      </div>
    </div>
  );
}
