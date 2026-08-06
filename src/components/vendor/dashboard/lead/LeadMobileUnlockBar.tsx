'use client'

import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { useRouter } from 'nextjs-toploader/app'
import { FaCoins } from 'react-icons/fa6'
import { FiCheckCircle } from 'react-icons/fi'
import {
    ArrowSendIconSVG,
    ChatOutlineIconSVG,
    CheckmarkIconSVG,
    LockPrimaryColorSVG,
} from '@/components/library/AllSVG'
import { getCreditsRoutePath, getVendorMessageRoutePath } from '@/routes/routes'
import { openModal } from '@/redux/slices/allModalSlice'
import { useVendorAccessChatMutation } from '@/redux/rtkQueries/allPostApi'
import { useGetSingleLeadQuery, useGetVendorDashboardDataQuery } from '@/redux/rtkQueries/clientSideGetApis'

function resolveLeadStatus(status: string | null | undefined) {
    switch ((status ?? '').toLowerCase()) {
        case 'unlocked':
            return 'unlocked'
        case 'pending':
            return 'pending'
        case 'accepted':
            return 'accepted'
        case 'ignored':
            return 'ignored'
        case 'withdrawn':
            return 'withdrawn'
        default:
            return 'new'
    }
}

interface Props {
    leadId: string
    onSendQuoteClick?: () => void
}

export default function LeadMobileUnlockBar({ leadId, onSendQuoteClick }: Props) {
    const dispatch = useDispatch()
    const router = useRouter()
    const { data: leadResponse, isLoading } = useGetSingleLeadQuery({ id: leadId })
    const { data: dashboardData } = useGetVendorDashboardDataQuery()
    const [vendorAccessChat, { isLoading: isAccessingChat }] = useVendorAccessChatMutation()

    const lead = leadResponse?.data
    const leadStatus = resolveLeadStatus(lead?.lead_status)
    const isIgnored = leadStatus === 'ignored' || leadStatus === 'withdrawn'
    const isUnlocked = lead?.unlocked ?? false
    const canQuote = lead?.canQuote ?? false
    const hasQuote = Boolean(lead?.quote_id)
    const isQuoteSent = (hasQuote || leadStatus === 'pending') && !isIgnored
    const isAccepted = leadStatus === 'accepted'
    const canContactClient = (isQuoteSent || isAccepted) && Boolean(lead?.user?._id && lead?.quote_id)
    const credits = lead?.creditsToUnlock ?? 0
    const walletBalance = dashboardData?.data?.creditBalance ?? 0
    const canPurchaseLeads = dashboardData?.data?.canPurchaseLeads ?? false

    const handleUnlockClick = () => {
        dispatch(openModal({
            componentName: 'UnlockLeadConfirmModal',
            data: { leadId, creditsToUnlock: credits },
            modalSize: 'sm',
            modalPadding: 'p-0',
        }))
    }

    const handleContactClient = async () => {
        const clientUserId = lead?.user?._id
        const quoteId = lead?.quote_id
        if (!clientUserId || !quoteId) return

        try {
            const response = await vendorAccessChat({
                userId: clientUserId,
                quote_id: quoteId,
            }).unwrap()
            const chatId = response?.data?._id
            router.push(chatId ? `${getVendorMessageRoutePath()}?chatId=${chatId}` : getVendorMessageRoutePath())
        } catch (error) {
            console.error('error accessing chat', error)
        }
    }

    if (isLoading || !lead) {
        return (
            <div className="fixed bottom-0 inset-x-0 z-40 border-t border-appBorder bg-appSurface px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <div className="h-12 rounded-xl bg-appBorder/50 animate-pulse" />
            </div>
        )
    }

    return (
        <div className="fixed bottom-0 inset-x-0 z-40 border-t border-appBorder bg-appSurface">
            <div className="px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] space-y-2.5">
                {!isUnlocked && (
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <FaCoins className="size-3.5 shrink-0 text-amber" aria-hidden />
                            <div className="min-w-0">
                                <p className="text-[10px] text-appTextMuted leading-none mb-0.5">Votre solde</p>
                                <p className="text-[13px] font-bold text-amber truncate">{walletBalance} crédits</p>
                            </div>
                        </div>
                        <Link
                            href={getCreditsRoutePath()}
                            className="text-[11px] font-semibold text-primaryColor bg-blue-light dark:bg-primaryColor/15 px-2.5 py-1.5 rounded-lg shrink-0"
                        >
                            + Recharger
                        </Link>
                    </div>
                )}

                {!canPurchaseLeads && !isUnlocked && (
                    <p className="text-[11px] text-amber-700 dark:text-amber-300 text-center leading-snug">
                        Compte en cours de vérification — déblocage bientôt disponible.
                    </p>
                )}

                {isUnlocked ? (
                    isIgnored ? (
                        <div className="w-full py-3.5 bg-slate-500 text-white rounded-2xl text-[15px] font-bold text-center opacity-80">
                            Devis ignoré
                        </div>
                    ) : isQuoteSent || isAccepted ? (
                        <div className="flex gap-2">
                            <div className="flex-1 py-3.5 bg-trust-green text-white rounded-2xl text-[14px] font-bold text-center flex items-center justify-center gap-1.5">
                                <CheckmarkIconSVG size={14} />
                                {isAccepted ? 'Accepté' : 'Devis envoyé'}
                            </div>
                            {canContactClient && (
                                <button
                                    type="button"
                                    onClick={handleContactClient}
                                    disabled={isAccessingChat}
                                    className="flex-1 py-3.5 bg-appCard border border-appBorder text-appText rounded-2xl text-[14px] font-bold flex items-center justify-center gap-1.5 disabled:opacity-60"
                                >
                                    <ChatOutlineIconSVG size={14} />
                                    {isAccessingChat ? '…' : 'Contacter'}
                                </button>
                            )}
                        </div>
                    ) : canQuote ? (
                        <button
                            type="button"
                            onClick={onSendQuoteClick}
                            className="w-full py-3.75 bg-primaryColor text-white rounded-2xl text-[15px] font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                        >
                            <ArrowSendIconSVG size={15} />
                            Envoyer un devis
                        </button>
                    ) : (
                        <div className="w-full py-3.5 bg-trust-green text-white rounded-2xl text-[15px] font-bold text-center flex items-center justify-center gap-2">
                            <FiCheckCircle className="size-5" aria-hidden />
                            Prospect débloqué
                        </div>
                    )
                ) : (
                    <button
                        type="button"
                        onClick={handleUnlockClick}
                        disabled={!canPurchaseLeads}
                        className="w-full py-3.75 bg-primaryColor text-white rounded-2xl text-[15px] font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-55 disabled:cursor-not-allowed disabled:active:scale-100"
                    >
                        <LockPrimaryColorSVG className="w-3.75 h-3.75" />
                        Débloquer · {credits} crédits
                    </button>
                )}
            </div>
        </div>
    )
}
