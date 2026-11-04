"use client";

import { useState } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';

interface Props {
  product: Product;
}

export default function AddToCartSection({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAdd = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8 pb-8 border-b border-stone-100 font-body">
      <div className="flex items-center border border-[#33241b]/15 rounded-full bg-[#fffaf5] overflow-hidden w-full sm:w-auto">
        <button 
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-5 py-3 text-[#33241b] hover:bg-[#8a5225]/10 hover:text-[#8a5225] transition font-bold"
          aria-label="Kurang satu"
        >
          -
        </button>
        <input 
          type="number" 
          value={quantity} 
          readOnly
          className="w-14 bg-transparent text-center font-bold text-[#33241b] focus:outline-none" 
        />
        <button 
          onClick={() => setQuantity(quantity + 1)}
          className="px-5 py-3 text-[#33241b] hover:bg-[#8a5225]/10 hover:text-[#8a5225] transition font-bold"
          aria-label="Tambah satu"
        >
          +
        </button>
      </div>
      
      <button 
        onClick={handleAdd}
        className="flex-1 bg-[#8a5225] text-[#fffaf5] font-semibold py-3 px-8 rounded-full hover:bg-[#733f1b] transition flex items-center justify-center gap-2 shadow-lg shadow-[#8a5225]/20"
      >
        <ShoppingCart size={19} /> {isAdded ? 'Berhasil Ditambahkan! ✓' : 'Tambah ke Keranjang'}
      </button>
      
      <button 
        aria-label="Simpan ke favorit"
        className="w-12 h-12 flex items-center justify-center border border-[#33241b]/15 rounded-full text-stone-500 hover:text-[#8a5225] hover:border-[#8a5225]/30 hover:bg-[#fffaf5] transition shrink-0 self-center"
      >
        <Heart size={20} />
      </button>
    </div>
  );
}
