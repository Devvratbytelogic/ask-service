'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import moment from 'moment'
import 'moment/locale/fr'
import { Spinner } from '@heroui/react'
import { LocationSVG } from '@/components/library/AllSVG'
import LeadHeader from './LeadHeader'
import LeadSidebar from './LeadSidebar'
import SubmitQuoteForm from './SubmitQuoteForm'
import { useGetSingleLeadQuery } from '@/redux/rtkQueries/clientSideGetApis'
import type { ISingleLeadAPIResponseData, DynamicAnswersEntity } from '@/types/singleLead'
import { formatPhoneWithCountryCode } from '@/utils/formatPhone'
import ImageComponent from '@/components/library/ImageComponent'

export interface LeadFullDetailsData {
    title?: string
    id?: string
    postedAt?: string
    creditsToUnlock?: number
    unlocked?: boolean
    canQuote?: boolean
}

interface LeadFullDetailsProps {
    id: string
}

function formatFrenchPhone(phone: string): string {
    if (!phone) return phone
    const digits = phone.replace(/\D/g, '')
    if (digits.startsWith('33') && digits.length >= 11) {
        return '0' + digits.slice(2)
    }
    return phone
}

function translateClientType(type: string): string {
    if (type === 'Company' || type === 'Entreprise') return 'Entreprise'
    if (type === 'Individual' || type === 'Particulier') return 'Particulier'
    return type
}

function formatLocation(lead: ISingleLeadAPIResponseData | undefined): string {
    if (!lead) return ''
    const parts = [lead.address_1, lead.address_2, lead.city, lead.state, lead.country, lead.pincode].filter(Boolean)
    return parts.join(', ')
}

