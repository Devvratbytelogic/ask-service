'use client'

import React from 'react'
import VendorProfileSidebar from '@/components/vendor/profile/VendorProfileSidebar'
import VendorProfileDetails from '@/components/vendor/profile/VendorProfileDetails'
import { useGetVendorDetailsByIdQuery } from '@/redux/rtkQueries/clientSideGetApis'
import { useSearchParams } from 'next/navigation'
export default function VendorProfilePage() {
    const searchParams = useSearchParams()
    const vendorId = searchParams.get('vendorId')
    const { data, isLoading, isError, error } = useGetVendorDetailsByIdQuery({ vendorId: vendorId as string || '' })
    const profile = data?.data

    if (isLoading) {
        return (
            <div className="min-h-screen body_x_axis_padding flex items-center justify-center">
                <div className="animate-pulse text-darkSilver">Loading profile...</div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="min-h-screen body_x_axis_padding flex items-center justify-center">
                <p className="text-red-500">
                    {error && 'status' in error && typeof (error as { status: number }).status === 'number'
                        ? 'Failed to load profile.'
                        : 'Something went wrong.'}
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="min-h-screen body_x_axis_padding">
                <div className="flex flex-col lg:flex-row gap-6">
                    <aside className="w-full lg:w-[320px] shrink-0 self-start sticky top-24 z-40">
                        <VendorProfileSidebar profile={profile?.vendor} review={profile?.review} />
                    </aside>
                    <section className="relative flex-1 min-w-0">
                        <VendorProfileDetails profile={profile?.vendor} review={profile?.review} />
                    </section>
                </div>
            </div>
        </>
    )
}
