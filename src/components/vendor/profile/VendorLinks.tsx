
import React from 'react'
import { GlobeIconSVG } from '@/components/library/AllSVG'

export default function VendorLinks() {

    return (
        <>
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-fontBlack">Links</h2>
                <div className='border border-[#EED] cursor-pointer bg-customWhite p-4 rounded-2xl text-primary'>
                    <GlobeIconSVG /> &nbsp; www.pagesjaunes.fr/pros/63482357
                </div>
            </div>
        </>
    )
}
