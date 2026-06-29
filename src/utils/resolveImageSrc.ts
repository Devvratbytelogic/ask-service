import { API_BASE_URL } from '@/utils/config'

/** Normalize API/static image paths for next/image. */
export function resolveImageSrc(url?: string | null): string {
  if (!url?.trim()) return ''

  const trimmed = url.trim()

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  if (trimmed.startsWith('/')) {
    return trimmed
  }

  const base = (API_BASE_URL ?? '').replace(/\/$/, '')
  if (base) {
    return `${base}/${trimmed.replace(/^\//, '')}`
  }

  return `/${trimmed.replace(/^\//, '')}`
}
