'use client';

import { useState } from 'react';
import { PackageCheck } from 'lucide-react';

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

  // Fallback to minimal clean placeholder
  return (
    <div className={`flex flex-col items-center justify-center p-3 text-center w-full h-full bg-[#f7f1ea] text-[#8a5225] ${className}`}>
      <div className="w-12 h-12 rounded-full bg-[#8a5225]/10 flex items-center justify-center mb-2">
        <PackageCheck size={24} strokeWidth={1.5} />
      </div>
      <span className="text-xs text-stone-600 font-medium line-clamp-1 max-w-[140px]">
        {alt}
      </span>
    </div>
  );
}
