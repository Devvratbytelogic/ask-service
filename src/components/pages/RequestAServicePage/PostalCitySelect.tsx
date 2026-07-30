'use client'

import { useEffect, useState } from 'react'
import ReactSelect, { type StylesConfig } from 'react-select'
import { buildDynSelectStyles } from './selectStyles'
import {
  fetchPlaceDetails,
  fetchPlacePredictions,
  loadGooglePlaces,
  type PlaceLocationValue,
} from '@/utils/googlePlaces'

const DEBOUNCE_MS = 300
const MIN_CHARS = 2

const EMPTY_LOCATION: PlaceLocationValue = {
  pincode: '',
  city: '',
  address: '',
  state: '',
  country: '',
}

type PostalCityOption = {
  value: string
  city: string
  label: string
  postal?: string
  address?: string
  state?: string
  country?: string
  placeId?: string
}

type PostalCitySelectProps = {
  value: string
  city?: string
  address?: string
  state?: string
  country?: string
  onChange: (location: PlaceLocationValue) => void
  onBlur: () => void
  hasError?: boolean
  placeholder?: string
}

export default function PostalCitySelect({
  value,
  city = '',
  address = '',
  state = '',
  country = '',
  onChange,
  onBlur,
  hasError = false,
  placeholder = 'Ex. Paris, 75001, 10 rue de Rivoli',
}: PostalCitySelectProps) {
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState<PostalCityOption[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    void loadGooglePlaces().catch(() => {
      /* Places will retry on search */
    })
  }, [])

  useEffect(() => {
    const search = inputValue.trim()

    if (search.length < MIN_CHARS) {
      setOptions([])
      setIsLoading(false)
      return
    }

    let cancelled = false
    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const predictions = await fetchPlacePredictions(search, { country: 'fr' })
        if (cancelled) return
        setOptions(
          predictions.map((prediction) => ({
            value: prediction.placeId,
            placeId: prediction.placeId,
            postal: prediction.postal,
            city: prediction.city,
            address: prediction.address,
            state: prediction.state,
            country: prediction.country,
            label: prediction.label,
          })),
        )
      } catch {
        if (!cancelled) setOptions([])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [inputValue])

  const selectedLabel =
    value && (address || city)
      ? [value, address || city].filter(Boolean).join(' · ')
      : value || city || ''

  const selected =
    options.find((option) => option.value === value || option.postal === value) ??
    (value || city
      ? { value: value || city, city, address, state, country, label: selectedLabel }
      : null)

  return (
    <ReactSelect<PostalCityOption, false>
      instanceId="postalCode"
      options={options}
      value={selected}
      inputValue={inputValue}
      isLoading={isLoading}
      onInputChange={(nextValue, meta) => {
        if (meta.action === 'input-change') setInputValue(nextValue)
        if (meta.action === 'menu-close' || meta.action === 'set-value') setInputValue('')
      }}
      onChange={(option) => {
        void (async () => {
          if (!option) {
            onChange(EMPTY_LOCATION)
            setInputValue('')
            return
          }

          if (option.postal || option.address || option.state || option.country) {
            onChange({
              pincode: option.postal ?? '',
              city: option.city ?? '',
              address: option.address ?? '',
              state: option.state ?? '',
              country: option.country ?? '',
            })
            setInputValue('')
            return
          }

          const placeId = option.placeId ?? option.value
          try {
            const details = await fetchPlaceDetails(placeId)
            onChange({
              pincode: details.postal,
              city: details.city,
              address: details.formattedAddress,
              state: details.state,
              country: details.country,
            })
          } catch {
            onChange({
              ...EMPTY_LOCATION,
              city: option.city || '',
              address: option.label || '',
            })
          }
          setInputValue('')
        })()
      }}
      onBlur={onBlur}
      placeholder={placeholder}
      isClearable
      filterOption={() => true}
      noOptionsMessage={() =>
        inputValue.trim().length < MIN_CHARS
          ? 'Saisissez au moins 2 caractères'
          : isLoading
            ? 'Recherche…'
            : 'Aucun résultat'
      }
      formatOptionLabel={(option) => (
        <span className="text-[14px] text-appText">{option.label}</span>
      )}
      styles={
        buildDynSelectStyles(hasError) as unknown as StylesConfig<PostalCityOption, false>
      }
      menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
      menuPosition="fixed"
      menuShouldScrollIntoView={false}
    />
  )
}
