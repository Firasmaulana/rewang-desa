"use client";

import { Search, ShoppingCart, Heart, Menu, Leaf, LayoutDashboard, Truck } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { logout } from '@/actions/auth';
import Logo from '@/components/Logo';

export default function Header({ user }: { user?: { name: string; role: string } | null }) {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#33241b] text-[#fffaf5] text-xs md:text-sm py-2 px-4 text-center font-body border-b border-[#8a5225]/20">
        <div className="container mx-auto flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5">
            <Leaf size={14} className="text-[#ffdd7d]" /> Dari Tangan Desa ke Meja Anda
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">Gunakan kode <strong className="text-[#ffdd7d] tracking-wide font-bold">REWANG20</strong> untuk diskon 20% belanja perdana</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-[#fffaf5]/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-[#33241b]/10">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-4">
          
          {/* Mobile Menu & Logo */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Buka menu"
              className="md:hidden text-[#33241b] hover:text-[#8a5225] transition p-1"
            >
              <Menu size={24} />
            </button>
            <Logo size="md" />
          </div>

          {/* Search Bar (Desktop) */}
          <form 
            action="/shop" 
            method="GET"
            className="hidden md:flex flex-1 max-w-xl mx-6 bg-white rounded-full border border-[#33241b]/15 overflow-hidden focus-within:ring-2 focus-within:ring-[#8a5225] focus-within:border-[#8a5225] transition-all shadow-sm"
          >
            <select 
              name="category"
              className="bg-transparent border-none py-2.5 pl-4 pr-2 text-xs md:text-sm text-[#33241b] focus:outline-none border-r border-[#33241b]/10 cursor-pointer font-body"
            >
              <option value="">Semua Kategori</option>
              <option value="Bahan Pokok & Bumbu">Bahan Pokok & Bumbu</option>
              <option value="Gula-gulaan">Gula-gulaan</option>
              <option value="Kerupuk & Kletikan">Kerupuk & Kletikan</option>
              <option value="Minuman & Herbal">Minuman & Herbal</option>
              <option value="Kerajinan Rumah">Kerajinan Rumah</option>
            </select>
            <input 
              type="text" 
              name="q"
              placeholder="Cari produk dari tangan desa..." 
              className="w-full bg-transparent border-none px-4 py-2.5 text-sm text-[#33241b] placeholder:text-[#8f6b50]/60 focus:outline-none font-body"
            />
            <button
              type="submit"
              aria-label="Cari"
              className="px-5 text-[#8a5225] hover:text-[#33241b] hover:bg-[#ffdd7d]/20 transition-colors"
            >
              <Search size={19} />
            </button>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 md:gap-4 text-[#33241b]">
            {user?.role === 'admin' && (
              <div className="relative group cursor-pointer">
                <div className="flex items-center gap-2 hover:text-[#8a5225] transition bg-[#8a5225]/10 px-3 py-1.5 rounded-full border border-[#8a5225]/20">
                  <div className="w-5 h-5 rounded-full bg-[#8a5225] text-white flex items-center justify-center font-bold text-[10px]">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-[#8a5225]">Admin</span>
                </div>
                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-[#33241b]/10 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 p-2 z-50">
                  <Link href="/admin" className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs font-semibold text-[#8a5225] hover:bg-[#fffaf5] rounded-lg transition">
                    <LayoutDashboard size={14} /> Dasbor Admin
                  </Link>
                  <button onClick={() => logout()} className="block w-full text-left px-3 py-2 text-xs text-[#c82929] hover:bg-rose-50 rounded-lg transition">
                    Keluar Admin
                  </button>
                </div>
              </div>
            )}
            
            <button aria-label="Favorit" className="hover:text-[#8a5225] transition hidden sm:block relative p-1">
              <Heart size={22} />
              <span className="absolute -top-0.5 -right-0.5 bg-[#8a5225] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
            </button>

            <Link href="/cart" className="hover:text-[#8a5225] transition flex items-center gap-2 relative bg-white md:bg-transparent px-3 py-1.5 md:p-1 rounded-full border md:border-none border-[#33241b]/10">
              <div className="relative">
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#c82929] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden lg:block font-semibold text-sm text-[#33241b]">
                Rp {totalPrice.toLocaleString('id-ID')}
              </span>
            </Link>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="border-t border-[#33241b]/10 hidden md:block bg-[#fffaf5]">
          <div className="container mx-auto px-4">
            <ul className="flex items-center justify-center space-x-8 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#33241b]">
              <li><Link href="/" className="hover:text-[#8a5225] transition">Beranda</Link></li>
              <li><Link href="/shop" className="hover:text-[#8a5225] transition">Katalog</Link></li>
              <li><Link href="/#kategori" className="hover:text-[#8a5225] transition">Kategori</Link></li>
              <li><Link href="/about" className="hover:text-[#8a5225] transition">Tentang Kami</Link></li>
              <li><Link href="/blog" className="hover:text-[#8a5225] transition">Artikel</Link></li>
              <li><Link href="/#kontak" className="hover:text-[#8a5225] transition">Kontak</Link></li>
              <li>
                <Link href="/pesanan" className="text-[#8a5225] font-bold hover:text-[#733f1b] transition inline-flex items-center gap-1.5">
                  <Truck size={14} /> Lacak Pesanan
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
}
