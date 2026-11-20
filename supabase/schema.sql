-- ==============================================================
-- REWANG DESA - SUPABASE DATABASE SCHEMA & INITIAL SEED
-- ==============================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Products Table
create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null,
  price numeric not null,
  original_price numeric,
  rating numeric default 5.0,
  image text default '🌾',
  is_discounted boolean default false,
  badge text,
  origin text,
  description text,
  stock integer default 50,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for products
alter table public.products enable row level security;

-- Policy: Everyone can read products
create policy "Allow public read-only access on products"
  on public.products for select
  using (true);

-- Policy: Allow all mutations for now (or restrict to service role / authenticated users)
create policy "Allow authenticated/admin insert on products"
  on public.products for insert
  with check (true);

create policy "Allow authenticated/admin update on products"
  on public.products for update
  using (true);

create policy "Allow authenticated/admin delete on products"
  on public.products for delete
  using (true);

-- 3. Banners Table (Spesial Bulan Ini)
create table if not exists public.banners (
  id text primary key default 'main-banner',
  tagline text default '🌿 Program Dukung Petani',
  title text default 'Paket Rewang Tani Bulanan',
  description text default 'Bantu petani dengan langganan paket ini tiap bulan! Berisi 2 kg Beras Merah Sukabumi, 1 btl Kecap Kelapa, 1 btl Garam Jono, dan 1 pack Gula Kelapa murni.',
  button_text text default 'Langganan Paket Tani (Rp 110.000)',
  button_link text default '/product/11',
  image_text text default '📦',
  is_active boolean default true,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.banners enable row level security;

create policy "Allow public read on banners"
  on public.banners for select
  using (true);

create policy "Allow update on banners"
  on public.banners for update
  using (true);

-- 4. Initial Seed for Products
insert into public.products (id, name, category, price, original_price, rating, image, is_discounted, badge, origin, description, stock)
values
  ('1', 'Beras Merah Sukabumi', 'Bahan Pokok & Bumbu', 38000, 45000, 4.9, '🌾 Beras Merah', true, 'BEST SELLER', 'Desa Jampang, Sukabumi', 'Beras dari petani di Desa Jampang, Sukabumi. Indeks glikemik: 42.3. Sangat cocok sebagai alternatif beras sehat untuk Sahabat Rewang yang menjaga kadar gula darah.', 45),
  ('2', 'Beras Hitam Sukabumi', 'Bahan Pokok & Bumbu', 42000, null, 4.8, '🌾 Beras Hitam', false, null, 'Desa Jampang, Sukabumi', 'Beras hitam organik dari Desa Jampang Sukabumi. Indeks glikemik: ~50. Kaya akan antosianin dan serat alami untuk mendukung pola hidup sehat.', 30),
  ('3', 'Garam Jono Grobogan', 'Bahan Pokok & Bumbu', 25000, null, 5.0, '🧂 Garam Jono', false, 'INDIKASI GEOGRAFIS', 'Desa Jono, Grobogan, Jawa Tengah', 'Bukan garam laut, tapi garam dari air sumur panas yang cuma ada di Desa Jono (Grobogan) dan dijemur di atas bilah bambu "klakah". Produk hasil petani garam mayoritas lansia.', 60),
  ('4', 'Kecap Kelapa Cilacap', 'Bahan Pokok & Bumbu', 32000, 38000, 4.9, '🍶 Kecap Kelapa', true, null, 'Cilacap, Jawa Tengah', 'Produk rumah tangga yang dibuat dari gula kelapa murni tanpa kedelai sehingga rasanya khas gurih-manis alami dan ramah bagi mereka yang menghindari kedelai.', 40),
  ('5', 'Gula Singkong Manes Banjarnegara', 'Gula-gulaan', 28000, null, 4.7, '🍯 Gula Singkong', false, null, 'Desa Punggulan, Banjarnegara', 'Dibuat oleh Pak Djohan, seorang guru yang membina kelompok tani desa setempat untuk mengangkat nilai jual singkong mentah menjadi pemanis olahan bernilai tinggi.', 35),
  ('6', 'Gula Kelapa Murni Banyumas', 'Gula-gulaan', 24000, null, 4.8, '🥥 Gula Kelapa', false, null, 'Banyumas, Jawa Tengah', 'Produk hasil usaha warisan turun-temurun warga Banyumas dari nira kelapa segar pilihan tanpa bahan pengawet sintesis.', 50),
  ('7', 'Gula Aren Semut Organik', 'Gula-gulaan', 26000, 30000, 4.9, '✨ Gula Semut', true, null, 'Jawa Barat', 'Gula semut praktis dari nira aren organik pilihan dengan wangi aroma karamel khas hutan pegunungan nusantara.', 55),
  ('8', 'Kerupuk Bawang Pak Kamto', 'Kerupuk & Kletikan', 15000, null, 4.9, '🥨 Kerupuk Bawang', false, null, 'Gunungkidul, D.I. Yogyakarta', 'Kerupuk bawang gurih renyah bikinan Pak Kamto dari Gunungkidul, yang mempekerjakan mbah-mbah sepuh dan warga sekitar untuk berdaya bersama.', 80),
  ('9', 'Keripik Tempe Renyah', 'Kerupuk & Kletikan', 18000, null, 4.9, '🥠 Keripik Tempe', false, 'BEST SELLER', 'Nusantara', 'Keripik tempe renyah gurih, tidak keras, dibuat dari tempe kedelai fermentasi alami dengan baluran rempah pilihan.', 75),
  ('10', 'Kalehon Drink', 'Minuman & Herbal', 22000, null, 4.8, '🍹 Kalehon Drink', false, null, 'Rewang Desa Signature', 'Minuman segar khas Rewang Desa yang diracik dari ekstrak honje (kecombrang), madu murni, dan sereh wangi. Menyegarkan tubuh sekaligus kaya antioksidan.', 25),
  ('11', 'Paket Rewang Tani (Langganan)', 'Bahan Pokok & Bumbu', 110000, 125000, 5.0, '📦 Paket Tani', true, 'PAKET HEMAT', 'Petani Binaan Desa', 'Bantu petani dengan langganan paket kebutuhan dapur tiap bulan! Berisi: 2 kg Beras Merah Sukabumi, 1 btl Kecap Kelapa, 1 btl Garam Jono, dan 1 pack Gula Kelapa.', 20),
  ('12', 'Tas Anyam Basic Banyumas', 'Kerajinan Rumah', 45000, null, 4.7, '🧺 Tas Anyam', false, null, 'Banyumas, Jawa Tengah', 'Tas anyaman tangan dari pengrajin Banyumas. Kuat, tahan air, elegan untuk belanja pasar maupun aktivitas harian ramah lingkungan.', 15)
on conflict (id) do nothing;

-- 5. Initial Seed for Banner
insert into public.banners (id, tagline, title, description, button_text, button_link, image_text, is_active)
values (
  'main-banner',
  '🌿 Program Dukung Petani',
  'Paket Rewang Tani Bulanan',
  'Bantu petani dengan langganan paket ini tiap bulan! Berisi 2 kg Beras Merah Sukabumi, 1 btl Kecap Kelapa, 1 btl Garam Jono, dan 1 pack Gula Kelapa murni.',
  'Langganan Paket Tani (Rp 110.000)',
  '/product/11',
  '📦',
  true
)
on conflict (id) do nothing;
