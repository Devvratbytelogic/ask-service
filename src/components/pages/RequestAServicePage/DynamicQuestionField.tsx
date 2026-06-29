'use client'

import ReactSelect from 'react-select'
import { FiCheck } from 'react-icons/fi'
import { buildDynSelectStyles, type DynOption } from './selectStyles'
import type { ListEntity } from '@/types/serviceQuestions'

// ── Shared helpers ────────────────────────────────────────────────────────────

export function inputCls(hasError: boolean) {
  return [
    'w-full rounded-[12px] border-[1.5px] py-3 px-4 text-[14px] text-appText outline-none transition-all',
    hasError
      ? 'border-red-500 bg-red-light focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
      : 'border-appBorder bg-appSurface hover:border-slate-400 dark:hover:border-slate-600 hover:bg-appCard focus:border-primaryColor focus:bg-appCard focus:shadow-[0_0_0_3px_var(--color-primary-dim)]',
  ].join(' ')
}

export function FieldLabel({
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

// ── Internal helpers ──────────────────────────────────────────────────────────

function getTodayMin() {
  const t = new Date()
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

const KNOWN_TYPES = [
  'dropdown', 'radio', 'checkbox',
  'date', 'time', 'date & time', 'datetime',
  'textarea', 'number', 'text', 'file',
] as const

// ── Component ─────────────────────────────────────────────────────────────────

interface DynamicQuestionFieldProps {
  question: ListEntity
  value: string | string[]
  error?: string
  onChange: (val: string | string[]) => void
  onBlur: () => void
}

export default function DynamicQuestionField({
  question,
  value,
  error,
  onChange,
  onBlur,
}: DynamicQuestionFieldProps) {
  const options: DynOption[] = (question.options ?? [])
    .filter(Boolean)
    .map((o) => ({ value: o!.value, label: o!.label }))

  const hasError = !!error
  const minDate = getTodayMin()
  const isMulti = question.is_multiple || question.type === 'checkbox'
  const strVal = Array.isArray(value) ? value[0] ?? '' : (value ?? '')
  const arrVal = isMulti
    ? Array.isArray(value)
      ? value
      : value
        ? [String(value)]
        : []
    : []

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
                  {selected && <span className="size-[7px] rounded-full bg-primaryColor" />}
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
                  {checked && <FiCheck size={9} strokeWidth={3} className="text-white" />}
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
