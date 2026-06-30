'use client'

import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { Spinner } from '@heroui/react'
import { CheckmarkIconSVG, ClockCircleIconSVG, LockPrimaryColorSVG, } from '@/components/library/AllSVG'
import { getVendorWalletRoutePath } from '@/routes/routes'
import { openModal } from '@/redux/slices/allModalSlice'
import { useGetSingleLeadQuery, useGetVendorDashboardDataQuery } from '@/redux/rtkQueries/clientSideGetApis'

function VerifiedListItem({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-[7px] text-[12px] text-appTextSec">
            <div className="w-[17px] h-[17px] rounded-full bg-trust-green/15 flex items-center justify-center shrink-0">
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
}

export default function UnlockPanel({ leadId }: Props) {
    const dispatch = useDispatch()
    const { data: leadResponse, isLoading } = useGetSingleLeadQuery({ id: leadId })
    const { data: dashboardData } = useGetVendorDashboardDataQuery()

    const lead = leadResponse?.data
    const isUnlocked = lead?.unlocked ?? false
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

    if (isLoading || !lead) {
        return (
            <aside className="bg-appBg border-l border-appBorder p-[18px_14px] sticky top-[58px] h-[calc(100vh-58px)] flex items-center justify-center">
                <Spinner size="lg" color="primary" />
            </aside>
        )
    }

    return (
        <aside className="bg-appBg border-l border-appBorder p-[18px_14px] sticky top-[58px] h-[calc(100vh-58px)] overflow-y-auto space-y-3">
            <div className="bg-appCard border border-appBorder rounded-2xl overflow-hidden">
                <div className="px-[18px] py-3.5 bg-linear-to-r from-primaryColor/15 to-amber/8 border-b border-appBorderSub flex items-center justify-between">
                    <div className="flex items-center gap-[7px] text-[13px] font-bold text-appText">
                        <span className="text-appTextSec flex">
                            <LockPrimaryColorSVG className="w-[14px] h-[14px]" />
                        </span>
                        Déblocage sécurisé
                    </div>
                </div>

                <div className="p-4 flex flex-col gap-3.5">
                    <div className="text-center py-2">
                        {isUnlocked ? (
                            <div className="text-2xl font-extrabold text-trust-green tracking-[-1px] leading-none flex items-center justify-center gap-2">
                                ✅ Prospect débloqué !
                            </div>
                        ) : (
                            <>
                                <div className="text-[40px] font-extrabold text-appText tracking-[-1.5px] leading-none flex items-center justify-center gap-1.5">
                                    <span className="text-[28px]">🪙</span>
                                    {credits}
                                </div>
                                <div className="text-[12px] text-appTextMuted mt-1">
                                    crédits à déduire de votre wallet
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-3 px-3 py-2.5 bg-black/3 dark:bg-white/4 border border-appBorder rounded-[10px]">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <span className="shrink-0 text-[14px]">🪙</span>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[11px] text-appTextSec">Votre solde</span>
                                <span className="text-[13px] font-bold text-amber whitespace-nowrap">{walletBalance} crédits</span>
                            </div>
                        </div>
                        <Link
                            href={getVendorWalletRoutePath()}
                            className="text-[12px] font-semibold text-primaryColor bg-blue-light dark:bg-primaryColor/15 px-2.5 py-1.5 rounded-[8px] transition-all duration-200 hover:bg-primaryColor hover:text-white shrink-0 whitespace-nowrap"
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

                    {
                        <div className="px-3 py-2.5 bg-linear-to-r from-orange-500/15 to-amber/10 border border-orange-500/30 rounded-[10px] flex items-center gap-2">
                        <span className="text-[18px] shrink-0">⚡</span>
                        <p className="text-[12px] font-semibold text-[#FDBA74] leading-[1.4]">
                            {lead?.lead_status_message ?? '—'}
                        </p>
                    </div>
                    }

                    {isUnlocked ? (
                        <div className="w-full py-[15px] bg-linear-to-br from-trust-green to-[#059669] text-white rounded-[12px] text-[15px] font-bold text-center shadow-[0_4px_20px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2">
                            <CheckmarkIconSVG size={15} />
                            Prospect débloqué !
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={handleUnlockClick}
                            disabled={!canPurchaseLeads}
                            className="w-full py-[15px] bg-linear-to-br from-primaryColor to-[#4F46E5] text-white rounded-[12px] text-[15px] font-bold cursor-pointer transition-all duration-250 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(27,79,255,0.4),0_1px_0_rgba(255,255,255,0.1)_inset] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(27,79,255,0.5)] hover:brightness-105 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            <span className="flex">
                                <LockPrimaryColorSVG className="w-[15px] h-[15px]" />
                            </span>
                            Débloquer ce prospect
                        </button>
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
