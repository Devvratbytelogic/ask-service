'use client'

import type { ReactNode } from 'react'
import { FaCoins, FaStar } from 'react-icons/fa6'
import { FiCheck, FiCheckCircle } from 'react-icons/fi'
import { CalendarOutlineIconSVG, CheckmarkIconSVG, ChevronRightIconSVG, HomeOutlineIconSVG, LightningBoltIconSVG, LocationPinIconSVG, MailOutlineIconSVG, PhoneOutlineIconSVG, StarOutlineIconSVG, StarRatingIconSVG, UserOutlineIconSVG, } from '@/components/library/AllSVG'
import moment from 'moment'
import { ISingleLeadAPIResponseData } from '@/types/singleLead'
import LeadStatusBadge from './LeadStatusBadge'
import ImageComponent from '@/components/library/ImageComponent'

interface Props {
    lead: ISingleLeadAPIResponseData | undefined
    isUnlocked: boolean
    canUnlock?: boolean
    onUnlock: () => void
}

function formatDynamicAnswerValue(value: string | undefined, type: string | undefined): string {
    const raw = value?.trim() ?? ''
    if (!raw) return '—'

    const formatSingle = (val: string) => {
        if (type && type === 'date') {
            return moment(val).locale('fr').format('DD MMM YYYY')
        }
        return val
    }

    if (raw.includes(',')) {
        return raw.split(',').map((part) => formatSingle(part.trim())).join(', ')
    }

    return formatSingle(raw)
}

function MetaChip({
    icon,
    children,
}: {
    icon: ReactNode
    children: ReactNode
}) {
    return (
        <div className="inline-flex items-center gap-1.5 rounded-full border border-appBorderSub bg-black/2 dark:bg-white/3 px-2.5 py-1.25 text-[12px] text-appTextSec">
            <span className="text-appTextMuted flex shrink-0">{icon}</span>
            <span className="truncate">{children}</span>
        </div>
    )
}

