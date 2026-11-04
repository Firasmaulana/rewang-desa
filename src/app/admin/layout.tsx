"use client";

import { LayoutDashboard, Package, Image as ImageIcon, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { logout } from '@/actions/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 text-white flex flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-stone-800">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight">Rewang<span className="text-lime-500">Admin</span></span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-800/20 text-amber-500 font-bold transition">
            <LayoutDashboard size={20} /> Dasbor
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-400 hover:bg-stone-800 hover:text-white transition">
            <Package size={20} /> Produk
          </Link>
          <Link href="/admin/banner" className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-400 hover:bg-stone-800 hover:text-white transition">
            <ImageIcon size={20} /> Banner Promo
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-400 hover:bg-stone-800 hover:text-white transition">
            <Settings size={20} /> Pengaturan
          </Link>
        </nav>
        
        <div className="p-4 border-t border-stone-800">
          <button 
            onClick={() => logout()}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-stone-400 hover:bg-stone-800 hover:text-white transition"
          >
            <LogOut size={20} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Topbar */}
        <header className="bg-white shadow-sm border-b border-stone-200 h-16 shrink-0 flex items-center justify-between px-6 z-10">
          <div className="font-bold text-stone-800 md:hidden">Rewang Admin</div>
          <div className="flex-1 hidden md:block"></div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-stone-600">Halo, Admin Desa</span>
            <div className="w-10 h-10 bg-amber-100 rounded-full border border-amber-200 flex items-center justify-center text-amber-800 font-bold">
              AD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-stone-50">
          {children}
        </main>
      </div>
    </div>
  );
}

