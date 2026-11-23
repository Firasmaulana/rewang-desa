-- ==============================================================================
-- REWANG DESA: SQL Izin Akses Tabel Orders (Bebas Error)
-- Jalankan skrip ini di Dasbor Supabase: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Buka hak izin akses penuh ke role anon dan authenticated (Mencegah Error 42501 Permission Denied)
GRANT ALL ON TABLE public.orders TO anon, authenticated, service_role;

-- 2. Pastikan RLS Policies aktif dan mengizinkan simpan & baca
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read orders" ON public.orders;
CREATE POLICY "Allow public read orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert orders" ON public.orders;
CREATE POLICY "Allow public insert orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update orders" ON public.orders;
CREATE POLICY "Allow public update orders" ON public.orders FOR UPDATE USING (true);
