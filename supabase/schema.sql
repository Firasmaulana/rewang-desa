-- ==============================================================
-- REWANG DESA - SUPABASE DATABASE SCHEMA, POLICIES & SEED
-- ==============================================================

-- 1. Aktifkan Ekstensi UUID
create extension if not exists "uuid-ossp";

-- 2. Tabel Produk (Products)
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

-- 3. Tabel Banner Promo (Banners)
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

-- 4. PENTING: Berikan Izin Akses Tabel ke Anon & Authenticated Role
-- (Mencegah error '42501 permission denied for table')
grant usage on schema public to anon, authenticated, service_role;
grant all on table public.products to anon, authenticated, service_role;
grant all on table public.banners to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all routines in schema public to anon, authenticated, service_role;

-- 5. Row Level Security (RLS)
alter table public.products enable row level security;
alter table public.banners enable row level security;

-- Hapus policy lama jika ada untuk mencegah bentrok
drop policy if exists "Allow public read-only access on products" on public.products;
drop policy if exists "Allow authenticated/admin insert on products" on public.products;
drop policy if exists "Allow authenticated/admin update on products" on public.products;
drop policy if exists "Allow authenticated/admin delete on products" on public.products;
drop policy if exists "Allow public all on products" on public.products;

create policy "Allow public all on products"
  on public.products
  for all
  to anon, authenticated, service_role
  using (true)
  with check (true);

drop policy if exists "Allow public read on banners" on public.banners;
drop policy if exists "Allow update on banners" on public.banners;
drop policy if exists "Allow insert on banners" on public.banners;
drop policy if exists "Allow public all on banners" on public.banners;

create policy "Allow public all on banners"
  on public.banners
  for all
  to anon, authenticated, service_role
  using (true)
  with check (true);

