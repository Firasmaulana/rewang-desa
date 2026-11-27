import { Target, Heart, Users, MapPin, Phone, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import ScrollReveal from '@/components/ScrollReveal';

function InstagramIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
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

export const metadata = {
  title: 'Tentang Kami - Cerita & Misi Gotong Royong',
  description:
    'Mengenal Rewang Desa: lahir dari keresahan, tumbuh menjadi jembatan gotong royong yang menghubungkan hasil bumi dan karya tangan petani serta UMKM desa dengan Sahabat Rewang.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    url: 'https://rewangdesa.com/about',
    title: 'Tentang Kami | Rewang Desa',
    description:
      'Kisah awal, makna gotong royong "rewang", visi, dan misi Rewang Desa dalam memberdayakan petani dan pengrajin desa Indonesia.',
  },
};

export default function AboutPage() {
  return (
    <div className="bg-[#fffaf5] min-h-screen">
      {/* Hero Section */}
      <section className="hero-parallax-wrapper relative py-24 md:py-32 bg-[#241811] text-[#fffaf5] overflow-hidden">
        {/* Background Image */}
        <img
          src="/hero-background.webp"
          alt="Suasana gerai Rewang Desa dengan aneka produk hasil bumi dan kerajinan desa"
          width={1920}
          height={1071}
          fetchPriority="high"
          className="hero-parallax-bg absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Warm Dark Overlay for Centered Text Readability */}
        <div className="absolute inset-0 bg-[#1f140e]/70 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1f140e]/50 via-transparent to-[#1f140e]/75 pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <span className="hero-stagger-1 inline-block bg-[#fffaf5]/15 backdrop-blur-md border border-[#ffdd7d]/30 text-[#ffdd7d] text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5 font-body">
            Cerita Di Balik Layar
          </span>
          <h1 className="hero-stagger-2 text-4xl md:text-5xl lg:text-6xl font-heading text-white mb-6 drop-shadow-sm">
            Tentang <span className="text-[#ffdd7d]">Rewang Desa</span>
          </h1>
          <p className="hero-stagger-3 text-stone-100 text-base md:text-lg leading-relaxed font-body drop-shadow-xs">
            Lahir dari keresahan, tumbuh menjadi jembatan gotong royong yang membawa karya dan hasil bumi dari tangan desa langsung kepada Anda.
          </p>
        </div>
      </section>

      {/* Main Philosophy & Story (from Catalog Page 2) */}
      <section className="py-20 overflow-x-clip">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            
            {/* Visual Box */}
            <ScrollReveal variant="left" className="lg:w-1/2 w-full">
              <div className="relative rounded-3xl bg-gradient-to-br from-[#f7f1ea] via-white to-[#fffaf5] p-8 border border-[#8a5225]/20 shadow-xl text-center hover:-translate-y-1 transition-transform duration-300">
                <div className="w-20 h-20 rounded-full bg-[#8a5225]/10 text-[#8a5225] flex items-center justify-center mx-auto mb-6">
                  <Users size={36} />
                </div>
                <Logo size="lg" showTagline={true} />
                <div className="my-6 border-y border-[#33241b]/10 py-4">
                  <p className="text-xs uppercase tracking-widest text-[#854523] font-bold font-body">
                    Makna &ldquo;Rewang&rdquo;
                  </p>
                  <p className="font-heading text-xl text-[#33241b] mt-1 italic">
                    Tumbuh dan bergerak bersama
                  </p>
                </div>
                <p className="text-xs text-stone-500 font-body leading-relaxed">
                  Bagi kami, memajukan desa dimulai dari saling membantu. Sebuah ikatan tulus masyarakat nusantara untuk saling menyokong kehidupan.
                </p>
              </div>
            </ScrollReveal>

            {/* Narrative Story */}
            <ScrollReveal variant="right" delayMs={100} className="lg:w-1/2 space-y-6">
              <span className="text-[#854523] text-xs font-bold uppercase tracking-widest block font-body">
                Awal Mula Perjalanan
              </span>
              <h2 className="text-3xl md:text-4xl font-heading text-[#33241b] leading-snug">
                Dari Tangan Petani, Untuk Sahabat Rewang
              </h2>
              
              <div className="space-y-4 text-stone-700 text-base leading-relaxed font-body">
                <p>
                  Rewang Desa lahir dari keresahan melihat potensi desa yang begitu melimpah, tetapi perputaran ekonominya masih berjalan lambat. Banyak hasil karya dari tangan petani dan pengrajin di desa yang berpotensi dan sangat berkualitas, namun belum memiliki akses pasar luas untuk berkembang.
                </p>
                <p>
                  Oleh karena itu, <strong>Rewang Desa</strong> hadir sebagai jembatan untuk menghubungkan hasil bumi, produk lokal, dan kisah perjuangan dari desa dengan <strong>Sahabat Rewang</strong> yang ingin mendukung produk dari tangan desa secara nyata.
                </p>
                <p className="bg-[#f7f1ea] p-4 rounded-xl border-l-4 border-[#8a5225] text-sm text-[#33241b]">
                  &ldquo;Bagi kami, memajukan desa dimulai dari saling membantu — sesuai makna &lsquo;<strong>rewang</strong>&rsquo; itu sendiri: tumbuh dan bergerak bersama.&rdquo;
                </p>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="py-20 bg-white border-y border-[#33241b]/10 overflow-x-clip">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Visi */}
            <ScrollReveal variant="left" delayMs={0} className="h-full">
              <div className="h-full bg-[#fffaf5] p-8 rounded-3xl border border-[#33241b]/10 hover:border-[#8a5225]/35 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-[#8a5225]/10 text-[#8a5225] rounded-2xl flex items-center justify-center mb-6">
                  <Target size={26} />
                </div>
                <h3 className="text-2xl font-heading text-[#33241b] mb-4">Visi Kami</h3>
                <p className="text-stone-700 text-sm md:text-base leading-relaxed font-body">
                  Menjadi wadah utama penghubung kemandirian pangan dan kerajinan lokal desa, di mana setiap petani, perajin lansia, dan keluarga desa memperoleh apresiasi dan nilai ekonomi yang adil atas ketulusan karyanya.
                </p>
              </div>
            </ScrollReveal>

            {/* Misi */}
            <ScrollReveal variant="right" delayMs={100} className="h-full">
              <div className="h-full bg-[#fffaf5] p-8 rounded-3xl border border-[#33241b]/10 hover:border-[#8a5225]/35 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-[#8a5225]/10 text-[#8a5225] rounded-2xl flex items-center justify-center mb-6">
                  <Heart size={26} />
                </div>
                <h3 className="text-2xl font-heading text-[#33241b] mb-4">Misi Gotong Royong</h3>
                <ul className="space-y-3 text-stone-700 text-sm font-body">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-[#8a5225] shrink-0 mt-0.5" />
                    <span>Mengangkat produk warisan desa (seperti Garam Jono, Gula Singkong, Beras Jampang) ke panggung nasional.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-[#8a5225] shrink-0 mt-0.5" />
                    <span>Membuka akses pasar yang adil dan transparan bagi kelompok tani dan pengrajin sepuh.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-[#8a5225] shrink-0 mt-0.5" />
                    <span>Menyediakan pilihan pangan sehat alami dan bebas bahan kimia berbahaya bagi masyarakat perkotaan.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-[#8a5225] shrink-0 mt-0.5" />
                    <span>Membangun ekosistem langganan gotong royong melalui Paket Rewang Tani bulanan.</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* Contact & Location Block */}
      <section className="py-20 bg-[#fffaf5] overflow-x-clip">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <ScrollReveal variant="up">
            <span className="text-[#854523] text-xs font-bold uppercase tracking-widest mb-2 block font-body">
              Kunjungi &amp; Sapa Kami
            </span>
            <h2 className="text-3xl md:text-4xl font-heading text-[#33241b] mb-3">
              Hubungi Rewang Desa
            </h2>
            <div aria-hidden="true" className="scroll-line-expand w-20 h-1 rounded-full bg-gradient-to-r from-[#8a5225] via-[#ffdd7d] to-[#5a8514] mx-auto mb-10" />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <ScrollReveal variant="zoom" staggerIndex={0} delayMs={0}>
              <div className="h-full bg-white p-6 rounded-2xl border border-[#33241b]/10 hover:border-[#8a5225]/35 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#8a5225]/10 text-[#8a5225] flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base text-[#33241b] mb-1">Lokasi</h4>
                  <p className="text-xs text-stone-600 font-body">Pondok Kelapa, Jakarta Timur</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="zoom" staggerIndex={1} delayMs={90}>
              <div className="h-full bg-white p-6 rounded-2xl border border-[#33241b]/10 hover:border-[#8a5225]/35 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#8a5225]/10 text-[#8a5225] flex items-center justify-center shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base text-[#33241b] mb-1">WhatsApp</h4>
                  <a href="https://wa.me/6281317533522" className="text-xs text-[#8a5225] font-semibold hover:underline font-body">
                    0813-1753-3522
                  </a>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="zoom" staggerIndex={2} delayMs={180}>
              <div className="h-full bg-white p-6 rounded-2xl border border-[#33241b]/10 hover:border-[#8a5225]/35 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#8a5225]/10 text-[#8a5225] flex items-center justify-center shrink-0">
                  <InstagramIcon size={20} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base text-[#33241b] mb-1">Instagram</h4>
                  <p className="text-xs text-stone-600 font-body">@rewangdesa &amp; @rewang_desa</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal variant="up" className="mt-12">
            <Link 
              href="/shop" 
              className="inline-block bg-[#8a5225] text-[#fffaf5] px-8 py-3.5 rounded-full font-semibold hover:bg-[#733f1b] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 shadow-lg shadow-[#8a5225]/25 text-sm md:text-base font-body"
            >
              Mulai Belanja Produk Desa
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
