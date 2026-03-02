/**
 * France-primary postal code to address lookup.
 * Uses Zippopotam for city/state/country and api-adresse.data.gouv.fr for street address (reverse geocode).
 */

export type PincodeAddressResult = {
  address_1: string
  address_2: string
  city: string
  state: string
  country: string
}

const FRANCE_DEFAULTS: PincodeAddressResult = {
  address_1: "",
  address_2: "",
  city: "",
  state: "",
  country: "France",
}

/** French postal codes are 5 digits (e.g. 75001, 69001) */
function isFrenchPostalCode(pincode: string): boolean {
  const trimmed = String(pincode).trim().replace(/\s/g, "")
  return /^\d{5}$/.test(trimmed)
}

type ZippopotamPlace = {
  "place name"?: string
  state?: string
  latitude?: string
  longitude?: string
}

/**
 * Fetches full address (street, city, state, country) from postal code.
 * France primary: Zippopotam for city/state/country + BAN reverse geocode for a sample street address.
 */
export async function getAddressFromPincode(
  pincode: string
): Promise<PincodeAddressResult> {
  const code = String(pincode).trim().replace(/\s/g, "")
  if (!code) return { ...FRANCE_DEFAULTS }

  if (isFrenchPostalCode(code)) {
    try {
      const zipRes = await fetch(
        `https://api.zippopotam.us/fr/${encodeURIComponent(code)}`
      )
      if (!zipRes.ok) return { ...FRANCE_DEFAULTS }
      const zipData = (await zipRes.json()) as {
        country?: string
        places?: ZippopotamPlace[]
      }
      const place = zipData?.places?.[0] as ZippopotamPlace | undefined
      const city = place?.["place name"] ?? ""
      const state = place?.state ?? ""
      const country = zipData?.country ?? "France"
      const lat = place?.latitude
      const lon = place?.longitude

      let address_1 = ""
      let address_2 = ""

      if (lat && lon) {
        try {
          const revRes = await fetch(
            `https://api-adresse.data.gouv.fr/reverse/?lon=${encodeURIComponent(lon)}&lat=${encodeURIComponent(lat)}`
          )
          if (revRes.ok) {
            const revData = (await revRes.json()) as {
              features?: Array<{
                properties?: {
                  type?: string
                  label?: string
                  name?: string
                  district?: string
                  city?: string
                  postcode?: string
                }
              }>
            }
            const streetFeature = revData?.features?.find(
              (f) =>
                f?.properties?.type === "housenumber" ||
                f?.properties?.type === "street"
            )
            const props = streetFeature?.properties
            if (props?.label) {
              address_1 = props.label
              if (props.district) address_2 = props.district
            } else if (props?.name) {
              address_1 = props.name
              if (props.district) address_2 = props.district
            }
          }
        } catch {
          // keep address_1/address_2 empty if reverse fails
        }
      }

      return {
        address_1,
        address_2,
        city,
        state,
        country,
      }
    } catch {
      return { ...FRANCE_DEFAULTS }
    }
  }

  return { ...FRANCE_DEFAULTS }
}
