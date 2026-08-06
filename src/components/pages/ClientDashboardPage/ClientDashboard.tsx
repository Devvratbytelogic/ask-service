'use client'

import { useState, useMemo, type ReactNode } from 'react'
import Link from 'next/link'
import ReactSelect, { type StylesConfig } from 'react-select'
import { FiAlertTriangle, FiCheckCircle, FiClipboard, FiFolder, FiMail, FiSearch } from 'react-icons/fi'
import { getRequestAServiceRoutePath } from '@/routes/routes'
import DemandCard from './DemandCard'
import DemandListSkeleton from '@/components/skeletons/DemandCardSkeleton'
import PhoneUnverifiedAlert from './PhoneUnverifiedAlert'
import { useGetCreatedServicesQuery, useGetAllServiceRequestCitiesQuery, useGetServiceCategoriesQuery, useGetUserProfileInfoQuery } from '@/redux/rtkQueries/clientSideGetApis'
import { buildDashboardFilterSelectStyles, type FilterOption } from './selectStyles'
import EmailUnverifiedAlert from './EmailUnverifiedAlert'


type StatConfig = {
    icon: ReactNode
    iconBg: string
    value: number
    valueColor: string
    label: string
    linkText: string
    linkColor: string
}

type TabKey = 'all' | 'open' | 'devis' | 'accepted' | 'closed'

const TAB_STATUS: Record<Exclude<TabKey, 'all'>, string> = {
    open: 'ACTIVE',
    devis: 'QUOTED',
    accepted: 'ACCEPTED',
    closed: 'CLOSED',
}

