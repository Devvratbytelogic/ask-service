'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FiEye, FiEyeOff, FiArrowRight, FiCheck, FiAlertCircle, FiArrowLeft, FiLock } from 'react-icons/fi'
import { addToast } from '@heroui/react'
import { yupRequiredEmail } from '@/utils/validation'
import {
  generateLeadDetailRoutePath,
  getClientDashboardPageRoutePath,
  getDashboardPageRoutePathForRole,
  getForgotPasswordRoutePath,
  getLoginPageRoutePath,
  getRegistrationPageRoutePath,
} from '@/routes/routes'
import AuthMobileHeader from '@/components/common/AuthMobileHeader'
import AuthThemeToggle from '@/components/common/AuthThemeToggle'
import LeftPanel from './LeftPanel'
import OtpInput from '@/components/library/OtpInput'
import {
  useLoginMutation,
  useResendEmailVerificationMutation,
  useVerifyEmailMutation,
} from '@/redux/rtkQueries/authApi'
import { useLazyGetVendorAvailableLeadsQuery } from '@/redux/rtkQueries/clientSideGetApis'
import { useRouter, useSearchParams } from 'next/navigation'
import { setAuthAndRefetchProfile } from '@/redux/authOnSuccess'
import { AuthResponseData, getIsClientFromAuthData } from '@/utils/authCookies'
import { useDispatch } from 'react-redux'
import { loginWithGoogle } from '@/firebase/GoogleLogin'
import { getFcmTokenFromCookie } from '@/firebase/getFcmTokenn'

const OTP_LENGTH = 4
const RESEND_COOLDOWN_SEC = 59

type LoginApiResponse = {
  http_status_code?: number
  message?: string
  data?: {
    flow?: string
    role?: string
    token?: string
    access_token?: string
  } & AuthResponseData
}

function getRtkErrorMessage(error: unknown): string {
  const err = error as { data?: { message?: string }; message?: string }
  return err?.data?.message ?? err?.message ?? "Une erreur inattendue s'est produite"
}

function isEmailVerificationRequired(response: unknown): boolean {
  const res = response as LoginApiResponse
  return res?.data?.flow === 'EMAIL_VERIFICATION_REQUIRED'
}


// ─── Types ───────────────────────────────────────────────────────────────────
type Role = 'customer' | 'vendor'

interface LoginFormValues {
  email: string
  password: string
  rememberMe: boolean
}

// ─── Validation ───────────────────────────────────────────────────────────────
const loginSchema = Yup.object<LoginFormValues>({
  email: yupRequiredEmail('Ce champ est obligatoire'),
  password: Yup.string().required('Ce champ est obligatoire'),
  rememberMe: Yup.boolean().notRequired(),
})

// ─── Google icon ─────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
interface LoginPageProps {
  logoUrl?: string | null
  logoDarkUrl?: string | null
  vendorLogoUrl?: string | null
  vendorLogoDarkUrl?: string | null
  activeVendorsCount?: number
  activeClientsCount?: number
  averageRating?: number
}

