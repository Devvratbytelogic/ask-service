'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { FiArrowLeft, FiArrowRight, FiCheck, FiInfo, FiPhone } from 'react-icons/fi'
import ReactSelect from 'react-select'
import { getMyRequestRoutePath } from '@/routes/routes'
import {
  useGetAllServicesQuery,
  useGetServicesQuetionsQuery,
} from '@/redux/rtkQueries/clientSideGetApis'
import {
  buildServiceSelectStyles,
  buildDynSelectStyles,
  type ServiceOption,
  type DynOption,
} from './selectStyles'
import type { ListEntity } from '@/types/serviceQuestions'

// ─── Types ────────────────────────────────────────────────────────────────────
type ClientType = 'B2C' | 'B2B' | ''

// ─── Constants ────────────────────────────────────────────────────────────────
const SUCCESS_STEPS = [
  'Les professionnels reçoivent votre demande et préparent leurs devis',
  "Vous recevez jusqu'à 5 devis dans votre espace client sous 24h",
  'Vous choisissez le professionnel qui vous convient le mieux',
] as const

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getTodayMin() {
  const t = new Date()
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const KNOWN_TYPES = [
  'dropdown', 'radio', 'checkbox',
  'date', 'time', 'date & time', 'datetime',
  'textarea', 'number', 'text', 'file',
] as const

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
function FieldLabel({
  children,
  required = false,
  optional = false,
}: {
  children: React.ReactNode
  required?: boolean
  optional?: boolean
}) {
  return (
    <label className="mb-2 block text-[13px] font-semibold tracking-[0.1px] text-appText">
      {children}
      {required && <span className="ml-0.5 text-primaryColor">*</span>}
      {optional && (
        <span className="ml-1.5 text-[12px] font-normal text-slate-400">(optionnel)</span>
      )}
    </label>
  )
}

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

function inputCls(hasError: boolean) {
  return [
    'w-full rounded-[12px] border-[1.5px] py-3 px-4 text-[14px] text-appText outline-none transition-all',
    hasError
      ? 'border-red-500 bg-red-light focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
      : 'border-appBorder bg-appSurface hover:border-slate-400 dark:hover:border-slate-600 hover:bg-appCard focus:border-primaryColor focus:bg-appCard focus:shadow-[0_0_0_3px_var(--color-primary-dim)]',
  ].join(' ')
}

function DynamicQuestionField({
  question,
  value,
  error,
  onChange,
  onBlur,
}: {
  question: ListEntity
  value: string | string[]
  error?: string
  onChange: (val: string | string[]) => void
  onBlur: () => void
}) {
  const options: DynOption[] = (question.options ?? [])
    .filter(Boolean)
    .map((o) => ({ value: o!.value, label: o!.label }))

  const hasError = !!error
  const minDate = getTodayMin()
  const strVal = value as string
  const arrVal = Array.isArray(value) ? value : []

  function toggleOption(optValue: string, multi: boolean) {
    if (!multi) {
      onChange(optValue)
      onBlur()
    } else {
      const updated = arrVal.includes(optValue)
        ? arrVal.filter((v) => v !== optValue)
        : [...arrVal, optValue]
      onChange(updated)
      onBlur()
    }
  }

  const pillCls = (selected: boolean) =>
    [
      'flex cursor-pointer items-center gap-2 rounded-[10px] border-2 px-3.5 py-2 text-[13px] font-medium transition-all',
      selected
        ? 'border-primaryColor bg-blue-light dark:bg-[rgba(27,79,255,0.2)] font-semibold text-primaryColor'
        : hasError
          ? 'border-red-200 bg-appSurface text-appText hover:border-red-300'
          : 'border-appBorder bg-appSurface text-appText hover:border-slate-400 dark:hover:border-slate-600 hover:bg-appCard',
    ].join(' ')

  return (
    <div className="mb-5">
      <FieldLabel required={question.is_required} optional={!question.is_required}>
        {question.label}
      </FieldLabel>

      {/* ── Dropdown single ── */}
      {question.type === 'dropdown' && !question.is_multiple && (
        <ReactSelect<DynOption, false>
          instanceId={question._id}
          options={options}
          value={options.find((o) => o.value === strVal) ?? null}
          onChange={(opt) => onChange(opt?.value ?? '')}
          onBlur={onBlur}
          placeholder={question.placeholder ?? '— Choisir —'}
          menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
          menuPosition="fixed"
          styles={buildDynSelectStyles<false>(hasError)}
        />
      )}

      {/* ── Dropdown multi ── */}
      {question.type === 'dropdown' && question.is_multiple && (
        <ReactSelect<DynOption, true>
          isMulti
          instanceId={question._id}
          options={options}
          value={options.filter((o) => arrVal.includes(o.value))}
          onChange={(selected) => onChange(selected ? selected.map((o) => o.value) : [])}
          onBlur={onBlur}
          placeholder={question.placeholder ?? '— Choisir —'}
          menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
          menuPosition="fixed"
          styles={buildDynSelectStyles<true>(hasError)}
        />
      )}

      {/* ── Radio ── */}
      {question.type === 'radio' && (
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => {
            const selected = strVal === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleOption(opt.value, false)}
                className={pillCls(selected)}
                style={{ fontFamily: 'inherit' }}
              >
                <span
                  className={`flex size-[15px] shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    selected ? 'border-primaryColor' : 'border-slate-300'
                  }`}
                >
                  {selected && (
                    <span className="size-[7px] rounded-full bg-primaryColor" />
                  )}
                </span>
                {opt.label}
              </button>
            )
          })}
        </div>
      )}

      {/* ── Checkbox ── */}
      {question.type === 'checkbox' && (
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => {
            const checked = arrVal.includes(opt.value)
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleOption(opt.value, true)}
                className={pillCls(checked)}
                style={{ fontFamily: 'inherit' }}
              >
                <span
                  className={`flex size-[15px] shrink-0 items-center justify-center rounded-[4px] border-2 transition-colors ${
                    checked ? 'border-primaryColor bg-primaryColor' : 'border-slate-300'
                  }`}
                >
                  {checked && (
                    <FiCheck size={9} strokeWidth={3} className="text-white" />
                  )}
                </span>
                {opt.label}
              </button>
            )
          })}
        </div>
      )}

      {/* ── Date ── */}
      {question.type === 'date' && (
        <input
          type="date"
          value={strVal}
          min={minDate}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={inputCls(hasError)}
          style={{ fontFamily: 'inherit', cursor: 'pointer' }}
        />
      )}

      {/* ── Time ── */}
      {question.type === 'time' && (
        <input
          type="time"
          value={strVal}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={inputCls(hasError)}
          style={{ fontFamily: 'inherit', cursor: 'pointer' }}
        />
      )}

      {/* ── Date & Time ── */}
      {(question.type === 'date & time' || question.type === 'datetime') && (
        <input
          type="datetime-local"
          value={strVal}
          min={`${minDate}T00:00`}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={inputCls(hasError)}
          style={{ fontFamily: 'inherit', cursor: 'pointer' }}
        />
      )}

      {/* ── Textarea ── */}
      {question.type === 'textarea' && (
        <textarea
          value={strVal}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={question.placeholder ?? ''}
          rows={3}
          className={`${inputCls(hasError)} resize-y leading-[1.6]`}
          style={{ fontFamily: 'inherit', minHeight: 96 }}
        />
      )}

      {/* ── Number ── */}
      {question.type === 'number' && (
        <input
          type="number"
          value={strVal}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={question.placeholder ?? ''}
          className={inputCls(hasError)}
          style={{ fontFamily: 'inherit' }}
        />
      )}

      {/* ── Text ── */}
      {question.type === 'text' && (
        <input
          type="text"
          value={strVal}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={question.placeholder ?? ''}
          className={inputCls(hasError)}
          style={{ fontFamily: 'inherit' }}
        />
      )}

      {/* ── File ── */}
      {question.type === 'file' && (
        <label
          className={[
            'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-dashed py-7 transition-all',
            hasError
              ? 'border-red-400 bg-red-light'
              : strVal
                ? 'border-primaryColor bg-blue-light dark:bg-[rgba(27,79,255,0.2)]'
                : 'border-appBorder bg-appSurface hover:border-primaryColor hover:bg-blue-light dark:hover:bg-[rgba(27,79,255,0.2)]',
          ].join(' ')}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke={strVal ? 'var(--color-primaryColor)' : 'var(--app-text-muted)'}
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span
            className={`text-[13px] font-semibold ${strVal ? 'text-primaryColor' : 'text-appText'}`}
            style={{ fontFamily: 'inherit' }}
          >
            {strVal || 'Choisir un fichier'}
          </span>
          {!strVal && (
            <span className="text-[11px] text-appTextMuted">ou glissez-déposez ici</span>
          )}
          <input
            type="file"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                onChange(file.name)
                onBlur()
              }
            }}
          />
        </label>
      )}

      {/* ── Unknown type fallback ── */}
      {!(KNOWN_TYPES as readonly string[]).includes(question.type) && (
        <input
          type="text"
          value={strVal}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={question.placeholder ?? ''}
          className={inputCls(hasError)}
          style={{ fontFamily: 'inherit' }}
        />
      )}

      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function RequestAServiceForm() {
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

  // ── UI state
  const [uiStep, setUiStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)
  const [shakeStep, setShakeStep] = useState<number | null>(null)

  // ── Step 1 state (service + clientType)
  const [service, setService] = useState('')
  const [serviceTouched, setServiceTouched] = useState(false)
  const [clientType, setClientType] = useState<ClientType>('')
  const [clientTypeTouched, setClientTypeTouched] = useState(false)

  // ── Dynamic answers
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

  // ── Contact step state
  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    notes: '',
  })
  const [contactTouched, setContactTouched] = useState<Set<string>>(new Set())

  // ── Questions API (fires once a service is selected)
  const { data: questionsResponse, isLoading: isQuestionsLoading } =
    useGetServicesQuetionsQuery({ id: service }, { skip: !service })

  const questionsList = useMemo(
    () => questionsResponse?.data?.list ?? [],
    [questionsResponse],
  )

  // Reset dynamic answers whenever the selected service changes
  useEffect(() => {
    setAnswers({})
    setTouchedFields(new Set())
  }, [service])

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
    setUiStep(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goNext() {
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
        const val = answers[q._id]
        return !val || (Array.isArray(val) ? val.length === 0 : val === '')
      })
      setTouchedFields((prev) => {
        const next = new Set(prev)
        currentQuestions.forEach((q) => next.add(q._id))
        return next
      })
      if (hasErr) {
        triggerShake()
        return
      }
      navTo(uiStep + 1)
    } else if (uiStep === contactUiStep) {
      const requiredFields = ['firstName', 'lastName', 'phone', 'email'] as const
      setContactTouched(new Set(requiredFields))
      const hasErr = requiredFields.some((f) => {
        const val = contact[f]
        if (!val) return true
        if (f === 'email') return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
        return false
      })
      if (hasErr) {
        triggerShake()
        return
      }
      navTo(uiStep + 1)
    }
  }

  function goPrev() {
    navTo(uiStep - 1)
  }

  function handleAnswer(id: string, val: string | string[]) {
    setAnswers((prev) => ({ ...prev, [id]: val }))
  }

  function touchField(id: string) {
    setTouchedFields((prev) => new Set([...prev, id]))
  }

  function getFieldError(q: ListEntity): string | undefined {
    if (!touchedFields.has(q._id) || !q.is_required) return undefined
    const val = answers[q._id]
    if (!val || (Array.isArray(val) ? val.length === 0 : val === '')) {
      return 'Ce champ est obligatoire'
    }
    return undefined
  }

  // ── Contact validation
  function getContactError(field: keyof typeof contact): string | undefined {
    if (!contactTouched.has(field)) return undefined
    if (field === 'notes') return undefined
    const val = contact[field]
    if (!val) return 'Ce champ est obligatoire'
    if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      return 'Adresse email invalide'
    }
    return undefined
  }

  function touchContact(field: keyof typeof contact) {
    setContactTouched((prev) => new Set([...prev, field]))
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
    clientType === 'B2C'
      ? '🏠 Particulier'
      : clientType === 'B2B'
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
      {!isSuccess && (
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
      {!isSuccess && (
        <div className="flex items-center gap-3.5 px-8 pt-7">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-[12px] bg-blue-light dark:bg-[rgba(27,79,255,0.2)] text-[15px] font-extrabold text-primaryColor">
            {uiStep}
          </div>
          <div>
            <div className="mb-0.5 flex items-center gap-1.5">
              {Array.from({ length: totalUiSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i + 1 < uiStep
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
        {!isSuccess && uiStep === 1 && (
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
                      value: 'B2C' as const,
                      emoji: '🏠',
                      label: 'Particulier',
                      desc: 'Pour votre domicile',
                    },
                    {
                      value: 'B2B' as const,
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
        {!isSuccess && uiStep >= 2 && uiStep < summaryUiStep && uiStep !== contactUiStep && (
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
                  value={answers[q._id] ?? (q.is_multiple || q.type === 'checkbox' ? [] : '')}
                  error={getFieldError(q)}
                  onChange={(val) => handleAnswer(q._id, val)}
                  onBlur={() => touchField(q._id)}
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
        {!isSuccess && uiStep === contactUiStep && (
          <div
            key={`contact-${shakeKey}`}
            className={`animate-inscription-fade-up ${isShaking ? 'inscription-shake' : ''}`}
          >
            {/* Prénom */}
            <div className="mb-5">
              <FieldLabel required>Prénom</FieldLabel>
              <input
                type="text"
                value={contact.firstName}
                onChange={(e) => setContact((p) => ({ ...p, firstName: e.target.value }))}
                onBlur={() => touchContact('firstName')}
                placeholder="John"
                className={inputCls(!!getContactError('firstName'))}
                style={{ fontFamily: 'inherit' }}
              />
              {getContactError('firstName') && (
                <p className="mt-1 text-[11px] text-red-500">{getContactError('firstName')}</p>
              )}
            </div>

            {/* Nom */}
            <div className="mb-5">
              <FieldLabel required>Nom</FieldLabel>
              <input
                type="text"
                value={contact.lastName}
                onChange={(e) => setContact((p) => ({ ...p, lastName: e.target.value }))}
                onBlur={() => touchContact('lastName')}
                placeholder="Smith"
                className={inputCls(!!getContactError('lastName'))}
                style={{ fontFamily: 'inherit' }}
              />
              {getContactError('lastName') && (
                <p className="mt-1 text-[11px] text-red-500">{getContactError('lastName')}</p>
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
                  value={contact.phone}
                  onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))}
                  onBlur={() => touchContact('phone')}
                  placeholder="+33 6 12 34 56 78"
                  className={`${inputCls(!!getContactError('phone'))} pl-9`}
                  style={{ fontFamily: 'inherit' }}
                />
              </div>
              {getContactError('phone') && (
                <p className="mt-1 text-[11px] text-red-500">{getContactError('phone')}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-5">
              <FieldLabel required>Adresse Email</FieldLabel>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
                onBlur={() => touchContact('email')}
                placeholder="email@example.com"
                className={inputCls(!!getContactError('email'))}
                style={{ fontFamily: 'inherit' }}
              />
              {getContactError('email') && (
                <p className="mt-1 text-[11px] text-red-500">{getContactError('email')}</p>
              )}
            </div>

            {/* Notes */}
            <div className="mb-5">
              <FieldLabel optional>Donnez Plus De Détails</FieldLabel>
              <textarea
                value={contact.notes}
                onChange={(e) => setContact((p) => ({ ...p, notes: e.target.value }))}
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
        {!isSuccess && uiStep === summaryUiStep && (
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
                const val = answers[q._id]
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
              {(contact.firstName || contact.lastName) && (
                <SummaryRow
                  icon={
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  }
                  label="Nom complet"
                  value={`${contact.firstName} ${contact.lastName}`.trim()}
                />
              )}
              {contact.phone && (
                <SummaryRow
                  icon={
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6 6l.9-.9a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  }
                  label="Téléphone"
                  value={contact.phone}
                />
              )}
              {contact.email && (
                <SummaryRow
                  icon={
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  }
                  label="Email"
                  value={contact.email}
                />
              )}
              {contact.notes.trim() && (
                <SummaryRow
                  icon={
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14,2 14,8 20,8" />
                    </svg>
                  }
                  label="Détails"
                  value={contact.notes.length > 80 ? `${contact.notes.slice(0, 80)}…` : contact.notes}
                />
              )}
            </div>

            <div
              className="mb-5 flex gap-3 rounded-[12px] border-[1.5px] p-4 text-primaryColor"
              style={{
                background: 'var(--color-blue-light)',
                borderColor: 'rgba(27,79,255,0.15)',
              }}
            >
              <FiInfo size={16} className="mt-0.5 shrink-0" aria-hidden />
              <p className="text-[13px] leading-[1.6]">
                Votre demande sera transmise aux professionnels de votre zone. Vous recevrez leurs
                devis directement dans votre espace client.
              </p>
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={goPrev}
                className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-[12px] border-[1.5px] border-appBorder bg-appCard px-5 py-3.5 text-[14px] font-medium text-appTextSec transition-all hover:border-slate-400 dark:hover:border-slate-600 hover:bg-appSurface"
                style={{ fontFamily: 'inherit' }}
              >
                <FiArrowLeft size={14} strokeWidth={2.5} />
                Modifier
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSuccess(true)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[12px] border-none py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(27,79,255,0.28)] active:translate-y-0"
                style={{ background: 'var(--color-primaryColor)', fontFamily: 'inherit' }}
              >
                Envoyer ma demande
                <FiCheck size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}

        {/* ─── SUCCESS ─── */}
        {isSuccess && (
          <div className="animate-inscription-fade-up py-3 text-center">
            <div
              className="mx-auto mb-5 flex size-[68px] animate-inscription-pop-in items-center justify-center rounded-full bg-green-light dark:bg-green-icon-bg text-[30px] text-trust-green"
            >
              ✓
            </div>

            <h3 className="mb-2 text-[22px] font-extrabold tracking-[-0.4px] text-appText">
              Demande envoyée !
            </h3>

            <p
              className="mx-auto mb-7 text-[14px] leading-[1.65] text-appTextSec"
              style={{ maxWidth: 360 }}
            >
              Votre demande a bien été transmise. Les professionnels vérifiés vont vous envoyer
              leurs devis sous 24h.
            </p>

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

            <Link
              href={getMyRequestRoutePath()}
              className="flex w-full items-center justify-center gap-2 rounded-[12px] py-3.5 text-[15px] font-semibold text-white no-underline transition-all hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(27,79,255,0.28)]"
              style={{ background: 'var(--color-primaryColor)' }}
            >
              Voir mes demandes
              <FiArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
