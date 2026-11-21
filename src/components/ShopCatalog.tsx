'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { Sparkles, X, ArrowRight, PackageOpen } from 'lucide-react';
import Link from 'next/link';

interface ShopCatalogProps {
  initialProducts: Product[];
}

const CATEGORIES = [
  'Semua',
  'Bahan Pokok & Bumbu',
  'Gula-gulaan',
  'Kerupuk & Kletikan',
  'Minuman & Herbal',
  'Kerajinan Rumah',
];

export default function ShopCatalog({ initialProducts }: ShopCatalogProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial category from query param if available
  const paramCategory = searchParams.get('category');
  const paramQuery = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(
    paramCategory && CATEGORIES.includes(paramCategory) ? paramCategory : 'Semua'
  );
  const [searchQuery, setSearchQuery] = useState<string>(paramQuery);
  const [sortBy, setSortBy] = useState<string>('rekomendasi');

  // Sync if URL searchParams changes externally
  useEffect(() => {
    if (paramCategory && CATEGORIES.includes(paramCategory)) {
      setSelectedCategory(paramCategory);
    } else if (!paramCategory) {
      setSelectedCategory('Semua');
    }
    if (paramQuery !== undefined) {
      setSearchQuery(paramQuery);
    }
  }, [paramCategory, paramQuery]);

  // Compute product counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of initialProducts) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [initialProducts]);

  // Handle category selection
  const handleCategoryClick = (categoryName: string) => {
    const nextCategory = selectedCategory === categoryName && categoryName !== 'Semua' 
      ? 'Semua' 
      : categoryName;

    setSelectedCategory(nextCategory);

    // Update URL query parameter without page reload
    const params = new URLSearchParams(searchParams.toString());
    if (nextCategory === 'Semua') {
      params.delete('category');
    } else {
      params.set('category', nextCategory);
    }
    const queryString = params.toString();
    router.replace(`/shop${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // 1. Filter by category
    if (selectedCategory !== 'Semua') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // 2. Filter by search query if any
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.origin && p.origin.toLowerCase().includes(q))
      );
    }

    // 3. Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    return result;
  }, [initialProducts, selectedCategory, searchQuery, sortBy]);

  return (
    <>
      {/* Page Header */}
      <div className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#33241b]/10 pb-8">
        <div>
          <span className="text-[#854523] text-xs font-bold uppercase tracking-widest mb-1.5 block font-body">
            Katalog Rewang Desa
          </span>
          <h1 className="text-3xl md:text-5xl font-heading text-[#33241b] mb-3">
            Hasil Tangan Petani &amp; Pengrajin
          </h1>
          <p className="text-stone-600 max-w-2xl text-sm md:text-base font-body leading-relaxed">
            Seluruh komoditas dikurasi langsung dari desa untuk menjamin keaslian, kualitas murni, dan dampak kesejahteraan bagi warga desa.
          </p>
        </div>
        
        {/* Sort Select */}
        <div className="shrink-0">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-[#33241b]/15 text-[#33241b] text-sm py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8a5225] shadow-sm font-body cursor-pointer font-medium"
          >
            <option value="rekomendasi">Urutkan: Rekomendasi</option>
            <option value="price-asc">Harga: Rendah ke Tinggi</option>
            <option value="price-desc">Harga: Tinggi ke Rendah</option>
            <option value="rating">Rating Tertinggi</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white p-6 rounded-3xl border border-[#33241b]/10 shadow-sm sticky top-24">
            
            <h3 className="font-heading font-bold text-base text-[#33241b] mb-4 border-b border-stone-100 pb-2">
              Kategori Produk
            </h3>

            {/* Functional Category Filter List */}
            <ul className="space-y-1.5 font-body">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count = cat === 'Semua' ? initialProducts.length : (categoryCounts[cat] || 0);

                return (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(cat)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all group ${
                        isSelected
                          ? 'bg-[#8a5225] text-white font-semibold shadow-sm shadow-[#8a5225]/20'
                          : 'hover:bg-[#8a5225]/10 text-stone-700 hover:text-[#8a5225]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => {}}
                          className={`rounded border-[#33241b]/20 w-4 h-4 cursor-pointer pointer-events-none ${
                            isSelected ? 'accent-white' : 'accent-[#8a5225]'
                          }`} 
                        />
                        <span className="text-sm">
                          {cat}
                        </span>
                      </div>
                      
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        isSelected 
                          ? 'bg-white/20 text-white' 
                          : 'bg-stone-100 text-stone-500 group-hover:bg-[#8a5225]/15 group-hover:text-[#8a5225]'
                      }`}>
                        {count}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Special Note (Rentang Harga has been removed completely) */}
            <div className="mt-8 p-4 bg-[#fffaf5] rounded-2xl border border-[#8a5225]/20 text-xs text-stone-600 font-body">
              <p className="font-semibold text-[#8a5225] mb-1.5 flex items-center gap-1.5">
                <Sparkles size={14} /> Tips Sahabat Rewang
              </p>
              <p className="leading-relaxed">
                Mau mix &amp; match untuk hampers atau bingkisan acara? Hubungi kami untuk custom paket sesuai kebutuhan.
              </p>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Active Filter Bar & Results Count */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 font-body text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <span>Menampilkan <strong className="text-[#33241b]">{filteredProducts.length}</strong> produk</span>
              {selectedCategory !== 'Semua' && (
                <div className="inline-flex items-center gap-1.5 bg-[#8a5225]/10 text-[#8a5225] px-3 py-1 rounded-full font-semibold border border-[#8a5225]/20">
                  <span>{selectedCategory}</span>
                  <button 
                    onClick={() => handleCategoryClick('Semua')}
                    aria-label="Hapus filter"
                    className="hover:text-[#733f1b]"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>

            {selectedCategory !== 'Semua' && (
              <button 
                onClick={() => handleCategoryClick('Semua')} 
                className="text-[#8a5225] hover:underline font-semibold"
              >
                Tampilkan Semua Kategori
              </button>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#33241b]/10 p-12 text-center font-body flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-[#fffaf5] border border-[#8a5225]/20 text-[#8a5225] flex items-center justify-center mb-4">
                <PackageOpen size={32} />
              </div>
              <h3 className="font-heading font-bold text-xl text-[#33241b] mb-2">
                Tidak Ada Produk
              </h3>
              <p className="text-stone-500 text-sm max-w-md mb-6 leading-relaxed">
                Belum ada produk yang cocok dengan kategori &ldquo;{selectedCategory}&rdquo;.
              </p>
              <button
                onClick={() => handleCategoryClick('Semua')}
                className="bg-[#8a5225] text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-[#733f1b] transition shadow-md"
              >
                Lihat Semua Produk
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
