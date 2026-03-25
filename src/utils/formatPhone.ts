import { parsePhoneNumberFromString } from "libphonenumber-js"

export interface FormattedPhone {
  countryCode: string
  nationalNumber: string
  /** Full formatted string when you need a single display value */
  formatted: string
}

/**
 * Parses a raw phone value (e.g. from react-phone-input-2: "919650321876")
 * and returns country code and national number for separate display.
 * Prepends "+" so libphonenumber-js auto-detects the country from the dialing code.
 */
export function formatPhoneWithCountryCode(
  raw: string | null | undefined,
  // kept for backward-compat; no longer used for parsing
  _defaultCountry?: "FR" | "US"
): FormattedPhone {
  const fallback: FormattedPhone = {
    countryCode: "",
    nationalNumber: raw?.trim() || "—",
    formatted: raw?.trim() || "—",
  }
  if (!raw?.trim()) return fallback

  const normalized = raw.trim().startsWith("+") ? raw.trim() : `+${raw.trim()}`
  const parsed = parsePhoneNumberFromString(normalized)
  if (!parsed) return fallback

  // Use international format for national part so we don't get leading 0 (e.g. FR "06...").
  // formatNational() would give "06 57 65 86 58"; with +33 we want "6 57 65 86 58".
  const international = parsed.formatInternational()
  const nationalWithoutTrunkPrefix = international.replace(/^\+\d{1,3}\s*/, "")

  return {
    countryCode: `+${parsed.countryCallingCode}`,
    nationalNumber: nationalWithoutTrunkPrefix,
    formatted: international,
  }
}
