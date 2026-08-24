import RequestAServiceForm from './RequestAServiceForm'

const TRUST_PILLS = [
  '100% gratuit',
  'Pros vérifiés',
  'Réponse en moins de 24h',
  'Données protégées',
] as const

type RequestAServicePageProps = {
  initialServiceId?: string
}

export default function RequestAServicePage({ initialServiceId }: RequestAServicePageProps) {
  return (
    <section
      className="page-hero-bg flex min-h-screen w-full min-w-0 flex-col items-center overflow-x-hidden px-[4%] pt-8 pb-24 sm:px-[5%] sm:pt-12 sm:pb-32"
    >
      {/* ─── Page header ─── */}
      <div className="mb-12 w-full min-w-0 max-w-145 animate-hero-fade-down text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border-[1.5px] border-blue-light bg-appCard px-3.5 py-1.5 text-[12px] font-semibold text-primaryColor shadow-[0_2px_8px_rgba(27,79,255,0.1)]">
          <span className="size-1.5 shrink-0 animate-hero-pulse rounded-full bg-trust-green" />
          Gratuit &amp; sans engagement
        </div>

        <h1 className="mb-3 text-[clamp(30px,4vw,44px)] font-extrabold leading-[1.1] tracking-[-1.2px] text-appText">
          Trouvez le bon professionnel{' '}
          <span className="text-primaryColor">près de chez vous</span>
        </h1>

        <p className="text-[16px] leading-[1.65] text-appTextSec">
          Décrivez votre besoin en quelques secondes et recevez jusqu&apos;à 5 devis de pros
          vérifiés sous 24h.
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-2.5">
          {TRUST_PILLS.map((pill) => (
            <div
              key={pill}
              className="flex items-center gap-1.5 rounded-full border border-appBorder bg-appCard px-3 py-1.5 text-[12px] font-medium text-appTextSec shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
            >
              <svg
                width="13"
                height="13"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                className="text-trust-green"
                aria-hidden
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              {pill}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Multi-step form card ─── */}
      <div className="w-full min-w-0 max-w-155">
        <RequestAServiceForm initialServiceId={initialServiceId} />
      </div>
    </section>
  )
}
