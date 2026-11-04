"use client";

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import { MessageCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function Checkout() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isClient, setIsClient] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  // Jika keranjang kosong (dan bukan dalam state success), arahkan kembali
  if (items.length === 0 && !isSuccess) {
    router.push('/shop');
    return null;
  }

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Format Pesanan
    let message = `*Halo Admin Rewang Desa, saya ingin memesan produk dari tangan desa:*%0A%0A`;
    
    items.forEach(item => {
      message += `- ${item.quantity}x ${item.product.name} (Rp ${item.product.price.toLocaleString('id-ID')})%0A`;
    });

    message += `%0A*Ringkasan Biaya:*%0A`;
    message += `Subtotal: Rp ${subtotal.toLocaleString('id-ID')}%0A`;
    message += `Pajak (11%): Rp ${tax.toLocaleString('id-ID')}%0A`;
    message += `*Total Akhir: Rp ${total.toLocaleString('id-ID')}*%0A%0A`;

    message += `*Data Pengiriman Sahabat Rewang:*%0A`;
    message += `Nama: ${formData.name}%0A`;
    message += `Alamat Lengkap: ${formData.address}%0A`;
    
    if (formData.notes) {
      message += `Catatan: ${formData.notes}%0A`;
    }

    // Official WhatsApp from Rewang Desa Company Profile: 0813-1753-3522
    const whatsappUrl = `https://wa.me/6281317533522?text=${message}`;
    window.open(whatsappUrl, '_blank');

    clearCart();
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="bg-[#fffaf5] py-24 min-h-[70vh] flex flex-col items-center justify-center px-4 font-body">
        <div className="w-20 h-20 bg-[#8a5225]/15 text-[#8a5225] rounded-full flex items-center justify-center mb-6 border border-[#8a5225]/30">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl md:text-4xl font-heading text-[#33241b] mb-4 text-center">Pesanan Sedang Diproses!</h2>
        <p className="text-stone-600 mb-8 text-center max-w-md text-sm leading-relaxed">
          Terima kasih Sahabat Rewang! Anda telah dialihkan ke WhatsApp untuk menyelesaikan transaksi langsung bersama admin kami.
        </p>
        <Link 
          href="/" 
          className="bg-[#8a5225] text-[#fffaf5] font-semibold py-3.5 px-8 rounded-full hover:bg-[#733f1b] transition shadow-lg shadow-[#8a5225]/20 text-sm"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fffaf5] py-12 min-h-[70vh] font-body">
      <div className="container mx-auto px-4 max-w-5xl">
        
        <Link href="/cart" className="inline-flex items-center gap-2 text-[#8a5225] font-semibold hover:text-[#733f1b] mb-8 text-sm">
          <ArrowLeft size={18} /> Kembali ke Keranjang
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Form Pengiriman */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-3xl p-8 border border-[#33241b]/10 shadow-sm">
              <span className="text-[#854523] text-xs font-bold uppercase tracking-widest mb-1 block">
                Langkah Terakhir
              </span>
              <h1 className="text-2xl md:text-3xl font-heading text-[#33241b] mb-2">Informasi Pengiriman</h1>
              <p className="text-stone-600 text-sm mb-8">Lengkapi alamat Anda, dan konfirmasi pesanan via WhatsApp resmi Rewang Desa.</p>

              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-medium text-[#33241b] text-sm mb-2">Nama Lengkap</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]" 
                    placeholder="Nama penerima pesanan" 
                  />
                </div>
                
                <div>
                  <label className="block font-medium text-[#33241b] text-sm mb-2">Alamat Lengkap (Termasuk Kodepos)</label>
                  <textarea 
                    name="address"
                    required
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] resize-none bg-[#fffaf5]" 
                    placeholder="Jl. Mawar No. 123, RT 01/RW 02, Kec. Sukamaju, Kota Baru, 12345" 
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#33241b] text-sm mb-2">Catatan Tambahan (Opsional)</label>
                  <input 
                    type="text" 
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]" 
                    placeholder="Contoh: Titip di pos satpam atau bungkus hampers" 
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Ringkasan Pesanan */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl p-6 border border-[#33241b]/10 shadow-sm sticky top-28">
              <h3 className="font-heading font-bold text-xl text-[#33241b] mb-6">Pesanan Anda</h3>
              
              <div className="space-y-3 mb-6 border-b border-stone-100 pb-6 max-h-[30vh] overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-12 h-12 bg-[#fffaf5] rounded-xl flex items-center justify-center shrink-0 border border-[#33241b]/10">
                      <span className="text-xs">{item.product.image}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-semibold text-[#33241b] line-clamp-1">{item.product.name}</h4>
                      <p className="text-[11px] text-stone-500">{item.quantity} x Rp {item.product.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3.5 text-stone-600 text-sm mb-6 border-b border-stone-100 pb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
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

              <button 
                form="checkout-form"
                type="submit"
                className="w-full bg-[#8a5225] hover:bg-[#733f1b] text-white font-semibold py-3.5 rounded-full transition flex items-center justify-center gap-2 shadow-lg shadow-[#8a5225]/25 text-sm"
              >
                <MessageCircle size={19} />
                Pesan via WhatsApp Resmi
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
