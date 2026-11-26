'use client';

import { useState, useEffect, useTransition } from 'react';
import { supabase } from '@/lib/supabase/client';
import { DatabaseOrder, OrderStatus, OrderItem } from '@/lib/supabase/types';
import { accOrder, updateOrderStatus, updateOrderItems } from '@/actions/orders';
import { Product, products as defaultFallbackProducts } from '@/data/products';
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
  Sparkles,
  Edit3,
  Plus,
  Minus,
  Trash2,
  X,
  PackagePlus,
  Loader2
} from 'lucide-react';

interface AdminOrdersClientProps {
  initialOrders: DatabaseOrder[];
  isTableConfigured?: boolean;
  tableError?: string;
  availableProducts?: Product[];
}

const SQL_SETUP_SCRIPT = `-- 1. Buka hak izin akses penuh ke role anon dan authenticated pada tabel orders & products
GRANT ALL ON TABLE public.orders TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;

-- 2. Pastikan RLS Policies aktif dan mengizinkan simpan, baca, dan perbarui stok
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read orders" ON public.orders;
CREATE POLICY "Allow public read orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert orders" ON public.orders;
CREATE POLICY "Allow public insert orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update orders" ON public.orders;
CREATE POLICY "Allow public update orders" ON public.orders FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public all on products" ON public.products;
CREATE POLICY "Allow public all on products" ON public.products FOR ALL USING (true) WITH CHECK (true);`;

