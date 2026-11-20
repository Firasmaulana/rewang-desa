"use server";

import { createClientServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProduct(formData: FormData): Promise<void> {
  const name = formData.get('name') as string;
  const category = formData.get('category') as string;
  const price = Number(formData.get('price')) || 0;
  const originalPriceRaw = formData.get('originalPrice');
  const originalPrice = originalPriceRaw ? Number(originalPriceRaw) : null;
  const stock = Number(formData.get('stock')) || 50;
  const origin = (formData.get('origin') as string) || 'Nusantara';
  const description = (formData.get('description') as string) || '';
  const image = (formData.get('image') as string) || '🌾 ' + name;
  const badge = (formData.get('badge') as string) || null;

  const supabase = await createClientServer();
  if (!supabase) {
    console.warn('Supabase belum dikonfigurasi. Data tidak tersimpan ke remote.');
    redirect('/admin/products');
  }

  // Generate unique ID based on timestamp
  const id = String(Date.now());

  const { error } = await supabase.from('products').insert({
    id,
    name,
    category,
    price,
    original_price: originalPrice,
    stock,
    origin,
    description,
    image,
    badge,
    is_discounted: originalPrice ? originalPrice > price : false,
    rating: 5.0,
  });

  if (error) {
    console.error('Error inserting product:', error);
    return;
  }

  revalidatePath('/');
  revalidatePath('/shop');
  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export async function updateProduct(formData: FormData): Promise<void> {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const category = formData.get('category') as string;
  const price = Number(formData.get('price')) || 0;
  const originalPriceRaw = formData.get('originalPrice');
  const originalPrice = originalPriceRaw ? Number(originalPriceRaw) : null;
  const stock = Number(formData.get('stock')) || 50;
  const origin = (formData.get('origin') as string) || 'Nusantara';
  const description = (formData.get('description') as string) || '';
  const image = (formData.get('image') as string) || '🌾 ' + name;
  const badge = (formData.get('badge') as string) || null;

  const supabase = await createClientServer();
  if (!supabase) {
    console.warn('Supabase belum dikonfigurasi. Data tidak tersimpan ke remote.');
    redirect('/admin/products');
  }

  const { error } = await supabase
    .from('products')
    .update({
      name,
      category,
      price,
      original_price: originalPrice,
      stock,
      origin,
      description,
      image,
      badge,
      is_discounted: originalPrice ? originalPrice > price : false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating product:', error);
    throw new Error(error.message);
  }

  revalidatePath('/');
  revalidatePath('/shop');
  revalidatePath('/admin/products');
  revalidatePath(`/product/${id}`);
  redirect('/admin/products');
}

export async function deleteProduct(id: string) {
  const supabase = await createClientServer();
  if (!supabase) {
    return { error: 'Supabase belum dikonfigurasi' };
  }

  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    return { error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/shop');
  revalidatePath('/admin/products');
  return { success: true };
}
