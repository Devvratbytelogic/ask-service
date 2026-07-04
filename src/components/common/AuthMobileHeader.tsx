'use client'

import AuthPanelLogo from '@/components/common/AuthPanelLogo'
import ThemeToggle from '@/components/common/ThemeToggle'

interface AuthMobileHeaderProps {
  logoUrl?: string | null
  accentColor?: string
}

export default function AuthMobileHeader({
  logoUrl,
  accentColor = 'var(--color-primaryColor)',
}: AuthMobileHeaderProps) {
  return (
    <div className="mb-6 hidden w-full items-center justify-between max-[900px]:flex">
      <div className="w-8 shrink-0" aria-hidden />
      <AuthPanelLogo logoUrl={logoUrl} accentColor={accentColor} theme="light" compact />
      <ThemeToggle />
    </div>
  )
}
