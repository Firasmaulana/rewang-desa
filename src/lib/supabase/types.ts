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
