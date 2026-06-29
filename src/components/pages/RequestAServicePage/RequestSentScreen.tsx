'use client'

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: Request Sent (success)
// Shown after the service request is successfully created (REQUEST_CREATED flow
// or any 2xx without a special redirect flow). Displays the reference number
// and a next-steps summary, then links the user to their requests list.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import { getClientDashboardPageRoutePath } from '@/routes/routes'

const SUCCESS_STEPS = [
  'Les professionnels reçoivent votre demande et préparent leurs devis',
  "Vous recevez jusqu'à 5 devis dans votre espace client sous 24h",
  'Vous choisissez le professionnel qui vous convient le mieux',
] as const

interface RequestSentScreenProps {
  submissionRef: string | null
  variant?: 'create' | 'edit'
}

export default function RequestSentScreen({
  submissionRef,
  variant = 'create',
}: RequestSentScreenProps) {
  const isEdit = variant === 'edit'

  return (
    <div className="animate-inscription-fade-up py-3 text-center">
      <div className="mx-auto mb-5 flex size-[68px] animate-inscription-pop-in items-center justify-center rounded-full bg-green-light dark:bg-green-icon-bg text-[30px] text-trust-green">
        ✓
      </div>

      <h3 className="mb-2 text-[22px] font-extrabold tracking-[-0.4px] text-appText">
        {isEdit ? 'Demande mise à jour !' : 'Demande envoyée !'}
      </h3>

      {submissionRef && (
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-appBorder bg-appSurface px-3 py-1 text-[12px] font-semibold text-appTextSec">
          <span className="text-appTextMuted">Référence :</span>
          <span className="font-bold text-appText">{submissionRef}</span>
        </div>
      )}

      <p
        className="mx-auto mb-7 text-[14px] leading-[1.65] text-appTextSec"
        style={{ maxWidth: 360 }}
      >
        {isEdit
          ? 'Vos modifications ont bien été enregistrées. Les professionnels verront les détails mis à jour.'
          : 'Votre demande a bien été transmise. Les professionnels vérifiés vont vous envoyer leurs devis sous 24h.'}
      </p>

      {!isEdit && (
        <div className="mb-7 flex flex-col gap-2 text-left">
          {SUCCESS_STEPS.map((text, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-[10px] border border-appBorderSub bg-appSurface px-3.5 py-2.5"
            >
              <div className="flex size-[26px] shrink-0 items-center justify-center rounded-[8px] bg-blue-light dark:bg-[rgba(27,79,255,0.2)] text-[12px] font-extrabold text-primaryColor">
                {i + 1}
              </div>
              <span className="text-[13px] text-appTextSec">{text}</span>
            </div>
          ))}
        </div>
      )}

      <Link
        href={getClientDashboardPageRoutePath()}
        className="flex w-full items-center justify-center gap-2 rounded-[12px] py-3.5 text-[15px] font-semibold text-white no-underline transition-all hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(27,79,255,0.28)]"
        style={{ background: 'var(--color-primaryColor)' }}
      >
        Voir mes demandes
        <FiArrowRight size={16} strokeWidth={2.5} />
      </Link>
    </div>
  )
}
