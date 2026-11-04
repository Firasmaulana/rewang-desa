import { Save, Image as ImageIcon } from 'lucide-react';

export default function AdminBanner() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-stone-900 mb-2">Banner Beranda</h1>
        <p className="text-stone-500">Atur tampilan spanduk promo "Spesial Bulan Ini" di halaman depan.</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden p-6 md:p-8">
        
        {/* Live Preview */}
        <div className="mb-10">
          <label className="block font-bold text-stone-800 mb-4">Pratinjau Banner Saat Ini</label>
          <div className="bg-lime-800 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between relative overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-lime-600 rounded-full mix-blend-overlay filter blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="md:w-1/2 relative z-10 text-center md:text-left mb-8 md:mb-0">
              <span className="text-lime-300 font-bold uppercase tracking-wider mb-2 block">Spesial Bulan Ini</span>
              <h2 className="text-3xl font-extrabold text-white leading-tight mb-4">Bundel Hemat<br/>Gula Aren & Kelapa</h2>
              <p className="text-lime-100 mb-8 max-w-md text-sm">Dapatkan kombinasi sempurna pemanis alami untuk kebutuhan dapur Anda dengan harga lebih hemat!</p>
              <button className="bg-amber-600 text-white px-6 py-2 rounded-full font-bold">
                Beli Sekarang (Diskon 15%)
              </button>
            </div>
            
            <div className="md:w-1/2 relative z-10 flex justify-center">
              <div className="w-48 h-48 bg-lime-700 rounded-full flex items-center justify-center border-4 border-lime-500 shadow-xl text-lime-300">
                 [Gambar]
              </div>
            </div>
          </div>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold text-stone-800 mb-2">Label Kecil (Kuning) *</label>
              <input type="text" defaultValue="Spesial Bulan Ini" className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block font-bold text-stone-800 mb-2">Teks Tombol *</label>
              <input type="text" defaultValue="Beli Sekarang (Diskon 15%)" className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-800 mb-2">Judul Utama *</label>
            <input type="text" defaultValue="Bundel Hemat Gula Aren & Kelapa" className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>

          <div>
            <label className="block font-bold text-stone-800 mb-2">Deskripsi *</label>
            <textarea rows={3} className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" defaultValue="Dapatkan kombinasi sempurna pemanis alami untuk kebutuhan dapur Anda dengan harga lebih hemat!"></textarea>
          </div>

          <div>
            <label className="block font-bold text-stone-800 mb-2">Gambar Produk Banner</label>
            <div className="border border-dashed border-stone-300 rounded-xl p-4 flex items-center gap-4 hover:bg-stone-50 transition cursor-pointer">
              <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center text-stone-400">
                <ImageIcon />
              </div>
              <div>
                <p className="font-bold text-stone-700">Upload Gambar Baru</p>
                <p className="text-sm text-stone-500">Format disarankan: PNG transparan (tanpa background)</p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-stone-100 flex justify-end">
            <button type="button" className="bg-amber-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-amber-900 transition flex items-center gap-2">
              <Save size={20} /> Simpan Perubahan Banner
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

