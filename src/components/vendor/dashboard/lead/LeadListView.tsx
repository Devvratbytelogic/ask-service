'use client'

import { useEffect, useMemo, useState } from 'react'
import ReactSelect, { type StylesConfig } from 'react-select'
import { FiSearch } from 'react-icons/fi'
import { Pagination } from '@heroui/react'
import {
    CalendarOutlineIconSVG,
    ChevronRightIconSVG,
    LightningBoltIconSVG,
    LocationPinIconSVG,
} from '@/components/library/AllSVG'
import { buildDashboardFilterSelectStyles, type FilterOption } from '@/components/pages/ClientDashboardPage/selectStyles'
import { useGetServiceCategoriesQuery, useGetVendorAvailableLeadsQuery } from '@/redux/rtkQueries/clientSideGetApis'
import { useRouter } from 'nextjs-toploader/app'
import { generateLeadDetailRoutePath, getVendorDashboardRoutePath } from '@/routes/routes'
import moment from 'moment'
import LeadStatusBadge from './LeadStatusBadge'
import LeadListViewSkeleton from './LeadListViewSkeleton'

const PAGE_LIMIT = 10
const MOBILE_MQ = '(max-width: 1023px)'

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

export default function LeadListView() {
    const router = useRouter()
    const [isMobile, setIsMobile] = useState<boolean | null>(null)
    const [serviceFilter, setServiceFilter] = useState('')
    const [page, setPage] = useState(1)
    const { data: serviceCategoriesData } = useGetServiceCategoriesQuery()
    const { data: leadsData, isLoading: leadsLoading, isFetching } = useGetVendorAvailableLeadsQuery({
        service: serviceFilter || undefined,
        unlocked: false,
        limit: PAGE_LIMIT,
        page,
    })

    const leads = leadsData?.data?.items ?? []
    const totalPages = leadsData?.data?.totalPages ?? 0
    const totalLeads = leadsData?.data?.total ?? leads.length

    // This list page is mobile-only; desktop goes to first lead detail (or dashboard).
    useEffect(() => {
        const mq = window.matchMedia(MOBILE_MQ)
        const update = () => setIsMobile(mq.matches)
        update()
        mq.addEventListener('change', update)
        return () => mq.removeEventListener('change', update)
    }, [])

    useEffect(() => {
        if (isMobile !== false) return

        const firstLeadId = leadsData?.data?.items?.[0]?._id
        if (firstLeadId) {
            router.replace(generateLeadDetailRoutePath(firstLeadId))
            return
        }
        if (!leadsLoading) {
            router.replace(getVendorDashboardRoutePath({ leads: 'locked' }))
        }
    }, [isMobile, leadsData, leadsLoading, router])

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

    const selectStyles = useMemo((): StylesConfig<FilterOption, false> => {
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

    const handleServiceChange = (value: string) => {
        setServiceFilter(value)
        setPage(1)
    }

    const handleSelect = (id: string) => {
        router.push(generateLeadDetailRoutePath(id))
    }

    // Don't render the mobile list on desktop (redirect in progress).
    if (isMobile === null || isMobile === false || leadsLoading) {
        return <LeadListViewSkeleton />
    }

    return (
        <div className="min-h-[calc(100vh-68px)] bg-appBg">
            <div className="sticky top-17 z-30 bg-appSurface border-b border-appBorder">
                <div className="px-4 pt-4 pb-3">
                    <div className="flex items-baseline justify-between gap-3 mb-3">
                        <h1 className="text-[15px] font-extrabold text-appText tracking-[-0.2px]">
                            Prospects disponibles
                        </h1>
                        <span className="text-[12px] font-semibold text-appTextMuted shrink-0">
                            {totalLeads}
                        </span>
                    </div>
                    <ReactSelect
                        instanceId="lead-list-service-filter"
                        options={serviceOptions}
                        value={selectedServiceOption}
                        onChange={(opt) => handleServiceChange(opt?.value ?? '')}
                        isSearchable={false}
                        styles={selectStyles}
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

            <div className={`flex flex-col ${isFetching ? 'opacity-60 pointer-events-none' : ''}`}>
                {leads.length > 0 ? (
                    leads.map((lead) => {
                        const cityAndPostalCode = lead?.city && lead?.pincode ? `${lead.city} - ${lead.pincode}` : ''
                        const desiredDateRaw = lead?.dynamic_answers?.find((a) => a.key === 'desired_date')?.value ?? ''
                        const desiredDate = desiredDateRaw ? moment(desiredDateRaw).locale('fr').format('DD MMM YYYY') : ''
                        const timeSlotRaw = lead?.dynamic_answers?.find((a) => a.key === 'time_slot')?.value ?? ''
                        const isNewToday = Boolean(lead?.createdAt && moment(lead.createdAt).isSame(moment(), 'day'))
                        const additionalDetails = lead?.additionalDetails?.trim()
                        const statusMessage = lead?.lead_status_message?.trim()
                        const createdLabel = lead?.createdAt ? formatShortRelative(lead.createdAt) : ''

                        return (
                            <button
                                key={lead?._id}
                                type="button"
                                onClick={() => handleSelect(lead?._id)}
                                className="group w-full text-left px-4 py-3.5 border-b border-appBorderSub cursor-pointer transition-colors duration-150 active:bg-black/4 dark:active:bg-white/4 hover:bg-black/2 dark:hover:bg-white/2"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-2.5 mb-1.5">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5 min-w-0 mb-0.5">
                                                    {isNewToday && <LeadStatusBadge status="new" label="NEW" />}
                                                    <span className="text-[14px] font-bold text-appText truncate leading-snug">
                                                        {lead?.service_category?.title || '—'}
                                                    </span>
                                                </div>
                                                {createdLabel && (
                                                    <p className="text-[12px] text-appTextSec truncate leading-snug">
                                                        <span className="text-appTextMuted">Créé :</span>{' '}
                                                        <span className="font-semibold text-appText">{createdLabel}</span>
                                                    </p>
                                                )}
                                                {additionalDetails && (
                                                    <p className="text-[12px] font-medium text-appTextMuted truncate leading-snug mt-0.5">
                                                        {additionalDetails}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                                                <span className="text-[11px] font-bold text-amber bg-amber/12 border border-amber/20 px-2 py-0.75 rounded-full whitespace-nowrap">
                                                    {lead?.creditsToUnlock} pts
                                                </span>
                                                <span className="text-appTextMuted group-hover:text-appTextSec transition-colors flex">
                                                    <ChevronRightIconSVG size={14} />
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-appTextSec">
                                            <span className="inline-flex items-center gap-1 min-w-0">
                                                <span className="text-appTextMuted flex shrink-0">
                                                    <LocationPinIconSVG size={12} />
                                                </span>
                                                <span className="truncate">{cityAndPostalCode || '—'}</span>
                                            </span>
                                            <span className="inline-flex items-center gap-1 min-w-0">
                                                <span className="text-appTextMuted flex shrink-0">
                                                    <CalendarOutlineIconSVG size={12} />
                                                </span>
                                                <span className="truncate">
                                                    {desiredDate || '—'}
                                                    {timeSlotRaw ? ` · ${timeSlotRaw}` : ''}
                                                </span>
                                            </span>
                                        </div>

                                        {statusMessage && (
                                            <div className="mt-2.5 px-2.5 py-1.5 rounded-md text-[11px] leading-snug flex items-start gap-1.5 bg-orange-500/10 text-[#FCA5A5] border border-orange-500/15">
                                                <span className="text-orange-500 flex shrink-0 mt-px">
                                                    <LightningBoltIconSVG size={12} />
                                                </span>
                                                <span className="line-clamp-2">{statusMessage}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        )
                    })
                ) : (
                    <div className="px-4 py-14 text-center">
                        <p className="text-[14px] font-semibold text-appText mb-1">Aucun prospect</p>
                        <p className="text-[12px] text-appTextMuted">Aucun prospect disponible pour le moment.</p>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center py-5 px-4">
                    <Pagination
                        total={totalPages}
                        page={page}
                        onChange={setPage}
                        showControls
                        color="primary"
                        radius="full"
                        classNames={{
                            cursor: 'bg-primaryColor text-white',
                            item: 'cursor-pointer',
                            prev: 'cursor-pointer',
                            next: 'cursor-pointer',
                            ellipsis: 'cursor-pointer',
                        }}
                    />
                </div>
            )}
        </div>
    )
}
