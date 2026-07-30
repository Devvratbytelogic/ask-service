/// <reference types="@types/google.maps" />
import { GOOGLE_API_KEY } from '@/utils/config'

const SCRIPT_ID = 'google-maps-places-sdk'
const CALLBACK_NAME = '__askServiceInitGooglePlaces'

let loadPromise: Promise<void> | null = null

export function loadGooglePlaces(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Places is only available in the browser'))
  }

  if (window.google?.maps?.places) {
    return Promise.resolve()
  }

  if (loadPromise) return loadPromise

  loadPromise = new Promise<void>((resolve, reject) => {
    const win = window as Window & { [CALLBACK_NAME]?: () => void }

    const settle = () => {
      if (window.google?.maps?.places) {
        resolve()
        return
      }
      loadPromise = null
      reject(new Error('Google Places failed to initialize'))
    }

    win[CALLBACK_NAME] = settle

    if (document.getElementById(SCRIPT_ID)) {
      const started = Date.now()
      const timer = window.setInterval(() => {
        if (window.google?.maps?.places) {
          window.clearInterval(timer)
          resolve()
        } else if (Date.now() - started > 15000) {
          window.clearInterval(timer)
          loadPromise = null
          reject(new Error('Timed out loading Google Places'))
        }
      }, 50)
      return
    }

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.async = true
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places&language=fr&callback=${CALLBACK_NAME}`
    script.onerror = () => {
      loadPromise = null
      reject(new Error('Failed to load Google Places'))
    }
    document.head.appendChild(script)
  })

  return loadPromise
}

export type PlaceDetails = {
  postal: string
  city: string
  state: string
  country: string
  street: string
  formattedAddress: string
}

export type PlaceLocationValue = {
  pincode: string
  city: string
  address: string
  state: string
  country: string
}

export type PlacePredictionOption = {
  placeId: string
  label: string
  mainText: string
  postal: string
  city: string
  address: string
  state: string
  country: string
}

function parseAddressComponents(
  components: google.maps.GeocoderAddressComponent[],
  fallbackName = '',
): Omit<PlaceDetails, 'formattedAddress'> {
  const get = (...types: string[]) =>
    components.find((component) => types.some((type) => component.types.includes(type)))
      ?.long_name ?? ''

  const streetNumber = get('street_number')
  const route = get('route')
  const street = [streetNumber, route].filter(Boolean).join(' ')

  const city =
    get('locality', 'postal_town') ||
    get('sublocality', 'sublocality_level_1') ||
    get('administrative_area_level_3') ||
    get('administrative_area_level_2') ||
    fallbackName

  return {
    postal: get('postal_code'),
    city,
    state: get('administrative_area_level_1'),
    country: get('country'),
    street,
  }
}

function buildOptionLabel(postal: string, address: string): string {
  if (postal && address) return `${postal} · ${address}`
  if (postal) return postal
  return address
}

export async function fetchPlaceDetails(placeId: string): Promise<PlaceDetails> {
  await loadGooglePlaces()

  const attribution = document.createElement('div')
  const service = new google.maps.places.PlacesService(attribution)

  return new Promise((resolve, reject) => {
    service.getDetails(
      {
        placeId,
        fields: ['address_components', 'formatted_address', 'name'],
      },
      (place, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !place?.address_components) {
          reject(new Error('Failed to fetch place details'))
          return
        }

        const parsed = parseAddressComponents(place.address_components, place.name ?? '')
        resolve({
          ...parsed,
          formattedAddress: place.formatted_address ?? place.name ?? '',
        })
      },
    )
  })
}

export async function fetchPlacePredictions(
  input: string,
  options?: { country?: string },
): Promise<PlacePredictionOption[]> {
  await loadGooglePlaces()

  const service = new google.maps.places.AutocompleteService()
  const country = options?.country?.toLowerCase()

  const predictions = await new Promise<google.maps.places.AutocompletePrediction[]>(
    (resolve) => {
      // No `types` filter → countries, cities, states, streets, full addresses
      // for complete world predictions
      // service.getPlacePredictions({ input }, (results, status) => {
      //   if (status !== google.maps.places.PlacesServiceStatus.OK || !results) {
      //     resolve([])
      //     return
      //   }
      //   resolve(results)
      // })
      service.getPlacePredictions(
        {
          input,
          ...(country ? { componentRestrictions: { country } } : {}),
        },
        (results, status) => {
          if (status !== google.maps.places.PlacesServiceStatus.OK || !results) {
            resolve([])
            return
          }
          resolve(results)
        },
      )
    },
  )

  const enriched = await Promise.all(
    predictions.map(async (prediction) => {
      const fallbackAddress = prediction.description
      const mainText = prediction.structured_formatting?.main_text ?? fallbackAddress

      try {
        const details = await fetchPlaceDetails(prediction.place_id)
        const address = details.formattedAddress || fallbackAddress

        return {
          placeId: prediction.place_id,
          postal: details.postal,
          city: details.city,
          address,
          state: details.state,
          country: details.country,
          mainText,
          label: buildOptionLabel(details.postal, address),
        }
      } catch {
        return {
          placeId: prediction.place_id,
          postal: '',
          city: mainText,
          address: fallbackAddress,
          state: '',
          country: '',
          mainText,
          label: fallbackAddress,
        }
      }
    }),
  )

  return enriched
}
