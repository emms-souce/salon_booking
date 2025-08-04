'use client'
import Image from 'next/image';
import { useState } from 'react';
import { getRandomImage, isValidImageUrl } from '@/lib/constants/images';

interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  type?: 'salon' | 'service' | 'profile' | 'banner';
  priority?: boolean;
  fill?: boolean;
}

/**
 * Composant Image avec fallback vers des images par défaut depuis internet
 * Utilise des images de qualité depuis Unsplash comme fallback
 */
export default function ImageWithFallback({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
  type = 'salon',
  priority = false,
  fill = false
}: ImageWithFallbackProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(src && isValidImageUrl(src) ? src : getRandomImage(type === 'service' ? 'service' : 'salon'));

  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(getRandomImage(type === 'service' ? 'service' : 'salon'));
    }
  };

  const imageProps = {
    src: currentSrc,
    alt,
    className: `object-cover ${className}`,
    onError: handleError,
    priority,
    ...(fill ? { fill: true } : { width, height }),
    sizes: fill ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' : undefined
  };

  return (
    <div className={`relative ${fill ? 'w-full h-full' : ''} ${!fill ? 'overflow-hidden' : ''}`}>
      <Image
        {...imageProps}
        quality={85}
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIwMCAxNTAgMTgwIDEyMCAxNTAgMTIwQzEyMCAxMjAgMTIwIDE1MCAxMjAgMTUwQzEyMCAxNTAgMTQwIDE4MCAxNzAgMTgwQzIwMCAxODAgMjAwIDE1MCAyMDAgMTUwWiIgZmlsbD0iI0Q2RDhEQiIvPgo8L3N2Zz4K"
      />
    </div>
  );
}