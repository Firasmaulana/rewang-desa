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
  Check, 
  AlertCircle,
  Copy,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface AdminOrdersClientProps {
  initialOrders: DatabaseOrder[];
  isTableConfigured?: boolean;
}

const SQL_SETUP_SCRIPT = `-- 1. Buat tabel orders
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    notes TEXT,
    items JSONB NOT NULL,
    subtotal NUMERIC NOT NULL,
    tax NUMERIC NOT NULL,
    total NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'menunggu_konfirmasi',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read orders" ON public.orders;
CREATE POLICY "Allow public read orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert orders" ON public.orders;
CREATE POLICY "Allow public insert orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update orders" ON public.orders;
CREATE POLICY "Allow public update orders" ON public.orders FOR UPDATE USING (true);

-- 3. Aktifkan Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;`;

export default function AdminOrdersClient({ initialOrders, isTableConfigured = false }: AdminOrdersClientProps) {
  const [orders, setOrders] = useState<DatabaseOrder[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Sync with localStorage for testing on the same browser even before Supabase table is created
  useEffect(() => {
    try {
      const local = JSON.parse(localStorage.getItem('rewang_all_orders') || '[]');
      if (local && local.length > 0) {
        setOrders(prev => {
          const map = new Map<string, DatabaseOrder>();
          // 1. Add server orders
          prev.forEach(o => map.set(o.id, o));
          // 2. Add or update with local orders
          local.forEach((o: DatabaseOrder) => {
            if (!map.has(o.id) || !isTableConfigured) {
              map.set(o.id, o);
            }
          });
          return Array.from(map.values()).sort((a, b) => 
            new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
          );
        });
      }
    } catch (e) {}

    const handleLocalUpdate = () => {
      try {
        const local = JSON.parse(localStorage.getItem('rewang_all_orders') || '[]');
        if (local && local.length > 0) {
          setOrders(prev => {
            const map = new Map<string, DatabaseOrder>();
            prev.forEach(o => map.set(o.id, o));
            local.forEach((o: DatabaseOrder) => map.set(o.id, o));
            return Array.from(map.values()).sort((a, b) => 
              new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
            );
          });
        }
      } catch (e) {}
    };

    window.addEventListener('rewang-order-update', handleLocalUpdate);
    window.addEventListener('storage', handleLocalUpdate);
    return () => {
      window.removeEventListener('rewang-order-update', handleLocalUpdate);
      window.removeEventListener('storage', handleLocalUpdate);
    };
  }, [isTableConfigured]);

  // Realtime subscription for incoming orders from other devices via Supabase
  useEffect(() => {
    if (!supabase || !isTableConfigured) return;

    const channel = supabase
      .channel('admin-orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            setOrders(prev => [payload.new as DatabaseOrder, ...prev.filter(o => o.id !== (payload.new as any).id)]);
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
  }, [isTableConfigured]);

  // Helper to persist status change locally & to server
  const persistStatusChange = (orderId: string, nextStatus: OrderStatus) => {
    // 1. Optimistic UI update immediately
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));

    // 2. Update localStorage for client persistence
    try {
      const local = JSON.parse(localStorage.getItem('rewang_all_orders') || '[]');
      const updatedLocal = local.map((o: DatabaseOrder) => 
        o.id === orderId ? { ...o, status: nextStatus, updated_at: new Date().toISOString() } : o
      );
      localStorage.setItem('rewang_all_orders', JSON.stringify(updatedLocal));

      // Also notify any listening tracking pages
      window.dispatchEvent(new Event('rewang-order-update'));
    } catch (e) {}
  };

  const handleAcc = (orderId: string) => {
    persistStatusChange(orderId, 'diproses');
    setActionMessage(`✅ Pesanan ${orderId} berhasil di-ACC! Pelanggan kini melihat status "Sedang Diproses".`);

    startTransition(async () => {
      try {
        await accOrder(orderId);
      } catch (err) {
        console.warn('accOrder server note:', err);
      }
    });
  };

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    persistStatusChange(orderId, status);
    setActionMessage(`Status pesanan ${orderId} diperbarui menjadi "${status}".`);

    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, status);
      } catch (err) {
        console.warn('updateOrderStatus server note:', err);
      }
    });
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SETUP_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  // Counts for tabs
  const countPending = orders.filter(o => o.status === 'menunggu_konfirmasi').length;
  const countProcessing = orders.filter(o => o.status === 'diproses').length;
  const countShipped = orders.filter(o => o.status === 'dikirim').length;
  const countDone = orders.filter(o => o.status === 'selesai').length;

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    if (activeTab !== 'all' && order.status !== activeTab) {
      return false;
    }
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

      {/* Supabase Notice Banner if Table is not yet created */}
      {!isTableConfigured && (
        <div className="p-5 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-300 rounded-3xl shadow-sm text-amber-950 animate-fade-in">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle size={22} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-[#33241b]">
                  Langkah Terakhir: Aktifkan Tabel Pesanan di Supabase
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed max-w-2xl">
                  Saat ini pengetesan sudah bisa berjalan langsung di browser ini. Agar pesanan pelanggan dari HP lain otomatis masuk ke database cloud secara permanen, cukup jalankan skrip SQL di Dasbor Supabase (hanya 30 detik).
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
              <button
                type="button"
                onClick={handleCopySql}
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-[#8a5225] hover:bg-[#733f1b] text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                {copiedSql ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedSql ? 'SQL Tersalin!' : 'Salin Kode SQL'}</span>
              </button>

              <a
                href="https://supabase.com/dashboard/project/qwykaikwoljzhsmvrjqk/sql/new"
                target="_blank"
                rel="noreferrer"
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 bg-white hover:bg-stone-50 text-[#33241b] border border-stone-300 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
              >
                <span>Buka SQL Editor Supabase</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      )}

      {actionMessage && (
        <div className="p-4 bg-[#5a8514]/15 border border-[#5a8514]/30 text-[#5a8514] text-xs font-semibold rounded-2xl flex justify-between items-center animate-fade-in shadow-sm">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="hover:text-[#33241b] text-sm font-bold">✕</button>
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
          <h3 className="font-heading font-bold text-lg text-[#33241b] mb-1">Belum Ada Pesanan Masuk</h3>
          <p className="text-stone-500 text-xs max-w-md mx-auto leading-relaxed">
            {activeTab !== 'all' 
              ? `Tidak ada pesanan dengan status "${activeTab}".` 
              : 'Daftar pesanan Anda saat ini masih kosong. Silakan buka katalog produk di halaman depan dan lakukan checkout untuk mencobanya.'}
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
                        type="button"
                        onClick={() => handleAcc(order.id)}
                        disabled={isPending}
                        className="bg-[#5a8514] hover:bg-[#486b10] text-white px-5 py-2 rounded-full text-xs font-bold transition shadow-md shadow-[#5a8514]/25 flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Check size={14} /> ACC &amp; Proses Pesanan
                      </button>
                    )}

                    {order.status === 'diproses' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(order.id, 'dikirim')}
                        disabled={isPending}
                        className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-full text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Truck size={14} /> Tandai Sedang Dikirim
                      </button>
                    )}

                    {order.status === 'dikirim' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(order.id, 'selesai')}
                        disabled={isPending}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <PackageCheck size={14} /> Tandai Selesai
                      </button>
                    )}

                    {order.status !== 'dibatalkan' && order.status !== 'selesai' && (
                      <button
                        type="button"
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
