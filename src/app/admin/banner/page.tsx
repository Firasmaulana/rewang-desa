import { getBanner } from '@/lib/supabase/service';
import { updateBanner } from '@/actions/banner';
import { Save } from 'lucide-react';

export default async function AdminBanner() {
  const banner = await getBanner();

  return (
    <div className="max-w-4xl mx-auto font-body">
      <div className="mb-8">
        <h1 className="text-3xl font-heading text-[#33241b] mb-1">Banner Promo Beranda</h1>
        <p className="text-stone-500 text-sm">Sesuaikan pesan kampanye dukungan petani yang tampil di halaman depan website.</p>
      </div>

      <div className="bg-white rounded-3xl border border-[#33241b]/10 shadow-sm p-6 md:p-8">
        
        {/* Live Preview */}
        <div className="mb-10">
          <label className="block font-bold text-stone-800 mb-3 text-xs uppercase tracking-wider">Pratinjau Banner Saat Ini</label>
          <div className="bg-[#33241b] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden pointer-events-none border border-[#8a5225]/40 text-[#fffaf5]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#8a5225]/30 rounded-full filter blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="md:w-3/5 relative z-10 text-center md:text-left mb-6 md:mb-0">
              <span className="text-[#ffdd7d] font-bold uppercase tracking-wider mb-2 block text-xs">{banner.tagline}</span>
              <h2 className="text-2xl md:text-3xl font-heading text-white leading-tight mb-3">{banner.title}</h2>
              <p className="text-stone-300 mb-4 max-w-md text-xs leading-relaxed">{banner.description}</p>
              <span className="inline-block bg-[#ffdd7d] text-[#33241b] px-5 py-2 rounded-full font-bold text-xs shadow-md">
                {banner.button_text}
              </span>
            </div>
            
            <div className="md:w-2/5 relative z-10 flex justify-center">
              <div className="w-36 h-36 rounded-2xl bg-[#241913] border border-[#8a5225] flex flex-col items-center justify-center p-3 text-center shadow-lg">
                 <span className="text-4xl mb-1">{banner.image_text}</span>
                 <span className="font-heading text-white text-xs font-bold">Paket Rewang</span>
              </div>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <form action={updateBanner} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">Label Tagline *</label>
              <input 
                type="text" 
                name="tagline" 
                defaultValue={banner.tagline} 
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]" 
              />
            </div>
            <div>
              <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">Teks Tombol Aksi *</label>
              <input 
                type="text" 
                name="buttonText" 
                defaultValue={banner.button_text} 
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]" 
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">Judul Utama Kampanye *</label>
            <input 
              type="text" 
              name="title" 
              defaultValue={banner.title} 
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]" 
            />
          </div>

          <div>
            <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">Deskripsi / Penjelasan Promo *</label>
            <textarea 
              name="description" 
              rows={3} 
              defaultValue={banner.description} 
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5] resize-none"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <button 
              type="submit" 
              className="bg-[#8a5225] text-white font-semibold py-2.5 px-6 rounded-xl hover:bg-[#733f1b] transition flex items-center gap-2 shadow-sm text-sm"
            >
              <Save size={18} /> Simpan Perubahan Banner
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
