"use server";

import { createClientServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateBanner(formData: FormData): Promise<void> {
  const tagline = formData.get('tagline') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const buttonText = formData.get('buttonText') as string;

  const supabase = await createClientServer();
  if (!supabase) {
    console.warn('Supabase belum dikonfigurasi');
    return;
  }

  const { error } = await supabase
    .from('banners')
    .upsert({
      id: 'main-banner',
      tagline,
      title,
      description,
      button_text: buttonText,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error updating banner:', error);
    return;
  }

  revalidatePath('/');
  revalidatePath('/admin/banner');
}
