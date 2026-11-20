import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { createProduct } from '@/actions/products';

export default function AddProduct() {
  return (
    <div className="max-w-4xl mx-auto font-body">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 text-stone-500 hover:text-stone-900 transition">
          <ArrowLeft size={22} />
        </Link>
        <div>
          <h1 className="text-3xl font-heading text-[#33241b] mb-1">Tambah Produk Baru</h1>
          <p className="text-stone-500 text-sm">Masukkan detail produk hasil desa untuk langsung ditampilkan di toko.</p>
        </div>
      </div>
      
      <form action={createProduct} className="bg-white rounded-3xl border border-[#33241b]/10 shadow-sm p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Kolom Kiri */}
          <div className="space-y-5">
            <div>
              <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">Nama Produk *</label>
              <input 
                type="text" 
                name="name"
                required
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]" 
                placeholder="Cth: Gula Aren Cair 1 Liter" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">Harga Jual (Rp) *</label>
                <input 
                  type="number" 
                  name="price"
                  required
                  min="0"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]" 
                  placeholder="35000" 
                />
              </div>
              <div>
                <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">Harga Coret (Opsi)</label>
                <input 
                  type="number" 
                  name="originalPrice"
                  min="0"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]" 
                  placeholder="40000" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">Kategori *</label>
                <select 
                  name="category"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]"
                >
                  <option value="Bahan Pokok & Bumbu">Bahan Pokok & Bumbu</option>
                  <option value="Gula-gulaan">Gula-gulaan</option>
                  <option value="Kerupuk & Kletikan">Kerupuk & Kletikan</option>
                  <option value="Minuman & Herbal">Minuman & Herbal</option>
                  <option value="Kerajinan Rumah">Kerajinan Rumah</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">Stok Awal *</label>
                <input 
                  type="number" 
                  name="stock"
                  defaultValue={50}
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]" 
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">Daerah Asal Petani / Desa</label>
              <input 
                type="text" 
                name="origin"
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]" 
                placeholder="Cth: Desa Jampang, Sukabumi" 
              />
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-5">
            <div>
              <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">Emoji / Ikon Tampilan *</label>
              <input 
                type="text" 
                name="image"
                defaultValue="🌾 Produk Alami"
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]" 
                placeholder="🌾 Beras Merah / 🍯 Gula" 
              />
            </div>

            <div>
              <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">Label Lencana (Opsi)</label>
              <input 
                type="text" 
                name="badge"
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]" 
                placeholder="BEST SELLER / ORGANIK" 
              />
            </div>

            <div>
              <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">Cerita &amp; Deskripsi Produk *</label>
              <textarea 
                name="description"
                rows={5} 
                required
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5] resize-none" 
                placeholder="Ceritakan khasiat, cara tanam, atau asal-usul produk dari tangan petani desa..."
              ></textarea>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-100 flex justify-end gap-3">
          <Link href="/admin/products" className="px-6 py-2.5 rounded-xl font-semibold text-stone-600 hover:bg-stone-100 transition text-sm">
            Batal
          </Link>
          <button 
            type="submit" 
            className="bg-[#8a5225] text-white font-semibold py-2.5 px-6 rounded-xl hover:bg-[#733f1b] transition flex items-center gap-2 shadow-sm text-sm"
          >
            <Save size={18} /> Simpan &amp; Publikasikan ke Toko
          </button>
        </div>
      </form>
    </div>
  );
}
