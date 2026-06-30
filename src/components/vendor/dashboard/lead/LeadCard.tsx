'use client'

import { CalendarOutlineIconSVG, CheckmarkIconSVG, ChevronRightIconSVG, HomeOutlineIconSVG, LightningBoltIconSVG, MailOutlineIconSVG, PhoneOutlineIconSVG, UserOutlineIconSVG, } from '@/components/library/AllSVG'
import moment from 'moment'
import { ISingleLeadAPIResponseData } from '@/types/singleLead'
import LeadStatusBadge from './LeadStatusBadge'
import ImageComponent from '@/components/library/ImageComponent'

interface Props {
    lead: ISingleLeadAPIResponseData | undefined
    isUnlocked: boolean
    onUnlock: () => void
}

function formatDynamicAnswerValue(value: string | undefined): string {
    const raw = value?.trim() ?? ''
    if (!raw) return '—'

    const formatSingle = (val: string) => {
        if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
            return moment(val).locale('fr').format('DD MMM YYYY')
        }
        return val
    }

    if (raw.includes(',')) {
        return raw.split(',').map((part) => formatSingle(part.trim())).join(', ')
    }

    return formatSingle(raw)
}

export default function LeadCard({ lead, isUnlocked, onUnlock }: Props) {
    return (
        <div className="bg-appCard border border-appBorder rounded-2xl overflow-hidden mb-3.5 animate-hero-fade-up">
            {/* Card Header */}
            <div className="px-[22px] py-5 border-b border-appBorderSub">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <div className={`flex items-center gap-1.5 px-3 py-[5px] rounded-full text-[12px] font-bold border bg-primaryColor/12 border-primaryColor/25 text-[#93C5FD]`}>
                            {lead?.parent_service_category?.title ?? '—'}
                        </div>

                        <LeadStatusBadge
                            status={lead?.lead_status}
                            label={lead?.lead_status_label}
                            size="md"
                        />

                        <span className="text-[9px] font-bold bg-trust-green/15 text-[#6EE7B7] border border-trust-green/25 px-[7px] py-[3px] rounded-[4px]">
                            {lead?.contact_details?.client_type === 'Individual' ? 'B2C' : 'B2B'}
                        </span>
                    </div>
                </div>

                <div className="text-[24px] font-extrabold tracking-[-0.5px] text-appText mb-2.5 flex items-center gap-[7px]">
                    <div
                        className="border border-appBorder w-[32px] h-[32px] rounded-[9px] overflow-hidden flex items-center justify-center shrink-0 bg-primaryColor/12"
                    >
                        {lead?.service_category?.image ? (
                            <ImageComponent
                                url={lead.service_category.image}
                                img_title={lead.service_category.title ?? ''}
                                object_cover={true}
                            />
                        ) : (
                            <span className="text-[16px]">
                                {lead?.service_category?.title?.charAt(0) ?? '—'}
                            </span>
                        )}
                    </div>
                    {lead?.service_category?.title ?? '—'}
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1.5 text-[13px] text-appTextSec">
                        <span className="text-appTextMuted flex shrink-0">
                            <CalendarOutlineIconSVG size={13} />
                        </span>
                        {lead?.desiredDate ? moment(lead?.desiredDate).locale('fr').format('DD MMM YYYY') : '—'} · {lead?.timeSlot ?? '—'}
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
            </div>

            {/* Quality Bar */}
            {/* <div className="px-[22px] py-3 bg-linear-to-r from-amber/8 to-amber/4 border-b border-amber/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <span className="text-[14px]">⭐</span>
                    <span className="text-[12px] text-appTextSec">Qualité du prospect :</span>
                    <div className="flex items-center gap-1.5 text-[12px] font-bold text-amber">
                        {lead.qualityLabel}
                        <div className="flex gap-[3px] ml-1">
                            {Array.from({ length: 5 }, (_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${i < lead.qualityDots ? 'bg-amber' : 'bg-black/10 dark:bg-white/10'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <span className="text-[13px] font-extrabold text-amber bg-amber/12 border border-amber/20 px-3 py-1 rounded-full whitespace-nowrap">
                    🪙 {lead?.creditsToUnlock} crédits
                </span>
            </div> */}

            {/* Needs Block */}
            <div className="px-[22px] py-[18px] border-b border-appBorderSub">
                <div className="flex items-center gap-2 text-[14px] font-extrabold text-appText mb-3.5">
                    <div className="w-[26px] h-[26px] rounded-[8px] bg-primaryColor/15 flex items-center justify-center text-[13px] shrink-0">
                        ✅
                    </div>
                    Besoins du client
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                    {lead?.dynamic_answers && lead.dynamic_answers.length > 0 ? (
                        lead.dynamic_answers.map((answer) => (
                            <div
                                key={answer._id}
                                className="rounded-[10px] border border-appBorderSub bg-black/2 dark:bg-white/3 px-3.5 py-3"
                            >
                                <p className="text-[11px] font-semibold uppercase tracking-[0.4px] text-appTextMuted mb-1.5 leading-none">
                                    {answer.label ?? '—'}
                                </p>
                                <p className="text-[13px] font-medium text-appText leading-snug wrap-break-word">
                                    {formatDynamicAnswerValue(answer.value)}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="sm:col-span-2 rounded-[10px] border border-dashed border-appBorderSub bg-black/1.5 dark:bg-white/2 px-4 py-3.5 text-center">
                            <p className="text-[13px] text-appTextMuted">Aucun détail renseigné pour cette demande.</p>
                        </div>
                    )}
                </div>

                {/* Competitors Alert */}
                {lead?.lead_status_message !== null && <div className="mt-3.5 px-4 py-3 bg-linear-to-r from-orange-500/10 to-amber/8 border border-orange-500/25 rounded-[10px] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-[#FCA5A5]">
                        <span className="text-orange-500 flex shrink-0">
                            <LightningBoltIconSVG size={14} />
                        </span>
                        {lead?.lead_status_message ?? '—'}
                    </div>
                    {!isUnlocked && (
                        <button
                            type="button"
                            onClick={onUnlock}
                            className="cursor-pointer text-[12px] font-bold text-amber flex items-center gap-0.5 whitespace-nowrap hover:text-primaryColor transition-colors shrink-0"
                        >
                            Débloquer
                            <ChevronRightIconSVG size={12} />
                        </button>
                    )}
                </div>
                }
            </div>

            {/* Client Info Block */}
            <div className="px-[22px] py-[18px]">
                <div className="flex items-center gap-2 text-[14px] font-extrabold text-appText mb-3.5">
                    <div className="w-[26px] h-[26px] rounded-[8px] bg-trust-green/12 flex items-center justify-center text-[13px] shrink-0">
                        🔵
                    </div>
                    Client vérifié
                </div>
                <div className="flex flex-col gap-2.5">
                    {/* Name */}
                    <div className="flex items-center gap-2.5 text-[14px]">
                        <span className="text-appTextMuted flex shrink-0">
                            <UserOutlineIconSVG size={14} />
                        </span>
                        <span className="text-appTextSec">
                            {[lead?.contact_details?.first_name, lead?.contact_details?.last_name]
                                .filter(Boolean)
                                .join(' ') ||
                                [lead?.user?.first_name, lead?.user?.last_name]
                                    .filter(Boolean)
                                    .join(' ') ||
                                '—'}
                        </span>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-2.5 text-[14px]">
                        <span className="text-appTextMuted flex shrink-0">
                            <PhoneOutlineIconSVG size={14} />
                        </span><div className="relative inline-flex items-center">
                            <span className="text-appTextSec tracking-[2px] select-none">
                                {lead?.contact_details?.phone ?? '—'}
                            </span>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-2.5 text-[14px]">
                        <span className="text-appTextMuted flex shrink-0">
                            <MailOutlineIconSVG size={14} />
                        </span>
                        <div className="relative inline-flex items-center">
                            <span className="text-appTextSec tracking-[2px] select-none">
                                {lead?.contact_details?.email ?? '—'}
                            </span>
                        </div>
                    </div>

                    {/* Verified chips */}
                    <div className="flex gap-2 mt-2 flex-wrap">
                        <div className="flex items-center gap-[5px] text-[11px] font-semibold text-[#6EE7B7] bg-trust-green/10 border border-trust-green/20 px-2.5 py-1 rounded-full">
                            <CheckmarkIconSVG size={9} />
                            Email vérifié
                        </div>
                        <div className="flex items-center gap-[5px] text-[11px] font-semibold text-[#6EE7B7] bg-trust-green/10 border border-trust-green/20 px-2.5 py-1 rounded-full">
                            <CheckmarkIconSVG size={9} />
                            Numéro actif
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
