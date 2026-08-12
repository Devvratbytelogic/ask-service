import { parsePhoneNumberFromString } from "libphonenumber-js"

/**
 * Split a react-phone-input-2 value into API fields.
 * Example: "33612345678" → { phone: "612345678", country_code: "+33" }
 */
export function splitPhoneForApi(raw?: string | null) {
  const digits = (raw ?? "").replace(/\D/g, "")
  if (!digits) return { phone: "", country_code: "" }

  const parsed = parsePhoneNumberFromString(`+${digits}`)
  if (!parsed) return { phone: digits, country_code: "" }

  return {
    phone: parsed.nationalNumber,
    country_code: `+${parsed.countryCallingCode}`,
  }
}
