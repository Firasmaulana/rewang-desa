"use client";

import { Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="bg-[#FDFBF7] py-24 min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-32 h-32 bg-stone-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">🛒</span>
        </div>
        <h2 className="text-2xl font-bold text-stone-900 mb-4">Keranjang Belanja Kosong</h2>
        <p className="text-stone-500 mb-8 text-center max-w-md">Sepertinya Anda belum menambahkan produk apapun ke keranjang. Yuk jelajahi produk UMKM kami!</p>
        <Link href="/shop" className="bg-amber-800 text-white font-bold py-3 px-8 rounded-full hover:bg-amber-900 transition shadow-lg shadow-amber-900/20">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.11; // 11% PPN
  const total = subtotal + tax;

  return (
    <div className="bg-[#FDFBF7] py-12 min-h-[70vh]">
      <div className="container mx-auto px-4">
        
        <h1 className="text-4xl font-extrabold text-stone-900 mb-10">Keranjang Belanja</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-3xl p-6 border border-amber-900/10 shadow-sm">
              
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 text-sm font-bold text-stone-500 uppercase tracking-wider mb-6 pb-4 border-b border-stone-100">
                <div className="col-span-6">Produk</div>
                <div className="col-span-2 text-center">Harga</div>
                <div className="col-span-2 text-center">Jumlah</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              {/* Items */}
              {items.map((item) => (
                <div key={item.product.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-6 border-b border-stone-100 last:border-0 last:pb-0">
                  <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-stone-300 hover:text-rose-500 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                    <div className="w-20 h-20 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                      <span className="text-xs text-stone-400 text-center px-1">{item.product.image}</span>
                    </div>
                    <div>
                      <span className="text-lime-700 text-xs font-bold uppercase">{item.product.category}</span>
                      <Link href={`/product/${item.product.id}`}>
                        <h3 className="font-bold text-stone-800 line-clamp-1 hover:text-amber-800 transition">{item.product.name}</h3>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 text-stone-600 md:text-center font-medium">
                    <span className="md:hidden text-stone-400 text-sm">Harga: </span>
                    Rp {item.product.price.toLocaleString('id-ID')}
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 flex md:justify-center">
                    <div className="flex items-center border border-stone-200 rounded-full overflow-hidden w-28 bg-stone-50">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-3 py-1 text-stone-600 hover:bg-stone-200 transition"
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        value={item.quantity} 
                        readOnly
                        className="w-full bg-transparent text-center font-bold text-stone-900 focus:outline-none" 
                      />
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-3 py-1 text-stone-600 hover:bg-stone-200 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 md:text-right font-bold text-amber-900">
                    <span className="md:hidden text-stone-400 text-sm font-normal">Subtotal: </span>
                    Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                  </div>
                </div>
              ))}

            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <Link href="/shop" className="text-amber-800 font-semibold hover:text-amber-900 transition flex items-center gap-2">
                 Lanjutkan Belanja
              </Link>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl p-6 border border-amber-900/10 shadow-sm sticky top-28">
              <h3 className="text-xl font-bold text-stone-900 mb-6">Ringkasan Pesanan</h3>
              
              <div className="space-y-4 text-stone-600 mb-6 border-b border-stone-100 pb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} jenis produk)</span>
                  <span className="font-medium text-stone-800">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pajak (11%)</span>
                  <span className="font-medium text-stone-800">Rp {tax.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-lg text-stone-900">Total</span>
                <span className="font-extrabold text-2xl text-amber-900">Rp {total.toLocaleString('id-ID')}</span>
              </div>

              <Link href="/checkout" className="w-full bg-amber-800 text-white font-bold py-4 rounded-full hover:bg-amber-900 transition flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20">
                Lanjut ke Pembayaran <ArrowRight size={20} />
              </Link>
              
              <div className="mt-4 flex flex-col gap-3">
                 <p className="text-xs text-stone-400 text-center">Pembayaran aman terenkripsi.</p>
                 {/* Kupon */}
                 <div className="flex bg-stone-50 border border-stone-200 rounded-full overflow-hidden p-1 mt-2">
                    <input type="text" placeholder="Kode Kupon" className="bg-transparent px-4 text-sm w-full focus:outline-none" />
                    <button className="bg-stone-800 text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-stone-700 transition">Terapkan</button>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

