import { ArrowSendIconSVG, CheckmarkIconSVG, ClockCircleIconSVG, } from '@/components/library/AllSVG'
import OpportunityCard from './OpportunityCard'
import { IAvailableLeadByCategoryDataEntity } from '@/types/availableLeadByCategory'
import { generateLeadDetailRoutePath } from '@/routes/routes'
import Link from 'next/link'

type GroupStatus = 'new' | 'pending' | 'accepted' | 'ignored'

const GROUP_STATUS_VARIANTS: Record<GroupStatus, { wrapperClass: string; icon: React.ReactNode }> = {
    new: {
        wrapperClass: 'bg-trust-green/15 text-[#6EE7B7] border border-trust-green/20',
        icon: <CheckmarkIconSVG />,
    },
    pending: {
        wrapperClass: 'bg-primaryColor/12 text-[#93C5FD] border border-primaryColor/20',
        icon: <ArrowSendIconSVG size={10} />,
    },
    accepted: {
        wrapperClass: 'bg-trust-green/15 text-[#6EE7B7] border border-trust-green/20',
        icon: <CheckmarkIconSVG />,
    },
    ignored: {
        wrapperClass: 'bg-black/5 dark:bg-white/5 text-appTextMuted border border-appBorderSub',
        icon: <ClockCircleIconSVG size={10} />,
    },
}

function resolveGroupStatus(status: string): GroupStatus {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'pending'
        case 'accepted':
            return 'accepted'
        case 'ignored':
            return 'ignored'
        case 'new':
        default:
            return 'new'
    }
}

function OppGroupStatusBadge({ status, label }: { status: string; label: string }) {
    const { wrapperClass, icon } = GROUP_STATUS_VARIANTS[resolveGroupStatus(status)]

    return (
        <span className={`flex items-center gap-[5px] text-[11px] font-extrabold uppercase tracking-[0.5px] px-2.5 py-1 rounded-[5px] ${wrapperClass}`}>
            {icon}
            {label}
        </span>
    )
}

// ─── OpportunityGroup ─────────────────────────────────────────────────────────

export default function OpportunityGroup({ item }: { item: IAvailableLeadByCategoryDataEntity }) {
    const leads = item?.leads ?? []

    return (
        <div className="bg-appSurface border border-appBorder rounded-2xl overflow-hidden mb-4">
            <div className="px-[18px] py-3 bg-black/2 dark:bg-white/2 border-b border-appBorderSub flex items-center gap-2.5 flex-wrap">
                <OppGroupStatusBadge status={item.status} label={item.status_label} />
                <span className="text-[16px] font-extrabold text-appText">{item.service_category?.title}</span>
                {item?.leads_count > 0 && (
                    <span className="text-[12px] text-appTextMuted bg-black/2 dark:bg-white/3 border border-appBorderSub px-2 py-[3px] rounded-[6px]">
                        {item?.leads_count} prospect{item?.leads_count > 1 ? 's' : ''}
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-appBorderSub">
                {leads && leads?.length > 0 && leads?.map((lead, index) => (
                    <Link href={generateLeadDetailRoutePath(lead._id)} key={index}>
                        <OpportunityCard lead={lead} />
                    </Link>
                ))}
            </div>
        </div>
    )
}
