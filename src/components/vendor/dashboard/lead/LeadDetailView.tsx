'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import moment from 'moment'
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
import LeadMobileHeader from './LeadMobileHeader'
import LeadMobileUnlockBar from './LeadMobileUnlockBar'

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
    const isNewToday = Boolean(data?.createdAt && moment(data.createdAt).isSame(moment(), 'day'))

    useEffect(() => {
        if (showSubmitQuoteForm && submitQuoteFormRef.current) {
            submitQuoteFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [showSubmitQuoteForm])

    useEffect(() => {
        setShowSubmitQuoteForm(false)
    }, [leadId])

    const handleUnlock = () => {
        dispatch(openModal({
            componentName: 'UnlockLeadConfirmModal',
            data: { leadId, creditsToUnlock },
            modalSize: 'sm',
            modalPadding: 'p-0',
        }))
    }

    if (isLoading) {
        return (
            <div className="grid lg:grid-cols-[260px_1fr_320px] min-h-[calc(100vh-58px)]">
                <div className="hidden lg:block">
                    <LeadSidebarSkeleton />
                </div>
                <LeadDetailViewSkeleton />
            </div>
        )
    }
    if (!data) {
        return (
            <div className="grid lg:grid-cols-[260px_1fr_320px] min-h-[calc(100vh-58px)]">
                <div className="hidden lg:block">
                    <LeadSidebar selectedId={leadId} />
                </div>
                <LeadNotFound />
            </div>
        )
    }

    return (
        <div className="grid lg:grid-cols-[260px_1fr_320px] min-h-[calc(100vh-58px)]">
            <div className="hidden lg:block">
                <LeadSidebar selectedId={leadId} />
            </div>

            <div className="flex flex-col min-h-[calc(100vh-68px)] bg-appBg lg:contents">
                <LeadMobileHeader
                    title={data?.service_category?.title ?? '—'}
                    credits={data?.creditsToUnlock}
                    stars={data?.lead_stars}
                    starsLabel={data?.lead_stars_label}
                    isNewToday={isNewToday}
                />

                <section className="flex-1 overflow-y-auto px-3.5 pt-3.5 pb-36 lg:px-5 lg:pt-5 lg:pb-5 lg:flex-none">
                    <div className="hidden lg:flex items-center gap-1.75 text-[12px] text-appTextMuted mb-4.5">
                        <Link
                            href={getVendorDashboardRoutePath()}
                            className="text-appTextMuted hover:text-appTextSec transition-colors items-center flex"
                        >
                            <ArrowLeftIconSVG size={13} /> Prospects
                        </Link>

                        <span className="text-appTextMuted flex">
                            <ChevronRightIconSVG size={12} />
                        </span>
                        <span className="text-appTextSec font-semibold">
                            {data?.parent_service_category?.title ?? '—'}
                        </span>
                    </div>

                    <LeadCard
                        lead={data}
                        isUnlocked={isUnlocked}
                        onUnlock={handleUnlock}
                    />

                    {showSubmitQuoteForm && (
                        <div ref={submitQuoteFormRef} className="mt-3.5 lg:mt-0">
                            <SubmitQuoteForm
                                leadId={leadId}
                                onCancel={() => setShowSubmitQuoteForm(false)}
                            />
                        </div>
                    )}
                </section>

                <div className="lg:hidden">
                    <LeadMobileUnlockBar
                        leadId={leadId}
                        onSendQuoteClick={() => setShowSubmitQuoteForm(true)}
                    />
                </div>
            </div>

            <div className="hidden lg:block">
                <UnlockPanel
                    leadId={leadId}
                    onSendQuoteClick={() => setShowSubmitQuoteForm(true)}
                />
            </div>
        </div>
    )
}
