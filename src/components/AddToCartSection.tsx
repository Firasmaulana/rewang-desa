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
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAdd = () => {
    addToCart(product, quantity);
    // Optional: show a toast notification here
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8 pb-8 border-b border-stone-100">
      <div className="flex items-center border border-stone-200 rounded-full bg-stone-50 overflow-hidden w-full sm:w-auto">
        <button 
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-5 py-3 text-stone-600 hover:bg-stone-200 hover:text-stone-900 transition"
        >
          -
        </button>
        <input 
          type="number" 
          value={quantity} 
          readOnly
          className="w-16 bg-transparent text-center font-bold text-stone-900 focus:outline-none" 
        />
        <button 
          onClick={() => setQuantity(quantity + 1)}
          className="px-5 py-3 text-stone-600 hover:bg-stone-200 hover:text-stone-900 transition"
        >
          +
        </button>
      </div>
      
      <button 
        onClick={handleAdd}
        className="flex-1 bg-amber-800 text-white font-bold py-3 px-8 rounded-full hover:bg-amber-900 transition flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20"
      >
        <ShoppingCart size={20} /> Tambah ke Keranjang
      </button>
      
      <button className="w-14 h-14 flex items-center justify-center border border-stone-200 rounded-full text-stone-600 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition shrink-0">
        <Heart size={24} />
      </button>
    </div>
  );
}

