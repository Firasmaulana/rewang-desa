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

// 3. Fetch All Banners (for multi-slide Info Carousel & Admin Manager)
const DEFAULT_BANNERS: DatabaseBanner[] = [
  {
    id: 'main-banner',
    tagline: 'Info Booth & Kegiatan',
    title: 'Kunjungi Booth Rewang Desa!',
    description:
      'Temukan aneka produk pangan alami, keripik renyah, minuman honje segar, dan kerajinan tangan desa secara langsung di gerai kami.',
    button_text: 'Lihat Katalog',
    button_link: '/shop',
    image_text: '/hero-background.webp',
    is_active: true,
  },
];

export async function getBanners(options?: { onlyActive?: boolean }): Promise<DatabaseBanner[]> {
  try {
    const supabase = await createClientServer();
    if (!supabase) {
      return options?.onlyActive
        ? DEFAULT_BANNERS.filter((b) => b.is_active)
        : DEFAULT_BANNERS;
    }

    let query = supabase
      .from('banners')
      .select('*')
      .order('updated_at', { ascending: false });

    if (options?.onlyActive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error || !data) {
      return options?.onlyActive
        ? DEFAULT_BANNERS.filter((b) => b.is_active)
        : DEFAULT_BANNERS;
    }

    return data as DatabaseBanner[];
  } catch (err) {
    console.error('Supabase getBanners error:', err);
    return options?.onlyActive
      ? DEFAULT_BANNERS.filter((b) => b.is_active)
      : DEFAULT_BANNERS;
  }
}

// 4. Fetch Single Promo Banner (retained for backward compatibility)
export async function getBanner(): Promise<DatabaseBanner> {
  const banners = await getBanners();
  return banners[0] || DEFAULT_BANNERS[0];
}
