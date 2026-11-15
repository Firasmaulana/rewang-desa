import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  href?: string;
  className?: string;
  priority?: boolean;
}

export default function Logo({
  variant = 'dark',
  size = 'md',
  showTagline, // retained for backward compatibility with callers
  href = '/',
  className = '',
  priority = true,
}: LogoProps) {
  // Dimensions based on size for the authentic logo image from info folder
  const sizeMap = {
    sm: { width: 62, height: 55, maxHeight: 46 },
    md: { width: 78, height: 69, maxHeight: 58 },
    lg: { width: 115, height: 102, maxHeight: 92 },
    xl: { width: 155, height: 138, maxHeight: 125 },
  };

  const isLight = variant === 'light';
  const logoSrc = isLight ? '/logo-rewang-desa-light.png' : '/logo-rewang-desa.png';
  const config = sizeMap[size];

  const content = (
    <div className={`inline-flex items-center justify-center select-none ${className}`}>
      <Image
        src={logoSrc}
        alt="Rewang Desa - Dari Tangan Desa"
        width={config.width}
        height={config.height}
        className="object-contain w-auto h-auto transition-opacity duration-200"
        style={{ maxHeight: config.maxHeight }}
        priority={priority}
      />
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="inline-block group hover:opacity-90 transition-opacity">
      {content}
    </Link>
  );
}
