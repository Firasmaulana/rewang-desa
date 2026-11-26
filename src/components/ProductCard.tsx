"use client";

import { useState } from 'react';
import { Heart, Search, ShoppingCart, MapPin, Check } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';
import ProductImage from './ProductImage';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [justAdded, setJustAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1100);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#33241b]/10 overflow-hidden hover:shadow-xl hover:shadow-[#8a5225]/12 hover:border-[#8a5225]/40 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col h-full">
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
        
        <div className="w-full h-full group-hover:scale-105 transition-transform duration-500">
          <ProductImage src={product.image} alt={product.name} />
        </div>
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-[#33241b]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2.5 z-10 backdrop-blur-[2px]">
          <button 
            type="button"
            onClick={() => setIsFavorite((prev) => !prev)}
            aria-label="Simpan ke favorit"
            className={`p-2.5 rounded-full transition-all duration-200 shadow-md cursor-pointer active:scale-90 translate-y-2 group-hover:translate-y-0 ${
              isFavorite
                ? 'bg-[#c82929] text-white'
                : 'bg-white text-[#33241b] hover:bg-[#8a5225] hover:text-white'
            }`}
          >
            <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
          </button>
          <Link 
            href={`/product/${product.id}`}
            aria-label="Lihat detail"
            className="bg-white text-[#33241b] p-2.5 rounded-full hover:bg-[#8a5225] hover:text-white transition-all duration-200 delay-75 shadow-md active:scale-90 translate-y-2 group-hover:translate-y-0"
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
            type="button"
            onClick={handleAddToCart}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer active:scale-90 ${
              justAdded
                ? 'bg-[#5a8514] text-white scale-110 shadow-[#5a8514]/30'
                : 'bg-[#f7f1ea] hover:bg-[#8a5225] text-[#33241b] hover:text-white hover:scale-105'
            }`}
            title={justAdded ? 'Ditambahkan ke Keranjang!' : 'Tambah ke Keranjang'}
            aria-label={justAdded ? 'Ditambahkan ke Keranjang' : 'Tambah ke Keranjang'}
          >
            {justAdded ? <Check size={18} /> : <ShoppingCart size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
