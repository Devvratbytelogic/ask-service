'use client'

import AuthCloseButton from '@/components/common/AuthCloseButton'
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
      <AuthCloseButton />
      <AuthPanelLogo logoUrl={logoUrl} accentColor={accentColor} theme="light" compact />
      <ThemeToggle />
    </div>
  )
}
