-- ==============================================================================
-- REWANG DESA: SQL Tabel Artikel & Cerita Desa
-- Jalankan skrip ini di Dasbor Supabase: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Buat tabel articles jika belum ada
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Cerita Petani',
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Tim Rewang',
  date TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Berikan izin akses penuh ke role anon, authenticated, dan service_role
GRANT ALL ON TABLE public.articles TO anon, authenticated, service_role;

-- 3. Aktifkan Row Level Security (RLS) dan policy akses publik & admin
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all on articles" ON public.articles;
CREATE POLICY "Allow public all on articles"
  ON public.articles
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. Seed 4 artikel awal (tanpa gambar produk / image = NULL)
INSERT INTO public.articles (id, title, category, excerpt, content, author, date, image, created_at)
VALUES
  (
    '1',
    'Garam Jono: Keajaiban Garam Sumur Panas di Tengah Daratan Grobogan',
    'Cerita Petani',
    'Bukan berasal dari air laut, melainkan dari air sumur panas alami di Desa Jono yang dijemur di atas bilah bambu "klakah" oleh para petani sepuh.',
    E'Di tengah daratan Kabupaten Grobogan, Jawa Tengah, jauh dari garis pantai, tersimpan sebuah warisan alam dan budaya yang unik: Garam Jono. Tidak seperti garam pada umumnya yang diuapkan dari air laut, garam ini berasal dari sumber air asin panas alami yang keluar dari sumur-sumur di Desa Jono.\n\nAir asin tersebut ditimba secara tradisional lalu dijemur di atas bilah bambu belah yang disebut "klakah" di bawah terik matahari. Proses penjemuran alami ini dikerjakan dengan telaten oleh para petani garam setempat yang sebagian besar sudah berusia lanjut.\n\nHasilnya adalah kristal garam yang kaya mineral dengan cita rasa gurih alami yang lembut, sehingga sering dipilih keluarga sebagai alternatif bumbu dapur alami tanpa MSG. Melalui Rewang Desa, setiap kemasan Garam Jono membantu menjaga keberlangsungan mata pencaharian para petani sepuh Desa Jono.',
    'Tim Rewang',
    '12 Agustus 2026',
    NULL,
    '2026-08-12T08:00:00Z'
  ),
  (
    '2',
    'Mengenal Beras Merah & Hitam Jampang dengan Indeks Glikemik Rendah',
    'Edukasi',
    'Petani Desa Jampang Sukabumi merawat varietas padi lokal yang terbukti memiliki indeks glikemik rendah, sangat ideal sebagai pangan harian yang sehat.',
    E'Desa Jampang di Sukabumi dikenal memiliki lahan pertanian subur yang masih mempertahankan budidaya varietas padi lokal, termasuk beras merah dan beras hitam alami. Tidak hanya pulen dan harum saat dimasak, varietas ini kaya akan serat pangan serta antioksidan antosianin.\n\nKarena proses penggilingannya tidak mengikis habis lapisan kulit ari (bekatul), nutrisi alami di dalamnya tetap terjaga utuh. Kandungan indeks glikemik yang lebih rendah membuatnya cocok bagi keluarga yang ingin menjaga kestabilan energi harian dan pola makan lebih sehat.\n\nDengan memilih beras hasil panen langsung dari petani Jampang, Sahabat Rewang turut menjaga kelestarian benih padi lokal Nusantara sekaligus memberi nilai jual yang adil bagi petani.',
    'Pangan Sehat',
    '28 Juli 2026',
    NULL,
    '2026-07-28T08:00:00Z'
  ),
  (
    '3',
    'Pak Djohan & Perjuangan Mengangkat Nilai Singkong di Banjarnegara',
    'Inspirasi',
    'Berangkat dari kepedulian terhadap harga singkong mentah yang anjlok, seorang guru desa menggerakkan kelompok tani memproduksi Gula Singkong Manes bernilai tinggi.',
    E'Singkong adalah komoditas andalan banyak petani di Desa Punggulan, Banjarnegara. Namun, harga singkong mentah kerap jatuh saat musim panen raya, membuat hasil jerih payah petani belum sepadan dengan biaya perawatan lahan.\n\nMelihat kondisi tersebut, Pak Djohan—seorang guru desa—berinisiatif mengajak kelompok tani lokal mengolah singkong menjadi produk turunan bernilai tambah tinggi, yaitu Gula Singkong Cair (Manes). Melalui proses hidrolisis enzimatik yang bersih dan alami, pati singkong diubah menjadi pemanis cair lembut yang rendah kalori dan ramah bagi keluarga.\n\nInovasi sederhana dari desa ini membuktikan bahwa ketika petani diberi pendampingan dan akses pasar yang tepat, hasil bumi lokal mampu bersaing dan meningkatkan kesejahteraan warga desa secara berkelanjutan.',
    'Inspirasi Desa',
    '15 Juli 2026',
    NULL,
    '2026-07-15T08:00:00Z'
  ),
  (
    '4',
    'Memberdayakan Mbah-Mbah Sepuh Melalui Kerupuk Bawang Pak Kamto',
    'Gotong Royong',
    'Di Gunungkidul, usaha kerupuk bawang rumahan Pak Kamto menjadi tumpuan bagi para lansia desa untuk tetap aktif, dihargai, dan mandiri secara ekonomi.',
    E'Di salah satu sudut Gunungkidul, D.I. Yogyakarta, aroma gurih bawang putih segar kerap tercium dari dapur produksi rumahan milik Pak Kamto. Di tempat inilah kerupuk bawang renyah diproduksi dengan resep tradisional tanpa bahan pengawet.\n\nHal yang membuat usaha ini istimewa adalah semangat gotong royongnya. Pak Kamto melibatkan para mbah-mbah sepuh dan warga sekitar dalam proses penjemuran hingga pengemasan agar mereka tetap memiliki aktivitas positif, rasa kebersamaan, serta penghasilan mandiri.\n\nSesuai makna kata "rewang" yaitu saling membantu, setiap bungkus kerupuk yang Anda nikmati di rumah membawa senyum dan dukungan nyata bagi para lansia tangguh di desa.',
    'Tim Rewang',
    '02 Juli 2026',
    NULL,
    '2026-07-02T08:00:00Z'
  )
ON CONFLICT (id) DO NOTHING;
