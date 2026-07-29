'use client'

import { useRouter } from 'next/navigation'
import { FiX } from 'react-icons/fi'
import { getHomeRoutePath } from '@/routes/routes'

function isSameSite(url: string): boolean {
  return url.startsWith(window.location.origin)
}

/** True if the previous page was on this site (not Google / blank / direct open). */
function canGoBackInApp(): boolean {
  const nav = window.navigation
  if (nav?.currentEntry) {
    const previous = nav.entries()[nav.currentEntry.index - 1]
    return Boolean(previous?.url && isSameSite(previous.url))
  }

  if (document.referrer) return isSameSite(document.referrer)
  return window.history.length > 1
}

export default function AuthCloseButton({ className = '' }: { className?: string }) {
  const router = useRouter()

  function handleClose() {
    if (canGoBackInApp()) {
      router.back()
    } else {
      router.push(getHomeRoutePath())
    }
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
