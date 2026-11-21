'use client';

import { useState } from 'react';
import { Product } from '@/data/products';
import { createProduct, updateProduct } from '@/actions/products';
import { Save, Upload, Link as LinkIcon, Sparkles, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import ProductImage from './ProductImage';

interface ProductFormProps {
  initialProduct?: Product;
  mode: 'create' | 'edit';
}

const PRESET_IMAGES = [
  { label: 'Garam Jono', url: '/products/garam-jono.webp' },
  { label: 'Kecap Kelapa', url: '/products/kecap-kelapa.webp' },
  { label: 'Beras Ubi Ungu', url: '/products/beras-ubi-ungu.webp' },
  { label: 'Gula Aren', url: '/products/gula-aren-bulat.webp' },
  { label: 'Keripik Tempe', url: '/products/keripik-tempe-2.webp' },
  { label: 'Kerupuk Bawang', url: '/products/kerupuk-bawang.webp' },
  { label: 'Minuman Honje', url: '/products/kalehon.webp' },
  { label: 'Tas Anyam', url: '/products/tas-anyam-banyumas-custom-hampers-2.webp' },
  { label: 'Gula Singkong', url: '/products/gula-singkong.webp' },
];

export default function ProductForm({ initialProduct, mode }: ProductFormProps) {
  const [imageValue, setImageValue] = useState(initialProduct?.image || '/products/garam-jono.webp');
  const [nameValue, setNameValue] = useState(initialProduct?.name || '');
  const [priceValue, setPriceValue] = useState(initialProduct?.price ? String(initialProduct.price) : '');
  const [categoryValue, setCategoryValue] = useState(initialProduct?.category || 'Bahan Pokok & Bumbu');
  const [badgeValue, setBadgeValue] = useState(initialProduct?.badge || '');

  // Handle local file selection and convert to Data URL for instant preview & storage
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImageValue(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const action = mode === 'create' ? createProduct : updateProduct;

  return (
    <form action={action} className="bg-white rounded-3xl border border-[#33241b]/10 shadow-sm p-6 md:p-8 space-y-8 font-body">
      {mode === 'edit' && (
        <input type="hidden" name="id" value={initialProduct?.id} />
      )}

      {/* Grid: 2 Kolom Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Kolom Kiri: Data Produk (7 kolom) */}
        <div className="lg:col-span-7 space-y-5">
          <div>
            <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">Nama Produk *</label>
            <input 
              type="text" 
              name="name"
              required
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]" 
              placeholder="Cth: Gula Aren Cair 1 Liter" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">Harga Jual (Rp) *</label>
              <input 
                type="number" 
                name="price"
                required
                min="0"
                value={priceValue}
                onChange={(e) => setPriceValue(e.target.value)}
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]" 
                placeholder="35000" 
              />
            </div>
            <div>
              <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">Harga Coret (Opsi)</label>
              <input 
                type="number" 
                name="originalPrice"
                min="0"
                defaultValue={initialProduct?.originalPrice || ''}
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]" 
                placeholder="40000" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">Kategori *</label>
              <select 
                name="category"
                value={categoryValue}
                onChange={(e) => setCategoryValue(e.target.value)}
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]"
              >
                <option value="Bahan Pokok & Bumbu">Bahan Pokok & Bumbu</option>
                <option value="Gula-gulaan">Gula-gulaan</option>
                <option value="Kerupuk & Kletikan">Kerupuk & Kletikan</option>
                <option value="Minuman & Herbal">Minuman & Herbal</option>
                <option value="Kerajinan Rumah">Kerajinan Rumah</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">Stok Tersedia *</label>
              <input 
                type="number" 
                name="stock"
                defaultValue={initialProduct?.stock ?? 50}
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">Daerah Asal Petani / Desa</label>
              <input 
                type="text" 
                name="origin"
                defaultValue={initialProduct?.origin || ''}
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]" 
                placeholder="Cth: Desa Jampang, Sukabumi" 
              />
            </div>
            <div>
              <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">Lencana / Badge (Opsi)</label>
              <input 
                type="text" 
                name="badge"
                value={badgeValue}
                onChange={(e) => setBadgeValue(e.target.value)}
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5]" 
                placeholder="BEST SELLER / ORGANIK" 
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-xs text-[#33241b] uppercase tracking-wider mb-2">Cerita &amp; Deskripsi Produk *</label>
            <textarea 
              name="description"
              rows={4} 
              required
              defaultValue={initialProduct?.description || ''}
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-[#fffaf5] resize-none" 
              placeholder="Ceritakan keistimewaan, khasiat, proses panen, atau latar belakang petani desa pembuatnya..."
            ></textarea>
          </div>
        </div>

        {/* Kolom Kanan: Manajemen Foto & Live Card Preview (5 kolom) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#fffaf5] p-5 rounded-2xl border border-[#8a5225]/20 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#8a5225] uppercase tracking-wider">
              <ImageIcon size={16} /> Foto / Gambar Produk
            </div>

            {/* Input URL atau File */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-stone-600 font-medium mb-1.5">
                  1. Masukkan URL Gambar Web atau Teks/Emoji:
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      name="image"
                      value={imageValue}
                      onChange={(e) => setImageValue(e.target.value)}
                      required
                      className="w-full border border-stone-300 rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#8a5225] bg-white font-mono" 
                      placeholder="/products/garam-jono.webp atau https://..." 
                    />
                    <LinkIcon size={14} className="absolute left-2.5 top-3 text-stone-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-600 font-medium mb-1.5">
                  2. Atau Upload File Gambar dari Laptop / HP:
                </label>
                <label className="flex items-center justify-center gap-2 w-full p-2.5 border-2 border-dashed border-[#8a5225]/30 rounded-xl bg-white hover:bg-[#8a5225]/5 cursor-pointer transition text-xs font-medium text-[#8a5225]">
                  <Upload size={14} />
                  <span>Pilih File Foto (JPG / PNG / WebP)</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                  />
                </label>
              </div>

              {/* Preset Gallery */}
              <div>
                <label className="block text-[11px] text-stone-500 font-semibold mb-1.5 flex items-center gap-1">
                  <Sparkles size={12} className="text-[#8a5225]" /> Contoh Foto Siap Pakai:
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-1 bg-white rounded-xl border border-stone-200">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setImageValue(preset.url)}
                      className={`text-left p-1.5 rounded-lg text-[11px] flex items-center gap-1.5 transition ${
                        imageValue === preset.url ? 'bg-[#8a5225] text-white font-bold' : 'hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-md overflow-hidden shrink-0 border border-stone-200 bg-[#fffaf5]">
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      </div>
                      <span className="truncate">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="pt-2 border-t border-stone-200">
              <span className="text-[11px] text-stone-500 block mb-2 font-medium">Pratinjau Tampilan di Toko:</span>
              <div className="max-w-[220px] mx-auto bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                <div className="relative aspect-[4/3] bg-[#fffaf5] flex items-center justify-center overflow-hidden">
                  {badgeValue && (
                    <span className="absolute top-2 left-2 bg-[#c82929] text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10">
                      {badgeValue}
                    </span>
                  )}
                  <ProductImage src={imageValue} alt={nameValue || 'Produk'} />
                </div>
                <div className="p-3 text-left">
                  <span className="text-[9px] font-bold text-[#854523] uppercase block">{categoryValue}</span>
                  <p className="font-heading text-xs font-semibold text-[#33241b] line-clamp-1">{nameValue || 'Nama Produk'}</p>
                  <p className="font-bold text-xs text-[#33241b] mt-1">
                    Rp {Number(priceValue || 0).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className="pt-6 border-t border-stone-100 flex justify-end gap-3">
        <Link href="/admin/products" className="px-6 py-2.5 rounded-xl font-semibold text-stone-600 hover:bg-stone-100 transition text-sm">
          Batal
        </Link>
        <button 
          type="submit" 
          className="bg-[#8a5225] text-white font-semibold py-2.5 px-6 rounded-xl hover:bg-[#733f1b] transition flex items-center gap-2 shadow-sm text-sm cursor-pointer"
        >
          <Save size={18} /> {mode === 'create' ? 'Simpan & Publikasikan ke Toko' : 'Simpan Perubahan Produk'}
        </button>
      </div>
    </form>
  );
}
