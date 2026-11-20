import { getBanner } from '@/lib/supabase/service';
import AdminBannerForm from '@/components/AdminBannerForm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminBanner() {
  const banner = await getBanner();

  return (
    <div className="max-w-4xl mx-auto font-body">
      <div className="mb-8">
        <h1 className="text-3xl font-heading text-[#33241b] mb-1">Banner Promo Beranda</h1>
        <p className="text-stone-500 text-sm">Sesuaikan pesan kampanye dukungan petani yang tampil di halaman depan website.</p>
      </div>

      <AdminBannerForm initialBanner={banner} />
    </div>
  );
}
