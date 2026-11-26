import { getSubscribers, checkSubscribersTableConfigured } from '@/lib/supabase/subscribers';
import AdminSubscribersClient from '@/components/AdminSubscribersClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Pelanggan Kabar Desa - Admin Rewang Desa',
  description: 'Lihat, cari, salin, dan unduh daftar alamat email pelanggan Langganan Kabar Desa Rewang Desa.',
};

export default async function AdminSubscribersPage() {
  const [subscribers, tableCheck] = await Promise.all([
    getSubscribers(),
    checkSubscribersTableConfigured(),
  ]);

  return (
    <AdminSubscribersClient
      initialSubscribers={subscribers}
      isTableConfigured={tableCheck.configured}
      tableError={tableCheck.error}
    />
  );
}
