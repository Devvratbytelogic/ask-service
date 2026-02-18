'use client'
import React, { useState } from 'react'
import { Tabs, Tab } from '@heroui/react'
import VendorAbout from './VendorAbout'
import VendorReviews from './VendorReviews'
import VendorLinks from './VendorLinks'
import VendorServices from './VendorServices'

type TabId = 'about' | 'reviews' | 'links' | 'services';

export default function VendorProfileDetails() {
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
                    <Tab key="about" title="About">
                        <div className='space-y-6'>
                            <VendorAbout />
                            <VendorReviews />
                            <VendorLinks />
                            <VendorServices />
                        </div>
                    </Tab>
                    <Tab key="reviews" title="Reviews">
                        <VendorReviews />
                    </Tab>
                    <Tab key="links" title="Links">
                        <VendorLinks />
                    </Tab>
                    <Tab key="services" title="Services">
                        <VendorServices />
                    </Tab>
                </Tabs>
            </div>
        </>
    )
}
