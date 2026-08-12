'use client'

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN: OTP Verification (phone or email)
// Shown when the API returns PHONE_VERIFICATION_REQUIRED / EMAIL_VERIFICATION_REQUIRED.
// Collects the 6-digit code, calls the verify API, then triggers onVerified()
// which either shows the success screen or re-submits the service request.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { FiArrowLeft, FiMail, FiSmartphone } from 'react-icons/fi'
import {
  useVerifyPhoneMutation,
  useVerifyEmailMutation,
  useResendPhoneOtpMutation,
  useResendEmailVerificationMutation,
} from '@/redux/rtkQueries/authApi'
import { setAuthCookies, type AuthResponseData } from '@/utils/authCookies'
import { setClientAuthenticated, setUserRole } from '@/redux/slices/authSlice'
interface OtpVerificationScreenProps {
  type: 'phone' | 'email'
  contact: string
  submissionRef: string | null
  onVerified: () => void
  onBack: () => void
}

export default function OtpVerificationScreen({
  type,
  contact,
  submissionRef,
  onVerified,
  onBack,
}: OtpVerificationScreenProps) {
  const dispatch = useDispatch()
  const [verifyPhone] = useVerifyPhoneMutation()
  const [verifyEmail] = useVerifyEmailMutation()
  const [resendPhoneOtp] = useResendPhoneOtpMutation()
  const [resendEmailVerification] = useResendEmailVerificationMutation()

  const [digits, setDigits] = useState<string[]>(Array(4).fill(''))
  const [otpError, setOtpError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const otp = digits.join('')
  const otpFull = otp.replace(/\s/g, '').length === 4

  function handleDigitChange(idx: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[idx] = digit
    setDigits(next)
    setOtpError(null)
    if (digit && idx < 3) inputRefs.current[idx + 1]?.focus()
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (digits[idx]) {
        const next = [...digits]
        next[idx] = ''
        setDigits(next)
      } else if (idx > 0) {
        inputRefs.current[idx - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    } else if (e.key === 'ArrowRight' && idx < 3) {
      inputRefs.current[idx + 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    const next = Array(4).fill('')
    pasted.split('').forEach((ch, i) => { next[i] = ch })
    setDigits(next)
    inputRefs.current[Math.min(pasted.length, 3)]?.focus()
  }

  async function handleVerify() {
    if (!otpFull) {
      setOtpError('Veuillez entrer le code complet à 4 chiffres.')
      return
    }
    setOtpError(null)
    setIsVerifying(true)
    try {
      const trimmedContact = contact.trim()
      const res: { data?: AuthResponseData } = type === 'phone'
        ? await verifyPhone({
            otp,
            phone: trimmedContact,
          }).unwrap()
        : await verifyEmail({ otp, email: trimmedContact }).unwrap()

      // Persist token + user in cookies and update Redux auth state
      if (res?.data) {
        setAuthCookies(res.data)
        const role = typeof res.data.role === 'string'
          ? res.data.role
          : (res.data.role?.name ?? null)
        dispatch(setUserRole(role ?? null))
        dispatch(setClientAuthenticated(true))
      }

      onVerified()
    } catch (err) {
      const msg = (err as { data?: { message?: string } })?.data?.message
      setOtpError(msg ?? 'Code invalide. Veuillez réessayer.')
    } finally {
      setIsVerifying(false)
    }
  }

  async function handleResend() {
    setIsResending(true)
    setOtpError(null)
    setResendSuccess(false)
    try {
      const trimmedContact = contact.trim()
      if (type === 'phone') {
        await resendPhoneOtp({
          phone: trimmedContact,
        }).unwrap()
      } else {
        await resendEmailVerification({ email: trimmedContact }).unwrap()
      }
      setCountdown(60)
      setResendSuccess(true)
    } catch (err) {
      const msg = (err as { data?: { message?: string } })?.data?.message
      setOtpError(msg ?? 'Erreur lors du renvoi. Veuillez réessayer.')
    } finally {
      setIsResending(false)
    }
  }

  const isPhone = type === 'phone'
  const trimmedContact = contact.trim()
  const accentBg = isPhone ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)'
  const icon = isPhone
    ? <FiSmartphone className="size-7 text-trust-green" aria-hidden />
    : <FiMail className="size-7 text-amber" aria-hidden />
  const title = isPhone ? 'Vérifiez votre numéro' : 'Vérifiez votre e-mail'
  const subtitle = isPhone
    ? `Un code de vérification a été envoyé par SMS au ${trimmedContact}. Saisissez-le ci-dessous.`
    : `Un code de vérification a été envoyé à ${trimmedContact}. Saisissez-le ci-dessous.`

  return (
    <div className="animate-inscription-fade-up py-2 text-center">
      <div
        className="mx-auto mb-4 flex size-17 animate-inscription-pop-in items-center justify-center rounded-full text-[28px]"
        style={{ background: accentBg }}
      >
        {icon}
      </div>

      <h3 className="mb-1.5 text-[20px] font-extrabold tracking-[-0.3px] text-appText">
        {title}
      </h3>
      <p
        className="mx-auto mb-1 text-[13px] leading-[1.6] text-appTextSec"
        style={{ maxWidth: 360 }}
      >
        {subtitle}
      </p>

      {submissionRef && (
        <div className="mb-4 mt-2 inline-flex items-center gap-1.5 rounded-full border border-appBorder bg-appSurface px-3 py-1 text-[12px]">
          <span className="text-appTextMuted">Référence :</span>
          <span className="font-bold text-appText">{submissionRef}</span>
        </div>
      )}

      {/* OTP digit boxes */}
      <div className="mb-3 mt-5 flex justify-center gap-2" onPaste={handlePaste}>
        {digits.map((d, idx) => (
          <input
            key={idx}
            ref={(el) => { inputRefs.current[idx] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleDigitChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className={[
              'h-12 w-10 rounded-[10px] border-[1.5px] bg-appSurface text-center text-[20px] font-bold text-appText outline-none transition-all',
              otpError
                ? 'border-red-500'
                : d
                  ? 'border-primaryColor bg-blue-light dark:bg-primary-icon-bg'
                  : 'border-appBorder focus:border-primaryColor focus:shadow-[0_0_0_3px_var(--color-primary-dim)]',
            ].join(' ')}
            aria-label={`Chiffre ${idx + 1}`}
          />
        ))}
      </div>

      {otpError && (
        <p className="mb-2 text-[12px] font-medium text-red-500">{otpError}</p>
      )}
      {resendSuccess && !otpError && (
        <p className="mb-2 text-[12px] font-medium text-trust-green">
          Code renvoyé avec succès !
        </p>
      )}

      <div className="mx-auto mt-4 w-full max-w-70">
        <div className="mb-2 flex items-center justify-center text-[13px] text-appTextSec">
          {countdown > 0 ? (
            <span>
              Renvoyer le code dans{' '}
              <span className="font-semibold text-appText">{countdown}s</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-semibold text-primaryColor underline-offset-2 hover:underline disabled:opacity-60"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {isResending ? 'Envoi en cours…' : 'Renvoyer le code'}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleVerify}
          disabled={isVerifying || !otpFull}
          className="mb-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-none py-2.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(27,79,255,0.28)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-60"
          style={{ background: 'var(--color-primaryColor)', fontFamily: 'inherit' }}
        >
          {isVerifying ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Vérification…
            </>
          ) : (
            'Confirmer le code'
          )}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-appBorder bg-appCard py-2.5 text-[14px] font-medium text-appTextSec transition-all hover:border-appBorder dark:hover:border-slate-600 hover:bg-appSurface"
          style={{ fontFamily: 'inherit' }}
        >
          <FiArrowLeft size={14} strokeWidth={2.5} />
          Retour à la demande
        </button>
      </div>
    </div>
  )
}