export default function LeadFullDetails({ id }: LeadFullDetailsProps) {
    const { data: leadData, isLoading: leadLoading } = useGetSingleLeadQuery({ id })
    const lead = leadData?.data
    const [showSubmitQuoteForm, setShowSubmitQuoteForm] = useState(false)
    const submitQuoteFormRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (showSubmitQuoteForm && submitQuoteFormRef.current) {
            submitQuoteFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [showSubmitQuoteForm])

    const headerData = useMemo((): LeadFullDetailsData | null => {
        if (!lead) return null
        const leadExt = lead as ISingleLeadAPIResponseData & { creditsToUnlock?: number }
        return {
            title: (lead.service_category?.title || lead.child_category) ?? undefined,
            id: lead.reference_no,
            postedAt: lead.createdAt ? moment(lead.createdAt).format('DD-MM-YYYY') : undefined,
            creditsToUnlock: leadExt.creditsToUnlock ?? 0,
            unlocked: lead.unlocked,
            canQuote: lead.canQuote,
        }
    }, [lead])

    const displayData = useMemo(() => {
        if (!lead) return null
        const contact = lead.contact_details
        const clientName = [contact?.first_name, contact?.last_name].filter(Boolean).join(' ') || [lead.user?.first_name, lead.user?.last_name].filter(Boolean).join(' ')
        const clientInitials = clientName ? clientName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'N/A'
        const rawLead = lead as ISingleLeadAPIResponseData & { frequency?: string; preferred_start_date?: string; preferred_time_of_day?: string; start_date?: string; start_time?: string; end_date?: string; end_time?: string; selected_options?: string[] }
        const dynamicAnswers: DynamicAnswersEntity[] = rawLead.dynamic_answers && Array.isArray(rawLead.dynamic_answers) ? [...rawLead.dynamic_answers] : []
        return {
            clientInitials,
            clientProfilePicture: lead.user?.profile_pic || '',
            clientName: clientName || 'N/A',
            businessType: lead.service_category?.title || lead.child_category || 'N/A',
            memberSince: lead.createdAt ? moment(lead.createdAt).format('DD MMM YYYY') : 'N/A',
            // phoneMasked: formatFrenchPhone(contact?.phone || lead.user?.phone || 'N/A'),
            phoneMasked: contact?.phone || lead.user?.phone || 'N/A',
            emailMasked: contact?.email || lead.user?.email || 'N/A',
            location: formatLocation(lead),
            serviceType: lead.service_category?.title || lead.child_category || 'N/A',
            frequency: rawLead.frequency || 'N/A',
            clientType: lead.contact_details?.client_type ? translateClientType(lead.contact_details.client_type) : 'N/A',
            preferredStartDate: rawLead.preferred_start_date ? moment(rawLead.preferred_start_date).format('LL') : 'N/A',
            preferredTime: rawLead.preferred_time_of_day || 'N/A',
            startDate: rawLead.start_date ? moment(rawLead.start_date).format('LL') : undefined,
            startTime: rawLead.start_time,
            endDate: rawLead.end_date ? moment(rawLead.end_date).format('LL') : undefined,
            endTime: rawLead.end_time,
            tasks: rawLead.selected_options ?? [],
            dynamicAnswers,
        }
    }, [lead])

    if (leadLoading || !displayData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-50 gap-4">
                {leadLoading && <Spinner size="lg" color="primary" />}
                <p className="text-darkSilver">{leadLoading ? 'Chargement des détails du prospect...' : 'Aucune donnée de prospect trouvée.'}</p>
            </div>
        )
    }

    return (
        <>
            {/* Header */}
            <LeadHeader data={headerData ?? {}} leadId={id} />
            <div className="flex flex-col lg:flex-row gap-6 mt-6">
                {/* Main Content */}
                <div className="flex-1 min-w-0 space-y-4">
                    {/* Client Information Card */}
                    <div className="rounded-2xl border border-borderDark bg-white p-5">
                        <div className="flex items-start gap-4">
                            <div className="flex w-12 h-12 shrink-0 items-center justify-center rounded-full bg-primaryColor/20 text-base font-bold text-white overflow-hidden">
                                <ImageComponent url={displayData.clientProfilePicture} img_title={displayData.clientName} object_cover={true} />
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
                                    Inscrit depuis le {displayData.memberSince}
                                </p>
                                <div className="border-t border-borderDark space-y-1 mt-4 pt-4">
                                    <div className='flex items-center justify-between gap-2'>
                                        <p className='text-sm text-darkSilver'>Téléphone</p>
                                        <p className='text-sm text-fontBlack'>{formatPhoneWithCountryCode(displayData.phoneMasked).formatted}</p>
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
                            <h3 className="font-bold text-fontBlack">Localisation</h3>
                        </div>
                        <p className="text-fontBlack">
                            {displayData.location}
                        </p>
                    </div>

                    {/* Service Requirements Card */}
                    <div className="rounded-2xl border border-borderDark bg-white p-5">
                        <h3 className="font-bold text-fontBlack mb-4">Exigences du service</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl border border-borderDark px-4 py-3">
                                <p className="text-xs text-darkSilver mb-1">Type de service</p>
                                <p className="text-sm font-medium text-fontBlack">
                                    {displayData.serviceType}
                                </p>
                            </div>
                            {displayData.frequency !== 'N/A' && <div className="rounded-xl border border-borderDark px-4 py-3">
                                <p className="text-xs text-darkSilver mb-1">Fréquence</p>
                                <p className="text-sm font-medium text-fontBlack">
                                    {displayData.frequency}
                                </p>
                            </div>}
                            {displayData.clientType !== 'N/A' && <div className="rounded-xl border border-borderDark px-4 py-3 sm:col-span-2">
                                <p className="text-xs text-darkSilver mb-1">Type de client</p>
                                <p className="text-sm font-medium text-fontBlack">
                                    {displayData.clientType}
                                </p>
                            </div>}
                        </div>
                    </div>

                    {/* Dynamic answers (from new request flow) */}
                    {displayData.dynamicAnswers.length > 0 && (
                        <div className="rounded-2xl border border-borderDark bg-white p-5">
                            <h3 className="font-bold text-fontBlack mb-4">Détails du service</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {displayData.dynamicAnswers.map((a: DynamicAnswersEntity) => {
                                    const formatValue = (val: string) => {
                                        if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
                                            const [y, m, d] = val.split('-')
                                            return `${d}-${m}-${y}`
                                        }
                                        return val
                                    }
                                    const displayValue = a.value?.includes(',')
                                        ? a.value.split(',').map((s) => formatValue(s.trim())).join(', ')
                                        : formatValue(a.value ?? '—')
                                    return (
                                        <div key={a._id || a.question_id} className="rounded-xl border border-borderDark px-4 py-3">
                                            <p className="text-xs text-darkSilver mb-1">{a.label}</p>
                                            <p className="text-sm font-medium text-fontBlack">{displayValue || '—'}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Requested Tasks Card (legacy) */}
                    {displayData.tasks.length > 0 && <div className="rounded-2xl border border-borderDark bg-white p-5">
                        <h3 className="font-bold text-fontBlack mb-4">Tâches demandées</h3>
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
                    </div>}

                    {/* Schedule Preference Card - only show when at least one schedule value exists */}
                    {(displayData.preferredStartDate !== 'N/A' || displayData.preferredTime !== 'N/A' || displayData.startDate || displayData.startTime || displayData.endDate || displayData.endTime) && (
                        <div className="rounded-2xl border border-borderDark bg-white p-5">
                            <h3 className="font-bold text-fontBlack mb-4">Préférence de planning</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {displayData.preferredStartDate !== 'N/A' && (
                                    <div className="rounded-xl border border-borderDark px-4 py-3">
                                        <p className="text-xs text-darkSilver mb-1">Date de début souhaitée</p>
                                        <p className="text-sm font-medium text-fontBlack">
                                            {displayData.preferredStartDate}
                                        </p>
                                    </div>
                                )}
                                {displayData.preferredTime !== 'N/A' && (
                                    <div className="rounded-xl border border-borderDark px-4 py-3">
                                        <p className="text-xs text-darkSilver mb-1">Heure souhaitée</p>
                                        <p className="text-sm font-medium text-fontBlack">
                                            {displayData.preferredTime}
                                        </p>
                                    </div>
                                )}
                                {displayData.startDate && (
                                    <div className="rounded-xl border border-borderDark px-4 py-3">
                                        <p className="text-xs text-darkSilver mb-1">Date de début</p>
                                        <p className="text-sm font-medium text-fontBlack">{displayData.startDate}</p>
                                    </div>
                                )}
                                {displayData.startTime && (
                                    <div className="rounded-xl border border-borderDark px-4 py-3">
                                        <p className="text-xs text-darkSilver mb-1">Heure de début</p>
                                        <p className="text-sm font-medium text-fontBlack">{displayData.startTime}</p>
                                    </div>
                                )}
                                {displayData.endDate && (
                                    <div className="rounded-xl border border-borderDark px-4 py-3">
                                        <p className="text-xs text-darkSilver mb-1">Date de fin</p>
                                        <p className="text-sm font-medium text-fontBlack">{displayData.endDate}</p>
                                    </div>
                                )}
                                {displayData.endTime && (
                                    <div className="rounded-xl border border-borderDark px-4 py-3">
                                        <p className="text-xs text-darkSilver mb-1">Heure de fin</p>
                                        <p className="text-sm font-medium text-fontBlack">{displayData.endTime}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Submit Quote Form - shown when Send Quote is clicked */}
                    {showSubmitQuoteForm && (
                        <div ref={submitQuoteFormRef}>
                            <SubmitQuoteForm leadId={id} onCancel={() => setShowSubmitQuoteForm(false)} />
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <LeadSidebar userId={lead?.user?._id} leadId={id} onSendQuoteClick={() => setShowSubmitQuoteForm(true)} unlocked={headerData?.unlocked} canQuote={headerData?.canQuote} quoteId={lead?.quote_id} />
            </div>
        </>
    )
}
