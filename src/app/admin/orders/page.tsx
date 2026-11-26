import { getOrders, checkOrdersTableConfigured } from '@/lib/supabase/orders';
import { getProducts } from '@/lib/supabase/service';
import AdminOrdersClient from '@/components/AdminOrdersClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Kelola Pesanan - Admin Rewang Desa',
  description: 'Kelola dan konfirmasi pesanan masuk dari pelanggan.',
};

export default async function AdminOrdersPage() {
  const [orders, tableCheck, products] = await Promise.all([
    getOrders(),
    checkOrdersTableConfigured(),
    getProducts(),
  ]);

  return (
    <AdminOrdersClient 
      initialOrders={orders} 
      isTableConfigured={tableCheck.configured} 
      tableError={tableCheck.error} 
      availableProducts={products}
    />
  );
}
