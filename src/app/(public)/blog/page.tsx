import Link from 'next/link';
import { Calendar, User, ArrowRight, FileText } from 'lucide-react';
import { getArticles } from '@/lib/supabase/articles';
import ScrollReveal from '@/components/ScrollReveal';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Artikel & Cerita Desa - Rewang Desa',
  description: 'Kisah para petani, kearifan lokal, dan kabar panen dari desa binaan Rewang Desa.',
};

export default async function BlogPage() {
  const articles = await getArticles();

  return (
    <div className="bg-[#fffaf5] min-h-screen py-16 overflow-x-clip">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-[#854523] text-xs font-bold uppercase tracking-widest mb-2 block font-body">
            Kabar &amp; Kearifan Lokal
          </span>
          <h1 className="text-3xl md:text-5xl font-heading text-[#33241b] mb-3">
            Artikel &amp; Cerita dari Desa
          </h1>
          <div aria-hidden="true" className="scroll-line-expand w-20 h-1 rounded-full bg-gradient-to-r from-[#8a5225] via-[#ffdd7d] to-[#5a8514] mx-auto mb-4" />
          <p className="text-stone-600 text-sm md:text-base font-body">
            Kumpulan kisah perjuangan, inovasi pangan lokal, dan kearifan masyarakat desa yang kami temui di setiap jengkal perjalanan.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#33241b]/10 p-14 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#fffaf5] border border-[#8a5225]/20 text-[#8a5225] flex items-center justify-center mx-auto mb-4">
              <FileText size={26} />
            </div>
            <h2 className="font-heading text-xl text-[#33241b] mb-2">Belum Ada Artikel</h2>
            <p className="text-stone-500 text-sm font-body">
              Cerita dan artikel terbaru dari desa akan segera hadir di sini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((post, i) => {
              const hasImage =
                typeof post.image === 'string' &&
                post.image.trim().length > 0 &&
                (post.image.startsWith('/') ||
                  post.image.startsWith('http') ||
                  post.image.startsWith('data:image'));

              return (
                <ScrollReveal
                  key={post.id}
                  variant={i % 2 === 0 ? 'left' : 'right'}
                  delayMs={(i % 2) * 100}
                  className="h-full"
                >
                  <article 
                    className="h-full bg-white rounded-3xl border border-[#33241b]/10 overflow-hidden hover:shadow-xl hover:shadow-[#8a5225]/12 hover:border-[#8a5225]/35 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {hasImage && (
                        <Link href={`/blog/${post.id}`} className="block aspect-[16/9] bg-[#f7f1ea] overflow-hidden">
                          <img 
                            src={post.image!} 
                            alt={post.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        </Link>
                      )}

                      <div className={`p-7 ${!hasImage ? 'pt-8 border-t-4 border-t-[#8a5225]/25' : ''}`}>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mb-3 font-body">
                          <span className="bg-[#8a5225]/10 text-[#854523] font-bold px-2.5 py-1 rounded">
                            {post.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={13} /> {post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={13} /> {post.author}
                          </span>
                        </div>

                        <Link href={`/blog/${post.id}`}>
                          <h2 className="text-xl md:text-2xl font-heading text-[#33241b] mb-3 group-hover:text-[#8a5225] transition leading-snug">
                            {post.title}
                          </h2>
                        </Link>

                        <p className="text-stone-600 text-sm font-body leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="px-7 pb-7 pt-2">
                      <Link 
                        href={`/blog/${post.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8a5225] group-hover:text-[#733f1b] transition font-body"
                      >
                        Baca Selengkapnya <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
