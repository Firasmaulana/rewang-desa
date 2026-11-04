import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Artikel & Berita - Rewang Desa',
  description: 'Informasi terbaru seputar UMKM, kearifan lokal, dan kegiatan Rewang Desa.',
};

const BLOG_POSTS = [
  {
    id: 1,
    title: 'Menyusuri Tradisi Pembuatan Gula Aren Organik',
    excerpt: 'Gula aren bukan sekadar pemanis, ia adalah saksi bisu kearifan lokal yang dijaga turun-temurun oleh para petani desa...',
    date: '12 Agustus 2026',
    author: 'Admin Desa',
    image: '🌴',
    category: 'Edukasi'
  },
  {
    id: 2,
    title: 'Panen Raya Beras Merah Berkualitas Ekspor',
    excerpt: 'Tahun ini membawa berkah melimpah. Kelompok tani kita berhasil memanen beras merah dengan kualitas yang diakui pasar internasional.',
    date: '28 Juli 2026',
    author: 'Humas Tani',
    image: '🌾',
    category: 'Berita'
  },
  {
    id: 3,
    title: 'Tips Menyimpan Rempah Agar Tahan Berbulan-bulan',
    excerpt: 'Rempah-rempah asli desa memiliki aroma yang kuat. Namun jika salah simpan, aromanya bisa hilang. Simak tips berikut ini.',
    date: '15 Juli 2026',
    author: 'Ibu PKK',
    image: '🌶️',
    category: 'Tips'
  },
  {
    id: 4,
    title: 'Kisah Sukses: Dari Usaha Rumahan Menjadi Pengekspor',
    excerpt: 'Mari belajar dari kesuksesan Ibu Nani yang berhasil menembus pasar luar kota berkat konsistensinya menjaga kualitas produk.',
    date: '02 Juli 2026',
    author: 'Admin Desa',
    image: '🌟',
    category: 'Inspirasi'
  }
];

export default function BlogPage() {
  return (
    <div className="bg-[#FDFBF7] min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-4">Artikel & Berita</h1>
          <p className="text-stone-500 max-w-2xl mx-auto text-lg">
            Kumpulan cerita, inspirasi, dan informasi terbaru langsung dari jantung kegiatan UMKM desa kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article key={post.id} className="bg-white rounded-3xl overflow-hidden border border-amber-900/10 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
              
              {/* Gambar / Ilustrasi */}
              <div className="h-48 bg-stone-100 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-amber-900/5 group-hover:bg-transparent transition-colors z-10"></div>
                <span className="text-7xl group-hover:scale-110 transition-transform duration-500 z-0">{post.image}</span>
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-amber-800 z-20 shadow-sm">
                  {post.category}
                </span>
              </div>

              {/* Konten */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs font-medium text-stone-400 mb-4">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                  <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
                </div>
                
                <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-amber-800 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-stone-500 text-sm leading-relaxed mb-6 flex-1">
                  {post.excerpt}
                </p>

                <Link href={`#`} className="inline-flex items-center gap-2 text-sm font-bold text-lime-700 hover:text-lime-800 transition mt-auto w-fit">
                  Baca Selengkapnya <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </article>
          ))}
        </div>

      </div>
    </div>
  );
}