export default function LeadCard({ lead, isUnlocked, canUnlock = true, onUnlock }: Props) {
    const cityAndPostalCode = lead?.city && lead?.pincode ? `${lead.city} - ${lead.pincode}` : ''
    const desiredDateRaw = lead?.dynamic_answers?.find((a) => a.key === 'desired_date')?.value ?? ''
    const desiredDate = desiredDateRaw ? moment(desiredDateRaw).locale('fr').format('DD MMM YYYY') : ''
    const timeSlotRaw = lead?.dynamic_answers?.find((a) => a.key === 'time_slot')?.value ?? ''
    const isNewToday = Boolean(lead?.createdAt && moment(lead.createdAt).isSame(moment(), 'day'))
    const clientName =
        [lead?.contact_details?.first_name, lead?.contact_details?.last_name]
            .filter(Boolean)
            .join(' ') ||
        [lead?.user?.first_name, lead?.user?.last_name]
            .filter(Boolean)
            .join(' ') ||
        '—'

    return (
        <div className="bg-appCard border border-appBorder rounded-2xl overflow-hidden mb-3.5 max-lg:mb-0 animate-hero-fade-up">
            {/* Card Header */}
            <div className="px-5.5 py-5 max-lg:px-4 max-lg:pt-4 max-lg:pb-4 border-b border-appBorderSub">
                <div className="flex items-start justify-between gap-3 mb-3 max-lg:mb-3.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <div className="flex items-center gap-1.5 px-3 py-1.25 rounded-full text-[12px] font-bold border bg-primaryColor/12 border-primaryColor/25 text-[#93C5FD]">
                            {lead?.parent_service_category?.title ?? '—'}
                        </div>

                        {isNewToday && (
                            <span className="lg:inline-flex hidden">
                                <LeadStatusBadge status="new" label="NEW" size="md" />
                            </span>
                        )}

                        <span className="text-[9px] font-bold bg-trust-green/15 text-[#6EE7B7] border border-trust-green/25 px-1.75 py-0.75 rounded-full">
                            {lead?.contact_details?.client_type === 'Individual' ? 'B2C' : 'B2B'}
                        </span>
                    </div>
                </div>

                <div className="text-2xl max-lg:text-[22px] font-extrabold tracking-[-0.5px] text-appText mb-2.5 max-lg:mb-3.5 flex items-center gap-2.5">
                    <div className="border border-appBorder w-8 h-8 max-lg:w-11 max-lg:h-11 rounded-2xl overflow-hidden flex items-center justify-center shrink-0 bg-primaryColor/12">
                        {lead?.service_category?.image ? (
                            <ImageComponent
                                url={lead.service_category.image}
                                img_title={lead.service_category.title ?? ''}
                                object_cover={true}
                            />
                        ) : (
                            <span className="text-base max-lg:text-lg">
                                {lead?.service_category?.title?.charAt(0) ?? '—'}
                            </span>
                        )}
                    </div>
                    <span className="leading-tight">{lead?.service_category?.title ?? '—'}</span>
                </div>

                {/* Desktop meta row */}
                <div className="hidden lg:flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1.5 text-[13px] text-appTextSec">
                        <span className="text-appTextMuted flex shrink-0">
                            <LocationPinIconSVG size={13} />
                        </span>
                        {cityAndPostalCode || '—'}
                    </div>
                    <div className="flex items-center gap-1.5 text-[13px] text-appTextSec">
                        <span className="text-appTextMuted flex shrink-0">
                            <CalendarOutlineIconSVG size={13} />
                        </span>
                        {desiredDate || '—'} · {timeSlotRaw || '—'}
                    </div>
                    <div className="flex items-center gap-1.5 text-[13px] text-appTextSec">
                        <span className="text-appTextMuted flex shrink-0">
                            <UserOutlineIconSVG size={13} />
                        </span>
                        {lead?.contact_details?.client_type === 'Individual' ? 'B2C' : 'B2B'}
                    </div>
                    <div className="flex items-center gap-1.5 text-[13px] text-appTextSec">
                        <span className="text-appTextMuted flex shrink-0">
                            <HomeOutlineIconSVG size={13} />
                        </span>
                        {lead?.reference_no ?? '—'}
                    </div>
                </div>

                {/* Mobile meta chips */}
                <div className="flex lg:hidden flex-wrap gap-1.5">
                    <MetaChip icon={<LocationPinIconSVG size={12} />}>
                        {cityAndPostalCode || '—'}
                    </MetaChip>
                    <MetaChip icon={<CalendarOutlineIconSVG size={12} />}>
                        {desiredDate || '—'} · {timeSlotRaw || '—'}
                    </MetaChip>
                    <MetaChip icon={<HomeOutlineIconSVG size={12} />}>
                        {lead?.reference_no ?? '—'}
                    </MetaChip>
                </div>
            </div>

            {/* Quality Bar */}
            <div className="px-5.5 py-1.25 max-lg:px-4 max-lg:py-2.5 bg-amber/8 border-b border-amber/10">
                {/* Desktop: single row */}
                <div className="hidden lg:flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <FaStar className="size-4 text-amber shrink-0" aria-hidden />
                        <span className="text-sm text-appTextSec shrink-0">Qualité :</span>
                        <div className="flex items-center gap-1.5 text-sm font-bold text-amber min-w-0">
                            <span>{lead?.lead_stars_label}</span>
                            <div className="flex items-center gap-0.75 ml-0.5 shrink-0">
                                {Array.from({ length: 5 }, (_, i) => (
                                    i < (lead?.lead_stars ?? 0) ? (
                                        <StarRatingIconSVG key={i} size={16} />
                                    ) : (
                                        <StarOutlineIconSVG key={i} size={16} />
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                    <span className="text-sm font-extrabold text-amber bg-amber/12 border border-amber/20 px-3 py-1 rounded-full whitespace-nowrap inline-flex items-center gap-1 shrink-0">
                        <FaCoins className="size-3.5 shrink-0" aria-hidden />
                        {lead?.creditsToUnlock} crédits
                    </span>
                </div>

                {/* Mobile: stacked so label + stars never truncate; credits live in sticky header */}
                <div className="flex lg:hidden items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                        <FaStar className="size-3.5 text-amber shrink-0" aria-hidden />
                        <div className="min-w-0">
                            <p className="text-[11px] text-appTextSec leading-none mb-1">Qualité</p>
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[13px] font-extrabold text-amber leading-none">
                                    {lead?.lead_stars_label || '—'}
                                </span>
                                <div className="flex items-center gap-0.5 shrink-0" aria-label={`${lead?.lead_stars ?? 0} sur 5`}>
                                    {Array.from({ length: 5 }, (_, i) => (
                                        i < (lead?.lead_stars ?? 0) ? (
                                            <StarRatingIconSVG key={i} size={14} />
                                        ) : (
                                            <StarOutlineIconSVG key={i} size={14} />
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <span className="text-[11px] font-extrabold text-amber bg-amber/12 border border-amber/20 px-2.5 py-1 rounded-full whitespace-nowrap inline-flex items-center gap-1 shrink-0">
                        <FaCoins className="size-3 shrink-0" aria-hidden />
                        {lead?.creditsToUnlock}
                    </span>
                </div>
            </div>

            {/* Needs Block */}
            <div className="px-5.5 py-4.5 max-lg:px-4 max-lg:py-4 border-b border-appBorderSub">
                <div className="flex items-center gap-2 text-base max-lg:text-[15px] font-extrabold text-appText mb-3.5 max-lg:mb-3">
                    <div className="w-6.5 h-6.5 rounded-2xl bg-primaryColor/15 flex items-center justify-center text-base shrink-0 text-primaryColor">
                        <FiCheck className="size-3.5" strokeWidth={3} aria-hidden />
                    </div>
                    Besoins du client
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                    {lead?.dynamic_answers && lead.dynamic_answers.length > 0 ? (
                        lead.dynamic_answers.map((answer) => (
                            <div
                                key={answer._id}
                                className="rounded-[10px] max-lg:rounded-xl border border-appBorderSub bg-black/2 dark:bg-white/3 px-3.5 py-3 max-lg:px-3 max-lg:py-2.5"
                            >
                                <p className="text-[11px] font-semibold uppercase tracking-[0.4px] text-appTextMuted mb-1.5 leading-none">
                                    {answer.label ?? '—'}
                                </p>
                                <p className="text-[13px] font-medium text-appText leading-snug wrap-break-word">
                                    {formatDynamicAnswerValue(answer.value, answer.type)}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="sm:col-span-2 rounded-[10px] border border-dashed border-appBorderSub bg-black/1.5 dark:bg-white/2 px-4 py-3.5 text-center">
                            <p className="text-[13px] text-appTextMuted">Aucun détail renseigné pour cette demande.</p>
                        </div>
                    )}
                </div>

                {lead?.lead_status_message != null && (
                    <div className="mt-3.5 px-4 py-3 max-lg:px-3.5 max-lg:py-2.5 bg-orange-500/10 border border-orange-500/25 rounded-[10px] max-lg:rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-[13px] max-lg:text-[12px] font-semibold text-[#FCA5A5]">
                            <span className="text-orange-500 flex shrink-0">
                                <LightningBoltIconSVG size={14} />
                            </span>
                            {lead?.lead_status_message ?? '—'}
                        </div>
                        {!isUnlocked && canUnlock && (
                            <button
                                type="button"
                                onClick={onUnlock}
                                className="hidden lg:inline-flex cursor-pointer text-[12px] font-bold text-amber items-center gap-0.5 whitespace-nowrap hover:text-primaryColor transition-colors shrink-0"
                            >
                                Débloquer
                                <ChevronRightIconSVG size={12} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Client Info Block */}
            <div className="px-5.5 py-4.5 max-lg:px-4 max-lg:py-4">
                <div className="flex items-center gap-2 text-base max-lg:text-[15px] font-extrabold text-appText mb-3.5 max-lg:mb-3">
                    <div className="w-6.5 h-6.5 rounded-2xl bg-trust-green/12 flex items-center justify-center text-base shrink-0 text-trust-green">
                        <FiCheckCircle className="size-3.5" aria-hidden />
                    </div>
                    Client vérifié
                </div>

                {/* Mobile contact card */}
                <div className="lg:hidden rounded-2xl border border-appBorderSub bg-black/2 dark:bg-white/3 p-3.5 space-y-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-trust-green/15 border border-trust-green/20 flex items-center justify-center text-trust-green shrink-0">
                            <UserOutlineIconSVG size={15} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] text-appTextMuted font-medium leading-none mb-1">Client</p>
                            <p className="text-[14px] font-bold text-appText truncate">{clientName}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center gap-2.5 rounded-xl bg-appCard/80 border border-appBorderSub px-3 py-2.5">
                            <span className="text-appTextMuted flex shrink-0">
                                <PhoneOutlineIconSVG size={14} />
                            </span>
                            <span className="text-[13px] text-appTextSec tracking-[1.5px] select-none truncate">
                                {lead?.contact_details?.phone ?? '—'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2.5 rounded-xl bg-appCard/80 border border-appBorderSub px-3 py-2.5">
                            <span className="text-appTextMuted flex shrink-0">
                                <MailOutlineIconSVG size={14} />
                            </span>
                            <span className="text-[13px] text-appTextSec tracking-[1.5px] select-none truncate">
                                {lead?.contact_details?.email ?? '—'}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        <div className="flex items-center gap-1.25 text-[11px] font-semibold text-[#6EE7B7] bg-trust-green/10 border border-trust-green/20 px-2.5 py-1 rounded-full">
                            <CheckmarkIconSVG size={9} />
                            Email vérifié
                        </div>
                        <div className="flex items-center gap-1.25 text-[11px] font-semibold text-[#6EE7B7] bg-trust-green/10 border border-trust-green/20 px-2.5 py-1 rounded-full">
                            <CheckmarkIconSVG size={9} />
                            Numéro actif
                        </div>
                    </div>
                </div>

                {/* Desktop contact list */}
                <div className="hidden lg:flex flex-col gap-2.5">
                    <div className="flex items-center gap-2.5 text-base">
                        <span className="text-appTextMuted flex shrink-0">
                            <UserOutlineIconSVG size={14} />
                        </span>
                        <span className="text-appTextSec">{clientName}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-base">
                        <span className="text-appTextMuted flex shrink-0">
                            <PhoneOutlineIconSVG size={14} />
                        </span>
                        <div className="relative inline-flex items-center">
                            <span className="text-appTextSec tracking-[2px] select-none">
                                {lead?.contact_details?.phone ?? '—'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 text-base">
                        <span className="text-appTextMuted flex shrink-0">
                            <MailOutlineIconSVG size={14} />
                        </span>
                        <div className="relative inline-flex items-center">
                            <span className="text-appTextSec tracking-[2px] select-none">
                                {lead?.contact_details?.email ?? '—'}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-2 flex-wrap">
                        <div className="flex items-center gap-1.25 text-xs font-semibold text-[#6EE7B7] bg-trust-green/10 border border-trust-green/20 px-2.5 py-1 rounded-full">
                            <CheckmarkIconSVG size={9} />
                            Email vérifié
                        </div>
                        <div className="flex items-center gap-1.25 text-xs font-semibold text-[#6EE7B7] bg-trust-green/10 border border-trust-green/20 px-2.5 py-1 rounded-full">
                            <CheckmarkIconSVG size={9} />
                            Numéro actif
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
