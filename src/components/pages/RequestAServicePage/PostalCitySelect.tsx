'use client'

import { useMemo, useState } from 'react'
import ReactSelect, { components, type DropdownIndicatorProps } from 'react-select'
import { FiMapPin, FiSearch } from 'react-icons/fi'
import francePostalCodes from '@/data/france-postal-codes.json'
import { buildPostalSelectStyles, type PostalOption } from './selectStyles'

type PostalEntry = { code: string; name: string }

export function getPostalOptionKey(entry: PostalEntry) {
  return `${entry.code}|${entry.name}`
}

function formatPostalLabel(code: string, name: string) {
  return `${code} ${name}`
}

export function resolvePostalOption(value: string): PostalOption | null {
  if (!value) return null

  if (value.includes('|')) {
    const [code, ...rest] = value.split('|')
    const name = rest.join('|')
    return { value, label: formatPostalLabel(code, name), code, name }
  }

  const entry = (francePostalCodes as PostalEntry[]).find(
    (p) => value === formatPostalLabel(p.code, p.name) || value === p.code,
  )
  if (entry) {
    const key = getPostalOptionKey(entry)
    return {
      value: key,
      label: formatPostalLabel(entry.code, entry.name),
      code: entry.code,
      name: entry.name,
    }
  }

  return { value, label: value, code: value, name: '' }
}

function filterPostalEntries(query: string, limit = 50): PostalOption[] {
  const q = query.trim()
  if (q.length < 2) return []

  const qLower = q.toLowerCase()
  const isNumeric = /^\d+$/.test(q)
  const results: PostalOption[] = []

  for (const entry of francePostalCodes as PostalEntry[]) {
    const matches = isNumeric
      ? entry.code.startsWith(q)
      : entry.code.includes(q) || entry.name.toLowerCase().includes(qLower)

    if (!matches) continue

    results.push({
      value: getPostalOptionKey(entry),
      label: formatPostalLabel(entry.code, entry.name),
      code: entry.code,
      name: entry.name,
    })

    if (results.length >= limit) break
  }

  return results
}

function PostalOptionLabel({ code, name }: { code: string; name: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <FiMapPin size={14} className="shrink-0 text-appTextMuted" strokeWidth={2} />
      <span className="text-[14px]">
        <span className="font-semibold text-primaryColor">{code}</span>
        {' '}
        <span className="text-appText">{name}</span>
      </span>
    </div>
  )
}

function SearchDropdownIndicator(props: DropdownIndicatorProps<PostalOption, false>) {
  return (
    <components.DropdownIndicator {...props}>
      <FiSearch size={16} className="text-appTextMuted" />
    </components.DropdownIndicator>
  )
}

type PostalCitySelectProps = {
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  hasError?: boolean
}

export default function PostalCitySelect({
  value,
  onChange,
  onBlur,
  hasError = false,
}: PostalCitySelectProps) {
  const [inputValue, setInputValue] = useState('')
  const selected = useMemo(() => resolvePostalOption(value), [value])
  const options = useMemo(() => filterPostalEntries(inputValue), [inputValue])

  return (
    <ReactSelect<PostalOption, false>
      instanceId="cityOrPostalCode"
      options={options}
      value={selected}
      inputValue={inputValue}
      onInputChange={(val, meta) => {
        if (meta.action === 'input-change') setInputValue(val)
        if (meta.action === 'menu-close' || meta.action === 'set-value') setInputValue('')
      }}
      onChange={(opt) => {
        onChange(opt?.value ?? '')
        setInputValue('')
      }}
      onBlur={onBlur}
      placeholder=""
      isClearable
      filterOption={() => true}
      noOptionsMessage={() =>
        inputValue.trim().length < 2
          ? 'Saisissez au moins 2 caractères'
          : 'Aucun résultat'
      }
      components={{
        DropdownIndicator: SearchDropdownIndicator,
        IndicatorSeparator: () => null,
      }}
      formatOptionLabel={(opt) => <PostalOptionLabel code={opt.code} name={opt.name} />}
      styles={buildPostalSelectStyles(hasError)}
      menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
      menuPosition="fixed"
      menuShouldScrollIntoView={false}
    />
  )
}
