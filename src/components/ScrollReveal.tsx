'use client';

import { useEffect, useRef, useState } from 'react';

type RevealVariant = 'up' | 'left' | 'right' | 'zoom';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  variant?: RevealVariant;
  staggerIndex?: 0 | 1 | 2 | 3;
}

export default function ScrollReveal({
  children,
  className = '',
  delayMs = 0,
  variant = 'up',
  staggerIndex = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'visible' | 'hidden'>('visible');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersMotion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    if (!prefersMotion) {
      setState('visible');
      return;
    }

    const el = ref.current;
    if (!el) return;

    // Only arm scroll reveal if the element starts below the current visible area
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      setState('visible');
      return;
    }

    setState('hidden');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setState('visible');
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const computedDelay = delayMs || staggerIndex * 110;

  return (
    <div
      ref={ref}
      data-state={state}
      style={computedDelay > 0 ? { transitionDelay: `${computedDelay}ms` } : undefined}
      className={`sr-reveal sr-reveal-${variant} ${className}`}
    >
      {children}
    </div>
  );
}
