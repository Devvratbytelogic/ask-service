'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { LightningIconSVG, TipCheckedIconSVG } from '@/components/library/AllSVG'
import { Button } from '@heroui/react'

const TIPS = [
    "Soyez clair sur ce qui est inclus dans le prix",
    "Présentez votre expérience et vos qualifications",
    "Répondez aux exigences spécifiques mentionnées",
    "Proposez un prix compétitif tout en restant juste",
]
interface LeadSidebarProps {
    leadId?: string
    onSendQuoteClick?: () => void
    unlocked?: boolean
    canQuote?: boolean
}

export default function LeadSidebar({ leadId, onSendQuoteClick, unlocked, canQuote }: LeadSidebarProps) {
    const router = useRouter()

    const handleMessageCustomer = () => {
        const url = leadId ? `/vendor/message?leadId=${leadId}` : '/vendor/message'
        router.push(url)
    }
    return (
        <>
            <aside className="w-full lg:w-[320px] shrink-0 space-y-4">
                {/* Actions - only show when lead is not yet unlocked */}
                {unlocked && (
                    <div className="hidden lg:block rounded-2xl border border-borderDark bg-white p-5">
                        <h3 className="font-semibold text-fontBlack mb-4">Options</h3>
                        <div className="flex flex-col gap-3">
                            {canQuote && <Button
                                className="btn_radius btn_bg_blue w-full"
                                onPress={onSendQuoteClick}
                            >
                                Envoyer un devis
                            </Button>}
                            <Button className="btn_radius btn_bg_white w-full" onPress={handleMessageCustomer}>
                                Contacter le client
                            </Button>
                        </div>
                    </div>
                )}

                {/* Tips for Winning */}
                <div className="rounded-2xl bg-[#FFFBEB] border border-[#FEE685] p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="[&_path]:fill-[#E17100] [&_path]:stroke-[#E17100]">
                            <LightningIconSVG />
                        </span>
                        <h3 className="font-bold text-fontBlack">Conseils pour remporter la mission</h3>
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
