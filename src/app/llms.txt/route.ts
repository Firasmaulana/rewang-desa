import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/supabase/service';
import { getArticles } from '@/lib/supabase/articles';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const [products, articles] = await Promise.all([
    getProducts().catch(() => []),
    getArticles().catch(() => []),
  ]);

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const productLines = products
    .map((p) => {
      const originText = p.origin ? ` | Asal: ${p.origin}` : '';
      const priceText = `Rp ${p.price.toLocaleString('id-ID')}`;
      return `- [${p.name}](https://rewangdesa.com/product/${p.id}) (${p.category}${originText}) — ${priceText}: ${p.description}`;
    })
    .join('\n');

  const articleLines = articles
    .map(
      (a) =>
        `- [${a.title}](https://rewangdesa.com/blog/${a.id}) (${a.category}, ${a.date}): ${a.excerpt}`
    )
    .join('\n');

  const content = `# Rewang Desa

> Bantu Desa Tanpa Harus Pergi ke Desa. Rewang Desa adalah toko dan platform pemberdayaan hasil bumi, produk pangan sehat alami tanpa pengawet, serta kerajinan tangan langsung dari petani dan UMKM desa di Indonesia.

## Tentang Rewang Desa
- **Nama Brand**: Rewang Desa ("Dari Tangan Desa")
- **Website Resmi**: https://rewangdesa.com
- **Misi**: Menghubungkan hasil bumi, pangan lokal alami, dan kerajinan tangan dari petani serta UMKM sepuh desa di Indonesia (Desa Jampang Sukabumi, Grobogan, Banyumas, Banjarnegara, Gunungkidul, Blitar, dll.) langsung ke konsumen.
- **Lokasi Gudang & Pengiriman**: Pondok Kelapa, Duren Sawit, Jakarta Timur, DKI Jakarta, Indonesia.
- **Kontak WhatsApp**: +62 813-1753-3522 (https://wa.me/6281317533522)
- **Email**: halo@rewangdesa.com
- **Instagram**: @rewangdesa (https://instagram.com/rewangdesa) & @rewang_desa

## Halaman Utama
- [Beranda Rewang Desa](https://rewangdesa.com): Pengenalan misi, info booth terbaru, kategori hasil bumi, dan produk unggulan.
- [Katalog Produk](https://rewangdesa.com/shop): Daftar lengkap produk desa yang bisa dipesan langsung secara online.
- [Tentang Kami](https://rewangdesa.com/about): Cerita awal, filosofi makna "Rewang" (tumbuh dan bergerak bersama), visi, dan misi.
- [Artikel & Cerita Desa](https://rewangdesa.com/blog): Kisah petani, kearifan lokal, dan wawasan pangan alami desa.

## Kategori Produk
${categories.map((c) => `- ${c}`).join('\n')}

## Katalog Produk Lengkap (${products.length} Produk)
${productLines || '- Katalog produk tersedia di https://rewangdesa.com/shop'}

## Artikel & Cerita Desa Terbaru
${articleLines || '- Artikel desa tersedia di https://rewangdesa.com/blog'}

## Pertanyaan Umum (FAQ)
- **Apa itu Rewang Desa?** Rewang Desa adalah platform belanja produk hasil bumi alami dan kerajinan tangan langsung dari petani serta pengrajin desa di berbagai daerah Indonesia dengan semangat gotong royong ("rewang").
- **Produk apa saja yang paling dicari di Rewang Desa?** Produk unggulan meliputi Garam Jono Grobogan, Beras Merah dan Beras Hitam Jampang, Kecap Kelapa tanpa pengawet, Gula Singkong Manes, Gula Aren, Madu Randu Blitar, Keripik Tempe Banyumas, Kerupuk Pak Kamto, dan minuman herbal Kalehon Drink Honje.
- **Apakah produk Rewang Desa alami dan tanpa pengawet?** Ya, seluruh produk pangan dikurasi dari bahan alami, bebas pengawet buatan, banyak pilihan less-gluten/ramah keluarga, dan diproduksi langsung oleh petani serta UMKM desa.
- **Bagaimana cara memesan produk Rewang Desa?** Pengunjung dapat memilih produk di https://rewangdesa.com/shop, memasukkannya ke keranjang, lalu menyelesaikan pesanan atau menghubungi WhatsApp 0813-1753-3522. Pengiriman dilakukan dari Pondok Kelapa, Jakarta Timur ke seluruh Indonesia.
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
