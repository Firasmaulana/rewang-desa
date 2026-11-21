import { Suspense } from 'react';
import { getProducts } from '@/lib/supabase/service';
import ShopCatalog from '@/components/ShopCatalog';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Katalog Produk - Rewang Desa',
  description: 'Daftar produk alami dan kerajinan tangan dari desa binaan Rewang Desa.',
};

export default async function Shop() {
  const products = await getProducts();

  return (
    <div className="bg-[#fffaf5] py-12 min-h-screen">
      <div className="container mx-auto px-4">
        <Suspense fallback={<div className="py-24 text-center text-stone-500 font-body">Memuat katalog produk...</div>}>
          <ShopCatalog initialProducts={products} />
        </Suspense>
      </div>
    </div>
  );
}
