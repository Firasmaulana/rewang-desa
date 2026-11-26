'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}

export default function ScrollReveal({
  children,
  className = '',
  delayMs = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersMotion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    if (!prefersMotion) return;

    // Prefer native CSS Scroll-Driven Animation when supported
    const supportsViewTimeline = CSS.supports(
      '(animation-timeline: view()) and (animation-range: entry)'
    );
    if (supportsViewTimeline) return;

    // Fallback via IntersectionObserver for browsers without native view() timeline
    setUseFallback(true);
    setIsVisible(false);

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-visible={isVisible ? 'true' : 'false'}
      style={useFallback && delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={`${useFallback ? 'scroll-reveal-fallback' : 'scroll-reveal-native'} ${className}`}
    >
      {children}
    </div>
  );
}
