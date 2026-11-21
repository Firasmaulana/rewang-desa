import { getProductById } from '@/lib/supabase/service';
import { products as fallbackProducts } from '@/data/products';
import { Truck, ShieldCheck, Check, MapPin } from 'lucide-react';
import Link from 'next/link';
import AddToCartSection from '@/components/AddToCartSection';
import ProductImage from '@/components/ProductImage';

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fetchedProduct = await getProductById(id);
  const product = fetchedProduct || fallbackProducts[0];

  return (
    <div className="bg-[#fffaf5] py-12">
      <div className="container mx-auto px-4">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-stone-500 mb-8 font-body">
          <Link href="/" className="hover:text-[#8a5225] transition">Beranda</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#8a5225] transition">Katalog</Link>
          <span>/</span>
          <span className="text-[#33241b] font-medium">{product.category}</span>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-[#33241b]/10 mb-16">
          <div className="flex flex-col md:flex-row gap-12">
            
            {/* Product Image Box */}
            <div className="md:w-1/2">
              <div className="bg-[#fffaf5] rounded-3xl aspect-square flex items-center justify-center border border-[#33241b]/10 relative overflow-hidden group">
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-[#c82929] text-white text-xs font-bold px-3 py-1 rounded-lg z-10 tracking-wider">
                    {product.badge}
                  </span>
                )}
                {!product.badge && product.isDiscounted && (
                  <span className="absolute top-4 left-4 bg-[#8a5225] text-white text-xs font-bold px-3 py-1 rounded-lg z-10 tracking-wider">
                    HEMAT
                  </span>
                )}
                <ProductImage src={product.image} alt={product.name} />
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#854523] text-xs font-bold uppercase tracking-wider block font-body">
                  {product.category}
                </span>
                {product.origin && (
                  <span className="text-xs text-stone-500 flex items-center gap-1 font-body">
                    • <MapPin size={12} className="text-[#8a5225]" /> {product.origin}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading text-[#33241b] leading-tight mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-6 font-body">
                <span className="text-[#8a5225] text-xs font-semibold flex items-center gap-1.5 bg-[#8a5225]/10 px-3 py-1 rounded-full border border-[#8a5225]/20">
                  <Check size={14} /> Stok Terjamin ({product.stock} tersedia)
                </span>
              </div>

              <div className="mb-6 font-body">
                {product.originalPrice && (
                  <span className="text-stone-400 text-lg line-through mr-3">
                    Rp {product.originalPrice.toLocaleString('id-ID')}
                  </span>
                )}
                <span className="text-[#33241b] font-extrabold text-3xl md:text-4xl">
                  Rp {product.price.toLocaleString('id-ID')}
                </span>
              </div>

              <p className="text-stone-700 mb-8 leading-relaxed font-body text-sm md:text-base">
                {product.description}
              </p>

              {/* Action Buttons */}
              <AddToCartSection product={product} />

              {/* Additional Delivery / Trust Info */}
              <div className="space-y-3.5 text-xs md:text-sm text-stone-600 font-body pt-2 border-t border-stone-100">
                <div className="flex items-center gap-3">
                  <Truck className="text-[#8a5225]" size={18} />
                  <span>Pengiriman langsung dari gudang Rewang Desa di <span className="font-semibold text-[#33241b]">Pondok Kelapa, Jakarta Timur</span>.</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-[#8a5225]" size={18} />
                  <span>Garansi keaslian 100% dari tangan petani &amp; pengrajin desa.</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
