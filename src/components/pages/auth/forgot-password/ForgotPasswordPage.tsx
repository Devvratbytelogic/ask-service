'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FiEye, FiEyeOff, FiArrowRight, FiArrowLeft, FiLock } from 'react-icons/fi'
import { addToast } from '@heroui/react'
import { yupRequiredEmail } from '@/utils/validation'
import { getLoginPageRoutePath } from '@/routes/routes'
import LeftPanel from '@/components/pages/auth/login/LeftPanel'
import AuthMobileHeader from '@/components/common/AuthMobileHeader'
import AuthThemeToggle from '@/components/common/AuthThemeToggle'
import OtpInput from '@/components/library/OtpInput'
import {
  useForgotPasswordMutation,
  useNewPasswordMutation,
  useResendEmailVerificationMutation,
  useVendorNewPasswordMutation,
  useVerifyEmailMutation,
} from '@/redux/rtkQueries/authApi'
import { useRouter, useSearchParams } from 'next/navigation'
import { getFcmTokenFromCookie } from '@/firebase/getFcmTokenn'
import { setResetTokenForNextRequest } from '@/utils/authCookies'

const OTP_LENGTH = 4
const RESEND_COOLDOWN_SEC = 59

type Step = 'enter-email' | 'verify-otp' | 'set-password'

interface EmailFormValues {
  email: string
}

interface PasswordFormValues {
  password: string
  confirmPassword: string
}

const emailSchema = Yup.object<EmailFormValues>({
  email: yupRequiredEmail('Ce champ est obligatoire'),
})

const passwordSchema = Yup.object<PasswordFormValues>({
  password: Yup.string()
    .trim()
    .min(8, 'Votre nouveau mot de passe doit avoir au moins 8 caractères pour sécuriser votre compte.')
    .required('Ce champ est obligatoire'),
  confirmPassword: Yup.string()
    .trim()
    .oneOf([Yup.ref('password')], 'Les mots de passe ne correspondent pas.')
    .required('Ce champ est obligatoire'),
})

type Role = 'customer' | 'vendor'

interface ForgotPasswordPageProps {
  logoUrl?: string | null
  logoDarkUrl?: string | null
  vendorLogoUrl?: string | null
  vendorLogoDarkUrl?: string | null
  // activeVendorsCount?: number
  // activeClientsCount?: number
  // averageRating?: number
}

