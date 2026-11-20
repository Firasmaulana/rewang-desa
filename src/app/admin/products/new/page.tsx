import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProductForm from '@/components/ProductForm';

export default function AddProduct() {
  return (
    <div className="max-w-4xl mx-auto font-body">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 text-stone-500 hover:text-stone-900 transition">
          <ArrowLeft size={22} />
        </Link>
        <div>
          <h1 className="text-3xl font-heading text-[#33241b] mb-1">Tambah Produk Baru</h1>
          <p className="text-stone-500 text-sm">Masukkan detail produk dan foto hasil bumi desa untuk langsung ditampilkan di etalase toko.</p>
        </div>
      </div>
      
      <ProductForm mode="create" />
    </div>
  );
}
