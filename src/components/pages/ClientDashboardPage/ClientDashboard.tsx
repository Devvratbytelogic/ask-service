'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import ReactSelect from 'react-select'
import { getRequestAServiceRoutePath } from '@/routes/routes'
import DemandCard from './DemandCard'
import DemandListSkeleton from '@/components/skeletons/DemandCardSkeleton'
import PhoneUnverifiedAlert from './PhoneUnverifiedAlert'
import { useGetCreatedServicesQuery, useGetAllServiceRequestCitiesQuery, useGetGlobalSettingsQuery, useGetServiceCategoriesQuery } from '@/redux/rtkQueries/clientSideGetApis'
import { buildDashboardFilterSelectStyles, type FilterOption } from './selectStyles'
import EmailUnverifiedAlert from './EmailUnverifiedAlert'


type StatConfig = {
    icon: string
    iconBg: string
    value: number
    valueColor: string
    label: string
    linkText: string
    linkColor: string
}

type TabKey = 'all' | 'open' | 'devis' | 'closed'

const SORT_OPTIONS: FilterOption[] = [
    { value: '', label: 'Trier par date' },
    { value: 'most_recent', label: 'Plus récent' },
    { value: 'oldest', label: 'Plus ancien' },
    { value: 'most_quotes', label: 'Plus de devis' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function ArrowIcon() {
    return (
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
    )
}

function StatCard({
    icon,
    iconBg,
    value,
    valueColor,
    label,
    linkText,
    linkColor,
}: StatConfig) {
    return (
        <div className="bg-appCard border border-appBorder rounded-2xl px-5 py-[18px] cursor-pointer transition-all duration-250 hover:border-appBorder hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
            <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[17px] mb-3"
                style={{ background: iconBg }}
            >
                {icon}
            </div>
            <p className={`text-[30px] font-extrabold tracking-[-1px] leading-none mb-1 ${valueColor}`}>
                {value}
            </p>
            <p className="text-xs text-appTextSec mb-2.5">{label}</p>
            <span className={`text-[11px] font-semibold flex items-center gap-[3px] ${linkColor}`}>
                {linkText}
                <ArrowIcon />
            </span>
        </div>
    )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ClientDashboard() {
    const { data: serviceCategoriesData } = useGetServiceCategoriesQuery()
    const { data: allServiceRequestCitiesData } = useGetAllServiceRequestCitiesQuery()
    const { data: globalSettings } = useGetGlobalSettingsQuery()
    const quoteExpired = globalSettings?.data?.quote_expired ?? 7

    const serviceCategoryOptions = useMemo<FilterOption[]>(
        () => [
            { value: 'all', label: 'Tous les services' },
            ...(serviceCategoriesData?.data ?? []).map((cat) => ({
                value: cat._id,
                label: cat.title,
            })),
        ],
        [serviceCategoriesData],
    )

    const cityOptions = useMemo<FilterOption[]>(() => {
        const unique = [...new Set((allServiceRequestCitiesData?.data?.cities ?? []).filter(Boolean))]
        return [
            { value: 'all', label: 'Toutes les villes' },
            ...unique.map((city) => ({ value: city, label: city })),
        ]
    }, [allServiceRequestCitiesData])

    const filterSelectStyles = useMemo(() => buildDashboardFilterSelectStyles(), [])

    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<TabKey>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [serviceFilter, setServiceFilter] = useState<string>('all')
    const [cityFilter, setCityFilter] = useState<string>('all')
    const [page, setPage] = useState(1)
    const [sortFilter, setSortFilter] = useState<string>('')

    const { data, isLoading, isError } = useGetCreatedServicesQuery(
        {
            ...(searchQuery && { search: searchQuery }),
            ...(activeTab !== 'all' && { status: activeTab === 'open' ? 'ACTIVE' : activeTab === 'devis' ? 'QUOTED' : 'CLOSED' }),
            ...(serviceFilter !== 'all' && { service: serviceFilter }),
            ...(cityFilter !== 'all' && { city: cityFilter }),
            ...(sortFilter !== '' && { sort: sortFilter }),
            page,
            limit: 5,
        },
        { pollingInterval: 15000 },
    )
    const apiData = data?.data
    const requests = apiData?.data ?? []
    const summary = apiData?.summary
    const totalPages = apiData?.pagination?.totalPages ?? 0
    const totalCount = apiData?.pagination?.total ?? 0

    const TAB_COUNTS: Record<TabKey, number> = {
        all: totalCount,
        open: summary?.active_requests_count ?? 0,
        devis: summary?.quotes_received_count ?? 0,
        closed: summary?.applications_closed_count ?? 0,
    }

    const STATS: StatConfig[] = [
        {
            icon: '📋',
            iconBg: 'rgba(27,79,255,0.15)',
            value: summary?.active_requests_count ?? 0,
            valueColor: 'text-primaryColor',
            label: 'Demandes actives',
            linkText: 'En cours de traitement',
            linkColor: 'text-primaryColor',
        },
        {
            icon: '📩',
            iconBg: 'rgba(245,158,11,0.15)',
            value: summary?.quotes_received_count ?? 0,
            valueColor: 'text-amber',
            label: 'Devis reçus',
            linkText: 'Devis en attente',
            linkColor: 'text-amber',
        },
        {
            icon: '✅',
            iconBg: 'rgba(16,185,129,0.15)',
            value: summary?.quotes_accepted_count ?? 0,
            valueColor: 'text-trust-green',
            label: 'Devis acceptés',
            linkText: 'Missions en cours',
            linkColor: 'text-trust-green',
        },
        {
            icon: '🗂️',
            iconBg: 'rgba(0,0,0,0.06)',
            value: summary?.applications_closed_count ?? 0,
            valueColor: 'text-appText',
            label: 'Demandes fermées',
            linkText: "Voir l'historique",
            linkColor: 'text-appTextMuted',
        },
    ]


    const handleToggle = (id: string) => {
        setExpandedId((prev) => (prev === id ? null : id))
    }

    const resetPage = () => setPage(1)

    const TABS: { key: TabKey; label: string }[] = [
        { key: 'all', label: 'Toutes' },
        { key: 'open', label: 'Ouvertes' },
        { key: 'devis', label: 'Devis reçus' },
        { key: 'closed', label: 'Fermées' },
    ]

    const selectedServiceOption = serviceCategoryOptions.find((o) => o.value === serviceFilter) ?? serviceCategoryOptions[0]
    const selectedCityOption = cityOptions.find((o) => o.value === cityFilter) ?? cityOptions[0]
    const selectedSortOption = SORT_OPTIONS.find((o) => o.value === sortFilter) ?? SORT_OPTIONS[0]

    return (
        <div className="body_x_axis_padding">
            <PhoneUnverifiedAlert />
            <EmailUnverifiedAlert />
            {/* Page header */}
            <div className="flex items-start justify-between mb-7 flex-wrap gap-3.5 animate-hero-fade-up">
                <div>
                    <h1 className="text-[26px] font-extrabold tracking-[-0.5px] text-appText mb-1">
                        Mes <span className="text-primaryColor">demandes</span>
                    </h1>
                    <p className="text-sm text-appTextSec flex items-center gap-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-appBorder">
                        Suivez vos demandes et gérez les devis reçus
                    </p>
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-8">
                {STATS.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>

            {/* Section header + tabs */}
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4 animate-hero-fade-up">
                <p className="text-[17px] font-extrabold text-appText tracking-[-0.3px]">
                    Toutes mes demandes
                </p>
                <div className="flex gap-0.5 bg-black/3 dark:bg-white/4 border border-appBorder rounded-[10px] p-[3px]">
                    {TABS.map(({ key, label }) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => { setActiveTab(key); resetPage() }}
                            className={`flex items-center gap-1.5 px-4 py-[7px] rounded-[8px] text-[13px] font-semibold cursor-pointer transition-all duration-200 ${activeTab === key
                                ? 'bg-primaryColor/15 text-primaryColor border border-primaryColor/20'
                                : 'text-appTextSec hover:text-appText border border-transparent'
                                }`}
                        >
                            {label}
                            {TAB_COUNTS[key] > 0 && (
                                <span
                                    className={`text-[10px] font-extrabold px-1.5 py-px rounded-full ${activeTab === key
                                        ? 'bg-primaryColor/20 text-primaryColor dark:text-[#93C5FD]'
                                        : 'bg-black/8 dark:bg-white/8 text-appTextSec'
                                        }`}
                                >
                                    {TAB_COUNTS[key]}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filter bar */}
            <div className="flex gap-2 items-center flex-wrap mb-4 animate-hero-fade-up">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <svg
                        className="absolute left-[11px] top-1/2 -translate-y-1/2 text-appTextMuted pointer-events-none"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Rechercher une demande…"
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); resetPage() }}
                        className="w-full pl-9 pr-3.5 py-[9px] bg-appCard border border-appBorder rounded-[8px] text-[13px] text-appText placeholder-appTextMuted outline-none transition-all duration-200 focus:border-primaryColor/40 focus:bg-primaryColor/5"
                    />
                </div>

                {/* Service filter */}
                <ReactSelect<FilterOption, false>
                    instanceId="client-dashboard-service-filter"
                    options={serviceCategoryOptions}
                    value={selectedServiceOption}
                    onChange={(opt) => { setServiceFilter(opt?.value ?? 'all'); resetPage() }}
                    isSearchable={false}
                    styles={filterSelectStyles}
                    menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                    menuPosition="fixed"
                />

                {/* City filter */}
                <ReactSelect<FilterOption, false>
                    instanceId="client-dashboard-city-filter"
                    options={cityOptions}
                    value={selectedCityOption}
                    onChange={(opt) => { setCityFilter(opt?.value ?? 'all'); resetPage() }}
                    isSearchable
                    placeholder="Toutes les villes"
                    noOptionsMessage={() => 'Aucune ville'}
                    styles={filterSelectStyles}
                    menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                    menuPosition="fixed"
                />

                {/* Sort */}
                <ReactSelect<FilterOption, false>
                    instanceId="client-dashboard-sort-filter"
                    options={SORT_OPTIONS}
                    value={selectedSortOption}
                    onChange={(opt) => { setSortFilter(opt?.value ?? ''); resetPage() }}
                    isSearchable={false}
                    styles={filterSelectStyles}
                    menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                    menuPosition="fixed"
                />
            </div>

            {/* Demands list */}
            {isLoading ? (
                <DemandListSkeleton count={5} />
            ) : isError ? (
                <div className="text-center py-16 text-appTextMuted">
                    <div className="text-4xl mb-3">⚠️</div>
                    <p className="text-sm">Une erreur est survenue. Veuillez réessayer.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {requests?.length > 0 ? (
                        requests?.map((demand) => (
                            <DemandCard
                                key={demand._id}
                                demand={demand}
                                isExpanded={expandedId === demand._id}
                                onToggle={() => handleToggle(demand._id)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-16 text-appTextMuted">
                            <div className="text-4xl mb-3">🔍</div>
                            <p className="text-sm">Aucune demande ne correspond à votre recherche.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 mb-2">
                    <p className="text-[13px] text-appTextMuted">
                        Page <span className="font-semibold text-appText">{page}</span> sur{' '}
                        <span className="font-semibold text-appText">{totalPages}</span>
                        {' '}· <span className="font-semibold text-appText">{totalCount}</span> demandes
                    </p>
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="flex items-center gap-1 px-3 py-[7px] rounded-[8px] border border-appBorder bg-appCard text-[13px] font-semibold text-appTextSec transition-all duration-200 hover:border-primaryColor/40 hover:text-primaryColor disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-appBorder disabled:hover:text-appTextSec"
                        >
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                            Précédent
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                                .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                                    if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...')
                                    acc.push(p)
                                    return acc
                                }, [])
                                .map((p, idx) =>
                                    p === '...' ? (
                                        <span key={`ellipsis-${idx}`} className="px-1 text-appTextMuted text-[13px]">…</span>
                                    ) : (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setPage(p as number)}
                                            className={`w-8 h-8 rounded-[8px] text-[13px] font-semibold transition-all duration-200 ${page === p
                                                    ? 'bg-primaryColor text-white shadow-[0_2px_8px_rgba(27,79,255,0.3)]'
                                                    : 'bg-appCard border border-appBorder text-appTextSec hover:border-primaryColor/40 hover:text-primaryColor'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    )
                                )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="flex items-center gap-1 px-3 py-[7px] rounded-[8px] border border-appBorder bg-appCard text-[13px] font-semibold text-appTextSec transition-all duration-200 hover:border-primaryColor/40 hover:text-primaryColor disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-appBorder disabled:hover:text-appTextSec"
                        >
                            Suivant
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* New demand CTA */}
            <div className="mt-3 bg-linear-to-br from-primaryColor/8 to-primaryColor/4 border border-dashed border-primaryColor/20 rounded-2xl px-7 py-7 text-center animate-hero-fade-up">
                <h4 className="text-[15px] font-bold text-appText mb-1.5">
                    Besoin d&apos;un autre professionnel ?
                </h4>
                <p className="text-[13px] text-appTextSec mb-[18px]">
                    Postez une nouvelle demande gratuitement et recevez des devis en moins de 24h.
                </p>
                <Link
                    href={getRequestAServiceRoutePath()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-br from-primaryColor to-[#4F46E5] text-white rounded-[10px] text-sm font-bold transition-all duration-250 hover:-translate-y-px shadow-[0_4px_16px_rgba(27,79,255,0.3)] hover:shadow-[0_6px_20px_rgba(27,79,255,0.4)]"
                >
                    <svg
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                    >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Créer une nouvelle demande
                </Link>
            </div>
        </div>
    )
}
