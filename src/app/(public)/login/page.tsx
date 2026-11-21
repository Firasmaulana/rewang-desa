"use client";

import { useActionState } from 'react';
import { login } from '@/actions/auth';
import { ArrowRight, Lock } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Login() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await login(formData);
    },
    null
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-[#fffaf5] font-body">
      <div className="bg-white p-8 md:p-12 rounded-3xl border border-[#33241b]/10 shadow-xl shadow-[#8a5225]/5 w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="mb-4">
            <Logo size="md" showTagline={false} />
          </div>
          <div className="w-12 h-12 bg-[#8a5225]/10 text-[#8a5225] rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock size={22} />
          </div>
          <h1 className="text-2xl md:text-3xl font-heading text-[#33241b] mb-1.5">Masuk Dasbor Admin</h1>
          <p className="text-stone-500 text-xs md:text-sm">Halaman akses khusus pengelola toko Rewang Desa.</p>
        </div>

        <form action={formAction} className="space-y-5">
          <div>
            <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">Username Admin</label>
            <input 
              type="text" 
              name="username"
              required
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]" 
              placeholder="Masukkan username admin" 
            />
          </div>

          <div>
            <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              name="password"
              required
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]" 
              placeholder="Masukkan password" 
            />
          </div>

          {state?.error && (
            <div className="bg-rose-50 text-[#c82929] p-3 rounded-xl text-xs font-semibold text-center border border-rose-100">
              {state.error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-[#8a5225] text-white font-semibold py-3.5 rounded-xl hover:bg-[#733f1b] transition shadow-lg shadow-[#8a5225]/20 flex justify-center items-center gap-2 disabled:opacity-70 text-sm cursor-pointer"
          >
            {isPending ? 'Memproses...' : 'Masuk ke Dasbor Admin'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-stone-500">
          <Link href="/" className="hover:underline text-stone-500 hover:text-[#8a5225] transition">
            &larr; Kembali ke Halaman Utama
          </Link>
        </div>

      </div>
    </div>
  );
}
