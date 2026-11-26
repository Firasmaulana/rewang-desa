'use client';

import { useEffect, useRef } from 'react';

export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only attach JS fallback when browser does not natively support CSS scroll() timeline
    if (
      typeof window === 'undefined' ||
      CSS.supports('animation-timeline', 'scroll()') ||
      !window.matchMedia('(prefers-reduced-motion: no-preference)').matches
    ) {
      return;
    }

    const bar = barRef.current;
    if (!bar) return;

    const updateProgress = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      bar.style.transform = `scaleX(${ratio})`;
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="scroll-progress-bar fixed top-0 left-0 right-0 h-[3px] z-[60] pointer-events-none origin-left bg-gradient-to-r from-[#8a5225] via-[#ffdd7d] to-[#5a8514]"
    />
  );
}
