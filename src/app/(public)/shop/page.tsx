import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

export default function Shop() {
  return (
    <div className="bg-[#FDFBF7] py-12">
      <div className="container mx-auto px-4">
        
        {/* Page Header */}
        <div className="mb-12 text-center md:text-left flex flex-col md:flex-row justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold text-stone-900 mb-4">Katalog Produk</h1>
            <p className="text-stone-600 max-w-2xl">
              Semua produk lokal pilihan dari petani desa, disajikan langsung untuk Anda.
            </p>
          </div>
          
          <div className="mt-6 md:mt-0">
            <select className="bg-white border border-amber-900/10 text-stone-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm">
              <option>Urutkan: Rekomendasi</option>
              <option>Harga: Rendah ke Tinggi</option>
              <option>Harga: Tinggi ke Rendah</option>
              <option>Terbaru</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-sm">
              <h3 className="font-bold text-lg text-stone-900 mb-4 border-b border-stone-100 pb-2">Kategori</h3>
              <ul className="space-y-3">
                {['Semua', 'Gula Aren', 'Gula Kelapa', 'Beras Merah', 'Rempah Tradisional'].map((cat) => (
                  <li key={cat}>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="rounded border-amber-900/20 text-amber-800 focus:ring-amber-500 w-4 h-4 cursor-pointer" />
                      <span className="text-stone-600 group-hover:text-amber-800 transition">{cat}</span>
                    </label>
                  </li>
                ))}
              </ul>

              <h3 className="font-bold text-lg text-stone-900 mb-4 mt-8 border-b border-stone-100 pb-2">Rentang Harga</h3>
              <div className="space-y-3">
                <input type="range" min="0" max="100000" className="w-full accent-amber-800" />
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Rp 0</span>
                  <span>Rp 100rb+</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center gap-2">
              <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-amber-900/10 text-stone-500 hover:bg-amber-50 hover:text-amber-800 transition">
                &lt;
              </button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-800 text-white font-bold shadow">
                1
              </button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-amber-900/10 text-stone-500 hover:bg-amber-50 hover:text-amber-800 transition">
                2
              </button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-amber-900/10 text-stone-500 hover:bg-amber-50 hover:text-amber-800 transition">
                &gt;
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

