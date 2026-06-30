'use client'

import { useMemo, useState } from 'react'
import ReactSelect, { type StylesConfig } from 'react-select'
import { CalendarOutlineIconSVG, LocationPinIconSVG } from '@/components/library/AllSVG'
import { buildDashboardFilterSelectStyles, type FilterOption } from '@/components/pages/ClientDashboardPage/selectStyles'
import { useGetServiceCategoriesQuery, useGetVendorAvailableLeadsQuery } from '@/redux/rtkQueries/clientSideGetApis'
import { useRouter } from 'nextjs-toploader/app'
import { generateLeadDetailRoutePath } from '@/routes/routes'

type LeadStatus = 'new' | 'unlocked' | 'pending' | 'accepted' | 'ignored' | 'withdrawn'

function resolveLeadStatus(status: string | null | undefined): LeadStatus {
    switch ((status ?? '').toLowerCase()) {
        case 'unlocked':
            return 'unlocked'
        case 'pending':
            return 'pending'
        case 'accepted':
            return 'accepted'
        case 'ignored':
            return 'ignored'
        case 'withdrawn':
            return 'withdrawn'
        case 'new':
        default:
            return 'new'
    }
}

const LEAD_STATUS_BADGE_CLASS: Record<LeadStatus, string | null> = {
    new: 'bg-red-500 text-white',
    unlocked: 'bg-trust-green text-white',
    pending: 'bg-trust-green text-white',
    accepted: 'bg-trust-green text-white',
    ignored: null,
    withdrawn: null,
}

function LeadStatusBadge({ status, label }: { status?: string | null; label?: string | null }) {
    if (!status) return null

    const resolved = resolveLeadStatus(status)
    const badgeClass = LEAD_STATUS_BADGE_CLASS[resolved]
    if (!badgeClass) return null

    return (
        <span className={`text-[8px] font-extrabold uppercase tracking-[0.5px] px-[5px] py-[2px] rounded-[3px] shrink-0 ${badgeClass}`}>
            {label}
        </span>
    )
}


interface Props {
    selectedId: string
}

export default function LeadSidebar({ selectedId }: Props) {
    const router = useRouter()
    const [serviceFilter, setServiceFilter] = useState('')
    const { data: serviceCategoriesData } = useGetServiceCategoriesQuery()
    const { data: leadsData } = useGetVendorAvailableLeadsQuery({
        service: serviceFilter || undefined,
        sort: 'newest',
        unlocked: false,
        limit: 20,
    })

    const leads = leadsData?.data?.items ?? []

    const serviceOptions = [
        { value: '', label: '🔍 Tous les services' },
        ...(serviceCategoriesData?.data ?? []).map((cat) => ({
            value: cat._id,
            label: cat.title,
        })),
    ]

    const selectedServiceOption = serviceOptions.find((o) => o.value === serviceFilter) ?? serviceOptions[0]

    const sidebarSelectStyles = useMemo((): StylesConfig<FilterOption, false> => {
        const baseStyles = buildDashboardFilterSelectStyles()
        return {
            ...baseStyles,
            control: (base, state) => ({
                ...(typeof baseStyles.control === 'function' ? baseStyles.control(base, state) : base),
                width: '100%',
                minWidth: 'unset',
            }),
        }
    }, [])

    const handleSelect = (id: string) => {
        if (id === selectedId) return
        router.push(generateLeadDetailRoutePath(id))
    }
    return (
        <aside className="bg-appSurface border-r border-appBorder overflow-y-auto sticky top-[58px] h-[calc(100vh-58px)]">
            <div className="p-4 pb-2.5">
                <div className="text-[12px] font-bold uppercase tracking-[1px] text-appTextMuted mb-2.5">
                    Prospects disponibles
                </div>
                <div className="relative mb-2">
                    <ReactSelect
                        instanceId="lead-sidebar-service-filter"
                        options={serviceOptions}
                        value={selectedServiceOption}
                        onChange={(opt) => setServiceFilter(opt?.value ?? '')}
                        isSearchable={false}
                        styles={sidebarSelectStyles}
                        menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                        menuPosition="fixed"
                    />
                </div>
            </div>

            <div className="text-[11px] font-semibold text-appTextMuted px-[14px] mb-1.5">
                {leads.length} prospects disponibles
            </div>

            {leads.length > 0 && leads.map((lead) => (
                <button
                    key={lead._id}
                    type="button"
                    onClick={() => handleSelect(lead?._id)}
                    className={`w-full text-left px-[14px] py-3 border-b border-appBorderSub cursor-pointer transition-all duration-200 hover:bg-black/3 dark:hover:bg-white/4 ${selectedId === lead?._id
                        ? 'bg-amber/8 border-l-[3px] border-l-amber'
                        : 'border-l-[3px] border-l-transparent'
                        }`}
                >
                    <div className="flex items-center justify-between mb-[5px] gap-2">
                        <div className="text-[13px] font-bold text-appText flex items-center gap-[5px] min-w-0">
                            <LeadStatusBadge status={lead?.lead_status} label={lead?.lead_status_label} />
                            <span className="truncate">{lead?.service_category?.title}</span>
                        </div>
                        <span className="text-[11px] font-bold text-amber bg-amber/12 border border-amber/20 px-[7px] py-[2px] rounded-full whitespace-nowrap shrink-0">
                            {lead?.creditsToUnlock} pts
                        </span>
                    </div>
                    <div className="flex flex-col gap-[2px]">
                        <span className="text-[11px] font-semibold text-appTextMuted">
                            {lead?.note}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-appTextSec">
                            <span className="text-appTextMuted flex shrink-0">
                                <LocationPinIconSVG size={11} />
                            </span>
                            {/* {lead?.address_1} */}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-appTextSec">
                            <span className="text-appTextMuted flex shrink-0">
                                <CalendarOutlineIconSVG size={11} />
                            </span>
                            {/* {lead?.dateInfo} */}
                        </div>
                    </div>
                    <div className={`mt-[7px] px-2 py-[5px] rounded-[6px] text-[11px] leading-[1.4] flex items-center gap-1 bg-black/3 dark:bg-white/3`}>
                        Gardiennage · {lead?.contact_details?.client_type === 'Individual' ? 'B2C' : 'B2B'}
                    </div>
                </button>
            ))}
        </aside>
    )
}
