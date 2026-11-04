"use client";

import { Heart, Search, ShoppingCart, Star } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="bg-[#FDFBF7] rounded-2xl border border-amber-900/10 overflow-hidden hover:shadow-xl hover:shadow-amber-900/5 hover:border-amber-200 transition-all group flex flex-col h-full">
      <div className="relative aspect-[4/3] bg-white flex items-center justify-center border-b border-amber-900/5 overflow-hidden">
         {product.isDiscounted && (
           <span className="absolute top-3 left-3 bg-lime-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
             Diskon
           </span>
         )}
         
         <span className="text-stone-400 text-sm">{product.image}</span>
         
         {/* Overlay Actions */}
         <div className="absolute inset-0 bg-stone-900/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
            <button className="bg-white text-stone-700 p-2 rounded-full hover:bg-amber-800 hover:text-white transition shadow">
              <Heart size={20} />
            </button>
            <Link href={`/product/${product.id}`} className="bg-white text-stone-700 p-2 rounded-full hover:bg-amber-800 hover:text-white transition shadow">
              <Search size={20} />
            </Link>
         </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <span className="text-lime-700 text-xs font-bold uppercase tracking-wider mb-2 block">{product.category}</span>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-bold text-stone-800 text-lg mb-2 hover:text-amber-800 transition line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 text-amber-500 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              fill="currentColor" 
              className={i < Math.floor(product.rating) ? 'text-amber-500' : 'text-amber-200'} 
            />
          ))}
          <span className="text-stone-400 text-xs ml-1">({product.rating.toFixed(1)})</span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-2">
          <div>
            {product.originalPrice && (
              <span className="text-stone-400 text-sm line-through block">
                Rp {product.originalPrice.toLocaleString('id-ID')}
              </span>
            )}
            <span className="text-amber-900 font-extrabold text-lg">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
          </div>
          <button 
            onClick={() => addToCart(product, 1)}
            className="w-10 h-10 rounded-full bg-stone-100 hover:bg-amber-800 text-stone-600 hover:text-white flex items-center justify-center transition-all shadow-sm"
            title="Tambah ke Keranjang"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

