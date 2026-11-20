import { ArrowRight, ShieldCheck, HeartHandshake, Sparkles, PackageCheck } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import Logo from '@/components/Logo';
import { getProducts, getBanner } from '@/lib/supabase/service';

export default async function Home() {
  const [products, banner] = await Promise.all([
    getProducts(),
    getBanner(),
  ]);

  // Top featured products from catalog
  const featuredProducts = products.slice(0, 4);

  const categories = [
    { name: 'Bahan Pokok & Bumbu', desc: 'Beras Jampang, Garam Jono, Kecap Kelapa', icon: '🌾' },
    { name: 'Gula-gulaan', desc: 'Gula Singkong Manes, Gula Aren & Kelapa', icon: '🍯' },
    { name: 'Kerupuk & Kletikan', desc: 'Kerupuk Pak Kamto, Keripik Tempe, Renggining', icon: '🥨' },
    { name: 'Minuman & Herbal', desc: 'Kalehon Drink Honje, Madu Randu Blitar', icon: '🍹' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-[#fffaf5] via-[#f7f1ea]/60 to-[#fffaf5]">
        {/* Soft Organic Warm Blurs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8a5225]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#ffdd7d]/25 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 text-center md:text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 bg-[#8a5225]/10 text-[#854523] px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6 border border-[#8a5225]/20 font-body">
              <Sparkles size={14} className="text-[#8a5225]" />
              <span>Dari Tangan Desa</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading text-[#33241b] leading-[1.15] mb-6">
              Menghubungkan <span className="text-[#8a5225] italic font-normal">Hasil Bumi</span> Desa dengan Anda
            </h1>
            
            <p className="text-base sm:text-lg text-stone-600 mb-8 max-w-xl mx-auto md:mx-0 font-body leading-relaxed">
              Lahir dari keresahan melihat potensi desa yang besar. Rewang Desa hadir sebagai jembatan menghubungkan produk alami, karya pengrajin, dan cerita petani langsung ke tangan Sahabat Rewang.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link 
                href="/shop" 
                className="bg-[#8a5225] text-[#fffaf5] px-8 py-3.5 rounded-full font-semibold hover:bg-[#733f1b] transition shadow-lg shadow-[#8a5225]/25 flex items-center justify-center gap-2 group text-sm md:text-base"
              >
                Jelajahi Katalog <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/about" 
                className="bg-white text-[#33241b] border border-[#33241b]/15 px-8 py-3.5 rounded-full font-semibold hover:bg-[#f7f1ea] hover:border-[#8a5225]/40 transition flex items-center justify-center text-sm md:text-base"
              >
                Cerita Kami
              </Link>
            </div>

            {/* Quick Stats / Values */}
            <div className="mt-10 pt-6 border-t border-[#33241b]/10 flex items-center justify-center md:justify-start gap-8 text-xs text-stone-500 font-body">
              <div>
                <p className="font-heading font-bold text-lg text-[#33241b]">100%</p>
                <p>Karya Petani Lokal</p>
              </div>
              <div className="w-px h-8 bg-[#33241b]/10"></div>
              <div>
                <p className="font-heading font-bold text-lg text-[#33241b]">Alami</p>
                <p>Tanpa Pengawet Buatan</p>
              </div>
              <div className="w-px h-8 bg-[#33241b]/10"></div>
              <div>
                <p className="font-heading font-bold text-lg text-[#33241b]">Berdampak</p>
                <p>Membantu UMKM Sepuh</p>
              </div>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="md:w-1/2 flex justify-center w-full">
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-[#f7f1ea] via-white to-[#fffaf5] shadow-2xl shadow-[#8a5225]/15 p-8 flex flex-col justify-between border border-[#8a5225]/20">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold tracking-widest text-[#8a5225] uppercase bg-[#8a5225]/10 px-2.5 py-1 rounded">
                  Edisi Katalog 2026
                </span>
                <span className="text-2xl">🌱</span>
              </div>

              {/* Center Emblem with Logo */}
              <div className="text-center py-6 my-auto">
                <div className="w-24 h-24 rounded-full bg-[#8a5225]/10 mx-auto flex items-center justify-center mb-4 border border-[#8a5225]/30">
                  <span className="text-4xl">🌾</span>
                </div>
                <Logo size="lg" />
                <p className="font-heading text-sm text-[#8a5225] mt-2 italic">
                  &ldquo;Tumbuh dan bergerak bersama desa&rdquo;
                </p>
              </div>

              {/* Bottom Feature Pill */}
              <div className="bg-white/90 backdrop-blur rounded-2xl p-3.5 border border-[#33241b]/10 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ffdd7d]/40 text-[#8a5225] flex items-center justify-center shrink-0 font-bold">
                  ✨
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-[#33241b]">Garam Jono &amp; Beras Sukabumi</p>
                  <p className="text-stone-500">Pilihan favorit Sahabat Rewang bulan ini</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy / Features Section */}
      <section className="py-12 border-y border-[#33241b]/10 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 bg-[#fffaf5] p-6 rounded-2xl border border-[#33241b]/5 hover:border-[#8a5225]/30 transition group">
              <div className="w-12 h-12 bg-[#8a5225]/10 text-[#8a5225] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#8a5225] group-hover:text-white transition-colors duration-200">
                <PackageCheck size={24} />
              </div>
              <div>
                <h4 className="font-heading font-bold text-[#33241b] text-base mb-1">Dari Tangan Petani</h4>
                <p className="text-xs text-stone-600 leading-relaxed font-body">
                  Dikurasi langsung dari sawah dan kebun di Desa Jampang, Grobogan, Banyumas, dan Gunungkidul.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-[#fffaf5] p-6 rounded-2xl border border-[#33241b]/5 hover:border-[#8a5225]/30 transition group">
              <div className="w-12 h-12 bg-[#8a5225]/10 text-[#8a5225] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#8a5225] group-hover:text-white transition-colors duration-200">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-heading font-bold text-[#33241b] text-base mb-1">Murni &amp; Alami</h4>
                <p className="text-xs text-stone-600 leading-relaxed font-body">
                  Pilihan bahan pangan sehat tanpa pengawet sintesis, less gluten, dan aman bagi keluarga Anda.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-[#fffaf5] p-6 rounded-2xl border border-[#33241b]/5 hover:border-[#8a5225]/30 transition group">
              <div className="w-12 h-12 bg-[#8a5225]/10 text-[#8a5225] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#8a5225] group-hover:text-white transition-colors duration-200">
                <HeartHandshake size={24} />
              </div>
              <div>
                <h4 className="font-heading font-bold text-[#33241b] text-base mb-1">Gotong Royong Nyata</h4>
                <p className="text-xs text-stone-600 leading-relaxed font-body">
                  Sesuai makna &ldquo;rewang&rdquo;, setiap transaksi langsung menggerakkan roda kemandirian petani dan lansia desa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="kategori" className="py-16 md:py-24 bg-[#fffaf5]">
        <div className="container mx-auto px-4 text-center">
          <span className="text-[#854523] text-xs font-bold uppercase tracking-widest mb-2 block font-body">
            Kurasi Pilihan
          </span>
          <h2 className="text-3xl md:text-4xl font-heading text-[#33241b] mb-4">
            Kategori Hasil Bumi &amp; Kerajinan
          </h2>
          <p className="text-stone-600 mb-12 max-w-xl mx-auto text-sm md:text-base font-body">
            Jelajahi komoditas unggulan desa yang diproduksi dengan ketulusan tangan para pengrajin dan petani nusantara.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <Link 
                href={`/shop?category=${encodeURIComponent(cat.name)}`} 
                key={i} 
                className="group bg-white p-6 rounded-2xl border border-[#33241b]/10 hover:border-[#8a5225] hover:shadow-lg hover:shadow-[#8a5225]/10 transition-all duration-300 text-left flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#f7f1ea] group-hover:bg-[#ffdd7d]/30 text-2xl flex items-center justify-center mb-4 transition-colors">
                    {cat.icon}
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[#33241b] group-hover:text-[#8a5225] transition mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-stone-500 text-xs font-body leading-relaxed mb-4">
                    {cat.desc}
                  </p>
                </div>
                <div className="text-xs font-semibold text-[#8a5225] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Lihat Produk <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="produk" className="py-16 bg-white border-t border-[#33241b]/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <span className="text-[#854523] text-xs font-bold uppercase tracking-widest mb-2 block font-body">
                Favorit Sahabat Rewang
              </span>
              <h2 className="text-3xl md:text-4xl font-heading text-[#33241b] mb-2">
                Produk Pilihan Bulan Ini
              </h2>
              <p className="text-stone-600 text-sm font-body">
                Karya pangan terbaik dari Sukabumi, Grobogan, Banjarnegara, hingga Banyumas.
              </p>
            </div>
            <Link 
              href="/shop" 
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8a5225] hover:text-[#733f1b] transition font-body"
            >
              Lihat Semua Katalog <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Promo Banner (Managed via Admin Dashboard & Supabase) */}
      {banner.is_active && (
        <section className="py-16 bg-[#fffaf5]">
          <div className="container mx-auto px-4">
            <div className="bg-[#33241b] rounded-3xl p-8 md:p-14 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-2xl border border-[#8a5225]/40 text-[#fffaf5]">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#8a5225]/30 rounded-full filter blur-3xl opacity-60 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
              
              <div className="md:w-3/5 relative z-10 text-center md:text-left mb-8 md:mb-0">
                <span className="text-[#ffdd7d] font-bold text-xs uppercase tracking-widest mb-3 block font-body">
                  {banner.tagline}
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-white leading-tight mb-4">
                  {banner.title}
                </h2>
                <p className="text-stone-300 text-sm md:text-base mb-6 max-w-lg leading-relaxed font-body">
                  {banner.description}
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                  <Link 
                    href={banner.button_link} 
                    className="bg-[#ffdd7d] hover:bg-[#ffe69e] text-[#33241b] px-8 py-3.5 rounded-full font-bold transition shadow-lg text-sm md:text-base font-body inline-flex items-center gap-2"
                  >
                    {banner.button_text}
                  </Link>
                </div>
              </div>
              
              <div className="md:w-2/5 relative z-10 flex justify-center">
                <div className="w-56 h-56 md:w-64 md:h-64 rounded-3xl bg-[#241913] border-2 border-[#8a5225] flex flex-col items-center justify-center p-6 text-center shadow-xl">
                  <span className="text-5xl mb-3">{banner.image_text}</span>
                  <span className="font-heading text-white text-lg font-bold">Paket Rewang Tani</span>
                  <span className="text-xs text-[#ffdd7d] mt-1 font-body">4 Kebutuhan Pokok Alami</span>
                  <span className="mt-3 text-[11px] bg-[#8a5225] text-white px-3 py-1 rounded-full font-body font-semibold">
                    Langsung dari Petani
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
