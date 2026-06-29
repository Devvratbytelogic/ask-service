'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useFormik } from 'formik'
import { useSelector } from 'react-redux'
import { serviceRequestContactSchema } from '@/utils/validation'
import { FiArrowLeft, FiArrowRight, FiCheck, FiInfo, FiPhone } from 'react-icons/fi'
import ReactSelect from 'react-select'
import {
  useGetAllServicesQuery,
  useGetServicesQuetionsQuery,
  useGetUserProfileInfoQuery,
} from '@/redux/rtkQueries/clientSideGetApis'
import { RootState } from '@/redux/appStore'
import { getAuthToken } from '@/utils/authCookies'
import {
  useCreateServiceRequestMutation,
  useUpdateServiceRequestMutation,
} from '@/redux/rtkQueries/allPostApi'
import {
  buildServiceSelectStyles,
  type ServiceOption,
  type DynOption,
} from './selectStyles'
import type {
  ListEntity,
  ICreateServiceRequestPayload,
  IDynamicAnswerPayload,
} from '@/types/serviceQuestions'
import DynamicQuestionField, { FieldLabel, inputCls } from './DynamicQuestionField'
import OtpVerificationScreen from './OtpVerificationScreen'
import LoginRequiredScreen from './LoginRequiredScreen'
import RequestSentScreen from './RequestSentScreen'
import type { ISingleRequestData } from '@/types/singleRequest'

// ─── Types ────────────────────────────────────────────────────────────────────
type ClientType = 'Individual' | 'Company' | ''

type FlowScreen =
  | 'EMAIL_VERIFICATION_REQUIRED'
  | 'PHONE_VERIFICATION_REQUIRED'
  | 'LOGIN_REQUIRED_EMAIL'
  | 'LOGIN_REQUIRED_PHONE'

// ─── Constants ────────────────────────────────────────────────────────────────
const FLOW_TYPES = {
  PHONE_VERIFICATION_REQUIRED: 'PHONE_VERIFICATION_REQUIRED',
  EMAIL_VERIFICATION_REQUIRED: 'EMAIL_VERIFICATION_REQUIRED',
  LOGIN_REQUIRED: 'LOGIN_REQUIRED',
  REQUEST_CREATED: 'REQUEST_CREATED',
} as const

const LOGIN_REQUIRED_MESSAGES = {
  PHONE: 'User already exists with phone. Please login.',
  EMAIL: 'Email already associated with another account',
} as const

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatAnswerForDisplay(question: ListEntity, value: string | string[]): string {
  if (!value || (Array.isArray(value) && value.length === 0)) return '—'
  if (question.type === 'date') return formatDate(value as string)
  if (question.type === 'time') return value as string
  if (question.type === 'date & time' || question.type === 'datetime') {
    const d = new Date(value as string)
    return isNaN(d.getTime())
      ? (value as string)
      : d.toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
  }
  if (Array.isArray(value)) return value.join(', ')
  return value as string
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-appBorderSub px-4 py-3 last:border-b-0">
      <span className="flex shrink-0 items-center gap-2 text-[13px] text-appTextSec">
        {icon}
        {label}
      </span>
      <span className="max-w-[55%] wrap-break-word text-right text-[13px] font-semibold text-appText">
        {value}
      </span>
    </div>
  )
}

type RequestAServiceFormProps = {
  mode?: 'create' | 'edit'
  requestId?: string
  data?: ISingleRequestData
}

function mapClientType(clientType?: string): ClientType {
  if (clientType === 'Company' || clientType === 'Entreprise') return 'Company'
  if (clientType === 'Individual' || clientType === 'Particulier') return 'Individual'
  return ''
}

function parseDynamicAnswerValue(
  value?: string,
  question?: Pick<ListEntity, 'is_multiple' | 'type'>,
): string | string[] {
  const isMulti = question?.is_multiple || question?.type === 'checkbox'

  if (!value) return isMulti ? [] : ''

  const parsed: string | string[] = value.includes(',')
    ? value.split(',').map((s) => s.trim()).filter(Boolean)
    : value

  if (isMulti) {
    return Array.isArray(parsed) ? parsed : [parsed]
  }

  return Array.isArray(parsed) ? parsed[0] ?? '' : parsed
}

