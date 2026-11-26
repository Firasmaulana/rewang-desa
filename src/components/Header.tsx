"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, Heart, Menu, Leaf, LayoutDashboard, Truck, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { logout } from '@/actions/auth';
import Logo from '@/components/Logo';

const NAV_ITEMS = [
  { href: '/', label: 'Beranda', exact: true },
  { href: '/shop', label: 'Katalog' },
  { href: '/#kategori', label: 'Kategori' },
  { href: '/about', label: 'Tentang Kami' },
  { href: '/blog', label: 'Artikel' },
  { href: '/#kontak', label: 'Kontak' },
];

export default function Header({ user }: { user?: { name: string; role: string } | null }) {
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartPop, setCartPop] = useState(false);
  const prevItemsRef = useRef(totalItems);

  // Track scroll position for subtle sticky header elevation
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Trigger joyful spring pop when item is added to cart
  useEffect(() => {
    if (totalItems > prevItemsRef.current) {
      setCartPop(true);
      const timer = setTimeout(() => setCartPop(false), 480);
      prevItemsRef.current = totalItems;
      return () => clearTimeout(timer);
    }
    prevItemsRef.current = totalItems;
  }, [totalItems]);

  // Close mobile drawer on route change or Escape key
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const isNavActive = (href: string, exact?: boolean) => {
    if (href.startsWith('/#')) return false;
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#33241b] text-[#fffaf5] text-xs md:text-sm py-2 px-4 text-center font-body border-b border-[#8a5225]/20">
        <div className="container mx-auto flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5">
            <Leaf size={14} className="text-[#ffdd7d]" /> Bantu Desa Tanpa Harus Pergi ke Desa
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">Gunakan kode <strong className="text-[#ffdd7d] tracking-wide font-bold">REWANG20</strong> untuk diskon 20% belanja perdana</span>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          isScrolled
            ? 'bg-[#fffaf5]/95 backdrop-blur-lg shadow-md shadow-[#33241b]/8 border-[#8a5225]/15'
            : 'bg-[#fffaf5]/90 backdrop-blur-md shadow-sm border-[#33241b]/10'
        }`}
      >
        <div
          className={`container mx-auto px-4 flex items-center justify-between gap-4 transition-all duration-300 ${
            isScrolled ? 'py-2.5 md:py-3' : 'py-3 md:py-4'
          }`}
        >
          
          {/* Mobile Menu & Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Buka menu navigasi"
              aria-expanded={mobileOpen}
              className="md:hidden text-[#33241b] hover:text-[#8a5225] hover:bg-[#8a5225]/10 rounded-xl transition p-1.5 cursor-pointer active:scale-90"
            >
              <Menu size={24} />
            </button>
            <Logo size="md" />
          </div>

          {/* Search Bar (Desktop) */}
          <form 
            action="/shop" 
            method="GET"
            className="hidden md:flex flex-1 max-w-xl mx-6 bg-white rounded-full border border-[#33241b]/15 overflow-hidden focus-within:ring-2 focus-within:ring-[#8a5225] focus-within:border-[#8a5225] focus-within:shadow-md transition-all shadow-sm"
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
              className="px-5 text-[#8a5225] hover:text-[#33241b] hover:bg-[#ffdd7d]/25 transition-colors cursor-pointer active:scale-95"
            >
              <Search size={19} />
            </button>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 md:gap-4 text-[#33241b]">
            {user?.role === 'admin' && (
              <div className="relative group cursor-pointer">
                <div className="flex items-center gap-2 hover:text-[#8a5225] transition bg-[#8a5225]/10 px-3 py-1.5 rounded-full border border-[#8a5225]/20 active:scale-95">
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
                  <button onClick={() => logout()} className="block w-full text-left px-3 py-2 text-xs text-[#c82929] hover:bg-rose-50 rounded-lg transition cursor-pointer">
                    Keluar Admin
                  </button>
                </div>
              </div>
            )}
            
            <button aria-label="Favorit" className="hover:text-[#8a5225] transition hidden sm:block relative p-1 cursor-pointer active:scale-90">
              <Heart size={22} />
              <span className="absolute -top-0.5 -right-0.5 bg-[#8a5225] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
            </button>

            <Link
              href="/cart"
              className={`hover:text-[#8a5225] transition-all flex items-center gap-2 relative bg-white md:bg-transparent px-3 py-1.5 md:p-1 rounded-full border md:border-none border-[#33241b]/10 active:scale-95 ${
                cartPop ? 'animate-cart-pop' : ''
              }`}
            >
              <div className="relative">
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#c82929] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
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

        {/* Navigation Bar (Desktop) */}
        <nav className="border-t border-[#33241b]/10 hidden md:block bg-[#fffaf5]/80">
          <div className="container mx-auto px-4">
            <ul className="flex items-center justify-center space-x-8 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#33241b]">
              {NAV_ITEMS.map((item) => {
                const active = isNavActive(item.href, item.exact);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`relative py-1 inline-block transition-colors duration-200 active:scale-95 after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-[2px] after:rounded-full after:bg-[#8a5225] after:origin-center after:transition-transform after:duration-300 ${
                        active
                          ? 'text-[#8a5225] font-bold after:scale-x-100'
                          : 'hover:text-[#8a5225] after:scale-x-0 hover:after:scale-x-100'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  href="/pesanan"
                  className={`relative py-1 inline-flex items-center gap-1.5 font-bold transition-all duration-200 active:scale-95 after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-[2px] after:rounded-full after:bg-[#5a8514] after:origin-center after:transition-transform after:duration-300 ${
                    isNavActive('/pesanan')
                      ? 'text-[#5a8514] after:scale-x-100'
                      : 'text-[#8a5225] hover:text-[#733f1b] after:scale-x-0 hover:after:scale-x-100'
                  }`}
                >
                  <Truck size={14} /> Lacak Pesanan
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Interactive Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] md:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-[#33241b]/55 backdrop-blur-xs transition-opacity"
          />

          {/* Slide-in Drawer Panel */}
          <div className="animate-drawer-in relative w-[min(82vw,20rem)] max-w-full bg-[#fffaf5] h-full shadow-2xl border-r border-[#8a5225]/20 flex flex-col z-10">
            <div className="p-5 border-b border-[#33241b]/10 flex items-center justify-between">
              <Logo size="sm" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Tutup menu navigasi"
                className="w-9 h-9 rounded-full bg-white border border-[#33241b]/10 text-[#33241b] hover:bg-[#8a5225]/10 hover:text-[#8a5225] flex items-center justify-center transition cursor-pointer active:scale-90"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mobile Search */}
            <form action="/shop" method="GET" className="p-4 border-b border-[#33241b]/10">
              <div className="flex bg-white rounded-full border border-[#33241b]/15 overflow-hidden focus-within:ring-2 focus-within:ring-[#8a5225]">
                <input
                  type="text"
                  name="q"
                  placeholder="Cari produk desa..."
                  className="flex-1 bg-transparent px-4 py-2 text-xs text-[#33241b] focus:outline-none"
                />
                <button type="submit" aria-label="Cari" className="px-3.5 text-[#8a5225]">
                  <Search size={16} />
                </button>
              </div>
            </form>

            {/* Mobile Links */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
              {NAV_ITEMS.map((item) => {
                const active = isNavActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all active:scale-98 ${
                      active
                        ? 'bg-[#8a5225] text-white shadow-sm'
                        : 'text-[#33241b] hover:bg-[#8a5225]/10 hover:text-[#8a5225]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="pt-3 mt-3 border-t border-[#33241b]/10">
                <Link
                  href="/pesanan"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-[#5a8514] bg-[#5a8514]/10 hover:bg-[#5a8514]/20 transition"
                >
                  <Truck size={16} /> Lacak Pesanan Saya
                </Link>
              </div>
            </nav>

            <div className="p-4 border-t border-[#33241b]/10 text-[11px] text-stone-500 text-center">
              Bantu Desa Tanpa Harus Pergi ke Desa
            </div>
          </div>
        </div>
      )}
    </>
  );
}
