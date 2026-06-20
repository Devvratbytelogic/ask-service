'use client'

import {
    CalendarOutlineIconSVG,
    CheckmarkIconSVG,
    ChevronRightIconSVG,
    ClockCircleIconSVG,
    HomeOutlineIconSVG,
    LightningBoltIconSVG,
    LocationPinIconSVG,
    MailOutlineIconSVG,
    PhoneOutlineIconSVG,
    ShieldOutlineIconSVG,
    UserOutlineIconSVG,
    UsersGroupIconSVG,
} from '@/components/library/AllSVG'
import type { LeadDetail, NeedIconType } from './types'

function NeedIcon({ type }: { type: NeedIconType }) {
    if (type === 'shield') return <ShieldOutlineIconSVG size={14} />
    if (type === 'clock') return <ClockCircleIconSVG size={14} />
    return <UsersGroupIconSVG size={14} />
}

function ServicePill({ label, variant }: { label: string; variant: 'security' | 'cleaning' }) {
    const cls =
        variant === 'security'
            ? 'bg-primaryColor/[12%] border-primaryColor/25 text-[#93C5FD]'
            : 'bg-trust-green/10 border-trust-green/20 text-[#6EE7B7]'
    return (
        <div className={`flex items-center gap-1.5 px-3 py-[5px] rounded-full text-[12px] font-bold border ${cls}`}>
            {label}
        </div>
    )
}

interface Props {
    lead: LeadDetail
    isUnlocked: boolean
    onUnlock: () => void
}

export default function LeadCard({ lead, isUnlocked, onUnlock }: Props) {
    return (
        <div className="bg-appCard border border-appBorder rounded-2xl overflow-hidden mb-3.5 animate-hero-fade-up">
            {/* Card Header */}
            <div className="px-[22px] py-5 border-b border-appBorderSub">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <ServicePill label={lead.serviceLabel} variant={lead.serviceVariant} />
                        {lead.isNew && (
                            <span className="text-[9px] font-extrabold uppercase tracking-[0.8px] bg-red-500 text-white px-[7px] py-[3px] rounded-[4px]">
                                NOUVEAU
                            </span>
                        )}
                        {lead.clientType === 'b2b' ? (
                            <span className="text-[9px] font-bold bg-primaryColor/20 text-[#93C5FD] border border-primaryColor/30 px-[7px] py-[3px] rounded-[4px]">
                                B2B
                            </span>
                        ) : (
                            <span className="text-[9px] font-bold bg-trust-green/15 text-[#6EE7B7] border border-trust-green/25 px-[7px] py-[3px] rounded-[4px]">
                                B2C
                            </span>
                        )}
                    </div>
                    {lead.isUrgent && (
                        <div className="flex items-center gap-[5px] px-3 py-[6px] bg-red-500/10 border border-red-500/25 rounded-full text-[11px] font-bold text-[#FCA5A5] animate-urgency-pulse shrink-0">
                            <ClockCircleIconSVG size={11} />
                            {lead.urgencyLabel}
                        </div>
                    )}
                </div>

                <div className="text-[24px] font-extrabold tracking-[-0.5px] text-appText mb-2.5 flex items-center gap-[7px]">
                    <span className="text-amber flex shrink-0">
                        <LocationPinIconSVG size={18} />
                    </span>
                    {lead.location}
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1.5 text-[13px] text-appTextSec">
                        <span className="text-appTextMuted flex shrink-0">
                            <CalendarOutlineIconSVG size={13} />
                        </span>
                        {lead.dateInfo}
                    </div>
                    <div className="flex items-center gap-1.5 text-[13px] text-appTextSec">
                        <span className="text-appTextMuted flex shrink-0">
                            <UserOutlineIconSVG size={13} />
                        </span>
                        {lead.staffInfo}
                    </div>
                    <div className="flex items-center gap-1.5 text-[13px] text-appTextSec">
                        <span className="text-appTextMuted flex shrink-0">
                            <HomeOutlineIconSVG size={13} />
                        </span>
                        {lead.venueType}
                    </div>
                </div>
            </div>

            {/* Quality Bar */}
            <div className="px-[22px] py-3 bg-linear-to-r from-amber/8 to-amber/4 border-b border-amber/10 flex items-center justify-between">
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
                    🪙 {lead.credits} crédits
                </span>
            </div>

            {/* Needs Block */}
            <div className="px-[22px] py-[18px] border-b border-appBorderSub">
                <div className="flex items-center gap-2 text-[14px] font-extrabold text-appText mb-3.5">
                    <div className="w-[26px] h-[26px] rounded-[8px] bg-primaryColor/15 flex items-center justify-center text-[13px] shrink-0">
                        ✅
                    </div>
                    Besoins du client
                </div>
                <div className="flex flex-col gap-[9px]">
                    {lead.needs.map((need, i) => (
                        <div key={i} className="flex items-center gap-[9px] text-[14px] text-appTextSec">
                            <span className="text-appTextMuted flex shrink-0">
                                <NeedIcon type={need.iconType} />
                            </span>
                            {need.text}
                        </div>
                    ))}
                </div>

                {/* Competitors Alert */}
                <div className="mt-3.5 px-4 py-3 bg-linear-to-r from-orange-500/10 to-amber/8 border border-orange-500/25 rounded-[10px] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-[#FCA5A5]">
                        <span className="text-orange-500 flex shrink-0">
                            <LightningBoltIconSVG size={14} />
                        </span>
                        {lead.competitorsCount > 0
                            ? `${lead.competitorsCount} professionnels ont déjà consulté · Agissez vite !`
                            : 'Aucun concurrent pour le moment — soyez le premier !'}
                    </div>
                    {!isUnlocked && (
                        <button
                            type="button"
                            onClick={onUnlock}
                            className="text-[12px] font-bold text-amber flex items-center gap-0.5 whitespace-nowrap hover:text-primaryColor transition-colors shrink-0"
                        >
                            Débloquer
                            <ChevronRightIconSVG size={12} />
                        </button>
                    )}
                </div>
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
                    {/* Phone */}
                    <div className="flex items-center gap-2.5 text-[14px]">
                        <span className="text-appTextMuted flex shrink-0">
                            <PhoneOutlineIconSVG size={14} />
                        </span>
                        {isUnlocked ? (
                            <span className="text-appText">{lead.phoneRevealed}</span>
                        ) : (
                            <div className="relative inline-flex items-center">
                                <span className="text-appTextSec tracking-[2px] select-none" style={{ filter: 'blur(6px)' }}>
                                    {lead.phoneBlurred}
                                </span>
                                <div className="absolute inset-0 flex items-center justify-center bg-linear-to-r from-transparent via-appCard/60 to-transparent">
                                    <span className="text-[14px]">🔒</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-2.5 text-[14px]">
                        <span className="text-appTextMuted flex shrink-0">
                            <MailOutlineIconSVG size={14} />
                        </span>
                        {isUnlocked ? (
                            <span className="text-appText">{lead.emailRevealed}</span>
                        ) : (
                            <div className="relative inline-flex items-center">
                                <span className="text-appTextSec tracking-[2px] select-none" style={{ filter: 'blur(6px)' }}>
                                    {lead.emailBlurred}
                                </span>
                                <div className="absolute inset-0 flex items-center justify-center bg-linear-to-r from-transparent via-appCard/60 to-transparent">
                                    <span className="text-[14px]">🔒</span>
                                </div>
                            </div>
                        )}
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
