import { createClientServer } from './server';
import { DatabaseArticle } from './types';

// Default articles initialized WITHOUT product images (image: null)
export const defaultArticles: DatabaseArticle[] = [
  {
    id: '1',
    title: 'Garam Jono: Keajaiban Garam Sumur Panas di Tengah Daratan Grobogan',
    category: 'Cerita Petani',
    excerpt:
      'Bukan berasal dari air laut, melainkan dari air sumur panas alami di Desa Jono yang dijemur di atas bilah bambu "klakah" oleh para petani sepuh.',
    content:
      'Di tengah daratan Kabupaten Grobogan, Jawa Tengah, jauh dari garis pantai, tersimpan sebuah warisan alam dan budaya yang unik: Garam Jono. Tidak seperti garam pada umumnya yang diuapkan dari air laut, garam ini berasal dari sumber air asin panas alami yang keluar dari sumur-sumur di Desa Jono.\n\nAir asin tersebut ditimba secara tradisional lalu dijemur di atas bilah bambu belah yang disebut "klakah" di bawah terik matahari. Proses penjemuran alami ini dikerjakan dengan telaten oleh para petani garam setempat yang sebagian besar sudah berusia lanjut.\n\nHasilnya adalah kristal garam yang kaya mineral dengan cita rasa gurih alami yang lembut, sehingga sering dipilih keluarga sebagai alternatif bumbu dapur alami tanpa MSG. Melalui Rewang Desa, setiap kemasan Garam Jono membantu menjaga keberlangsungan mata pencaharian para petani sepuh Desa Jono.',
    author: 'Tim Rewang',
    date: '12 Agustus 2026',
    image: null,
    created_at: '2026-08-12T08:00:00.000Z',
    updated_at: '2026-08-12T08:00:00.000Z',
  },
  {
    id: '2',
    title: 'Mengenal Beras Merah & Hitam Jampang dengan Indeks Glikemik Rendah',
    category: 'Edukasi',
    excerpt:
      'Petani Desa Jampang Sukabumi merawat varietas padi lokal yang terbukti memiliki indeks glikemik rendah, sangat ideal sebagai pangan harian yang sehat.',
    content:
      'Desa Jampang di Sukabumi dikenal memiliki lahan pertanian subur yang masih mempertahankan budidaya varietas padi lokal, termasuk beras merah dan beras hitam alami. Tidak hanya pulen dan harum saat dimasak, varietas ini kaya akan serat pangan serta antioksidan antosianin.\n\nKarena proses penggilingannya tidak mengikis habis lapisan kulit ari (bekatul), nutrisi alami di dalamnya tetap terjaga utuh. Kandungan indeks glikemik yang lebih rendah membuatnya cocok bagi keluarga yang ingin menjaga kestabilan energi harian dan pola makan lebih sehat.\n\nDengan memilih beras hasil panen langsung dari petani Jampang, Sahabat Rewang turut menjaga kelestarian benih padi lokal Nusantara sekaligus memberi nilai jual yang adil bagi petani.',
    author: 'Pangan Sehat',
    date: '28 Juli 2026',
    image: null,
    created_at: '2026-07-28T08:00:00.000Z',
    updated_at: '2026-07-28T08:00:00.000Z',
  },
  {
    id: '3',
    title: 'Pak Djohan & Perjuangan Mengangkat Nilai Singkong di Banjarnegara',
    category: 'Inspirasi',
    excerpt:
      'Berangkat dari kepedulian terhadap harga singkong mentah yang anjlok, seorang guru desa menggerakkan kelompok tani memproduksi Gula Singkong Manes bernilai tinggi.',
    content:
      'Singkong adalah komoditas andalan banyak petani di Desa Punggulan, Banjarnegara. Namun, harga singkong mentah kerap jatuh saat musim panen raya, membuat hasil jerih payah petani belum sepadan dengan biaya perawatan lahan.\n\nMelihat kondisi tersebut, Pak Djohan—seorang guru desa—berinisiatif mengajak kelompok tani lokal mengolah singkong menjadi produk turunan bernilai tambah tinggi, yaitu Gula Singkong Cair (Manes). Melalui proses hidrolisis enzimatik yang bersih dan alami, pati singkong diubah menjadi pemanis cair lembut yang rendah kalori dan ramah bagi keluarga.\n\nInovasi sederhana dari desa ini membuktikan bahwa ketika petani diberi pendampingan dan akses pasar yang tepat, hasil bumi lokal mampu bersaing dan meningkatkan kesejahteraan warga desa secara berkelanjutan.',
    author: 'Inspirasi Desa',
    date: '15 Juli 2026',
    image: null,
    created_at: '2026-07-15T08:00:00.000Z',
    updated_at: '2026-07-15T08:00:00.000Z',
  },
  {
    id: '4',
    title: 'Memberdayakan Mbah-Mbah Sepuh Melalui Kerupuk Bawang Pak Kamto',
    category: 'Gotong Royong',
    excerpt:
      'Di Gunungkidul, usaha kerupuk bawang rumahan Pak Kamto menjadi tumpuan bagi para lansia desa untuk tetap aktif, dihargai, dan mandiri secara ekonomi.',
    content:
      'Di salah satu sudut Gunungkidul, D.I. Yogyakarta, aroma gurih bawang putih segar kerap tercium dari dapur produksi rumahan milik Pak Kamto. Di tempat inilah kerupuk bawang renyah diproduksi dengan resep tradisional tanpa bahan pengawet.\n\nHal yang membuat usaha ini istimewa adalah semangat gotong royongnya. Pak Kamto melibatkan para mbah-mbah sepuh dan warga sekitar dalam proses penjemuran hingga pengemasan agar mereka tetap memiliki aktivitas positif, rasa kebersamaan, serta penghasilan mandiri.\n\nSesuai makna kata "rewang" yaitu saling membantu, setiap bungkus kerupuk yang Anda nikmati di rumah membawa senyum dan dukungan nyata bagi para lansia tangguh di desa.',
    author: 'Tim Rewang',
    date: '02 Juli 2026',
    image: null,
    created_at: '2026-07-02T08:00:00.000Z',
    updated_at: '2026-07-02T08:00:00.000Z',
  },
];

