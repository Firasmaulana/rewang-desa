"use client";

import { useState } from 'react';
import { ArrowRight, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function Register() {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-[#FDFBF7]">
      <div className="bg-white p-8 md:p-12 rounded-3xl border border-amber-900/10 shadow-xl shadow-amber-900/5 w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-lime-100 text-lime-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 mb-2">Daftar Akun</h1>
          <p className="text-stone-500">Bergabung untuk kemudahan belanja UMKM.</p>
        </div>

        {isSuccess ? (
          <div className="text-center space-y-6">
            <div className="bg-lime-50 text-lime-700 p-4 rounded-xl border border-lime-200">
              <h3 className="font-bold text-lg mb-1">Pendaftaran Berhasil!</h3>
              <p className="text-sm">Silakan gunakan akun Anda untuk masuk.</p>
            </div>
            <Link 
              href="/login" 
              className="block w-full bg-amber-800 text-white font-bold py-4 rounded-xl hover:bg-amber-900 transition shadow-lg"
            >
              Lanjut ke Halaman Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block font-bold text-stone-800 mb-2">Nama Lengkap</label>
              <input 
                type="text" 
                required
                className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" 
                placeholder="Cth: Budi Santoso" 
              />
            </div>
            
            <div>
              <label className="block font-bold text-stone-800 mb-2">Username</label>
              <input 
                type="text" 
                required
                className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" 
                placeholder="Pilih username" 
              />
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-2">Password</label>
              <input 
                type="password" 
                required
                className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" 
                placeholder="Buat password" 
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-amber-800 text-white font-bold py-4 rounded-xl hover:bg-amber-900 transition shadow-lg flex justify-center items-center gap-2"
            >
              Buat Akun <ArrowRight size={20} />
            </button>
          </form>
        )}

        {!isSuccess && (
          <div className="mt-8 text-center text-sm text-stone-500">
            <p>Sudah punya akun?</p>
            <Link href="/login" className="text-amber-800 font-bold hover:underline mt-2 inline-block">
              Masuk di sini
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

