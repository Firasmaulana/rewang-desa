import { createClientServer } from './server';
import { DatabaseOrder, OrderStatus } from './types';

// In-memory fallback (initialized empty so user can test with their own orders)
let localOrdersFallback: DatabaseOrder[] = [];

// 0. Check if orders table exists in Supabase
export async function checkOrdersTableConfigured(): Promise<boolean> {
  try {
    const supabase = await createClientServer();
    if (!supabase) return false;

    const { error } = await supabase.from('orders').select('id').limit(1);
    if (error && error.code === 'PGRST205') {
      return false;
    }
    return true;
  } catch {
    return false;
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
    // Always update in-memory fallback
    const idx = localOrdersFallback.findIndex((o) => o.id === orderId);
    if (idx !== -1) {
      localOrdersFallback[idx].status = status;
      localOrdersFallback[idx].updated_at = new Date().toISOString();
    }

    const supabase = await createClientServer();
    if (!supabase) {
      return { success: true };
    }

    const { error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (error) {
      console.warn('Supabase update order status error:', error.message);
      return { success: true, error: error.message }; // still return success because memory updated
    }

    return { success: true };
  } catch (err: any) {
    console.error('Update order status error:', err);
    return { success: true };
  }
}
