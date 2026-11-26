import { getArticles, checkArticlesTableConfigured } from '@/lib/supabase/articles';
import AdminArticlesClient from '@/components/AdminArticlesClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Kelola Artikel - Admin Rewang Desa',
  description: 'Buat, edit, dan hapus artikel serta cerita desa untuk halaman blog Rewang Desa.',
};

export default async function AdminArticlesPage() {
  const [articles, tableCheck] = await Promise.all([
    getArticles(),
    checkArticlesTableConfigured(),
  ]);

  return (
    <AdminArticlesClient
      initialArticles={articles}
      isTableConfigured={tableCheck.configured}
      tableError={tableCheck.error}
    />
  );
}