// In-memory fallback so admin CRUD works immediately even before Supabase table is created
let localArticlesFallback: DatabaseArticle[] = defaultArticles.map((a) => ({ ...a }));

// 0. Check if articles table exists and is accessible in Supabase
export async function checkArticlesTableConfigured(): Promise<{ configured: boolean; error?: string }> {
  try {
    const supabase = await createClientServer();
    if (!supabase) return { configured: false, error: 'Klien Supabase belum terkonfigurasi di env' };

    const { error } = await supabase.from('articles').select('id').limit(1);
    if (error) {
      return { configured: false, error: error.message };
    }
    return { configured: true };
  } catch (err: any) {
    return { configured: false, error: err?.message };
  }
}

// 1. Get All Articles
export async function getArticles(): Promise<DatabaseArticle[]> {
  try {
    const supabase = await createClientServer();
    if (!supabase) return localArticlesFallback;

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return localArticlesFallback;
    }

    return data as DatabaseArticle[];
  } catch (err) {
    console.error('Error fetching articles:', err);
    return localArticlesFallback;
  }
}

// 2. Get Single Article by ID
export async function getArticleById(id: string): Promise<DatabaseArticle | null> {
  try {
    const supabase = await createClientServer();
    if (!supabase) {
      return localArticlesFallback.find((a) => a.id === id) || null;
    }

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      return localArticlesFallback.find((a) => a.id === id) || null;
    }

    return data as DatabaseArticle;
  } catch (err) {
    console.error('Error fetching article by ID:', err);
    return localArticlesFallback.find((a) => a.id === id) || null;
  }
}

// 3. Create Article
export async function createArticleRecord(
  article: DatabaseArticle
): Promise<{ success: boolean; error?: string; savedToCloud?: boolean }> {
  try {
    // Always update in-memory fallback
    localArticlesFallback = [article, ...localArticlesFallback.filter((a) => a.id !== article.id)];

    const supabase = await createClientServer();
    if (!supabase) {
      return { success: true, savedToCloud: false };
    }

    const { error } = await supabase.from('articles').insert([article]);
    if (error) {
      console.warn('Supabase insert article warning (using local fallback):', error.message);
      return { success: true, error: error.message, savedToCloud: false };
    }

    return { success: true, savedToCloud: true };
  } catch (err: any) {
    console.error('Create article error:', err);
    return { success: true, error: err?.message, savedToCloud: false };
  }
}

// 4. Update Article
export async function updateArticleRecord(
  id: string,
  updates: Partial<Omit<DatabaseArticle, 'id'>>
): Promise<{ success: boolean; error?: string; savedToCloud?: boolean }> {
  try {
    const updatedAt = new Date().toISOString();

    // Update in-memory fallback
    const idx = localArticlesFallback.findIndex((a) => a.id === id);
    if (idx !== -1) {
      localArticlesFallback[idx] = {
        ...localArticlesFallback[idx],
        ...updates,
        updated_at: updatedAt,
      };
    }

    const supabase = await createClientServer();
    if (!supabase) {
      return { success: true, savedToCloud: false };
    }

    const { error } = await supabase
      .from('articles')
      .update({
        ...updates,
        updated_at: updatedAt,
      })
      .eq('id', id);

    if (error) {
      console.warn('Supabase update article warning:', error.message);
      return { success: true, error: error.message, savedToCloud: false };
    }

    return { success: true, savedToCloud: true };
  } catch (err: any) {
    console.error('Update article error:', err);
    return { success: true, error: err?.message, savedToCloud: false };
  }
}

// 5. Delete Article
export async function deleteArticleRecord(
  id: string
): Promise<{ success: boolean; error?: string; savedToCloud?: boolean }> {
  try {
    // Remove from in-memory fallback
    localArticlesFallback = localArticlesFallback.filter((a) => a.id !== id);

    const supabase = await createClientServer();
    if (!supabase) {
      return { success: true, savedToCloud: false };
    }

    const { error } = await supabase.from('articles').delete().eq('id', id);

    if (error) {
      console.warn('Supabase delete article warning:', error.message);
      return { success: true, error: error.message, savedToCloud: false };
    }

    return { success: true, savedToCloud: true };
  } catch (err: any) {
    console.error('Delete article error:', err);
    return { success: true, error: err?.message, savedToCloud: false };
  }
}
