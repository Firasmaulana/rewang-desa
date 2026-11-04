import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="kontak" className="bg-stone-900 text-stone-300 pt-20 pb-10 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="lg:pr-8">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <span className="text-3xl font-extrabold text-white tracking-tight">Rewang<span className="text-lime-500">Desa</span></span>
            </Link>
            <p className="text-stone-400 mb-6">Membawa kekayaan hasil bumi nusantara dari UMKM pedesaan langsung ke meja Anda. Sehat, alami, berkualitas.</p>
            <div className="flex gap-4">
              {/* Social Placeholders */}
              {[1, 2, 3, 4].map(i => (
                <a key={i} href="#" className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center hover:bg-amber-700 hover:text-white transition">
                  <span className="text-xs">S{i}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Tautan Cepat</h4>
            <ul className="space-y-3">
              <li><Link href="/#tentang" className="hover:text-amber-500 transition">Tentang Kami</Link></li>
              <li><Link href="/shop" className="hover:text-amber-500 transition">Belanja</Link></li>
              <li><Link href="/#kategori" className="hover:text-amber-500 transition">Kategori Produk</Link></li>
              <li><Link href="#" className="hover:text-amber-500 transition">Blog & Berita</Link></li>
              <li><Link href="/#kontak" className="hover:text-amber-500 transition">Kontak</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Layanan Pelanggan</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="hover:text-amber-500 transition">Cara Pemesanan</Link></li>
              <li><Link href="#" className="hover:text-amber-500 transition">Kebijakan Pengiriman</Link></li>
              <li><Link href="#" className="hover:text-amber-500 transition">Pengembalian Dana</Link></li>
              <li><Link href="#" className="hover:text-amber-500 transition">FAQ</Link></li>
              <li><Link href="#" className="hover:text-amber-500 transition">Syarat & Ketentuan</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Berlangganan Newsletter</h4>
            <p className="text-stone-400 mb-4">Dapatkan info promo terbaru dan produk baru dari Rewang Desa.</p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Alamat Email Anda" 
                className="bg-stone-800 border border-stone-700 px-4 py-3 rounded-lg text-white focus:outline-none focus:border-amber-600 transition"
              />
              <button type="button" className="bg-amber-700 text-white font-bold px-4 py-3 rounded-lg hover:bg-amber-800 transition">
                Berlangganan
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-stone-500">
          <p>&copy; 2026 Rewang Desa. Hak Cipta Dilindungi.</p>
          <div className="mt-4 md:mt-0 flex gap-4">
            <span className="hover:text-stone-300 cursor-pointer">Kebijakan Privasi</span>
            <span className="hover:text-stone-300 cursor-pointer">Syarat & Ketentuan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

