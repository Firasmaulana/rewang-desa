import { createClientServer } from './server';
import { products as fallbackProducts, Product } from '@/data/products';
import { DatabaseProduct, DatabaseBanner } from './types';

// Map database row to app Product format
function mapDbProduct(row: DatabaseProduct): Product {
  return {
    id: String(row.id),
    name: row.name,
    category: row.category,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    rating: Number(row.rating) || 5.0,
    image: row.image || '/products/garam-jono.webp',
    isDiscounted: Boolean(row.is_discounted),
    badge: row.badge || undefined,
    origin: row.origin || undefined,
    description: row.description || '',
    stock: row.stock !== undefined ? Number(row.stock) : 50,
  };
}

// 1. Fetch All Products (with seamless fallback if Supabase not configured or on network error)
export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = await createClientServer();
    if (!supabase) return fallbackProducts;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return fallbackProducts;
    }

    return (data as DatabaseProduct[]).map(mapDbProduct);
  } catch (err) {
    console.error('Supabase getProducts error:', err);
    return fallbackProducts;
  }
}

// 2. Fetch Single Product
export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const supabase = await createClientServer();
    if (!supabase) return fallbackProducts.find((p) => p.id === id);

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return fallbackProducts.find((p) => p.id === id);
    }

    return mapDbProduct(data as DatabaseProduct);
  } catch (err) {
    console.error('Supabase getProductById error:', err);
    return fallbackProducts.find((p) => p.id === id);
  }
}

// 3. Fetch Promo Banner
export async function getBanner(): Promise<DatabaseBanner> {
  const fallbackBanner: DatabaseBanner = {
    id: 'main-banner',
    tagline: 'Program Dukung Petani',
    title: 'Paket Rewang Tani Bulanan',
    description: 'Bantu petani dengan langganan paket ini tiap bulan! Berisi 2 kg Beras Merah Sukabumi, 1 btl Kecap Kelapa, 1 btl Garam Jono, dan 1 pack Gula Kelapa murni.',
    button_text: 'Langganan Paket Tani',
    button_link: '/product/11',
    image_text: '/products/tas-anyam-banyumas-custom-hampers-2.webp',
    is_active: true,
  };

  try {
    const supabase = await createClientServer();
    if (!supabase) return fallbackBanner;

    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('id', 'main-banner')
      .single();

    if (error || !data) {
      return fallbackBanner;
    }

    return data as DatabaseBanner;
  } catch (err) {
    console.error('Supabase getBanner error:', err);
    return fallbackBanner;
  }
}
