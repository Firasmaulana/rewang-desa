'use client';

import { useState, useRef, useTransition } from 'react';
import Link from 'next/link';
import { DatabaseArticle } from '@/lib/supabase/types';
import { createArticle, updateArticle, deleteArticle } from '@/actions/articles';
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Search,
  Calendar,
  User,
  ExternalLink,
  X,
  Check,
  Upload,
  AlertCircle,
  Copy,
  Loader2,
  ImageOff,
} from 'lucide-react';

interface AdminArticlesClientProps {
  initialArticles: DatabaseArticle[];
  isTableConfigured?: boolean;
  tableError?: string;
}

const ARTICLE_CATEGORIES = [
  'Cerita Petani',
  'Edukasi',
  'Inspirasi',
  'Gotong Royong',
  'Kabar Panen',
];

const SQL_ARTICLES_SCRIPT = `-- 1. Buat tabel articles jika belum ada
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

-- 2. Buka hak izin akses penuh ke role anon, authenticated, dan service_role
GRANT ALL ON TABLE public.articles TO anon, authenticated, service_role;

-- 3. Aktifkan RLS dan policy akses
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all on articles" ON public.articles;
CREATE POLICY "Allow public all on articles" ON public.articles FOR ALL USING (true) WITH CHECK (true);`;

