"use server";

import { revalidatePath } from 'next/cache';
import { addSubscriberRecord, deleteSubscriberRecord } from '@/lib/supabase/subscribers';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function subscribeNewsletter(email: string): Promise<{
  success: boolean;
  alreadySubscribed?: boolean;
  message: string;
}> {
  const cleaned = (email || '').trim().toLowerCase();

  if (!cleaned || !EMAIL_REGEX.test(cleaned)) {
    return {
      success: false,
      message: 'Masukkan alamat email yang valid (contoh: nama@email.com).',
    };
  }

  const result = await addSubscriberRecord(cleaned);

  if (!result.success) {
    return {
      success: false,
      message: result.error || 'Terjadi kendala saat mendaftar. Silakan coba lagi.',
    };
  }

  revalidatePath('/admin/subscribers');
  revalidatePath('/admin');

  if (result.alreadySubscribed) {
    return {
      success: true,
      alreadySubscribed: true,
      message: 'Email ini sudah terdaftar di Kabar Desa. Terima kasih telah mendukung petani!',
    };
  }

  return {
    success: true,
    alreadySubscribed: false,
    message: 'Terima kasih! Email Anda berhasil terdaftar untuk menerima Kabar Desa.',
  };
}

export async function removeSubscriber(id: string): Promise<{ success: boolean; error?: string }> {
  const result = await deleteSubscriberRecord(id);
  revalidatePath('/admin/subscribers');
  revalidatePath('/admin');
  return result;
}
