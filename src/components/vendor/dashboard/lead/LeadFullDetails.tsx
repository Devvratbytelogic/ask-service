'use client'

import { useState, useMemo } from 'react'
import { LocationSVG } from '@/components/library/AllSVG'
import LeadHeader from './LeadHeader'
import LeadSidebar from './LeadSidebar'
import SubmitQuoteForm from './SubmitQuoteForm'
import { useGetSingleLeadQuery } from '@/redux/rtkQueries/clientSideGetApis'
import type { ISingleLead } from '@/types/singleLead'

export interface LeadFullDetailsData {
    title?: string
    id?: string
    postedAt?: string
    creditsToUnlock?: number
    unlocked?: boolean
}

interface LeadFullDetailsProps {
    id: string
}

function formatLocation(lead: ISingleLead | undefined): string {
    if (!lead) return ''
    const parts = [lead.address_1, lead.address_2, lead.city, lead.state, lead.country, lead.pincode].filter(Boolean)
    return parts.join(', ')
}

export default function LeadFullDetails({ id }: LeadFullDetailsProps) {
    const { data: leadData, isLoading: leadLoading } = useGetSingleLeadQuery({ id })
    const lead = leadData?.data
    const [showSubmitQuoteForm, setShowSubmitQuoteForm] = useState(false)

    const headerData = useMemo((): LeadFullDetailsData | null => {
        if (!lead) return null
        return {
            title: lead.service_category?.title || lead.child_category,
            id: lead.reference_no,
            postedAt: lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : undefined,
            creditsToUnlock: (lead as ISingleLead & { creditsToUnlock?: number }).creditsToUnlock ?? 0,
            unlocked: lead.unlocked,
        }
    }, [lead])

    const displayData = useMemo(() => {
        if (!lead) return null
        const contact = lead.contact_details
        const clientName = [contact?.first_name, contact?.last_name].filter(Boolean).join(' ') || [lead.user?.first_name, lead.user?.last_name].filter(Boolean).join(' ')
        const clientInitials = clientName ? clientName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'N/A'
        return {
            clientInitials,
            clientName: clientName || 'N/A',
            businessType: lead.service_category?.title || lead.child_category || 'N/A',
            memberSince: lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A',
            phoneMasked: contact?.phone || lead.user?.phone || 'N/A',
            emailMasked: contact?.email || lead.user?.email || 'N/A',
            location: formatLocation(lead),
            serviceType: lead.service_category?.title || lead.child_category || 'N/A',
            frequency: lead.frequency || 'N/A',
            clientType: lead.contact_details?.client_type || 'N/A',
            preferredStartDate: lead.preferred_start_date || 'N/A',
            preferredTime: lead.preferred_time_of_day || 'N/A',
            tasks: lead.selected_options ?? [],
        }
    }, [lead])

    if (leadLoading || !displayData) {
        return (
            <div className="flex items-center justify-center min-h-50">
                <p className="text-darkSilver">{leadLoading ? 'Loading lead details...' : 'No lead data found.'}</p>
            </div>
        )
    }

    return (
        <>
            {/* Header */}
            <LeadHeader data={headerData ?? {}} />
            <div className="flex flex-col lg:flex-row gap-6 mt-6">
                {/* Main Content */}
                <div className="flex-1 min-w-0 space-y-4">
                    {/* Client Information Card */}
                    <div className="rounded-2xl border border-borderDark bg-white p-5">
                        <div className="flex items-start gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primaryColor text-base font-bold text-white">
                                {displayData.clientInitials}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="font-bold text-fontBlack">
                                        {displayData.clientName}
                                    </h3>
                                    <span className="inline-flex rounded-full bg-[#E8F4FD] px-2.5 py-0.5 text-xs font-medium text-primaryColor">
                                        {displayData.businessType}
                                    </span>
                                </div>
                                <p className="text-sm text-darkSilver mt-0.5">
                                    Member since {displayData.memberSince}
                                </p>
                                <div className="border-t border-borderDark space-y-1 mt-4 pt-4">
                                    <div className='flex items-center justify-between gap-2'>
                                        <p className='text-sm text-darkSilver'>Phone</p>
                                        <p className='text-sm text-fontBlack'>{displayData.phoneMasked}</p>
                                    </div>
                                    <div className='flex items-center justify-between gap-2'>
                                        <p className='text-sm text-darkSilver'>Email</p>
                                        <p className='text-sm text-fontBlack'>{displayData.emailMasked}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Service Location Card */}
                    <div className="rounded-2xl border border-borderDark bg-white p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                <LocationSVG className='text-primary' />
                            </span>
                            <h3 className="font-bold text-fontBlack">Service Location</h3>
                        </div>
                        <p className="text-fontBlack">
                            {displayData.location}
                        </p>
                    </div>

                    {/* Service Requirements Card */}
                    <div className="rounded-2xl border border-borderDark bg-white p-5">
                        <h3 className="font-bold text-fontBlack mb-4">Service Requirements</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl border border-borderDark px-4 py-3">
                                <p className="text-xs text-darkSilver mb-1">Service Type</p>
                                <p className="text-sm font-medium text-fontBlack">
                                    {displayData.serviceType}
                                </p>
                            </div>
                            <div className="rounded-xl border border-borderDark px-4 py-3">
                                <p className="text-xs text-darkSilver mb-1">Frequency</p>
                                <p className="text-sm font-medium text-fontBlack">
                                    {displayData.frequency}
                                </p>
                            </div>
                            <div className="rounded-xl border border-borderDark px-4 py-3 sm:col-span-2">
                                <p className="text-xs text-darkSilver mb-1">Client Type</p>
                                <p className="text-sm font-medium text-fontBlack">
                                    {displayData.clientType}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Requested Tasks Card */}
                    <div className="rounded-2xl border border-borderDark bg-white p-5">
                        <h3 className="font-bold text-fontBlack mb-4">Requested Tasks</h3>
                        <div className="flex flex-wrap gap-2">
                            {displayData.tasks.map((task: string, i: number) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center rounded-full border border-primaryColor bg-primaryColor/5 px-3 py-1.5 text-sm font-medium text-primaryColor"
                                >
                                    {task}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Schedule Preference Card */}
                    <div className="rounded-2xl border border-borderDark bg-white p-5">
                        <h3 className="font-bold text-fontBlack mb-4">Schedule Preference</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl border border-borderDark px-4 py-3">
                                <p className="text-xs text-darkSilver mb-1">Preferred Start Date</p>
                                <p className="text-sm font-medium text-fontBlack">
                                    {displayData.preferredStartDate}
                                </p>
                            </div>
                            <div className="rounded-xl border border-borderDark px-4 py-3">
                                <p className="text-xs text-darkSilver mb-1">Preferred Time</p>
                                <p className="text-sm font-medium text-fontBlack">
                                    {displayData.preferredTime}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submit Quote Form - shown when Send Quote is clicked */}
                    {showSubmitQuoteForm && (
                        <SubmitQuoteForm leadId={id} onCancel={() => setShowSubmitQuoteForm(false)} />
                    )}
                </div>

                {/* Sidebar */}
                <LeadSidebar leadId={id} showSubmitQuoteForm={showSubmitQuoteForm} onSendQuoteClick={() => setShowSubmitQuoteForm(true)} />
            </div>
        </>
    )
}
