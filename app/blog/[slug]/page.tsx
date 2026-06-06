import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogPosts, getBlogPostBySlug } from '@/lib/blog';
import { JsonLd } from '@/components/seo/JsonLd';
import { BackButton } from '@/components/ui/BackButton';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zivox-streaming.vercel.app';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  
  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} — ZIVOX Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.coverImage,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ZIVOX',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`, // Assuming a default logo
      },
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${siteUrl}/blog/${post.slug}` },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen pb-28 md:pb-20 pt-28 max-w-3xl mx-auto px-4 w-full">
      <div className="mb-8">
        <BackButton />
      </div>
      
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbLd} />

      <article className="w-full">
        {/* Header */}
        <header className="mb-10 flex flex-col items-start text-left">
          <div className="flex items-center gap-3 mb-6">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs font-bold uppercase tracking-wider text-crimson-500 bg-crimson-500/10 px-3 py-1 rounded-full border border-crimson-500/20">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tighter text-white drop-shadow-xl mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm font-medium text-zinc-400">
            <span className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-crimson-500 to-purple-500 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-crimson-500/20">Z</span>
              {post.author}
            </span>
            <span>•</span>
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </time>
          </div>
        </header>

        {/* Cover Image */}
        <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden mb-12 shadow-2xl shadow-black/50 border border-zinc-800 relative bg-zinc-900">
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        {/* Content */}
        <div 
          className="prose prose-invert prose-crimson max-w-none md:prose-lg 
                     prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight
                     prose-h2:text-3xl prose-h2:mt-14 prose-h2:mb-6 prose-h2:text-white
                     prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-zinc-200
                     prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-8
                     prose-a:text-crimson-500 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-crimson-400
                     prose-ul:text-zinc-300 prose-li:my-3
                     prose-strong:text-white prose-strong:font-bold"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
