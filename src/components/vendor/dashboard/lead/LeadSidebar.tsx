'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { LightningIconSVG, TipCheckedIconSVG } from '@/components/library/AllSVG'
import { Button } from '@heroui/react'
import { useVendorAccessChatMutation } from '@/redux/rtkQueries/allPostApi'

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
    userId?: string | null
    quoteId?: string | null
}

export default function LeadSidebar({ leadId, onSendQuoteClick, unlocked, canQuote, userId, quoteId }: LeadSidebarProps) {
    const router = useRouter()
    const [vendorAccessChat, { isLoading: isAccessingChat }] = useVendorAccessChatMutation()

    const handleMessageCustomer = async () => {
        if (leadId) {
            try {
                const response = await vendorAccessChat({ userId: userId, quote_id: quoteId }).unwrap()
                const chatId = response?.data?._id ?? response?._id
                const url = chatId
                    ? `/vendor/message?chatId=${chatId}`
                    : `/vendor/message?leadId=${leadId}`
                router.push(url)
            } catch {
                // Error handled by RTK Query / can add toast here
            }
        } else {
            router.push('/vendor/message')
        }
    }
    return (
        <>
            <aside className="w-full lg:w-[320px] shrink-0 space-y-4">
                {/* Actions - only show when lead is not yet unlocked */}
                {unlocked && (
                    <div className="block rounded-2xl border border-borderDark bg-white p-5">
                        <h3 className="font-semibold text-fontBlack mb-4">Options</h3>
                        <div className="flex flex-col gap-3">
                            {canQuote && <Button
                                className="btn_radius btn_bg_blue w-full"
                                onPress={onSendQuoteClick}
                            >
                                Envoyer un devis
                            </Button>}
                            <Button
                                className="btn_radius btn_bg_white w-full"
                                onPress={handleMessageCustomer}
                                isLoading={isAccessingChat}
                                isDisabled={isAccessingChat}
                            >
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
