import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Artikel & Cerita Desa - Rewang Desa',
  description: 'Kisah para petani, kearifan lokal, dan kabar panen dari desa binaan Rewang Desa.',
};

const BLOG_POSTS = [
  {
    id: 1,
    title: 'Garam Jono: Keajaiban Garam Sumur Panas di Tengah Daratan Grobogan',
    excerpt: 'Bukan berasal dari air laut, melainkan dari air sumur panas alami di Desa Jono yang dijemur di atas bilah bambu "klakah" oleh para petani sepuh...',
    date: '12 Agustus 2026',
    author: 'Tim Rewang',
    image: '🧂',
    category: 'Cerita Petani'
  },
  {
    id: 2,
    title: 'Mengenal Beras Merah & Hitam Jampang dengan Indeks Glikemik Rendah',
    excerpt: 'Petani Desa Jampang Sukabumi merawat varietas padi lokal yang terbukti memiliki indeks glikemik rendah, sangat ideal sebagai pangan harian yang sehat...',
    date: '28 Juli 2026',
    author: 'Pangan Sehat',
    image: '🌾',
    category: 'Edukasi'
  },
  {
    id: 3,
    title: 'Pak Djohan & Perjuangan Mengangkat Nilai Singkong di Banjarnegara',
    excerpt: 'Berangkat dari kepedulian terhadap harga singkong mentah yang anjlok, seorang guru desa menggerakkan kelompok tani memproduksi Gula Singkong Manes bernilai tinggi...',
    date: '15 Juli 2026',
    author: 'Inspirasi Desa',
    image: '🍯',
    category: 'Inspirasi'
  },
  {
    id: 4,
    title: 'Memberdayakan Mbah-Mbah Sepuh Melalui Kerupuk Bawang Pak Kamto',
    excerpt: 'Di Gunungkidul, usaha kerupuk bawang rumahan Pak Kamto menjadi tumpuan bagi para lansia desa untuk tetap aktif, dihargai, dan mandiri secara ekonomi...',
    date: '02 Juli 2026',
    author: 'Tim Rewang',
    image: '🥨',
    category: 'Gotong Royong'
  }
];

export default function BlogPage() {
  return (
    <div className="bg-[#fffaf5] min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-[#854523] text-xs font-bold uppercase tracking-widest mb-2 block font-body">
            Kabar &amp; Kearifan Lokal
          </span>
          <h1 className="text-3xl md:text-5xl font-heading text-[#33241b] mb-4">
            Artikel &amp; Cerita dari Desa
          </h1>
          <p className="text-stone-600 text-sm md:text-base font-body">
            Kumpulan kisah perjuangan, inovasi pangan lokal, dan kearifan masyarakat desa yang kami temui di setiap jengkal perjalanan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOG_POSTS.map((post) => (
            <article 
              key={post.id} 
              className="bg-white rounded-3xl border border-[#33241b]/10 overflow-hidden hover:shadow-xl hover:shadow-[#8a5225]/10 hover:border-[#8a5225]/30 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="aspect-[16/9] bg-[#f7f1ea] flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-300">
                  {post.image}
                </div>
                <div className="p-7">
                  <div className="flex items-center gap-3 text-xs text-stone-500 mb-3 font-body">
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

                  <h2 className="text-xl md:text-2xl font-heading text-[#33241b] mb-3 group-hover:text-[#8a5225] transition leading-snug">
                    {post.title}
                  </h2>

                  <p className="text-stone-600 text-sm font-body leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-7 pb-7 pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8a5225] group-hover:text-[#733f1b] transition font-body">
                  Baca Selengkapnya <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}
