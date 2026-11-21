'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { DatabaseOrder, OrderStatus } from '@/lib/supabase/types';
import { 
  Clock, 
  CheckCircle2, 
  Truck, 
  PackageCheck, 
  XCircle, 
  Search, 
  MessageCircle, 
  MapPin, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

interface OrderTrackingClientProps {
  initialOrders: DatabaseOrder[];
  searchedId?: string;
}

export default function OrderTrackingClient({ initialOrders, searchedId }: OrderTrackingClientProps) {
  const [orders, setOrders] = useState<DatabaseOrder[]>(initialOrders);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    searchedId || initialOrders[0]?.id || ''
  );
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchStatus, setSearchStatus] = useState<string | null>(null);

  // 1. Check localStorage if initial orders empty (dual redundancy with cookies)
  useEffect(() => {
    if (orders.length === 0) {
      try {
        const local = JSON.parse(localStorage.getItem('rewang_customer_orders') || '[]');
        if (local && local.length > 0 && !searchedId) {
          // fetch local order ids
          fetch(`/api/orders?ids=${local.join(',')}`)
            .then(res => res.json())
            .then(data => {
              if (data && data.orders && data.orders.length > 0) {
                setOrders(data.orders);
                if (!selectedOrderId) setSelectedOrderId(data.orders[0].id);
              }
            })
            .catch(() => {});
        }
      } catch (e) {}
    }
  }, [orders.length, searchedId, selectedOrderId]);

  // 2. Realtime listener: auto update when admin clicks ACC / change status!
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel('orders-realtime-customer')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.new) {
            const updated = payload.new as DatabaseOrder;
            setOrders(prev => {
              const exists = prev.some(o => o.id === updated.id);
              if (exists) {
                return prev.map(o => o.id === updated.id ? updated : o);
              }
              return [updated, ...prev];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, []);

  // Handle Search by ID or Phone
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setSearchStatus('Mencari pesanan...');
    try {
      const q = encodeURIComponent(searchInput.trim());
      const res = await fetch(`/api/orders?query=${q}`);
      const data = await res.json();

      if (data && data.orders && data.orders.length > 0) {
        setOrders(data.orders);
        setSelectedOrderId(data.orders[0].id);
        setSearchStatus(null);
      } else {
        setSearchStatus('Pesanan tidak ditemukan. Periksa kembali Kode Pesanan atau No. WhatsApp Anda.');
      }
    } catch (err) {
      setSearchStatus('Gagal memuat pesanan. Silakan coba lagi.');
    }
  };

  const currentOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'menunggu_konfirmasi':
        return {
          label: 'Menunggu ACC Admin',
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          dot: 'bg-amber-500 animate-pulse',
          desc: 'Pesanan Anda telah masuk dan sedang menunggu persetujuan/ACC admin via WhatsApp.',
        };
      case 'diproses':
        return {
          label: 'Pesanan Dikonfirmasi & Diproses',
          bg: 'bg-[#5a8514]/15 text-[#5a8514] border-[#5a8514]/30',
          dot: 'bg-[#5a8514] animate-ping',
          desc: 'Admin telah meng-ACC pesanan Anda! Saat ini produk sedang disiapkan dan dikemas dengan rapi.',
        };
      case 'dikirim':
        return {
          label: 'Dalam Pengiriman',
          bg: 'bg-sky-100 text-sky-800 border-sky-300',
          dot: 'bg-sky-500',
          desc: 'Pesanan Anda telah diserahkan ke jasa kirim dan sedang meluncur ke alamat Anda.',
        };
      case 'selesai':
        return {
          label: 'Pesanan Selesai',
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-600',
          desc: 'Pesanan telah selesai diterima. Terima kasih telah gotong royong mendukung petani desa!',
        };
      case 'dibatalkan':
        return {
          label: 'Pesanan Dibatalkan',
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
          dot: 'bg-rose-500',
          desc: 'Pesanan ini dibatalkan atau stok tidak mencukupi.',
        };
    }
  };

  return (
    <div className="max-w-5xl mx-auto font-body">
      
      {/* Header */}
      <div className="text-center md:text-left mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#33241b]/10 pb-8">
        <div>
          <span className="text-[#854523] text-xs font-bold uppercase tracking-widest mb-1.5 block">
            Status Transaksi
          </span>
          <h1 className="text-3xl md:text-4xl font-heading text-[#33241b] mb-2">
            Lacak Pesanan Sahabat Rewang
          </h1>
          <p className="text-stone-600 text-sm max-w-xl">
            Pantau status pemrosesan pesanan Anda secara realtime tanpa perlu login akun.
          </p>
        </div>

        {/* Search Bar for manual lookup */}
        <form onSubmit={handleSearch} className="w-full md:w-auto flex gap-2">
          <div className="relative flex-1 md:w-64">
            <input 
              type="text" 
              placeholder="Cari No. Pesanan / No. WA..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-white border border-[#33241b]/15 rounded-full pl-9 pr-3 py-2 text-xs text-[#33241b] focus:outline-none focus:ring-2 focus:ring-[#8a5225]"
            />
            <Search size={14} className="absolute left-3.5 top-3 text-stone-400" />
          </div>
          <button 
            type="submit"
            className="bg-[#8a5225] text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#733f1b] transition shrink-0"
          >
            Lacak
          </button>
        </form>
      </div>

      {searchStatus && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-2xl flex items-center gap-2">
          <Clock size={16} className="shrink-0" />
          <span>{searchStatus}</span>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#33241b]/10 shadow-sm max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#fffaf5] text-[#8a5225] flex items-center justify-center mx-auto mb-4 border border-[#8a5225]/20">
            <Truck size={32} />
          </div>
          <h3 className="font-heading font-bold text-xl text-[#33241b] mb-2">Belum Ada Pesanan Aktif</h3>
          <p className="text-stone-500 text-xs mb-6 leading-relaxed">
            Tidak ditemukan riwayat pesanan di perangkat ini. Jika Anda memesan dari perangkat lain, silakan cari menggunakan No. Pesanan atau No. WhatsApp Anda di kolom pencarian di atas.
          </p>
          <Link 
            href="/shop"
            className="bg-[#8a5225] text-white px-6 py-3 rounded-full text-xs font-semibold hover:bg-[#733f1b] transition shadow-md inline-block"
          >
            Mulai Belanja Produk Desa
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Order Selector (if multiple orders in cookie) */}
          {orders.length > 1 && (
            <div className="lg:w-1/3">
              <div className="bg-white p-5 rounded-3xl border border-[#33241b]/10 shadow-sm space-y-3">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Riwayat Pesanan Anda ({orders.length})
                </span>
                {orders.map((ord) => {
                  const isCurrent = ord.id === currentOrder?.id;
                  const badge = getStatusBadge(ord.status);
                  return (
                    <button
                      key={ord.id}
                      onClick={() => setSelectedOrderId(ord.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                        isCurrent 
                          ? 'border-[#8a5225] bg-[#8a5225]/5 shadow-sm' 
                          : 'border-stone-100 hover:border-stone-200 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm text-[#33241b]">{ord.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 flex justify-between">
                        <span>{ord.items.length} produk</span>
                        <span className="font-semibold text-[#8a5225]">Rp {ord.total.toLocaleString('id-ID')}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Current Order Detailed Status */}
          <div className={orders.length > 1 ? "lg:w-2/3" : "w-full"}>
            {currentOrder && (
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#33241b]/10 shadow-sm space-y-8">
                
                {/* Status Hero Card */}
                <div className="bg-gradient-to-br from-[#fffaf5] to-[#f7f1ea] p-6 rounded-2xl border border-[#8a5225]/20">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <div>
                      <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                        Kode Pesanan
                      </span>
                      <h2 className="text-2xl font-heading font-extrabold text-[#33241b]">
                        {currentOrder.id}
                      </h2>
                    </div>

                    <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-stone-200 shadow-sm">
                      <span className={`w-2.5 h-2.5 rounded-full ${getStatusBadge(currentOrder.status).dot}`}></span>
                      <span className="text-xs font-bold text-[#33241b]">
                        {getStatusBadge(currentOrder.status).label}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-body">
                    {getStatusBadge(currentOrder.status).desc}
                  </p>
                </div>

                {/* Progress Stepper */}
                <div className="py-4">
                  <h3 className="font-heading font-bold text-base text-[#33241b] mb-6">
                    Tahapan Pesanan
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                    
                    {/* Step 1: Dikirim via WA */}
                    <div className="flex sm:flex-col items-center gap-3 text-left sm:text-center">
                      <div className="w-10 h-10 rounded-full bg-[#5a8514] text-white flex items-center justify-center shrink-0 font-bold shadow-md">
                        <MessageCircle size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-[#33241b]">1. Pesanan Dibuat</p>
                        <p className="text-[11px] text-stone-500">Terkirim ke WhatsApp</p>
                      </div>
                    </div>

                    {/* Step 2: ACC Admin */}
                    <div className="flex sm:flex-col items-center gap-3 text-left sm:text-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold shadow-md ${
                        currentOrder.status !== 'menunggu_konfirmasi' && currentOrder.status !== 'dibatalkan'
                          ? 'bg-[#5a8514] text-white'
                          : 'bg-amber-100 text-amber-700 border-2 border-amber-400'
                      }`}>
                        <CheckCircle2 size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-[#33241b]">2. Konfirmasi &amp; ACC</p>
                        <p className="text-[11px] text-stone-500">
                          {currentOrder.status === 'menunggu_konfirmasi' ? 'Menunggu ACC Admin' : 'Pesanan Disetujui'}
                        </p>
                      </div>
                    </div>

                    {/* Step 3: Pengiriman */}
                    <div className="flex sm:flex-col items-center gap-3 text-left sm:text-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold shadow-md ${
                        currentOrder.status === 'dikirim' || currentOrder.status === 'selesai'
                          ? 'bg-[#5a8514] text-white'
                          : 'bg-stone-100 text-stone-400'
                      }`}>
                        <Truck size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-[#33241b]">3. Pengemasan &amp; Kirim</p>
                        <p className="text-[11px] text-stone-500">
                          {currentOrder.status === 'dikirim' ? 'Sedang di Perjalanan' : 'Proses Gudang Desa'}
                        </p>
                      </div>
                    </div>

                    {/* Step 4: Selesai */}
                    <div className="flex sm:flex-col items-center gap-3 text-left sm:text-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold shadow-md ${
                        currentOrder.status === 'selesai'
                          ? 'bg-[#5a8514] text-white'
                          : 'bg-stone-100 text-stone-400'
                      }`}>
                        <PackageCheck size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-[#33241b]">4. Pesanan Selesai</p>
                        <p className="text-[11px] text-stone-500">Tiba di Rumah Anda</p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Items & Shipping Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-stone-100">
                  
                  {/* Products List */}
                  <div>
                    <h4 className="font-heading font-bold text-sm text-[#33241b] mb-4">
                      Rincian Produk ({currentOrder.items.length})
                    </h4>
                    <div className="space-y-3">
                      {currentOrder.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#fffaf5] border border-[#33241b]/5">
                          <div className="w-12 h-12 rounded-lg bg-white overflow-hidden border border-[#33241b]/10 shrink-0">
                            {item.image?.startsWith('/') || item.image?.startsWith('http') ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs flex items-center justify-center h-full">📦</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-xs text-[#33241b] line-clamp-1">{item.name}</p>
                            <p className="text-[11px] text-stone-500">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                          </div>
                          <div className="text-right font-bold text-xs text-[#8a5225]">
                            Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 text-xs space-y-1.5">
                      <div className="flex justify-between text-stone-500">
                        <span>Subtotal</span>
                        <span>Rp {currentOrder.subtotal.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-stone-500">
                        <span>Pajak (11%)</span>
                        <span>Rp {currentOrder.tax.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between font-bold text-sm text-[#33241b] pt-1 border-t border-stone-100">
                        <span>Total Pembayaran</span>
                        <span className="text-[#8a5225]">Rp {currentOrder.total.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer & Shipping Data */}
                  <div className="space-y-4">
                    <h4 className="font-heading font-bold text-sm text-[#33241b] mb-4">
                      Tujuan Pengiriman
                    </h4>
                    
                    <div className="p-4 rounded-2xl bg-white border border-[#33241b]/10 text-xs space-y-3 font-body">
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">Penerima</span>
                        <p className="font-semibold text-[#33241b] text-sm mt-0.5">{currentOrder.customer_name}</p>
                        <p className="text-stone-500">{currentOrder.customer_phone}</p>
                      </div>

                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">Alamat</span>
                        <p className="text-stone-700 mt-0.5 leading-relaxed">{currentOrder.customer_address}</p>
                      </div>

                      {currentOrder.notes && (
                        <div>
                          <span className="text-stone-400 block text-[10px] uppercase font-bold">Catatan</span>
                          <p className="text-stone-600 italic mt-0.5">{currentOrder.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* WhatsApp Action Helper */}
                    <div className="p-4 rounded-2xl bg-[#5a8514]/10 border border-[#5a8514]/20">
                      <p className="text-xs text-[#5a8514] font-semibold mb-2">Butuh bantuan tentang pesanan ini?</p>
                      <a 
                        href={`https://wa.me/6281317533522?text=Halo%20Admin%20Rewang%20Desa,%20saya%20ingin%20menanyakan%20status%20pesanan%20saya%20dengan%20kode%20${currentOrder.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-[#5a8514] hover:bg-[#486b10] text-white text-xs font-semibold px-4 py-2 rounded-full transition shadow-sm"
                      >
                        <MessageCircle size={14} /> Hubungi Admin via WhatsApp
                      </a>
                    </div>

                  </div>

                </div>

              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
