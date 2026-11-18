import React, { useState } from 'react';
import { Package } from 'lucide-react';

interface ProductThumbnailProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProductThumbnail: React.FC<ProductThumbnailProps> = ({
  src,
  alt,
  size = 'md',
  className = '',
}) => {
  const [errored, setErrored] = useState(false);

  const dims =
    size === 'sm'
      ? 'w-9 h-9 rounded-lg'
      : size === 'lg'
        ? 'w-16 h-16 rounded-xl'
        : 'w-10 h-10 rounded-lg';

  if (!src || errored) {
    return (
      <div
        className={`${dims} flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 shrink-0 ${className}`}
        aria-label={alt}
      >
        <Package className="w-4 h-4" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setErrored(true)}
      className={`${dims} object-cover border border-neutral-200 dark:border-neutral-700 shrink-0 bg-neutral-100 dark:bg-neutral-800 ${className}`}
    />
  );
};
