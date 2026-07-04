'use client'

import { useMemo, useState } from 'react'
import ReactSelect, { type StylesConfig } from 'react-select'
import { CalendarOutlineIconSVG, LocationPinIconSVG } from '@/components/library/AllSVG'
import { buildDashboardFilterSelectStyles, type FilterOption } from '@/components/pages/ClientDashboardPage/selectStyles'
import { useGetServiceCategoriesQuery, useGetVendorAvailableLeadsQuery } from '@/redux/rtkQueries/clientSideGetApis'
import { useRouter } from 'nextjs-toploader/app'
import { generateLeadDetailRoutePath } from '@/routes/routes'
import moment from 'moment'
import { resolvePostalOption } from '@/components/pages/RequestAServicePage/PostalCitySelect'
import LeadStatusBadge from './LeadStatusBadge'
import LeadSidebarSkeleton from './LeadSidebarSkeleton'

interface Props {
    selectedId: string
}

export default function LeadSidebar({ selectedId }: Props) {
    const router = useRouter()
    const [serviceFilter, setServiceFilter] = useState('')
    const { data: serviceCategoriesData } = useGetServiceCategoriesQuery()
    const { data: leadsData, isLoading: leadsLoading } = useGetVendorAvailableLeadsQuery({
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


    if (leadsLoading) {
        return <LeadSidebarSkeleton />
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
                {leads?.length} prospects disponibles
            </div>

            {leads?.length > 0 && leads?.map((lead) => {
                const postalCodeRaw = lead?.dynamic_answers?.find((a) => a.key === 'postal_code')?.value ?? ''
                const desiredDateRaw = lead?.dynamic_answers?.find((a) => a.key === 'desired_date')?.value ?? ''
                const desiredDate = desiredDateRaw ? moment(desiredDateRaw).locale('fr').format('DD MMM YYYY') : ''
                const timeSlotRaw = lead?.dynamic_answers?.find((a) => a.key === 'time_slot')?.value ?? ''
                return (
                    <button
                        key={lead?._id}
                        type="button"
                        onClick={() => handleSelect(lead?._id)}
                        className={`w-full text-left px-[14px] py-3 border-b border-appBorderSub cursor-pointer transition-all duration-200 hover:bg-black/3 dark:hover:bg-appCard/4 ${selectedId === lead?._id
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
                            <span className="text-[11px] font-medium text-appTextMuted">
                                {lead?.additionalDetails ?? ''}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] text-appTextSec">
                                <span className="text-appTextMuted flex shrink-0">
                                    <LocationPinIconSVG size={11} />
                                </span>
                                {postalCodeRaw ?? '—'}
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-appTextSec">
                                <span className="text-appTextMuted flex shrink-0">
                                    <CalendarOutlineIconSVG size={11} />
                                </span>
                                {desiredDate ?? '—'} · {timeSlotRaw ?? '—'}
                            </div>
                        </div>
                        <div className={`mt-[7px] px-2 py-[5px] rounded-[6px] text-[11px] leading-[1.4] flex items-center gap-1 bg-red-500/10 text-red-400/80`}>
                            {/* {lead?.parent_service_category?.title ?? '—'} · {lead?.contact_details?.client_type === 'Individual' ? 'B2C' : 'B2B'} */}
                            {lead?.lead_status_message ?? '—'}
                        </div>
                    </button>
                )
            })}
        </aside>
    )
}
