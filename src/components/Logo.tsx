import Link from 'next/link';

interface LogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  href?: string;
  className?: string;
}

export default function Logo({
  variant = 'dark',
  size = 'md',
  showTagline = true,
  href = '/',
  className = '',
}: LogoProps) {
  const sizeMap = {
    sm: {
      text: 'text-xl md:text-2xl',
      desaShift: 'ml-3.5 md:ml-4',
      desaGap: '-mt-1',
      tagline: 'text-[8px] md:text-[9px] tracking-[0.24em] mt-2',
    },
    md: {
      text: 'text-2xl md:text-3xl',
      desaShift: 'ml-5 md:ml-6',
      desaGap: '-mt-1 md:-mt-1.5',
      tagline: 'text-[9px] md:text-[10px] tracking-[0.25em] mt-2 md:mt-2.5',
    },
    lg: {
      text: 'text-4xl md:text-5xl',
      desaShift: 'ml-7 md:ml-9',
      desaGap: '-mt-2 md:-mt-2.5',
      tagline: 'text-[11px] md:text-xs tracking-[0.28em] mt-3 md:mt-3.5',
    },
    xl: {
      text: 'text-5xl md:text-6xl',
      desaShift: 'ml-9 md:ml-12',
      desaGap: '-mt-3 md:-mt-4',
      tagline: 'text-xs md:text-sm tracking-[0.3em] mt-3.5 md:mt-4',
    },
  };

  const isLight = variant === 'light';
  const textColor = isLight ? 'text-[#fffaf5]' : 'text-[#8a5225]';
  const taglineHex = isLight ? '#7ec622' : '#5a8514';

  const content = (
    <div className={`inline-flex flex-col items-start select-none overflow-visible ${className}`}>
      {/* Brand Name: Rewang on line 1, Desa below and shifted right */}
      <div
        className={`flex flex-col leading-[0.82] ${sizeMap[size].text} ${textColor} transition-colors duration-200 overflow-visible`}
        style={{ fontFamily: 'var(--font-mistrully), cursive' }}
      >
        <span className="block leading-[0.82] tracking-normal">Rewang</span>
        <span className={`block leading-[0.82] tracking-normal ${sizeMap[size].desaShift} ${sizeMap[size].desaGap}`}>
          Desa
        </span>
      </div>

      {/* Tagline: Dari Tangan Desa in #5a8514 with clear top spacing */}
      {showTagline && (
        <span
          className={`font-body font-bold uppercase ${sizeMap[size].tagline} block whitespace-nowrap pl-0.5 transition-colors`}
          style={{ color: taglineHex }}
        >
          Dari Tangan Desa
        </span>
      )}
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="inline-block group hover:opacity-95 transition-opacity overflow-visible">
      {content}
    </Link>
  );
}
