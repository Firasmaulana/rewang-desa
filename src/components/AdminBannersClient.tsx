'use client';

import { useState, useRef, useTransition } from 'react';
import { DatabaseBanner } from '@/lib/supabase/types';
import {
  createBanner,
  updateBannerById,
  toggleBannerActive,
  deleteBanner,
} from '@/actions/banner';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  X,
  Check,
  Loader2,
  Image as ImageIcon,
  Megaphone,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminBannersClient({
  initialBanners,
}: {
  initialBanners: DatabaseBanner[];
}) {
  const [banners, setBanners] = useState<DatabaseBanner[]>(initialBanners);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const editorDialogRef = useRef<HTMLDialogElement>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tagline, setTagline] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageText, setImageText] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonLink, setButtonLink] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [deletingBanner, setDeletingBanner] = useState<DatabaseBanner | null>(null);

  const openCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    setTagline('Info Booth');
    setTitle('');
    setDescription('');
    setImageText('');
    setButtonText('');
    setButtonLink('');
    setIsActive(true);
    editorDialogRef.current?.showModal();
  };

  const openEditModal = (banner: DatabaseBanner) => {
    setModalMode('edit');
    setEditingId(banner.id);
    setTagline(banner.tagline || '');
    setTitle(banner.title || '');
    setDescription(banner.description || '');
    setImageText(banner.image_text || '');
    setButtonText(banner.button_text || '');
    setButtonLink(banner.button_link || '');
    setIsActive(banner.is_active ?? true);
    editorDialogRef.current?.showModal();
  };

  const closeEditorModal = () => editorDialogRef.current?.close();

  const openDeleteModal = (banner: DatabaseBanner) => {
    setDeletingBanner(banner);
    deleteDialogRef.current?.showModal();
  };

  const closeDeleteModal = () => {
    deleteDialogRef.current?.close();
    setDeletingBanner(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImageText(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const payload = {
      tagline: tagline.trim() || 'Info Rewang Desa',
      title: title.trim(),
      description: description.trim(),
      image_text: imageText.trim() || '/hero-background.webp',
      button_text: buttonText.trim(),
      button_link: buttonLink.trim(),
      is_active: isActive,
    };

    startTransition(async () => {
      if (modalMode === 'create') {
        const res = await createBanner(payload);
        if (res.success && res.banner) {
          setBanners((prev) => [res.banner!, ...prev]);
          setMessage({
            type: 'success',
            text: `Banner "${res.banner.title}" berhasil ditambahkan! Kini langsung tampil di carousel bagian atas Beranda.`,
          });
          closeEditorModal();
        } else {
          setMessage({ type: 'error', text: res.error || 'Gagal menambah banner.' });
        }
      } else if (editingId) {
        const targetId = editingId;
        const res = await updateBannerById(targetId, payload);
        if (res.success) {
          setBanners((prev) =>
            prev.map((b) =>
              b.id === targetId
                ? { ...b, ...payload, updated_at: new Date().toISOString() }
                : b
            )
          );
          setMessage({
            type: 'success',
            text: `Banner "${payload.title}" berhasil diperbarui!`,
          });
          closeEditorModal();
        } else {
          setMessage({ type: 'error', text: res.error || 'Gagal memperbarui banner.' });
        }
      }
    });
  };

  const handleToggleActive = (banner: DatabaseBanner) => {
    const nextState = !banner.is_active;
    setBanners((prev) =>
      prev.map((b) => (b.id === banner.id ? { ...b, is_active: nextState } : b))
    );

    startTransition(async () => {
      const res = await toggleBannerActive(banner.id, nextState);
      if (res.success) {
        setMessage({
          type: 'success',
          text: nextState
            ? `Banner "${banner.title}" sekarang AKTIF di Beranda.`
            : `Banner "${banner.title}" disembunyikan dari Beranda.`,
        });
      }
    });
  };

  const handleConfirmDelete = () => {
    if (!deletingBanner) return;
    const target = deletingBanner;
    setBanners((prev) => prev.filter((b) => b.id !== target.id));
    closeDeleteModal();

    startTransition(async () => {
      const res = await deleteBanner(target.id);
      if (res.success) {
        setMessage({
          type: 'success',
          text: `Banner "${target.title}" berhasil dihapus.`,
        });
      }
    });
  };

  const activeCount = banners.filter((b) => b.is_active).length;

  const isPreviewPhoto =
    imageText.trim().length > 0 &&
    (imageText.startsWith('http://') ||
      imageText.startsWith('https://') ||
      imageText.startsWith('/') ||
      imageText.startsWith('data:image/'));

  return (
    <div className="max-w-6xl mx-auto font-body space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading text-[#33241b] mb-1">Banner Info &amp; Kegiatan</h1>
          <p className="text-stone-500 text-sm">
            Tambahkan sebanyak mungkin informasi singkat + foto (seperti jadwal buka booth, bazar, atau kabar terbaru). Banner aktif akan otomatis bergeser di bagian atas Beranda.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-[#33241b] border border-stone-200 text-xs font-bold transition shadow-xs"
          >
            <ExternalLink size={14} /> Lihat Beranda
          </Link>
          <button
            type="button"
            onClick={openCreateModal}
            className="bg-[#8a5225] hover:bg-[#733f1b] text-white font-semibold py-2.5 px-5 rounded-xl transition flex items-center gap-2 shadow-sm text-sm cursor-pointer active:scale-95"
          >
            <Plus size={18} /> Tambah Banner Info
          </button>
        </div>
      </div>

      {/* Info Status Pill */}
      <div className="bg-white p-4 rounded-2xl border border-[#33241b]/10 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-stone-600">
          <span className="w-8 h-8 rounded-xl bg-[#8a5225]/10 text-[#8a5225] flex items-center justify-center">
            <Megaphone size={16} />
          </span>
          <span>
            Total <strong>{banners.length}</strong> banner tersimpan &bull;{' '}
            <strong className="text-[#5a8514]">{activeCount} aktif</strong> tampil bergeser otomatis di Beranda.
          </span>
        </div>
        {activeCount >= 2 && (
          <span className="text-[11px] font-semibold text-[#5a8514] bg-[#5a8514]/10 px-3 py-1 rounded-full">
            Auto-Scroll &amp; Geser Manual Aktif
          </span>
        )}
      </div>

      {/* Feedback Message */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex justify-between items-center shadow-xs border ${
            message.type === 'success'
              ? 'bg-[#5a8514]/15 border-[#5a8514]/30 text-[#5a8514]'
              : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}
        >
          <span>{message.text}</span>
          <button
            type="button"
            onClick={() => setMessage(null)}
            aria-label="Tutup pemberitahuan"
            className="p-1 hover:opacity-70 cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Banners Grid */}
      {banners.length === 0 ? (
        <div className="bg-white rounded-3xl p-14 text-center border border-[#33241b]/10 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#fffaf5] text-[#8a5225] flex items-center justify-center mx-auto mb-3 border border-[#8a5225]/20">
            <ImageIcon size={26} />
          </div>
          <h2 className="font-heading font-bold text-lg text-[#33241b] mb-1">Belum Ada Banner Info</h2>
          <p className="text-stone-500 text-xs max-w-md mx-auto mb-5">
            Tambahkan banner info pertama Anda (misalnya jadwal buka booth akhir pekan, info bazar, atau pengumuman spesial).
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-[#8a5225] hover:bg-[#733f1b] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer"
          >
            <Plus size={15} /> Tambah Banner Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {banners.map((banner, idx) => {
            const hasPhoto =
              banner.image_text &&
              (banner.image_text.startsWith('http://') ||
                banner.image_text.startsWith('https://') ||
                banner.image_text.startsWith('/') ||
                banner.image_text.startsWith('data:image/'));

            return (
              <div
                key={banner.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs transition flex flex-col md:flex-row gap-5 items-start md:items-center justify-between ${
                  banner.is_active
                    ? 'border-[#33241b]/10 hover:border-[#8a5225]/35'
                    : 'border-stone-200 opacity-70 bg-stone-50/70'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start gap-4 flex-1 min-w-0 w-full">
                  {/* Thumbnail */}
                  <div className="w-full sm:w-36 h-24 rounded-xl bg-[#241913] border border-stone-200 overflow-hidden shrink-0 relative">
                    <img
                      src={hasPhoto ? banner.image_text : '/hero-background.webp'}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1.5 left-1.5 bg-[#33241b]/85 text-[#ffdd7d] text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Slide #{idx + 1}
                    </span>
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#8a5225]/10 text-[#854523] px-2.5 py-0.5 rounded-full">
                        {banner.tagline || 'Info'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          banner.is_active
                            ? 'bg-[#5a8514]/15 text-[#5a8514]'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {banner.is_active ? 'Aktif di Beranda' : 'Disembunyikan'}
                      </span>
                    </div>

                    <h2 className="font-heading font-bold text-base md:text-lg text-[#33241b] leading-snug mb-1 line-clamp-1">
                      {banner.title}
                    </h2>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {banner.description}
                    </p>
                    {banner.button_text && (
                      <p className="text-[11px] text-[#8a5225] font-semibold mt-1.5">
                        Tombol: &ldquo;{banner.button_text}&rdquo; &rarr; {banner.button_link || '/shop'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(banner)}
                    disabled={isPending}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      banner.is_active
                        ? 'text-stone-600 bg-stone-100 hover:bg-stone-200'
                        : 'text-[#5a8514] bg-[#5a8514]/10 hover:bg-[#5a8514]/20'
                    }`}
                    title={banner.is_active ? 'Sembunyikan dari Beranda' : 'Tampilkan di Beranda'}
                  >
                    {banner.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                    <span>{banner.is_active ? 'Sembunyikan' : 'Aktifkan'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditModal(banner)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#8a5225] bg-[#8a5225]/10 hover:bg-[#8a5225]/20 rounded-lg transition cursor-pointer"
                  >
                    <Pencil size={14} /> Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => openDeleteModal(banner)}
                    disabled={isPending}
                    aria-label={`Hapus banner ${banner.title}`}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer disabled:opacity-50"
                    title="Hapus Banner"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Native <dialog> Modal: Create / Edit Banner */}
      <dialog
        ref={editorDialogRef}
        aria-labelledby="banner-modal-title"
        className="m-auto w-[min(94vw,46rem)] max-h-[90vh] rounded-3xl border border-[#33241b]/15 bg-white p-0 shadow-2xl open:flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-[#fffaf5]">
          <div>
            <h1 id="banner-modal-title" className="font-heading font-bold text-xl text-[#33241b]">
              {modalMode === 'create' ? 'Tambah Banner Info Baru' : 'Edit Banner Info'}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Cocok untuk info buka booth, jadwal bazar, panen raya, atau pengumuman singkat lainnya.
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

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Live Preview */}
            <div className="bg-[#33241b] rounded-2xl overflow-hidden border border-[#8a5225]/40 text-[#fffaf5] grid grid-cols-1 sm:grid-cols-12">
              <div className="sm:col-span-5 bg-[#241913] h-36 sm:h-auto min-h-[140px] overflow-hidden">
                <img
                  src={isPreviewPhoto ? imageText : '/hero-background.webp'}
                  alt="Pratinjau banner"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="sm:col-span-7 p-4 sm:p-5 flex flex-col justify-center">
                <span className="text-[#ffdd7d] text-[10px] font-bold uppercase tracking-widest mb-1">
                  {tagline || 'Info Booth'}
                </span>
                <p className="font-heading text-white text-base font-bold leading-snug mb-1.5 line-clamp-2">
                  {title || 'Judul Informasi Singkat Anda'}
                </p>
                <p className="text-stone-300 text-xs line-clamp-2 mb-2.5">
                  {description || 'Isi informasi singkat seperti lokasi booth, tanggal, dan jam buka.'}
                </p>
                {buttonText && (
                  <span className="self-start bg-[#ffdd7d] text-[#33241b] text-[10px] font-bold px-3 py-1 rounded-full">
                    {buttonText}
                  </span>
                )}
              </div>
            </div>

            {/* Tagline & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="bn-tagline" className="block text-xs font-bold uppercase tracking-wider text-[#33241b] mb-1.5">
                  Label Singkat
                </label>
                <input
                  id="bn-tagline"
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Cth: Info Booth"
                  className="w-full bg-[#fffaf5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-[#33241b] focus:outline-none focus:ring-2 focus:ring-[#8a5225]"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="bn-title" className="block text-xs font-bold uppercase tracking-wider text-[#33241b] mb-1.5">
                  Judul Informasi *
                </label>
                <input
                  id="bn-title"
                  type="text"
                  required
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Cth: Rewang Desa Buka Booth di Bazar Senayan!"
                  className="w-full bg-[#fffaf5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-[#33241b] focus:outline-none focus:ring-2 focus:ring-[#8a5225]"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="bn-desc" className="block text-xs font-bold uppercase tracking-wider text-[#33241b] mb-1.5">
                Informasi Singkat (Lokasi, Tanggal, Jam, dll.) *
              </label>
              <textarea
                id="bn-desc"
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Cth: Hadir akhir pekan ini (Sabtu–Minggu, 07.00–17.00 WIB) di Parkir Timur Senayan. Ada free tester Kalehon & Toya Coco!"
                className="w-full bg-[#fffaf5] border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-[#33241b] focus:outline-none focus:ring-2 focus:ring-[#8a5225]"
              />
            </div>

            {/* Image Upload / URL */}
            <div className="p-4 rounded-2xl bg-[#fffaf5] border border-stone-200 space-y-2.5">
              <label htmlFor="bn-image" className="block text-xs font-bold uppercase tracking-wider text-[#33241b]">
                Foto Booth / Poster Banner
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  id="bn-image"
                  type="text"
                  value={imageText}
                  onChange={(e) => setImageText(e.target.value)}
                  placeholder="Unggah foto di kanan atau tempel URL gambar..."
                  className="flex-1 bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-[#33241b] focus:outline-none focus:ring-2 focus:ring-[#8a5225]"
                />
                <label className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-stone-50 border border-stone-300 text-[#33241b] px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition shrink-0">
                  <Upload size={14} /> Unggah Foto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Optional CTA Button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="bn-btn-text" className="block text-xs font-bold uppercase tracking-wider text-[#33241b] mb-1.5">
                  Teks Tombol (Opsional)
                </label>
                <input
                  id="bn-btn-text"
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder="Kosongkan jika tidak perlu tombol"
                  className="w-full bg-[#fffaf5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-[#33241b] focus:outline-none focus:ring-2 focus:ring-[#8a5225]"
                />
              </div>
              <div>
                <label htmlFor="bn-btn-link" className="block text-xs font-bold uppercase tracking-wider text-[#33241b] mb-1.5">
                  Link Tujuan Tombol (Opsional)
                </label>
                <input
                  id="bn-btn-link"
                  type="text"
                  value={buttonLink}
                  onChange={(e) => setButtonLink(e.target.value)}
                  placeholder="Cth: /shop atau link Google Maps / WA"
                  className="w-full bg-[#fffaf5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-[#33241b] focus:outline-none focus:ring-2 focus:ring-[#8a5225]"
                />
              </div>
            </div>

            {/* Active Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-[#fffaf5] border border-stone-200">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 accent-[#5a8514] rounded cursor-pointer"
              />
              <span className="text-xs font-semibold text-[#33241b]">
                Tampilkan banner ini di carousel bagian atas Beranda
              </span>
            </label>
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
                  <Check size={14} /> {modalMode === 'create' ? 'Tambahkan Banner' : 'Simpan Perubahan'}
                </>
              )}
            </button>
          </div>
        </form>
      </dialog>

      {/* Native <dialog> Modal: Delete Confirmation */}
      <dialog
        ref={deleteDialogRef}
        aria-labelledby="delete-banner-title"
        className="m-auto w-[min(92vw,26rem)] rounded-3xl border border-[#33241b]/15 bg-white p-6 shadow-2xl"
      >
        <h1 id="delete-banner-title" className="font-heading font-bold text-lg text-[#33241b] mb-2">
          Hapus Banner Ini?
        </h1>
        <p className="text-xs text-stone-600 leading-relaxed mb-6">
          Banner <strong className="text-[#33241b]">&ldquo;{deletingBanner?.title}&rdquo;</strong> akan dihapus permanen dari carousel Beranda.
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
            Ya, Hapus Banner
          </button>
        </div>
      </dialog>
    </div>
  );
}
