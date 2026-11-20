"use server";

import { createClientServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateBanner(formData: FormData): Promise<void> {
  const tagline = formData.get('tagline') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const buttonText = formData.get('buttonText') as string;

  const supabase = await createClientServer();
  if (!supabase) {
    console.warn('Supabase belum dikonfigurasi');
    redirect('/admin/banner?error=Supabase%20belum%20dikonfigurasi%20di%20Environment%20Variables%20Vercel%20atau%20.env.local');
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
    }, { onConflict: 'id' });

  if (error) {
    console.error('Error updating banner:', error);
    redirect(`/admin/banner?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/');
  revalidatePath('/admin/banner');
  redirect('/admin/banner?success=true');
}
