import { Target, Users, Heart, Leaf } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Tentang Kami - Rewang Desa',
  description: 'Profil, Visi, dan Misi platform UMKM Rewang Desa.',
};

export default function AboutPage() {
  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-amber-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Mengenal <span className="text-yellow-400">Rewang Desa</span>
          </h1>
          <p className="text-amber-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Lebih dari sekadar platform, kami adalah jembatan yang menghubungkan kearifan lokal UMKM desa dengan peluang tanpa batas.
          </p>
        </div>
      </section>

      {/* Visi Misi Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="w-full aspect-square md:aspect-video lg:aspect-square bg-stone-200 rounded-3xl overflow-hidden shadow-2xl">
                  {/* Placeholder Image */}
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200 text-amber-900">
                    <Users size={80} className="mb-4 opacity-50" />
                    <span className="font-bold text-xl opacity-70">Foto Gotong Royong Desa</span>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-stone-100 hidden md:block">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-lime-100 text-lime-700 rounded-full flex items-center justify-center">
                      <Leaf size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-800">100% Organik</h4>
                      <p className="text-sm text-stone-500">Hasil bumi pilihan</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 space-y-10">
              <div>
                <h2 className="text-3xl font-extrabold text-stone-900 mb-6 flex items-center gap-3">
                  <Target className="text-amber-600" size={32} /> Visi Kami
                </h2>
                <p className="text-stone-600 leading-relaxed text-lg">
                  Menjadi pendorong utama transformasi digital bagi para petani dan pengrajin desa, mewujudkan UMKM yang mandiri, berdaya saing global, namun tetap berpijak pada pelestarian alam dan budaya luhur Nusantara.
                </p>
              </div>
              
              <div>
                <h2 className="text-3xl font-extrabold text-stone-900 mb-6 flex items-center gap-3">
                  <Heart className="text-lime-600" size={32} /> Misi Kami
                </h2>
                <ul className="space-y-4">
                  {[
                    "Menyediakan platform e-commerce yang mudah diakses oleh pelaku UMKM desa.",
                    "Mendampingi proses kurasi untuk memastikan kualitas produk tetap otentik dan premium.",
                    "Menerapkan sistem bagi hasil yang adil demi kesejahteraan masyarakat desa.",
                    "Mempromosikan sistem pertanian organik yang ramah lingkungan."
                  ].map((misi, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-lime-100 text-lime-700 flex items-center justify-center shrink-0 font-bold">
                        {i + 1}
                      </div>
                      <p className="text-stone-600 pt-1 leading-relaxed">{misi}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-stone-100 border-t border-stone-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-stone-900 mb-6">Mari Berkembang Bersama</h2>
          <p className="text-stone-500 max-w-xl mx-auto mb-8">
            Setiap produk yang Anda beli adalah bentuk nyata dukungan terhadap kemandirian ekonomi desa.
          </p>
          <Link href="/shop" className="inline-block bg-amber-800 text-white font-bold py-4 px-8 rounded-full hover:bg-amber-900 transition shadow-lg shadow-amber-900/20">
            Mulai Belanja Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}

