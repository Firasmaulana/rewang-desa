import { products } from '@/data/products';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminProducts() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 mb-2">Manajemen Produk</h1>
          <p className="text-stone-500">Atur katalog produk, stok, dan harga.</p>
        </div>
        <Link href="/admin/products/new" className="bg-amber-800 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-900 transition flex items-center gap-2">
          <Plus size={20} /> Tambah Produk
        </Link>
      </div>
      
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-bold">Produk</th>
                <th className="p-4 font-bold">Kategori</th>
                <th className="p-4 font-bold">Harga</th>
                <th className="p-4 font-bold">Stok</th>
                <th className="p-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-stone-50 transition">
                  <td className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-xs text-stone-400">Img</span>
                    </div>
                    <div>
                      <p className="font-bold text-stone-800 line-clamp-1">{product.name}</p>
                    </div>
                  </td>
                  <td className="p-4 text-stone-600">{product.category}</td>
                  <td className="p-4 font-bold text-stone-800">Rp {product.price.toLocaleString('id-ID')}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-lime-100 text-lime-700 font-bold rounded-full text-sm">45</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Hapus">
                        <Trash2 size={18} />
                      </button>
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

