'use client'

import React from 'react'
import { GlobeIconSVG } from '@/components/library/AllSVG'
import { IVendorDetailsAPIResponseDataVendor } from '@/types/vendorDetails'

interface VendorLinksProps {
    profile?: IVendorDetailsAPIResponseDataVendor | null
}

export default function VendorLinks({ profile }: VendorLinksProps) {
    const websiteLink = profile?.website_link || 'www.pagesjaunes.fr/pros/63482357'
    const displayLink = websiteLink.startsWith('http') ? websiteLink : `https://${websiteLink}`

    return (
        <>
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-fontBlack">Links</h2>
                <a
                    href={displayLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='border border-[#EED] cursor-pointer bg-customWhite p-4 rounded-2xl text-primary block'
                >
                    <GlobeIconSVG /> &nbsp; {websiteLink}
                </a>
            </div>
        </>
    )
}
