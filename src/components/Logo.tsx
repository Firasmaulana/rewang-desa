import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  showIcon?: boolean;
  href?: string;
  className?: string;
}

export default function Logo({
  variant = 'dark',
  size = 'md',
  showTagline = true,
  showIcon = true,
  href = '/',
  className = '',
}: LogoProps) {
  const sizeMap = {
    sm: {
      text: 'text-2xl',
      tagline: 'text-[9px] tracking-[0.2em] -mt-1',
      iconSize: 28,
    },
    md: {
      text: 'text-3xl md:text-4xl',
      tagline: 'text-[10px] tracking-[0.25em] -mt-1',
      iconSize: 36,
    },
    lg: {
      text: 'text-4xl md:text-5xl',
      tagline: 'text-xs tracking-[0.3em] -mt-1',
      iconSize: 48,
    },
    xl: {
      text: 'text-5xl md:text-6xl',
      tagline: 'text-sm tracking-[0.35em]',
      iconSize: 60,
    },
  };

  const isLight = variant === 'light';
  const textColor = isLight ? 'text-[#fffaf5]' : 'text-[#8a5225]';
  const taglineColor = isLight ? 'text-[#ffdd7d]' : 'text-[#854523]';

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {showIcon && (
        <div className="relative shrink-0 flex items-center justify-center">
          <Image
            src={isLight ? "/icon.png" : "/logo-rewang-desa.png"}
            alt="Logo Rewang Desa"
            width={sizeMap[size].iconSize}
            height={sizeMap[size].iconSize}
            className={`object-contain ${isLight ? 'rounded-xl shadow-sm' : ''}`}
            priority
          />
        </div>
      )}
      <div className="inline-flex flex-col items-start justify-center">
        <span
          className={`font-mistrully leading-none ${sizeMap[size].text} ${textColor} transition-colors duration-200`}
          style={{ fontFamily: 'var(--font-mistrully), cursive' }}
        >
          Rewang Desa
        </span>
        {showTagline && (
          <span
            className={`font-body font-semibold uppercase ${sizeMap[size].tagline} ${taglineColor} opacity-90`}
          >
            Dari Tangan Desa
          </span>
        )}
      </div>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="inline-block group hover:opacity-95 transition-opacity">
      {content}
    </Link>
  );
}
