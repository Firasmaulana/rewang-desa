import { createClientServer } from './server';
import { DatabaseOrder, OrderStatus } from './types';

// In-memory fallback if Supabase table is not yet created or connection is offline
let localOrdersFallback: DatabaseOrder[] = [
  {
    id: 'RD-1082',
    customer_name: 'Budi Santoso',
    customer_phone: '081234567890',
    customer_address: 'Jl. Pemuda No. 45, Semarang',
    notes: 'Kirim saat jam kerja',
    items: [
      { productId: '5', name: 'Gula Aren Bulat Tradisional', price: 25000, quantity: 1, image: '/products/gula-aren-bulat.webp' },
      { productId: '6', name: 'Beras Ubi Ungu Alami', price: 45000, quantity: 1, image: '/products/beras-ubi-ungu.webp' },
    ],
    subtotal: 70000,
    tax: 7700,
    total: 77700,
    status: 'selesai',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
  {
    id: 'RD-1081',
    customer_name: 'Siti Rahmawati',
    customer_phone: '085712345678',
    customer_address: 'Perumahan Griya Asri Blok C-12, Purwokerto',
    notes: 'Tolong packing ekstra rapi',
    items: [
      { productId: '34', name: 'Paket Rewang Tani (Langganan Bulanan)', price: 110000, quantity: 1, image: '/products/tas-anyam-banyumas-custom-hampers-2.webp' },
    ],
    subtotal: 110000,
    tax: 12100,
    total: 122100,
    status: 'diproses',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

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
      console.warn('Supabase getOrders fallback:', error?.message);
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

    if (error || !data) {
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

    if (error || !data) {
      return localOrdersFallback.filter((o) => o.customer_phone.replace(/\D/g, '').includes(cleanPhone));
    }

    return data as DatabaseOrder[];
  } catch (err) {
    console.error('Error fetching orders by phone:', err);
    return [];
  }
}

// 5. Create Order
export async function createOrderRecord(order: DatabaseOrder): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClientServer();
    if (!supabase) {
      localOrdersFallback.unshift(order);
      return { success: true };
    }

    const { error } = await supabase.from('orders').insert([order]);
    if (error) {
      console.warn('Supabase insert order error, storing in fallback:', error.message);
      localOrdersFallback.unshift(order);
      return { success: true };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Create order error:', err);
    localOrdersFallback.unshift(order);
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
    if (!supabase) {
      const idx = localOrdersFallback.findIndex((o) => o.id === orderId);
      if (idx !== -1) {
        localOrdersFallback[idx].status = status;
        localOrdersFallback[idx].updated_at = new Date().toISOString();
      }
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
      console.error('Supabase update order status error:', error.message);
      // update fallback
      const idx = localOrdersFallback.findIndex((o) => o.id === orderId);
      if (idx !== -1) {
        localOrdersFallback[idx].status = status;
        localOrdersFallback[idx].updated_at = new Date().toISOString();
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Update order status error:', err);
    return { success: false, error: err?.message };
  }
}
