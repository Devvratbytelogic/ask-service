type LeadStatus = 'strong' | 'new'

function resolveLeadStatus(status: string | null | undefined): LeadStatus | null {
    switch ((status ?? '').toLowerCase()) {
        case 'strong':
            return 'strong'
        case 'new':
            return 'new'
        default:
            return null
    }
}

const LEAD_STATUS_BADGE_CLASS: Record<LeadStatus, string> = {
    strong: 'bg-amber text-white',
    new: 'bg-red-500 text-white',
}

const SIZE_CLASS = {
    sm: 'text-[8px] px-[5px] py-[2px] rounded-[3px]',
    md: 'text-[9px] px-[7px] py-[3px] rounded-[4px]',
} as const

export default function LeadStatusBadge({
    status,
    label,
    size = 'sm',
}: {
    status?: string | null
    label?: string | null
    size?: keyof typeof SIZE_CLASS
}) {
    const resolved = resolveLeadStatus(status)
    if (!resolved) return null


    return (
        <span
            className={`font-extrabold uppercase tracking-[0.5px] shrink-0 ${SIZE_CLASS[size]} ${LEAD_STATUS_BADGE_CLASS[resolved]}`}
        >
            {label}
        </span>
    )
}
