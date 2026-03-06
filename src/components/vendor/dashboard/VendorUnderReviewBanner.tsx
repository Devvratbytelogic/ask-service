'use client'

import { useGetVendorDashboardDataQuery } from '@/redux/rtkQueries/clientSideGetApis'

/** Shows the "documents under review" message only when key_status (or kyc_status) is not ACTIVE. */
export default function VendorUnderReviewBanner() {
    const { data } = useGetVendorDashboardDataQuery()
    const status = data?.data?.key_status ?? data?.data?.kyc_status
    const isActive = status?.toUpperCase() === 'ACTIVE'

    if (isActive) return null

    return (
        <div className='bg-[#FFFCF8] py-2 text-center text-fontBlack'>
            Your documents are currently under review for verification. You cannot purchase leads at this time.
        </div>
    )
}
