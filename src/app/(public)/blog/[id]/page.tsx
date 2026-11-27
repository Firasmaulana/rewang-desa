import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, User, ArrowLeft, ShoppingBag } from 'lucide-react';
import { getArticleById } from '@/lib/supabase/articles';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function toAbsoluteArticleImage(path?: string | null) {
  if (!path || path.startsWith('data:')) return 'https://rewangdesa.com/hero-background.webp';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `https://rewangdesa.com${path.startsWith('/') ? path : `/${path}`}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    return {
      title: 'Artikel Tidak Ditemukan',
    };
  }

  const imageUrl = toAbsoluteArticleImage(article.image);

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: `/blog/${article.id}`,
    },
    openGraph: {
      type: 'article',
      url: `https://rewangdesa.com/blog/${article.id}`,
      title: `${article.title} | Rewang Desa`,
      description: article.excerpt,
      authors: [article.author || 'Tim Rewang Desa'],
      images: [
        {
          url: imageUrl,
          alt: article.title,
        },
      ],
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: article.title,
        description: article.excerpt,
        image: toAbsoluteArticleImage(article.image),
        articleSection: article.category,
        inLanguage: 'id-ID',
        datePublished: article.created_at || undefined,
        dateModified: article.updated_at || article.created_at || undefined,
        author: {
          '@type': 'Organization',
          name: article.author || 'Rewang Desa',
          url: 'https://rewangdesa.com',
        },
        publisher: {
          '@id': 'https://rewangdesa.com/#organization',
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://rewangdesa.com/blog/${article.id}`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Beranda',
            item: 'https://rewangdesa.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Artikel & Cerita Desa',
            item: 'https://rewangdesa.com/blog',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: article.title,
            item: `https://rewangdesa.com/blog/${article.id}`,
          },
        ],
      },
    ],
  };

  const hasImage =
    typeof article.image === 'string' &&
    article.image.trim().length > 0 &&
    (article.image.startsWith('/') ||
      article.image.startsWith('http') ||
      article.image.startsWith('data:image'));

  const paragraphs = (article.content || article.excerpt)
    .split(/\n\s*\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="bg-[#fffaf5] min-h-screen py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-[#8a5225] hover:text-[#733f1b] transition mb-8 font-body"
        >
          <ArrowLeft size={16} /> Kembali ke Artikel &amp; Cerita Desa
        </Link>

        <article className="bg-white rounded-3xl border border-[#33241b]/10 shadow-sm overflow-hidden">
          {hasImage && (
            <div className="aspect-[16/9] bg-[#f7f1ea] overflow-hidden">
              <img
                src={article.image!}
                alt={article.title}
                fetchPriority="high"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className={`p-7 sm:p-10 md:p-12 ${!hasImage ? 'border-t-4 border-t-[#8a5225]/30' : ''}`}>
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mb-4 font-body">
              <span className="bg-[#8a5225]/10 text-[#854523] font-bold px-3 py-1 rounded-full">
                {article.category}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} /> {article.date}
              </span>
              <span className="flex items-center gap-1.5">
                <User size={14} /> {article.author}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading text-[#33241b] leading-snug mb-6">
              {article.title}
            </h1>

            {/* Excerpt highlight */}
            {article.excerpt && (
              <p className="text-stone-600 text-sm md:text-base italic bg-[#fffaf5] p-5 rounded-2xl border-l-4 border-[#8a5225] mb-8 font-body leading-relaxed">
                {article.excerpt}
              </p>
            )}

            {/* Full Content */}
            <div className="space-y-5 text-stone-700 text-sm md:text-base leading-relaxed font-body">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Footer CTA */}
            <div className="mt-12 pt-8 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/blog"
                className="text-xs font-semibold text-stone-600 hover:text-[#8a5225] transition font-body"
              >
                &larr; Lihat Artikel Lainnya
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#8a5225] hover:bg-[#733f1b] text-[#fffaf5] px-6 py-2.5 rounded-full text-xs font-bold transition shadow-md shadow-[#8a5225]/20 font-body"
              >
                <ShoppingBag size={14} /> Dukung Petani di Katalog
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
