import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold text-stone-900 mb-8">Ikhtisar Dasbor</h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-stone-500 uppercase tracking-wider">Pendapatan</p>
            <h3 className="text-2xl font-extrabold text-stone-900">Rp 12.5M</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-lime-100 text-lime-700 flex items-center justify-center shrink-0">
            <ShoppingBag size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-stone-500 uppercase tracking-wider">Pesanan</p>
            <h3 className="text-2xl font-extrabold text-stone-900">142</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Package size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-stone-500 uppercase tracking-wider">Total Produk</p>
            <h3 className="text-2xl font-extrabold text-stone-900">8</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-stone-500 uppercase tracking-wider">Pelanggan</p>
            <h3 className="text-2xl font-extrabold text-stone-900">1,024</h3>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
           <h3 className="text-lg font-bold text-stone-900 mb-6">Pesanan Terbaru</h3>
           <div className="flex flex-col gap-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="flex justify-between items-center pb-4 border-b border-stone-100 last:border-0 last:pb-0">
                 <div>
                   <p className="font-bold text-stone-800">ORD-00{i}</p>
                   <p className="text-sm text-stone-500">Budi Santoso - 2 item</p>
                 </div>
                 <div className="text-right">
                   <p className="font-bold text-amber-900">Rp 125.000</p>
                   <span className="text-xs font-bold px-2 py-1 bg-lime-100 text-lime-700 rounded">Selesai</span>
                 </div>
               </div>
             ))}
           </div>
        </div>
        
        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
           <h3 className="text-lg font-bold text-stone-900 mb-6">Stok Menipis</h3>
           <div className="flex flex-col gap-4">
             <div className="flex justify-between items-center pb-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center text-xs">Img</div>
                  <div>
                    <p className="font-bold text-stone-800">Jahe Merah Bubuk</p>
                    <p className="text-sm text-stone-500">Rempah Tradisional</p>
                  </div>
                </div>
                <div className="text-right">
                   <span className="text-sm font-bold px-3 py-1 bg-rose-100 text-rose-700 rounded-full">Sisa 3</span>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

