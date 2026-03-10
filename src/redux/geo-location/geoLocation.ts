/* eslint-disable @typescript-eslint/no-explicit-any */

import { GOOGLE_API_KEY } from "@/utils/config";
import { geoLocationApiService } from "../services/geoLocationApiService";



export const geoLocation = geoLocationApiService.injectEndpoints({
    endpoints: builder => ({
        getGeoLocation: builder.query<any, { latLong: string }>({
            query: ({ latLong }) => `/json?latlng=${latLong}&key=${GOOGLE_API_KEY}`,
        }),
        getUpdatedGeoLocation: builder.query<any, void>({
            query: (address) => `/json?address=${address}&key=${GOOGLE_API_KEY}`,
        }),
        getAddressFromPincode: builder.query<GoogleGeocodeResponse, string>({
            query: (pincode) => `/json?address=${encodeURIComponent(pincode)}&key=${GOOGLE_API_KEY}`,
        }),
    })
})


export const { useGetGeoLocationQuery, useGetUpdatedGeoLocationQuery, useLazyGetAddressFromPincodeQuery } = geoLocation;

/** Google Geocoding API response structure */
export interface GoogleGeocodeResponse {
    results?: Array<{
        address_components: Array<{
            long_name: string
            short_name: string
            types: string[]
        }>
        formatted_address?: string
    }>
    status: string
}