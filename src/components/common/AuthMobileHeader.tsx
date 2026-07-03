import AuthPanelLogo from '@/components/common/AuthPanelLogo'

interface AuthMobileHeaderProps {
  logoUrl?: string | null
  accentColor?: string
}

export default function AuthMobileHeader({
  logoUrl,
  accentColor = 'var(--color-primaryColor)',
}: AuthMobileHeaderProps) {
  return (
    <div className="mb-6 hidden h-12 w-full justify-center max-[900px]:flex">
      <AuthPanelLogo logoUrl={logoUrl} accentColor={accentColor} theme="light" compact />
    </div>
  )
}
