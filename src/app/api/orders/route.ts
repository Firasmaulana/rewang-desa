import { NextResponse } from 'next/server';
import { getOrdersByIds, getOrdersByPhone, getOrderById } from '@/lib/supabase/orders';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get('ids');
  const queryParam = searchParams.get('query');

  if (idsParam) {
    const ids = idsParam.split(',').map(s => s.trim()).filter(Boolean);
    const orders = await getOrdersByIds(ids);
    return NextResponse.json({ orders });
  }

  if (queryParam) {
    const q = queryParam.trim();
    // 1. Try search by Order ID
    const single = await getOrderById(q);
    if (single) {
      return NextResponse.json({ orders: [single] });
    }

    // 2. Try search by phone
    const byPhone = await getOrdersByPhone(q);
    return NextResponse.json({ orders: byPhone });
  }

  return NextResponse.json({ orders: [] });
}
