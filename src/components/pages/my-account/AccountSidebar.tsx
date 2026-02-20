'use client'
import React from 'react'
import { useDispatch } from 'react-redux'
import { openModal } from '@/redux/slices/allModalSlice'
import { FlagIconSVG, LocationSVG, ShieldSecurityIconSVG, StarRatingIconSVG, VerifiedGreenShieldIconSVG } from '@/components/library/AllSVG'
import { Button } from '@heroui/react'

export default function AccountSidebar() {
    const dispatch = useDispatch()
    return (
        <>
            <div className="rounded-2xl border border-borderDark p-6">
                {/* Logo */}
                <div className="mb-4 flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#FB2C36] p-3 m-auto">
                    <ShieldSecurityIconSVG className="size-full" />
                </div>

                {/* Company Name + Verified */}
                <div className="mb-2 text-center">
                    <h1 className="text-xl font-bold text-fontBlack">
                        Securatim Security Services  <span><VerifiedGreenShieldIconSVG /></span>
                    </h1>
                </div>

                {/* Location */}
                <div className="mb-3 gap-1.5 text-fontBlack text-center">
                    <p className="text-sm">
                        <span><LocationSVG /></span> 9-11 Avenue Michelet, Saint-Ouen-sur-Seine
                    </p>
                </div>

                {/* Rating */}
                <div className="mb-4 flex items-center justify-center gap-1.5">
                    <StarRatingIconSVG />
                    <span className="text-sm font-bold text-fontBlack">4.9</span>
                    <span className="text-sm text-darkSilver">(127 reviews)</span>
                </div>

                {/* Services */}
                <div className="mb-4 w-full border-t border-borderDark pt-4 text-left">
                    <h2 className="mb-2 text-sm font-bold text-fontBlack">Services</h2>
                    <div className="flex flex-wrap gap-2">
                        <Button className='btn_radius btn_bg_white'>
                            Security services
                        </Button>
                    </div>
                </div>

                {/* Report */}
                <div className='border-t border-borderDark'>
                    <button
                        type="button"
                        onClick={() =>
                            dispatch(
                                openModal({
                                    componentName: 'ReportProfileModal',
                                    modalSize: 'lg',
                                    modalPadding: 'px-6 py-6',
                                })
                            )
                        }
                        className="mt-6 w-full cursor-pointer flex items-center justify-center gap-2 text-sm text-[#6A7282] hover:text-fontBlack transition-colors"
                    >
                        <FlagIconSVG />
                        <span>Report this profile</span>
                    </button>
                </div>
            </div>
        </>
    )
}
