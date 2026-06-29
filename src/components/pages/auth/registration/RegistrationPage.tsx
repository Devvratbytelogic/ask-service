'use client'

import { useEffect, useRef, useState, KeyboardEvent } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import { FiMail, FiPhone, FiHome, FiEye, FiEyeOff, FiArrowRight, FiArrowLeft, FiCheck } from 'react-icons/fi'
import ReactSelect from 'react-select'
import { buildSelectStyles, type CategoryOption } from './selectStyles'
import { registrationSchema } from '@/utils/validation'
import { getLoginPageRoutePath, getClientDashboardPageRoutePath, getPrivacyRoutePath, getTermsRoutePath } from '@/routes/routes'
import LeftPanel from './LeftPanel'
import { addToast } from '@heroui/react'
import { useGetAllServicesQuery, useGetAllServicesDocumentsRequiredQuery } from '@/redux/rtkQueries/clientSideGetApis'
import {
  useSignupMutation,
  useVendorRegisterMutation,
  useVerifyEmailMutation,
  useVendorVerifyOtpMutation,
  useResendEmailVerificationMutation,
  useVendorResendOtpMutation,
} from '@/redux/rtkQueries/authApi'
import { useUploadVendorDocumentsMutation } from '@/redux/rtkQueries/allPostApi'
import { setAuthAndRefetchProfile } from '@/redux/authOnSuccess'
import type { AuthResponseData } from '@/utils/authCookies'
import { getFcmTokenFromCookie } from '@/firebase/getFcmTokenn'
import { type Step, getPasswordStrength, ProgressSteps, Field, StyledInput, DocUploadZone } from './RegistrationComponents'

const registrationInitialValues = {
  role: '' as 'customer' | 'vendor' | '',
  prenom: '',
  nom: '',
  email: '',
  telephone: '',
  nomEntreprise: '',
  siret: '',
  serviceCategory: [] as string[],
  zones: [] as string[],
  password: '',
  passwordConfirm: '',
  termsAccepted: false,
}

// ─── Constants ───────────────────────────────────────────────────────────────
const OTP_LENGTH = 4
const ALLOWED_DOC_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.doc', '.docx', '.pdf', '.svg']
const MAX_DOC_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
const ALLOWED_FORMATS_HINT = `${ALLOWED_DOC_EXTENSIONS.map((e) => e.slice(1).toUpperCase()).join(', ')} (Max ${MAX_DOC_SIZE_BYTES / (1024 * 1024)}MB)`


// ─── Main component ───────────────────────────────────────────────────────────
interface RegistrationPageProps {
  logoUrl?: string | null
}

