import Image from 'next/image'

interface ImageComponentProps {
  url?: string;
  img_title?: string;
  object_cover?: boolean;
  object_contain?: boolean;
  imgPriority?: boolean;
}

const sanitizeUrl = (url?: string) => {
  if (!url || url.trim() === '') return '/images/ask_service_logo.png';

  if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
    return url;
  }

  try {
    const parsed = new URL(url);
    return parsed.href;
  } catch {
    return '/images/navbar/nav_logo.png';
  }
};

export default function ImageComponent({ url, img_title, object_cover = true, object_contain = false }: ImageComponentProps) {
  const safeUrl = sanitizeUrl(url);

  const isLocalPath = safeUrl.startsWith('/');

  const objectFitClass = object_contain ? 'object-contain' : object_cover ? 'object-cover' : '';

  return (
    <Image
      src={safeUrl}
      width={1000}
      height={1000}
      alt={img_title || 'title not found'}
      className={`w-full h-full ${objectFitClass}`}
      unoptimized={isLocalPath}
    />
  );
}