const SORT_OPTIONS: FilterOption[] = [
    { value: '', label: 'Trier par date' },
    { value: 'most_recent', label: 'Plus récent' },
    { value: 'oldest', label: 'Plus ancien' },
    { value: 'most_quotes', label: 'Plus de devis' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

// function ArrowIcon() {
//     return (
//         <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
//             <path d="M5 12h14M12 5l7 7-7 7" />
//         </svg>
//     )
// }

function StatCard({
    icon,
    iconBg,
    value,
    valueColor,
    label,
}: StatConfig) {
    return (
        <div className="bg-appCard border border-appBorder rounded-xl sm:rounded-2xl px-3.5 py-3.5 sm:px-5 sm:py-4.5 transition-all duration-250 hover:border-appBorder hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
            <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] flex items-center justify-center text-[15px] sm:text-[17px] mb-2.5 sm:mb-3"
                style={{ background: iconBg }}
            >
                {icon}
            </div>
            <p className={`text-[24px] sm:text-[30px] font-extrabold tracking-[-1px] leading-none mb-1 ${valueColor}`}>
                {value}
            </p>
            <p className="text-[11px] sm:text-xs text-appTextSec leading-snug">{label}</p>
        </div>
    )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ClientDashboard() {
    const { data: serviceCategoriesData } = useGetServiceCategoriesQuery()
    const { data: allServiceRequestCitiesData } = useGetAllServiceRequestCitiesQuery()
    const { data: userProfileInfoData } = useGetUserProfileInfoQuery()
    const profile = userProfileInfoData?.data
    const showWelcomeMessage = Boolean(profile?.show_welcome_msg)
    const userName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ')
    
    const serviceCategoryOptions = useMemo<FilterOption[]>(
        () => [
            { value: 'all', label: 'Tous les services' },
            ...(serviceCategoriesData?.data ?? [])?.flatMap((cat) => cat?.child_categories ?? []).map((cat) => ({
                    value: cat?._id,
                    label: cat?.title,
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

    const filterSelectStyles = useMemo((): StylesConfig<FilterOption, false> => {
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
            ...(activeTab !== 'all' && { status: TAB_STATUS[activeTab] }),
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
        accepted: summary?.quotes_accepted_count ?? 0,
        closed: summary?.applications_closed_count ?? 0,
    }

    const STATS: StatConfig[] = [
        {
            icon: <FiClipboard className="size-5 text-primaryColor" aria-hidden />,
            iconBg: 'rgba(27,79,255,0.15)',
            value: summary?.active_requests_count ?? 0,
            valueColor: 'text-primaryColor',
            label: 'Demandes actives',
            linkText: 'En cours de traitement',
            linkColor: 'text-primaryColor',
        },
        {
            icon: <FiMail className="size-5 text-amber" aria-hidden />,
            iconBg: 'rgba(245,158,11,0.15)',
            value: summary?.quotes_received_count ?? 0,
            valueColor: 'text-amber',
            label: 'Devis reçus',
            linkText: 'Devis en attente',
            linkColor: 'text-amber',
        },
        {
            icon: <FiCheckCircle className="size-5 text-trust-green" aria-hidden />,
            iconBg: 'rgba(16,185,129,0.15)',
            value: summary?.quotes_accepted_count ?? 0,
            valueColor: 'text-trust-green',
            label: 'Devis acceptés',
            linkText: 'Missions en cours',
            linkColor: 'text-trust-green',
        },
        {
            icon: <FiFolder className="size-5 text-appText" aria-hidden />,
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
        // { key: 'open', label: 'Ouvertes' },
        { key: 'devis', label: 'Devis reçus' },
        { key: 'accepted', label: 'Devis acceptés' },
        { key: 'closed', label: 'Fermées' },
    ]

    const selectedServiceOption = serviceCategoryOptions.find((o) => o.value === serviceFilter) ?? serviceCategoryOptions[0]
    const selectedCityOption = cityOptions.find((o) => o.value === cityFilter) ?? cityOptions[0]
    const selectedSortOption = SORT_OPTIONS.find((o) => o.value === sortFilter) ?? SORT_OPTIONS[0]

    return (
        <div className="page_container">
            <PhoneUnverifiedAlert />
            <EmailUnverifiedAlert />
            {showWelcomeMessage && (
                <div className="mb-6 rounded-2xl border border-primaryColor/20 bg-primaryColor/5 px-4 py-3.5 sm:px-5 sm:py-4 animate-hero-fade-up">
                    <p className="text-[16px] sm:text-[17px] font-extrabold tracking-[-0.3px] text-appText">
                        Welcome back{userName ? `, ${userName}` : ''}!
                    </p>
                    <p className="mt-0.5 text-sm text-appTextSec">
                        We&apos;re glad to see you again.
                    </p>
                </div>
            )}
            {/* Page header */}
            <div className="flex items-start justify-between mb-5 sm:mb-7 flex-wrap gap-3.5 animate-hero-fade-up">
                <div>
                    <h1 className="text-[22px] sm:text-[26px] font-extrabold tracking-[-0.5px] text-appText mb-1">
                        Mes <span className="text-primaryColor">demandes</span>
                    </h1>
                    <p className="text-[13px] sm:text-sm text-appTextSec flex items-center gap-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-appBorder">
                        Suivez vos demandes et gérez les devis reçus
                    </p>
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 mb-6 sm:mb-8">
                {STATS.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>

            {/* Section header + tabs */}
            <div className="flex flex-col gap-3 mb-4 animate-hero-fade-up">
                <p className="text-[16px] sm:text-[17px] font-extrabold text-appText tracking-[-0.3px]">
                    Toutes mes demandes
                </p>
                <div className="overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="inline-flex gap-0.5 bg-black/3 dark:bg-white/4 border border-appBorder rounded-[10px] p-0.75">
                        {TABS.map(({ key, label }) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => { setActiveTab(key); resetPage() }}
                                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.75 rounded-lg text-[12px] sm:text-[13px] font-semibold cursor-pointer whitespace-nowrap shrink-0 transition-all duration-200 ${activeTab === key
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
            </div>

            {/* Filter bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2 items-stretch lg:items-center mb-4 animate-hero-fade-up">
                {/* Search */}
                <div className="relative w-full sm:col-span-2 lg:flex-1 lg:min-w-50">
                    <svg
                        className="absolute left-2.75 top-1/2 -translate-y-1/2 text-appTextMuted pointer-events-none"
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
                        className="w-full pl-9 pr-3.5 py-2.25 bg-appCard border border-appBorder rounded-lg text-[13px] text-appText placeholder-appTextMuted outline-none transition-all duration-200 focus:border-primaryColor/40 focus:bg-primaryColor/5"
                    />
                </div>

                {/* Service filter */}
                <div className="w-full lg:w-auto lg:min-w-40">
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
                </div>

                {/* City filter */}
                <div className="w-full lg:w-auto lg:min-w-40">
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
                </div>

                {/* Sort */}
                <div className="w-full sm:col-span-2 lg:col-span-1 lg:w-auto lg:min-w-40">
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
            </div>

            {/* Demands list */}
            {isLoading ? (
                <DemandListSkeleton count={5} />
            ) : isError ? (
                <div className="text-center py-16 text-appTextMuted">
                    <div className="mb-3 flex justify-center text-4xl">
                        <FiAlertTriangle className="size-10 text-amber" aria-hidden />
                    </div>
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
                            <div className="mb-3 flex justify-center text-4xl">
                                <FiSearch className="size-10" aria-hidden />
                            </div>
                            <p className="text-sm">Aucune demande ne correspond à votre recherche.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 mb-2">
                    <p className="text-[12px] sm:text-[13px] text-appTextMuted">
                        Page <span className="font-semibold text-appText">{page}</span> sur{' '}
                        <span className="font-semibold text-appText">{totalPages}</span>
                        {' '}· <span className="font-semibold text-appText">{totalCount}</span> demandes
                    </p>
                    <div className="flex items-center justify-between sm:justify-end gap-1.5">
                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.75 rounded-lg border border-appBorder bg-appCard text-[12px] sm:text-[13px] font-semibold text-appTextSec transition-all duration-200 hover:border-primaryColor/40 hover:text-primaryColor disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-appBorder disabled:hover:text-appTextSec"
                        >
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                            <span className="sm:inline hidden">Précédent</span>
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
                                            className={`w-8 h-8 rounded-lg text-[13px] font-semibold transition-all duration-200 ${page === p
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
                            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.75 rounded-lg border border-appBorder bg-appCard text-[12px] sm:text-[13px] font-semibold text-appTextSec transition-all duration-200 hover:border-primaryColor/40 hover:text-primaryColor disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-appBorder disabled:hover:text-appTextSec"
                        >
                            <span className="sm:inline hidden">Suivant</span>
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* New demand CTA */}
            <div className="mt-3 bg-primaryColor/6 border border-dashed border-primaryColor/20 rounded-2xl px-4 py-5 sm:px-7 sm:py-7 text-center animate-hero-fade-up">
                <h4 className="text-[15px] font-bold text-appText mb-1.5">
                    Besoin d&apos;un autre professionnel ?
                </h4>
                <p className="text-[13px] text-appTextSec mb-4.5">
                    Postez une nouvelle demande gratuitement et recevez des devis en moins de 24h.
                </p>
                <Link
                    href={getRequestAServiceRoutePath()}
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-primaryColor text-white rounded-[10px] text-sm font-bold transition-all duration-250 hover:-translate-y-px shadow-[0_4px_16px_rgba(27,79,255,0.3)] hover:shadow-[0_6px_20px_rgba(27,79,255,0.4)]"
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
