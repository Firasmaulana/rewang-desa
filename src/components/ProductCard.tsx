"use client";

import { Heart, Search, ShoppingCart, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';
import ProductImage from './ProductImage';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="bg-white rounded-2xl border border-[#33241b]/10 overflow-hidden hover:shadow-xl hover:shadow-[#8a5225]/10 hover:border-[#8a5225]/40 transition-all duration-300 group flex flex-col h-full">
      {/* Product Image / Visual */}
      <div className="relative aspect-[4/3] bg-[#fffaf5] flex items-center justify-center border-b border-[#33241b]/5 overflow-hidden">
        {product.badge && (
          <span className="absolute top-3 left-3 bg-[#c82929] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10 tracking-wider">
            {product.badge}
          </span>
        )}
        {!product.badge && product.isDiscounted && (
          <span className="absolute top-3 left-3 bg-[#8a5225] text-[#fffaf5] text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10 tracking-wider">
            HEMAT
          </span>
        )}
        
        <ProductImage src={product.image} alt={product.name} />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-[#33241b]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10 backdrop-blur-[2px]">
          <button 
            aria-label="Simpan ke favorit"
            className="bg-white text-[#33241b] p-2.5 rounded-full hover:bg-[#8a5225] hover:text-white transition shadow-md"
          >
            <Heart size={18} />
          </button>
          <Link 
            href={`/product/${product.id}`}
            aria-label="Lihat detail"
            className="bg-white text-[#33241b] p-2.5 rounded-full hover:bg-[#8a5225] hover:text-white transition shadow-md"
          >
            <Search size={18} />
          </Link>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category & Origin */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[#854523] text-[11px] font-bold uppercase tracking-wider block">
            {product.category}
          </span>
          {product.origin && (
            <span className="text-[10px] text-stone-600 flex items-center gap-0.5 truncate max-w-[130px]" title={product.origin}>
              <MapPin size={10} className="shrink-0 text-[#8a5225]" />
              <span className="truncate">{product.origin.split(',')[0]}</span>
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-heading font-medium text-[#33241b] text-base md:text-lg mb-2 hover:text-[#8a5225] transition line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-stone-100">
          <div>
            {product.originalPrice && (
              <span className="text-stone-600 text-xs line-through block font-body">
                Rp {product.originalPrice.toLocaleString('id-ID')}
              </span>
            )}
            <span className="text-[#33241b] font-bold text-base md:text-lg font-body">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
          </div>
          <button 
            onClick={() => addToCart(product, 1)}
            className="w-10 h-10 rounded-full bg-[#f7f1ea] hover:bg-[#8a5225] text-[#33241b] hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-105"
            title="Tambah ke Keranjang"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
