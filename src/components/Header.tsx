"use client";

import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { Search, ShoppingCart, Heart, Menu, Leaf, LayoutDashboard, Truck, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { logout } from '@/actions/auth';
import Logo from '@/components/Logo';

const NAV_ITEMS = [
  { href: '/', label: 'Beranda', exact: true },
  { href: '/shop', label: 'Katalog' },
  { href: '/about', label: 'Tentang Kami' },
  { href: '/blog', label: 'Artikel' },
  { href: '/#kontak', label: 'Kontak' },
];

export default function Header({ user }: { user?: { name: string; role: string } | null }) {
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  const [isScrolled, setIsScrolled] = useState(false);
  const [isTopHidden, setIsTopHidden] = useState(false);
  const [topRowHeight, setTopRowHeight] = useState(76);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartPop, setCartPop] = useState(false);

  const prevItemsRef = useRef(totalItems);
  const topRowRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const lastScrollYRef = useRef(0);
  const accumulatedDeltaRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // Measure the top row height accurately so the nav bar docks flush at top: 0
  useEffect(() => {
    const el = topRowRef.current;
    if (!el) return;

    const measure = () => {
      const h = Math.ceil(el.getBoundingClientRect().height);
      if (h > 0) setTopRowHeight(h);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Track scroll direction with hysteresis for smooth tuck-up / glide-down behavior
  useEffect(() => {
    lastScrollYRef.current = Math.max(0, window.scrollY);
    setIsScrolled(window.scrollY > 20);

    const handleScroll = () => {
      if (rafIdRef.current !== null) return;

      rafIdRef.current = window.requestAnimationFrame(() => {
        rafIdRef.current = null;
        const currentY = Math.max(0, window.scrollY);
        setIsScrolled(currentY > 20);

        if (mobileOpen || currentY < 90) {
          setIsTopHidden(false);
          accumulatedDeltaRef.current = 0;
          lastScrollYRef.current = currentY;
          return;
        }

        const delta = currentY - lastScrollYRef.current;
        if (Math.abs(delta) < 2) {
          return;
        }

        // Reset directional accumulator whenever user reverses scroll direction
        if (delta * accumulatedDeltaRef.current < 0) {
          accumulatedDeltaRef.current = 0;
        }
        accumulatedDeltaRef.current += delta;

        const isSearchFocused =
          document.activeElement !== null &&
          topRowRef.current?.contains(document.activeElement);

        if (accumulatedDeltaRef.current > 18 && currentY > 120 && !isSearchFocused) {
          setIsTopHidden(true);
          accumulatedDeltaRef.current = 0;
        } else if (accumulatedDeltaRef.current < -10) {
          setIsTopHidden(false);
          accumulatedDeltaRef.current = 0;
        }

        lastScrollYRef.current = currentY;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [mobileOpen]);

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

  // Reset header state & close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setIsTopHidden(false);
    accumulatedDeltaRef.current = 0;
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

  const handleDockedSearchClick = () => {
    setIsTopHidden(false);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 180);
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
          <span className="hidden sm:inline">
            Gunakan kode <strong className="text-[#ffdd7d] tracking-wide font-bold">REWANG20</strong> untuk diskon 20% belanja perdana
          </span>
        </div>
      </div>

      {/* Main Sticky Header (Top row smoothly tucks upward on scroll down, Nav stays pinned) */}
      <header
        data-top-hidden={isTopHidden ? 'true' : 'false'}
        style={{ '--header-top-h': `${topRowHeight}px` } as CSSProperties}
        onFocusCapture={() => {
          if (isTopHidden) setIsTopHidden(false);
        }}
        className={`smart-header sticky top-0 z-50 border-b ${
          isTopHidden
            ? 'bg-[#fffaf5]/95 backdrop-blur-xl shadow-none md:shadow-lg md:shadow-[#33241b]/10 border-transparent md:border-[#8a5225]/20'
            : isScrolled
            ? 'bg-[#fffaf5]/95 backdrop-blur-lg shadow-md shadow-[#33241b]/8 border-[#8a5225]/15'
            : 'bg-[#fffaf5]/90 backdrop-blur-md shadow-sm border-[#33241b]/10'
        }`}
      >
        {/* Top Row: Logo, Search Bar, Right Actions */}
        <div ref={topRowRef} className="smart-header-top-inner">
          <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-4">
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
                aria-label="Pilih kategori produk"
                className="bg-transparent border-none py-2.5 pl-4 pr-2 text-xs md:text-sm text-[#33241b] focus:outline-none border-r border-[#33241b]/10 cursor-pointer font-body"
              >
                <option value="">Semua Kategori</option>
                <option value="Bahan Pokok & Bumbu">Bahan Pokok &amp; Bumbu</option>
                <option value="Gula-gulaan">Gula-gulaan</option>
                <option value="Kerupuk & Kletikan">Kerupuk &amp; Kletikan</option>
                <option value="Minuman & Herbal">Minuman &amp; Herbal</option>
                <option value="Kerajinan Rumah">Kerajinan Rumah</option>
              </select>
              <input
                ref={searchInputRef}
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
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs font-semibold text-[#8a5225] hover:bg-[#fffaf5] rounded-lg transition"
                    >
                      <LayoutDashboard size={14} /> Dasbor Admin
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="block w-full text-left px-3 py-2 text-xs text-[#c82929] hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    >
                      Keluar Admin
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                aria-label="Favorit"
                className="hover:text-[#8a5225] transition hidden sm:block relative p-1 cursor-pointer active:scale-90"
              >
                <Heart size={22} />
                <span className="absolute -top-0.5 -right-0.5 bg-[#8a5225] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  0
                </span>
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
        </div>

        {/* Navigation Bar (Desktop) — stays cleanly docked at top: 0 when top row tucks upward */}
        <nav
          className={`smart-nav-bar border-t hidden md:block ${
            isTopHidden
              ? 'bg-[#fffaf5]/95 border-t-transparent'
              : 'bg-[#fffaf5]/80 border-[#33241b]/10'
          }`}
        >
          <div className="container mx-auto px-4 relative flex items-center justify-center">
            {/* Compact Brand Badge (glides smoothly into view when top row is tucked) */}
            <Link
              href="/"
              tabIndex={isTopHidden ? 0 : -1}
              aria-hidden={!isTopHidden}
              onClick={() => {
                if (pathname === '/') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="smart-nav-dock-left hidden lg:inline-flex items-center gap-1.5 absolute left-4 text-[#8a5225] hover:text-[#33241b] transition-colors"
            >
              <Leaf size={15} className="text-[#5a8514]" />
              <span className="font-heading font-bold text-sm tracking-tight text-[#33241b]">
                Rewang Desa
              </span>
            </Link>

            <ul className="flex items-center justify-center space-x-6 lg:space-x-8 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#33241b]">
              {NAV_ITEMS.map((item) => {
                const active = isNavActive(item.href, item.exact);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        if (!item.href.includes('#') && pathname === item.href) {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
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

            {/* Compact Quick Search & Cart (glides smoothly into view when top row is tucked) */}
            <div
              aria-hidden={!isTopHidden}
              className="smart-nav-dock-right hidden lg:flex items-center gap-2.5 absolute right-4"
            >
              <button
                type="button"
                tabIndex={isTopHidden ? 0 : -1}
                onClick={handleDockedSearchClick}
                aria-label="Tampilkan kolom pencarian"
                title="Cari produk"
                className="w-8 h-8 rounded-full bg-white/90 border border-[#33241b]/12 text-[#8a5225] hover:bg-[#8a5225] hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-90 shadow-xs"
              >
                <Search size={14} />
              </button>
              <Link
                href="/cart"
                tabIndex={isTopHidden ? 0 : -1}
                aria-label="Keranjang belanja"
                className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#8a5225]/10 hover:bg-[#8a5225] text-[#8a5225] hover:text-white text-xs font-bold transition-colors active:scale-95 ${
                  cartPop ? 'animate-cart-pop' : ''
                }`}
              >
                <ShoppingCart size={14} />
                <span>{totalItems}</span>
              </Link>
            </div>
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
              <div className="flex items-center w-full bg-white rounded-full border border-[#33241b]/15 overflow-hidden focus-within:ring-2 focus-within:ring-[#8a5225]">
                <input
                  type="text"
                  name="q"
                  placeholder="Cari produk desa..."
                  className="flex-1 min-w-0 w-full bg-transparent pl-4 pr-2 py-2.5 text-xs text-[#33241b] focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Cari"
                  className="shrink-0 flex items-center justify-center px-3.5 py-2.5 text-[#8a5225] hover:text-[#33241b] transition cursor-pointer"
                >
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
                    onClick={() => {
                      setMobileOpen(false);
                      if (!item.href.includes('#') && pathname === item.href) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
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
