'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import ReactSelect from 'react-select'
import { buildDynSelectStyles } from './selectStyles'

const API_URL = 'https://geo.api.gouv.fr/communes'
const LIMIT = 20
const DEBOUNCE_MS = 300

export interface IPostalCityApiResponse {
  nom: string
  codesPostaux?: (string | null)[] | null
  code: string
}

type PostalCitySelectProps = {
  value: string
  city?: string
  onChange: (pincode: string, city: string) => void
  onBlur: () => void
  hasError?: boolean
  placeholder?: string
}

export default function PostalCitySelect({
  value,
  city = '',
  onChange,
  onBlur,
  hasError = false,
  placeholder = 'Example - paris, london',
}: PostalCitySelectProps) {
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState<any[]>([])

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const search = inputValue.trim()
        const { data } = await axios.get<IPostalCityApiResponse[]>(API_URL, {
          params: {
            fields: 'nom,codesPostaux,code',
            format: 'json',
            limit: LIMIT,
            ...(search ? { nom: search } : {}),
          },
        })

        setOptions(
          data.flatMap((commune) =>
            (commune.codesPostaux ?? [])
              .filter((code): code is string => code != null)
              .map((code) => ({
                value: code,
                city: commune.nom,
                label: `${code} ${commune.nom}`,
              })),
          ),
        )
      } catch {
        setOptions([])
      }
    }, DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [inputValue])

  const selected =
    options.find((option) => option.value === value) ??
    (value
      ? { value, city, label: city ? `${value} ${city}` : value }
      : null)

  return (
    <ReactSelect
      instanceId="postalCode"
      options={options}
      value={selected}
      inputValue={inputValue}
      onInputChange={(nextValue, meta) => {
        if (meta.action === 'input-change') setInputValue(nextValue)
        if (meta.action === 'menu-close' || meta.action === 'set-value') setInputValue('')
      }}
      onChange={(option) => {
        onChange(option?.value ?? '', option?.city ?? '')
        setInputValue('')
      }}
      onBlur={onBlur}
      placeholder={placeholder}
      isClearable
      filterOption={() => true}
      noOptionsMessage={() =>
        inputValue.trim().length < 2 ? 'Saisissez au moins 2 caractères' : 'Aucun résultat'
      }
      formatOptionLabel={(option) => (
        <span className="text-[14px] text-appText">{option.label}</span>
      )}
      styles={buildDynSelectStyles(hasError)}
      menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
      menuPosition="fixed"
      menuShouldScrollIntoView={false}
    />
  )
}
