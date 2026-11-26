"use server";

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { DatabaseOrder, OrderStatus, OrderItem } from '@/lib/supabase/types';
import { createOrderRecord, updateOrderStatusRecord, updateOrderItemsRecord } from '@/lib/supabase/orders';

// 1. Submit Order & Store Order ID in Customer's Cookie
export async function submitOrder(orderData: Omit<DatabaseOrder, 'created_at' | 'updated_at'>): Promise<{ success: boolean; orderId: string }> {
  const newOrder: DatabaseOrder = {
    ...orderData,
    status: orderData.status || 'menunggu_konfirmasi',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  await createOrderRecord(newOrder);

  // Save order ID to customer's cookie for persistent tracking without login
  try {
    const cookieStore = await cookies();
    const existingOrdersCookie = cookieStore.get('rewang_order_ids')?.value;
    let orderIds: string[] = [];

    if (existingOrdersCookie) {
      try {
        orderIds = JSON.parse(existingOrdersCookie);
      } catch {
        orderIds = [];
      }
    }

    if (!orderIds.includes(newOrder.id)) {
      orderIds.unshift(newOrder.id);
    }

    // Keep up to 20 recent orders in cookie for 1 year
    orderIds = orderIds.slice(0, 20);

    cookieStore.set('rewang_order_ids', JSON.stringify(orderIds), {
      path: '/',
      maxAge: 365 * 24 * 60 * 60, // 1 year
      httpOnly: false, // Accessible by client JS as well
      sameSite: 'lax',
    });
  } catch (err) {
    console.error('Error saving order cookie:', err);
  }

  revalidatePath('/pesanan');
  revalidatePath('/admin');
  revalidatePath('/admin/orders');

  return { success: true, orderId: newOrder.id };
}

// 2. Admin ACC / Konfirmasi Pesanan
export async function accOrder(orderId: string): Promise<{ success: boolean }> {
  const result = await updateOrderStatusRecord(orderId, 'diproses');
  revalidatePath('/pesanan');
  revalidatePath('/admin');
  revalidatePath('/admin/orders');
  return { success: result.success };
}

// 3. Admin Update Status (Dikirim / Selesai / Dibatalkan)
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<{ success: boolean }> {
  const result = await updateOrderStatusRecord(orderId, status);
  revalidatePath('/pesanan');
  revalidatePath('/admin');
  revalidatePath('/admin/orders');
  revalidatePath('/admin/products');
  revalidatePath('/shop');
  revalidatePath('/');
  revalidatePath('/product/[id]', 'page');
  return { success: result.success };
}

// 4. Admin Update Items / Keranjang (Sebelum ACC atau Negosiasi WA)
export async function updateOrderItems(
  orderId: string,
  items: OrderItem[],
  subtotal: number,
  tax: number,
  total: number,
  notes?: string | null
): Promise<{ success: boolean; error?: string }> {
  const result = await updateOrderItemsRecord(orderId, items, subtotal, tax, total, notes);
  revalidatePath('/pesanan');
  revalidatePath('/admin');
  revalidatePath('/admin/orders');
  return { success: result.success, error: result.error };
}
