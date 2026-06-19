'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FiEye, FiEyeOff, FiArrowRight, FiCheck, FiAlertCircle } from 'react-icons/fi'
import { yupRequiredEmail } from '@/utils/validation'
import {
  getDashboardPageRoutePathForRole,
  getForgotPasswordRoutePath,
  getMyRequestRoutePath,
  getRegistrationPageRoutePath,
  getVendorDashboardRoutePath,
} from '@/routes/routes'
import LeftPanel from './LeftPanel'
import { useLoginMutation } from '@/redux/rtkQueries/authApi'
import { useRouter } from 'next/navigation'
import { setAuthAndRefetchProfile } from '@/redux/authOnSuccess'
import { AuthResponseData } from '@/utils/authCookies'
import { useDispatch } from 'react-redux'


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
}

export default function LoginPage({ logoUrl }: LoginPageProps = {}) {
  const router = useRouter()
  const dispatch = useDispatch()
  const [role, setRole] = useState<Role>('customer')
  const [showPassword, setShowPassword] = useState(false)
  const [shake, setShake] = useState(false)
  const [serverError, setServerError] = useState('')
  const [login, { isLoading }] = useLoginMutation()

  const isVendor = role === 'vendor'
  const accentColor = isVendor ? 'var(--color-amber)' : 'var(--color-primaryColor)'
  const accentTextColor = isVendor ? 'var(--color-slate-900)' : 'white'
  const accentShadow = isVendor ? 'rgba(245,158,11,0.3)' : 'rgba(27,79,255,0.28)'
  const accentDim = isVendor ? 'var(--color-amber-dim)' : 'var(--color-primary-dim)'
  const accentBorder = isVendor ? 'rgba(245,158,11,0.25)' : 'rgba(27,79,255,0.25)'

  function triggerShake() {
    setShake(true)
    setTimeout(() => setShake(false), 450)
  }

  const formik = useFormik<LoginFormValues>({
    initialValues: { email: '', password: '', rememberMe: false },
    validationSchema: loginSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setServerError('')
      try {
        const response = await login({ identifier: values.email, password: values.password }).unwrap()
        const responseData = response?.data as Record<string, unknown> | undefined
        console.log('response', (responseData as AuthResponseData).role as string)
        // const flow = responseData?.flow as string | undefined
        console.log('responseData', responseData)
        if (response.http_status_code === 200) {
          setAuthAndRefetchProfile(responseData as AuthResponseData, dispatch)
          router.push(getDashboardPageRoutePathForRole((responseData as AuthResponseData).role as string))
          router.refresh()
        }
      } catch (error: unknown) {
        console.error('error', error)
        if (error instanceof Error) {
          setServerError(error.message)
        } else {
          setServerError('Une erreur inattendue s\'est produite')
        }
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
    setRole(r)
    setServerError('')
    formik.setErrors({})
  }

  const subtitleText = isVendor
    ? 'Accédez à vos leads et gérez votre activité'
    : 'Accédez à votre espace client ou prestataire'

  return (
    <div
      className="flex min-h-screen max-[900px]:flex-col"
      style={{ display: 'grid', gridTemplateColumns: '420px 1fr' }}
    >
      <LeftPanel role={role} logoUrl={logoUrl} />

      {/* ─── Right panel ─── */}
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-[5%] py-12">
        <div className="w-full" style={{ maxWidth: 440 }}>

          {/* Header */}
          <div className="mb-8 text-center">
            <h3
              className="mb-1.5 text-slate-900"
              style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px' }}
            >
              Connexion
            </h3>
            <p className="text-[14px] text-slate-500">{subtitleText}</p>
          </div>

          {/* Role switcher */}
          <div className="mb-6 flex gap-1.5 rounded-[12px] bg-slate-100 p-1">
            {([
              { id: 'customer' as Role, emoji: '🔍', label: 'Client' },
              { id: 'vendor' as Role, emoji: '💼', label: 'Prestataire' },
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
                {tab.emoji} {tab.label}
              </button>
            ))}
          </div>

          {/* Form card */}
          <form
            noValidate
            onSubmit={(e) => { e.preventDefault(); handleSubmit() }}
            className={`overflow-hidden rounded-[20px] border border-slate-200 bg-white ${shake ? 'inscription-shake' : ''}`}
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: '32px' }}
          >
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
              <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">
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
                    'w-full rounded-[10px] border-[1.5px] py-3 pl-4 pr-11 text-[14px] text-slate-900 outline-none transition-all',
                    touched.email && errors.email
                      ? 'border-red-500 bg-red-light focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
                      : `border-slate-200 bg-slate-50 hover:border-slate-400 focus:bg-white focus:shadow-[0_0_0_3px_${accentDim}]`,
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
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
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
              <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">
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
                    'w-full rounded-[10px] border-[1.5px] py-3 pl-4 pr-11 text-[14px] text-slate-900 outline-none transition-all',
                    touched.password && errors.password
                      ? 'border-red-500 bg-red-light focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-400',
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
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-slate-700"
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
            <div className="mb-6 flex items-center justify-between">
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
                  className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-2 transition-all"
                  style={{
                    borderColor: values.rememberMe ? accentColor : 'var(--color-slate-300)',
                    background: values.rememberMe ? accentColor : 'transparent',
                  }}
                >
                  {values.rememberMe && <FiCheck size={10} color={isVendor ? 'var(--color-slate-900)' : 'white'} strokeWidth={3} />}
                </div>
                <span className="text-[13px] text-slate-600">Se souvenir de moi</span>
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
              disabled={isLoading}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] border-none py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
              style={{
                background: accentColor,
                color: accentTextColor,
                boxShadow: `0 5px 16px ${accentShadow}`,
                fontFamily: 'inherit',
              }}
            >
              {isLoading ? (
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

            {/* ─── Divider ─── */}
            <div className="my-5 flex items-center gap-3 text-[12px] text-slate-400">
              <div className="h-px flex-1 bg-slate-200" />
              ou continuer avec
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* ─── Google button ─── */}
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[10px] border-[1.5px] border-slate-200 bg-white py-3 text-[14px] font-medium text-slate-700 transition-all hover:-translate-y-px hover:border-slate-400 hover:bg-slate-50 hover:shadow-[0_3px_10px_rgba(0,0,0,0.06)]"
              style={{ fontFamily: 'inherit' }}
              onClick={() => {/* Google OAuth */ }}
            >
              <GoogleIcon />
              Continuer avec Google
            </button>
          </form>

          {/* Bottom link */}
          <p className="mt-6 text-center text-[13px] text-slate-500">
            Pas encore de compte ?{' '}
            <Link
              href={getRegistrationPageRoutePath()}
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
