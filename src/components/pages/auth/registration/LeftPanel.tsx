import type { ReactNode } from 'react'
import Link from 'next/link'
import { FiBriefcase, FiCheckCircle, FiSearch, FiZap } from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi2'
import { MdOutlineGpsFixed } from 'react-icons/md'
import AuthPanelLogo from '@/components/common/AuthPanelLogo'
import { getTermsRoutePath, getPrivacyRoutePath } from '@/routes/routes'

type Role = 'customer' | 'vendor' | null

interface BenefitItem {
  icon: ReactNode
  iconBg: string
  title: string
  desc: string
}

// Icon backgrounds reference CSS vars added to globals.css
const defaultBenefits: BenefitItem[] = [
  {
    icon: <MdOutlineGpsFixed className="size-4.5" aria-hidden />,
    iconBg: 'var(--color-primary-icon-bg)',
    title: 'Inscription gratuite',
    desc: 'Aucun frais pour créer votre compte',
  },
  {
    icon: <FiCheckCircle className="size-4.5" aria-hidden />,
    iconBg: 'var(--color-green-icon-bg)',
    title: 'Plateforme sécurisée',
    desc: 'Vos données sont protégées',
  },
  {
    icon: <FiZap className="size-4.5" aria-hidden />,
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

  const tagLabel = hasRole
    ? isVendor
      ? 'Espace professionnel'
      : 'Espace client'
    : 'Rejoignez la plateforme'

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

  const roleIndicatorIcon = isVendor
    ? <FiBriefcase className="size-5" aria-hidden />
    : <FiSearch className="size-5" aria-hidden />
  const roleIndicatorTitle = isVendor ? 'Compte prestataire' : 'Compte client'
  const roleIndicatorDesc = isVendor
    ? 'Validé sous 24h par notre équipe'
    : 'Accès gratuit et illimité'

  // Dynamic accent — resolved to CSS vars from globals.css
  const accentColor = isVendor ? 'var(--color-amber)' : 'var(--color-primaryColor)'
  const accentBg = isVendor ? 'var(--color-amber-dim)' : 'var(--color-primary-dim)'
  const accentBorder = isVendor ? 'rgba(245,158,11,0.2)' : 'rgba(27,79,255,0.2)'
  const roleIconBg = isVendor ? 'var(--color-amber-icon-bg)' : 'var(--color-primary-icon-bg)'

  // Ends on dark app-surface (#111827) so the seam with the form pane disappears in dark mode
  const panelBackground =
    'linear-gradient(160deg, var(--color-slate-900) 0%, #1B2040 45%, #111827 100%)'

  return (
    <div
      className="relative h-full min-h-screen max-[900px]:hidden"
      style={{
        width: 420,
        flexShrink: 0,
        background: panelBackground,
      }}
    >
      <div
        className="sticky top-0 flex h-screen flex-col overflow-y-auto px-11 py-12 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
      {/* Decorative radial blobs — kept inward so they don't tint the right edge seam */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: -120,
          left: -40,
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--color-primary-icon-bg) 0%, transparent 65%)',
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: -60,
          left: -60,
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--color-amber-icon-bg) 0%, transparent 65%)',
        }}
      />

      {/* Grid overlay — fades out toward the form pane */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
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
            <HiSparkles className="size-3.5" aria-hidden />
            {tagLabel}
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
                    className="flex shrink-0 items-center justify-center rounded-[10px] text-white"
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
                className="flex shrink-0 items-center justify-center rounded-[10px] text-white"
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
    </div>
  )
}
