'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { ArrowLeftIconSVG, ChevronRightIconSVG } from '@/components/library/AllSVG'
import { getVendorDashboardRoutePath, getVendorLeadsRoutePath } from '@/routes/routes'
import { DEFAULT_LEAD_ID, getLeadDetail, INITIAL_WALLET_BALANCE, SIDEBAR_LEADS } from './data'
import LeadSidebar from './LeadSidebar'
import LeadCard from './LeadCard'
import UnlockPanel from './UnlockPanel'

interface Props {
    leadId: string
}

export default function LeadDetailView({ leadId }: Props) {
    const validId = SIDEBAR_LEADS.some((l) => l.id === leadId) ? leadId : DEFAULT_LEAD_ID

    const [selectedId, setSelectedId] = useState(validId)
    const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set())
    const [walletBalance, setWalletBalance] = useState(INITIAL_WALLET_BALANCE)
    const [modalOpen, setModalOpen] = useState(false)

    const lead = getLeadDetail(selectedId)
    const isUnlocked = unlockedIds.has(selectedId)

    const handleConfirmUnlock = useCallback(() => {
        setUnlockedIds((prev) => {
            const next = new Set(prev)
            next.add(selectedId)
            return next
        })
        setWalletBalance((prev) => prev - lead.credits)
        setModalOpen(false)
    }, [selectedId, lead.credits])

    return (
        <div className="grid lg:grid-cols-[260px_1fr_320px] min-h-[calc(100vh-58px)]">
            {/* Sidebar — hidden on small screens */}
            <div className="hidden lg:block">
                <LeadSidebar
                    leads={SIDEBAR_LEADS}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                />
            </div>

            {/* Center — main content */}
            <main className="bg-[#0F1722] overflow-y-auto p-5">
                {/* Breadcrumb */}
                <div className="flex items-center gap-[7px] text-[12px] text-white/30 mb-[18px]">
                    <Link
                        href={getVendorDashboardRoutePath()}
                        className="text-white/30 hover:text-white/60 transition-colors flex items-center"
                    >
                        <ArrowLeftIconSVG size={13} />
                    </Link>
                    <Link
                        href={getVendorLeadsRoutePath()}
                        className="text-white/30 hover:text-white/60 transition-colors"
                    >
                        Prospects
                    </Link>
                    <span className="text-white/20 flex">
                        <ChevronRightIconSVG size={12} />
                    </span>
                    <span className="text-white/70 font-semibold">{lead.serviceLabel}</span>
                </div>

                <LeadCard lead={lead} isUnlocked={isUnlocked} onUnlock={() => setModalOpen(true)} />
            </main>

            {/* Right panel — hidden on small screens */}
            <div className="hidden lg:block">
                <UnlockPanel
                    lead={lead}
                    isUnlocked={isUnlocked}
                    walletBalance={walletBalance}
                    modalOpen={modalOpen}
                    onOpenModal={() => setModalOpen(true)}
                    onCloseModal={() => setModalOpen(false)}
                    onConfirmUnlock={handleConfirmUnlock}
                />
            </div>
        </div>
    )
}
