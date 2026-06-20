import {
    ArrowSendIconSVG,
    CheckmarkIconSVG,
    ClockCircleIconSVG,
    LocationPinIconSVG,
} from '@/components/library/AllSVG'
import type { OppGroupData, OppStatus } from './types'
import OpportunityCard, { EmptySlotLeads, EmptySlotTip } from './OpportunityCard'
import { generateLeadDetailRoutePath } from '@/routes/routes';
import Link from 'next/link';

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
        <div className="bg-appSurface border border-appBorder rounded-2xl overflow-hidden mb-4">
            <div className="px-[18px] py-3 bg-black/2 dark:bg-white/2 border-b border-appBorderSub flex items-center gap-2.5 flex-wrap">
                <OppGroupStatusBadge status={group.status} label={group.statusLabel} />
                <span className="text-[16px] font-extrabold text-appText">{group.serviceName}</span>
                {group.locationTag && (
                    <span className="flex items-center gap-1 text-[12px] text-appTextSec bg-black/3 dark:bg-white/4 border border-appBorder px-2 py-[3px] rounded-[6px]">
                        <LocationPinIconSVG />
                        {group.locationTag}
                    </span>
                )}
                {group.extraTag && (
                    <span className="text-[12px] text-appTextMuted bg-black/2 dark:bg-white/3 border border-appBorderSub px-2 py-[3px] rounded-[6px]">
                        {group.extraTag}
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-appBorderSub">
                {group.cards.map((card) => (
                    <Link href={generateLeadDetailRoutePath(card.id)} key={card.id}>
                        <OpportunityCard card={card} />
                    </Link>
                ))}
                {emptyCount >= 1 && <EmptySlotLeads />}
                {emptyCount >= 2 && <EmptySlotTip />}
            </div>
        </div>
    )
}
