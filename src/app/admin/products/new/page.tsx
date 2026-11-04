import { ArrowLeft, Upload, Save } from 'lucide-react';
import Link from 'next/link';

export default function AddProduct() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 text-stone-500 hover:text-stone-900 transition">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 mb-2">Tambah Produk Baru</h1>
          <p className="text-stone-500">Masukkan detail produk UMKM untuk ditampilkan di toko.</p>
        </div>
      </div>
      
      <form className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Kolom Kiri */}
          <div className="space-y-6">
            <div>
              <label className="block font-bold text-stone-800 mb-2">Nama Produk *</label>
              <input type="text" className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Cth: Gula Aren Cair 1 Liter" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-800 mb-2">Harga (Rp) *</label>
                <input type="number" className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="0" />
              </div>
              <div>
                <label className="block font-bold text-stone-800 mb-2">Harga Coret (Opsi)</label>
                <input type="number" className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="0" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-800 mb-2">Kategori *</label>
                <select className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option>Gula Aren</option>
                  <option>Gula Kelapa</option>
                  <option>Beras Merah</option>
                  <option>Rempah Tradisional</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-stone-800 mb-2">Stok Awal *</label>
                <input type="number" className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="0" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-2">Deskripsi Produk *</label>
              <textarea rows={5} className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Ceritakan keunggulan produk ini..."></textarea>
            </div>
          </div>

          {/* Kolom Kanan (Gambar) */}
          <div className="space-y-6">
            <div>
              <label className="block font-bold text-stone-800 mb-2">Gambar Produk Utama *</label>
              <div className="border-2 border-dashed border-stone-300 rounded-2xl h-64 flex flex-col items-center justify-center text-stone-500 hover:bg-stone-50 transition cursor-pointer">
                <Upload size={32} className="mb-2 text-stone-400" />
                <p className="font-medium">Klik untuk upload foto</p>
                <p className="text-xs mt-1">PNG, JPG up to 2MB</p>
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-2">Galeri Tambahan</label>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="border border-dashed border-stone-300 rounded-xl aspect-square flex items-center justify-center hover:bg-stone-50 transition cursor-pointer">
                    <PlusIcon />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-stone-100 flex justify-end gap-4">
          <Link href="/admin/products" className="px-6 py-2 rounded-lg font-bold text-stone-600 hover:bg-stone-100 transition">
            Batal
          </Link>
          <button type="button" className="bg-amber-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-amber-900 transition flex items-center gap-2">
            <Save size={20} /> Simpan Produk
          </button>
        </div>
      </form>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-stone-400"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  )
}

