"use client"

import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"

type Props = {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  name?: string
  disabled?: boolean
}

export default function PhoneField({
  value,
  onChange,
  onBlur,
  name = "phone",
  disabled,
}: Props) {
  return (
    <PhoneInput
      country="fr"
      enableSearch
      countryCodeEditable={false}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      inputProps={{ name, disabled }}
      containerClass="!w-full"
      inputClass="!w-full !rounded-[12px] !border-appBorder"
      inputStyle={{ height: 52 }}
    />
  )
}
