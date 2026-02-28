'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { LightningIconSVG, TipCheckedIconSVG } from '@/components/library/AllSVG'
import { Button } from '@heroui/react'

const TIPS = [
    "Be clear about what's included in the price",
    "Mention your experience and qualifications",
    "Address specific requirements mentioned",
    "Keep pricing competitive but fair",
]
interface LeadSidebarProps {
    leadId?: string
    onSendQuoteClick?: () => void
    showSubmitQuoteForm?: boolean
}

export default function LeadSidebar({ leadId, onSendQuoteClick, showSubmitQuoteForm }: LeadSidebarProps) {
    const router = useRouter()

    const handleMessageCustomer = () => {
        const url = leadId ? `/vendor/message?leadId=${leadId}` : '/vendor/message'
        router.push(url)
    }
    return (
        <>
            <aside className="w-full lg:w-[320px] shrink-0 space-y-4">
                {/* Actions - for larger screens */}
                <div className="hidden lg:block rounded-2xl border border-borderDark bg-white p-5">
                    <h3 className="font-semibold text-fontBlack mb-4">Actions</h3>
                    <div className="flex flex-col gap-3">
                        {!showSubmitQuoteForm && <Button
                            className="btn_radius btn_bg_blue w-full"
                            onPress={onSendQuoteClick}
                        >
                            Send Quote
                        </Button>}
                        <Button className="btn_radius btn_bg_white w-full" onPress={handleMessageCustomer}>
                            Message Customer
                        </Button>
                    </div>
                </div>

                {/* Tips for Winning */}
                <div className="rounded-2xl bg-[#FFFBEB] border border-[#FEE685] p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="[&_path]:fill-[#E17100] [&_path]:stroke-[#E17100]">
                            <LightningIconSVG />
                        </span>
                        <h3 className="font-bold text-fontBlack">Tips for Winning</h3>
                    </div>
                    <ul className="space-y-3">
                        {TIPS.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <TipCheckedIconSVG />
                                <span className="text-sm text-fontBlack">{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        </>
    )
}
