'use client'
import React, { useState } from 'react'
import { Tabs, Tab } from '@heroui/react'
import VendorAbout from './VendorAbout'
import VendorReviews from './VendorReviews'
import VendorLinks from './VendorLinks'
import VendorServices from './VendorServices'
import { IVendorDetailsAPIResponseDataVendor, IVendorDetailsAPIResponseDataReview } from '@/types/vendorDetails'

type TabId = 'about' | 'reviews' | 'links' | 'services';

interface VendorProfileDetailsProps {
    profile?: IVendorDetailsAPIResponseDataVendor | null
    review?: IVendorDetailsAPIResponseDataReview | null
}

export default function VendorProfileDetails({ profile, review }: VendorProfileDetailsProps) {
    const [activeTab, setActiveTab] = useState<TabId>('about');

    return (
        <>
            <div className="rounded-2xl border border-borderDark p-6">
                <Tabs
                    selectedKey={activeTab}
                    onSelectionChange={(key) => setActiveTab(key as TabId)}
                    variant="light"
                    classNames={{
                        base: 'w-full',
                        tabList: 'mb-6 gap-0 p-1 rounded-full bg-[#F3F4F6] w-full flex w-full',
                        tab: 'rounded-full p-6 text-sm font-normal text-darkSilver data-[selected=true]:text-fontBlack',
                        cursor: 'rounded-full bg-white shadow-sm',
                        // panel: 'overflow-visible',
                    }}
                >
                    <Tab key="about" title="À propos">
                        <div className='space-y-6'>
                            <VendorAbout profile={profile} />
                            <VendorReviews review={review} vendorId={profile?._id} />
                            <VendorLinks profile={profile} />
                            <VendorServices profile={profile} />
                        </div>
                    </Tab>
                    <Tab key="reviews" title="Avis">
                        <VendorReviews vendorId={profile?._id} />
                    </Tab>
                    <Tab key="links" title="Liens">
                        <VendorLinks profile={profile} />
                    </Tab>
                    <Tab key="services" title="Services">
                        <VendorServices profile={profile} />
                    </Tab>
                </Tabs>
            </div>
        </>
    )
}