function getTodayFormatted(): string {
  return new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function AdminArticlesClient({
  initialArticles,
  isTableConfigured = false,
  tableError,
}: AdminArticlesClientProps) {
  const [articles, setArticles] = useState<DatabaseArticle[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Native <dialog> refs
  const editorDialogRef = useRef<HTMLDialogElement>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  // Editor form state
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(ARTICLE_CATEGORIES[0]);
  const [author, setAuthor] = useState('Tim Rewang');
  const [date, setDate] = useState(getTodayFormatted());
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');

  // Delete target state
  const [deletingArticle, setDeletingArticle] = useState<DatabaseArticle | null>(null);

  const openCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    setTitle('');
    setCategory(ARTICLE_CATEGORIES[0]);
    setAuthor('Tim Rewang');
    setDate(getTodayFormatted());
    setExcerpt('');
    setContent('');
    setImage('');
    editorDialogRef.current?.showModal();
  };

  const openEditModal = (article: DatabaseArticle) => {
    setModalMode('edit');
    setEditingId(article.id);
    setTitle(article.title);
    setCategory(article.category || ARTICLE_CATEGORIES[0]);
    setAuthor(article.author || 'Tim Rewang');
    setDate(article.date || getTodayFormatted());
    setExcerpt(article.excerpt || '');
    setContent(article.content || article.excerpt || '');
    setImage(article.image || '');
    editorDialogRef.current?.showModal();
  };

  const closeEditorModal = () => {
    editorDialogRef.current?.close();
  };

  const openDeleteModal = (article: DatabaseArticle) => {
    setDeletingArticle(article);
    deleteDialogRef.current?.showModal();
  };

  const closeDeleteModal = () => {
    deleteDialogRef.current?.close();
    setDeletingArticle(null);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || !content.trim()) return;

    const payload = {
      title: title.trim(),
      category: category.trim() || 'Cerita Petani',
      author: author.trim() || 'Tim Rewang',
      date: date.trim() || getTodayFormatted(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      image: image.trim() ? image.trim() : null,
    };

    if (modalMode === 'create') {
      startTransition(async () => {
        const res = await createArticle(payload);
        if (res.success) {
          setArticles((prev) => [res.article, ...prev]);
          setActionMessage(`Artikel "${res.article.title}" berhasil dibuat dan diterbitkan!`);
          closeEditorModal();
        }
      });
    } else if (editingId) {
      const targetId = editingId;
      // Optimistic update
      setArticles((prev) =>
        prev.map((a) =>
          a.id === targetId
            ? { ...a, ...payload, updated_at: new Date().toISOString() }
            : a
        )
      );
      closeEditorModal();

      startTransition(async () => {
        const res = await updateArticle(targetId, payload);
        if (res.success) {
          setActionMessage(`Artikel "${payload.title}" berhasil diperbarui!`);
        }
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingArticle) return;
    const target = deletingArticle;

    // Optimistic remove
    setArticles((prev) => prev.filter((a) => a.id !== target.id));
    closeDeleteModal();

    startTransition(async () => {
      const res = await deleteArticle(target.id);
      if (res.success) {
        setActionMessage(`Artikel "${target.title}" berhasil dihapus.`);
      }
    });
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_ARTICLES_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const filteredArticles = articles.filter((a) => {
    if (selectedCategory !== 'Semua' && a.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const hasValidPreviewImage =
    image.trim().length > 0 &&
    (image.startsWith('/') || image.startsWith('http') || image.startsWith('data:image'));

  return (
    <div className="max-w-6xl mx-auto font-body space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading text-[#33241b] mb-1">Kelola Artikel</h1>
          <p className="text-stone-500 text-sm">
            Buat, ubah isi, tambahkan foto (opsional), atau hapus artikel di halaman Artikel &amp; Cerita Desa.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="bg-[#8a5225] hover:bg-[#733f1b] text-white font-semibold py-2.5 px-5 rounded-xl transition flex items-center gap-2 shadow-sm text-sm cursor-pointer active:scale-95"
        >
          <Plus size={18} /> Buat Artikel Baru
        </button>
      </div>

      {/* Supabase Table Setup Notice Banner */}
      {!isTableConfigured && (
        <div className="p-5 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-300 rounded-3xl shadow-sm text-amber-950">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle size={22} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-[#33241b]">
                  Aktifkan Penyimpanan Permanen Tabel Artikel di Supabase
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed max-w-2xl">
                  {tableError
                    ? `Info Supabase: "${tableError}". `
                    : 'Tabel public.articles belum dibuat di Supabase. '}
                  Anda sudah bisa langsung mencoba membuat/mengedit artikel sekarang. Agar perubahan tersimpan permanen di cloud Supabase, jalankan skrip SQL di SQL Editor Supabase (atau dari file <code>supabase-articles.sql</code>).
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
              <button
                type="button"
                onClick={handleCopySql}
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-[#8a5225] hover:bg-[#733f1b] text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                {copiedSql ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedSql ? 'SQL Tersalin!' : 'Salin Kode SQL'}</span>
              </button>

              <a
                href="https://supabase.com/dashboard/project/qwykaikwoljzhsmvrjqk/sql/new"
                target="_blank"
                rel="noreferrer"
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 bg-white hover:bg-stone-50 text-[#33241b] border border-stone-300 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
              >
                <span>Buka SQL Editor</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Banner */}
      {actionMessage && (
        <div className="p-4 bg-[#5a8514]/15 border border-[#5a8514]/30 text-[#5a8514] text-xs font-semibold rounded-2xl flex justify-between items-center shadow-sm">
          <span>{actionMessage}</span>
          <button
            type="button"
            onClick={() => setActionMessage(null)}
            aria-label="Tutup pemberitahuan"
            className="hover:text-[#33241b] p-1 cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#33241b]/10 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {['Semua', ...ARTICLE_CATEGORIES].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#8a5225] text-white shadow-sm'
                  : 'text-stone-600 hover:bg-[#8a5225]/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Cari judul atau penulis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#fffaf5] border border-stone-200 rounded-full pl-9 pr-3 py-2 text-xs text-[#33241b] focus:outline-none focus:ring-2 focus:ring-[#8a5225]"
          />
          <Search size={14} className="absolute left-3.5 top-2.5 text-stone-400" />
        </div>
      </div>

      {/* Articles List */}
      {filteredArticles.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#33241b]/10 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#fffaf5] text-[#8a5225] flex items-center justify-center mx-auto mb-3 border border-[#8a5225]/20">
            <FileText size={26} />
          </div>
          <h2 className="font-heading font-bold text-lg text-[#33241b] mb-1">Belum Ada Artikel</h2>
          <p className="text-stone-500 text-xs max-w-md mx-auto mb-5">
            Klik tombol &ldquo;Buat Artikel Baru&rdquo; untuk mulai menulis kisah petani atau kabar terbaru dari desa.
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-[#8a5225] hover:bg-[#733f1b] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer"
          >
            <Plus size={15} /> Buat Artikel Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredArticles.map((article) => {
            const hasImg =
              typeof article.image === 'string' &&
              article.image.trim().length > 0 &&
              (article.image.startsWith('/') ||
                article.image.startsWith('http') ||
                article.image.startsWith('data:image'));

            return (
              <div
                key={article.id}
                className="bg-white rounded-2xl border border-[#33241b]/10 p-5 shadow-sm hover:border-[#8a5225]/30 transition flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Thumbnail or clean empty image badge */}
                  <div className="w-20 h-16 rounded-xl bg-[#fffaf5] border border-stone-200 overflow-hidden flex flex-col items-center justify-center shrink-0 text-stone-400">
                    {hasImg ? (
                      <img
                        src={article.image!}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <ImageOff size={16} className="mb-0.5 text-stone-400" />
                        <span className="text-[9px] font-medium">Kosong</span>
                      </>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-500 mb-1.5">
                      <span className="bg-[#8a5225]/10 text-[#854523] font-bold px-2 py-0.5 rounded">
                        {article.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={11} /> {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={11} /> {article.author}
                      </span>
                    </div>

                    <h2 className="font-heading font-bold text-base md:text-lg text-[#33241b] leading-snug mb-1 line-clamp-1">
                      {article.title}
                    </h2>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                  <Link
                    href={`/blog/${article.id}`}
                    target="_blank"
                    className="p-2 text-stone-500 hover:text-[#5a8514] hover:bg-[#5a8514]/10 rounded-lg transition"
                    title="Lihat Artikel di Halaman Publik"
                  >
                    <ExternalLink size={17} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => openEditModal(article)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#8a5225] bg-[#8a5225]/10 hover:bg-[#8a5225]/20 rounded-lg transition cursor-pointer"
                    title="Edit Artikel"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => openDeleteModal(article)}
                    disabled={isPending}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer disabled:opacity-50"
                    title="Hapus Artikel"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Native <dialog> Modal: Create / Edit Article */}
      <dialog
        ref={editorDialogRef}
        aria-labelledby="article-modal-title"
        className="m-auto w-[min(94vw,46rem)] max-h-[90vh] rounded-3xl border border-[#33241b]/15 bg-white p-0 shadow-2xl open:flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-[#fffaf5]">
          <div>
            <h1 id="article-modal-title" className="font-heading font-bold text-xl text-[#33241b]">
              {modalMode === 'create' ? 'Buat Artikel Baru' : 'Edit Artikel'}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Perubahan akan langsung tampil di halaman Artikel &amp; Cerita Desa.
            </p>
          </div>
          <button
            type="button"
            onClick={closeEditorModal}
            aria-label="Tutup dialog"
            className="w-8 h-8 rounded-full bg-white border border-stone-200 hover:bg-stone-100 text-stone-600 flex items-center justify-center transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmitForm} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Title */}
            <div>
              <label htmlFor="art-title" className="block text-xs font-bold uppercase tracking-wider text-[#33241b] mb-1.5">
                Judul Artikel *
              </label>
              <input
                id="art-title"
                type="text"
                required
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Panen Raya Beras Merah di Desa Jampang"
                className="w-full bg-[#fffaf5] border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-[#33241b] focus:outline-none focus:ring-2 focus:ring-[#8a5225]"
              />
            </div>

            {/* Category, Author, Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="art-category" className="block text-xs font-bold uppercase tracking-wider text-[#33241b] mb-1.5">
                  Kategori *
                </label>
                <select
                  id="art-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#fffaf5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-[#33241b] focus:outline-none focus:ring-2 focus:ring-[#8a5225]"
                >
                  {ARTICLE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="art-author" className="block text-xs font-bold uppercase tracking-wider text-[#33241b] mb-1.5">
                  Penulis
                </label>
                <input
                  id="art-author"
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Tim Rewang"
                  className="w-full bg-[#fffaf5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-[#33241b] focus:outline-none focus:ring-2 focus:ring-[#8a5225]"
                />
              </div>

              <div>
                <label htmlFor="art-date" className="block text-xs font-bold uppercase tracking-wider text-[#33241b] mb-1.5">
                  Tanggal Terbit
                </label>
                <input
                  id="art-date"
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="26 November 2026"
                  className="w-full bg-[#fffaf5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-[#33241b] focus:outline-none focus:ring-2 focus:ring-[#8a5225]"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="art-excerpt" className="block text-xs font-bold uppercase tracking-wider text-[#33241b] mb-1.5">
                Ringkasan Singkat (Tampil di Kartu Artikel) *
              </label>
              <textarea
                id="art-excerpt"
                required
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Ringkasan singkat 1-2 kalimat untuk menarik perhatian pembaca..."
                className="w-full bg-[#fffaf5] border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-[#33241b] focus:outline-none focus:ring-2 focus:ring-[#8a5225]"
              />
            </div>

            {/* Full Content */}
            <div>
              <label htmlFor="art-content" className="block text-xs font-bold uppercase tracking-wider text-[#33241b] mb-1.5">
                Isi Artikel Lengkap *
              </label>
              <textarea
                id="art-content"
                required
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tulis isi artikel lengkap di sini. Pisahkan antar paragraf dengan baris kosong (Enter 2x)..."
                className="w-full bg-[#fffaf5] border border-stone-200 rounded-xl px-4 py-3 text-sm text-[#33241b] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#8a5225]"
              />
            </div>

            {/* Optional Image */}
            <div className="p-4 rounded-2xl bg-[#fffaf5] border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="art-image" className="text-xs font-bold uppercase tracking-wider text-[#33241b]">
                  Foto Artikel (Opsional — Boleh Kosong)
                </label>
                {image && (
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
                  >
                    Kosongkan Gambar
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  id="art-image"
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Kosongkan jika belum ada foto, atau tempel URL gambar..."
                  className="flex-1 bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-[#33241b] focus:outline-none focus:ring-2 focus:ring-[#8a5225]"
                />
                <label className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-stone-50 border border-stone-300 text-[#33241b] px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition shrink-0">
                  <Upload size={14} /> Unggah Foto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {hasValidPreviewImage && (
                <div className="mt-2 rounded-xl overflow-hidden border border-stone-200 max-h-44 bg-white">
                  <img src={image} alt="Pratinjau foto artikel" className="w-full h-44 object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-stone-100 bg-[#fffaf5] flex justify-end items-center gap-2.5">
            <button
              type="button"
              onClick={closeEditorModal}
              disabled={isPending}
              className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-200/70 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="bg-[#5a8514] hover:bg-[#486b10] disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-[#5a8514]/20 flex items-center gap-2 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Menyimpan...
                </>
              ) : (
                <>
                  <Check size={14} /> {modalMode === 'create' ? 'Terbitkan Artikel' : 'Simpan Perubahan'}
                </>
              )}
            </button>
          </div>
        </form>
      </dialog>

      {/* Native <dialog> Modal: Delete Confirmation */}
      <dialog
        ref={deleteDialogRef}
        aria-labelledby="delete-article-title"
        className="m-auto w-[min(92vw,26rem)] rounded-3xl border border-[#33241b]/15 bg-white p-6 shadow-2xl"
      >
        <h1 id="delete-article-title" className="font-heading font-bold text-lg text-[#33241b] mb-2">
          Hapus Artikel Ini?
        </h1>
        <p className="text-xs text-stone-600 leading-relaxed mb-6">
          Artikel <strong className="text-[#33241b]">&ldquo;{deletingArticle?.title}&rdquo;</strong> akan dihapus dari halaman publik Artikel &amp; Cerita Desa.
        </p>
        <div className="flex justify-end items-center gap-2.5">
          <button
            type="button"
            autoFocus
            onClick={closeDeleteModal}
            className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition shadow-sm cursor-pointer"
          >
            Ya, Hapus Artikel
          </button>
        </div>
      </dialog>
    </div>
  );
}
