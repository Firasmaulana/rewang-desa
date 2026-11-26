import { getBanners } from '@/lib/supabase/service';
import AdminBannersClient from '@/components/AdminBannersClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Kelola Banner Info - Admin Rewang Desa',
  description: 'Tambah, edit, aktifkan, atau hapus slide banner informasi singkat dan kegiatan booth Rewang Desa.',
};

export default async function AdminBannerPage() {
  const banners = await getBanners();

  return <AdminBannersClient initialBanners={banners} />;
}
