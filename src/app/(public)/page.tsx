import { ArrowRight, Truck, ShieldCheck, Tag } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

export default function Home() {
  // Get trending products (e.g. top 4 products or highest rated)
  const trendingProducts = products.sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-lime-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 -translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 text-center md:text-left mb-10 md:mb-0">
            <span className="text-lime-700 font-bold tracking-wider uppercase text-sm mb-4 block">100% Organik & Lokal</span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 leading-tight mb-6">
              Mendukung <span className="text-amber-800">UMKM Desa</span> ke Pasar Global
            </h1>
            <p className="text-lg text-stone-600 mb-8 max-w-xl mx-auto md:mx-0">
              Temukan kualitas terbaik dari gula aren, gula kelapa, dan beras merah langsung dari tangan petani lokal. Sehat, alami, dan memberdayakan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/shop" className="bg-amber-800 text-white px-8 py-3 rounded-full font-bold hover:bg-amber-900 transition shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2">
                Belanja Sekarang <ArrowRight size={18} />
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            {/* Placeholder for Hero Image */}
            <div className="relative w-full max-w-md aspect-square bg-white rounded-full shadow-2xl shadow-amber-900/10 p-4 flex items-center justify-center border-4 border-amber-100">
               <div className="absolute w-full h-full rounded-full border border-dashed border-lime-300 animate-[spin_60s_linear_infinite]"></div>
               <div className="text-center">
                 <p className="text-stone-400 font-medium">[Gambar Hero Produk Organik]</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 border-y border-amber-900/10 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 bg-[#FDFBF7] p-6 rounded-2xl border border-amber-900/5 hover:border-amber-900/20 transition">
              <div className="w-14 h-14 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center shrink-0">
                <Truck size={28} />
              </div>
              <div>
                <h4 className="font-bold text-stone-800 mb-1">Pengiriman Cepat</h4>
                <p className="text-sm text-stone-500">Logistik aman ke seluruh Indonesia</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-[#FDFBF7] p-6 rounded-2xl border border-amber-900/5 hover:border-amber-900/20 transition">
              <div className="w-14 h-14 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center shrink-0">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h4 className="font-bold text-stone-800 mb-1">Pembayaran Aman</h4>
                <p className="text-sm text-stone-500">Transaksi terenkripsi 100% aman</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-[#FDFBF7] p-6 rounded-2xl border border-amber-900/5 hover:border-amber-900/20 transition">
              <div className="w-14 h-14 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center shrink-0">
                <Tag size={28} />
              </div>
              <div>
                <h4 className="font-bold text-stone-800 mb-1">Kualitas Premium</h4>
                <p className="text-sm text-stone-500">Kurasi ketat langsung dari petani</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="kategori" className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Kategori Pilihan</h2>
          <p className="text-stone-500 mb-12 max-w-2xl mx-auto">Jelajahi berbagai komoditas unggulan kami yang diproduksi dengan cinta oleh masyarakat desa.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Gula Aren', 'Gula Kelapa', 'Beras Merah', 'Rempah Tradisional'].map((cat, i) => (
              <Link href={`/shop?category=${cat}`} key={i} className="group cursor-pointer">
                <div className="bg-white aspect-square rounded-full flex items-center justify-center mb-4 mx-auto shadow-sm border border-amber-900/10 group-hover:border-lime-500 group-hover:shadow-md transition-all relative overflow-hidden w-40 md:w-48">
                  <div className="text-stone-300 text-sm">[Gambar {cat}]</div>
                </div>
                <h3 className="font-bold text-stone-800 group-hover:text-amber-800 transition">{cat}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section id="produk" className="py-16 bg-white border-t border-amber-900/5">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Produk Terlaris</h2>
              <p className="text-stone-500">Produk yang paling disukai oleh pelanggan kami.</p>
            </div>
            <Link href="/shop" className="hidden md:flex items-center gap-1 text-amber-800 font-semibold hover:text-amber-900 transition">
              Lihat Semua <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/shop" className="inline-flex items-center gap-1 text-amber-800 font-semibold hover:text-amber-900 transition">
              Lihat Semua <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-lime-800 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-lime-600 rounded-full mix-blend-overlay filter blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="md:w-1/2 relative z-10 text-center md:text-left mb-8 md:mb-0">
              <span className="text-lime-300 font-bold uppercase tracking-wider mb-2 block">Spesial Bulan Ini</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">Bundel Hemat<br/>Gula Aren & Kelapa</h2>
              <p className="text-lime-100 mb-8 max-w-md">Dapatkan kombinasi sempurna pemanis alami untuk kebutuhan dapur Anda dengan harga lebih hemat!</p>
              <Link href="/shop" className="bg-amber-600 text-white px-8 py-3 rounded-full font-bold hover:bg-amber-700 transition inline-block shadow-lg">
                Beli Sekarang (Diskon 15%)
              </Link>
            </div>
            
            <div className="md:w-1/2 relative z-10 flex justify-center">
              <div className="w-64 h-64 bg-lime-700 rounded-full flex items-center justify-center border-4 border-lime-500 shadow-2xl">
                 <span className="text-lime-300 font-medium">[Gambar Bundel]</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
