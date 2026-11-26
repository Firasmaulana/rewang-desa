import { createClientServer } from './server';
import { DatabaseSubscriber } from './types';

// In-memory fallback so admin & footer testing works immediately even before SQL table is created
let localSubscribersFallback: DatabaseSubscriber[] = [];

// 0. Check if subscribers table exists and is accessible in Supabase
export async function checkSubscribersTableConfigured(): Promise<{
  configured: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClientServer();
    if (!supabase) {
      return { configured: false, error: 'Klien Supabase belum terkonfigurasi di env' };
    }

    const { error } = await supabase.from('subscribers').select('id').limit(1);
    if (error) {
      return { configured: false, error: error.message };
    }
    return { configured: true };
  } catch (err: any) {
    return { configured: false, error: err?.message };
  }
}

// 1. Get All Subscribers (newest first)
export async function getSubscribers(): Promise<DatabaseSubscriber[]> {
  try {
    const supabase = await createClientServer();
    if (!supabase) return localSubscribersFallback;

    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return localSubscribersFallback;
    }

    return data as DatabaseSubscriber[];
  } catch (err) {
    console.error('Error fetching subscribers:', err);
    return localSubscribersFallback;
  }
}

// 2. Add Subscriber Email
export async function addSubscriberRecord(email: string): Promise<{
  success: boolean;
  alreadySubscribed?: boolean;
  subscriber?: DatabaseSubscriber;
  savedToCloud?: boolean;
  error?: string;
}> {
  const normalizedEmail = email.trim().toLowerCase();
  const newSub: DatabaseSubscriber = {
    id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    email: normalizedEmail,
    created_at: new Date().toISOString(),
  };

  try {
    const supabase = await createClientServer();

    if (supabase) {
      // Check if already exists in Supabase
      const { data: existing, error: checkError } = await supabase
        .from('subscribers')
        .select('id, email, created_at')
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (!checkError && existing) {
        return {
          success: true,
          alreadySubscribed: true,
          subscriber: existing as DatabaseSubscriber,
          savedToCloud: true,
        };
      }

      if (!checkError) {
        const { error: insertError } = await supabase
          .from('subscribers')
          .insert([newSub]);

        if (!insertError) {
          // Keep memory fallback synced too
          if (!localSubscribersFallback.some((s) => s.email === normalizedEmail)) {
            localSubscribersFallback.unshift(newSub);
          }
          return {
            success: true,
            alreadySubscribed: false,
            subscriber: newSub,
            savedToCloud: true,
          };
        }

        // Handle unique constraint violation gracefully (code 23505)
        if (insertError.code === '23505') {
          return {
            success: true,
            alreadySubscribed: true,
            savedToCloud: true,
          };
        }

        console.warn('Supabase insert subscriber warning (using local fallback):', insertError.message);
      }
    }

    // Fallback in-memory
    const existsLocal = localSubscribersFallback.find((s) => s.email === normalizedEmail);
    if (existsLocal) {
      return {
        success: true,
        alreadySubscribed: true,
        subscriber: existsLocal,
        savedToCloud: false,
      };
    }

    localSubscribersFallback.unshift(newSub);
    return {
      success: true,
      alreadySubscribed: false,
      subscriber: newSub,
      savedToCloud: false,
    };
  } catch (err: any) {
    console.error('Add subscriber error:', err);
    return { success: false, error: err?.message || 'Gagal mendaftarkan email' };
  }
}

// 3. Delete Subscriber by ID
export async function deleteSubscriberRecord(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    localSubscribersFallback = localSubscribersFallback.filter((s) => s.id !== id);

    const supabase = await createClientServer();
    if (!supabase) return { success: true };

    const { error } = await supabase.from('subscribers').delete().eq('id', id);
    if (error) {
      console.warn('Supabase delete subscriber warning:', error.message);
      return { success: true, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Delete subscriber error:', err);
    return { success: false, error: err?.message };
  }
}
