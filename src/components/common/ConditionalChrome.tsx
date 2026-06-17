'use client'

import { usePathname } from 'next/navigation'
import { getRegistrationPageRoutePath, getLoginPageRoutePath } from '@/routes/routes'

const NO_CHROME_ROUTES = [getRegistrationPageRoutePath(), getLoginPageRoutePath()]

export default function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hidden = NO_CHROME_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  )
  if (hidden) return null
  return <>{children}</>
}
