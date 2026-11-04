"use client";

import { useActionState } from 'react';
import { login } from '@/actions/auth';
import { ArrowRight, Lock } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await login(formData);
    },
    null
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-[#FDFBF7]">
      <div className="bg-white p-8 md:p-12 rounded-3xl border border-amber-900/10 shadow-xl shadow-amber-900/5 w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 mb-2">Masuk Akun</h1>
          <p className="text-stone-500">Silakan login untuk mengakses dasbor admin.</p>
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block font-bold text-stone-800 mb-2">Username</label>
            <input 
              type="text" 
              name="username"
              required
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" 
              placeholder="Masukkan username" 
            />
          </div>

          <div>
            <label className="block font-bold text-stone-800 mb-2">Password</label>
            <input 
              type="password" 
              name="password"
              required
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" 
              placeholder="Masukkan password" 
            />
          </div>

          {state?.error && (
            <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm font-bold text-center">
              {state.error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-amber-800 text-white font-bold py-4 rounded-xl hover:bg-amber-900 transition shadow-lg flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {isPending ? 'Memproses...' : 'Masuk Dasbor'} <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-stone-500">
          <p>Belum punya akun?</p>
          <Link href="/register" className="text-amber-800 font-bold hover:underline mt-1 inline-block">
            Daftar Sekarang
          </Link>
          <p className="mt-4 text-xs">Atau <Link href="/" className="hover:underline">Kembali ke Beranda</Link></p>
        </div>

      </div>
    </div>
  );
}