export default function ForgotPasswordPage({
  logoUrl,
  logoDarkUrl,
  vendorLogoUrl,
  vendorLogoDarkUrl,
  // activeVendorsCount,
  // activeClientsCount,
  // averageRating,
}: ForgotPasswordPageProps = {}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fcmToken = getFcmTokenFromCookie()
  const roleParam = searchParams.get('role')
  const role: Role = roleParam === 'vendor' ? 'vendor' : 'customer'
  const isVendorBranding = role === 'vendor'

  const [step, setStep] = useState<Step>('enter-email')
  const [email, setEmail] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [isVendor, setIsVendor] = useState(false)
  const [otpValue, setOtpValue] = useState('')
  const [otpError, setOtpError] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [forgotPassword, { isLoading: isSending }] = useForgotPasswordMutation()
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation()
  const [resendEmailVerification, { isLoading: isResending }] = useResendEmailVerificationMutation()
  const [newPassword, { isLoading: isSubmittingUser }] = useNewPasswordMutation()
  const [vendorNewPassword, { isLoading: isSubmittingVendor }] = useVendorNewPasswordMutation()

  const isSubmittingPassword = isSubmittingUser || isSubmittingVendor
  const activeLogoUrl = isVendorBranding ? vendorLogoUrl : logoUrl
  const activeLogoDarkUrl = isVendorBranding ? vendorLogoDarkUrl : logoDarkUrl
  const accentColor = isVendorBranding ? 'var(--color-amber)' : 'var(--color-primaryColor)'
  const accentTextColor = isVendorBranding ? 'var(--color-slate-900)' : 'white'
  const accentShadow = isVendorBranding ? 'rgba(245,158,11,0.3)' : 'rgba(27,79,255,0.28)'
  const accentDim = isVendorBranding ? 'var(--color-amber-dim)' : 'var(--color-primary-dim)'
  const accentBorder = isVendorBranding ? 'rgba(245,158,11,0.25)' : 'rgba(27,79,255,0.25)'

  const emailForm = useFormik<EmailFormValues>({
    initialValues: { email: '' },
    validationSchema: emailSchema,
    onSubmit: async (values) => {
      const trimmedEmail = values.email.trim()
      try {
        await forgotPassword({ email: trimmedEmail }).unwrap()
        setEmail(trimmedEmail)
        setOtpValue('')
        setOtpError('')
        setStep('verify-otp')
        addToast({
          title: 'Code de vérification envoyé',
          description: 'Vérifiez votre e-mail.',
          color: 'success',
          timeout: 2000,
        })
      } catch {
        // Error toast from rtkQuerieSetup
      }
    },
  })

  const passwordForm = useFormik<PasswordFormValues>({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema: passwordSchema,
    onSubmit: async (values) => {
      const payload = {
        password: values.password,
        confirm_password: values.confirmPassword,
      }
      try {
        if (resetToken) setResetTokenForNextRequest(resetToken)
        try {
          if (isVendor) {
            await vendorNewPassword(payload).unwrap()
          } else {
            await newPassword(payload).unwrap()
          }
          addToast({
            title: 'Mot de passe mis à jour',
            description: 'Vous pouvez vous connecter avec votre nouveau mot de passe.',
            color: 'success',
            timeout: 3000,
          })
          router.push(getLoginPageRoutePath({ role }))
        } finally {
          if (resetToken) setResetTokenForNextRequest(null)
        }
      } catch {
        // Error toast from rtkQuerieSetup
      }
    },
  })

  const handleVerifyOtp = useCallback(async (otp?: string) => {
    const code = otp ?? otpValue
    if (code.length !== OTP_LENGTH || !email) return
    setOtpError('')
    try {
      const res = await verifyEmail({
        email,
        otp: code,
        ...(fcmToken && { fcm_token: fcmToken }),
      }).unwrap()
      const responseData = res?.data as Record<string, unknown> | undefined
      const token =
        (responseData?.token as string) ?? (responseData?.access_token as string) ?? ''
      const roleName = (responseData?.role as { name?: string })?.name ?? ''
      setResetToken(token)
      setIsVendor(String(roleName).toLowerCase() === 'vendor')
      setStep('set-password')
    } catch {
      setOtpError('Code incorrect ou expiré. Veuillez réessayer.')
    }
  }, [otpValue, email, verifyEmail, fcmToken])

  const handleResendOtp = useCallback(async () => {
    if (resendCooldown > 0 || !email) return
    try {
      await resendEmailVerification({ email }).unwrap()
      setResendCooldown(RESEND_COOLDOWN_SEC)
      setOtpValue('')
      setOtpError('')
      addToast({
        title: 'Code de vérification envoyé',
        description: 'Vérifiez votre e-mail.',
        color: 'success',
        timeout: 2000,
      })
    } catch {
      // Error toast from rtkQuerieSetup
    }
  }, [resendCooldown, email, resendEmailVerification])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => setResendCooldown((c) => (c <= 0 ? 0 : c - 1)), 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  function backToEmailStep() {
    setStep('enter-email')
    setOtpValue('')
    setOtpError('')
  }

  const stepTitle =
    step === 'enter-email'
      ? 'Mot de passe oublié'
      : step === 'verify-otp'
        ? 'Vérification'
        : 'Nouveau mot de passe'

  const stepSubtitle =
    step === 'enter-email'
      ? 'Saisissez votre adresse e-mail pour réinitialiser votre mot de passe'
      : step === 'verify-otp'
        ? 'Entrez le code envoyé à votre adresse e-mail'
        : 'Votre mot de passe doit contenir au moins 8 caractères'

  return (
    <div
      className="flex min-h-screen max-[900px]:flex-col"
      style={{ display: 'grid', gridTemplateColumns: '420px 1fr' }}
    >
      {/* <LeftPanel
        role={role}
        logoUrl={activeLogoDarkUrl}
        activeVendorsCount={activeVendorsCount}
        activeClientsCount={activeClientsCount}
        averageRating={averageRating}
      /> */}
      <LeftPanel
        role={role}
        logoUrl={activeLogoDarkUrl}
      />

      <div className="relative flex min-h-screen flex-col items-center bg-appSurface px-4 py-6 min-[901px]:justify-center min-[901px]:px-[5%] min-[901px]:py-12">
        <AuthThemeToggle />
        <div className="w-full" style={{ maxWidth: 440 }}>
          <AuthMobileHeader logoUrl={activeLogoUrl} accentColor={accentColor} />
          <div className="mb-8 text-center">
            <h3
              className="mb-1.5 text-appText"
              style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px' }}
            >
              {stepTitle}
            </h3>
            <p className="text-[14px] text-appTextSec">{stepSubtitle}</p>
          </div>

          <div
            className="overflow-hidden rounded-[20px] border border-appBorder bg-appCard"
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: '32px' }}
          >
            {step === 'enter-email' && (
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault()
                  emailForm.handleSubmit()
                }}
              >
                <div className="mb-6">
                  <label className="mb-1.5 block text-[13px] font-semibold text-appText">
                    Adresse email
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="votre@email.com"
                    autoComplete="email"
                    value={emailForm.values.email}
                    onChange={emailForm.handleChange}
                    onBlur={emailForm.handleBlur}
                    className={[
                      'w-full rounded-[10px] border-[1.5px] py-3 px-4 text-[14px] text-appText outline-none transition-all placeholder:text-placeHolderText',
                      emailForm.touched.email && emailForm.errors.email
                        ? 'border-red-500 bg-red-light'
                        : 'border-appBorder bg-appSurface hover:border-appBorder',
                    ].join(' ')}
                    style={{ fontFamily: 'inherit' }}
                    onFocus={(e) => {
                      if (!(emailForm.touched.email && emailForm.errors.email)) {
                        e.currentTarget.style.borderColor = accentColor
                        e.currentTarget.style.background = 'var(--app-card)'
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${accentBorder}`
                      }
                    }}
                    onBlurCapture={(e) => {
                      e.currentTarget.style.borderColor = ''
                      e.currentTarget.style.background = ''
                      e.currentTarget.style.boxShadow = ''
                    }}
                  />
                  {emailForm.touched.email && emailForm.errors.email && (
                    <p className="mt-1 text-[11px] text-red-500">{emailForm.errors.email}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] border-none py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
                  style={{
                    background: accentColor,
                    color: accentTextColor,
                    boxShadow: `0 5px 16px ${accentShadow}`,
                    fontFamily: 'inherit',
                  }}
                >
                  {isSending ? (
                    <>
                      <span
                        className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
                        style={{ opacity: 0.6 }}
                      />
                      Envoi…
                    </>
                  ) : (
                    <>
                      Suivant
                      <FiArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            )}

            {step === 'verify-otp' && (
              <div className="animate-inscription-fade-up">
                <button
                  type="button"
                  onClick={backToEmailStep}
                  className="mb-5 flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-appTextSec transition-colors hover:text-appText"
                  style={{ fontFamily: 'inherit', background: 'none', border: 'none', padding: 0 }}
                >
                  <FiArrowLeft size={14} />
                  Modifier l&apos;e-mail
                </button>

                <div className="mb-6 flex justify-center">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-primaryColor"
                    style={{ background: accentDim }}
                  >
                    <FiLock className="size-7" aria-hidden />
                  </div>
                </div>

                <p className="mb-6 text-center text-[13px] text-appTextSec">
                  Un code à {OTP_LENGTH} chiffres a été envoyé à{' '}
                  <span className="font-semibold text-appText">{email}</span>
                </p>

                <div className="mb-2 flex justify-center">
                  <OtpInput
                    value={otpValue}
                    onChange={(value) => {
                      setOtpValue(value)
                      setOtpError('')
                    }}
                    length={OTP_LENGTH}
                    onComplete={handleVerifyOtp}
                    classNames={{ wrapper: 'flex gap-3 justify-center' }}
                    ariaLabelPrefix="Chiffre"
                  />
                </div>

                {otpError && (
                  <p className="mt-1.5 text-center text-[12px] text-red-500">{otpError}</p>
                )}

                <p className="mt-4 text-center text-[13px] text-appTextSec">
                  Vous n&apos;avez pas reçu le code ?{' '}
                  {resendCooldown > 0 ? (
                    <span style={{ color: accentColor }}>Renvoyer dans {resendCooldown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isResending}
                      className="cursor-pointer font-semibold underline underline-offset-2 disabled:opacity-50"
                      style={{ color: accentColor, background: 'none', border: 'none', padding: 0, fontFamily: 'inherit' }}
                    >
                      {isResending ? 'Envoi…' : 'Renvoyer'}
                    </button>
                  )}
                </p>

                <button
                  type="button"
                  onClick={() => handleVerifyOtp()}
                  disabled={otpValue.length !== OTP_LENGTH || isVerifying}
                  className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] border-none py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
                  style={{
                    background: accentColor,
                    color: accentTextColor,
                    boxShadow: `0 5px 16px ${accentShadow}`,
                    fontFamily: 'inherit',
                  }}
                >
                  {isVerifying ? (
                    <>
                      <span
                        className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
                        style={{ opacity: 0.6 }}
                      />
                      Vérification…
                    </>
                  ) : (
                    <>
                      Vérifier
                      <FiArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            )}

            {step === 'set-password' && (
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault()
                  passwordForm.handleSubmit()
                }}
              >
                <div className="mb-4">
                  <label className="mb-1.5 block text-[13px] font-semibold text-appText">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      value={passwordForm.values.password}
                      onChange={passwordForm.handleChange}
                      onBlur={passwordForm.handleBlur}
                      className={[
                        'w-full rounded-[10px] border-[1.5px] py-3 pl-4 pr-11 text-[14px] text-appText outline-none transition-all placeholder:text-placeHolderText',
                        passwordForm.touched.password && passwordForm.errors.password
                          ? 'border-red-500 bg-red-light'
                          : 'border-appBorder bg-appSurface hover:border-appBorder',
                      ].join(' ')}
                      style={{ fontFamily: 'inherit' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-appTextMuted transition-colors hover:text-appText"
                      aria-label="Afficher/masquer le mot de passe"
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  {passwordForm.touched.password && passwordForm.errors.password && (
                    <p className="mt-1 text-[11px] text-red-500">{passwordForm.errors.password}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="mb-1.5 block text-[13px] font-semibold text-appText">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      value={passwordForm.values.confirmPassword}
                      onChange={passwordForm.handleChange}
                      onBlur={passwordForm.handleBlur}
                      className={[
                        'w-full rounded-[10px] border-[1.5px] py-3 pl-4 pr-11 text-[14px] text-appText outline-none transition-all placeholder:text-placeHolderText',
                        passwordForm.touched.confirmPassword && passwordForm.errors.confirmPassword
                          ? 'border-red-500 bg-red-light'
                          : 'border-appBorder bg-appSurface hover:border-appBorder',
                      ].join(' ')}
                      style={{ fontFamily: 'inherit' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((p) => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-appTextMuted transition-colors hover:text-appText"
                      aria-label="Afficher/masquer le mot de passe"
                    >
                      {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  {passwordForm.touched.confirmPassword && passwordForm.errors.confirmPassword && (
                    <p className="mt-1 text-[11px] text-red-500">{passwordForm.errors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingPassword}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] border-none py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
                  style={{
                    background: accentColor,
                    color: accentTextColor,
                    boxShadow: `0 5px 16px ${accentShadow}`,
                    fontFamily: 'inherit',
                  }}
                >
                  {isSubmittingPassword ? (
                    <>
                      <span
                        className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
                        style={{ opacity: 0.6 }}
                      />
                      Mise à jour…
                    </>
                  ) : (
                    <>
                      Réinitialiser mon mot de passe
                      <FiArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <p className="mt-6 text-center text-[13px] text-appTextSec">
            Mot de passe retrouvé ?{' '}
            <Link
              href={getLoginPageRoutePath({ role })}
              className="font-semibold no-underline hover:underline"
              style={{ color: accentColor }}
            >
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
