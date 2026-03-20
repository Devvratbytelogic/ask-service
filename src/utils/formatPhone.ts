import { parsePhoneNumberFromString } from "libphonenumber-js"

export interface FormattedPhone {
  countryCode: string
  nationalNumber: string
  /** Full formatted string when you need a single display value */
  formatted: string
}

/**
 * Parses a raw phone value (e.g. from react-phone-input-2: "33687687687")
 * and returns country code and national number for separate display.
 * Uses FR as default country when the number is entered in the French flow.
 */
export function formatPhoneWithCountryCode(
  raw: string | null | undefined,
  defaultCountry: "FR" | "US" = "FR"
): FormattedPhone {
  const fallback: FormattedPhone = {
    countryCode: "",
    nationalNumber: raw?.trim() || "—",
    formatted: raw?.trim() || "—",
  }
  if (!raw?.trim()) return fallback

  const parsed = parsePhoneNumberFromString(raw.trim(), defaultCountry)
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
