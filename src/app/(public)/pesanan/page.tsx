import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { getOrdersByIds, getOrderById } from '@/lib/supabase/orders';
import OrderTrackingClient from '@/components/OrderTrackingClient';
import { DatabaseOrder } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Lacak Status Pesanan - Rewang Desa',
  description: 'Pantau status pesanan hasil bumi dan karya pengrajin desa Anda secara realtime.',
};

export default async function PesananPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const resolvedParams = await searchParams;
  const cookieStore = await cookies();
  const orderIdsCookie = cookieStore.get('rewang_order_ids')?.value;

  let cookieIds: string[] = [];
  if (orderIdsCookie) {
    try {
      cookieIds = JSON.parse(orderIdsCookie);
    } catch {
      cookieIds = [];
    }
  }

  // If specific ID in searchParams, add to list
  if (resolvedParams?.id && !cookieIds.includes(resolvedParams.id)) {
    cookieIds.unshift(resolvedParams.id);
  }

  let orders: DatabaseOrder[] = [];
  if (cookieIds.length > 0) {
    orders = await getOrdersByIds(cookieIds);
  }

  // If searchedId was passed but not in cookie list (e.g. direct link)
  if (resolvedParams?.id && !orders.some(o => o.id === resolvedParams.id)) {
    const single = await getOrderById(resolvedParams.id);
    if (single) {
      orders.unshift(single);
    }
  }

  return (
    <div className="bg-[#fffaf5] py-12 min-h-screen">
      <div className="container mx-auto px-4">
        <Suspense fallback={<div className="py-24 text-center text-stone-500 font-body">Memuat status pesanan...</div>}>
          <OrderTrackingClient initialOrders={orders} searchedId={resolvedParams?.id} />
        </Suspense>
      </div>
    </div>
  );
}
