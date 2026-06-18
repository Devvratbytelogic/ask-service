'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  FiChevronDown, FiMapPin, FiSearch,
  FiArrowLeft, FiArrowRight, FiCheck, FiInfo,
} from 'react-icons/fi'
import { getMyRequestRoutePath } from '@/routes/routes'

// ─── Types ────────────────────────────────────────────────────────────────────
type FormStep = 1 | 2 | 3

export interface RequestAServiceFormValues {
  service: string
  clientType: 'B2C' | 'B2B' | ''
  locationCode: string
  locationText: string
  date: string
  slot: string
  notes: string
}

interface City {
  cp: string
  v: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const SERVICE_GROUPS = [
  {
    group: 'Entretien',
    options: [
      { value: 'nettoyage', label: '🧹 Nettoyage' },
      { value: 'jardinage', label: '🌿 Jardinage' },
      { value: 'peinture', label: '🎨 Peinture' },
    ],
  },
  {
    group: 'Sécurité & Logistique',
    options: [
      { value: 'securite', label: '🔒 Sécurité / Gardiennage' },
      { value: 'demenagement', label: '📦 Déménagement' },
    ],
  },
  {
    group: 'Travaux',
    options: [
      { value: 'plomberie', label: '🔧 Plomberie' },
      { value: 'electricite', label: '⚡ Électricité' },
      { value: 'menuiserie', label: '🪵 Menuiserie' },
      { value: 'climatisation', label: '❄️ Climatisation / Chauffage' },
      { value: 'maconnerie', label: '🧱 Maçonnerie' },
    ],
  },
  {
    group: 'Digital & Autres',
    options: [
      { value: 'informatique', label: '💻 Informatique' },
      { value: 'autre', label: '✳️ Autre service' },
    ],
  },
]

const SERVICE_LABEL_MAP: Record<string, string> = Object.fromEntries(
  SERVICE_GROUPS.flatMap((g) => g.options.map((o) => [o.value, o.label]))
)

const SLOT_OPTIONS = [
  { value: 'matin', label: 'Matin (8h – 12h)' },
  { value: 'apres-midi', label: 'Après-midi (13h – 17h)' },
  { value: 'soir', label: 'Soir (17h – 20h)' },
  { value: 'journee', label: 'Toute la journée' },
  { value: 'flexible', label: 'Je suis flexible' },
] as const

const SLOT_LABEL_MAP: Record<string, string> = Object.fromEntries(
  SLOT_OPTIONS.map((o) => [o.value, o.label])
)

const CITIES: City[] = [
  { cp: '75001', v: 'Paris 1er' }, { cp: '75004', v: 'Paris 4e' }, { cp: '75008', v: 'Paris 8e' },
  { cp: '75015', v: 'Paris 15e' }, { cp: '75016', v: 'Paris 16e' }, { cp: '75017', v: 'Paris 17e' },
  { cp: '92100', v: 'Boulogne-Billancourt' }, { cp: '92300', v: 'Levallois-Perret' },
  { cp: '93100', v: 'Montreuil' }, { cp: '94000', v: 'Créteil' }, { cp: '78000', v: 'Versailles' },
  { cp: '91000', v: 'Évry' }, { cp: '77000', v: 'Melun' }, { cp: '69001', v: 'Lyon 1er' },
  { cp: '69006', v: 'Lyon 6e' }, { cp: '69008', v: 'Lyon 8e' }, { cp: '13001', v: 'Marseille 1er' },
  { cp: '13008', v: 'Marseille 8e' }, { cp: '31000', v: 'Toulouse' }, { cp: '33000', v: 'Bordeaux' },
  { cp: '44000', v: 'Nantes' }, { cp: '67000', v: 'Strasbourg' }, { cp: '59000', v: 'Lille' },
  { cp: '06000', v: 'Nice' }, { cp: '06400', v: 'Cannes' }, { cp: '35000', v: 'Rennes' },
  { cp: '76000', v: 'Rouen' }, { cp: '25000', v: 'Besançon' }, { cp: '21000', v: 'Dijon' },
  { cp: '57000', v: 'Metz' }, { cp: '54000', v: 'Nancy' }, { cp: '38000', v: 'Grenoble' },
  { cp: '34000', v: 'Montpellier' }, { cp: '30000', v: 'Nîmes' }, { cp: '83000', v: 'Toulon' },
  { cp: '64000', v: 'Pau' }, { cp: '17000', v: 'La Rochelle' }, { cp: '86000', v: 'Poitiers' },
  { cp: '87000', v: 'Limoges' }, { cp: '49000', v: 'Angers' }, { cp: '72000', v: 'Le Mans' },
  { cp: '63000', v: 'Clermont-Ferrand' }, { cp: '42000', v: 'Saint-Étienne' },
]

const STEP_META = {
  1: { title: 'Votre besoin', desc: 'Sélectionnez le service et votre profil.', progress: 33 },
  2: { title: 'Où et quand ?', desc: 'Localisation, date et créneau souhaités.', progress: 66 },
  3: { title: 'Récapitulatif', desc: 'Vérifiez et confirmez votre demande.', progress: 100 },
} as const

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

// ─── Validation schema ────────────────────────────────────────────────────────
const requestAServiceSchema = Yup.object({
  service: Yup.string().required('Veuillez choisir un service'),
  clientType: Yup.string()
    .oneOf(['B2C', 'B2B'], 'Veuillez choisir votre profil')
    .required('Veuillez choisir votre profil'),
  locationCode: Yup.string().required('Veuillez choisir une ville'),
  locationText: Yup.string().required(),
  date: Yup.string()
    .required('Veuillez choisir une date')
    .test('future-date', "La date doit être aujourd'hui ou dans le futur", (v) => {
      if (!v) return false
      return v >= getTodayMin()
    }),
  slot: Yup.string().required('Veuillez choisir un créneau'),
  notes: Yup.string(),
})

// ─── Initial values ───────────────────────────────────────────────────────────
const initialValues: RequestAServiceFormValues = {
  service: '',
  clientType: '',
  locationCode: '',
  locationText: '',
  date: '',
  slot: '',
  notes: '',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepDots({ current }: { current: FormStep }) {
  return (
    <div className="mb-0.5 flex items-center gap-1.5">
      {([1, 2, 3] as const).map((s) => (
        <div
          key={s}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            s < current ? 'w-2 bg-trust-green' : s === current ? 'w-5 bg-primaryColor' : 'w-2 bg-slate-200'
          }`}
        />
      ))}
    </div>
  )
}

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
    <label className="mb-2 block text-[13px] font-semibold tracking-[0.1px] text-slate-700">
      {children}
      {required && <span className="ml-0.5 text-primaryColor">*</span>}
      {optional && <span className="ml-1.5 text-[12px] font-normal text-slate-400">(optionnel)</span>}
    </label>
  )
}

function SelectField({
  name,
  value,
  onChange,
  onBlur,
  error = false,
  children,
}: {
  name: string
  value: string
  onChange: React.ChangeEventHandler<HTMLSelectElement>
  onBlur?: React.FocusEventHandler<HTMLSelectElement>
  error?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={[
          'w-full cursor-pointer appearance-none rounded-[12px] border-[1.5px] py-3 pl-4 pr-11 text-[14px] text-slate-900 outline-none transition-all',
          error
            ? 'border-red-500 bg-red-light'
            : 'border-slate-200 bg-slate-50 hover:border-slate-400 hover:bg-white focus:border-primaryColor focus:bg-white focus:shadow-[0_0_0_3px_var(--color-primary-dim)]',
        ].join(' ')}
        style={{ fontFamily: 'inherit' }}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
        <FiChevronDown size={14} strokeWidth={2.5} />
      </span>
    </div>
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
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0">
      <span className="flex shrink-0 items-center gap-2 text-[13px] text-slate-500">
        {icon}
        {label}
      </span>
      <span className="text-right text-[13px] font-semibold text-slate-900">{value}</span>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function RequestAServiceForm() {
  const [step, setStep] = useState<FormStep>(1)
  const [isSuccess, setIsSuccess] = useState(false)
  const [shakeStep, setShakeStep] = useState<FormStep | null>(null)
  const [shakeKey, setShakeKey] = useState(0)

  // Location UI state (separate from Formik — drives the search dropdown only)
  const [locQuery, setLocQuery] = useState('')
  const [locResults, setLocResults] = useState<City[]>([])
  const [locOpen, setLocOpen] = useState(false)
  const locWrapRef = useRef<HTMLDivElement>(null)

  const minDate = getTodayMin()

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (locWrapRef.current && !locWrapRef.current.contains(e.target as Node)) {
        setLocOpen(false)
      }
    }
    document.addEventListener('mousedown', onOutsideClick)
    return () => document.removeEventListener('mousedown', onOutsideClick)
  }, [])

  // ── Formik ────────────────────────────────────────────────────────────────
  const formik = useFormik<RequestAServiceFormValues>({
    initialValues,
    validationSchema: requestAServiceSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: () => {
      setIsSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
  })

  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    validateForm,
  } = formik

  // ── Location handlers ─────────────────────────────────────────────────────
  function handleLocInput(val: string) {
    setLocQuery(val)
    const q = val.toLowerCase().trim()
    if (q.length < 2) { setLocOpen(false); return }
    const filtered = CITIES.filter(
      (c) => c.v.toLowerCase().includes(q) || c.cp.includes(q)
    ).slice(0, 7)
    setLocResults(filtered)
    setLocOpen(filtered.length > 0)
  }

  function pickCity(city: City) {
    void setFieldValue('locationCode', city.cp)
    void setFieldValue('locationText', `${city.v} (${city.cp})`)
    setLocQuery('')
    setLocOpen(false)
  }

  function clearCity() {
    void setFieldValue('locationCode', '')
    void setFieldValue('locationText', '')
    setLocQuery('')
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  function triggerShake(s: FormStep) {
    setShakeStep(s)
    setShakeKey((k) => k + 1)
    setTimeout(() => setShakeStep(null), 450)
  }

  function navTo(n: FormStep) {
    setStep(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function goStep2() {
    await setFieldTouched('service', true, false)
    await setFieldTouched('clientType', true, false)
    const errs = await validateForm()
    if (errs.service || errs.clientType) {
      triggerShake(1)
      return
    }
    navTo(2)
  }

  async function goStep3() {
    await setFieldTouched('locationCode', true, false)
    await setFieldTouched('date', true, false)
    await setFieldTouched('slot', true, false)
    const errs = await validateForm()
    if (errs.locationCode || errs.date || errs.slot) {
      triggerShake(2)
      return
    }
    navTo(3)
  }

  // ── Derived ───────────────────────────────────────────────────────────────
  const meta = STEP_META[step]
  const sumService = values.service ? (SERVICE_LABEL_MAP[values.service] ?? values.service) : '—'
  const sumType =
    values.clientType === 'B2C'
      ? '🏠 Particulier'
      : values.clientType === 'B2B'
        ? '🏢 Entreprise'
        : '—'

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="w-full max-w-[620px] overflow-hidden rounded-[24px] border border-slate-200 bg-white"
      style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}
    >
      {/* Progress bar */}
      {!isSuccess && (
        <div className="h-1 bg-slate-100">
          <div
            className="h-full rounded-r-[2px] transition-[width] duration-500 ease-in-out"
            style={{
              width: `${meta.progress}%`,
              background: 'linear-gradient(90deg, var(--color-primaryColor), #6B8FFF)',
            }}
          />
        </div>
      )}

      {/* Step header */}
      {!isSuccess && (
        <div className="flex items-center gap-3.5 px-8 pt-7">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-[12px] bg-blue-light text-[15px] font-extrabold text-primaryColor">
            {step}
          </div>
          <div>
            <StepDots current={step} />
            <h3 className="text-[18px] font-extrabold tracking-[-0.3px] text-slate-900">
              {meta.title}
            </h3>
            <p className="mt-0.5 text-[13px] text-slate-500">{meta.desc}</p>
          </div>
        </div>
      )}

      {/* Form body */}
      <div className="px-8 pb-8 pt-6">

        {/* ─── STEP 1 : Service & client type ─── */}
        {!isSuccess && step === 1 && (
          <div
            key={`step1-${shakeKey}`}
            className={`animate-inscription-fade-up ${shakeStep === 1 ? 'inscription-shake' : ''}`}
          >
            {/* Service select */}
            <div className="mb-5">
              <FieldLabel required>Catégorie de service</FieldLabel>
              <SelectField
                name="service"
                value={values.service}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!(touched.service && errors.service)}
              >
                <option value="">— Choisir un service —</option>
                {SERVICE_GROUPS.map((g) => (
                  <optgroup key={g.group} label={g.group}>
                    {g.options.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </SelectField>
              {touched.service && errors.service && (
                <p className="mt-1 text-[11px] text-red-500">{errors.service}</p>
              )}
            </div>

            {/* Client type */}
            <div className="mb-5">
              <FieldLabel required>Vous êtes</FieldLabel>
              <div className="grid grid-cols-2 gap-2.5">
                {(
                  [
                    { value: 'B2C' as const, emoji: '🏠', label: 'Particulier', desc: 'Pour votre domicile' },
                    { value: 'B2B' as const, emoji: '🏢', label: 'Entreprise', desc: 'Usage professionnel' },
                  ] as const
                ).map(({ value, emoji, label, desc }) => {
                  const isSelected = values.clientType === value
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => void setFieldValue('clientType', value)}
                      className="cursor-pointer rounded-[12px] border-2 px-4 py-3.5 text-center transition-all duration-200 hover:-translate-y-px"
                      style={{
                        borderColor: isSelected
                          ? 'var(--color-primaryColor)'
                          : touched.clientType && errors.clientType
                            ? 'var(--color-red-500)'
                            : 'var(--color-slate-200)',
                        background: isSelected ? 'var(--color-blue-light)' : 'var(--color-slate-50)',
                        boxShadow: isSelected ? '0 0 0 3px var(--color-primary-dim)' : undefined,
                        fontFamily: 'inherit',
                      }}
                    >
                      <div className="mb-1.5 text-[22px]">{emoji}</div>
                      <div className="text-[13px] font-bold text-slate-900">{label}</div>
                      <div className="mt-0.5 text-[11px] text-slate-500">{desc}</div>
                    </button>
                  )
                })}
              </div>
              {touched.clientType && errors.clientType && (
                <p className="mt-1.5 text-[11px] text-red-500">{errors.clientType}</p>
              )}
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => void goStep2()}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[12px] border-none py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(27,79,255,0.28)] active:translate-y-0"
                style={{ background: 'var(--color-primaryColor)', fontFamily: 'inherit' }}
              >
                Continuer
                <FiArrowRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 2 : Location, date, slot, notes ─── */}
        {!isSuccess && step === 2 && (
          <div
            key={`step2-${shakeKey}`}
            className={`animate-inscription-fade-up ${shakeStep === 2 ? 'inscription-shake' : ''}`}
          >
            {/* Location */}
            <div className="mb-5" ref={locWrapRef}>
              <FieldLabel required>Ville ou code postal</FieldLabel>

              {values.locationText ? (
                <div
                  className="flex items-center gap-2.5 rounded-[12px] border-[1.5px] px-4 py-3"
                  style={{ background: 'var(--color-blue-light)', borderColor: 'rgba(27,79,255,0.2)' }}
                >
                  <FiMapPin size={15} className="shrink-0 text-primaryColor" />
                  <span className="flex-1 text-[14px] font-semibold text-primaryColor">
                    {values.locationText}
                  </span>
                  <button
                    type="button"
                    onClick={clearCity}
                    className="cursor-pointer text-[22px] leading-none text-primaryColor opacity-70 transition-opacity hover:opacity-100"
                    aria-label="Modifier la localisation"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ex : Paris, Lyon, 75008…"
                    value={locQuery}
                    onChange={(e) => handleLocInput(e.target.value)}
                    onBlur={() => void setFieldTouched('locationCode', true)}
                    autoComplete="off"
                    className={[
                      'w-full rounded-[12px] border-[1.5px] py-3 pl-4 pr-11 text-[14px] text-slate-900 outline-none transition-all',
                      touched.locationCode && errors.locationCode
                        ? 'border-red-500 bg-red-light'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-400 hover:bg-white focus:border-primaryColor focus:bg-white focus:shadow-[0_0_0_3px_var(--color-primary-dim)]',
                    ].join(' ')}
                    style={{ fontFamily: 'inherit' }}
                  />
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <FiSearch size={15} />
                  </span>

                  {locOpen && locResults.length > 0 && (
                    <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 max-h-[220px] overflow-y-auto rounded-[12px] border-[1.5px] border-slate-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
                      {locResults.map((city) => (
                        <button
                          key={city.cp}
                          type="button"
                          onClick={() => pickCity(city)}
                          className="flex w-full cursor-pointer items-center gap-2.5 border-b border-slate-50 px-4 py-2.5 text-left text-[13px] text-slate-700 transition-colors last:border-b-0 hover:bg-blue-light hover:text-primaryColor"
                          style={{ fontFamily: 'inherit' }}
                        >
                          <FiMapPin size={13} className="shrink-0" />
                          <span className="min-w-[48px] font-bold text-primaryColor">{city.cp}</span>
                          {city.v}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {touched.locationCode && errors.locationCode && !values.locationText && (
                <p className="mt-1 text-[11px] text-red-500">{errors.locationCode}</p>
              )}
            </div>

            {/* Date + Slot row */}
            <div className="mb-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <FieldLabel required>Date souhaitée</FieldLabel>
                <input
                  type="date"
                  name="date"
                  value={values.date}
                  min={minDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={[
                    'w-full cursor-pointer rounded-[12px] border-[1.5px] py-3 pl-4 pr-4 text-[14px] text-slate-900 outline-none transition-all',
                    touched.date && errors.date
                      ? 'border-red-500 bg-red-light'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-400 hover:bg-white focus:border-primaryColor focus:bg-white focus:shadow-[0_0_0_3px_var(--color-primary-dim)]',
                  ].join(' ')}
                  style={{ fontFamily: 'inherit' }}
                />
                {touched.date && errors.date && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.date}</p>
                )}
              </div>

              <div>
                <FieldLabel required>Créneau horaire</FieldLabel>
                <SelectField
                  name="slot"
                  value={values.slot}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!(touched.slot && errors.slot)}
                >
                  <option value="">Choisir un créneau</option>
                  {SLOT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </SelectField>
                {touched.slot && errors.slot && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.slot}</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-5">
              <FieldLabel optional>Détails supplémentaires</FieldLabel>
              <textarea
                name="notes"
                value={values.notes}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Décrivez votre besoin plus précisément : surface, contraintes particulières, matériaux souhaités…"
                rows={3}
                className="w-full resize-y rounded-[12px] border-[1.5px] border-slate-200 bg-slate-50 px-4 py-3 text-[14px] leading-[1.6] text-slate-900 outline-none transition-all hover:border-slate-400 hover:bg-white focus:border-primaryColor focus:bg-white focus:shadow-[0_0_0_3px_var(--color-primary-dim)]"
                style={{ fontFamily: 'inherit', minHeight: 96 }}
              />
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => navTo(1)}
                className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-[12px] border-[1.5px] border-slate-200 bg-white px-5 py-3.5 text-[14px] font-medium text-slate-600 transition-all hover:border-slate-400 hover:bg-slate-50"
                style={{ fontFamily: 'inherit' }}
              >
                <FiArrowLeft size={14} strokeWidth={2.5} />
                Retour
              </button>
              <button
                type="button"
                onClick={() => void goStep3()}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[12px] border-none py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(27,79,255,0.28)] active:translate-y-0"
                style={{ background: 'var(--color-primaryColor)', fontFamily: 'inherit' }}
              >
                Vérifier ma demande
                <FiArrowRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 3 : Summary & confirm ─── */}
        {!isSuccess && step === 3 && (
          <div
            key={`step3-${shakeKey}`}
            className={`animate-inscription-fade-up ${shakeStep === 3 ? 'inscription-shake' : ''}`}
          >
            <div className="mb-5 overflow-hidden rounded-[12px] border border-slate-100 bg-slate-50">
              <SummaryRow
                icon={
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                }
                label="Service"
                value={sumService}
              />
              <SummaryRow
                icon={
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                }
                label="Profil"
                value={sumType}
              />
              <SummaryRow
                icon={
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                }
                label="Localisation"
                value={values.locationText || '—'}
              />
              <SummaryRow
                icon={
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                }
                label="Date"
                value={formatDate(values.date)}
              />
              <SummaryRow
                icon={
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                  </svg>
                }
                label="Créneau"
                value={SLOT_LABEL_MAP[values.slot] ?? '—'}
              />
              {values.notes.trim() && (
                <div className="flex items-start justify-between gap-3 px-4 py-3">
                  <span className="flex shrink-0 items-center gap-2 text-[13px] text-slate-500">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14,2 14,8 20,8" />
                    </svg>
                    Notes
                  </span>
                  <span className="max-w-[240px] text-right text-[12px] text-slate-500">
                    {values.notes.length > 80 ? `${values.notes.slice(0, 80)}…` : values.notes}
                  </span>
                </div>
              )}
            </div>

            <div
              className="mb-5 flex gap-3 rounded-[12px] border-[1.5px] p-4 text-primaryColor"
              style={{ background: 'var(--color-blue-light)', borderColor: 'rgba(27,79,255,0.15)' }}
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
                onClick={() => navTo(2)}
                className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-[12px] border-[1.5px] border-slate-200 bg-white px-5 py-3.5 text-[14px] font-medium text-slate-600 transition-all hover:border-slate-400 hover:bg-slate-50"
                style={{ fontFamily: 'inherit' }}
              >
                <FiArrowLeft size={14} strokeWidth={2.5} />
                Modifier
              </button>
              <button
                type="button"
                onClick={() => formik.handleSubmit()}
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
              className="mx-auto mb-5 flex size-[68px] animate-inscription-pop-in items-center justify-center rounded-full text-[30px]"
              style={{ background: 'var(--color-green-light)' }}
            >
              ✓
            </div>

            <h3 className="mb-2 text-[22px] font-extrabold tracking-[-0.4px] text-slate-900">
              Demande envoyée !
            </h3>

            <p className="mx-auto mb-7 text-[14px] leading-[1.65] text-slate-500" style={{ maxWidth: 360 }}>
              Votre demande a bien été transmise. Les professionnels vérifiés vont vous envoyer
              leurs devis sous 24h.
            </p>

            <div className="mb-7 flex flex-col gap-2 text-left">
              {SUCCESS_STEPS.map((text, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-[10px] border border-slate-100 bg-slate-50 px-3.5 py-2.5"
                >
                  <div className="flex size-[26px] shrink-0 items-center justify-center rounded-[8px] bg-blue-light text-[12px] font-extrabold text-primaryColor">
                    {i + 1}
                  </div>
                  <span className="text-[13px] text-slate-700">{text}</span>
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
