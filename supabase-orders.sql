-- ==============================================================================
-- REWANG DESA: SQL Izin Akses Tabel Orders & Products (Bebas Error)
-- Jalankan skrip ini di Dasbor Supabase: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Buka hak izin akses penuh ke role anon dan authenticated (Mencegah Error 42501 Permission Denied)
GRANT ALL ON TABLE public.orders TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;

-- 2. Pastikan RLS Policies aktif dan mengizinkan simpan, baca, dan perbarui stok
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read orders" ON public.orders;
CREATE POLICY "Allow public read orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert orders" ON public.orders;
CREATE POLICY "Allow public insert orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update orders" ON public.orders;
CREATE POLICY "Allow public update orders" ON public.orders FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public all on products" ON public.products;
CREATE POLICY "Allow public all on products" ON public.products FOR ALL USING (true) WITH CHECK (true);