export default function LoginPage({
  logoUrl,
  logoDarkUrl,
  vendorLogoUrl,
  vendorLogoDarkUrl,
  activeVendorsCount,
  activeClientsCount,
  averageRating,
}: LoginPageProps = {}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch()
  const fcmToken = getFcmTokenFromCookie()
  const roleParam = searchParams.get('role')
  const role: Role = roleParam === 'vendor' ? 'vendor' : 'customer'
  const [showPassword, setShowPassword] = useState(false)
  const [shake, setShake] = useState(false)
  const [serverError, setServerError] = useState('')
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState('')
  const [otpValue, setOtpValue] = useState('')
  const [otpError, setOtpError] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  const [login, { isLoading }] = useLoginMutation()
  const [verifyEmail, { isLoading: isVerifyingOtp }] = useVerifyEmailMutation()
  const [resendEmailVerification, { isLoading: isResendingOtp }] = useResendEmailVerificationMutation()
  const [fetchAvailableLeads] = useLazyGetVendorAvailableLeadsQuery()

  const isVendor = role === 'vendor'
  const isLoginBusy = isLoading || isRedirecting
  const isOtpBusy = isVerifyingOtp || isRedirecting
  const isGoogleBusy = isGoogleLoading || isRedirecting
  const activeLogoUrl = isVendor ? vendorLogoUrl : logoUrl
  const accentColor = isVendor ? 'var(--color-amber)' : 'var(--color-primaryColor)'
  const accentTextColor = isVendor ? 'var(--color-slate-900)' : 'white'
  const accentShadow = isVendor ? 'rgba(245,158,11,0.3)' : 'rgba(27,79,255,0.28)'
  const accentDim = isVendor ? 'var(--color-amber-dim)' : 'var(--color-primary-dim)'
  const accentBorder = isVendor ? 'rgba(245,158,11,0.25)' : 'rgba(27,79,255,0.25)'
  const activeLogoDarkUrl = isVendor ? vendorLogoDarkUrl : logoDarkUrl

  function triggerShake() {
    setShake(true)
    setTimeout(() => setShake(false), 450)
  }

  function startEmailVerificationFlow(email: string, message?: string) {
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      const msg = message ?? "Vérification de l'e-mail requise"
      setServerError(msg)
      addToast({ title: msg, color: 'warning', timeout: 3000 })
      return
    }
    setVerificationEmail(trimmedEmail)
    setShowEmailVerification(true)
    setOtpValue('')
    setOtpError('')
    setServerError('')
    addToast({
      title: message ?? "Vérification de l'e-mail requise",
      description: `Un code a été envoyé à ${trimmedEmail}`,
      color: 'warning',
      timeout: 3000,
    })
  }

  const getPostLoginDashboardPath = useCallback(async (
    data: AuthResponseData,
    fromCustomerTab: boolean,
  ): Promise<string> => {
    if (fromCustomerTab && getIsClientFromAuthData(data)) {
      return getClientDashboardPageRoutePath()
    }

    const roleValue = typeof data.role === 'string' ? data.role : data.role?.name
    const isVendorRole = String(roleValue ?? '').toLowerCase() === 'vendor'

    if (!fromCustomerTab && isVendorRole) {
      try {
        const response = await fetchAvailableLeads({
          page: 1,
          limit: 20,
          unlocked: false,
        }).unwrap()
        const firstLeadId = response?.data?.items?.[0]?._id
        if (firstLeadId) {
          return generateLeadDetailRoutePath(firstLeadId)
        }
      } catch (error) {
        console.error('Error fetching available leads', error)
      }
    }

    return getDashboardPageRoutePathForRole(data.role)
  }, [fetchAvailableLeads])

  const redirectAfterLogin = useCallback(async (
    data: AuthResponseData,
    fromCustomerTab: boolean,
  ) => {
    setIsRedirecting(true)
    try {
      const path = await getPostLoginDashboardPath(data, fromCustomerTab)
      router.replace(path)
    } catch {
      router.replace(getDashboardPageRoutePathForRole(data.role))
      setIsRedirecting(false)
    }
  }, [getPostLoginDashboardPath, router])

  async function handleLoginSuccess(response: LoginApiResponse) {
    const responseData = response?.data
    if (responseData?.token ?? responseData?.access_token) {
      const fromCustomerTab = !isVendor
      const authData = responseData as AuthResponseData
      setAuthAndRefetchProfile(authData, dispatch, { preferClientView: fromCustomerTab })
      router.refresh()
      await redirectAfterLogin(authData, fromCustomerTab)
      addToast({ title: 'Connexion réussie', color: 'success', timeout: 2000 })
    }
  }

  const handleVerifyOtp = useCallback(async (otp?: string) => {
    const code = otp ?? otpValue
    if (code.length !== OTP_LENGTH || !verificationEmail) return
    setOtpError('')
    try {
      const res = await verifyEmail({
        email: verificationEmail,
        otp: code,
        ...(fcmToken && { fcm_token: fcmToken }),
      }).unwrap()
      const responseData = (res as LoginApiResponse)?.data
      if (responseData && typeof responseData === 'object') {
        const fromCustomerTab = !isVendor
        const authData = responseData as AuthResponseData
        setAuthAndRefetchProfile(authData, dispatch, { preferClientView: fromCustomerTab })
        router.refresh()
        await redirectAfterLogin(authData, fromCustomerTab)
      }
      addToast({ title: 'Connexion réussie', color: 'success', timeout: 2000 })
    } catch {
      setOtpError('Code incorrect ou expiré. Veuillez réessayer.')
      setIsRedirecting(false)
    }
  }, [otpValue, verificationEmail, verifyEmail, fcmToken, dispatch, router, isVendor, redirectAfterLogin])

  const handleResendOtp = useCallback(async () => {
    if (resendCooldown > 0 || !verificationEmail) return
    try {
      await resendEmailVerification({ email: verificationEmail }).unwrap()
      setResendCooldown(RESEND_COOLDOWN_SEC)
      setOtpValue('')
      setOtpError('')
      addToast({
        title: 'Code de vérification envoyé',
        description: 'Vérifiez votre e-mail.',
        color: 'success',
        timeout: 2000,
      })
    } catch (error: unknown) {
      addToast({ title: getRtkErrorMessage(error), color: 'danger', timeout: 3000 })
    }
  }, [resendCooldown, verificationEmail, resendEmailVerification])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => setResendCooldown((c) => (c <= 0 ? 0 : c - 1)), 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  function backToLoginForm() {
    setShowEmailVerification(false)
    setVerificationEmail('')
    setOtpValue('')
    setOtpError('')
    setServerError('')
  }

  const formik = useFormik<LoginFormValues>({
    initialValues: { email: '', password: '', rememberMe: false },
    validationSchema: loginSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setServerError('')
      try {
        const response = await login({
          identifier: values.email,
          password: values.password,
          type: isVendor ? 'Vendor' : 'User',
          ...(fcmToken && { fcm_token: fcmToken }),
        }).unwrap() as LoginApiResponse

        if (isEmailVerificationRequired(response)) {
          startEmailVerificationFlow(values.email, response.message)
          return
        }

        if (
          response?.http_status_code === 200 ||
          response?.data?.token ||
          response?.data?.access_token
        ) {
          await handleLoginSuccess(response)
        }
      } catch (error: unknown) {
        const err = error as { data?: { flow?: string; message?: string } }
        if (err?.data?.flow === 'EMAIL_VERIFICATION_REQUIRED') {
          startEmailVerificationFlow(values.email, err.data.message)
          return
        }
        const message = getRtkErrorMessage(error)
        setServerError(message)
        setIsRedirecting(false)
        // addToast({ title: message, color: 'danger', timeout: 3000 })
      }
    },
  })

  const { values, touched, errors, handleChange, handleBlur, setFieldValue } = formik

  async function handleSubmit() {
    setServerError('')
    await formik.setFieldTouched('email', true, false)
    await formik.setFieldTouched('password', true, false)
    const errs = await formik.validateForm()
    if (errs.email || errs.password) {
      triggerShake()
      return
    }
    formik.handleSubmit()
  }

  function switchRole(r: Role) {
    router.replace(getLoginPageRoutePath({ role: r }), { scroll: false })
    setServerError('')
    formik.setErrors({})
    backToLoginForm()
  }

  async function handleGoogleLogin() {
    setIsGoogleLoading(true)
    setServerError('')
    try {
      const roleType = isVendor ? 'Vendor' : 'User'
      const fromCustomerTab = !isVendor
      const res = await loginWithGoogle(roleType)
      const responseData = res?.data as AuthResponseData | undefined
      if (responseData?.token ?? responseData?.access_token) {
        setAuthAndRefetchProfile(responseData, dispatch, { preferClientView: fromCustomerTab })
        router.refresh()
        await redirectAfterLogin(responseData, fromCustomerTab)
        addToast({ title: 'Connexion réussie', color: 'success', timeout: 2000 })
        return
      }
      addToast({ title: 'Connexion terminée', color: 'success', timeout: 2000 })
    } catch (err: unknown) {
      const message = (err as Error & { responseData?: { message?: string } })?.responseData?.message
        ?? (err as Error)?.message
        ?? 'Échec de la connexion Google'
      addToast({ title: message, color: 'danger', timeout: 3000 })
      setIsRedirecting(false)
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const subtitleText = isVendor
    ? 'Accédez à vos leads et gérez votre activité'
    : 'Accédez à votre espace client ou prestataire'

  return (
    <div className="grid min-h-screen grid-cols-1 overflow-x-hidden min-[901px]:grid-cols-[420px_1fr]">
      <LeftPanel role={role} logoUrl={activeLogoDarkUrl} activeVendorsCount={activeVendorsCount} activeClientsCount={activeClientsCount} averageRating={averageRating} />

      {/* ─── Right panel ─── */}
      <div className="relative flex min-h-screen flex-col items-center bg-appSurface px-4 py-6 min-[901px]:justify-center min-[901px]:px-[5%] min-[901px]:py-12">
        <AuthThemeToggle />
        <div className="w-full max-w-110">
          <AuthMobileHeader logoUrl={activeLogoUrl} accentColor={accentColor} />

          {/* Header */}
          <div className="mb-6 text-center min-[901px]:mb-8">
            <h3 className="mb-1.5 text-[22px] font-extrabold tracking-tight text-appText min-[901px]:text-[26px]">
              Connexion
            </h3>
            <p className="text-[13px] text-appTextSec min-[901px]:text-[14px]">{subtitleText}</p>
          </div>

          {/* Role switcher */}
          <div className="mb-6 flex gap-1.5 rounded-xl bg-appElevated p-1">
            {([
              { id: 'customer' as Role, label: 'Client' },
              { id: 'vendor' as Role, label: 'Prestataire' },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => switchRole(tab.id)}
                className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[9px] py-2.5 text-[13px] font-semibold transition-all"
                style={{
                  fontFamily: 'inherit',
                  border: 'none',
                  background: role === tab.id ? 'white' : 'transparent',
                  color: role === tab.id ? 'var(--color-slate-900)' : 'var(--color-slate-500)',
                  boxShadow: role === tab.id ? '0 1px 4px rgba(0,0,0,0.08)' : undefined,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form card */}
          <form
            noValidate
            onSubmit={(e) => { e.preventDefault(); if (!showEmailVerification) handleSubmit() }}
            className={`overflow-hidden rounded-[20px] border border-appBorder bg-appCard p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] min-[901px]:p-8 ${shake ? 'inscription-shake' : ''}`}
          >
            {showEmailVerification ? (
              <div className="animate-inscription-fade-up">
                <button
                  type="button"
                  onClick={backToLoginForm}
                  className="mb-5 flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-appTextSec transition-colors hover:text-appText"
                  style={{ fontFamily: 'inherit', background: 'none', border: 'none', padding: 0 }}
                >
                  <FiArrowLeft size={14} />
                  Retour à la connexion
                </button>

                <div className="mb-6 flex justify-center">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-primaryColor"
                    style={{ background: accentDim }}
                  >
                    <FiLock className="size-7" aria-hidden />
                  </div>
                </div>

                <h4 className="mb-1.5 text-center text-[18px] font-bold text-appText">
                  Vérification de l&apos;e-mail
                </h4>
                <p className="mb-6 text-center text-[13px] text-appTextSec">
                  Un code à {OTP_LENGTH} chiffres a été envoyé à{' '}
                  <span className="font-semibold text-appText">{verificationEmail}</span>
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
                    classNames={{ wrapper: 'flex gap-2 justify-center min-[480px]:gap-3' }}
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
                      disabled={isResendingOtp}
                      className="cursor-pointer font-semibold underline underline-offset-2 disabled:opacity-50"
                      style={{ color: accentColor, background: 'none', border: 'none', padding: 0, fontFamily: 'inherit' }}
                    >
                      {isResendingOtp ? 'Envoi…' : 'Renvoyer'}
                    </button>
                  )}
                </p>

                <button
                  type="button"
                  onClick={() => handleVerifyOtp()}
                  disabled={otpValue.length !== OTP_LENGTH || isOtpBusy}
                  className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] border-none py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
                  style={{
                    background: accentColor,
                    color: accentTextColor,
                    boxShadow: `0 5px 16px ${accentShadow}`,
                    fontFamily: 'inherit',
                  }}
                >
                  {isOtpBusy ? (
                    <>
                      <span
                        className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
                        style={{ opacity: 0.6 }}
                      />
                      Vérification…
                    </>
                  ) : (
                    <>
                      Vérifier et se connecter
                      <FiArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            ) : (
              <>
                {/* ─── Error banner ─── */}
                {serverError && (
                  <div
                    className="mb-5 flex animate-inscription-fade-up items-center gap-2.5 rounded-[10px] border px-4 py-3 text-[13px] font-medium text-red-600"
                    style={{ background: 'var(--color-red-light)', borderColor: 'rgba(239,68,68,0.2)' }}
                  >
                    <FiAlertCircle size={15} className="shrink-0" />
                    {serverError}
                  </div>
                )}

                {/* ─── Email ─── */}
                <div className="mb-4">
                  <label className="mb-1.5 block text-[13px] font-semibold text-appText">
                    Adresse email
                  </label>
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      placeholder={isVendor ? 'email@entreprise.com' : 'votre@email.com'}
                      autoComplete="email"
                      value={values.email}
                      onChange={(e) => { handleChange(e); setServerError('') }}
                      onBlur={handleBlur}
                      className={[
                        'w-full rounded-[10px] border-[1.5px] py-3 pl-4 pr-11 text-[14px] text-appText outline-none transition-all',
                        touched.email && errors.email
                          ? 'border-red-500 bg-red-light focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
                          : `border-appBorder bg-appSurface hover:border-appBorder focus:bg-appCard focus:shadow-[0_0_0_3px_${accentDim}]`,
                      ].join(' ')}
                      style={{
                        fontFamily: 'inherit',
                        ...(!(touched.email && errors.email) ? { ['--tw-border-opacity' as string]: '1' } : {}),
                      }}
                      onFocus={(e) => {
                        if (!(touched.email && errors.email)) {
                          e.currentTarget.style.borderColor = isVendor ? 'var(--color-amber)' : 'var(--color-primaryColor)'
                        }
                      }}
                      onBlurCapture={(e) => {
                        if (!(touched.email && errors.email)) {
                          e.currentTarget.style.borderColor = ''
                        }
                      }}
                    />
                    <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-appTextMuted">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </span>
                  </div>
                  {touched.email && errors.email && (
                    <p className="mt-1 text-[11px] text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* ─── Password ─── */}
                <div className="mb-4">
                  <label className="mb-1.5 block text-[13px] font-semibold text-appText">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      value={values.password}
                      onChange={(e) => { handleChange(e); setServerError('') }}
                      onBlur={handleBlur}
                      className={[
                        'w-full rounded-[10px] border-[1.5px] py-3 pl-4 pr-11 text-[14px] text-appText outline-none transition-all',
                        touched.password && errors.password
                          ? 'border-red-500 bg-red-light focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
                          : 'border-appBorder bg-appSurface hover:border-appBorder',
                      ].join(' ')}
                      style={{ fontFamily: 'inherit' }}
                      onFocus={(e) => {
                        if (!(touched.password && errors.password)) {
                          e.currentTarget.style.borderColor = isVendor ? 'var(--color-amber)' : 'var(--color-primaryColor)'
                          e.currentTarget.style.background = 'white'
                          e.currentTarget.style.boxShadow = `0 0 0 3px ${accentBorder}`
                        }
                      }}
                      onBlurCapture={(e) => {
                        e.currentTarget.style.borderColor = ''
                        e.currentTarget.style.background = ''
                        e.currentTarget.style.boxShadow = ''
                      }}
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
                  {touched.password && errors.password && (
                    <p className="mt-1 text-[11px] text-red-500">{errors.password}</p>
                  )}
                </div>

                {/* ─── Remember me + Forgot password ─── */}
                <div className="mb-6 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between">
                  <div
                    role="checkbox"
                    aria-checked={values.rememberMe}
                    tabIndex={0}
                    className="flex cursor-pointer select-none items-center gap-2 outline-none"
                    onClick={() => setFieldValue('rememberMe', !values.rememberMe)}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault()
                        setFieldValue('rememberMe', !values.rememberMe)
                      }
                    }}
                  >
                    <div
                      aria-hidden
                      className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-[5px] border-2 transition-all"
                      style={{
                        borderColor: values.rememberMe ? accentColor : 'var(--color-slate-300)',
                        background: values.rememberMe ? accentColor : 'transparent',
                      }}
                    >
                      {values.rememberMe && <FiCheck size={10} color={isVendor ? 'var(--color-slate-900)' : 'white'} strokeWidth={3} />}
                    </div>
                    <span className="text-[13px] text-appTextSec">Se souvenir de moi</span>
                  </div>

                  <Link
                    href={getForgotPasswordRoutePath()}
                    className="text-[13px] font-semibold no-underline transition-opacity hover:opacity-75"
                    style={{ color: accentColor }}
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                {/* ─── Submit button ─── */}
                <button
                  type="submit"
                  disabled={isLoginBusy}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] border-none py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
                  style={{
                    background: accentColor,
                    color: accentTextColor,
                    boxShadow: `0 5px 16px ${accentShadow}`,
                    fontFamily: 'inherit',
                  }}
                >
                  {isLoginBusy ? (
                    <>
                      <span
                        className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
                        style={{ opacity: 0.6 }}
                      />
                      Connexion…
                    </>
                  ) : (
                    <>
                      Se connecter
                      <FiArrowRight size={15} />
                    </>
                  )}
                </button>

                {!isVendor && (
                  <>
                    {/* ─── Divider ─── */}
                    <div className="my-5 flex items-center gap-3 text-[12px] text-appTextMuted">
                      <div className="h-px flex-1 bg-appBorder" />
                      ou continuer avec
                      <div className="h-px flex-1 bg-appBorder" />
                    </div>

                    {/* ─── Google button ─── */}
                    <button
                      type="button"
                      disabled={isGoogleBusy || isLoginBusy}
                      className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[10px] border-[1.5px] border-appBorder bg-appCard py-3 text-[14px] font-medium text-appText transition-all hover:-translate-y-px hover:border-appBorder hover:bg-appSurface hover:shadow-[0_3px_10px_rgba(0,0,0,0.06)] disabled:cursor-not-allowed disabled:opacity-60"
                      style={{ fontFamily: 'inherit' }}
                      onClick={handleGoogleLogin}
                    >
                      {isGoogleBusy ? (
                        <span className="h-4 w-4 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
                      ) : (
                        <GoogleIcon />
                      )}
                      {isGoogleBusy ? 'Connexion…' : 'Continuer avec Google'}
                    </button>
                  </>
                )}
              </>
            )}
          </form>

          {/* Bottom link */}
          <p className="mt-6 text-center text-[13px] text-appTextSec">
            Pas encore de compte ?{' '}
            <Link
              href={getRegistrationPageRoutePath({ role })}
              className="font-semibold no-underline hover:underline"
              style={{ color: accentColor }}
            >
              Créer un compte gratuitement
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}