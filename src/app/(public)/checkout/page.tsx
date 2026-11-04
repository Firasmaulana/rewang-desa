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
    let message = `*Halo Admin Rewang Desa, saya ingin memesan:*%0A%0A`;
    
    items.forEach(item => {
      message += `- ${item.quantity}x ${item.product.name} (Rp ${item.product.price.toLocaleString('id-ID')})%0A`;
    });

    message += `%0A*Ringkasan Biaya:*%0A`;
    message += `Subtotal: Rp ${subtotal.toLocaleString('id-ID')}%0A`;
    message += `Pajak (11%): Rp ${tax.toLocaleString('id-ID')}%0A`;
    message += `*Total Akhir: Rp ${total.toLocaleString('id-ID')}*%0A%0A`;

    message += `*Data Pengiriman:*%0A`;
    message += `Nama: ${formData.name}%0A`;
    message += `Alamat Lengkap: ${formData.address}%0A`;
    
    if (formData.notes) {
      message += `Catatan: ${formData.notes}%0A`;
    }

    const whatsappUrl = `https://wa.me/628112000137?text=${message}`;
    window.open(whatsappUrl, '_blank');

    clearCart();
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="bg-[#FDFBF7] py-24 min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-lime-100 text-lime-700 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-extrabold text-stone-900 mb-4 text-center">Pesanan Sedang Diproses!</h2>
        <p className="text-stone-500 mb-8 text-center max-w-md">
          Anda telah dialihkan ke WhatsApp untuk menyelesaikan transaksi langsung dengan admin kami. Keranjang belanja Anda telah dikosongkan.
        </p>
        <Link href="/" className="bg-amber-800 text-white font-bold py-3 px-8 rounded-full hover:bg-amber-900 transition shadow-lg shadow-amber-900/20">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF7] py-12 min-h-[70vh]">
      <div className="container mx-auto px-4 max-w-5xl">
        
        <Link href="/cart" className="inline-flex items-center gap-2 text-amber-800 font-bold hover:text-amber-900 mb-8">
          <ArrowLeft size={20} /> Kembali ke Keranjang
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Form Pengiriman */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-3xl p-8 border border-amber-900/10 shadow-sm">
              <h1 className="text-3xl font-extrabold text-stone-900 mb-2">Informasi Pengiriman</h1>
              <p className="text-stone-500 mb-8">Lengkapi alamat Anda, dan selesaikan pembayaran via WhatsApp admin kami.</p>

              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-bold text-stone-800 mb-2">Nama Lengkap</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" 
                    placeholder="Nama penerima pesanan" 
                  />
                </div>
                
                <div>
                  <label className="block font-bold text-stone-800 mb-2">Alamat Lengkap (Termasuk Kodepos)</label>
                  <textarea 
                    name="address"
                    required
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" 
                    placeholder="Jl. Mawar No. 123, RT 01/RW 02, Kec. Sukamaju, Kota Baru, 12345" 
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-2">Catatan Tambahan (Opsional)</label>
                  <input 
                    type="text" 
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" 
                    placeholder="Contoh: Titip di pos satpam" 
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Ringkasan Pesanan */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl p-6 border border-amber-900/10 shadow-sm sticky top-28">
              <h3 className="text-xl font-bold text-stone-900 mb-6">Pesanan Anda</h3>
              
              <div className="space-y-3 mb-6 border-b border-stone-100 pb-6 max-h-[30vh] overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-12 h-12 bg-stone-50 rounded-lg flex items-center justify-center shrink-0 border border-stone-100">
                      <span className="text-xs">{item.product.image}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-stone-800 line-clamp-1">{item.product.name}</h4>
                      <p className="text-xs text-stone-500">{item.quantity} x Rp {item.product.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4 text-stone-600 mb-6 border-b border-stone-100 pb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
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

              <button 
                form="checkout-form"
                type="submit"
                className="w-full bg-[#25D366] text-white font-bold py-4 rounded-full hover:bg-[#1DA851] transition flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/30"
              >
                <MessageCircle size={20} />
                Pesan via WhatsApp
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

