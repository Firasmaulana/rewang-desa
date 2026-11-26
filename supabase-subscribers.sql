-- ==============================================================================
-- REWANG DESA: SQL Tabel Pelanggan Email (Langganan Kabar Desa)
-- Jalankan skrip ini di Dasbor Supabase: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Buat tabel subscribers jika belum ada
CREATE TABLE IF NOT EXISTS public.subscribers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Berikan izin akses penuh ke role anon, authenticated, dan service_role
GRANT ALL ON TABLE public.subscribers TO anon, authenticated, service_role;

-- 3. Aktifkan Row Level Security (RLS) dan policy akses
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all on subscribers" ON public.subscribers;
CREATE POLICY "Allow public all on subscribers"
  ON public.subscribers
  FOR ALL
  USING (true)
  WITH CHECK (true);
