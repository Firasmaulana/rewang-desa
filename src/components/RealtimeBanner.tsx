'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { DatabaseBanner } from '@/lib/supabase/types';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Pause, Play, Megaphone, ArrowRight } from 'lucide-react';

interface RealtimeBannerProps {
  initialBanners: DatabaseBanner[];
}

export default function RealtimeBanner({ initialBanners }: RealtimeBannerProps) {
  const [banners, setBanners] = useState<DatabaseBanner[]>(initialBanners);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [statusAnnouncement, setStatusAnnouncement] = useState('');

  const trackRef = useRef<HTMLDivElement>(null);
  const pendingTargetRef = useRef<number | null>(null);
  const lastSettledRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userInitiatedRef = useRef(false);

  // Realtime subscription to ALL changes in 'banners' table
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel('banners-realtime-all')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'banners' },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            const created = payload.new as DatabaseBanner;
            setBanners((prev) => [created, ...prev.filter((b) => b.id !== created.id)]);
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            const updated = payload.new as DatabaseBanner;
            setBanners((prev) => {
              const exists = prev.some((b) => b.id === updated.id);
              return exists
                ? prev.map((b) => (b.id === updated.id ? updated : b))
                : [updated, ...prev];
            });
          } else if (payload.eventType === 'DELETE' && payload.old) {
            const deletedId = (payload.old as { id?: string }).id;
            if (deletedId) {
              setBanners((prev) => prev.filter((b) => b.id !== deletedId));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, []);

  const activeBanners = banners.filter((b) => b.is_active);
  const totalSlides = activeBanners.length;

  // Keep activeIndex in bounds when banners are deleted
  useEffect(() => {
    if (totalSlides > 0 && activeIndex >= totalSlides) {
      setActiveIndex(0);
    }
  }, [totalSlides, activeIndex]);

  // Measure nearest slide from track scrollLeft
  const getNearestIndex = useCallback((): number => {
    const track = trackRef.current;
    if (!track || track.children.length === 0) return 0;
    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0;
    let minDistance = Infinity;

    for (let i = 0; i < track.children.length; i++) {
      const slide = track.children[i] as HTMLElement;
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const dist = Math.abs(slideCenter - trackCenter);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = i;
      }
    }
    return nearest;
  }, []);

  // Scroll smoothly to a target slide index (strictly scoped to the track, never scrolls the page)
  const scrollToSlide = useCallback(
    (targetIndex: number, fromUser = true) => {
      const track = trackRef.current;
      if (!track || totalSlides === 0) return;

      const wrapped = ((targetIndex % totalSlides) + totalSlides) % totalSlides;
      const slide = track.children[wrapped] as HTMLElement | undefined;
      if (!slide) return;

      if (fromUser) {
        userInitiatedRef.current = true;
      }
      pendingTargetRef.current = wrapped;
      setActiveIndex(wrapped);

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const delta = slide.offsetLeft - track.scrollLeft;
      track.scrollBy({
        left: delta,
        behavior: prefersReduced ? 'auto' : 'smooth',
      });
    },
    [totalSlides]
  );

  // Handle Previous / Next clicks built on pending target
  const handleStep = useCallback(
    (direction: -1 | 1, fromUser = true) => {
      if (totalSlides <= 1) return;
      const baseIndex =
        pendingTargetRef.current !== null ? pendingTargetRef.current : getNearestIndex();
      scrollToSlide(baseIndex + direction, fromUser);
    },
    [totalSlides, getNearestIndex, scrollToSlide]
  );

  // Track native manual scrolling + settled status updates
  useEffect(() => {
    const track = trackRef.current;
    if (!track || totalSlides <= 1) return;

    const handleSettle = () => {
      const settled = getNearestIndex();
      pendingTargetRef.current = null;
      setActiveIndex(settled);

      if (settled !== lastSettledRef.current) {
        lastSettledRef.current = settled;
        if (userInitiatedRef.current) {
          setStatusAnnouncement(`Slide ${settled + 1} dari ${totalSlides}`);
        }
      }
    };

    const supportsScrollEnd = 'onscrollend' in window;

    const handleScroll = () => {
      // Skip live recompute during scripted smooth scroll to avoid stutter
      if (pendingTargetRef.current === null) {
        userInitiatedRef.current = true;
        if (rafRef.current === null) {
          rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null;
            const nearest = getNearestIndex();
            setActiveIndex((prev) => (prev === nearest ? prev : nearest));
          });
        }
      }

      if (!supportsScrollEnd) {
        if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
        settleTimerRef.current = setTimeout(handleSettle, 140);
      }
    };

    track.addEventListener('scroll', handleScroll, { passive: true });
    if (supportsScrollEnd) {
      track.addEventListener('scrollend', handleSettle);
    }

    return () => {
      track.removeEventListener('scroll', handleScroll);
      if (supportsScrollEnd) {
        track.removeEventListener('scrollend', handleSettle);
      }
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    };
  }, [totalSlides, getNearestIndex]);

  // Auto-advance every 5 seconds (respects reduced motion, hover, and Pause control)
  useEffect(() => {
    if (totalSlides <= 1 || isPaused || isHovering) return;
    if (
      typeof window !== 'undefined' &&
      !window.matchMedia('(prefers-reduced-motion: no-preference)').matches
    ) {
      return;
    }

    const timer = setInterval(() => {
      handleStep(1, false);
    }, 5000);

    return () => clearInterval(timer);
  }, [totalSlides, isPaused, isHovering, handleStep]);

  if (totalSlides === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Informasi dan Kegiatan Rewang Desa"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onFocusCapture={() => setIsHovering(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsHovering(false);
        }
      }}
      className="py-4 md:py-5 bg-[#fffaf5] border-b border-[#33241b]/10"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Top Bar: Label + Controls (in DOM before track per carousel accessibility guidance) */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#854523] font-body">
            <span className="w-6 h-6 rounded-full bg-[#8a5225]/12 text-[#8a5225] flex items-center justify-center">
              <Megaphone size={12} />
            </span>
            <span>Info &amp; Kegiatan Terbaru</span>
          </div>

          {totalSlides > 1 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-stone-500 mr-1 font-body tabular-nums">
                {activeIndex + 1} / {totalSlides}
              </span>

              {/* WCAG 2.2.2 Pause / Play control for auto-scrolling carousel */}
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                aria-label={isPaused ? 'Putar geser otomatis' : 'Jeda geser otomatis'}
                title={isPaused ? 'Putar otomatis' : 'Jeda otomatis'}
                className="inline-flex items-center gap-1 px-2.5 h-7 rounded-full bg-white hover:bg-[#f7f1ea] text-[#33241b] border border-[#33241b]/15 text-[11px] font-semibold transition cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a5225] touch-manipulation"
              >
                {isPaused ? <Play size={11} /> : <Pause size={11} />}
                <span className="hidden sm:inline">{isPaused ? 'Putar' : 'Jeda'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleStep(-1, true)}
                aria-label="Slide sebelumnya"
                className="w-7 h-7 rounded-full bg-white hover:bg-[#8a5225] text-[#33241b] hover:text-white border border-[#33241b]/15 hover:border-[#8a5225] flex items-center justify-center transition shadow-xs cursor-pointer active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a5225] touch-manipulation"
              >
                <ChevronLeft size={15} />
              </button>

              <button
                type="button"
                onClick={() => handleStep(1, true)}
                aria-label="Slide berikutnya"
                className="w-7 h-7 rounded-full bg-white hover:bg-[#8a5225] text-[#33241b] hover:text-white border border-[#33241b]/15 hover:border-[#8a5225] flex items-center justify-center transition shadow-xs cursor-pointer active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a5225] touch-manipulation"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Native Scroll-Snap Carousel Track */}
        <div
          ref={trackRef}
          tabIndex={0}
          role="group"
          aria-label="Daftar banner informasi"
          className="info-carousel-track rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8a5225]"
        >
          {activeBanners.map((banner, idx) => {
            const isPhoto = Boolean(
              banner.image_text &&
                (banner.image_text.startsWith('http://') ||
                  banner.image_text.startsWith('https://') ||
                  banner.image_text.startsWith('/') ||
                  banner.image_text.startsWith('data:image/'))
            );

            const hasCta = Boolean(banner.button_text && banner.button_text.trim().length > 0);
            const ctaLink = banner.button_link?.trim() || '/shop';
            const isExternal = ctaLink.startsWith('http://') || ctaLink.startsWith('https://');

            return (
              <div
                key={banner.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${idx + 1} dari ${totalSlides}`}
                className="info-carousel-slide"
              >
                <div className="bg-[#33241b] rounded-2xl overflow-hidden border border-[#8a5225]/35 shadow-md text-[#fffaf5] grid grid-cols-1 sm:grid-cols-12 relative">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#8a5225]/25 rounded-full filter blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3 pointer-events-none" />

                  {/* Compact Banner Image / Poster */}
                  <div className="sm:col-span-4 md:col-span-3 relative bg-[#241913] h-36 sm:h-[152px] overflow-hidden">
                    <img
                      src={isPhoto ? banner.image_text : '/hero-background.webp'}
                      alt={banner.title}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Compact Short Information Content */}
                  <div className="sm:col-span-8 md:col-span-9 p-4 sm:px-6 sm:py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 relative z-10 text-left">
                    <div className="flex-1 min-w-0">
                      {banner.tagline && (
                        <span className="inline-block bg-[#ffdd7d]/15 border border-[#ffdd7d]/30 text-[#ffdd7d] font-bold text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-1.5 font-body">
                          {banner.tagline}
                        </span>
                      )}

                      <h2 className="text-base sm:text-lg md:text-xl font-heading text-white leading-snug mb-1 line-clamp-1">
                        {banner.title}
                      </h2>

                      <p className="text-stone-200 text-xs sm:text-sm leading-relaxed font-body line-clamp-2">
                        {banner.description}
                      </p>
                    </div>

                    {hasCta && (
                      <div className="shrink-0">
                        {isExternal ? (
                          <a
                            href={ctaLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 bg-[#ffdd7d] hover:bg-[#ffe69e] text-[#33241b] px-4 py-2 rounded-full font-bold transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-sm text-xs font-body"
                          >
                            {banner.button_text} <ArrowRight size={13} />
                          </a>
                        ) : (
                          <Link
                            href={ctaLink}
                            className="inline-flex items-center gap-1.5 bg-[#ffdd7d] hover:bg-[#ffe69e] text-[#33241b] px-4 py-2 rounded-full font-bold transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-sm text-xs font-body"
                          >
                            {banner.button_text} <ArrowRight size={13} />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visually hidden live status region for assistive technology */}
        <p className="sr-only" role="status" aria-live="polite">
          {statusAnnouncement}
        </p>

        {/* Marker Dots Navigation */}
        {totalSlides > 1 && (
          <nav
            aria-label="Pilih slide banner informasi"
            className="flex items-center justify-center gap-0.5 mt-2"
          >
            {activeBanners.map((banner, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={banner.id}
                  type="button"
                  onClick={() => scrollToSlide(idx, true)}
                  aria-label={`Buka slide ${idx + 1}: ${banner.title}`}
                  aria-current={isActive ? 'true' : undefined}
                  className="p-2 flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-[#8a5225] rounded-full touch-manipulation"
                >
                  <span
                    className={`block h-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-6 bg-[#8a5225] ring-2 ring-[#8a5225]/25'
                        : 'w-2 bg-[#33241b]/25 hover:bg-[#8a5225]/50'
                    }`}
                  />
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </section>
  );
}
