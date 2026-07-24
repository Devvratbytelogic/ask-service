import Link from 'next/link'
import { getPrivacyRoutePath, getRegistrationPageRoutePath, getTermsRoutePath } from '@/routes/routes'
import AuthPanelLogo from '@/components/common/AuthPanelLogo'
import LoginTestimonialSlider from '@/components/pages/auth/login/LoginTestimonialSlider'

type Role = 'customer' | 'vendor'

interface LeftPanelProps {
  role: Role
  logoUrl?: string | null
  activeVendorsCount?: number
  activeClientsCount?: number
  averageRating?: number
}

export default function LeftPanel({ role, logoUrl, activeVendorsCount, activeClientsCount, averageRating }: LeftPanelProps) {
  const isVendor = role === 'vendor'
  const accentColor = isVendor ? 'var(--color-amber)' : 'var(--color-primaryColor)'
  const accentBg = isVendor ? 'var(--color-amber-dim)' : 'var(--color-primary-dim)'
  const accentBorder = isVendor ? 'rgba(245,158,11,0.2)' : 'rgba(27,79,255,0.2)'

  const descText = isVendor
    ? 'Accédez à vos leads, gérez vos devis et développez votre activité depuis votre espace professionnel.'
    : 'Connectez-vous pour accéder à votre espace et retrouver toutes vos demandes, devis et messages.'

  return (
    <div
      className="relative flex h-full min-h-screen flex-col overflow-y-auto px-11 py-12 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden max-[900px]:hidden"
      style={{
        background: 'linear-gradient(160deg, var(--color-slate-900) 0%, #1B2040 55%, #1A1000 100%)',
        position: 'sticky',
        top: 0,
        width: 420,
        flexShrink: 0,
      }}
    >
      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: -100, right: -80,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--color-primary-icon-bg) 0%, transparent 65%)',
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: -60, left: -60,
          width: 300, height: 300, borderRadius: '50%',
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

        {/* Main content */}
        <div className="flex flex-1 flex-col justify-center">

          {/* Tag */}
          <div
            className="mb-5 w-fit rounded-full px-3 py-1.5"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase',
              color: accentColor, background: accentBg, border: `1px solid ${accentBorder}`,
              transition: 'all 0.3s',
            }}
          >
            ✦ Bienvenue
          </div>

          {/* Headline */}
          <h2
            className="mb-3 text-white"
            style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.15 }}
          >
            Content de vous<br />
            revoir <span style={{ color: accentColor }}>!</span>
          </h2>

          {/* Description */}
          <p
            className="mb-8"
            style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 300 }}
          >
            {descText}
          </p>

          <LoginTestimonialSlider />

          {/* Stats mini bar */}
          <div
            className="overflow-hidden rounded-[14px]"
            style={{
              display: 'flex',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            {[
              { val: activeVendorsCount, sup: '+', label: 'Pros actifs' },
              { val: activeClientsCount, sup: '+', label: 'Demandes' },
              { val: averageRating, sup: '', label: 'Satisfaction' },
            ].map((s, i) => (
              <div
                key={s.label}
                className="flex-1 py-3.5 text-center"
                style={{ borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : undefined }}
              >
                <p style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', color: 'white', lineHeight: 1 }}>
                  {s.val}
                  <span style={{ color: accentColor }}>{s.sup}</span>
                </p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>
          Pas encore de compte ?{' '}
          <Link
            href={getRegistrationPageRoutePath({ role })}
            style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}
          >
            Créer un compte gratuitement →
          </Link>
          <br />
          <span className="mt-1.5 block">
            © 2026 Ask-Service ·{' '}
            <Link href={getTermsRoutePath()} style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>CGU</Link>
            {' · '}
            <Link href={getPrivacyRoutePath()} style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Confidentialité</Link>
          </span>
        </p>
      </div>
    </div>
  )
}
