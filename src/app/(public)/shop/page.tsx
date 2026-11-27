import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getProducts } from '@/lib/supabase/service';
import ShopCatalog from '@/components/ShopCatalog';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Katalog Produk Desa Alami & Kerajinan Tangan',
  description:
    'Belanja produk pangan alami tanpa pengawet langsung dari petani desa: Garam Jono Grobogan, Beras Merah Jampang, Kecap Kelapa, Gula Singkong Manes, Madu Randu, Keripik Tempe, dan aneka kerajinan desa.',
  alternates: {
    canonical: '/shop',
  },
  openGraph: {
    url: 'https://rewangdesa.com/shop',
    title: 'Katalog Produk Desa Alami & Kerajinan Tangan | Rewang Desa',
    description:
      'Daftar lengkap hasil bumi, bahan pangan alami tanpa pengawet, dan kerajinan tangan langsung dari petani serta UMKM desa Indonesia.',
  },
};

export default async function Shop() {
  const products = await getProducts();

  const catalogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Katalog Produk Rewang Desa',
    url: 'https://rewangdesa.com/shop',
    description:
      'Katalog lengkap hasil bumi alami tanpa pengawet dan kerajinan tangan petani serta UMKM desa binaan Rewang Desa.',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://rewangdesa.com/product/${product.id}`,
        name: product.name,
      })),
    },
  };

  return (
    <div className="bg-[#fffaf5] py-12 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogJsonLd) }}
      />
      <div className="container mx-auto px-4">
        <Suspense fallback={<div className="py-24 text-center text-stone-500 font-body">Memuat katalog produk...</div>}>
          <ShopCatalog initialProducts={products} />
        </Suspense>
      </div>
    </div>
  );
}
