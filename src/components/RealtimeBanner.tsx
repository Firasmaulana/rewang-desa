'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { DatabaseBanner } from '@/lib/supabase/types';
import Link from 'next/link';

export default function RealtimeBanner({ initialBanner }: { initialBanner: DatabaseBanner }) {
  const [banner, setBanner] = useState<DatabaseBanner>(initialBanner);

  useEffect(() => {
    // If supabase client is available, subscribe to realtime changes on 'banners' table
    if (!supabase) return;

    const channel = supabase
      .channel('banners-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'banners',
          filter: 'id=eq.main-banner',
        },
        (payload) => {
          if (payload.new) {
            setBanner(payload.new as DatabaseBanner);
          }
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, []);

  if (!banner.is_active) return null;

  const isPhoto = Boolean(
    banner.image_text &&
    (banner.image_text.startsWith('http://') ||
     banner.image_text.startsWith('https://') ||
     banner.image_text.startsWith('/') ||
     banner.image_text.startsWith('data:image/'))
  );

  return (
    <section className="py-16 bg-[#fffaf5]">
      <div className="container mx-auto px-4">
        <div className="bg-[#33241b] rounded-3xl p-8 md:p-14 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-2xl border border-[#8a5225]/40 text-[#fffaf5] transition-all duration-300">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#8a5225]/30 rounded-full filter blur-3xl opacity-60 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
          
          <div className="md:w-3/5 relative z-10 text-center md:text-left mb-8 md:mb-0">
            <span className="text-[#ffdd7d] font-bold text-xs uppercase tracking-widest mb-3 block font-body">
              {banner.tagline}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-white leading-tight mb-4">
              {banner.title}
            </h2>
            <p className="text-stone-300 text-sm md:text-base mb-6 max-w-lg leading-relaxed font-body">
              {banner.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Link 
                href={banner.button_link || '/product/11'} 
                className="bg-[#ffdd7d] hover:bg-[#ffe69e] text-[#33241b] px-8 py-3.5 rounded-full font-bold transition shadow-lg text-sm md:text-base font-body inline-flex items-center gap-2"
              >
                {banner.button_text}
              </Link>
            </div>
          </div>
          
          <div className="md:w-2/5 relative z-10 flex justify-center">
            <div className="w-56 h-56 md:w-64 md:h-64 rounded-3xl bg-[#241913] border-2 border-[#8a5225] flex flex-col items-center justify-center p-6 text-center shadow-xl overflow-hidden relative">
              {isPhoto ? (
                <img 
                  src={banner.image_text} 
                  alt={banner.title} 
                  className="w-full h-full object-cover rounded-2xl" 
                />
              ) : (
                <>
                  <span className="text-5xl mb-3">{banner.image_text || '📦'}</span>
                  <span className="font-heading text-white text-lg font-bold">Paket Rewang Tani</span>
                  <span className="text-xs text-[#ffdd7d] mt-1 font-body">4 Kebutuhan Pokok Alami</span>
                  <span className="mt-3 text-[11px] bg-[#8a5225] text-white px-3 py-1 rounded-full font-body font-semibold">
                    Langsung dari Petani
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
