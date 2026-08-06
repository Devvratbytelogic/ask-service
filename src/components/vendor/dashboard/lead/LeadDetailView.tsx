'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ArrowLeftIconSVG, ChevronRightIconSVG } from '@/components/library/AllSVG'
import { getVendorDashboardRoutePath } from '@/routes/routes'
import { openModal } from '@/redux/slices/allModalSlice'
import { useGetSingleLeadQuery } from '@/redux/rtkQueries/clientSideGetApis'
import LeadSidebar from './LeadSidebar'
import LeadSidebarSkeleton from './LeadSidebarSkeleton'
import LeadCard from './LeadCard'
import UnlockPanel from './UnlockPanel'
import LeadDetailViewSkeleton from './LeadDetailViewSkeleton'
import LeadNotFound from './LeadNotFound'
import SubmitQuoteForm from './SubmitQuoteForm'

interface Props {
    leadId: string
}

export default function LeadDetailView({ leadId }: Props) {
    const dispatch = useDispatch()
    const [showSubmitQuoteForm, setShowSubmitQuoteForm] = useState(false)
    const submitQuoteFormRef = useRef<HTMLDivElement>(null)

    const { data: leadResponse, isLoading } = useGetSingleLeadQuery({ id: leadId })
    const data = leadResponse?.data
    const isUnlocked = data?.unlocked ?? false
    const creditsToUnlock = data?.creditsToUnlock ?? 0

    useEffect(() => {
        if (showSubmitQuoteForm && submitQuoteFormRef.current) {
            submitQuoteFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [showSubmitQuoteForm])

    useEffect(() => {
        setShowSubmitQuoteForm(false)
    }, [leadId])

    if (isLoading) {
        return (
            <div className="grid lg:grid-cols-[260px_1fr_320px] min-h-[calc(100vh-58px)]">
                <LeadSidebarSkeleton />
                <LeadDetailViewSkeleton />
            </div>
        )
    }
    if (!data) {
        return (
            <div className="grid lg:grid-cols-[260px_1fr_320px] min-h-[calc(100vh-58px)]">
                <LeadSidebar selectedId={leadId} />
                <LeadNotFound />
            </div>
        )
    }

    return (
        <div className="grid lg:grid-cols-[260px_1fr_320px] min-h-[calc(100vh-58px)]">
            <LeadSidebar selectedId={leadId} />

            <section className="bg-appBg overflow-y-auto p-5">
                <div className="flex items-center gap-1.75 text-[12px] text-appTextMuted mb-4.5">
                    <Link
                        href={getVendorDashboardRoutePath()}
                        className="text-appTextMuted hover:text-appTextSec transition-colors flex items-center"
                    >
                        <ArrowLeftIconSVG size={13} />
                    </Link>
                    <Link
                        href={getVendorDashboardRoutePath()}
                        className="text-appTextMuted hover:text-appTextSec transition-colors"
                    >
                        Prospects
                    </Link>
                    <span className="text-appTextMuted flex">
                        <ChevronRightIconSVG size={12} />
                    </span>
                    <span className="text-appTextSec font-semibold">{data?.parent_service_category?.title ?? '—'}</span>
                </div>

                <LeadCard
                    lead={data}
                    isUnlocked={isUnlocked}
                    onUnlock={() => dispatch(openModal({
                        componentName: 'UnlockLeadConfirmModal',
                        data: { leadId, creditsToUnlock },
                        modalSize: 'sm',
                        modalPadding: 'p-0',
                    }))}
                />

                {showSubmitQuoteForm && (
                    <div ref={submitQuoteFormRef}>
                        <SubmitQuoteForm
                            leadId={leadId}
                            onCancel={() => setShowSubmitQuoteForm(false)}
                        />
                    </div>
                )}
            </section>

            <div className="block">
                <UnlockPanel
                    leadId={leadId}
                    onSendQuoteClick={() => setShowSubmitQuoteForm(true)}
                />
            </div>
        </div>
    )
}
