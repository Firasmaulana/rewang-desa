"use server";

import { createClientServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateBanner(formData: FormData): Promise<{ success: boolean }> {
  const tagline = formData.get('tagline') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const buttonText = formData.get('buttonText') as string;
  const buttonLink = (formData.get('buttonLink') as string) || '/shop';
  const imageText = (formData.get('imageText') as string) || '📦';
  const isActive = formData.get('isActive') === 'on' || formData.get('isActive') === 'true';

  const supabase = await createClientServer();
  if (!supabase) {
    throw new Error('Supabase belum dikonfigurasi di Environment Variables Vercel atau .env.local');
  }

  const { error } = await supabase
    .from('banners')
    .upsert({
      id: 'main-banner',
      tagline,
      title,
      description,
      button_text: buttonText,
      button_link: buttonLink,
      image_text: imageText,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

  if (error) {
    console.error('Error updating banner:', error);
    throw new Error(error.message);
  }

  revalidatePath('/');
  revalidatePath('/admin/banner');
  return { success: true };
}
