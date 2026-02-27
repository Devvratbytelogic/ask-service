'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ImageComponentProps {
  url?: string;
  img_title?: string;
  object_cover?: boolean;
  object_contain?: boolean;
  imgPriority?: boolean;
}

export default function ImageComponent({ url, img_title, object_cover = true, object_contain = false }: ImageComponentProps) {
  const [hasError, setHasError] = useState(false);

  const objectFitClass = object_contain ? 'object-contain' : object_cover ? 'object-cover' : '';

  const fallbackLetters = img_title
    ? img_title
        .replace(/\s+/g, '')
        .slice(0, 2)
        .toUpperCase()
    : '??';

  if (hasError || !url) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center text-gray-600 font-semibold ${objectFitClass}`}
        aria-label={img_title || 'Image unavailable'}
      >
        {fallbackLetters}
      </div>
    );
  }

  return (
    <Image
      src={url}
      width={1000}
      height={1000}
      alt={img_title || 'title not found'}
      className={`w-full h-full ${objectFitClass}`}
      unoptimized={true}
      onError={() => setHasError(true)}
    />
  );
}
