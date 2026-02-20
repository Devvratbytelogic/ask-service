'use client'

import { useState } from 'react'
import { LocationSVG } from '@/components/library/AllSVG'
import LeadHeader from './LeadHeader'
import LeadSidebar from './LeadSidebar'
import SubmitQuoteForm from './SubmitQuoteForm'


export interface LeadFullDetailsData {
    id?: string
    title?: string
    postedAt?: string
    creditsToUnlock?: number
    clientName?: string
    clientInitials?: string
    memberSince?: string
    businessType?: string
    phoneMasked?: string
    emailMasked?: string
    location?: string
    serviceType?: string
    frequency?: string
    clientType?: string
    tasks?: string[]
    preferredStartDate?: string
    preferredTime?: string
}

const defaultLead: LeadFullDetailsData = {
    id: 'L1',
    title: 'House Cleaning Request',
    postedAt: 'Posted 8 hours ago',
    creditsToUnlock: 3,
    clientName: 'Sarah Johnson',
    clientInitials: 'SJ',
    memberSince: 'Jan 2024',
    businessType: 'B2C',
    phoneMasked: '09XXXXXXXX',
    emailMasked: 'eXXXXXX@example.com',
    location: 'East London • E14 9XX',
    serviceType: 'Residential cleaning',
    frequency: 'Weekly',
    clientType: 'Individual',
    tasks: ['General cleaning', 'Floor cleaning', 'Kitchen / breakroom'],
    preferredStartDate: '1 February 2026',
    preferredTime: 'Morning (8am-12pm)',
}

interface LeadFullDetailsProps {
    lead?: LeadFullDetailsData | null
}

export default function LeadFullDetails({ lead: leadProp }: LeadFullDetailsProps) {
    const lead = leadProp ?? defaultLead
    const tasks = lead?.tasks ?? defaultLead.tasks ?? []
    const [showSubmitQuoteForm, setShowSubmitQuoteForm] = useState(false)

    return (
        <>
            {/* Header */}
            <LeadHeader data={lead} />
            <div className="flex flex-col lg:flex-row gap-6 mt-6">
                {/* Main Content */}
                <div className="flex-1 min-w-0 space-y-4">
                    {/* Client Information Card */}
                    <div className="rounded-2xl border border-borderDark bg-white p-5">
                        <div className="flex items-start gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primaryColor text-base font-bold text-white">
                                {lead?.clientInitials ?? defaultLead.clientInitials}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="font-bold text-fontBlack">
                                        {lead?.clientName ?? defaultLead.clientName}
                                    </h3>
                                    <span className="inline-flex rounded-full bg-[#E8F4FD] px-2.5 py-0.5 text-xs font-medium text-primaryColor">
                                        {lead?.businessType ?? defaultLead.businessType}
                                    </span>
                                </div>
                                <p className="text-sm text-darkSilver mt-0.5">
                                    Member since {lead?.memberSince ?? defaultLead.memberSince}
                                </p>
                                <div className="border-t border-borderDark space-y-1 mt-4 pt-4">
                                    <div className='flex items-center justify-between gap-2'>
                                        <p className='text-sm text-darkSilver'>Phone</p>
                                        <p className='text-sm text-fontBlack'>{lead?.phoneMasked ?? defaultLead.phoneMasked}</p>
                                    </div>
                                    <div className='flex items-center justify-between gap-2'>
                                        <p className='text-sm text-darkSilver'>Email</p>
                                        <p className='text-sm text-fontBlack'>{lead?.emailMasked ?? defaultLead.emailMasked}</p>
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
                            {lead?.location ?? defaultLead.location}
                        </p>
                    </div>

                    {/* Service Requirements Card */}
                    <div className="rounded-2xl border border-borderDark bg-white p-5">
                        <h3 className="font-bold text-fontBlack mb-4">Service Requirements</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl border border-borderDark px-4 py-3">
                                <p className="text-xs text-darkSilver mb-1">Service Type</p>
                                <p className="text-sm font-medium text-fontBlack">
                                    {lead?.serviceType ?? defaultLead.serviceType}
                                </p>
                            </div>
                            <div className="rounded-xl border border-borderDark px-4 py-3">
                                <p className="text-xs text-darkSilver mb-1">Frequency</p>
                                <p className="text-sm font-medium text-fontBlack">
                                    {lead?.frequency ?? defaultLead.frequency}
                                </p>
                            </div>
                            <div className="rounded-xl border border-borderDark px-4 py-3 sm:col-span-2">
                                <p className="text-xs text-darkSilver mb-1">Client Type</p>
                                <p className="text-sm font-medium text-fontBlack">
                                    {lead?.clientType ?? defaultLead.clientType}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Requested Tasks Card */}
                    <div className="rounded-2xl border border-borderDark bg-white p-5">
                        <h3 className="font-bold text-fontBlack mb-4">Requested Tasks</h3>
                        <div className="flex flex-wrap gap-2">
                            {tasks.map((task: string, i: number) => (
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
                                    {lead?.preferredStartDate ?? defaultLead.preferredStartDate}
                                </p>
                            </div>
                            <div className="rounded-xl border border-borderDark px-4 py-3">
                                <p className="text-xs text-darkSilver mb-1">Preferred Time</p>
                                <p className="text-sm font-medium text-fontBlack">
                                    {lead?.preferredTime ?? defaultLead.preferredTime}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submit Quote Form - shown when Send Quote is clicked */}
                    {showSubmitQuoteForm && (
                        <SubmitQuoteForm onCancel={() => setShowSubmitQuoteForm(false)} />
                    )}
                </div>

                {/* Sidebar */}
                <LeadSidebar showSubmitQuoteForm={showSubmitQuoteForm} onSendQuoteClick={() => setShowSubmitQuoteForm(true)} />
            </div>
        </>
    )
}
