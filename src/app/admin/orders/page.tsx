import { getOrders } from '@/lib/supabase/orders';
import AdminOrdersClient from '@/components/AdminOrdersClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Kelola Pesanan - Admin Rewang Desa',
  description: 'Kelola dan konfirmasi pesanan masuk dari pelanggan.',
};

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return <AdminOrdersClient initialOrders={orders} />;
}
