"use client";

import { useState } from 'react';
import { ArrowRight, UserPlus } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Register() {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-[#fffaf5] font-body">
      <div className="bg-white p-8 md:p-12 rounded-3xl border border-[#33241b]/10 shadow-xl shadow-[#8a5225]/5 w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="mb-4">
            <Logo size="md" showTagline={false} />
          </div>
          <div className="w-12 h-12 bg-[#8a5225]/10 text-[#8a5225] rounded-full flex items-center justify-center mx-auto mb-3">
            <UserPlus size={22} />
          </div>
          <h1 className="text-2xl md:text-3xl font-heading text-[#33241b] mb-1.5">Daftar Sahabat Rewang</h1>
          <p className="text-stone-500 text-xs md:text-sm">Bergabung untuk kemudahan belanja produk desa nusantara.</p>
        </div>

        {isSuccess ? (
          <div className="text-center space-y-6">
            <div className="bg-[#fffaf5] text-[#8a5225] p-5 rounded-2xl border border-[#8a5225]/30">
              <h3 className="font-heading font-bold text-lg mb-1 text-[#33241b]">Pendaftaran Berhasil!</h3>
              <p className="text-xs text-stone-600">Selamat bergabung menjadi Sahabat Rewang. Silakan login untuk melanjutkan.</p>
            </div>
            <Link 
              href="/login" 
              className="block w-full bg-[#8a5225] text-white font-semibold py-3.5 rounded-xl hover:bg-[#733f1b] transition shadow-lg text-sm"
            >
              Lanjut ke Halaman Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">Nama Lengkap</label>
              <input 
                type="text" 
                required
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]" 
                placeholder="Cth: Sahabat Rewang" 
              />
            </div>
            
            <div>
              <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">Username</label>
              <input 
                type="text" 
                required
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]" 
                placeholder="Pilih username" 
              />
            </div>

            <div>
              <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">Password</label>
              <input 
                type="password" 
                required
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]" 
                placeholder="Buat password" 
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#8a5225] text-white font-semibold py-3.5 rounded-xl hover:bg-[#733f1b] transition shadow-lg shadow-[#8a5225]/20 flex justify-center items-center gap-2 text-sm"
            >
              Buat Akun <ArrowRight size={18} />
            </button>
          </form>
        )}

        {!isSuccess && (
          <div className="mt-8 text-center text-xs text-stone-500">
            <p>Sudah punya akun?</p>
            <Link href="/login" className="text-[#8a5225] font-semibold hover:underline mt-1 inline-block">
              Masuk di sini
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
