'use client';

import { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ProductImage({ src, alt, className = '' }: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  const isUrl = Boolean(
    src &&
    !hasError &&
    (src.startsWith('http://') ||
     src.startsWith('https://') ||
     src.startsWith('/') ||
     src.startsWith('data:image/'))
  );

  if (isUrl) {
    return (
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-transform duration-300 ${className}`}
        onError={() => setHasError(true)}
        loading="lazy"
      />
    );
  }

  // Fallback to text / emoji representation
  return (
    <div className={`flex flex-col items-center justify-center p-3 text-center w-full h-full ${className}`}>
      <span className="text-3xl md:text-4xl mb-1 transition-transform duration-300">
        {src?.slice(0, 4) || '🌾'}
      </span>
      <span className="text-xs text-stone-600 font-medium line-clamp-1 max-w-[140px]">
        {src?.replace(/^[^\w\s]+/, '').trim() || alt}
      </span>
    </div>
  );
}
