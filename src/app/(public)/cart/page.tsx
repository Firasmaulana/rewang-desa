"use client";

import { Trash2, ArrowRight, ShoppingBag, PackageCheck } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="bg-[#fffaf5] py-24 min-h-[70vh] flex flex-col items-center justify-center font-body">
        <div className="w-20 h-20 bg-[#f7f1ea] rounded-full flex items-center justify-center mb-6 text-[#8a5225] border border-[#8a5225]/20">
          <ShoppingBag size={36} strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl md:text-3xl font-heading text-[#33241b] mb-3">Keranjang Belanja Kosong</h2>
        <p className="text-stone-600 mb-8 text-center max-w-md text-sm leading-relaxed">
          Belum ada produk dari tangan desa yang Anda tambahkan. Yuk temukan komoditas pangan sehat dan kerajinan lokal kami!
        </p>
        <Link 
          href="/shop" 
          className="bg-[#8a5225] text-[#fffaf5] font-semibold py-3.5 px-8 rounded-full hover:bg-[#733f1b] transition shadow-lg shadow-[#8a5225]/20 text-sm"
        >
          Mulai Belanja Produk Desa
        </Link>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.11; // 11% PPN
  const total = subtotal + tax;

  return (
    <div className="bg-[#fffaf5] py-12 min-h-[70vh] font-body">
      <div className="container mx-auto px-4">
        
        <div className="mb-8">
          <span className="text-[#854523] text-xs font-bold uppercase tracking-widest mb-1.5 block">
            Pesanan Sahabat Rewang
          </span>
          <h1 className="text-3xl md:text-4xl font-heading text-[#33241b]">
            Keranjang Belanja
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-3xl p-6 border border-[#33241b]/10 shadow-sm">
              
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-bold text-stone-500 uppercase tracking-wider mb-6 pb-4 border-b border-stone-100">
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
                      className="text-stone-300 hover:text-[#c82929] transition p-1"
                      aria-label="Hapus produk"
                    >
                      <Trash2 size={19} />
                    </button>
                    <div className="w-16 h-16 bg-[#fffaf5] border border-[#33241b]/10 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden text-sm">
                      {item.product.image && (item.product.image.startsWith('http') || item.product.image.startsWith('/')) ? (
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <PackageCheck size={24} className="text-[#8a5225]" />
                      )}
                    </div>
                    <div>
                      <span className="text-[#854523] text-[10px] font-bold uppercase tracking-wider block">
                        {item.product.category}
                      </span>
                      <Link href={`/product/${item.product.id}`}>
                        <h3 className="font-heading font-medium text-base text-[#33241b] line-clamp-1 hover:text-[#8a5225] transition">
                          {item.product.name}
                        </h3>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 text-stone-700 md:text-center text-sm font-medium">
                    <span className="md:hidden text-stone-400 text-xs">Harga: </span>
                    Rp {item.product.price.toLocaleString('id-ID')}
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 flex md:justify-center">
                    <div className="flex items-center border border-[#33241b]/15 rounded-full overflow-hidden w-28 bg-[#fffaf5]">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-3 py-1 text-stone-600 hover:bg-[#8a5225]/10 hover:text-[#8a5225] transition font-bold"
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        value={item.quantity} 
                        readOnly
                        className="w-full bg-transparent text-center font-bold text-[#33241b] text-sm focus:outline-none" 
                      />
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-3 py-1 text-stone-600 hover:bg-[#8a5225]/10 hover:text-[#8a5225] transition font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 md:text-right font-bold text-[#33241b] text-sm">
                    <span className="md:hidden text-stone-400 text-xs font-normal">Subtotal: </span>
                    Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                  </div>
                </div>
              ))}

            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <Link href="/shop" className="text-[#8a5225] font-semibold hover:text-[#733f1b] transition flex items-center gap-2 text-sm">
                 ← Lanjutkan Belanja Produk Desa
              </Link>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl p-6 border border-[#33241b]/10 shadow-sm sticky top-28">
              <h3 className="font-heading font-bold text-xl text-[#33241b] mb-6">Ringkasan Pesanan</h3>
              
              <div className="space-y-3.5 text-stone-600 text-sm mb-6 border-b border-stone-100 pb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} produk)</span>
                  <span className="font-medium text-[#33241b]">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pajak (11%)</span>
                  <span className="font-medium text-[#33241b]">Rp {tax.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="font-heading font-bold text-lg text-[#33241b]">Total</span>
                <span className="font-bold text-2xl text-[#8a5225]">Rp {total.toLocaleString('id-ID')}</span>
              </div>

              <Link 
                href="/checkout" 
                className="w-full bg-[#8a5225] text-[#fffaf5] font-semibold py-3.5 rounded-full hover:bg-[#733f1b] transition flex items-center justify-center gap-2 shadow-lg shadow-[#8a5225]/20 text-sm"
              >
                Lanjut ke Pembayaran <ArrowRight size={18} />
              </Link>
              
              <div className="mt-6 flex flex-col gap-3">
                 <p className="text-xs text-stone-400 text-center">Pembayaran aman &amp; langsung mendukung petani.</p>
                 {/* Kupon */}
                 <div className="flex bg-[#fffaf5] border border-[#33241b]/15 rounded-full overflow-hidden p-1 mt-1">
                    <input 
                      type="text" 
                      placeholder="Kode Kupon (cth: REWANG20)" 
                      className="bg-transparent px-4 text-xs w-full focus:outline-none uppercase" 
                    />
                    <button className="bg-[#33241b] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#8a5225] transition">
                      Terapkan
                    </button>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
