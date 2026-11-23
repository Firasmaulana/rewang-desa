import { createClientServer } from './server';
import { DatabaseOrder, OrderStatus, OrderItem } from './types';
import { products as fallbackProducts } from '@/data/products';

// In-memory fallback (initialized empty so user can test with their own orders)
let localOrdersFallback: DatabaseOrder[] = [];

// Helper to safely deduct or restore product stock
async function adjustProductStock(
  items: OrderItem[], 
  type: 'deduct' | 'restore', 
  supabase: any
) {
  if (!items || !Array.isArray(items) || items.length === 0) return;

  // Aggregate quantities by product to handle duplicate cart items cleanly
  const aggregated = new Map<string, { productId: string; name: string; quantity: number }>();
  for (const item of items) {
    if (!item) continue;
    const pid = String(item.productId || '');
    const name = item.name || '';
    const key = pid || name;
    if (!key) continue;

    const qty = Math.max(1, Number(item.quantity) || 1);
    if (aggregated.has(key)) {
      aggregated.get(key)!.quantity += qty;
    } else {
      aggregated.set(key, { productId: pid, name, quantity: qty });
    }
  }

  for (const item of Array.from(aggregated.values())) {
    const qty = item.quantity;
    const productId = item.productId;

    // 1. Update in Supabase products table if connected
    if (supabase) {
      try {
        let prodData: { id: string; stock?: number | null } | null = null;

        // Try lookup by ID first
        if (productId) {
          const { data, error } = await supabase
            .from('products')
            .select('id, stock')
            .eq('id', productId)
            .maybeSingle();

          if (!error && data) {
            prodData = data;
          }
        }

        // Fallback lookup by product name if ID didn't match
        if (!prodData && item.name) {
          const { data, error } = await supabase
            .from('products')
            .select('id, stock')
            .ilike('name', `%${item.name}%`)
            .limit(1)
            .maybeSingle();

          if (!error && data) {
            prodData = data;
          }
        }

        if (prodData) {
          const currentStock = prodData.stock !== undefined && prodData.stock !== null ? Number(prodData.stock) : 50;
          const newStock = type === 'deduct' 
            ? Math.max(0, currentStock - qty) 
            : currentStock + qty;

          const { error: updErr } = await supabase
            .from('products')
            .update({
              stock: newStock,
              updated_at: new Date().toISOString(),
            })
            .eq('id', prodData.id);

          if (updErr) {
            console.warn(`[Stock] Gagal update stok produk ${prodData.id} di Supabase:`, updErr.message);
          } else {
            console.log(`[Stock] Berhasil ${type === 'deduct' ? 'mengurangi' : 'mengembalikan'} stok produk ${prodData.id}: ${currentStock} -> ${newStock} (${type === 'deduct' ? '-' : '+'}${qty})`);
          }
        }
      } catch (err) {
        console.error(`[Stock] Error adjusting stock for product ${productId}:`, err);
      }
    }

    // 2. Also update in-memory fallbackProducts array
    try {
      let fbProd = fallbackProducts.find((p) => p.id === productId);
      if (!fbProd && item.name) {
        fbProd = fallbackProducts.find((p) => p.name.toLowerCase() === item.name.toLowerCase());
      }
      if (fbProd && fbProd.stock !== undefined) {
        fbProd.stock = type === 'deduct'
          ? Math.max(0, fbProd.stock - qty)
          : fbProd.stock + qty;
      }
    } catch {}
  }
}

// 0. Check if orders table exists and is accessible in Supabase
export async function checkOrdersTableConfigured(): Promise<{ configured: boolean; error?: string }> {
  try {
    const supabase = await createClientServer();
    if (!supabase) return { configured: false, error: 'Klien Supabase belum terkonfigurasi di env' };

    const { error } = await supabase.from('orders').select('id').limit(1);
    if (error) {
      console.warn('Orders table check error:', error.code, error.message);
      return { configured: false, error: error.message };
    }
    return { configured: true };
  } catch (err: any) {
    return { configured: false, error: err?.message };
  }
}

// 1. Get All Orders (for Admin)
export async function getOrders(): Promise<DatabaseOrder[]> {
  try {
    const supabase = await createClientServer();
    if (!supabase) return localOrdersFallback;

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return localOrdersFallback;
    }

    return data as DatabaseOrder[];
  } catch (err) {
    console.error('Error fetching orders:', err);
    return localOrdersFallback;
  }
}

