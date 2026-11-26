"use server";

import { createClientServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { DatabaseBanner } from '@/lib/supabase/types';

export interface BannerPayload {
  tagline: string;
  title: string;
  description: string;
  button_text?: string;
  button_link?: string;
  image_text: string;
  is_active: boolean;
}

// 1. Create a new Info Banner slide
export async function createBanner(
  payload: BannerPayload
): Promise<{ success: boolean; banner?: DatabaseBanner; error?: string }> {
  const supabase = await createClientServer();
  if (!supabase) {
    return { success: false, error: 'Supabase belum dikonfigurasi di .env.local' };
  }

  const newBanner: DatabaseBanner = {
    id: `banner-${Date.now()}`,
    tagline: payload.tagline.trim() || 'Info Rewang Desa',
    title: payload.title.trim(),
    description: payload.description.trim(),
    button_text: payload.button_text?.trim() || '',
    button_link: payload.button_link?.trim() || '',
    image_text: payload.image_text.trim() || '/hero-background.webp',
    is_active: payload.is_active,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('banners').insert([newBanner]);

  if (error) {
    console.error('Error creating banner:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/admin/banner');
  return { success: true, banner: newBanner };
}

// 2. Update an existing Info Banner slide by ID
export async function updateBannerById(
  id: string,
  payload: BannerPayload
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClientServer();
  if (!supabase) {
    return { success: false, error: 'Supabase belum dikonfigurasi di .env.local' };
  }

  const { error } = await supabase
    .from('banners')
    .update({
      tagline: payload.tagline.trim() || 'Info Rewang Desa',
      title: payload.title.trim(),
      description: payload.description.trim(),
      button_text: payload.button_text?.trim() || '',
      button_link: payload.button_link?.trim() || '',
      image_text: payload.image_text.trim() || '/hero-background.webp',
      is_active: payload.is_active,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating banner:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/admin/banner');
  return { success: true };
}

// 3. Toggle active status quickly
export async function toggleBannerActive(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClientServer();
  if (!supabase) {
    return { success: false, error: 'Supabase belum dikonfigurasi' };
  }

  const { error } = await supabase
    .from('banners')
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Error toggling banner:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/admin/banner');
  return { success: true };
}

// 4. Delete a Banner slide
export async function deleteBanner(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClientServer();
  if (!supabase) {
    return { success: false, error: 'Supabase belum dikonfigurasi' };
  }

  const { error } = await supabase.from('banners').delete().eq('id', id);

  if (error) {
    console.error('Error deleting banner:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/admin/banner');
  return { success: true };
}

// Legacy single-banner update (retained for backward compatibility)
export async function updateBanner(formData: FormData): Promise<{ success: boolean }> {
  const id = (formData.get('id') as string) || 'main-banner';
  const res = await updateBannerById(id, {
    tagline: (formData.get('tagline') as string) || '',
    title: (formData.get('title') as string) || '',
    description: (formData.get('description') as string) || '',
    button_text: (formData.get('buttonText') as string) || '',
    button_link: (formData.get('buttonLink') as string) || '',
    image_text: (formData.get('imageText') as string) || '/hero-background.webp',
    is_active: formData.get('isActive') === 'on' || formData.get('isActive') === 'true',
  });
  if (!res.success) {
    throw new Error(res.error || 'Gagal menyimpan banner');
  }
  return { success: true };
}
