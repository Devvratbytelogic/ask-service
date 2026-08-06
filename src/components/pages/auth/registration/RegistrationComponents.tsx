import { useState, useRef } from 'react'
import { FiUpload, FiFile, FiX, FiCheck } from 'react-icons/fi'

// ─── Types ────────────────────────────────────────────────────────────────────
export type Step = 1 | 2 | 3 | 4 | 5

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getPasswordStrength(val: string) {
  if (!val) {
    return { width: '0%', color: '', text: 'Entrez un mot de passe', textColor: 'var(--color-slate-400)' }
  }
  let score = 0
  if (val.length >= 8) score++
  if (/[A-Z]/.test(val)) score++
  if (/[0-9]/.test(val)) score++
  if (/[^A-Za-z0-9]/.test(val)) score++
  const configs = [
    { width: '25%',  color: 'var(--color-red-500)',    text: 'Trop faible',                  textColor: 'var(--color-red-500)'     },
    { width: '50%',  color: 'var(--color-amber)',       text: 'Moyen — ajoutez des chiffres', textColor: 'var(--color-amber-dark)'  },
    { width: '75%',  color: 'var(--color-blue-medium)', text: 'Bien — ajoutez des symboles',  textColor: 'var(--color-blue-medium)' },
    { width: '100%', color: 'var(--color-trust-green)', text: 'Excellent !',                  textColor: 'var(--color-trust-green)' },
  ]
  return configs[score - 1] || configs[0]
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

// ─── ProgressSteps ────────────────────────────────────────────────────────────
export function ProgressSteps({ currentStep, isVendor }: { currentStep: Step; isVendor: boolean }) {
  const steps = isVendor
    ? [
      { id: 1, label: 'Profil' },
      { id: 2, label: 'Infos' },
      { id: 3, label: 'Sécurité' },
      { id: 4, label: 'Code' },
      { id: 5, label: 'Docs' },
    ]
    : [
      { id: 1, label: 'Profil' },
      { id: 2, label: 'Infos' },
      { id: 3, label: 'Sécurité' },
      { id: 4, label: 'Code' },
    ]

  return (
    <div className="mb-6 min-[901px]:mb-8">
      <div className="flex items-center">
        {steps.map((s, idx) => {
          const state: 'done' | 'active' | 'pending' =
            s.id < currentStep ? 'done' : s.id === currentStep ? 'active' : 'pending'

          return (
            <div key={s.id} className="relative flex flex-1 flex-col items-center gap-1 min-[901px]:gap-1.5">
              {idx < steps.length - 1 && (
                <div
                  className={`absolute top-3 z-0 h-0.5 transition-colors duration-300 min-[901px]:top-3.5 ${state === 'done' ? 'bg-trust-green' : 'bg-appBorder'}`}
                  style={{ left: '50%', right: '-50%' }}
                />
              )}
              <div
                className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-all duration-300 min-[901px]:h-7 min-[901px]:w-7 min-[901px]:text-xs ${
                  state === 'pending'
                    ? 'bg-appBorder text-appTextMuted'
                    : state === 'active'
                      ? 'bg-primaryColor text-white shadow-[0_0_0_4px_var(--color-primary-dim)]'
                      : 'bg-trust-green text-white'
                }`}
              >
                {state === 'done' ? <FiCheck className="size-3.5" strokeWidth={3} aria-hidden /> : s.id}
              </div>
              <span
                className={`hidden text-center text-[10px] font-medium transition-colors min-[480px]:block min-[901px]:text-[11px] ${
                  state === 'pending'
                    ? 'text-appTextMuted'
                    : state === 'active'
                      ? 'font-semibold text-primaryColor'
                      : 'text-trust-green'
                }`}
              >
                {s.label}
              </span>
            </div>
          )
        })}
      </div>
      <p className="mt-2 text-center text-[11px] font-semibold text-primaryColor min-[480px]:hidden">
        {steps.find((s) => s.id === currentStep)?.label}
      </p>
    </div>
  )
}

// ─── Field ────────────────────────────────────────────────────────────────────
export function Field({
  label,
  required = false,
  requiredColor = 'var(--color-amber)',
  optional = false,
  errorMessage,
  children,
}: {
  label: string
  required?: boolean
  requiredColor?: string
  optional?: boolean
  errorMessage?: string | false | null
  children: React.ReactNode
}) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 flex items-center justify-between text-[13px] font-semibold text-appText">
        <span>
          {label}{' '}
          {required && <span style={{ color: requiredColor }}>*</span>}
        </span>
        {optional && (
          <span className="text-[12px] font-normal text-appTextMuted">optionnel</span>
        )}
      </label>
      {children}
      {errorMessage && (
        <p className="mt-1 text-[11px] text-red-500">{errorMessage}</p>
      )}
    </div>
  )
}

// ─── StyledInput ──────────────────────────────────────────────────────────────
export function StyledInput({
  icon,
  error = false,
  rightSlot,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode
  error?: boolean
  rightSlot?: React.ReactNode
}) {
  return (
    <div className="relative">
      <input
        {...props}
        className={[
          'w-full rounded-[10px] px-4 py-3 text-[14px] text-appText outline-none transition-all',
          'border-[1.5px]',
          error
            ? 'border-red-500 bg-red-light focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
            : 'border-appBorder bg-appSurface focus:border-primaryColor focus:bg-appCard focus:shadow-[0_0_0_3px_var(--color-primary-dim)]',
          (icon || rightSlot) ? 'pr-11' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{ fontFamily: 'inherit' }}
      />
      {(icon || rightSlot) && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-appTextMuted">
          {rightSlot ?? icon}
        </span>
      )}
    </div>
  )
}

// ─── DocUploadZone ────────────────────────────────────────────────────────────



interface DocUploadZoneProps {
  label: string
  required?: boolean
  hint?: string
  file: File | null
  error?: string
  accentColor: string
  onChange: (file: File | null) => void
}

export function DocUploadZone({ label, required, hint, file, error, accentColor, onChange }: DocUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) onChange(dropped)
  }

  return (
    <div className="mb-4">
      <p className="mb-1.5 text-[13px] font-semibold text-appText">
        {label}
        {required && <span className="ml-0.5" style={{ color: accentColor }}>*</span>}
        {!required && <span className="ml-2 text-[12px] font-normal text-appTextMuted">optionnel</span>}
      </p>

      {file ? (
        <div className="flex items-center gap-3 rounded-[10px] border-[1.5px] border-appBorder bg-appSurface px-4 py-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white"
            style={{ background: accentColor }}
          >
            <FiFile size={15} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-appText">{file.name}</p>
            <p className="text-[11px] text-appTextMuted">{formatFileSize(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="shrink-0 cursor-pointer rounded-full p-1 text-appTextMuted transition-colors hover:bg-appBorder hover:text-red-500"
            aria-label="Supprimer le fichier"
          >
            <FiX size={14} />
          </button>
        </div>
      ) : (
        <div
          className={[
            'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[10px] border-[1.5px] border-dashed py-6 text-center transition-all',
            error
              ? 'border-red-400 bg-red-50'
              : isDragging
                ? 'scale-[1.01] border-primaryColor bg-blue-light'
                : 'border-appBorder bg-appSurface hover:border-appBorder hover:bg-appCard',
          ].join(' ')}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors"
            style={{ background: isDragging ? accentColor : 'var(--color-slate-100)' }}
          >
            <FiUpload size={16} color={isDragging ? 'white' : 'var(--color-slate-500)'} />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-appText">
              Glissez un fichier ici ou{' '}
              <span style={{ color: accentColor }}>parcourez</span>
            </p>
            {hint && <p className="mt-0.5 text-[11px] text-appTextMuted">{hint}</p>}
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.svg"
        className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) onChange(e.target.files[0]) }}
      />
      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  )
}