// 2. Get Single Order by ID (for Customer Tracking)
export async function getOrderById(id: string): Promise<DatabaseOrder | null> {
  try {
    const supabase = await createClientServer();
    if (!supabase) {
      return localOrdersFallback.find((o) => o.id === id) || null;
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      return localOrdersFallback.find((o) => o.id === id) || null;
    }

    return data as DatabaseOrder;
  } catch (err) {
    console.error('Error fetching order by ID:', err);
    return localOrdersFallback.find((o) => o.id === id) || null;
  }
}

// 3. Get Orders by List of IDs (from Customer Cookies)
export async function getOrdersByIds(ids: string[]): Promise<DatabaseOrder[]> {
  if (!ids || ids.length === 0) return [];

  try {
    const supabase = await createClientServer();
    if (!supabase) {
      return localOrdersFallback.filter((o) => ids.includes(o.id));
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .in('id', ids)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return localOrdersFallback.filter((o) => ids.includes(o.id));
    }

    return data as DatabaseOrder[];
  } catch (err) {
    console.error('Error fetching orders by IDs:', err);
    return localOrdersFallback.filter((o) => ids.includes(o.id));
  }
}

// 4. Search Orders by Phone Number
export async function getOrdersByPhone(phone: string): Promise<DatabaseOrder[]> {
  const cleanPhone = phone.replace(/\D/g, '');
  if (!cleanPhone) return [];

  try {
    const supabase = await createClientServer();
    if (!supabase) {
      return localOrdersFallback.filter((o) => o.customer_phone.replace(/\D/g, '').includes(cleanPhone));
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .ilike('customer_phone', `%${cleanPhone}%`)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return localOrdersFallback.filter((o) => o.customer_phone.replace(/\D/g, '').includes(cleanPhone));
    }

    return data as DatabaseOrder[];
  } catch (err) {
    console.error('Error fetching orders by phone:', err);
    return localOrdersFallback.filter((o) => o.customer_phone.replace(/\D/g, '').includes(cleanPhone));
  }
}

// 5. Create Order
export async function createOrderRecord(order: DatabaseOrder): Promise<{ success: boolean; error?: string }> {
  try {
    // Always store in memory fallback
    const exists = localOrdersFallback.some(o => o.id === order.id);
    if (!exists) {
      localOrdersFallback.unshift(order);
    }

    const supabase = await createClientServer();
    if (!supabase) {
      return { success: true };
    }

    const { error } = await supabase.from('orders').insert([order]);
    if (error) {
      console.warn('Supabase insert order warning (using local fallback):', error.message);
      return { success: true, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Create order error:', err);
    return { success: true };
  }
}

// 6. Update Order Status (ACC / Proses / Selesai)
export async function updateOrderStatusRecord(
  orderId: string, 
  status: OrderStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClientServer();

    // 1. Find existing order before updating to detect previous status & items
    let existingOrder: DatabaseOrder | null = null;
    if (supabase) {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .maybeSingle();

      if (data) {
        existingOrder = data as DatabaseOrder;
      }
    }

    const localIdx = localOrdersFallback.findIndex((o) => o.id === orderId);
    if (!existingOrder && localIdx !== -1) {
      existingOrder = localOrdersFallback[localIdx];
    }

    const previousStatus = existingOrder?.status;

    // 2. Always update in-memory fallback
    if (localIdx !== -1) {
      localOrdersFallback[localIdx].status = status;
      localOrdersFallback[localIdx].updated_at = new Date().toISOString();
    }

    // 3. Update Supabase orders table
    if (supabase) {
      const { error } = await supabase
        .from('orders')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) {
        console.warn('Supabase update order status error:', error.message);
      }
    }

    // 4. Adjust product stock when transitioning to or from 'selesai'
    if (existingOrder && existingOrder.items) {
      const rawItems = existingOrder.items;
      const items: OrderItem[] = typeof rawItems === 'string' ? JSON.parse(rawItems) : (rawItems || []);

      // If status changed to 'selesai': DEDUCT stock
      if (status === 'selesai' && previousStatus !== 'selesai') {
        console.log(`[Order ${orderId}] Pesanan ditandai selesai. Memulai pengurangan stok produk...`);
        await adjustProductStock(items, 'deduct', supabase);
      }
      // If status reverted from 'selesai' to something else: RESTORE stock
      else if (previousStatus === 'selesai' && status !== 'selesai') {
        console.log(`[Order ${orderId}] Pesanan batal selesai (kembali ke ${status}). Memulihkan stok produk...`);
        await adjustProductStock(items, 'restore', supabase);
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error('Update order status error:', err);
    return { success: true };
  }
}
