import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getProductById } from '@/lib/supabase/service';
import { notFound } from 'next/navigation';
import ProductForm from '@/components/ProductForm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto font-body">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 text-stone-500 hover:text-stone-900 transition">
          <ArrowLeft size={22} />
        </Link>
        <div>
          <h1 className="text-3xl font-heading text-[#33241b] mb-1">Edit Produk</h1>
          <p className="text-stone-500 text-sm">Perbarui informasi, harga, stok, atau foto produk &ldquo;{product.name}&rdquo;.</p>
        </div>
      </div>
      
      <ProductForm mode="edit" initialProduct={product} />
    </div>
  );
}
