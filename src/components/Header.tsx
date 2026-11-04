"use client";

import { Search, ShoppingCart, User, Heart, Menu } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { logout } from '@/actions/auth';

export default function Header({ user }: { user?: { name: string; role: string } | null }) {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  return (
    <>
      {/* Top Banner */}
      <div className="bg-amber-900 text-white text-sm py-2 px-4 text-center hidden md:block">
        <p>🎉 Dapatkan diskon 20% untuk pembelian pertama Anda dengan kode: <span className="font-bold text-yellow-300">REWANG20</span></p>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-amber-900/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          
          {/* Mobile Menu & Logo */}
          <div className="flex items-center gap-4">
            <button className="md:hidden text-stone-600 hover:text-amber-800 transition">
              <Menu size={24} />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-amber-900 tracking-tight">Rewang<span className="text-lime-700">Desa</span></span>
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8 bg-stone-100 rounded-full border border-stone-200 overflow-hidden focus-within:ring-2 focus-within:ring-amber-500 transition-all">
            <select className="bg-transparent border-none py-2 pl-4 pr-2 text-sm text-stone-600 focus:outline-none border-r border-stone-300 cursor-pointer">
              <option>Semua Kategori</option>
              <option>Gula</option>
              <option>Beras</option>
              <option>Rempah</option>
            </select>
            <input 
              type="text" 
              placeholder="Cari produk UMKM..." 
              className="w-full bg-transparent border-none px-4 py-2 text-sm focus:outline-none"
            />
            <button className="px-4 text-amber-800 hover:text-amber-900 transition-colors">
              <Search size={20} />
            </button>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4 text-stone-600">
            {user ? (
              <div className="relative group cursor-pointer">
                <div className="flex items-center gap-2 hover:text-amber-800 transition">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden sm:block text-sm font-bold text-stone-700">Halo, {user.name.split(' ')[0]}</span>
                </div>
                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-stone-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
                  <div className="p-2 space-y-1">
                    {user.role === 'admin' && (
                      <Link href="/admin" className="block w-full text-left px-4 py-2 text-sm font-bold text-lime-700 hover:bg-lime-50 rounded-lg transition">
                        🛠️ Dasbor Admin
                      </Link>
                    )}
                    <button onClick={() => logout()} className="block w-full text-left px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 rounded-lg transition">
                      Keluar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login" className="hover:text-amber-800 transition flex items-center gap-2">
                <User size={24} />
              </Link>
            )}
            
            <button className="hover:text-amber-800 transition hidden sm:block relative ml-2">
              <Heart size={24} />
              <span className="absolute -top-1 -right-1 bg-lime-600 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
            </button>
            <Link href="/cart" className="hover:text-amber-800 transition flex items-center gap-2 relative">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -left-2 bg-amber-700 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
              <span className="hidden lg:block font-semibold text-amber-900">
                Rp {totalPrice.toLocaleString('id-ID')}
              </span>
            </Link>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="border-t border-stone-100 hidden md:block">
          <div className="container mx-auto px-4">
            <ul className="flex items-center justify-center space-x-8 py-3 text-sm font-semibold text-stone-600 uppercase tracking-wide">
              <li><Link href="/" className="hover:text-amber-800 transition">Beranda</Link></li>
              <li><Link href="/shop" className="hover:text-amber-800 transition">Katalog</Link></li>
              <li><Link href="/#kategori" className="hover:text-amber-800 transition">Kategori</Link></li>
              <li><Link href="/about" className="hover:text-amber-800 transition">Tentang Kami</Link></li>
              <li><Link href="/blog" className="hover:text-amber-800 transition">Artikel</Link></li>
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
}

