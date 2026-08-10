'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { resolveImageSrc } from '@/utils/resolveImageSrc';

interface ImageComponentProps {
  url?: string;
  img_title?: string;
  object_cover?: boolean;
  object_contain?: boolean;
  imgPriority?: boolean;
  /** Overrides default `w-full h-full` sizing (e.g. header logos on iOS Safari). */
  className?: string;
}

export default function ImageComponent({
  url,
  img_title,
  object_cover = true,
  object_contain = false,
  imgPriority = false,
  className,
}: ImageComponentProps) {
  const [hasError, setHasError] = useState(false);
  const resolvedUrl = useMemo(() => resolveImageSrc(url), [url]);
  const isLocalPreview = /^blob:|^data:/i.test(resolvedUrl);

  useEffect(() => {
    setHasError(false);
  }, [resolvedUrl]);

  const objectFitClass = object_contain ? 'object-contain' : object_cover ? 'object-cover' : '';
  const sizeClass = className ?? 'w-full h-full';
  const fallbackLetters = img_title
    ? img_title
      .replace(/\s+/g, '')
      .slice(0, 2)
      .toUpperCase()
    : '??';

  if (hasError || !resolvedUrl) {
    return (
      <div
        className={`flex items-center justify-center text-gray-600 font-semibold ${sizeClass} ${objectFitClass}`}
        aria-label={img_title || 'Image unavailable'}
      >
        {fallbackLetters}
      </div>
    );
  }

  return (
    <Image
      src={resolvedUrl}
      width={1000}
      height={1000}
      alt={img_title || 'title not found'}
      className={`${sizeClass} ${objectFitClass}`}
      priority={imgPriority}
      unoptimized={isLocalPreview}
      onError={() => setHasError(true)}
    />
  );
}
