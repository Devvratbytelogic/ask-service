import Link from 'next/link'
import AuthPanelLogo from '@/components/common/AuthPanelLogo'
import { getTermsRoutePath, getPrivacyRoutePath } from '@/routes/routes'

type Role = 'customer' | 'vendor' | null

interface BenefitItem {
  icon: string
  iconBg: string
  title: string
  desc: string
}

// Icon backgrounds reference CSS vars added to globals.css
const defaultBenefits: BenefitItem[] = [
  {
    icon: '🎯',
    iconBg: 'var(--color-primary-icon-bg)',
    title: 'Inscription gratuite',
    desc: 'Aucun frais pour créer votre compte',
  },
  {
    icon: '✅',
    iconBg: 'var(--color-green-icon-bg)',
    title: 'Plateforme sécurisée',
    desc: 'Vos données sont protégées',
  },
  {
    icon: '⚡',
    iconBg: 'var(--color-amber-icon-bg)',
    title: 'Accès immédiat',
    desc: 'Opérationnel en 2 minutes',
  },
]

interface LeftPanelProps {
  role: Role
  logoUrl?: string | null
}

export default function LeftPanel({ role, logoUrl }: LeftPanelProps) {
  const isVendor = role === 'vendor'
  const hasRole = role !== null

  const tagText = hasRole
    ? isVendor
      ? '✦ Espace professionnel'
      : '✦ Espace client'
    : '✦ Rejoignez la plateforme'

  const titleContent = hasRole ? (
    isVendor ? (
      <>
        Développez votre{' '}
        <span className="text-amber">activité</span>
      </>
    ) : (
      <>
        Trouvez des{' '}
        <span className="text-primaryColor">professionnels</span>{' '}
        qualifiés
      </>
    )
  ) : (
    <>
      Bienvenue sur{' '}
      <span className="text-primaryColor">Ask-Service</span>
    </>
  )

  const descText = hasRole
    ? isVendor
      ? "Accédez à des leads qualifiés dans votre zone et augmentez votre chiffre d'affaires."
      : 'Postez vos besoins gratuitement et recevez plusieurs devis en moins de 24h.'
    : 'Créez votre compte en quelques minutes et accédez à tous les services de la plateforme.'

  const roleIndicatorIcon = isVendor ? '💼' : '🔍'
  const roleIndicatorTitle = isVendor ? 'Compte prestataire' : 'Compte client'
  const roleIndicatorDesc = isVendor
    ? 'Validé sous 24h par notre équipe'
    : 'Accès gratuit et illimité'

  // Dynamic accent — resolved to CSS vars from globals.css
  const accentColor = isVendor ? 'var(--color-amber)' : 'var(--color-primaryColor)'
  const accentBg = isVendor ? 'var(--color-amber-dim)' : 'var(--color-primary-dim)'
  const accentBorder = isVendor ? 'rgba(245,158,11,0.2)' : 'rgba(27,79,255,0.2)'
  const roleIconBg = isVendor ? 'var(--color-amber-icon-bg)' : 'var(--color-primary-icon-bg)'

  return (
    <div
      className="relative flex h-screen flex-col overflow-y-scroll px-11 py-12 max-[900px]:hidden"
      style={{
        // Gradient uses slate-900 CSS var for the first stop; mid and dark stops are
        // decorative-only values kept inline.
        background: 'linear-gradient(160deg, var(--color-slate-900) 0%, #1B2040 55%, #1A1000 100%)',
        position: 'sticky',
        top: 0,
        width: 420,
        flexShrink: 0,
      }}
    >
      {/* Decorative radial blobs — subtle overlays, kept as inline rgba */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: -100,
          right: -80,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--color-primary-icon-bg) 0%, transparent 65%)',
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: -60,
          left: -60,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--color-amber-icon-bg) 0%, transparent 65%)',
        }}
      />

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Inner content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Logo */}
        <AuthPanelLogo logoUrl={logoUrl} accentColor={accentColor} />

        {/* Main content — vertically centered */}
        <div className="flex flex-1 flex-col justify-center">
          {/* Tag badge */}
          <div
            className="mb-5 w-fit rounded-full px-3 py-1.5"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: accentColor,
              background: accentBg,
              border: `1px solid ${accentBorder}`,
              transition: 'all 0.3s',
            }}
          >
            {tagText}
          </div>

          {/* Headline */}
          <h2
            className="mb-4 text-white"
            style={{
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: '-1px',
              lineHeight: 1.15,
            }}
          >
            {titleContent}
          </h2>

          {/* Description */}
          <p
            className="mb-10"
            style={{
              fontSize: 15,
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.7,
              maxWidth: 300,
            }}
          >
            {descText}
          </p>

          {/* Benefits list (shown before role is selected) */}
          {!hasRole && (
            <div className="mb-11 flex flex-col gap-3.5">
              {defaultBenefits.map((b) => (
                <div
                  key={b.title}
                  className="flex items-center gap-3 rounded-xl transition-all"
                  style={{
                    padding: '14px 16px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div
                    className="flex shrink-0 items-center justify-center rounded-[10px] text-[17px]"
                    style={{ width: 34, height: 34, background: b.iconBg }}
                  >
                    {b.icon}
                  </div>
                  <div>
                    <strong className="mb-px block text-[13px] font-semibold text-white">
                      {b.title}
                    </strong>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                      {b.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Role indicator (shown after role is selected) */}
          {hasRole && (
            <div
              className="flex animate-inscription-fade-up items-center gap-3 rounded-xl"
              style={{
                padding: '14px 16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div
                className="flex shrink-0 items-center justify-center rounded-[10px] text-lg"
                style={{ width: 36, height: 36, background: roleIconBg }}
              >
                {roleIndicatorIcon}
              </div>
              <div>
                <strong className="block text-[13px] font-semibold text-white">
                  {roleIndicatorTitle}
                </strong>
                <span
                  className="mt-px block"
                  style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}
                >
                  {roleIndicatorDesc}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>
          En créant un compte, vous acceptez nos{' '}
          <Link
            href={getTermsRoutePath()}
            style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
          >
            Conditions d&apos;utilisation
          </Link>{' '}
          et notre{' '}
          <Link
            href={getPrivacyRoutePath()}
            style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
          >
            Politique de confidentialité
          </Link>
          .
          <br />
          <span className="mt-2 block">© 2026 Ask-Service</span>
        </p>
      </div>
    </div>
  )
}
