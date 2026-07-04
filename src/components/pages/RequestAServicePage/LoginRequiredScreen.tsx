'use client'

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: Login Required (email or phone)
// Shown when the API returns LOGIN_REQUIRED — the submitted contact already
// belongs to an existing account. Prompts the user to log in instead.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { getLoginPageRoutePath } from '@/routes/routes'

interface LoginRequiredScreenProps {
  loginType: 'email' | 'phone'
  onBack: () => void
}

export default function LoginRequiredScreen({ loginType, onBack }: LoginRequiredScreenProps) {
  return (
    <div className="animate-inscription-fade-up py-2 text-center">
      <div
        className="mx-auto mb-5 flex size-[68px] animate-inscription-pop-in items-center justify-center rounded-full text-[28px]"
        style={{ background: 'rgba(27,79,255,0.12)' }}
      >
        🔐
      </div>

      <h3 className="mb-2 text-[20px] font-extrabold tracking-[-0.3px] text-appText">
        Connexion requise
      </h3>
      <p
        className="mx-auto mb-7 text-[13px] leading-[1.65] text-appTextSec"
        style={{ maxWidth: 360 }}
      >
        {loginType === 'email'
          ? 'Cette adresse e-mail est déjà associée à un compte. Connectez-vous pour continuer.'
          : 'Ce numéro de téléphone est déjà associé à un compte. Connectez-vous pour continuer.'}
      </p>

      <Link
        href={getLoginPageRoutePath()}
        className="mb-3 flex w-full items-center justify-center gap-2 rounded-[12px] py-3.5 text-[15px] font-semibold text-white no-underline transition-all hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(27,79,255,0.28)]"
        style={{ background: 'var(--color-primaryColor)' }}
      >
        Se connecter
        <FiArrowRight size={16} strokeWidth={2.5} />
      </Link>

      <button
        type="button"
        onClick={onBack}
        className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-[12px] border-[1.5px] border-appBorder bg-appCard py-3 text-[14px] font-medium text-appTextSec transition-all hover:border-appBorder dark:hover:border-slate-600 hover:bg-appSurface"
        style={{ fontFamily: 'inherit' }}
      >
        <FiArrowLeft size={14} strokeWidth={2.5} />
        Retour à la demande
      </button>
    </div>
  )
}
