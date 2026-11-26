import Link from 'next/link';
import Logo from '@/components/Logo';
import { MapPin, Phone, Mail } from 'lucide-react';

function InstagramIcon({ size = 17, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer id="kontak" className="bg-[#33241b] text-[#f7f1ea] pt-16 pb-10 mt-auto border-t border-[#8a5225]/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="lg:pr-6 flex flex-col items-start">
            <div className="mb-5">
              <Logo variant="light" size="lg" showTagline={true} />
            </div>
            <p className="text-stone-300 text-sm leading-relaxed mb-6 font-body">
              Menghubungkan hasil bumi, produk lokal, dan cerita dari desa dengan Sahabat Rewang yang ingin mendukung produk dari tangan desa secara nyata.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/rewangdesa"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-[#8a5225]/40 hover:bg-[#8a5225] text-white rounded-full flex items-center justify-center transition border border-[#8a5225]/50"
                title="Instagram @rewangdesa"
              >
                <InstagramIcon size={17} />
              </a>
              <a
                href="https://wa.me/6281317533522"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-[#8a5225]/40 hover:bg-[#8a5225] text-white rounded-full flex items-center justify-center transition border border-[#8a5225]/50"
                title="WhatsApp 0813-1753-3522"
              >
                <Phone size={17} />
              </a>
              <a
                href="mailto:halo@rewangdesa.com"
                className="w-9 h-9 bg-[#8a5225]/40 hover:bg-[#8a5225] text-white rounded-full flex items-center justify-center transition border border-[#8a5225]/50"
                title="Email Kami"
              >
                <Mail size={17} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#ffdd7d] font-heading text-lg mb-5 tracking-wide">Tautan Cepat</h4>
            <ul className="space-y-2.5 text-sm font-body text-stone-300">
              <li><Link href="/" className="hover:text-[#ffdd7d] transition">Beranda</Link></li>
              <li><Link href="/about" className="hover:text-[#ffdd7d] transition">Tentang Kami</Link></li>
              <li><Link href="/shop" className="hover:text-[#ffdd7d] transition">Katalog Produk</Link></li>
              <li><Link href="/blog" className="hover:text-[#ffdd7d] transition">Artikel & Cerita Desa</Link></li>
            </ul>
          </div>

          {/* Contact / Lokasi */}
          <div>
            <h4 className="text-[#ffdd7d] font-heading text-lg mb-5 tracking-wide">Hubungi Kami</h4>
            <ul className="space-y-3.5 text-sm font-body text-stone-300">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#ffdd7d] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Lokasi</p>
                  <p className="text-stone-300">Pondok Kelapa, Jakarta Timur</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-[#ffdd7d] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">WhatsApp</p>
                  <a href="https://wa.me/6281317533522" className="hover:text-[#ffdd7d] transition">
                    0813-1753-3522
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <InstagramIcon size={18} className="text-[#ffdd7d] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Instagram</p>
                  <p className="text-stone-300">@rewangdesa &amp; @rewang_desa</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter / Dukungan */}
          <div>
            <h4 className="text-[#ffdd7d] font-heading text-lg mb-5 tracking-wide">Dukung Petani Desa</h4>
            <p className="text-stone-300 text-sm mb-4 font-body leading-relaxed">
              Daftarkan email Anda untuk kabar panen raya, cerita inspiratif dari desa, dan penawaran katalog eksklusif.
            </p>
            <form className="flex flex-col gap-2.5">
              <input 
                type="email" 
                placeholder="Alamat Email Anda" 
                className="bg-[#241913] border border-[#8a5225]/40 px-3.5 py-2.5 rounded-lg text-white text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#ffdd7d] transition font-body"
              />
              <button 
                type="button" 
                className="bg-[#8a5225] hover:bg-[#a6622b] text-[#fffaf5] font-semibold text-sm px-4 py-2.5 rounded-lg transition duration-200 shadow-md font-body"
              >
                Langganan Kabar Desa
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#8a5225]/25 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-400 font-body gap-4">
          <p className="flex items-center gap-1.5">
            &copy; 2026 Rewang Desa. Tumbuh & Bergerak Bersama Tangan Desa.
          </p>
          <div className="flex gap-5">
            <span className="hover:text-[#ffdd7d] cursor-pointer transition">Kebijakan Privasi</span>
            <span className="hover:text-[#ffdd7d] cursor-pointer transition">Syarat &amp; Ketentuan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
