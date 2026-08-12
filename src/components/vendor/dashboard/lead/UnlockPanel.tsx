'use client'

import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { useRouter } from 'nextjs-toploader/app'
import { Spinner } from '@heroui/react'
import { FaCoins } from 'react-icons/fa6'
import { FiCheckCircle, FiZap } from 'react-icons/fi'
import { ArrowSendIconSVG, CheckmarkIconSVG, ChatOutlineIconSVG, ClockCircleIconSVG, LockOpenGreenIconSVG, LockPrimaryColorSVG, } from '@/components/library/AllSVG'
import { getCreditsRoutePath, getVendorAccountRoutePath, getVendorMessageRoutePath } from '@/routes/routes'
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

function VerifiedListItem({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-1.75 text-[12px] text-appTextSec">
            <div className="w-4.25 h-4.25 rounded-full bg-trust-green/15 flex items-center justify-center shrink-0">
                <span className="text-trust-green flex">
                    <CheckmarkIconSVG size={9} />
                </span>
            </div>
            {children}
        </div>
    )
}

interface Props {
    leadId: string
    onSendQuoteClick?: () => void
}

export default function UnlockPanel({ leadId, onSendQuoteClick }: Props) {
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
    const statusMessage = lead?.lead_status_message?.trim()
    const credits = lead?.creditsToUnlock ?? 0
    const walletBalance = dashboardData?.data?.creditBalance ?? 0
    const canPurchaseLeads = dashboardData?.data?.canPurchaseLeads ?? false
    const isDocumentVerified = lead?.document_verified ?? false
    const canUnlock = canPurchaseLeads && isDocumentVerified

    const handleUnlockClick = () => {
        if (!canUnlock) return
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
            <aside className="bg-appBg border-l border-appBorder p-[18px_14px] sticky top-14.5 h-[calc(100vh-58px)] flex items-center justify-center max-lg:static max-lg:h-auto max-lg:border-t">
                <Spinner size="lg" color="primary" />
            </aside>
        )
    }

    return (
        <aside className="bg-appBg border-l border-appBorder p-[18px_14px] sticky top-14.5 h-[calc(100vh-58px)] overflow-y-auto space-y-3 max-lg:static max-lg:h-auto max-lg:overflow-visible max-lg:border-t">
            <div className="bg-appCard border border-appBorder rounded-2xl overflow-hidden">
                <div className="px-4.5 py-3.5 bg-linear-to-r from-primaryColor/15 to-amber/8 border-b border-appBorderSub flex items-center justify-between">
                    <div className="flex items-center gap-1.75 text-[13px] font-bold text-appText">
                        {isUnlocked ? (
                            <>
                                <span className="text-trust-green flex shrink-0">
                                    <LockOpenGreenIconSVG className="w-3.5 h-3.5" />
                                </span>
                                {isIgnored
                                    ? 'Devis ignoré'
                                    : isAccepted
                                        ? 'Devis accepté'
                                        : isQuoteSent
                                            ? 'Devis envoyé'
                                            : 'Prospect débloqué'}
                            </>
                        ) : (
                            <>
                                <span className="text-appTextSec flex shrink-0">
                                    <LockPrimaryColorSVG className="w-3.5 h-3.5" />
                                </span>
                                Déblocage sécurisé
                            </>
                        )}
                    </div>
                </div>

                <div className="p-4 flex flex-col gap-3.5">
                    <div className="text-center py-2">
                        {isUnlocked ? (
                            isIgnored ? (
                                <div className="text-2xl font-extrabold text-appTextSec tracking-[-1px] leading-none flex items-center justify-center gap-2">
                                    Devis ignoré
                                </div>
                            ) : isQuoteSent || isAccepted ? (
                                <div className="text-2xl font-extrabold text-trust-green tracking-[-1px] leading-none flex items-center justify-center gap-2">
                                    <FiCheckCircle className="size-6 shrink-0" aria-hidden />
                                    Devis envoyé
                                </div>
                            ) : (
                                <div className="text-2xl font-extrabold text-trust-green tracking-[-1px] leading-none flex items-center justify-center gap-2">
                                    <FiCheckCircle className="size-6 shrink-0" aria-hidden />
                                    Prospect débloqué !
                                </div>
                            )
                        ) : (
                            <>
                                <div className="text-[40px] font-extrabold text-appText tracking-[-1.5px] leading-none flex items-center justify-center gap-1.5">
                                    <FaCoins className="size-7 shrink-0 text-amber" aria-hidden />
                                    {credits}
                                </div>
                                <div className="text-[12px] text-appTextMuted mt-1">
                                    Points à déduire de votre wallet
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-3 px-3 py-2.5 bg-black/3 dark:bg-white/4 border border-appBorder rounded-[10px]">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <FaCoins className="size-3.5 shrink-0 text-amber" aria-hidden />
                            <div className="flex flex-col min-w-0">
                                <span className="text-[11px] text-appTextSec">Votre solde</span>
                                <span className="text-[13px] font-bold text-amber whitespace-nowrap">{walletBalance} Points</span>
                            </div>
                        </div>
                        <Link
                            href={getCreditsRoutePath()}
                            className="text-[12px] font-semibold text-primaryColor bg-blue-light dark:bg-primaryColor/15 px-2.5 py-1.5 rounded-lg transition-all duration-200 hover:bg-primaryColor hover:text-white shrink-0 whitespace-nowrap"
                        >
                            + Recharger
                        </Link>
                    </div>

                    {!isUnlocked && (
                        <div className="flex flex-col gap-1.5">
                            <VerifiedListItem>Email client vérifié</VerifiedListItem>
                            <VerifiedListItem>Numéro de téléphone actif</VerifiedListItem>
                            <VerifiedListItem>Coordonnées complètes débloquées</VerifiedListItem>
                        </div>
                    )}

                    {statusMessage && !isQuoteSent && !isAccepted && (
                        <div className="px-3 py-2.5 bg-linear-to-r from-orange-500/15 to-amber/10 border border-orange-500/30 rounded-[10px] flex items-center gap-2">
                            <FiZap className="size-4.5 shrink-0 text-orange-500" aria-hidden />
                            <p className="text-[12px] font-semibold text-[#FDBA74] leading-[1.4]">
                                {statusMessage}
                            </p>
                        </div>
                    )}

                    {isUnlocked ? (
                        isIgnored ? (
                            <div className="w-full py-3.75 bg-linear-to-br from-slate-500 to-[#475569] text-white rounded-xl text-[15px] font-bold text-center shadow-[0_4px_20px_rgba(100,116,139,0.25)] flex items-center justify-center gap-2 opacity-80 cursor-not-allowed">
                                Devis ignoré
                            </div>
                        ) : isQuoteSent || isAccepted ? (
                            <div className="flex flex-col gap-3">
                                <div className="w-full py-3.75 bg-linear-to-br from-trust-green to-[#059669] text-white rounded-xl text-[15px] font-bold text-center shadow-[0_4px_20px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2">
                                    <CheckmarkIconSVG size={15} />
                                    {isAccepted ? 'Devis accepté' : 'Devis envoyé'}
                                </div>

                                <div className="px-3 py-3 bg-trust-green/8 border border-trust-green/20 rounded-[10px]">
                                    <p className="text-[12px] text-appTextSec leading-[1.55] text-center">
                                        {statusMessage || (isAccepted
                                            ? 'Le client a accepté votre devis. Contactez-le pour organiser la prestation.'
                                            : 'Votre devis a été transmis au client. Contactez-le pour faire suite à sa demande.')}
                                    </p>
                                </div>

                                {canContactClient && (
                                    <button
                                        type="button"
                                        onClick={handleContactClient}
                                        disabled={isAccessingChat}
                                        className="w-full py-3.25 bg-appCard border border-appBorder text-appText rounded-xl text-[14px] font-bold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 hover:bg-black/3 dark:hover:bg-appCard/4 hover:border-primaryColor/30 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        <ChatOutlineIconSVG size={15} />
                                        {isAccessingChat ? 'Ouverture…' : 'Contacter le client'}
                                    </button>
                                )}
                            </div>
                        ) : canQuote ? (
                            <button
                                type="button"
                                onClick={onSendQuoteClick}
                                className="w-full py-3.75 bg-linear-to-br from-primaryColor to-[#4F46E5] text-white rounded-xl text-[15px] font-bold cursor-pointer transition-all duration-250 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(27,79,255,0.4),0_1px_0_rgba(255,255,255,0.1)_inset] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(27,79,255,0.5)] hover:brightness-105 active:translate-y-0"
                            >
                                <ArrowSendIconSVG size={15} />
                                Envoyer un devis
                            </button>
                        ) : (
                            <div className="w-full py-3.75 bg-linear-to-br from-trust-green to-[#059669] text-white rounded-xl text-[15px] font-bold text-center shadow-[0_4px_20px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2">
                                <CheckmarkIconSVG size={15} />
                                Prospect débloqué !
                            </div>
                        )
                    ) : (
                        <div className="flex flex-col gap-2.5">
                            <button
                                type="button"
                                onClick={handleUnlockClick}
                                disabled={!canUnlock}
                                className="w-full py-3.75 bg-linear-to-br from-primaryColor to-[#4F46E5] text-white rounded-xl text-[15px] font-bold cursor-pointer transition-all duration-250 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(27,79,255,0.4),0_1px_0_rgba(255,255,255,0.1)_inset] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(27,79,255,0.5)] hover:brightness-105 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                <span className="flex">
                                    <LockPrimaryColorSVG className="w-3.75 h-3.75" />
                                </span>
                                Débloquer ce prospect
                            </button>
                            {!canUnlock && (
                                <div className="px-3 py-2.5 bg-amber-500/10 border border-amber-500/30 rounded-[10px] space-y-1.5">
                                    <p className="text-[12px] font-medium text-amber-700 dark:text-amber-300 leading-[1.45] text-center">
                                        Vos documents doivent être vérifiés avant de pouvoir débloquer ce prospect.
                                    </p>
                                    <Link
                                        href={getVendorAccountRoutePath('documents')}
                                        className="block text-[12px] font-semibold text-amber-700 hover:text-amber-600 dark:text-amber-300 dark:hover:text-amber-200 text-center transition-colors"
                                    >
                                        Voir mes documents →
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {!isUnlocked && (
                        <div className="flex items-center justify-center gap-1 text-[11px] text-appTextMuted">
                            <ClockCircleIconSVG size={11} />
                            Prospect limité dans le temps
                        </div>
                    )}
                </div>
            </div>

        </aside>
    )
}
