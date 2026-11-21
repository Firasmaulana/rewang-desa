export interface DatabaseProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  original_price?: number | null;
  rating: number;
  image: string;
  is_discounted: boolean;
  badge?: string | null;
  origin?: string | null;
  description: string;
  stock?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DatabaseBanner {
  id: string;
  tagline: string;
  title: string;
  description: string;
  button_text: string;
  button_link: string;
  image_text: string;
  is_active: boolean;
  updated_at?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export type OrderStatus = 'menunggu_konfirmasi' | 'diproses' | 'dikirim' | 'selesai' | 'dibatalkan';

export interface DatabaseOrder {
  id: string; // e.g. "RD-82914"
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  notes?: string | null;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  created_at?: string;
  updated_at?: string;
}
