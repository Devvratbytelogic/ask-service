import Link from 'next/link'
import ImageComponent from '@/components/library/ImageComponent'

interface AuthPanelLogoProps {
  /** URL returned by the branding API. When present the project ImageComponent
   *  is used (handles errors + Next.js optimisation). When absent the text
   *  fallback is shown. */
  logoUrl?: string | null
  /** CSS colour value used for the dot and accent text in the fallback. */
  accentColor: string
}

export default function AuthPanelLogo({ logoUrl, accentColor }: AuthPanelLogoProps) {
  return (
    <Link
      href="/"
      className="mb-14 flex items-center gap-1.5 no-underline"
      style={{ textDecoration: 'none', color: 'white' }}
      aria-label="Ask-Service — Accueil"
    >
      {logoUrl ? (
        /* ── API logo image — uses the shared ImageComponent which handles
           load errors, Next.js optimisation and object-fit ── */
        <div className="h-14 w-auto min-w-[80px]">
          <ImageComponent
            url={logoUrl}
            img_title="Ask-Service"
            object_contain
          />
        </div>
      ) : (
        /* ── Text fallback ── */
        <span
          className="flex items-center gap-1.5"
          style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'inherit' }}
        >
          <span
            aria-hidden
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: accentColor,
              flexShrink: 0,
              transition: 'background 0.3s',
            }}
          />
          Ask
          <span style={{ color: accentColor, transition: 'color 0.3s' }}>-Service</span>
        </span>
      )}
    </Link>
  )
}
