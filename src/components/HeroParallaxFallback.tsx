'use client';

import { useEffect } from 'react';

/**
 * Progressive fallback for browsers that do not natively support CSS Scroll-Driven Animations
 * (`animation-timeline: scroll()` + `animation-range: 0% 100%`).
 * Modern Chromium, Safari 26+, and Firefox 159+ use the pure compositor CSS animation in globals.css.
 */
export default function HeroParallaxFallback() {
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)') ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const wrapper = document.querySelector<HTMLElement>('.hero-parallax-wrapper');
    const bg = document.querySelector<HTMLElement>('.hero-parallax-bg');
    const content = document.querySelector<HTMLElement>('.hero-parallax-content');
    if (!wrapper || !bg) return;

    let rafId: number | null = null;
    let isListening = false;

    const updateParallax = () => {
      rafId = null;
      const scrollY = Math.max(0, window.scrollY);
      const heroHeight = wrapper.offsetHeight || 680;
      const range = Math.max(heroHeight + 120, 680);
      const progress = Math.min(1, Math.max(0, scrollY / range));

      // Mirror karayaliving.com 0% -> ~30% downward parallax (22% of 128%-tall bg wrapper)
      bg.style.transform = `translate3d(0, ${(progress * 22).toFixed(3)}%, 0)`;

      if (content) {
        const fadeProgress = Math.min(1, Math.max(0, (scrollY - 60) / 500));
        content.style.opacity = String(Number((1 - fadeProgress).toFixed(3)));
        content.style.transform = `translate3d(0, ${(-fadeProgress * 24).toFixed(1)}px, 0)`;
      }
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(updateParallax);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !isListening) {
            isListening = true;
            window.addEventListener('scroll', onScroll, { passive: true });
            updateParallax();
          } else if (!entry.isIntersecting && isListening) {
            isListening = false;
            window.removeEventListener('scroll', onScroll);
          }
        }
      },
      { threshold: 0 }
    );

    observer.observe(wrapper);
    updateParallax();

    return () => {
      observer.disconnect();
      if (isListening) {
        window.removeEventListener('scroll', onScroll);
      }
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return null;
}
