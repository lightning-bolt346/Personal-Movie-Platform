import { RecommendedClient } from './RecommendedClient';
import { JsonLd } from '@/components/seo/JsonLd';

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }) {
  const resolvedParams = await params;
  const titles: Record<string, string> = {
    'movie': 'Recommended Movies For You — ZIVOX',
    'tv': 'Recommended TV Shows For You — ZIVOX',
    'all': 'Recommended For You — ZIVOX'
  };
  
  return {
    title: titles[resolvedParams.type] || titles['all'],
    description: 'Personalized recommendations based on your favorite genres and languages.',
  };
}

export default async function RecommendedPage({ params }: { params: Promise<{ type: string }> }) {
  const resolvedParams = await params;
  const type = ['movie', 'tv', 'all'].includes(resolvedParams.type) ? resolvedParams.type as 'movie' | 'tv' | 'all' : 'all';

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zivox-streaming.vercel.app';
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Recommended For You",
    "url": `${siteUrl}/recommended/${type}`,
    "description": "Personalized streaming recommendations",
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-black -mt-[72px]">
      <JsonLd data={jsonLd} />
      <RecommendedClient mediaType={type} />
    </div>
  );
}