-- 6. Seed Data Awal Produk Rewang Desa
insert into public.products (id, name, category, price, original_price, rating, image, is_discounted, badge, origin, description, stock)
values
  ('1', 'Garam Jono Grobogan', 'Bahan Pokok & Bumbu', 25000, null, 5, '/products/garam-jono.webp', false, 'INDIKASI GEOGRAFIS', 'Desa Jono, Grobogan, Jawa Tengah', 'Bukan garam laut, melainkan garam alami dari air sumur panas yang cuma ada di Desa Jono (Grobogan) dan dijemur di atas bilah bambu "klakah". Produk hasil olahan petani garam mayoritas lansia dengan rasa gurih alami pengganti MSG.', 65),
  ('2', 'Kecap Kelapa Cilacap', 'Bahan Pokok & Bumbu', 32000, 38000, 4.9, '/products/kecap-kelapa.webp', true, null, 'Cilacap, Jawa Tengah', 'Produk rumah tangga yang dibuat dari gula kelapa murni tanpa kedelai, sehingga memiliki aroma khas gurih-manis alami dan ramah bagi yang menghindari kedelai.', 45),
  ('3', 'Gula Singkong Manes Banjarnegara', 'Gula-gulaan', 28000, null, 4.8, '/products/gula-singkong.webp', false, null, 'Desa Punggulan, Banjarnegara', 'Gula cair alami dari singkong hasil binaan Pak Djohan (seorang guru di Desa Punggulan) untuk memberdayakan kelompok tani lokal dari penjual singkong mentah menjadi produk pemanis bernilai tinggi.', 40),
  ('4', 'Gula Kelapa Murni Keping Banyumas', 'Gula-gulaan', 24000, null, 4.8, '/products/gula-kelapa-keping.webp', false, null, 'Banyumas, Jawa Tengah', 'Produk hasil usaha warisan turun-temurun warga Banyumas dari nira kelapa segar pilihan tanpa bahan pengawet sintetis. Tekstur padat lembut dengan wangi harum kelapa alami.', 55),
  ('5', 'Gula Aren Bulat Tradisional', 'Gula-gulaan', 26000, null, 4.9, '/products/gula-aren-bulat.webp', false, null, 'Jawa Barat', 'Gula merah asli dari nira pohon aren pegunungan murni. Diproses tradisional dengan cetakan batok kelapa menghasilkan cita rasa karamel pekat.', 50),
  ('6', 'Beras Ubi Ungu Alami', 'Bahan Pokok & Bumbu', 36000, 42000, 4.9, '/products/beras-ubi-ungu.webp', true, 'ORGANIK', 'Desa Jampang, Sukabumi', 'Beras sehat dari ubi ungu kaya antosianin dan antioksidan. Indeks glikemik rendah, sangat baik untuk menjaga stamina dan pola makan sehat keluarga.', 35),
  ('7', 'Kerupuk Bawang Pak Kamto', 'Kerupuk & Kletikan', 15000, null, 4.9, '/products/kerupuk-bawang.webp', false, null, 'Gunungkidul, D.I. Yogyakarta', 'Kerupuk bawang renyah gurih olahan Pak Kamto dari Gunungkidul, yang memberdayakan mbah-mbah sepuh dan warga desa sekitar agar tetap produktif dan mandiri.', 90),
  ('8', 'Keripik Tempe Renyah Gurih', 'Kerupuk & Kletikan', 18000, null, 5, '/products/keripik-tempe-2.webp', false, 'BEST SELLER', 'Nusantara', 'Keripik tempe renyah gurih, tidak keras, dibuat dari tempe kedelai fermentasi alami dengan baluran rempah pilihan asli tangan pengrajin.', 85),
  ('9', 'Kalehon Drink (Honje & Sereh)', 'Minuman & Herbal', 22000, null, 4.9, '/products/kalehon.webp', false, null, 'Rewang Desa Signature', 'Minuman segar khas Rewang Desa yang diracik dari sari bunga honje (kecombrang), madu murni, dan sereh wangi. Sangat menyegarkan tubuh sekaligus kaya antioksidan.', 30),
  ('10', 'Toya Coco - Air Kelapa Murni 500ml', 'Minuman & Herbal', 18000, null, 4.8, '/products/toya-coco.webp', false, null, 'Kebun Kelapa Pesisir', 'Air kelapa murni segar 100% tanpa tambahan air maupun pengawet. Mengandung elektrolit alami untuk menghidrasi tubuh saat beraktivitas.', 40),
  ('11', 'Madu Randu Murni Blitar', 'Minuman & Herbal', 65000, 75000, 5, '/products/madu-randu.webp', true, '100% MURNI', 'Blitar & Riau', 'Madu murni dari nektar bunga pohon randu yang dipanen langsung oleh peternak lebah di Blitar dan Riau. Manis lembut dengan sedikit rasa asam segar alami.', 25),
  ('12', 'Teh Racikan Melati & Mawar', 'Minuman & Herbal', 25000, null, 4.8, '/products/teh-racikan.webp', false, null, 'Rewang Desa Signature', 'Teh daun pilihan berpadu dengan kelopak bunga melati dan mawar kering alami. Memberikan ketenangan dan aroma harum saat diseduh hangat.', 35),
  ('13', 'Wedang Uwuh Tradisional', 'Minuman & Herbal', 20000, null, 4.9, '/products/wedang-uwuh.webp', false, null, 'Imogiri, D.I. Yogyakarta', 'Minuman rempah khas Yogyakarta berisi serutan kayu secang, jahe, kayu manis, cengkeh, dan kapulaga. Berkhasiat menghangatkan badan dan memperlancar peredaran darah.', 45),
  ('14', 'Wedang Alang-Alang Alami', 'Minuman & Herbal', 22000, null, 4.8, '/products/aneka-wedang-wedang-alang-alang.webp', false, null, 'Jawa Tengah', 'Racikan akar alang-alang alami berpadu rempah nusantara untuk meredakan panas dalam, menyegarkan tenggorokan, dan menyejukkan tubuh.', 30),
  ('15', 'Wedang Bunga Telang Biru', 'Minuman & Herbal', 22000, null, 4.8, '/products/aneka-wedang-wedang-telang.webp', false, null, 'Jawa Tengah', 'Kelopak bunga telang biru murni yang kaya antioksidan antosianin. Berwarna biru cantik alami dan berubah menjadi ungu saat diberi perasan lemon.', 30),
  ('16', 'Wedang Rosela Merah Segar', 'Minuman & Herbal', 22000, null, 4.8, '/products/aneka-wedang-wedang-rosela.webp', false, null, 'Jawa Tengah', 'Bunga rosela merah kering dengan rasa asam manis menyegarkan. Kaya akan vitamin C tinggi untuk menjaga imunitas tubuh sehari-hari.', 30),
  ('17', 'Mie Lethek Bantul Organik', 'Bahan Pokok & Bumbu', 18000, null, 4.8, '/products/mie-lethek.webp', false, 'GLUTEN FREE', 'Bantul, D.I. Yogyakarta', 'Mie khas Bantul dari pati tapioka dan singkong murni tanpa pengawet atau pemutih sintesis. Bertekstur kenyal alami dan bebas gluten.', 40),
  ('18', 'Minyak Goreng Kelapa Djawa 1L', 'Bahan Pokok & Bumbu', 42000, null, 4.9, '/products/minyak-kelapa-djawa-1l.webp', false, null, 'Jawa Tengah', 'Minyak goreng dari daging kelapa murni berkualitas tinggi. Lebih hemat, aroma gurih alami, dan tidak cepat hitam untuk memasak sehari-hari.', 35),
  ('19', 'Bumbu Masak Atoom Bulan', 'Bahan Pokok & Bumbu', 12000, null, 4.7, '/products/bumbu-masak-atoom-bulan.webp', false, null, 'Jawa Barat', 'Bumbu penyedap masakan tradisional legendaris. Sangat cocok untuk masakan kuah gurih seperti bakso, sup, soto, dan aneka tumisan.', 60),
  ('20', 'Tepung Mendoan Alida Banyumas', 'Bahan Pokok & Bumbu', 15000, null, 4.9, '/products/tepung-alida-mendoan.webp', false, null, 'Banyumas, Jawa Tengah', 'Tepung bumbu racikan khas mendoan Banyumas dengan ketumbar dan daun bawang. Menghasilkan tempe mendoan lembut, gurih, dan lezat sempurna.', 50),
  ('21', 'Tepung Bumbu Serbaguna Braling Gold', 'Bahan Pokok & Bumbu', 14000, null, 4.8, '/products/tepung-bumbu-serbaguna-braling-gold.webp', false, null, 'Banyumas, Jawa Tengah', 'Tepung bumbu serbaguna renyah untuk ayam goreng, jamur krispi, tahu goreng, atau bakwan sayur dengan aroma rempah istimewa.', 45),
  ('22', 'Lanting Rumput Laut Gunung Kidul', 'Kerupuk & Kletikan', 16000, null, 4.8, '/products/lanting-rumput-laut.webp', false, null, 'Gunungkidul, D.I. Yogyakarta', 'Kletikan khas singkong berbentuk angka delapan unik dengan baluran rasa rumput laut gurih renyah.', 70),
  ('23', 'Sale Pisang Manis Gunung Kidul', 'Kerupuk & Kletikan', 20000, null, 4.9, '/products/sale-pisang.webp', false, null, 'Gunungkidul, D.I. Yogyakarta', 'Sale pisang manis alami bikinan Bu Dhe Sri di Gunungkidul. Dibuat dari pisang matang pohon yang dijemur dan digoreng tepung tipis renyah.', 50),
  ('24', 'Keripik Pisang Asin Gurih', 'Kerupuk & Kletikan', 18000, null, 4.8, '/products/keripik-pisang-asin.webp', false, null, 'Nusantara', 'Irisan pisang kepok pilihan yang digoreng renyah dengan taburan garam gurih alami, cocok untuk camilan santai keluarga.', 60),
  ('25', 'Keripik Pisang Manis Gula Aren', 'Kerupuk & Kletikan', 20000, null, 4.9, '/products/keripik-pisang-manis-gula-putih-kiri-gula-aren-kanan.webp', false, null, 'Nusantara', 'Keripik pisang renyah yang dibalut lelehan karamel gula aren asli. Manis legit dan harum khas nira aren.', 55),
  ('26', 'Kerupuk Gendar Tradisional', 'Kerupuk & Kletikan', 15000, null, 4.7, '/products/gendar.webp', false, null, 'Jawa Tengah', 'Kerupuk beras gendar klasik yang gurih renyah, nikmat disajikan sebagai pendamping nasi pecel atau soto.', 65),
  ('27', 'Manggleng Singkong Pedas Manis', 'Kerupuk & Kletikan', 17000, null, 4.8, '/products/manggleng-keripik-singkong-pedas-kiri-karag-balado-kanan.webp', false, null, 'Jawa Tengah', 'Camilan keripik singkong khas pedesaan dengan bumbu balado pedas manis gurih yang bikin ketagihan.', 55),
  ('28', 'Mie Singkong Cup - Ayam Spesial', 'Bahan Pokok & Bumbu', 15000, null, 4.8, '/products/mie-singkong-cup-ayam-spesial.webp', false, 'GLUTEN FREE', 'Olahan Singkong Desa', 'Mie cup praktis bebas gluten dari tepung singkong lokal. Rasa kaldu ayam gurih lezat dan ramah untuk pencernaan.', 40),
  ('29', 'Mie Singkong Cup - Bakso Sapi', 'Bahan Pokok & Bumbu', 15000, null, 4.8, '/products/mie-singkong-cup-bakso-sapi.webp', false, 'GLUTEN FREE', 'Olahan Singkong Desa', 'Mie cup instan sehat dari tepung singkong dengan rasa kuah bakso sapi gurih dan harum daun seledri.', 40),
  ('30', 'Mie Singkong Cup - Goreng Spesial', 'Bahan Pokok & Bumbu', 15000, null, 4.8, '/products/mie-singkong-cup-goreng-spesial.webp', false, 'GLUTEN FREE', 'Olahan Singkong Desa', 'Mie goreng cup bebas gluten dari pati singkong desa dengan bumbu manis gurih dan bawang goreng renyah.', 40),
  ('31', 'Mie Ubi Ungu Cup Alami', 'Bahan Pokok & Bumbu', 15000, null, 4.9, '/products/mie-ubi-ungu-cup.webp', false, 'ORGANIK', 'Olahan Ubi Desa', 'Mie instan sehat dari ubi jalar ungu tanpa pewarna sintesis. Kaya serat dan antioksidan alami.', 35),
  ('32', 'Tas Anyam Basic Banyumas', 'Kerajinan Rumah', 45000, null, 4.8, '/products/tas-anyam-banyumas.webp', false, null, 'Banyumas, Jawa Tengah', 'Tas anyaman tangan dari pengrajin Banyumas. Kuat, lentur, tahan air, elegan untuk belanja ke pasar tradisional maupun bepergian ramah lingkungan.', 25),
  ('33', 'Paket Custom Hampers Rewang Desa', 'Kerajinan Rumah', 150000, 175000, 5, '/products/custom-hampers.webp', true, 'BISA CUSTOM', 'Dukungan Petani Desa', 'Paket bingkisan/hampers istimewa berisi perpaduan hasil bumi dan kerajinan tangan tas anyam. Bisa dicustom sesuai budget untuk acara keluarga, kantor, atau pernikahan.', 20),
  ('34', 'Paket Rewang Tani (Langganan Bulanan)', 'Bahan Pokok & Bumbu', 110000, 125000, 5, '/products/tas-anyam-banyumas-custom-hampers-2.webp', true, 'PAKET HEMAT', 'Petani Binaan Desa', 'Bantu petani dengan langganan paket kebutuhan pokok bulanan! Berisi 2 kg Beras Alami, 1 btl Kecap Kelapa Cilacap, 1 btl Garam Jono Grobogan, dan 1 pack Gula Kelapa Murni dalam wadah anyam cantik.', 20)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  price = excluded.price,
  original_price = excluded.original_price,
  rating = excluded.rating,
  image = excluded.image,
  is_discounted = excluded.is_discounted,
  badge = excluded.badge,
  origin = excluded.origin,
  description = excluded.description,
  stock = excluded.stock;

-- 7. Seed Data Awal Banner
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


-- 8. Aktifkan Supabase Realtime agar perubahan instan tanpa refresh
alter table public.banners replica identity full;
alter table public.products replica identity full;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and tablename = 'banners'
  ) then
    alter publication supabase_realtime add table public.banners;
  end if;

  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and tablename = 'products'
  ) then
    alter publication supabase_realtime add table public.products;
  end if;
end $$;
