import type { GoogleGeocodeResponse } from "@/redux/geo-location/geoLocation"

export interface ParsedAddress {
    address_1: string
    address_2: string
    city: string
    state: string
    country: string
}

/**
 * Parses Google Geocoding API response into address fields.
 * Extracts address_1, address_2, city, state, country from address_components.
 */
export function parseGeocodeResponse(response: GoogleGeocodeResponse | undefined): ParsedAddress {
    const empty: ParsedAddress = {
        address_1: "",
        address_2: "",
        city: "",
        state: "",
        country: "",
    }

    if (!response?.results?.length || response.status !== "OK") {
        return empty
    }

    const results = response.results
    const isFranceResult = (r: (typeof results)[0]) =>
        r.address_components?.some(
            (c) => c.types.includes("country") && c.long_name === "France"
        ) ?? false
    const franceResult = results.find(isFranceResult)
    const result = franceResult ?? results[0]
    const components = result.address_components ?? []


    const getComponent = (types: string[]) =>
        components.find((c) => types.some((t) => c.types.includes(t)))?.long_name ?? ""

    const streetNumber = getComponent(["street_number"])
    const route = getComponent(["route"])
    const locality = getComponent(["locality"])
    const sublocality = getComponent(["sublocality", "sublocality_level_1"])
    const adminLevel1 = getComponent(["administrative_area_level_1"])
    const adminLevel2 = getComponent(["administrative_area_level_2"])
    const country = getComponent(["country"])

    const address_1 = [streetNumber, route].filter(Boolean).join(" ") || (result.formatted_address ?? "")
    const address_2 = sublocality || adminLevel2 || ""
    const city = locality || sublocality || adminLevel2 || ""
    const state = adminLevel1
    const countryName = country

    return {
        address_1: address_1.trim(),
        address_2: address_2.trim(),
        city: city.trim(),
        state: state.trim(),
        country: countryName.trim(),
    }
}
