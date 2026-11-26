"use client";

import { LayoutDashboard, Package, Image as ImageIcon, Settings, LogOut, Globe, ShoppingBag, FileText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/actions/auth';
import Logo from '@/components/Logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinkClass = (href: string, exact = false) => {
    const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
    return isActive
      ? 'flex items-center gap-3 px-4 py-3 rounded-xl bg-[#8a5225]/30 text-[#ffdd7d] font-semibold border border-[#8a5225]/40 transition text-sm'
      : 'flex items-center gap-3 px-4 py-3 rounded-xl text-stone-300 hover:bg-[#8a5225]/20 hover:text-white transition text-sm';
  };

  return (
    <div className="flex h-screen bg-[#fffaf5] overflow-hidden font-body">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#33241b] text-white flex flex-col hidden md:flex shrink-0 border-r border-[#8a5225]/20">
        <div className="p-6 border-b border-[#8a5225]/20 flex flex-col items-start">
          <Logo variant="light" size="sm" showTagline={false} />
          <span className="text-[10px] tracking-widest uppercase font-bold text-[#ffdd7d] mt-1">
            Dasbor Pengelola
          </span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className={navLinkClass('/admin', true)}>
            <LayoutDashboard size={18} /> Dasbor
          </Link>
          <Link href="/admin/orders" className={navLinkClass('/admin/orders')}>
            <ShoppingBag size={18} /> Kelola Pesanan
          </Link>
          <Link href="/admin/products" className={navLinkClass('/admin/products')}>
            <Package size={18} /> Kelola Produk
          </Link>
          <Link href="/admin/articles" className={navLinkClass('/admin/articles')}>
            <FileText size={18} /> Kelola Artikel
          </Link>
          <Link href="/admin/banner" className={navLinkClass('/admin/banner')}>
            <ImageIcon size={18} /> Banner Info
          </Link>
          <Link href="/admin/settings" className={navLinkClass('/admin/settings')}>
            <Settings size={18} /> Pengaturan
          </Link>
        </nav>
        
        <div className="p-4 border-t border-[#8a5225]/20">
          <button 
            onClick={() => logout()}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-stone-300 hover:bg-[#c82929]/20 hover:text-white transition text-sm"
          >
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Topbar */}
        <header className="bg-white shadow-sm border-b border-[#33241b]/10 h-16 shrink-0 flex items-center justify-between px-6 z-10">
          <div className="md:hidden flex items-center gap-2">
            <Logo size="sm" showTagline={false} />
          </div>
          <div className="flex-1 hidden md:block"></div>
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#8a5225] hover:text-[#33241b] font-semibold bg-[#fffaf5] border border-[#8a5225]/25 px-3 py-1.5 rounded-full transition shadow-sm"
            >
              <Globe size={14} /> Lihat Toko
            </Link>
            <span className="text-xs md:text-sm font-medium text-[#33241b]">Halo, Admin Desa</span>
            <div className="w-9 h-9 bg-[#8a5225]/15 rounded-full border border-[#8a5225]/30 flex items-center justify-center text-[#8a5225] font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#fffaf5]">
          {children}
        </main>
      </div>
    </div>
  );
}
