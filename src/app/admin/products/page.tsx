import { getProducts } from '@/lib/supabase/service';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import DeleteProductButton from '@/components/DeleteProductButton';

export default async function AdminProducts() {
  const products = await getProducts();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading text-[#33241b] mb-1">Manajemen Produk</h1>
          <p className="text-stone-500 text-sm">Kelola katalog produk, harga, dan stok yang terhubung ke toko utama.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="bg-[#8a5225] text-white font-semibold py-2.5 px-5 rounded-xl hover:bg-[#733f1b] transition flex items-center gap-2 shadow-sm text-sm"
        >
          <Plus size={18} /> Tambah Produk Baru
        </Link>
      </div>
      
      <div className="bg-white rounded-2xl border border-[#33241b]/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fffaf5] border-b border-[#33241b]/10 text-stone-500 text-xs uppercase tracking-wider font-body">
                <th className="p-4 font-bold">Produk</th>
                <th className="p-4 font-bold">Kategori</th>
                <th className="p-4 font-bold">Harga</th>
                <th className="p-4 font-bold">Stok</th>
                <th className="p-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-body text-sm">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-[#fffaf5]/50 transition">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#fffaf5] border border-[#33241b]/10 rounded-xl flex items-center justify-center shrink-0 text-base">
                      <span>{product.image}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-[#33241b] line-clamp-1">{product.name}</p>
                      {product.origin && (
                        <p className="text-xs text-stone-400">{product.origin}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-stone-600 text-xs font-semibold uppercase">{product.category}</td>
                  <td className="p-4 font-bold text-[#33241b]">Rp {product.price.toLocaleString('id-ID')}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-[#5a8514]/10 text-[#5a8514] font-bold rounded-full text-xs">
                      {product.stock ?? 50}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <DeleteProductButton productId={product.id} productName={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
