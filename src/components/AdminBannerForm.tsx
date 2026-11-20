'use client';

import { useState, useTransition } from 'react';
import { updateBanner } from '@/actions/banner';
import { DatabaseBanner } from '@/lib/supabase/types';
import { Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminBannerForm({ initialBanner }: { initialBanner: DatabaseBanner }) {
  const [tagline, setTagline] = useState(initialBanner.tagline);
  const [title, setTitle] = useState(initialBanner.title);
  const [description, setDescription] = useState(initialBanner.description);
  const [buttonText, setButtonText] = useState(initialBanner.button_text);

  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await updateBanner(formData);
        setStatus({
          type: 'success',
          message: 'Perubahan banner berhasil disimpan ke Supabase dan otomatis tersinkron ke beranda secara realtime!',
        });
      } catch (err: any) {
        setStatus({
          type: 'error',
          message: err?.message || 'Gagal menyimpan perubahan banner.',
        });
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-[#33241b]/10 shadow-sm p-6 md:p-8">
      {/* Live Preview (Updates instantly as you type!) */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-3">
          <label className="block font-bold text-stone-800 text-xs uppercase tracking-wider">
            Pratinjau Langsung (Live Preview)
          </label>
          <span className="text-[11px] font-semibold text-[#8a5225] bg-[#8a5225]/10 px-2.5 py-0.5 rounded-full">
            Realtime Typing
          </span>
        </div>

        <div className="bg-[#33241b] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden pointer-events-none border border-[#8a5225]/40 text-[#fffaf5] transition-all duration-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#8a5225]/30 rounded-full filter blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="md:w-3/5 relative z-10 text-center md:text-left mb-6 md:mb-0">
            <span className="text-[#ffdd7d] font-bold uppercase tracking-wider mb-2 block text-xs">
              {tagline || 'Tagline Banner'}
            </span>
            <h2 className="text-2xl md:text-3xl font-heading text-white leading-tight mb-3">
              {title || 'Judul Utama Promo'}
            </h2>
            <p className="text-stone-300 mb-4 max-w-md text-xs leading-relaxed">
              {description || 'Deskripsi singkat kampanye dukungan petani.'}
            </p>
            <span className="inline-block bg-[#ffdd7d] text-[#33241b] px-5 py-2 rounded-full font-bold text-xs shadow-md">
              {buttonText || 'Teks Tombol'}
            </span>
          </div>
          
          <div className="md:w-2/5 relative z-10 flex justify-center">
            <div className="w-36 h-36 rounded-2xl bg-[#241913] border border-[#8a5225] flex flex-col items-center justify-center p-3 text-center shadow-lg">
               <span className="text-4xl mb-1">{initialBanner.image_text}</span>
               <span className="font-heading text-white text-xs font-bold">Paket Rewang</span>
            </div>
          </div>
        </div>
      </div>

      {status?.type === 'success' && (
        <div className="mb-6 p-4 bg-[#5a8514]/15 border border-[#5a8514]/30 rounded-2xl flex items-center gap-3 text-[#5a8514] font-medium text-sm animate-fade-in">
          <CheckCircle2 size={20} className="shrink-0" />
          <span>{status.message}</span>
        </div>
      )}

      {status?.type === 'error' && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-700 font-medium text-sm">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Gagal menyimpan banner:</p>
            <p className="text-xs text-rose-600 mt-1">{status.message}</p>
          </div>
        </div>
      )}

      {/* Form with live state */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">
              Label Tagline *
            </label>
            <input 
              type="text" 
              name="tagline" 
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              required
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]" 
            />
          </div>
          <div>
            <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">
              Teks Tombol Aksi *
            </label>
            <input 
              type="text" 
              name="buttonText" 
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              required
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]" 
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">
            Judul Utama Kampanye *
          </label>
          <input 
            type="text" 
            name="title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]" 
          />
        </div>

        <div>
          <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">
            Deskripsi / Penjelasan Promo *
          </label>
          <textarea 
            name="description" 
            rows={3} 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5] resize-none"
          ></textarea>
        </div>

        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <button 
            type="submit" 
            disabled={isPending}
            className="bg-[#8a5225] text-white font-semibold py-2.5 px-6 rounded-xl hover:bg-[#733f1b] transition flex items-center gap-2 shadow-sm text-sm cursor-pointer disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Menyimpan ke Supabase...
              </>
            ) : (
              <>
                <Save size={18} /> Simpan Perubahan Banner
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