export default function AdminOrdersClient({ 
  initialOrders, 
  isTableConfigured = false, 
  tableError,
  availableProducts = []
}: AdminOrdersClientProps) {
  const [orders, setOrders] = useState<DatabaseOrder[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Fallback product list for catalog picker
  const productList = availableProducts && availableProducts.length > 0 ? availableProducts : defaultFallbackProducts;

  // Modal State for Editing Order Items
  const [editingOrder, setEditingOrder] = useState<DatabaseOrder | null>(null);
  const [editItems, setEditItems] = useState<OrderItem[]>([]);
  const [editNotes, setEditNotes] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedProductQty, setSelectedProductQty] = useState<number>(1);

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
    if (status === 'selesai') {
      setActionMessage(`🎉 Pesanan ${orderId} telah selesai! Jumlah stok produk di database otomatis telah dikurangi.`);
    } else if (status === 'dibatalkan') {
      setActionMessage(`Pesanan ${orderId} dibatalkan. Jika sebelumnya berstatus selesai, stok otomatis telah dipulihkan.`);
    } else {
      setActionMessage(`Status pesanan ${orderId} diperbarui menjadi "${status}".`);
    }

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

  // Modal Handlers for Editing Order Items
  const handleOpenEditModal = (order: DatabaseOrder) => {
    setEditingOrder(order);
    const rawItems = order.items;
    const items: OrderItem[] = typeof rawItems === 'string' ? JSON.parse(rawItems) : (rawItems || []);
    setEditItems(items.map(it => ({ ...it })));
    setEditNotes(order.notes || '');
    setSelectedProductId('');
    setSelectedProductQty(1);
  };

  const handleCloseEditModal = () => {
    setEditingOrder(null);
    setEditItems([]);
    setEditNotes('');
    setSelectedProductId('');
    setSelectedProductQty(1);
  };

  const handleUpdateItemQty = (index: number, newQty: number) => {
    if (newQty < 1) return;
    setEditItems(prev => prev.map((item, idx) => idx === index ? { ...item, quantity: newQty } : item));
  };

  const handleRemoveItem = (index: number) => {
    setEditItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleAddNewItem = () => {
    if (!selectedProductId) return;
    const prod = productList.find(p => p.id === selectedProductId);
    if (!prod) return;

    const qty = Math.max(1, Number(selectedProductQty) || 1);

    setEditItems(prev => {
      const existingIdx = prev.findIndex(it => String(it.productId) === String(prod.id));
      if (existingIdx !== -1) {
        return prev.map((it, idx) => idx === existingIdx ? { ...it, quantity: it.quantity + qty } : it);
      }
      return [
        ...prev,
        {
          productId: prod.id,
          name: prod.name,
          price: prod.price,
          quantity: qty,
          image: prod.image,
        }
      ];
    });

    setSelectedProductId('');
    setSelectedProductQty(1);
  };

  const editSubtotal = editItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
  const editTax = Math.round(editSubtotal * 0.11);
  const editTotal = editSubtotal + editTax;

  const handleSaveEdit = () => {
    if (!editingOrder) return;
    if (editItems.length === 0) {
      alert('Pesanan harus memiliki minimal 1 barang. Jika ingin membatalkan pesanan, silakan gunakan tombol Batalkan.');
      return;
    }

    const orderId = editingOrder.id;

    // 1. Optimistic UI update
    setOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      items: editItems,
      subtotal: editSubtotal,
      tax: editTax,
      total: editTotal,
      notes: editNotes.trim() ? editNotes.trim() : null,
      updated_at: new Date().toISOString()
    } : o));

    // 2. Local storage update
    try {
      const local = JSON.parse(localStorage.getItem('rewang_all_orders') || '[]');
      const updatedLocal = local.map((o: DatabaseOrder) => 
        o.id === orderId ? {
          ...o,
          items: editItems,
          subtotal: editSubtotal,
          tax: editTax,
          total: editTotal,
          notes: editNotes.trim() ? editNotes.trim() : null,
          updated_at: new Date().toISOString()
        } : o
      );
      localStorage.setItem('rewang_all_orders', JSON.stringify(updatedLocal));
      window.dispatchEvent(new Event('rewang-order-update'));
    } catch (e) {}

    setActionMessage(`✅ Isi keranjang pesanan ${orderId} berhasil diperbarui! Total baru: Rp ${editTotal.toLocaleString('id-ID')}`);
    setEditingOrder(null);

    // 3. Server action
    startTransition(async () => {
      try {
        await updateOrderItems(
          orderId,
          editItems,
          editSubtotal,
          editTax,
          editTotal,
          editNotes.trim() ? editNotes.trim() : null
        );
      } catch (err) {
        console.warn('updateOrderItems server error:', err);
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

      {/* Supabase Notice Banner if Table is not yet created or permission denied */}
      {!isTableConfigured && (
        <div className="p-5 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-300 rounded-3xl shadow-sm text-amber-950 animate-fade-in">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle size={22} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-[#33241b]">
                  Izin Akses Database Supabase Perlu Diberikan (GRANT)
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed max-w-2xl">
                  {tableError 
                    ? `Supabase mengembalikan respon: "${tableError}". `
                    : 'Tabel sudah dibuat tetapi role anon/publik belum diberi izin akses. '}
                  Cukup salin dan jalankan skrip SQL perbaikan di bawah ini di SQL Editor Supabase agar pesanan otomatis terhubung.
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
                <span>{copiedSql ? 'SQL Tersalin!' : 'Salin Kode SQL Perbaikan'}</span>
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
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">
                        Rincian Barang ({order.items.length})
                      </span>
                      {order.status !== 'selesai' && order.status !== 'dibatalkan' && (
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#8a5225] bg-[#8a5225]/10 hover:bg-[#8a5225]/20 transition cursor-pointer"
                          title="Ubah isi barang pesanan sesuai kesepakatan WhatsApp"
                        >
                          <Edit3 size={13} />
                          <span>Ubah Keranjang</span>
                        </button>
                      )}
                    </div>
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
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(order)}
                          className="bg-white hover:bg-stone-50 text-[#8a5225] border border-[#8a5225]/30 px-3.5 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                          title="Ubah isi barang pesanan sebelum di-ACC"
                        >
                          <Edit3 size={14} /> Ubah Keranjang
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAcc(order.id)}
                          disabled={isPending}
                          className="bg-[#5a8514] hover:bg-[#486b10] text-white px-5 py-2 rounded-full text-xs font-bold transition shadow-md shadow-[#5a8514]/25 flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Check size={14} /> ACC &amp; Proses Pesanan
                        </button>
                      </div>
                    )}

                    {order.status === 'diproses' && (
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order.id, 'dikirim')}
                          disabled={isPending}
                          className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-full text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Truck size={14} /> Tandai Sedang Dikirim
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order.id, 'selesai')}
                          disabled={isPending}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
                          title="Tandai pesanan selesai dan otomatis kurangi stok produk dari database"
                        >
                          <PackageCheck size={14} /> Tandai Selesai (Kurangi Stok)
                        </button>
                      </div>
                    )}

                    {order.status === 'dikirim' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(order.id, 'selesai')}
                        disabled={isPending}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
                        title="Tandai pesanan selesai dan otomatis kurangi stok produk dari database"
                      >
                        <PackageCheck size={14} /> Tandai Selesai (Kurangi Stok)
                      </button>
                    )}

                    {order.status === 'selesai' && (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-100/80 border border-emerald-300">
                          <CheckCircle2 size={13} className="text-emerald-700" /> Selesai &amp; Stok Berkurang
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order.id, 'dibatalkan')}
                          disabled={isPending}
                          className="text-stone-400 hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer"
                          title="Batalkan pesanan ini dan kembalikan stok produk ke database"
                        >
                          Batal &amp; Kembalikan Stok
                        </button>
                      </div>
                    )}

                    {order.status === 'dibatalkan' && (
                      <button
                        type="button"
                        onClick={() => handleAcc(order.id)}
                        disabled={isPending}
                        className="text-stone-500 hover:text-[#5a8514] hover:bg-[#5a8514]/10 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer"
                      >
                        Aktifkan Kembali
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

      {/* Modal Edit Isi Keranjang */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-[#33241b]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#33241b]/10 my-8 flex flex-col max-h-[90vh] animate-scale-up font-body">
            
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-heading font-extrabold text-xl text-[#33241b]">
                    Ubah Keranjang: {editingOrder.id}
                  </span>
                  {getStatusBadge(editingOrder.status)}
                </div>
                <p className="text-xs text-stone-500">
                  Pemesan: <strong className="text-[#33241b]">{editingOrder.customer_name}</strong> ({editingOrder.customer_phone})
                </p>
              </div>
              <button 
                type="button"
                onClick={handleCloseEditModal}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition cursor-pointer"
                title="Tutup"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1">
              
              {/* Alert Tips */}
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs flex items-start gap-2.5">
                <Sparkles size={16} className="text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Sesuaikan jumlah barang, hapus item, atau tambah produk baru sesuai kesepakatan WhatsApp. Halaman pelacakan pesanan customer akan otomatis tersinkron seketika.
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Daftar Barang Pesanan ({editItems.length})
                </h4>

                {editItems.length === 0 ? (
                  <p className="text-xs text-rose-600 italic bg-rose-50 p-3 rounded-xl border border-rose-200">
                    Tidak ada barang di keranjang. Silakan tambahkan produk di bawah.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {editItems.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#fffaf5] rounded-2xl border border-stone-200/80 shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-white overflow-hidden border border-stone-200 shrink-0">
                            {item.image?.startsWith('/') || item.image?.startsWith('http') ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs flex items-center justify-center h-full">🌾</span>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#33241b] line-clamp-1">{item.name}</p>
                            <p className="text-[11px] text-stone-500">Rp {item.price.toLocaleString('id-ID')} / pcs</p>
                          </div>
                        </div>

                        {/* Quantity and Subtotal Controls */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center w-full sm:w-auto">
                          <div className="flex items-center border border-stone-300 rounded-full bg-white overflow-hidden">
                            <button
                              type="button"
                              onClick={() => handleUpdateItemQty(idx, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-[#33241b]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateItemQty(idx, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-100 cursor-pointer"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <div className="text-right min-w-[90px]">
                            <span className="text-xs font-bold text-[#8a5225]">
                              Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Hapus barang ini dari pesanan"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Product From Catalog */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#33241b]">
                  <PackagePlus size={15} className="text-[#8a5225]" />
                  <span>Tambah Produk dari Katalog Toko</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#33241b] focus:outline-none focus:ring-2 focus:ring-[#8a5225]"
                  >
                    <option value="">-- Pilih Produk Tambahan --</option>
                    {productList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} - Rp {p.price.toLocaleString('id-ID')} (Tersedia: {p.stock ?? 50})
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={999}
                      value={selectedProductQty}
                      onChange={(e) => setSelectedProductQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 bg-white border border-stone-300 rounded-xl px-2.5 py-2 text-xs text-center font-bold text-[#33241b] focus:outline-none focus:ring-2 focus:ring-[#8a5225]"
                      placeholder="Qty"
                    />
                    <button
                      type="button"
                      onClick={handleAddNewItem}
                      disabled={!selectedProductId}
                      className="bg-[#8a5225] hover:bg-[#733f1b] disabled:opacity-40 disabled:hover:bg-[#8a5225] text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Plus size={14} /> Tambahkan
                    </button>
                  </div>
                </div>
              </div>

              {/* Edit Customer Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
                  Catatan Pesanan / Kesepakatan WA (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Contoh: Ada tambahan produk via WA dan ganti varian"
                  className="w-full bg-[#fffaf5] border border-stone-200 rounded-2xl p-3 text-xs text-[#33241b] focus:outline-none focus:ring-2 focus:ring-[#8a5225]"
                />
              </div>

              {/* Total Calculation Preview */}
              <div className="p-4 bg-[#fffaf5] rounded-2xl border border-[#8a5225]/20 space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal Barang:</span>
                  <span className="font-semibold">Rp {editSubtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Pajak (11%):</span>
                  <span className="font-semibold">Rp {editTax.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-[#33241b] font-bold text-sm pt-2 border-t border-stone-200">
                  <span>Total Baru Pesanan:</span>
                  <span className="text-[#8a5225] font-extrabold text-base">
                    Rp {editTotal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-stone-100 flex justify-end items-center gap-2.5">
              <button
                type="button"
                onClick={handleCloseEditModal}
                disabled={isPending}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isPending || editItems.length === 0}
                className="bg-[#5a8514] hover:bg-[#486b10] disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-[#5a8514]/25 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                {isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Simpan Perubahan Pesanan</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