function getServiceCategoryId(category?: ISingleRequestData['service_category'] | string): string {
  if (typeof category === 'string') return category
  return category?._id ?? ''
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function RequestAServiceForm({
  mode = 'create',
  requestId,
  data,
}: RequestAServiceFormProps = {}) {
  const isEditMode = mode === 'edit'
  const isClientAuthenticated = useSelector((state: RootState) => state.auth.isClientAuthenticated)
  const isAuthenticated = !!getAuthToken() || isClientAuthenticated
  const { data: profileResponse } = useGetUserProfileInfoQuery(undefined, {
    skip: !isAuthenticated,
  })
  const profile = profileResponse?.data

  // ── Services API
  const {
    data: servicesResponse,
    isLoading: isServicesLoading,
    isError: isServicesError,
  } = useGetAllServicesQuery()
  const serviceOptions: ServiceOption[] = (servicesResponse?.data ?? []).map((s) => ({
    value: s._id,
    label: s.title,
    image: s.image ?? null,
  }))

  // ── Mutations
  const [createServiceRequest, { isLoading: isCreateSubmitting }] = useCreateServiceRequestMutation()
  const [updateServiceRequest, { isLoading: isUpdateSubmitting }] = useUpdateServiceRequestMutation()
  const isSubmitting = isCreateSubmitting || isUpdateSubmitting

  // ── UI state
  const [uiStep, setUiStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)
  const [flowScreen, setFlowScreen] = useState<FlowScreen | null>(null)
  const [submissionRef, setSubmissionRef] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [shakeKey, setShakeKey] = useState(0)
  const [shakeStep, setShakeStep] = useState<number | null>(null)

  // ── Step 1 state (service + clientType)
  const [service, setService] = useState(() => getServiceCategoryId(data?.service_category))
  const [serviceTouched, setServiceTouched] = useState(false)
  const [clientType, setClientType] = useState<ClientType>(() =>
    mapClientType(data?.contact_details?.client_type),
  )
  const [clientTypeTouched, setClientTypeTouched] = useState(false)

  // ── Dynamic answers (prefilled by API key, e.g. time_slot, start_date)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(() => {
    if (!data?.dynamic_answers?.length) return {}
    return Object.fromEntries(
      data.dynamic_answers.map((a) => [a.key, parseDynamicAnswerValue(a.value)]),
    )
  })
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

  // ── Contact step — Formik
  const contactFormik = useFormik({
    initialValues: {
      firstName: data?.contact_details?.first_name ?? profile?.first_name ?? '',
      lastName: data?.contact_details?.last_name ?? profile?.last_name ?? '',
      phone: data?.contact_details?.phone ?? profile?.phone ?? '',
      email: data?.contact_details?.email ?? profile?.email ?? '',
      notes: data?.note ?? '',
    },
    enableReinitialize: true,
    validationSchema: serviceRequestContactSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: () => { },
  })

  // ── Questions API (fires once a service is selected)
  const { data: questionsResponse, isLoading: isQuestionsLoading } =
    useGetServicesQuetionsQuery({ id: service }, { skip: !service })

  const questionsList = useMemo(
    () => questionsResponse?.data?.list ?? [],
    [questionsResponse],
  )

  // Reset dynamic answers when the user changes service (skip initial edit prefill)
  const skipServiceResetRef = useRef(true)
  useEffect(() => {
    if (skipServiceResetRef.current) {
      skipServiceResetRef.current = false
      return
    }
    setAnswers({})
    setTouchedFields(new Set())
  }, [service])

  // Re-apply saved answers once questions load (keys match API dynamic_answers.key)
  useEffect(() => {
    if (!isEditMode || !data?.dynamic_answers?.length || questionsList.length === 0) return
    setAnswers((prev) => {
      const next = { ...prev }
      for (const q of questionsList) {
        const saved = data.dynamic_answers!.find((a) => a.key === q.key)
        if (saved) next[q.key] = parseDynamicAnswerValue(saved.value, q)
      }
      return next
    })
  }, [isEditMode, data?.dynamic_answers, questionsList])

  // Group questions by API `step`, sorted by `order` within each step
  const apiSteps = useMemo(
    () =>
      Array.from(new Set(questionsList.map((q) => q.step))).sort((a, b) => a - b),
    [questionsList],
  )

  const questionsByApiStep = useMemo(() => {
    const map: Record<number, ListEntity[]> = {}
    apiSteps.forEach((s) => {
      map[s] = questionsList
        .filter((q) => q.step === s)
        .sort((a, b) => a.order - b.order)
    })
    return map
  }, [questionsList, apiSteps])

  // ── Step mapping:
  //   uiStep 1           → service + clientType
  //   uiStep 2 … N+1     → API question groups (apiSteps[0] … apiSteps[N-1])
  //   uiStep N+2         → contact details
  //   uiStep N+3         → summary
  const totalUiSteps = 1 + apiSteps.length + 2
  const contactUiStep = 1 + apiSteps.length + 1
  const summaryUiStep = totalUiSteps
  const progress = Math.round((uiStep / totalUiSteps) * 100)

  const currentApiStepIdx = uiStep - 2
  const currentApiStep =
    currentApiStepIdx >= 0 && currentApiStepIdx < apiSteps.length
      ? apiSteps[currentApiStepIdx]
      : null
  const currentQuestions =
    currentApiStep != null ? (questionsByApiStep[currentApiStep] ?? []) : []

  // ── Navigation helpers
  function triggerShake() {
    setShakeStep(uiStep)
    setShakeKey((k) => k + 1)
    setTimeout(() => setShakeStep(null), 450)
  }

  function navTo(n: number) {
    setFlowScreen(null)
    setSubmitError(null)
    setUiStep(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function goNext() {
    if (uiStep === 1) {
      setServiceTouched(true)
      setClientTypeTouched(true)
      if (!service || !clientType) {
        triggerShake()
        return
      }
      navTo(2)
    } else if (currentApiStep != null) {
      const hasErr = currentQuestions.some((q) => {
        if (!q.is_required) return false
        const val = answers[q.key]
        return !val || (Array.isArray(val) ? val.length === 0 : val === '')
      })
      setTouchedFields((prev) => {
        const next = new Set(prev)
        currentQuestions.forEach((q) => next.add(q.key))
        return next
      })
      if (hasErr) {
        triggerShake()
        return
      }
      navTo(uiStep + 1)
    } else if (uiStep === contactUiStep) {
      const allTouched = { firstName: true, lastName: true, phone: true, email: true, notes: true }
      await contactFormik.setTouched(allTouched, true)
      const errors = await contactFormik.validateForm()
      if (Object.keys(errors).length > 0) {
        triggerShake()
        return
      }
      navTo(uiStep + 1)
    }
  }

  function goPrev() {
    navTo(uiStep - 1)
  }

  // ── Submit (summary step) ──────────────────────────────────────────────────
  async function handleSubmit() {
    setSubmitError(null)
    setFlowScreen(null)

    const dynamic_answers: IDynamicAnswerPayload[] = questionsList
      .filter((q) => {
        const val = answers[q.key]
        return val !== undefined && (Array.isArray(val) ? val.length > 0 : val !== '')
      })
      .map((q) => ({
        question_id: q._id,
        key: q.key,
        label: q.label,
        type: q.type,
        value: Array.isArray(answers[q.key])
          ? (answers[q.key] as string[]).join(', ')
          : (answers[q.key] as string),
      }))

    const payload: ICreateServiceRequestPayload = {
      service_category: service,
      note: contactFormik.values.notes,
      dynamic_answers,
      contact_details: {
        first_name: contactFormik.values.firstName,
        last_name: contactFormik.values.lastName,
        client_type: clientType,
        phone: contactFormik.values.phone,
        email: contactFormik.values.email,
      },
    }

    try {
      if (isEditMode && requestId) {
        await updateServiceRequest({ id: requestId, value: payload }).unwrap()
        setSubmissionRef(data?.reference_no ?? null)
        setIsSuccess(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      const res = await createServiceRequest(payload).unwrap()
      // The base query converts certain 403s (EMAIL_VERIFICATION_REQUIRED) into
      // data, so we also check flow/type on the success path.
      const resData = res?.data
      const flowType = (resData?.flow ?? resData?.type)
      const ref = (resData?.request)?.reference_no
      const resMessage = (res?.message ?? resData?.message)

      // Always store the ref — the request is created on 201 regardless of flow
      if (ref) setSubmissionRef(ref)

      // Check specific flow types FIRST — before falling back to http_status_code
      if (flowType === FLOW_TYPES.EMAIL_VERIFICATION_REQUIRED) {
        setFlowScreen('EMAIL_VERIFICATION_REQUIRED')
        return
      }

      if (flowType === FLOW_TYPES.PHONE_VERIFICATION_REQUIRED) {
        setFlowScreen('PHONE_VERIFICATION_REQUIRED')
        return
      }

      if (resMessage === LOGIN_REQUIRED_MESSAGES.PHONE) {
        setFlowScreen('LOGIN_REQUIRED_PHONE')
        return
      }

      if (resMessage === LOGIN_REQUIRED_MESSAGES.EMAIL) {
        setFlowScreen('LOGIN_REQUIRED_EMAIL')
        return
      }

      // REQUEST_CREATED or any other 2xx with no special flow → success screen
      if (flowType === FLOW_TYPES.REQUEST_CREATED || res?.http_status_code === 201 || !flowType) {
        setIsSuccess(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      // Absolute fallback
      setIsSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })

    } catch (err) {
      const e = err as {
        data?: { message?: string; httpStatus?: number; errorType?: string }
        error?: string
      }
      const errorType = e?.data?.errorType
      const errMessage = e?.data?.message ?? e?.error

      if (
        errorType === FLOW_TYPES.EMAIL_VERIFICATION_REQUIRED ||
        errMessage?.toLowerCase().includes('email verification')
      ) {
        setFlowScreen('EMAIL_VERIFICATION_REQUIRED')
        return
      }

      if (
        errorType === FLOW_TYPES.PHONE_VERIFICATION_REQUIRED ||
        errMessage?.toLowerCase().includes('phone verification')
      ) {
        setFlowScreen('PHONE_VERIFICATION_REQUIRED')
        return
      }

      if (errMessage === LOGIN_REQUIRED_MESSAGES.PHONE) {
        setFlowScreen('LOGIN_REQUIRED_PHONE')
        return
      }

      if (errMessage === LOGIN_REQUIRED_MESSAGES.EMAIL) {
        setFlowScreen('LOGIN_REQUIRED_EMAIL')
        return
      }

      setSubmitError(errMessage ?? 'Une erreur est survenue. Veuillez réessayer.')
    }
  }

  function handleAnswer(id: string, val: string | string[]) {
    setAnswers((prev) => ({ ...prev, [id]: val }))
  }

  function touchField(id: string) {
    setTouchedFields((prev) => new Set([...prev, id]))
  }

  function getFieldError(q: ListEntity): string | undefined {
    if (!touchedFields.has(q.key) || !q.is_required) return undefined
    const val = answers[q.key]
    if (!val || (Array.isArray(val) ? val.length === 0 : val === '')) {
      return 'Ce champ est obligatoire'
    }
    return undefined
  }

  // ── Step header content
  function getStepTitle(): string {
    if (uiStep === 1) return 'Votre besoin'
    if (uiStep === contactUiStep) return 'Vos coordonnées'
    if (uiStep === summaryUiStep) return 'Récapitulatif'
    return 'Vos informations'
  }
  function getStepDesc(): string {
    if (uiStep === 1) return 'Sélectionnez le service et votre profil.'
    if (uiStep === contactUiStep) return 'Comment les prestataires peuvent-ils vous contacter ?'
    if (uiStep === summaryUiStep) return 'Vérifiez et confirmez votre demande.'
    return `Étape ${uiStep - 1} sur ${apiSteps.length}`
  }

  // ── Derived for summary
  const sumService = service
    ? (serviceOptions.find((o) => o.value === service)?.label ?? service)
    : '—'
  const sumType =
    clientType === 'Individual'
      ? '🏠 Particulier'
      : clientType === 'Company'
        ? '🏢 Entreprise'
        : '—'

  const isShaking = shakeStep === uiStep

  // ── Icons reused in summary
  const IconInfo = (
    <svg
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="w-full max-w-[620px] overflow-hidden rounded-[24px] border border-appBorder bg-appCard"
      style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}
    >
      {/* Progress bar */}
      {!isSuccess && !flowScreen && (
        <div className="h-1 bg-appElevated">
          <div
            className="h-full rounded-r-[2px] transition-[width] duration-500 ease-in-out"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--color-primaryColor), #6B8FFF)',
            }}
          />
        </div>
      )}

      {/* Step header */}
      {!isSuccess && !flowScreen && (
        <div className="flex items-center gap-3.5 px-8 pt-7">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-[12px] bg-blue-light dark:bg-[rgba(27,79,255,0.2)] text-[15px] font-extrabold text-primaryColor">
            {uiStep}
          </div>
          <div>
            <div className="mb-0.5 flex items-center gap-1.5">
              {Array.from({ length: totalUiSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i + 1 < uiStep
                    ? 'w-2 bg-trust-green'
                    : i + 1 === uiStep
                      ? 'w-5 bg-primaryColor'
                      : 'w-2 bg-slate-200 dark:bg-slate-700'
                    }`}
                />
              ))}
            </div>
            <h3 className="text-[18px] font-extrabold tracking-[-0.3px] text-appText">
              {getStepTitle()}
            </h3>
            <p className="mt-0.5 text-[13px] text-appTextSec">{getStepDesc()}</p>
          </div>
        </div>
      )}

      {/* Form body */}
      <div className="px-8 pb-8 pt-6">

        {/* ─── STEP 1: Service + client type ─── */}
        {!isSuccess && !flowScreen && uiStep === 1 && (
          <div
            key={`step1-${shakeKey}`}
            className={`animate-inscription-fade-up ${isShaking ? 'inscription-shake' : ''}`}
          >
            <div className="mb-5">
              <FieldLabel required>Catégorie de service</FieldLabel>
              <ReactSelect<ServiceOption, false>
                instanceId="service"
                options={serviceOptions}
                value={serviceOptions.find((o) => o.value === service) ?? null}
                onChange={(opt) => setService(opt?.value ?? '')}
                onBlur={() => setServiceTouched(true)}
                placeholder="— Choisir un service —"
                isLoading={isServicesLoading}
                loadingMessage={() => 'Chargement…'}
                noOptionsMessage={() =>
                  isServicesError ? 'Erreur de chargement' : 'Aucune option'
                }
                menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                menuPosition="fixed"
                styles={buildServiceSelectStyles(!!(serviceTouched && !service))}
                formatOptionLabel={({ label, image }) => (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {image ? (
                      <img
                        src={image}
                        alt={label}
                        style={{
                          width: 28,
                          height: 28,
                          objectFit: 'contain',
                          borderRadius: 6,
                          flexShrink: 0,
                          background: 'var(--color-slate-100)',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          background: 'var(--color-slate-100)',
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <span style={{ fontSize: 14, fontFamily: 'inherit' }}>{label}</span>
                  </div>
                )}
              />
              {serviceTouched && !service && (
                <p className="mt-1 text-[11px] text-red-500">Veuillez choisir un service</p>
              )}
            </div>

            <div className="mb-5">
              <FieldLabel required>Vous êtes</FieldLabel>
              <div className="grid grid-cols-2 gap-2.5">
                {(
                  [
                    {
                      value: 'Individual' as const,
                      emoji: '🏠',
                      label: 'Particulier',
                      desc: 'Pour votre domicile',
                    },
                    {
                      value: 'Company' as const,
                      emoji: '🏢',
                      label: 'Entreprise',
                      desc: 'Usage professionnel',
                    },
                  ] as const
                ).map(({ value, emoji, label, desc }) => {
                  const isSelected = clientType === value
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setClientType(value)}
                      className="cursor-pointer rounded-[12px] border-2 px-4 py-3.5 text-center transition-all duration-200 hover:-translate-y-px"
                      style={{
                        borderColor: isSelected
                          ? 'var(--color-primaryColor)'
                          : clientTypeTouched && !clientType
                            ? 'var(--color-red-500)'
                            : 'var(--app-border)',
                        background: isSelected
                          ? 'var(--color-primary-dim)'
                          : 'var(--app-surface)',
                        boxShadow: isSelected
                          ? '0 0 0 3px var(--color-primary-dim)'
                          : undefined,
                        fontFamily: 'inherit',
                      }}
                    >
                      <div className="mb-1.5 text-[22px]">{emoji}</div>
                      <div className="text-[13px] font-bold text-appText">{label}</div>
                      <div className="mt-0.5 text-[11px] text-appTextSec">{desc}</div>
                    </button>
                  )
                })}
              </div>
              {clientTypeTouched && !clientType && (
                <p className="mt-1.5 text-[11px] text-red-500">Veuillez choisir votre profil</p>
              )}
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={goNext}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[12px] border-none py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(27,79,255,0.28)] active:translate-y-0"
                style={{ background: 'var(--color-primaryColor)', fontFamily: 'inherit' }}
              >
                Continuer
                <FiArrowRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}

        {/* ─── DYNAMIC QUESTION STEPS ─── */}
        {!isSuccess && !flowScreen && uiStep >= 2 && uiStep < summaryUiStep && uiStep !== contactUiStep && (
          <div
            key={`step${uiStep}-${shakeKey}`}
            className={`animate-inscription-fade-up ${isShaking ? 'inscription-shake' : ''}`}
          >
            {isQuestionsLoading ? (
              <div className="flex items-center justify-center gap-3 py-12 text-[14px] text-appTextSec">
                <svg
                  className="h-5 w-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Chargement des questions…
              </div>
            ) : currentQuestions.length === 0 ? (
              <p className="py-6 text-center text-[14px] text-appTextSec">
                Aucune question pour cette étape.
              </p>
            ) : (
              currentQuestions.map((q) => (
                <DynamicQuestionField
                  key={q._id}
                  question={q}
                  value={answers[q.key] ?? (q.is_multiple || q.type === 'checkbox' ? [] : '')}
                  error={getFieldError(q)}
                  onChange={(val) => handleAnswer(q.key, val)}
                  onBlur={() => touchField(q.key)}
                />
              ))
            )}

            <div className="mt-6 flex gap-2.5">
              <button
                type="button"
                onClick={goPrev}
                className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-[12px] border-[1.5px] border-appBorder bg-appCard px-5 py-3.5 text-[14px] font-medium text-appTextSec transition-all hover:border-slate-400 dark:hover:border-slate-600 hover:bg-appSurface"
                style={{ fontFamily: 'inherit' }}
              >
                <FiArrowLeft size={14} strokeWidth={2.5} />
                Retour
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={isQuestionsLoading}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[12px] border-none py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(27,79,255,0.28)] active:translate-y-0 disabled:opacity-60"
                style={{ background: 'var(--color-primaryColor)', fontFamily: 'inherit' }}
              >
                Continuer
                <FiArrowRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}

        {/* ─── CONTACT STEP ─── */}
        {!isSuccess && !flowScreen && uiStep === contactUiStep && (
          <div
            key={`contact-${shakeKey}`}
            className={`animate-inscription-fade-up ${isShaking ? 'inscription-shake' : ''}`}
          >
            {/* Prénom */}
            <div className="mb-5">
              <FieldLabel required>Prénom</FieldLabel>
              <input
                type="text"
                name="firstName"
                value={contactFormik.values.firstName}
                onChange={contactFormik.handleChange}
                onBlur={contactFormik.handleBlur}
                placeholder="John"
                className={inputCls(!!(contactFormik.touched.firstName && contactFormik.errors.firstName))}
                style={{ fontFamily: 'inherit' }}
              />
              {contactFormik.touched.firstName && contactFormik.errors.firstName && (
                <p className="mt-1 text-[11px] text-red-500">{contactFormik.errors.firstName}</p>
              )}
            </div>

            {/* Nom */}
            <div className="mb-5">
              <FieldLabel required>Nom</FieldLabel>
              <input
                type="text"
                name="lastName"
                value={contactFormik.values.lastName}
                onChange={contactFormik.handleChange}
                onBlur={contactFormik.handleBlur}
                placeholder="Smith"
                className={inputCls(!!(contactFormik.touched.lastName && contactFormik.errors.lastName))}
                style={{ fontFamily: 'inherit' }}
              />
              {contactFormik.touched.lastName && contactFormik.errors.lastName && (
                <p className="mt-1 text-[11px] text-red-500">{contactFormik.errors.lastName}</p>
              )}
            </div>

            {/* Téléphone */}
            <div className="mb-5">
              <FieldLabel required>Numéro De Téléphone</FieldLabel>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-appTextMuted">
                  <FiPhone size={16} />
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={contactFormik.values.phone}
                  onChange={contactFormik.handleChange}
                  onBlur={contactFormik.handleBlur}
                  placeholder="+33 6 12 34 56 78"
                  readOnly={isEditMode}
                  disabled={isEditMode}
                  className={`${inputCls(!!(contactFormik.touched.phone && contactFormik.errors.phone))} pl-9`}
                  style={{ fontFamily: 'inherit' }}
                />
              </div>
              {contactFormik.touched.phone && contactFormik.errors.phone && (
                <p className="mt-1 text-[11px] text-red-500">{contactFormik.errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-5">
              <FieldLabel required>Adresse Email</FieldLabel>
              <input
                type="email"
                name="email"
                value={contactFormik.values.email}
                onChange={contactFormik.handleChange}
                onBlur={contactFormik.handleBlur}
                placeholder="email@example.com"
                readOnly={isEditMode}
                disabled={isEditMode}
                className={inputCls(!!(contactFormik.touched.email && contactFormik.errors.email))}
                style={{ fontFamily: 'inherit' }}
              />
              {contactFormik.touched.email && contactFormik.errors.email && (
                <p className="mt-1 text-[11px] text-red-500">{contactFormik.errors.email}</p>
              )}
            </div>

            {/* Notes */}
            <div className="mb-5">
              <FieldLabel optional>Donnez Plus De Détails</FieldLabel>
              <textarea
                name="notes"
                value={contactFormik.values.notes}
                onChange={contactFormik.handleChange}
                onBlur={contactFormik.handleBlur}
                placeholder="Écrivez ici..."
                rows={3}
                className={`${inputCls(false)} resize-y leading-[1.6]`}
                style={{ fontFamily: 'inherit', minHeight: 96 }}
              />
            </div>

            <div className="mt-6 flex gap-2.5">
              <button
                type="button"
                onClick={goPrev}
                className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-[12px] border-[1.5px] border-appBorder bg-appCard px-[22px] py-[13px] text-[14px] font-medium text-appTextSec transition-all hover:border-slate-400 dark:hover:border-slate-600 hover:bg-appSurface"
                style={{ fontFamily: 'inherit' }}
              >
                <FiArrowLeft size={14} strokeWidth={2.5} />
                Retour
              </button>
              <button
                type="button"
                onClick={goNext}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[12px] border-none py-[13px] text-[15px] font-semibold text-white transition-all hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(27,79,255,0.28)] active:translate-y-0"
                style={{ background: 'var(--color-primaryColor)', fontFamily: 'inherit' }}
              >
                Vérifier ma demande
                <FiArrowRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}

        {/* ─── SUMMARY ─── */}
        {!isSuccess && !flowScreen && uiStep === summaryUiStep && (
          <div
            key={`summary-${shakeKey}`}
            className="animate-inscription-fade-up"
          >
            <div className="mb-5 overflow-hidden rounded-[12px] border border-appBorderSub bg-appSurface">
              <SummaryRow
                icon={
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                }
                label="Service"
                value={sumService}
              />
              <SummaryRow
                icon={
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                }
                label="Profil"
                value={sumType}
              />
              {questionsList.map((q) => {
                const val = answers[q.key]
                if (!val || (Array.isArray(val) && val.length === 0)) return null
                return (
                  <SummaryRow
                    key={q._id}
                    icon={IconInfo}
                    label={q.label}
                    value={formatAnswerForDisplay(q, val)}
                  />
                )
              })}

              {/* ── Contact rows ── */}
              {(contactFormik.values.firstName || contactFormik.values.lastName) && (
                <SummaryRow
                  icon={
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  }
                  label="Nom complet"
                  value={`${contactFormik.values.firstName} ${contactFormik.values.lastName}`.trim()}
                />
              )}
              {contactFormik.values.phone && (
                <SummaryRow
                  icon={
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6 6l.9-.9a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  }
                  label="Téléphone"
                  value={contactFormik.values.phone}
                />
              )}
              {contactFormik.values.email && (
                <SummaryRow
                  icon={
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  }
                  label="Email"
                  value={contactFormik.values.email}
                />
              )}
              {contactFormik.values.notes.trim() && (
                <SummaryRow
                  icon={
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14,2 14,8 20,8" />
                    </svg>
                  }
                  label="Détails"
                  value={contactFormik.values.notes.length > 80 ? `${contactFormik.values.notes.slice(0, 80)}…` : contactFormik.values.notes}
                />
              )}
            </div>

            <div
              className="mb-5 flex gap-3 rounded-[12px] border-[1.5px] border-primary-icon-bg dark:border-[rgba(27,79,255,0.25)] bg-blue-light dark:bg-primary-dim p-4 text-primaryColor"
            >
              <FiInfo size={16} className="mt-0.5 shrink-0" aria-hidden />
              <p className="text-[13px] leading-[1.6]">
                Votre demande sera transmise aux professionnels de votre zone. Vous recevrez leurs
                devis directement dans votre espace client.
              </p>
            </div>

            {submitError && (
              <div className="mb-4 flex items-start gap-2.5 rounded-[12px] border border-red-200 bg-red-light px-4 py-3 text-[13px] text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mt-0.5 shrink-0" aria-hidden>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {submitError}
              </div>
            )}

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={goPrev}
                disabled={isSubmitting}
                className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-[12px] border-[1.5px] border-appBorder bg-appCard px-5 py-3.5 text-[14px] font-medium text-appTextSec transition-all hover:border-slate-400 dark:hover:border-slate-600 hover:bg-appSurface disabled:pointer-events-none disabled:opacity-50"
                style={{ fontFamily: 'inherit' }}
              >
                <FiArrowLeft size={14} strokeWidth={2.5} />
                Modifier
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[12px] border-none py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(27,79,255,0.28)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-70"
                style={{ background: 'var(--color-primaryColor)', fontFamily: 'inherit' }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {isEditMode ? 'Mise à jour en cours…' : 'Envoi en cours…'}
                  </>
                ) : (
                  <>
                    {isEditMode ? 'Enregistrer les modifications' : 'Envoyer ma demande'}
                    <FiCheck size={16} strokeWidth={2.5} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── Screen: Request Sent ──────────────────────────────────────────────── */}
        {isSuccess && (
          <RequestSentScreen submissionRef={submissionRef} variant={isEditMode ? 'edit' : 'create'} />
        )}

        {/* ── Screen: Email OTP Verification ───────────────────────────────────── */}
        {!isSuccess && flowScreen === 'EMAIL_VERIFICATION_REQUIRED' && (
          <OtpVerificationScreen
            type="email"
            contact={contactFormik.values.email}
            submissionRef={submissionRef}
            onVerified={() => {
              setFlowScreen(null)
              if (submissionRef) {
                setIsSuccess(true)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              } else {
                void handleSubmit()
              }
            }}
            onBack={() => { setFlowScreen(null); navTo(summaryUiStep) }}
          />
        )}

        {/* ── Screen: Phone OTP Verification ───────────────────────────────────── */}
        {!isSuccess && flowScreen === 'PHONE_VERIFICATION_REQUIRED' && (
          <OtpVerificationScreen
            type="phone"
            contact={contactFormik.values.phone}
            submissionRef={submissionRef}
            onVerified={() => {
              setFlowScreen(null)
              if (submissionRef) {
                setIsSuccess(true)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              } else {
                void handleSubmit()
              }
            }}
            onBack={() => { setFlowScreen(null); navTo(summaryUiStep) }}
          />
        )}

        {/* ── Screen: Login Required — duplicate email ──────────────────────────── */}
        {!isSuccess && flowScreen === 'LOGIN_REQUIRED_EMAIL' && (
          <LoginRequiredScreen
            loginType="email"
            onBack={() => navTo(summaryUiStep)}
          />
        )}

        {/* ── Screen: Login Required — duplicate phone ──────────────────────────── */}
        {!isSuccess && flowScreen === 'LOGIN_REQUIRED_PHONE' && (
          <LoginRequiredScreen
            loginType="phone"
            onBack={() => navTo(summaryUiStep)}
          />
        )}
      </div>
    </div>
  )
}
