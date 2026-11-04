import { products } from '@/data/products';
import { Star, Truck, ShieldCheck, Check } from 'lucide-react';
import Link from 'next/link';
import AddToCartSection from '@/components/AddToCartSection';

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find(p => p.id === id) || products[0]; // fallback to first for demo

  return (
    <div className="bg-[#FDFBF7] py-12">
      <div className="container mx-auto px-4">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-stone-500 mb-8">
          <Link href="/" className="hover:text-amber-800 transition">Beranda</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-amber-800 transition">Katalog</Link>
          <span>/</span>
          <span className="text-stone-800 font-medium">{product.category}</span>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-amber-900/10 mb-16">
          <div className="flex flex-col md:flex-row gap-12">
            
            {/* Product Image */}
            <div className="md:w-1/2">
              <div className="bg-stone-50 rounded-2xl aspect-square flex items-center justify-center border border-stone-100 relative overflow-hidden group">
                {product.isDiscounted && (
                  <span className="absolute top-4 left-4 bg-lime-600 text-white font-bold px-3 py-1 rounded-lg z-10">
                    Diskon
                  </span>
                )}
                <span className="text-stone-400 font-medium">{product.image}</span>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`bg-stone-50 rounded-xl aspect-square flex items-center justify-center border ${i === 1 ? 'border-amber-500' : 'border-stone-100'} cursor-pointer hover:border-amber-400 transition`}>
                    <span className="text-stone-300 text-xs text-center px-1">Img {i}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 flex flex-col justify-center">
              <span className="text-lime-700 font-bold uppercase tracking-wider mb-2">{product.category}</span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-stone-900 leading-tight mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" className={i < Math.floor(product.rating) ? 'text-amber-500' : 'text-amber-200'} />
                  ))}
                </div>
                <span className="text-stone-500 text-sm">{product.rating} (120 Ulasan)</span>
                <span className="text-stone-300">|</span>
                <span className="text-lime-600 text-sm font-medium flex items-center gap-1"><Check size={16}/> Stok Tersedia</span>
              </div>

              <div className="mb-6">
                {product.originalPrice && (
                  <span className="text-stone-400 text-lg line-through mr-3">
                    Rp {product.originalPrice.toLocaleString('id-ID')}
                  </span>
                )}
                <span className="text-amber-900 font-extrabold text-4xl">
                  Rp {product.price.toLocaleString('id-ID')}
                </span>
              </div>

              <p className="text-stone-600 mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Action Buttons extracted to Client Component */}
              <AddToCartSection product={product} />

              {/* Additional Info */}
              <div className="space-y-4 text-sm text-stone-600">
                <div className="flex items-center gap-3">
                  <Truck className="text-amber-700" size={20} />
                  <span>Pengiriman dari <span className="font-semibold">Kab. Banyumas</span>, Jawa Tengah.</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-amber-700" size={20} />
                  <span>Jaminan uang kembali jika barang rusak atau tidak sesuai.</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

