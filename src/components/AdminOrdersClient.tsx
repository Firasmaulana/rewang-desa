'use client';

import { useState, useEffect, useTransition } from 'react';
import { supabase } from '@/lib/supabase/client';
import { DatabaseOrder, OrderStatus } from '@/lib/supabase/types';
import { accOrder, updateOrderStatus } from '@/actions/orders';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Truck, 
  PackageCheck, 
  XCircle, 
  MessageCircle, 
  Search, 
  Filter, 
  Check, 
  AlertCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';

interface AdminOrdersClientProps {
  initialOrders: DatabaseOrder[];
}

export default function AdminOrdersClient({ initialOrders }: AdminOrdersClientProps) {
  const [orders, setOrders] = useState<DatabaseOrder[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Realtime subscription for incoming orders & status changes
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel('admin-orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            setOrders(prev => [payload.new as DatabaseOrder, ...prev]);
            setActionMessage(`🔔 Pesanan baru masuk dari ${(payload.new as DatabaseOrder).customer_name}!`);
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            const updated = payload.new as DatabaseOrder;
            setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
          } else if (payload.eventType === 'DELETE' && payload.old) {
            setOrders(prev => prev.filter(o => o.id !== (payload.old as any).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, []);

  const handleAcc = (orderId: string) => {
    startTransition(async () => {
      const res = await accOrder(orderId);
      if (res.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'diproses' } : o));
        setActionMessage(`✅ Pesanan ${orderId} berhasil di-ACC! Pelanggan kini melihat status "Sedang Diproses".`);
      }
    });
  };

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    startTransition(async () => {
      const res = await updateOrderStatus(orderId, status);
      if (res.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
        setActionMessage(`Status pesanan ${orderId} diperbarui menjadi "${status}".`);
      }
    });
  };

  // Counts for tabs
  const countPending = orders.filter(o => o.status === 'menunggu_konfirmasi').length;
  const countProcessing = orders.filter(o => o.status === 'diproses').length;
  const countShipped = orders.filter(o => o.status === 'dikirim').length;
  const countDone = orders.filter(o => o.status === 'selesai').length;

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    // Tab filter
    if (activeTab !== 'all' && order.status !== activeTab) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = order.id.toLowerCase().includes(q);
      const matchName = order.customer_name.toLowerCase().includes(q);
      const matchPhone = order.customer_phone.includes(q);
      const matchItem = order.items.some(it => it.name.toLowerCase().includes(q));
      return matchId || matchName || matchPhone || matchItem;
    }
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'menunggu_konfirmasi':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
            <Clock size={12} /> Menunggu ACC
          </span>
        );
      case 'diproses':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#5a8514]/15 text-[#5a8514] border border-[#5a8514]/30">
            <CheckCircle2 size={12} /> Diproses
          </span>
        );
      case 'dikirim':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">
            <Truck size={12} /> Dalam Pengiriman
          </span>
        );
      case 'selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <PackageCheck size={12} /> Selesai
          </span>
        );
      case 'dibatalkan':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle size={12} /> Dibatalkan
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto font-body space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading text-[#33241b] mb-1">Kelola Pesanan Masuk</h1>
          <p className="text-stone-500 text-sm">
            Pantau pesanan yang masuk via WhatsApp dan beri persetujuan (ACC) agar pelanggan tahu pesanannya sedang diproses.
          </p>
        </div>

        {countPending > 0 && (
          <div className="bg-amber-100 border border-amber-300 text-amber-900 px-4 py-2 rounded-2xl flex items-center gap-2.5 text-xs font-bold shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
            <span>{countPending} pesanan menunggu ACC Anda!</span>
          </div>
        )}
      </div>

      {actionMessage && (
        <div className="p-4 bg-[#5a8514]/15 border border-[#5a8514]/30 text-[#5a8514] text-xs font-semibold rounded-2xl flex justify-between items-center animate-fade-in">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="hover:text-[#33241b]">✕</button>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-3xl border border-[#33241b]/10 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'all' 
                ? 'bg-[#8a5225] text-white shadow-sm' 
                : 'text-stone-600 hover:bg-[#8a5225]/10'
            }`}
          >
            Semua ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('menunggu_konfirmasi')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'menunggu_konfirmasi' 
                ? 'bg-amber-700 text-white shadow-sm' 
                : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
            }`}
          >
            <span>Menunggu ACC</span>
            <span className="bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-full text-[10px]">
              {countPending}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('diproses')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'diproses' 
                ? 'bg-[#5a8514] text-white shadow-sm' 
                : 'text-[#5a8514] bg-[#5a8514]/10 hover:bg-[#5a8514]/20'
            }`}
          >
            <span>Diproses</span>
            <span className="bg-[#5a8514]/20 text-[#5a8514] px-1.5 py-0.2 rounded-full text-[10px]">
              {countProcessing}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('dikirim')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'dikirim' 
                ? 'bg-sky-700 text-white shadow-sm' 
                : 'text-sky-700 bg-sky-50 hover:bg-sky-100'
            }`}
          >
            <span>Dikirim</span>
            <span className="bg-sky-200 text-sky-900 px-1.5 py-0.2 rounded-full text-[10px]">
              {countShipped}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('selesai')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'selesai' 
                ? 'bg-emerald-700 text-white shadow-sm' 
                : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            <span>Selesai</span>
            <span className="bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded-full text-[10px]">
              {countDone}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Cari ID, nama, no HP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#fffaf5] border border-stone-200 rounded-full pl-9 pr-3 py-2 text-xs text-[#33241b] focus:outline-none focus:ring-2 focus:ring-[#8a5225]"
          />
          <Search size={14} className="absolute left-3.5 top-2.5 text-stone-400" />
        </div>

      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#33241b]/10 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#fffaf5] text-[#8a5225] flex items-center justify-center mx-auto mb-3">
            <ShoppingBag size={28} />
          </div>
          <h3 className="font-heading font-bold text-lg text-[#33241b] mb-1">Tidak Ada Pesanan</h3>
          <p className="text-stone-500 text-xs">
            {activeTab !== 'all' 
              ? `Tidak ada pesanan dengan status "${activeTab}".` 
              : 'Belum ada pesanan yang masuk.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const cleanPhone = order.customer_phone.replace(/\D/g, '');
            const waPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;

            return (
              <div 
                key={order.id} 
                className={`bg-white rounded-3xl border transition-all p-6 shadow-sm ${
                  order.status === 'menunggu_konfirmasi' 
                    ? 'border-amber-300 ring-2 ring-amber-100' 
                    : 'border-[#33241b]/10'
                }`}
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <span className="font-heading font-extrabold text-lg text-[#33241b]">
                      {order.id}
                    </span>
                    {getStatusBadge(order.status)}
                    <span className="text-[11px] text-stone-400 hidden md:inline">
                      {order.created_at ? new Date(order.created_at).toLocaleString('id-ID') : ''}
                    </span>
                  </div>

                  <div className="text-right flex items-center gap-2">
                    <span className="text-xs text-stone-500">Total:</span>
                    <span className="font-heading font-extrabold text-lg text-[#8a5225]">
                      Rp {order.total.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Content: Customer & Items */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                  
                  {/* Customer Info */}
                  <div className="text-xs space-y-1.5 font-body">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Pemesan</span>
                    <p className="font-bold text-[#33241b] text-sm">{order.customer_name}</p>
                    <p className="text-stone-600 flex items-center gap-1">
                      <span>WhatsApp:</span>
                      <a 
                        href={`https://wa.me/${waPhone}?text=Halo%20kak%20${encodeURIComponent(order.customer_name)},%20kami%20dari%20Rewang%20Desa%20terkait%20pesanan%20[${order.id}]:`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#5a8514] font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <MessageCircle size={13} /> {order.customer_phone}
                      </a>
                    </p>
                    <p className="text-stone-500 mt-2 line-clamp-2" title={order.customer_address}>
                      {order.customer_address}
                    </p>
                    {order.notes && (
                      <p className="text-stone-600 italic bg-[#fffaf5] p-2 rounded-lg border border-stone-200 mt-1">
                        Catatan: &ldquo;{order.notes}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Items summary */}
                  <div className="md:col-span-2 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">
                      Rincian Barang ({order.items.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2.5 p-2 bg-[#fffaf5] rounded-xl border border-stone-100">
                          <div className="w-9 h-9 rounded-lg bg-white overflow-hidden border border-stone-200 shrink-0">
                            {item.image?.startsWith('/') || item.image?.startsWith('http') ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs flex items-center justify-center h-full">🌾</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[#33241b] truncate">{item.name}</p>
                            <p className="text-[10px] text-stone-500">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Action Bar (ACC Button, Kirim, Selesai) */}
                <div className="pt-4 border-t border-stone-100 flex flex-wrap justify-between items-center gap-3">
                  <div className="flex items-center gap-2">
                    <a 
                      href={`https://wa.me/${waPhone}?text=Halo%20kak%20${encodeURIComponent(order.customer_name)},%20pesanan%20Anda%20dengan%20kode%20[${order.id}]%20sudah%20kami%20terima%20dan%20sedang%20kami%20siapkan.%20Terima%20kasih!`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#5a8514] bg-[#5a8514]/10 hover:bg-[#5a8514]/20 transition"
                    >
                      <MessageCircle size={14} /> Hubungi via WhatsApp
                    </a>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {order.status === 'menunggu_konfirmasi' && (
                      <button
                        onClick={() => handleAcc(order.id)}
                        disabled={isPending}
                        className="bg-[#5a8514] hover:bg-[#486b10] text-white px-5 py-2 rounded-full text-xs font-bold transition shadow-md shadow-[#5a8514]/25 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check size={14} /> ACC &amp; Proses Pesanan
                      </button>
                    )}

                    {order.status === 'diproses' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'dikirim')}
                        disabled={isPending}
                        className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-full text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <Truck size={14} /> Tandai Sedang Dikirim
                      </button>
                    )}

                    {order.status === 'dikirim' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'selesai')}
                        disabled={isPending}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <PackageCheck size={14} /> Tandai Selesai
                      </button>
                    )}

                    {order.status !== 'dibatalkan' && order.status !== 'selesai' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'dibatalkan')}
                        disabled={isPending}
                        className="text-stone-400 hover:text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer"
                      >
                        Batalkan
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
