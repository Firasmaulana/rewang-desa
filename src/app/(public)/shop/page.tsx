import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

export const metadata = {
  title: 'Katalog Produk - Rewang Desa',
  description: 'Daftar produk alami dan kerajinan tangan dari desa binaan Rewang Desa.',
};

export default function Shop() {
  const categories = [
    'Semua',
    'Bahan Pokok & Bumbu',
    'Gula-gulaan',
    'Kerupuk & Kletikan',
    'Minuman & Herbal',
    'Kerajinan Rumah',
  ];

  return (
    <div className="bg-[#fffaf5] py-12">
      <div className="container mx-auto px-4">
        
        {/* Page Header */}
        <div className="mb-12 text-center md:text-left flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#33241b]/10 pb-8">
          <div>
            <span className="text-[#854523] text-xs font-bold uppercase tracking-widest mb-1.5 block font-body">
              Katalog Rewang Desa
            </span>
            <h1 className="text-3xl md:text-5xl font-heading text-[#33241b] mb-3">
              Hasil Tangan Petani &amp; Pengrajin
            </h1>
            <p className="text-stone-600 max-w-2xl text-sm md:text-base font-body">
              Seluruh komoditas dikurasi langsung dari desa untuk menjamin keaslian, kualitas murni, dan dampak kesejahteraan bagi warga desa.
            </p>
          </div>
          
          <div className="shrink-0">
            <select className="bg-white border border-[#33241b]/15 text-[#33241b] text-sm py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8a5225] shadow-sm font-body cursor-pointer">
              <option>Urutkan: Rekomendasi</option>
              <option>Harga: Rendah ke Tinggi</option>
              <option>Harga: Tinggi ke Rendah</option>
              <option>Rating Tertinggi</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white p-6 rounded-2xl border border-[#33241b]/10 shadow-sm sticky top-24">
              <h3 className="font-heading font-bold text-base text-[#33241b] mb-4 border-b border-stone-100 pb-2">
                Kategori Produk
              </h3>
              <ul className="space-y-2.5 font-body text-sm">
                {categories.map((cat, idx) => (
                  <li key={cat}>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        defaultChecked={idx === 0}
                        className="rounded border-[#33241b]/20 text-[#8a5225] focus:ring-[#8a5225] w-4 h-4 cursor-pointer accent-[#8a5225]" 
                      />
                      <span className="text-stone-600 group-hover:text-[#8a5225] transition">
                        {cat}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>

              <h3 className="font-heading font-bold text-base text-[#33241b] mb-4 mt-8 border-b border-stone-100 pb-2">
                Rentang Harga
              </h3>
              <div className="space-y-3 font-body">
                <input 
                  type="range" 
                  min="0" 
                  max="150000" 
                  className="w-full accent-[#8a5225] cursor-pointer" 
                />
                <div className="flex justify-between text-xs text-stone-500">
                  <span>Rp 0</span>
                  <span>Rp 150.000+</span>
                </div>
              </div>

              {/* Special Note */}
              <div className="mt-8 p-3.5 bg-[#fffaf5] rounded-xl border border-[#8a5225]/20 text-xs text-stone-600 font-body">
                <p className="font-semibold text-[#8a5225] mb-1">💡 Tips Sahabat Rewang</p>
                <p>Mau mix &amp; match untuk hampers atau bingkisan acara? Hubungi kami untuk custom paket sesuai kebutuhan.</p>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
