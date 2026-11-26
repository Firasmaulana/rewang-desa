import { ArrowRight, ShieldCheck, HeartHandshake, Sparkles, PackageCheck } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import RealtimeBanner from '@/components/RealtimeBanner';
import ScrollReveal from '@/components/ScrollReveal';
import { getProducts, getBanners } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const [products, banners] = await Promise.all([
    getProducts(),
    getBanners({ onlyActive: true }),
  ]);

  // Top featured products from catalog
  const featuredProducts = products.slice(0, 4);

  const categories = [
    { 
      name: 'Bahan Pokok & Bumbu', 
      desc: 'Beras Jampang, Garam Jono, Kecap Kelapa', 
      image: '/products/garam-jono.webp' 
    },
    { 
      name: 'Gula-gulaan', 
      desc: 'Gula Singkong Manes, Gula Aren & Kelapa', 
      image: '/products/gula-aren-bulat.webp' 
    },
    { 
      name: 'Kerupuk & Kletikan', 
      desc: 'Kerupuk Pak Kamto, Keripik Tempe, Renggining', 
      image: '/products/keripik-tempe-2.webp' 
    },
    { 
      name: 'Minuman & Herbal', 
      desc: 'Kalehon Drink Honje, Madu Randu Blitar', 
      image: '/products/kalehon.webp' 
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero-parallax-wrapper relative min-h-[540px] md:min-h-[620px] flex items-center py-20 md:py-28 overflow-hidden bg-[#241811]">
        {/* Full-bleed Hero Background Image with Scroll-Driven Parallax */}
        <img
          src="/hero-background.webp"
          alt="Gerai Rewang Desa dengan aneka produk hasil bumi dan kerajinan desa"
          width={1920}
          height={1071}
          fetchPriority="high"
          className="hero-parallax-bg absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Warm Earthy Gradient Overlays for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1f140e]/90 via-[#2c1d15]/70 to-[#2c1d15]/30 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f140e]/70 via-transparent to-[#1f140e]/25 pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-center md:text-left">
            
            {/* Brand Eyebrow Badge */}
            <div className="hero-stagger-1 inline-flex items-center gap-2 bg-[#fffaf5]/15 backdrop-blur-md text-[#ffdd7d] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6 border border-[#ffdd7d]/30 font-body">
              <Sparkles size={14} className="text-[#ffdd7d]" />
              <span>Rewang Desa &bull; Dari Tangan Desa</span>
            </div>

            <h1 className="hero-stagger-2 text-4xl sm:text-5xl lg:text-6xl font-heading text-[#fffaf5] leading-[1.15] mb-8 drop-shadow-sm">
              Bantu Desa <span className="text-[#ffdd7d] italic font-normal">Tanpa Harus Pergi</span> ke Desa
            </h1>

            <div className="hero-stagger-3 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link 
                href="/shop" 
                className="bg-[#8a5225] text-[#fffaf5] px-8 py-3.5 rounded-full font-semibold hover:bg-[#a6622b] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 shadow-lg shadow-black/25 flex items-center justify-center gap-2 group text-sm md:text-base"
              >
                Jelajahi Katalog <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/about" 
                className="bg-white/15 backdrop-blur-md text-[#fffaf5] border border-white/30 px-8 py-3.5 rounded-full font-semibold hover:bg-white/25 hover:border-[#ffdd7d]/50 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center justify-center text-sm md:text-base"
              >
                Cerita Kami
              </Link>
            </div>

            {/* Quick Stats / Values */}
            <div className="hero-stagger-4 mt-12 pt-6 border-t border-white/20 flex items-center justify-center md:justify-start gap-8 text-xs text-stone-200 font-body">
              <div>
                <p className="font-heading font-bold text-lg text-[#ffdd7d]">100%</p>
                <p>Karya Petani Lokal</p>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div>
                <p className="font-heading font-bold text-lg text-[#ffdd7d]">Alami</p>
                <p>Tanpa Pengawet Buatan</p>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div>
                <p className="font-heading font-bold text-lg text-[#ffdd7d]">Berdampak</p>
                <p>Membantu UMKM Sepuh</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Multi-Slide Info & Booth Banner Carousel (Placed at Top) */}
      <RealtimeBanner initialBanners={banners} />

      {/* Philosophy / Features Section */}
      <section className="py-12 border-y border-[#33241b]/10 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal delayMs={0}>
              <div className="h-full flex items-start gap-4 bg-[#fffaf5] p-6 rounded-2xl border border-[#33241b]/5 hover:border-[#8a5225]/35 hover:-translate-y-1 hover:shadow-md hover:shadow-[#8a5225]/8 transition-all duration-300 group">
                <div className="w-12 h-12 bg-[#8a5225]/10 text-[#8a5225] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#8a5225] group-hover:text-white group-hover:scale-105 transition-all duration-200">
                  <PackageCheck size={24} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-[#33241b] text-base mb-1">Dari Tangan Petani</h4>
                  <p className="text-xs text-stone-600 leading-relaxed font-body">
                    Dikurasi langsung dari sawah dan kebun di Desa Jampang, Grobogan, Banyumas, dan Gunungkidul.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delayMs={90}>
              <div className="h-full flex items-start gap-4 bg-[#fffaf5] p-6 rounded-2xl border border-[#33241b]/5 hover:border-[#8a5225]/35 hover:-translate-y-1 hover:shadow-md hover:shadow-[#8a5225]/8 transition-all duration-300 group">
                <div className="w-12 h-12 bg-[#8a5225]/10 text-[#8a5225] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#8a5225] group-hover:text-white group-hover:scale-105 transition-all duration-200">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-[#33241b] text-base mb-1">Murni &amp; Alami</h4>
                  <p className="text-xs text-stone-600 leading-relaxed font-body">
                    Pilihan bahan pangan sehat tanpa pengawet sintesis, less gluten, dan aman bagi keluarga Anda.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delayMs={180}>
              <div className="h-full flex items-start gap-4 bg-[#fffaf5] p-6 rounded-2xl border border-[#33241b]/5 hover:border-[#8a5225]/35 hover:-translate-y-1 hover:shadow-md hover:shadow-[#8a5225]/8 transition-all duration-300 group">
                <div className="w-12 h-12 bg-[#8a5225]/10 text-[#8a5225] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#8a5225] group-hover:text-white group-hover:scale-105 transition-all duration-200">
                  <HeartHandshake size={24} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-[#33241b] text-base mb-1">Gotong Royong Nyata</h4>
                  <p className="text-xs text-stone-600 leading-relaxed font-body">
                    Sesuai makna &ldquo;rewang&rdquo;, setiap transaksi langsung menggerakkan roda kemandirian petani dan lansia desa.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="kategori" className="py-16 md:py-24 bg-[#fffaf5]">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal>
            <span className="text-[#854523] text-xs font-bold uppercase tracking-widest mb-2 block font-body">
              Kurasi Pilihan
            </span>
            <h2 className="text-3xl md:text-4xl font-heading text-[#33241b] mb-4">
              Kategori Hasil Bumi &amp; Kerajinan
            </h2>
            <p className="text-stone-600 mb-12 max-w-xl mx-auto text-sm md:text-base font-body">
              Jelajahi komoditas unggulan desa yang diproduksi dengan ketulusan tangan para pengrajin dan petani nusantara.
            </p>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <ScrollReveal key={i} delayMs={i * 80} className="h-full">
                <Link 
                  href={`/shop?category=${encodeURIComponent(cat.name)}`} 
                  className="h-full group bg-white p-6 rounded-2xl border border-[#33241b]/10 hover:border-[#8a5225] hover:shadow-xl hover:shadow-[#8a5225]/12 hover:-translate-y-1.5 active:scale-[0.99] transition-all duration-300 text-left flex flex-col justify-between"
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[#33241b]/10 mb-4 group-hover:border-[#8a5225]/50 group-hover:shadow-md transition-all shadow-sm bg-[#f7f1ea]">
                      <img 
                        src={cat.image} 
                        alt={cat.name} 
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                      />
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
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="produk" className="py-16 bg-white border-t border-[#33241b]/10">
        <div className="container mx-auto px-4">
          <ScrollReveal>
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
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8a5225] hover:text-[#733f1b] transition font-body group"
              >
                Lihat Semua Katalog <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => (
              <ScrollReveal key={product.id} delayMs={i * 80} className="h-full">
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
