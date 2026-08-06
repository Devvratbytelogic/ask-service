'use client'

import { useMemo, useState } from 'react'
import ReactSelect, { type StylesConfig } from 'react-select'
import { FiSearch } from 'react-icons/fi'
import { CalendarOutlineIconSVG, LocationPinIconSVG } from '@/components/library/AllSVG'
import { buildDashboardFilterSelectStyles, type FilterOption } from '@/components/pages/ClientDashboardPage/selectStyles'
import { useGetServiceCategoriesQuery, useGetVendorAvailableLeadsQuery } from '@/redux/rtkQueries/clientSideGetApis'
import { useRouter } from 'nextjs-toploader/app'
import { generateLeadDetailRoutePath } from '@/routes/routes'
import moment from 'moment'
import LeadStatusBadge from './LeadStatusBadge'
import LeadSidebarSkeleton from './LeadSidebarSkeleton'

function formatShortRelative(date: string): string {
    const created = moment(date)
    if (!created.isValid()) return ''

    const seconds = moment().diff(created, 'seconds')
    if (seconds < 60) return `il y a ${Math.max(seconds, 0)}s`

    const minutes = moment().diff(created, 'minutes')
    if (minutes < 60) return `il y a ${minutes}m`

    const hours = moment().diff(created, 'hours')
    if (hours < 24) return `il y a ${hours}h`

    return `il y a ${moment().diff(created, 'days')}j`
}

interface Props {
    selectedId: string
}

export default function LeadSidebar({ selectedId }: Props) {
    const router = useRouter()
    const [serviceFilter, setServiceFilter] = useState('')
    const { data: serviceCategoriesData } = useGetServiceCategoriesQuery()
    const { data: leadsData, isLoading: leadsLoading } = useGetVendorAvailableLeadsQuery({
        service: serviceFilter || undefined,
        unlocked: false,
        limit: 20,
        page: 1
    })

    const leads = leadsData?.data?.items ?? []

    const serviceOptions = useMemo<FilterOption[]>(
        () => [
            { value: '', label: 'Tous les services' },
            ...(serviceCategoriesData?.data ?? [])?.flatMap((cat) => cat?.child_categories ?? []).map((cat) => ({
                value: cat?._id,
                label: cat?.title,
            })),
        ],
        [serviceCategoriesData],
    )

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
        <aside className="bg-appSurface lg:border-r border-appBorder overflow-y-auto sticky top-14.5 h-[calc(100vh-58px)] max-lg:static max-lg:h-auto max-lg:overflow-visible max-lg:min-w-0">
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
                        formatOptionLabel={(option) =>
                            option.value === '' ? (
                                <span className="inline-flex items-center gap-1.5">
                                    <FiSearch className="size-3.5 shrink-0" aria-hidden />
                                    {option.label}
                                </span>
                            ) : (
                                option.label
                            )
                        }
                        menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                        menuPosition="fixed"
                    />
                </div>
            </div>

            <div className="text-[11px] font-semibold text-appTextMuted px-3.5 mb-1.5">
                {leads?.length} prospects disponibles
            </div>

            <div className="max-lg:flex max-lg:flex-nowrap max-lg:overflow-x-auto max-lg:overscroll-x-contain">
                {leads?.length > 0 && leads?.map((lead) => {
                    // const postalCodeRaw = lead?.dynamic_answers?.find((a) => a.key === 'postal_code')?.value ?? ''
                    const cityAndPostalCode = lead?.city && lead?.pincode ? `${lead.city} - ${lead.pincode}` : ''

                    const desiredDateRaw = lead?.dynamic_answers?.find((a) => a.key === 'desired_date')?.value ?? ''
                    const desiredDate = desiredDateRaw ? moment(desiredDateRaw).locale('fr').format('DD MMM YYYY') : ''
                    const timeSlotRaw = lead?.dynamic_answers?.find((a) => a.key === 'time_slot')?.value ?? ''
                    const isNewToday = Boolean(lead?.createdAt && moment(lead.createdAt).isSame(moment(), 'day'))
                    return (
                        <button
                            key={lead?._id}
                            type="button"
                            onClick={() => handleSelect(lead?._id)}
                            className={`w-full text-left px-3.5 py-3 max-lg:border-t border-b border-appBorderSub cursor-pointer transition-all duration-200 hover:bg-black/3 dark:hover:bg-appCard/4 max-lg:min-w-65 max-lg:w-65 max-lg:max-w-65 max-lg:shrink-0 max-lg:border-r ${selectedId === lead?._id
                                ? 'bg-amber/8 border-l-[3px] border-l-amber'
                                : 'border-l-[3px] border-l-transparent'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-1.25 gap-2">
                                <div className="text-[13px] font-bold text-appText flex items-center gap-1.25 min-w-0">
                                    {isNewToday && <LeadStatusBadge status="new" label="NEW" />}
                                    <span className="truncate">{lead?.service_category?.title}</span>
                                </div>
                                <span className="text-[11px] font-bold text-amber bg-amber/12 border border-amber/20 px-1.75 py-0.5 rounded-full whitespace-nowrap shrink-0">
                                    {lead?.creditsToUnlock} pts
                                </span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                {lead?.createdAt && (
                                    <div className="flex items-center gap-1 text-[11px] text-appTextSec min-w-0">
                                        <span className="text-appTextMuted shrink-0">Créé :</span>
                                        <span className="font-semibold text-appText truncate">
                                            {formatShortRelative(lead.createdAt)}
                                        </span>
                                    </div>
                                )}
                                <span className="text-[11px] font-medium text-appTextMuted">
                                    {lead?.additionalDetails ?? ''}
                                </span>
                                <div className="flex items-center gap-1 text-[11px] text-appTextSec">
                                    <span className="text-appTextMuted flex shrink-0">
                                        <LocationPinIconSVG size={11} />
                                    </span>
                                    {cityAndPostalCode ?? '—'}
                                </div>
                                <div className="flex items-center gap-1 text-[11px] text-appTextSec">
                                    <span className="text-appTextMuted flex shrink-0">
                                        <CalendarOutlineIconSVG size={11} />
                                    </span>
                                    {desiredDate ?? '—'} · {timeSlotRaw ?? '—'}
                                </div>
                            </div>
                            <div className={`mt-1.75 px-2 py-1.25 rounded-md text-[11px] leading-[1.4] flex items-center gap-1 bg-red-500/10 text-red-400/80`}>
                                {/* {lead?.parent_service_category?.title ?? '—'} · {lead?.contact_details?.client_type === 'Individual' ? 'B2C' : 'B2B'} */}
                                {lead?.lead_status_message ?? '—'}
                            </div>
                        </button>
                    )
                })}
            </div>
        </aside>
    )
}
