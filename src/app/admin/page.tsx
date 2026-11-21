import { Package, ShoppingBag, Users, DollarSign, Clock, ArrowRight } from 'lucide-react';
import { getProducts } from '@/lib/supabase/service';
import { getOrders } from '@/lib/supabase/orders';
import Link from 'next/link';

export default async function AdminDashboard() {
  const [products, orders] = await Promise.all([
    getProducts(),
    getOrders(),
  ]);
  const lowStockProducts = products.filter(p => (p.stock ?? 50) <= 25).slice(0, 4);
  const pendingOrders = orders.filter(o => o.status === 'menunggu_konfirmasi');
  const recentOrders = orders.slice(0, 4);
  const totalRevenue = orders
    .filter(o => o.status !== 'dibatalkan')
    .reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="max-w-6xl mx-auto font-body">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading text-[#33241b] mb-1">Ikhtisar Dasbor</h1>
          <p className="text-stone-500 text-sm">Ringkasan aktivitas toko dan inventaris hasil bumi Rewang Desa.</p>
        </div>
        <Link 
          href="/admin/products"
          className="text-xs font-semibold text-[#8a5225] hover:text-[#733f1b] bg-[#8a5225]/10 px-4 py-2 rounded-xl transition"
        >
          Kelola Produk &rarr;
        </Link>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-white p-6 rounded-2xl border border-[#33241b]/10 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-amber-100 text-[#8a5225] flex items-center justify-center shrink-0">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Pendapatan</p>
            <h3 className="text-2xl font-extrabold text-[#33241b]">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#33241b]/10 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-[#5a8514]/15 text-[#5a8514] flex items-center justify-center shrink-0">
            <ShoppingBag size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Pesanan</p>
            <h3 className="text-2xl font-extrabold text-[#33241b]">{orders.length}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#33241b]/10 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-[#ffdd7d]/40 text-[#8a5225] flex items-center justify-center shrink-0">
            <Package size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Produk</p>
            <h3 className="text-2xl font-extrabold text-[#33241b]">{products.length}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#33241b]/10 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <Users size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Sahabat Rewang</p>
            <h3 className="text-2xl font-extrabold text-[#33241b]">1,240</h3>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-[#33241b]/10 shadow-sm">
           <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-2">
               <h3 className="text-base font-bold text-[#33241b] font-heading">Pesanan Terbaru</h3>
               {pendingOrders.length > 0 && (
                 <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300 animate-pulse">
                   {pendingOrders.length} Butuh ACC
                 </span>
               )}
             </div>
             <Link href="/admin/orders" className="text-xs font-semibold text-[#8a5225] hover:underline flex items-center gap-1">
               Lihat Semua <ArrowRight size={13} />
             </Link>
           </div>

           <div className="flex flex-col gap-4">
             {recentOrders.length === 0 ? (
               <p className="text-xs text-stone-400 py-4 text-center">Belum ada pesanan.</p>
             ) : (
               recentOrders.map(order => (
                 <div key={order.id} className="flex justify-between items-center pb-4 border-b border-stone-100 last:border-0 last:pb-0">
                   <div>
                     <p className="font-bold text-stone-800 text-sm">{order.id}</p>
                     <p className="text-xs text-stone-500">{order.customer_name} • {order.items.length} produk</p>
                   </div>
                   <div className="text-right">
                     <p className="font-bold text-[#8a5225] text-sm">Rp {order.total.toLocaleString('id-ID')}</p>
                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                       order.status === 'selesai' 
                         ? 'bg-[#5a8514]/10 text-[#5a8514]' 
                         : order.status === 'menunggu_konfirmasi'
                         ? 'bg-amber-100 text-amber-800 border border-amber-300'
                         : 'bg-sky-100 text-sky-800'
                     }`}>
                       {order.status === 'menunggu_konfirmasi' ? 'Menunggu ACC' : order.status}
                     </span>
                   </div>
                 </div>
               ))
             )}
           </div>
        </div>
        
        <div className="bg-white p-8 rounded-2xl border border-[#33241b]/10 shadow-sm">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-base font-bold text-[#33241b] font-heading">Inventaris Produk</h3>
             <span className="text-xs text-stone-400">Total {products.length} terdaftar</span>
           </div>
           <div className="flex flex-col gap-4">
             {lowStockProducts.length > 0 ? (
               lowStockProducts.map(product => (
                 <div key={product.id} className="flex justify-between items-center pb-4 border-b border-stone-100 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#fffaf5] border border-stone-200 rounded-lg flex items-center justify-center text-sm">
                        {product.image}
                      </div>
                      <div>
                        <p className="font-bold text-stone-800 text-sm">{product.name}</p>
                        <p className="text-xs text-stone-500">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-[#8a5225] border border-[#8a5225]/20 rounded-full">
                         Stok: {product.stock ?? 50}
                       </span>
                    </div>
                 </div>
               ))
             ) : (
               <p className="text-stone-400 text-xs py-4 text-center">Semua stok produk dalam kondisi aman.</p>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
