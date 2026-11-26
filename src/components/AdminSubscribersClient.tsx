"use client";

import { useState, useMemo } from 'react';
import {
  Mail,
  Copy,
  Check,
  Download,
  Search,
  Trash2,
  AlertTriangle,
  ExternalLink,
  Calendar,
  Loader2,
} from 'lucide-react';
import { DatabaseSubscriber } from '@/lib/supabase/types';
import { removeSubscriber } from '@/actions/subscribers';

interface AdminSubscribersClientProps {
  initialSubscribers: DatabaseSubscriber[];
  isTableConfigured: boolean;
  tableError?: string;
}

const SUBSCRIBERS_SETUP_SQL = `-- REWANG DESA: SQL Tabel Pelanggan Email (Langganan Kabar Desa)
CREATE TABLE IF NOT EXISTS public.subscribers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

GRANT ALL ON TABLE public.subscribers TO anon, authenticated, service_role;

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all on subscribers" ON public.subscribers;
CREATE POLICY "Allow public all on subscribers"
  ON public.subscribers
  FOR ALL
  USING (true)
  WITH CHECK (true);`;

function formatDateTime(iso?: string) {
  if (!iso) return '-';
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function AdminSubscribersClient({
  initialSubscribers,
  isTableConfigured,
}: AdminSubscribersClientProps) {
  const [subscribers, setSubscribers] = useState<DatabaseSubscriber[]>(initialSubscribers);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const filteredSubscribers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return subscribers;
    return subscribers.filter((sub) => sub.email.toLowerCase().includes(q));
  }, [subscribers, searchQuery]);

  const showTempNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => {
      setActionNotice((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const handleCopyAll = async () => {
    if (filteredSubscribers.length === 0) return;
    const allEmails = filteredSubscribers.map((s) => s.email).join(', ');
    try {
      await navigator.clipboard.writeText(allEmails);
      setCopiedAll(true);
      showTempNotice(`${filteredSubscribers.length} alamat email berhasil disalin ke clipboard.`);
      setTimeout(() => setCopiedAll(false), 2200);
    } catch {
      showTempNotice('Gagal menyalin otomatis. Silakan gunakan tombol Unduh CSV.');
    }
  };

  const handleCopySingle = async (sub: DatabaseSubscriber) => {
    try {
      await navigator.clipboard.writeText(sub.email);
      setCopiedId(sub.id);
      setTimeout(() => setCopiedId((prev) => (prev === sub.id ? null : prev)), 1800);
    } catch {
      showTempNotice('Gagal menyalin email.');
    }
  };

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(SUBSCRIBERS_SETUP_SQL);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2400);
    } catch {
      showTempNotice('Gagal menyalin SQL.');
    }
  };

  const handleExportCsv = () => {
    if (filteredSubscribers.length === 0) return;

    const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const rows = [
      ['No', 'Email', 'Tanggal Daftar'],
      ...filteredSubscribers.map((sub, idx) => [
        String(idx + 1),
        sub.email,
        formatDateTime(sub.created_at),
      ]),
    ];

    const csvContent = '\uFEFF' + rows.map((row) => row.map(escapeCsv).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `pelanggan-kabar-desa-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showTempNotice(`File CSV (${filteredSubscribers.length} email) berhasil diunduh.`);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const prev = subscribers;
    setSubscribers((current) => current.filter((s) => s.id !== id));
    setConfirmDeleteId(null);

    const result = await removeSubscriber(id);
    setDeletingId(null);

    if (!result.success) {
      setSubscribers(prev);
      showTempNotice(result.error || 'Gagal menghapus email.');
      return;
    }

    showTempNotice('Alamat email berhasil dihapus dari daftar.');
  };

  return (
    <div className="max-w-5xl mx-auto font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl md:text-3xl font-heading text-[#33241b]">
              Pelanggan Kabar Desa
            </h1>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#8a5225]/10 text-[#8a5225] border border-[#8a5225]/20">
              <Mail size={13} />
              {subscribers.length} Terdaftar
            </span>
          </div>
          <p className="text-stone-500 text-sm">
            Daftar email pengunjung yang mendaftar melalui form &ldquo;Dukung Petani Desa&rdquo; di bagian footer website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleCopyAll}
            disabled={filteredSubscribers.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-[#33241b]/15 bg-white text-[#33241b] hover:border-[#8a5225] hover:text-[#8a5225] disabled:opacity-45 disabled:cursor-not-allowed transition shadow-sm"
          >
            {copiedAll ? <Check size={15} className="text-[#5a8514]" /> : <Copy size={15} />}
            {copiedAll ? 'Semua Tersalin' : 'Salin Semua Email'}
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={filteredSubscribers.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#8a5225] text-white hover:bg-[#733f1b] disabled:opacity-45 disabled:cursor-not-allowed transition shadow-sm"
          >
            <Download size={15} />
            Unduh CSV
          </button>
        </div>
      </div>

      {/* Supabase Setup Banner (only shown if public.subscribers table hasn't been created yet) */}
      {!isTableConfigured && (
        <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50/90 p-5 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-amber-950 mb-1">
                Tabel Supabase <code className="px-1.5 py-0.5 rounded bg-amber-200/70 font-mono text-xs">public.subscribers</code> Belum Dibuat
              </h2>
              <p className="text-xs text-amber-900/90 leading-relaxed mb-3">
                Saat ini pendaftaran email tetap bisa dicoba menggunakan penyimpanan sementara di memori server. Agar seluruh email tersimpan permanen di database cloud Supabase (termasuk di Vercel), jalankan skrip SQL berikut satu kali di SQL Editor Supabase.
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-[#33241b] text-[#ffdd7d] hover:bg-[#493427] transition"
                >
                  {copiedSql ? <Check size={14} /> : <Copy size={14} />}
                  {copiedSql ? 'SQL Tersalin!' : 'Salin SQL Tabel'}
                </button>
                <a
                  href="https://supabase.com/dashboard/project/qwykaikwoljzhsmvrjqk/sql/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-white text-amber-950 border border-amber-300 hover:bg-amber-100 transition"
                >
                  Buka SQL Editor Supabase
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action feedback toast */}
      {actionNotice && (
        <div
          role="status"
          aria-live="polite"
          className="mb-4 px-4 py-3 rounded-xl bg-[#5a8514]/10 border border-[#5a8514]/30 text-[#33241b] text-xs font-semibold flex items-center gap-2"
        >
          <Check size={15} className="text-[#5a8514] shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Search & List Card */}
      <div className="bg-white rounded-2xl border border-[#33241b]/10 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari alamat email pelanggan..."
              aria-label="Cari alamat email pelanggan"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-[#fffaf5] border border-[#33241b]/15 text-[#33241b] placeholder:text-stone-400 focus:outline-none focus:border-[#8a5225] transition"
            />
          </div>
          <p className="text-xs text-stone-500 font-medium">
            Menampilkan <strong className="text-[#33241b]">{filteredSubscribers.length}</strong> dari {subscribers.length} email
          </p>
        </div>

        {/* Table / Empty State */}
        {filteredSubscribers.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#8a5225]/10 text-[#8a5225] flex items-center justify-center mx-auto mb-4">
              <Mail size={26} />
            </div>
            <h3 className="text-base font-heading text-[#33241b] mb-1">
              {searchQuery ? 'Email tidak ditemukan' : 'Belum ada pelanggan terdaftar'}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
              {searchQuery
                ? `Tidak ada alamat email yang cocok dengan kata kunci "${searchQuery}".`
                : 'Setiap email yang didaftarkan pengunjung melalui kolom "Dukung Petani Desa" di footer akan otomatis muncul di sini.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fffaf5] border-b border-stone-200/80 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  <th className="py-3.5 px-5 w-14">No</th>
                  <th className="py-3.5 px-5">Alamat Email</th>
                  <th className="py-3.5 px-5">Waktu Daftar</th>
                  <th className="py-3.5 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {filteredSubscribers.map((sub, index) => (
                  <tr key={sub.id} className="hover:bg-[#fffaf5]/70 transition">
                    <td className="py-3.5 px-5 text-xs font-semibold text-stone-400">
                      {index + 1}
                    </td>
                    <td className="py-3.5 px-5">
                      <a
                        href={`mailto:${sub.email}`}
                        className="font-semibold text-[#33241b] hover:text-[#8a5225] transition break-all"
                      >
                        {sub.email}
                      </a>
                    </td>
                    <td className="py-3.5 px-5 text-xs text-stone-500 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={13} className="text-stone-400" />
                        {formatDateTime(sub.created_at)}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopySingle(sub)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-stone-200 text-stone-600 hover:border-[#8a5225] hover:text-[#8a5225] transition"
                          title="Salin email"
                        >
                          {copiedId === sub.id ? (
                            <>
                              <Check size={13} className="text-[#5a8514]" />
                              Tersalin
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              Salin
                            </>
                          )}
                        </button>

                        {confirmDeleteId === sub.id ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleDelete(sub.id)}
                              disabled={deletingId === sub.id}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#c82929] text-white hover:bg-[#a61f1f] transition"
                            >
                              {deletingId === sub.id ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : null}
                              Ya, Hapus
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-stone-200 text-stone-600 hover:bg-stone-100 transition"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(sub.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-stone-200 text-stone-500 hover:border-[#c82929]/40 hover:text-[#c82929] hover:bg-red-50 transition"
                            title="Hapus email"
                          >
                            <Trash2 size={13} />
                            Hapus
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
