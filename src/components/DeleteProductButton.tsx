"use client";

import { useTransition } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteProduct } from '@/actions/products';

export default function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(`Apakah Anda yakin ingin menghapus "${productName}" dari katalog?`)) {
      startTransition(async () => {
        const result = await deleteProduct(productId);
        if (result?.error) {
          alert(`Gagal menghapus: ${result.error}`);
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition disabled:opacity-50"
      title="Hapus Produk"
    >
      {isPending ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
    </button>
  );
}
