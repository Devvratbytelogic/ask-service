import {
    ArrowSendIconSVG,
    CheckmarkIconSVG,
    ClockCircleIconSVG,
    LocationPinIconSVG,
} from '@/components/library/AllSVG'
import type { OppGroupData, OppStatus } from './types'
import OpportunityCard, { EmptySlotLeads, EmptySlotTip } from './OpportunityCard'

// ─── OppGroupStatusBadge ──────────────────────────────────────────────────────

function OppGroupStatusBadge({ status, label }: { status: OppStatus; label: string }) {
    const variants: Record<OppStatus, { wrapperClass: string; icon: React.ReactNode }> = {
        new: {
            wrapperClass: 'bg-trust-green/15 text-[#6EE7B7] border border-trust-green/20',
            icon: <CheckmarkIconSVG />,
        },
        inprogress: {
            wrapperClass: 'bg-amber/12 text-[#FCD34D] border border-amber/20',
            icon: <ClockCircleIconSVG size={10} />,
        },
        sent: {
            wrapperClass: 'bg-primaryColor/12 text-[#93C5FD] border border-primaryColor/20',
            icon: <ArrowSendIconSVG size={10} />,
        },
    }
    const { wrapperClass, icon } = variants[status]
    return (
        <span className={`flex items-center gap-[5px] text-[11px] font-extrabold uppercase tracking-[0.5px] px-2.5 py-1 rounded-[5px] ${wrapperClass}`}>
            {icon}
            {label}
        </span>
    )
}

// ─── OpportunityGroup ─────────────────────────────────────────────────────────

export default function OpportunityGroup({ group }: { group: OppGroupData }) {
    const totalSlots = 3
    const emptyCount = group.showEmptySlots ? Math.max(0, totalSlots - group.cards.length) : 0

    return (
        <div className="bg-[#111827] border border-white/7 rounded-2xl overflow-hidden mb-4">
            <div className="px-[18px] py-3 bg-white/2 border-b border-white/6 flex items-center gap-2.5 flex-wrap">
                <OppGroupStatusBadge status={group.status} label={group.statusLabel} />
                <span className="text-[16px] font-extrabold text-white">{group.serviceName}</span>
                {group.locationTag && (
                    <span className="flex items-center gap-1 text-[12px] text-white/35 bg-white/4 border border-white/7 px-2 py-[3px] rounded-[6px]">
                        <LocationPinIconSVG />
                        {group.locationTag}
                    </span>
                )}
                {group.extraTag && (
                    <span className="text-[12px] text-white/25 bg-white/3 border border-white/6 px-2 py-[3px] rounded-[6px]">
                        {group.extraTag}
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
                {group.cards.map((card) => (
                    <OpportunityCard key={card.id} card={card} />
                ))}
                {emptyCount >= 1 && <EmptySlotLeads />}
                {emptyCount >= 2 && <EmptySlotTip />}
            </div>
        </div>
    )
}
