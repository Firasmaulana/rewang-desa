-- ==============================================================================
-- REWANG DESA: SQL Migrasi & Izin Akses Tabel Orders (Pesanan WhatsApp)
-- Jalankan skrip ini di Dasbor Supabase Anda: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Buat tabel orders jika belum ada
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    notes TEXT,
    items JSONB NOT NULL,
    subtotal NUMERIC NOT NULL,
    tax NUMERIC NOT NULL,
    total NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'menunggu_konfirmasi',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Berikan izin akses penuh ke role anon, authenticated, dan service_role
GRANT ALL ON TABLE public.orders TO anon, authenticated, service_role;

-- 3. Aktifkan Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4. Kebijakan Keamanan (RLS Policies)
DROP POLICY IF EXISTS "Allow public read orders" ON public.orders;
CREATE POLICY "Allow public read orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert orders" ON public.orders;
CREATE POLICY "Allow public insert orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update orders" ON public.orders;
CREATE POLICY "Allow public update orders" ON public.orders FOR UPDATE USING (true);

-- 5. Aktifkan Realtime Replication untuk tabel orders
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'orders'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    END IF;
END $$;
