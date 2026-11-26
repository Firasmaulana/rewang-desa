"use server";

import { revalidatePath } from 'next/cache';
import { DatabaseArticle } from '@/lib/supabase/types';
import {
  createArticleRecord,
  updateArticleRecord,
  deleteArticleRecord,
} from '@/lib/supabase/articles';

export interface ArticlePayload {
  title: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image?: string | null;
}

// 1. Create Article
export async function createArticle(
  payload: ArticlePayload
): Promise<{ success: boolean; article: DatabaseArticle; savedToCloud?: boolean; error?: string }> {
  const now = new Date().toISOString();
  const id = `art-${Date.now()}`;

  const newArticle: DatabaseArticle = {
    id,
    title: payload.title.trim(),
    category: payload.category.trim() || 'Cerita Petani',
    excerpt: payload.excerpt.trim(),
    content: payload.content.trim(),
    author: payload.author.trim() || 'Tim Rewang',
    date: payload.date.trim() || new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    image: payload.image?.trim() ? payload.image.trim() : null,
    created_at: now,
    updated_at: now,
  };

  const result = await createArticleRecord(newArticle);

  revalidatePath('/blog');
  revalidatePath('/admin/articles');
  revalidatePath('/admin');

  return {
    success: result.success,
    article: newArticle,
    savedToCloud: result.savedToCloud,
    error: result.error,
  };
}

// 2. Update Article
export async function updateArticle(
  id: string,
  payload: ArticlePayload
): Promise<{ success: boolean; savedToCloud?: boolean; error?: string }> {
  const updates = {
    title: payload.title.trim(),
    category: payload.category.trim() || 'Cerita Petani',
    excerpt: payload.excerpt.trim(),
    content: payload.content.trim(),
    author: payload.author.trim() || 'Tim Rewang',
    date: payload.date.trim(),
    image: payload.image?.trim() ? payload.image.trim() : null,
  };

  const result = await updateArticleRecord(id, updates);

  revalidatePath('/blog');
  revalidatePath(`/blog/${id}`);
  revalidatePath('/admin/articles');
  revalidatePath('/admin');

  return {
    success: result.success,
    savedToCloud: result.savedToCloud,
    error: result.error,
  };
}

// 3. Delete Article
export async function deleteArticle(
  id: string
): Promise<{ success: boolean; savedToCloud?: boolean; error?: string }> {
  const result = await deleteArticleRecord(id);

  revalidatePath('/blog');
  revalidatePath(`/blog/${id}`);
  revalidatePath('/admin/articles');
  revalidatePath('/admin');

  return {
    success: result.success,
    savedToCloud: result.savedToCloud,
    error: result.error,
  };
}
