'use client'

import { useRouter } from 'next/navigation'
import { FiX } from 'react-icons/fi'
import { getHomeRoutePath } from '@/routes/routes'

function isAuthPath(pathname: string): boolean {
  return pathname === '/auth' || pathname.startsWith('/auth/')
}

/** Prefer the non-auth page the user came from; never land on another auth page. */
function getCloseDestination(): string {
  const home = getHomeRoutePath()
  if (typeof window === 'undefined') return home

  const referrer = document.referrer
  if (!referrer) return home

  try {
    const url = new URL(referrer)
    if (url.origin !== window.location.origin) return home
    if (isAuthPath(url.pathname)) return home
    return `${url.pathname}${url.search}${url.hash}` || home
  } catch {
    return home
  }
}

export default function AuthCloseButton({ className = '' }: { className?: string }) {
  const router = useRouter()

  function handleClose() {
    router.push(getCloseDestination())
  }

  return (
    <button
      type="button"
      onClick={handleClose}
      aria-label="Fermer"
      title="Fermer"
      className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-appTextSec transition-all duration-200 hover:bg-gray-100 hover:text-appText dark:hover:bg-appOverlay-5 ${className}`}
    >
      <FiX size={18} aria-hidden />
    </button>
  )
}