export default function RegistrationPage({ logoUrl }: RegistrationPageProps = {}) {
  const searchParams = useSearchParams()
  const dispatch = useDispatch()
  const router = useRouter()
  const fcmToken = getFcmTokenFromCookie()

  const { data: servicesResponse, isLoading: isServicesLoading, isError: isServicesError } = useGetAllServicesQuery()
  const serviceOptions: CategoryOption[] = (servicesResponse?.data ?? []).map((s) => ({
    value: s._id,
    label: s.title,
    image: s.image ?? null,
  }))

  const [signup, { isLoading: isSigningUp }] = useSignupMutation()
  const [vendorRegister, { isLoading: isVendorRegistering }] = useVendorRegisterMutation()
  const [verifyEmail, { isLoading: isVerifyingEmail }] = useVerifyEmailMutation()
  const [vendorVerifyOtp, { isLoading: isVerifyingVendorOtp }] = useVendorVerifyOtpMutation()
  const [resendEmailVerification, { isLoading: isResendingEmail }] = useResendEmailVerificationMutation()
  const [vendorResendOtp, { isLoading: isResendingVendorOtp }] = useVendorResendOtpMutation()
  const [uploadVendorDocuments, { isLoading: isUploadingDocs }] = useUploadVendorDocumentsMutation()

  // ── UI-only state ─────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>(1)
  const [isSuccess, setIsSuccess] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)
  const [shakeStep, setShakeStep] = useState<Step | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [zoneInput, setZoneInput] = useState('')
  const tagsInputRef = useRef<HTMLInputElement>(null)

  // ── OTP state ─────────────────────────────────────────────────────────────
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [otpError, setOtpError] = useState('')
  const [resendCountdown, setResendCountdown] = useState(0)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  // ── Document upload state ─────────────────────────────────────────────────
  const [documents, setDocuments] = useState<Record<string, File | null>>({})
  const [docErrors, setDocErrors] = useState<Record<string, string | undefined>>({})

  // ── Formik ────────────────────────────────────────────────────────────────
  const formik = useFormik({
    initialValues: registrationInitialValues,
    validationSchema: registrationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (_values) => {
      setIsSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
  })

  const { values, touched, errors, handleChange, handleBlur, setFieldValue, setFieldTouched } = formik

  // ── Derived state ─────────────────────────────────────────────────────────
  const isVendor = values.role === 'vendor'
  const accentColor = isVendor ? 'var(--color-amber)' : 'var(--color-primaryColor)'
  const accentTextColor = isVendor ? 'var(--color-slate-900)' : 'white'
  const pwdStrength = getPasswordStrength(values.password)

  // ── Vendor documents — only fetched when vendor reaches step 5 (auth is set by then) ──
  const { data: docsResponse, isLoading: isDocsLoading, isError: isDocsError } = useGetAllServicesDocumentsRequiredQuery(
    undefined,
    { skip: !isVendor || step < 5 }
  )
  const docFields = Array.isArray(docsResponse?.data?.documents) ? docsResponse.data.documents : []

  // ── Auto-select role from URL query param ─────────────────────────────────
  useEffect(() => {
    const roleParam = searchParams.get('role')
    if (roleParam === 'vendor' || roleParam === 'customer') {
      setFieldValue('role', roleParam)
    }
  }, [])

  // ── Resend countdown ──────────────────────────────────────────────────────
  useEffect(() => {
    if (resendCountdown <= 0) return
    const t = setTimeout(() => setResendCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCountdown])

  // ── Helpers ───────────────────────────────────────────────────────────────
  function triggerShake(s: Step) {
    setShakeStep(s)
    setShakeKey((k) => k + 1)
    setTimeout(() => setShakeStep(null), 450)
  }

  function navTo(n: Step) {
    setStep(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Step navigation with per-step Formik validation ───────────────────────
  async function goStep(n: Step) {
    if (n === 2 && !values.role) {
      triggerShake(1)
      return
    }

    if (n === 3) {
      await setFieldTouched('prenom', true, false)
      await setFieldTouched('nom', true, false)
      await setFieldTouched('email', true, false)
      await setFieldTouched('telephone', true, false)
      if (isVendor) {
        await setFieldTouched('nomEntreprise', true, false)
        await setFieldTouched('serviceCategory', true, false)
        await setFieldTouched('zones', true, false)
      }
      const errs = await formik.validateForm()
      const hasErrors = !!(
        errs.prenom || errs.nom || errs.email || errs.telephone ||
        (isVendor && (errs.nomEntreprise || errs.serviceCategory || errs.zones))
      )
      if (hasErrors) { triggerShake(2); return }
    }

    navTo(n)
  }

  // ── Step 3 → register + start OTP flow ───────────────────────────────────
  async function handleStep3Submit() {
    await setFieldTouched('password', true, false)
    await setFieldTouched('passwordConfirm', true, false)
    await setFieldTouched('termsAccepted', true, false)

    const errs = await formik.validateForm()
    if (errs.password || errs.passwordConfirm || errs.termsAccepted) {
      triggerShake(3)
      return
    }

    try {
      if (isVendor) {
        await vendorRegister({
          first_name: values.prenom.trim(),
          last_name: values.nom.trim(),
          email: values.email.trim(),
          phone: values.telephone,
          password: values.password,
          business_name: values.nomEntreprise,
          ...(values.siret && { siret: values.siret }),
          service: values.serviceCategory,
          areas: values.zones,
          ...(fcmToken && { fcm_token: fcmToken }),
        }).unwrap()
      } else {
        await signup({
          first_name: values.prenom.trim(),
          last_name: values.nom.trim(),
          email: values.email.trim(),
          phone: values.telephone,
          password: values.password,
          ...(fcmToken && { fcm_token: fcmToken }),
        }).unwrap()
      }
      setOtpDigits(Array(OTP_LENGTH).fill(''))
      setOtpError('')
      setResendCountdown(60)
      navTo(4)
    } catch {
      // Error toast handled by rtkQuerieSetup
    }
  }

  // ── OTP management ────────────────────────────────────────────────────────
  function handleOtpChange(idx: number, val: string) {
    const digit = val.replace(/\D/g, '').slice(-1)
    const next = [...otpDigits]
    next[idx] = digit
    setOtpDigits(next)
    setOtpError('')
    if (digit && idx < OTP_LENGTH - 1) otpRefs.current[idx + 1]?.focus()
  }

  function handleOtpKeyDown(idx: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (otpDigits[idx]) {
        const next = [...otpDigits]; next[idx] = ''; setOtpDigits(next)
      } else if (idx > 0) {
        otpRefs.current[idx - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      otpRefs.current[idx - 1]?.focus()
    } else if (e.key === 'ArrowRight' && idx < OTP_LENGTH - 1) {
      otpRefs.current[idx + 1]?.focus()
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!text.length) return
    e.preventDefault()
    const next = Array(OTP_LENGTH).fill('')
    text.split('').forEach((ch, i) => { next[i] = ch })
    setOtpDigits(next)
    otpRefs.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus()
  }

  async function handleOtpVerify() {
    const code = otpDigits.join('')
    if (code.length < OTP_LENGTH) {
      setOtpError(`Veuillez saisir le code complet à ${OTP_LENGTH} chiffres.`)
      triggerShake(4)
      return
    }
    setOtpError('')
    try {
      if (isVendor) {
        const response = await vendorVerifyOtp({
          type: 'SIGNUP',
          email: values.email,
          otp_email: code,
          ...(fcmToken && { fcm_token: fcmToken }),
        }).unwrap()
        const responseData = (response as { data?: { token?: string; userData?: { role?: string } } })?.data
        if (responseData?.token) {
          setAuthAndRefetchProfile({
            token: responseData.token,
            user: responseData.userData,
            role: responseData.userData?.role ?? '',
          }, dispatch)
          router.refresh()
        }
        navTo(5)
      } else {
        const res = await verifyEmail({
          email: values.email,
          otp: code,
          ...(fcmToken && { fcm_token: fcmToken }),
        }).unwrap()
        const responseData = (res as { data?: unknown })?.data
        if (responseData && typeof responseData === 'object') {
          setAuthAndRefetchProfile(responseData as AuthResponseData, dispatch)
          router.refresh()
        }
        setIsSuccess(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch {
      // Error toast handled by rtkQuerieSetup
      setOtpError('Code incorrect ou expiré. Veuillez réessayer.')
    }
  }

  async function handleResendOtp() {
    try {
      if (isVendor) {
        await vendorResendOtp({ identifier: values.email, identifierType: 'EMAIL', type: 'SIGNUP' }).unwrap()
      } else {
        await resendEmailVerification({ email: values.email }).unwrap()
      }
      setOtpDigits(Array(OTP_LENGTH).fill(''))
      setOtpError('')
      setResendCountdown(60)
      setTimeout(() => otpRefs.current[0]?.focus(), 50)
    } catch {
      // Error toast handled by rtkQuerieSetup
    }
  }

  // ── Document upload management ────────────────────────────────────────────
  function handleDocChange(key: string, file: File | null) {
    if (file) {
      const ext = '.' + (file.name.split('.').pop() ?? '').toLowerCase()
      if (!ALLOWED_DOC_EXTENSIONS.includes(ext)) {
        addToast({
          title: `Type de fichier invalide. Autorisés : ${ALLOWED_DOC_EXTENSIONS.join(', ')}`,
          color: 'danger',
          timeout: 3000,
        })
        return
      }
      if (file.size > MAX_DOC_SIZE_BYTES) {
        addToast({ title: 'Le fichier doit faire 5 Mo ou moins.', color: 'danger', timeout: 3000 })
        return
      }
    }
    setDocuments((prev) => ({ ...prev, [key]: file }))
    if (file) setDocErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  async function handleDocumentsSubmit() {
    const requiredErrors: Record<string, string> = {}
    docFields.filter((f) => f.is_required).forEach((f) => {
      if (!documents[f._id]) requiredErrors[f._id] = 'Ce document est obligatoire'
    })
    if (Object.keys(requiredErrors).length > 0) {
      setDocErrors(requiredErrors)
      triggerShake(5)
      return
    }
    try {
      const formData = new FormData()
      docFields.forEach((f) => {
        const file = documents[f._id]
        if (file) formData.append(f._id, file)
      })
      await uploadVendorDocuments(formData).unwrap()
    } catch {
      // Upload failed – docs can be submitted later from vendor dashboard
    }
    setIsSuccess(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Form-level Enter-key submit router ───────────────────────────────────
  function handleStepSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isSuccess) return
    if (step === 1) goStep(2)
    else if (step === 2) goStep(3)
    else if (step === 3) handleStep3Submit()
    else if (step === 4) handleOtpVerify()
    else if (step === 5) handleDocumentsSubmit()
  }

  // ── Zone tag management ───────────────────────────────────────────────────
  function addZone(raw: string) {
    const val = raw.trim().replace(/,/g, '')
    if (val && !values.zones.includes(val)) {
      setFieldValue('zones', [...values.zones, val])
    }
    setZoneInput('')
  }

  function handleTagKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addZone(zoneInput)
    } else if (e.key === 'Backspace' && !zoneInput && values.zones.length) {
      setFieldValue('zones', values.zones.slice(0, -1))
    }
  }

  function handleTagPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData('text')
    if (text.includes(',')) {
      e.preventDefault()
      const parts = text.split(',').map((p) => p.trim()).filter(Boolean)
      const next = [...values.zones]
      parts.forEach((p) => { if (!next.includes(p)) next.push(p) })
      setFieldValue('zones', next)
      setZoneInput('')
    }
  }

  function removeZone(z: string) {
    setFieldValue('zones', values.zones.filter((zone) => zone !== z))
  }

  // ── Step titles / descriptions ────────────────────────────────────────────
  const stepTitles: Record<Step, string> = {
    1: 'Quel est votre profil ?',
    2: isVendor ? 'Votre profil professionnel' : 'Vos informations',
    3: 'Sécurisez votre compte',
    4: 'Vérification par email',
    5: 'Vos documents',
  }
  const stepDescs: Record<Step, string> = {
    1: 'Choisissez comment vous souhaitez utiliser la plateforme.',
    2: isVendor ? 'Renseignez vos informations et vos services.' : 'Renseignez vos coordonnées.',
    3: 'Choisissez un mot de passe fort.',
    4: values.email
      ? `Un code à ${OTP_LENGTH} chiffres a été envoyé à ${values.email}.`
      : `Un code à ${OTP_LENGTH} chiffres a été envoyé à votre adresse email.`,
    5: 'Joignez vos documents pour valider votre profil prestataire.',
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="flex min-h-screen max-[900px]:flex-col"
      style={{ display: 'grid', gridTemplateColumns: '420px 1fr' }}
    >
      <LeftPanel role={values.role || null} logoUrl={logoUrl} />

      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-[5%] py-12">
        <div className="w-full" style={{ maxWidth: 480 }}>

          {/* Already have account */}
          <div className="mb-7 text-center text-[13px] text-slate-500">
            Déjà un compte ?{' '}
            <Link href={getLoginPageRoutePath()} className="font-semibold text-primaryColor no-underline hover:underline">
              Se connecter
            </Link>
          </div>

          {!isSuccess && <ProgressSteps currentStep={step} isVendor={isVendor} />}

          {/* Form card */}
          <div
            className="overflow-hidden rounded-[20px] border border-slate-200 bg-white"
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
          >
            <form onSubmit={handleStepSubmit} noValidate>
              {!isSuccess && (
                <div className="px-8 pb-0 pt-7">
                  <h3
                    className="mb-1 text-slate-900"
                    style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.4px' }}
                  >
                    {stepTitles[step]}
                  </h3>
                  <p className="text-[13px] text-slate-500">{stepDescs[step]}</p>
                </div>
              )}

              <div className="px-8 pb-8 pt-6">

                {/* ─── SUCCESS ─── */}
                {isSuccess && (
                  <div className="animate-inscription-fade-up py-2 text-center">
                    <div
                      className="mx-auto mb-[18px] flex animate-inscription-pop-in items-center justify-center rounded-full text-[28px]"
                      style={{
                        width: 64,
                        height: 64,
                        background: isVendor ? 'var(--color-amber-light)' : 'var(--color-green-light)',
                      }}
                    >
                      {isVendor ? '⏳' : '✓'}
                    </div>
                    <h3
                      className="mb-2 text-slate-900"
                      style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.4px' }}
                    >
                      {isVendor ? 'Compte créé !' : 'Bienvenue !'}
                    </h3>
                    <p
                      className="mx-auto mb-6 text-[14px] text-slate-500"
                      style={{ lineHeight: 1.65, maxWidth: 320 }}
                    >
                      {isVendor
                        ? 'Votre compte prestataire a été soumis. Notre équipe va valider votre profil sous 24h.'
                        : 'Votre compte client a été créé avec succès. Vous pouvez maintenant poster votre première demande.'}
                    </p>
                    {isVendor && (
                      <div className="mb-6 inline-flex items-center gap-2 rounded-full border-[1.5px] border-amber-200 bg-amber-light px-4 py-2 text-[13px] font-semibold text-amber-900">
                        ⏳ Compte en attente de validation
                      </div>
                    )}
                    <Link
                      href={isVendor ? '/' : getClientDashboardPageRoutePath()}
                      className="flex w-full items-center justify-center gap-2 rounded-[10px] py-3.5 text-[14px] font-semibold no-underline transition-all hover:-translate-y-px"
                      style={{
                        background: accentColor,
                        color: accentTextColor,
                        boxShadow: isVendor
                          ? '0 5px 16px rgba(245,158,11,0.3)'
                          : '0 5px 16px rgba(27,79,255,0.28)',
                      }}
                    >
                      {isVendor ? "Retour à l'accueil" : 'Accéder à mon espace'}
                      <FiArrowRight size={15} />
                    </Link>
                    {!isVendor && (
                      <Link
                        href="/"
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-[10px] bg-slate-100 py-3.5 text-[14px] font-semibold text-slate-700 no-underline transition-all hover:bg-slate-200"
                      >
                        Retour à l&apos;accueil
                      </Link>
                    )}
                  </div>
                )}

                {/* ─── STEP 1 : Role ─── */}
                {!isSuccess && step === 1 && (
                  <div
                    className={`animate-inscription-fade-up ${shakeStep === 1 ? 'inscription-shake' : ''}`}
                    key={`step1-${shakeKey}`}
                  >
                    <div className="mb-6 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFieldValue('role', 'customer')}
                        className="relative cursor-pointer rounded-[14px] border-2 bg-slate-50 px-4 py-5 text-center transition-all hover:-translate-y-px hover:border-slate-300 hover:bg-white"
                        style={{
                          borderColor: values.role === 'customer' ? 'var(--color-primaryColor)' : 'var(--color-slate-200)',
                          background: values.role === 'customer' ? 'var(--color-blue-light)' : undefined,
                          boxShadow: values.role === 'customer' ? '0 0 0 3px var(--color-primary-dim)' : undefined,
                          fontFamily: 'inherit',
                        }}
                      >
                        {values.role === 'customer' && (
                          <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-primaryColor text-[11px] font-bold text-white">✓</span>
                        )}
                        <span className="mb-2.5 block text-[28px]">🔍</span>
                        <div className="mb-1 text-[14px] font-bold text-slate-900">Je suis client</div>
                        <div className="text-[12px] leading-relaxed text-slate-500">
                          Je cherche des professionnels pour mes besoins
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFieldValue('role', 'vendor')}
                        className="relative cursor-pointer rounded-[14px] border-2 bg-slate-50 px-4 py-5 text-center transition-all hover:-translate-y-px hover:border-slate-300 hover:bg-white"
                        style={{
                          borderColor: values.role === 'vendor' ? 'var(--color-amber)' : 'var(--color-slate-200)',
                          background: values.role === 'vendor' ? 'var(--color-amber-light)' : undefined,
                          boxShadow: values.role === 'vendor' ? '0 0 0 3px var(--color-amber-dim)' : undefined,
                          fontFamily: 'inherit',
                        }}
                      >
                        {values.role === 'vendor' && (
                          <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber text-[11px] font-bold text-white">✓</span>
                        )}
                        <span className="mb-2.5 block text-[28px]">💼</span>
                        <div className="mb-1 text-[14px] font-bold text-slate-900">Je suis pro</div>
                        <div className="text-[12px] leading-relaxed text-slate-500">
                          Je propose mes services et cherche des clients
                        </div>
                      </button>
                    </div>

                    <div className="mt-6 flex gap-2.5">
                      <button
                        type="submit"
                        className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[10px] border-none py-3 text-[14px] font-semibold transition-all hover:-translate-y-px"
                        style={{
                          background: accentColor,
                          color: accentTextColor,
                          boxShadow: isVendor ? '0 5px 16px rgba(245,158,11,0.3)' : undefined,
                          fontFamily: 'inherit',
                        }}
                      >
                        Continuer
                        <FiArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ─── STEP 2 : Info ─── */}
                {!isSuccess && step === 2 && (
                  <div
                    className={`animate-inscription-fade-up ${shakeStep === 2 ? 'inscription-shake' : ''}`}
                    key={`step2-${shakeKey}`}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Prénom" required errorMessage={touched.prenom && errors.prenom}>
                        <StyledInput
                          name="prenom" type="text" placeholder="Jean"
                          value={values.prenom} onChange={handleChange} onBlur={handleBlur}
                          error={!!(touched.prenom && errors.prenom)}
                        />
                      </Field>
                      <Field label="Nom" required errorMessage={touched.nom && errors.nom}>
                        <StyledInput
                          name="nom" type="text" placeholder="Dupont"
                          value={values.nom} onChange={handleChange} onBlur={handleBlur}
                          error={!!(touched.nom && errors.nom)}
                        />
                      </Field>
                    </div>

                    <Field label="Adresse email" required errorMessage={touched.email && errors.email}>
                      <StyledInput
                        name="email" type="email" placeholder="jean.dupont@email.com"
                        value={values.email} onChange={handleChange} onBlur={handleBlur}
                        error={!!(touched.email && errors.email)} icon={<FiMail size={16} />}
                      />
                    </Field>

                    <Field label="Téléphone" required errorMessage={touched.telephone && errors.telephone}>
                      <StyledInput
                        name="telephone" type="tel" placeholder="+33 6 12 34 56 78"
                        value={values.telephone} onChange={handleChange} onBlur={handleBlur}
                        error={!!(touched.telephone && errors.telephone)} icon={<FiPhone size={16} />}
                      />
                    </Field>

                    {isVendor && (
                      <div>
                        <div className="my-5 flex items-center gap-3 text-[12px] text-slate-400">
                          <div className="h-px flex-1 bg-slate-200" />
                          Informations professionnelles
                          <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        <Field label="Nom de l'entreprise" required errorMessage={touched.nomEntreprise && errors.nomEntreprise}>
                          <StyledInput
                            name="nomEntreprise" type="text" placeholder="Ma Société SAS"
                            value={values.nomEntreprise} onChange={handleChange} onBlur={handleBlur}
                            error={!!(touched.nomEntreprise && errors.nomEntreprise)} icon={<FiHome size={16} />}
                          />
                        </Field>

                        <Field label="SIRET" optional>
                          <StyledInput
                            name="siret" type="text" placeholder="12345678901234" maxLength={14}
                            value={values.siret} onChange={handleChange} onBlur={handleBlur}
                          />
                        </Field>

                        <Field
                          label="Catégorie de service"
                          required
                          requiredColor="var(--color-amber)"
                          errorMessage={touched.serviceCategory && typeof errors.serviceCategory === 'string' && errors.serviceCategory}
                        >
                          <ReactSelect
                            isMulti
                            instanceId="serviceCategory"
                            name="serviceCategory"
                            options={serviceOptions}
                            value={serviceOptions.filter((opt) =>
                              values.serviceCategory.includes(opt.value)
                            )}
                            onChange={(selected) => {
                              setFieldValue(
                                'serviceCategory',
                                selected ? selected.map((opt) => opt.value) : [],
                              )
                            }}
                            onBlur={() => setFieldTouched('serviceCategory', true)}
                            placeholder="— Choisir des catégories —"
                            isLoading={isServicesLoading}
                            loadingMessage={() => 'Chargement…'}
                            noOptionsMessage={() => isServicesError ? 'Erreur de chargement' : 'Aucune option'}
                            menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                            menuPosition="fixed"
                            styles={buildSelectStyles(!!(touched.serviceCategory && typeof errors.serviceCategory === 'string' && errors.serviceCategory))}
                            formatOptionLabel={({ label, image }, { context }) =>
                              context === 'value' ? (
                                <span style={{ fontSize: 12, fontFamily: 'inherit' }}>{label}</span>
                              ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                  {image ? (
                                    <img
                                      src={image}
                                      alt={label}
                                      style={{ width: 26, height: 26, objectFit: 'contain', borderRadius: 6, flexShrink: 0, background: 'var(--color-slate-100)' }}
                                    />
                                  ) : (
                                    <div style={{ width: 26, height: 26, borderRadius: 6, background: 'var(--color-slate-100)', flexShrink: 0 }} />
                                  )}
                                  <span style={{ fontSize: 14, fontFamily: 'inherit' }}>{label}</span>
                                </div>
                              )
                            }
                          />
                        </Field>

                        {/* Zone tags */}
                        <Field
                          label="Zones d'intervention"
                          required
                          errorMessage={touched.zones && typeof errors.zones === 'string' && errors.zones}
                        >
                          <div
                            className={[
                              'flex min-h-12 cursor-text flex-wrap items-center gap-1.5 rounded-[10px] border-[1.5px] px-3 py-2 transition-all',
                              touched.zones && errors.zones
                                ? 'border-red-500 bg-red-light'
                                : 'border-slate-200 bg-slate-50 focus-within:border-primaryColor focus-within:bg-white focus-within:shadow-[0_0_0_3px_var(--color-primary-dim)]',
                            ].join(' ')}
                            onClick={() => tagsInputRef.current?.focus()}
                          >
                            {values.zones.map((z) => (
                              <span
                                key={z}
                                className="inline-flex items-center gap-1.5 rounded-full bg-blue-light px-2.5 py-0.5 text-[12px] font-semibold text-primaryColor"
                              >
                                {z}
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); removeZone(z) }}
                                  className="cursor-pointer text-[15px] leading-none opacity-60 transition-opacity hover:opacity-100"
                                  aria-label={`Retirer ${z}`}
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                            <input
                              ref={tagsInputRef}
                              type="text"
                              className="min-w-[100px] flex-1 border-none bg-transparent text-[13px] text-slate-900 outline-none placeholder:text-slate-400"
                              placeholder={values.zones.length === 0 ? 'Ex : Paris, Lyon…' : 'Ajouter une ville…'}
                              value={zoneInput}
                              onChange={(e) => setZoneInput(e.target.value)}
                              onKeyDown={handleTagKeyDown}
                              onPaste={handleTagPaste}
                              onBlur={() => setFieldTouched('zones', true)}
                            />
                            {zoneInput.trim() && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); addZone(zoneInput) }}
                                className="ml-0.5 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primaryColor text-white transition-all hover:scale-110 hover:brightness-110"
                                aria-label="Ajouter la zone"
                                title="Ajouter (ou appuyez sur Entrée)"
                              >
                                <span className="text-[16px] leading-none">+</span>
                              </button>
                            )}
                          </div>
                          <p className="mt-1.5 text-[11px] text-slate-400">
                            Saisissez une ville puis cliquez <strong>+</strong> ou appuyez sur{' '}
                            <kbd className="rounded bg-slate-200 px-1 py-px font-mono text-[10px]">Entrée</kbd>.
                            Vous pouvez aussi coller une liste séparée par des virgules.
                          </p>
                        </Field>
                      </div>
                    )}

                    <div className="mt-6 flex gap-2.5">
                      <button
                        type="button"
                        onClick={() => goStep(1)}
                        className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-[10px] border-[1.5px] border-slate-200 bg-white px-5 py-3 text-[14px] font-medium text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50"
                        style={{ fontFamily: 'inherit' }}
                      >
                        <FiArrowLeft size={13} strokeWidth={2.5} />
                        Retour
                      </button>
                      <button
                        type="submit"
                        className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[10px] border-none py-3 text-[14px] font-semibold transition-all hover:-translate-y-px"
                        style={{
                          background: accentColor,
                          color: accentTextColor,
                          boxShadow: isVendor ? '0 5px 16px rgba(245,158,11,0.3)' : undefined,
                          fontFamily: 'inherit',
                        }}
                      >
                        Continuer
                        <FiArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ─── STEP 3 : Security ─── */}
                {!isSuccess && step === 3 && (
                  <div
                    className={`animate-inscription-fade-up ${shakeStep === 3 ? 'inscription-shake' : ''}`}
                    key={`step3-${shakeKey}`}
                  >
                    <Field
                      label="Mot de passe"
                      required
                      errorMessage={touched.password && errors.password}
                    >
                      <div className="relative">
                        <input
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Minimum 8 caractères"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={[
                            'w-full rounded-[10px] border-[1.5px] py-3 pl-4 pr-11 text-[14px] text-slate-900 outline-none transition-all',
                            touched.password && errors.password
                              ? 'border-red-500 bg-red-light focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
                              : 'border-slate-200 bg-slate-50 focus:border-primaryColor focus:bg-white focus:shadow-[0_0_0_3px_var(--color-primary-dim)]',
                          ].join(' ')}
                          style={{ fontFamily: 'inherit' }}
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
                      <div className="mt-1.5">
                        <div className="mb-1 h-[3px] overflow-hidden rounded-sm bg-slate-200">
                          <div
                            className="h-full rounded-sm transition-all duration-300"
                            style={{ width: pwdStrength.width, background: pwdStrength.color }}
                          />
                        </div>
                        <p className="text-[11px]" style={{ color: pwdStrength.textColor }}>
                          {pwdStrength.text}
                        </p>
                      </div>
                    </Field>

                    <Field
                      label="Confirmer le mot de passe"
                      required
                      errorMessage={touched.passwordConfirm && errors.passwordConfirm}
                    >
                      <div className="relative">
                        <input
                          name="passwordConfirm"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Répétez votre mot de passe"
                          value={values.passwordConfirm}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={[
                            'w-full rounded-[10px] border-[1.5px] py-3 pl-4 pr-11 text-[14px] text-slate-900 outline-none transition-all',
                            touched.passwordConfirm && errors.passwordConfirm
                              ? 'border-red-500 bg-red-light focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
                              : 'border-slate-200 bg-slate-50 focus:border-primaryColor focus:bg-white focus:shadow-[0_0_0_3px_var(--color-primary-dim)]',
                          ].join(' ')}
                          style={{ fontFamily: 'inherit' }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((p) => !p)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-slate-700"
                          aria-label="Afficher/masquer la confirmation"
                        >
                          {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                      </div>
                    </Field>

                    {/* Terms checkbox */}
                    <div className="mt-5">
                      <div
                        role="checkbox"
                        aria-checked={values.termsAccepted}
                        tabIndex={0}
                        className="flex cursor-pointer select-none items-start gap-2.5 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primaryColor/30"
                        onClick={(e) => {
                          if ((e.target as HTMLElement).closest('a')) return
                          void setFieldValue('termsAccepted', !values.termsAccepted)
                          void setFieldTouched('termsAccepted', true, false)
                        }}
                        onKeyDown={(e) => {
                          if (e.key !== ' ' && e.key !== 'Enter') return
                          e.preventDefault()
                          void setFieldValue('termsAccepted', !values.termsAccepted)
                          void setFieldTouched('termsAccepted', true, false)
                        }}
                      >
                        <div
                          aria-hidden
                          className="mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-2 transition-all"
                          style={{
                            borderColor: values.termsAccepted ? 'var(--color-primaryColor)' : 'var(--color-slate-300)',
                            background: values.termsAccepted ? 'var(--color-primaryColor)' : 'transparent',
                          }}
                        >
                          {values.termsAccepted && <FiCheck size={10} color="white" strokeWidth={3} />}
                        </div>
                        <span className="text-[13px] leading-relaxed text-slate-700">
                          J&apos;accepte les{' '}
                          <Link href={getTermsRoutePath()} className="text-primaryColor no-underline hover:underline" onClick={(e) => e.stopPropagation()}>
                            Conditions d&apos;utilisation
                          </Link>{' '}
                          et la{' '}
                          <Link href={getPrivacyRoutePath()} className="text-primaryColor no-underline hover:underline" onClick={(e) => e.stopPropagation()}>
                            Politique de confidentialité
                          </Link>{' '}
                          d&apos;Ask-Service
                        </span>
                      </div>
                      {touched.termsAccepted && errors.termsAccepted && (
                        <p className="mt-1 text-[11px] text-red-500">{errors.termsAccepted}</p>
                      )}
                    </div>

                    <div className="mt-6 flex gap-2.5">
                      <button
                        type="button"
                        onClick={() => goStep(2)}
                        disabled={isSigningUp || isVendorRegistering}
                        className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-[10px] border-[1.5px] border-slate-200 bg-white px-5 py-3 text-[14px] font-medium text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50"
                        style={{ fontFamily: 'inherit' }}
                      >
                        <FiArrowLeft size={13} strokeWidth={2.5} />
                        Retour
                      </button>
                      <button
                        type="submit"
                        disabled={isSigningUp || isVendorRegistering}
                        className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[10px] border-none py-3 text-[14px] font-semibold transition-all hover:-translate-y-px disabled:opacity-70"
                        style={{
                          background: accentColor,
                          color: accentTextColor,
                          boxShadow: `0 5px 16px ${isVendor ? 'rgba(245,158,11,0.3)' : 'rgba(27,79,255,0.28)'}`,
                          fontFamily: 'inherit',
                        }}
                      >
                        {isSigningUp || isVendorRegistering ? 'Envoi en cours…' : 'Continuer'}
                        {!(isSigningUp || isVendorRegistering) && <FiArrowRight size={15} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* ─── STEP 4 : OTP verification ─── */}
                {!isSuccess && step === 4 && (
                  <div
                    className={`animate-inscription-fade-up ${shakeStep === 4 ? 'inscription-shake' : ''}`}
                    key={`step4-${shakeKey}`}
                  >
                    {/* Icon */}
                    <div className="mb-6 flex justify-center">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl text-[28px]"
                        style={{ background: 'var(--color-primary-dim)' }}
                      >
                        🔐
                      </div>
                    </div>

                    {/* 6-digit boxes */}
                    <div className="mb-2 flex justify-center gap-2.5">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => { otpRefs.current[idx] = el }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          onPaste={handleOtpPaste}
                          onFocus={(e) => e.target.select()}
                          className={[
                            'h-12 w-10 rounded-[10px] border-[1.5px] text-center text-[20px] font-bold text-slate-900 outline-none transition-all',
                            digit
                              ? 'border-primaryColor bg-blue-light shadow-[0_0_0_3px_var(--color-primary-dim)]'
                              : otpError
                                ? 'border-red-400 bg-red-50'
                                : 'border-slate-200 bg-slate-50 focus:border-primaryColor focus:bg-white focus:shadow-[0_0_0_3px_var(--color-primary-dim)]',
                          ].join(' ')}
                          style={{ fontFamily: 'inherit' }}
                          aria-label={`Chiffre ${idx + 1}`}
                        />
                      ))}
                    </div>

                    {otpError && (
                      <p className="mt-1.5 text-center text-[12px] text-red-500">{otpError}</p>
                    )}

                    {/* Resend */}
                    <p className="mt-4 text-center text-[12px] text-slate-500">
                      Vous n&apos;avez pas reçu le code ?{' '}
                      {resendCountdown > 0 ? (
                        <span className="font-semibold text-slate-400">
                          Renvoyer dans {resendCountdown}s
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={isResendingEmail || isResendingVendorOtp}
                          className="cursor-pointer font-semibold text-primaryColor hover:underline disabled:opacity-50"
                          style={{ fontFamily: 'inherit', background: 'none', border: 'none', padding: 0 }}
                        >
                          {isResendingEmail || isResendingVendorOtp ? 'Envoi…' : 'Renvoyer le code'}
                        </button>
                      )}
                    </p>

                    <div className="mt-6 flex gap-2.5">
                      <button
                        type="button"
                        onClick={() => navTo(3)}
                        disabled={isVerifyingEmail || isVerifyingVendorOtp}
                        className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-[10px] border-[1.5px] border-slate-200 bg-white px-5 py-3 text-[14px] font-medium text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50"
                        style={{ fontFamily: 'inherit' }}
                      >
                        <FiArrowLeft size={13} strokeWidth={2.5} />
                        Retour
                      </button>
                      <button
                        type="submit"
                        disabled={isVerifyingEmail || isVerifyingVendorOtp}
                        className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[10px] border-none py-3 text-[14px] font-semibold transition-all hover:-translate-y-px disabled:opacity-70"
                        style={{
                          background: accentColor,
                          color: accentTextColor,
                          boxShadow: `0 5px 16px ${isVendor ? 'rgba(245,158,11,0.3)' : 'rgba(27,79,255,0.28)'}`,
                          fontFamily: 'inherit',
                        }}
                      >
                        {isVerifyingEmail || isVerifyingVendorOtp
                          ? 'Vérification…'
                          : isVendor ? 'Continuer' : 'Créer mon compte'}
                        {!(isVerifyingEmail || isVerifyingVendorOtp) && (
                          isVendor ? <FiArrowRight size={15} /> : <FiCheck size={15} strokeWidth={2.5} />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* ─── STEP 5 : Documents (vendor only) ─── */}
                {!isSuccess && step === 5 && (
                  <div
                    className={`animate-inscription-fade-up ${shakeStep === 5 ? 'inscription-shake' : ''}`}
                    key={`step5-${shakeKey}`}
                  >
                    {isDocsLoading && (
                      <p className="mb-4 text-center text-[13px] text-slate-400">Chargement des documents requis…</p>
                    )}
                    {isDocsError && (
                      <p className="mb-4 text-center text-[13px] text-red-500">Impossible de charger les documents. Veuillez réessayer.</p>
                    )}
                    {docFields.map((doc) => (
                      <DocUploadZone
                        key={doc._id}
                        label={doc.name}
                        required={doc.is_required}
                        hint={[doc.description, ALLOWED_FORMATS_HINT].filter(Boolean).join(' — ')}
                        file={documents[doc._id] ?? null}
                        error={docErrors[doc._id]}
                        accentColor={accentColor}
                        onChange={(f) => handleDocChange(doc._id, f)}
                      />
                    ))}

                    <div className="mb-5 rounded-[10px] bg-amber-light px-4 py-3 text-[12px] leading-relaxed text-amber-900">
                      💡 Vos documents sont chiffrés et uniquement utilisés pour la vérification de votre profil.
                      Vous pouvez également les fournir plus tard depuis votre espace prestataire.
                    </div>

                    <div className="flex gap-2.5">
                      <button
                        type="button"
                        onClick={() => navTo(4)}
                        disabled={isUploadingDocs}
                        className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-[10px] border-[1.5px] border-slate-200 bg-white px-5 py-3 text-[14px] font-medium text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50"
                        style={{ fontFamily: 'inherit' }}
                      >
                        <FiArrowLeft size={13} strokeWidth={2.5} />
                        Retour
                      </button>
                      <button
                        type="submit"
                        disabled={isDocsLoading || isUploadingDocs}
                        className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[10px] border-none py-3 text-[14px] font-semibold transition-all hover:-translate-y-px disabled:opacity-70"
                        style={{
                          background: accentColor,
                          color: accentTextColor,
                          boxShadow: '0 5px 16px rgba(245,158,11,0.3)',
                          fontFamily: 'inherit',
                        }}
                      >
                        {isUploadingDocs ? 'Envoi en cours…' : 'Créer mon compte'}
                        {!isUploadingDocs && <FiCheck size={15} strokeWidth={2.5} />}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
