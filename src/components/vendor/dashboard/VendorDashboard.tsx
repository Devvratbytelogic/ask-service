'use client'

import { CheckGreenIconSVG, CreditCardIconSVG, DocumentArrowIconSVG, DocumentIconSVG, EnvelopeIconSVG, InfoBlueIconSVG, InfoSVG, LocationSVG, LockGreenIconSVG, LockOpenGreenIconSVG, LockPrimaryColorSVG, LockUnlockedIconSVG, ProfileIconSVG, SecurityIconSVG, SignOutIconSVG, TimeIconSVG } from '@/components/library/AllSVG'
import { generateLeadDetailRoutePath, getCreditsRoutePath, getVendorAllQuotesRoutePath, getVendorDashboardRoutePath } from '@/routes/routes'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tooltip } from '@heroui/react'
import { useDispatch } from 'react-redux'
import { openModal } from '@/redux/slices/allModalSlice'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import moment from 'moment'
import { MdKeyboardArrowDown } from 'react-icons/md'
import SupportAlert from './SupportAlert'
import { useGetVendorAvailableLeadsQuery } from '@/redux/rtkQueries/clientSideGetApis'
import { useGetVendorDashboardDataQuery } from '@/redux/rtkQueries/clientSideGetApis'

export default function VendorDashboard() {
    const dispatch = useDispatch()
    const router = useRouter()
    const [locationFilter, setLocationFilter] = useState('all')
    const [sortFilter, setSortFilter] = useState('newest')

    const { data: dashboardData, isLoading: dashboardLoading } = useGetVendorDashboardDataQuery()
    const dashboard = dashboardData?.data;

    const leadsParams = useMemo(
        () => ({
            location: locationFilter !== 'all' ? locationFilter : undefined,
            sort: sortFilter,
        }),
        [locationFilter, sortFilter],
    )
    const searchParams = useSearchParams()
    const showPurchasedOnly = searchParams.get('leads') === 'purchased'
    const showQuotedOnly = searchParams.get('leads') === 'quoted'
    const showLockedOnly = searchParams.get('leads') === 'available'
    const isActiveAvailable = !showLockedOnly && !showPurchasedOnly && !showQuotedOnly
    const isActiveLocked = showLockedOnly
    const isActivePurchased = showPurchasedOnly
    const { data: leadsData, isLoading: leadsLoading } = useGetVendorAvailableLeadsQuery({
        ...leadsParams,
        ...(showQuotedOnly && { quoted: true }),
    })
    const allLeads = leadsData?.data ?? []
    const leads = useMemo(
        () => {
            if (showQuotedOnly) return allLeads
            if (showPurchasedOnly) return allLeads.filter((l) => l?.unlocked)
            if (showLockedOnly) return allLeads.filter((l) => !l?.unlocked)
            return allLeads
        },
        [showPurchasedOnly, showQuotedOnly, showLockedOnly, allLeads],
    )
    const isLoading = dashboardLoading || leadsLoading

    const handleUnlockLeadClick = (lead: { _id: string; creditsToUnlock?: number }) => {
        dispatch(openModal({
            componentName: 'UnlockLeadConfirmModal',
            data: { leadId: lead._id, creditsToUnlock: lead.creditsToUnlock },
            modalSize: 'sm',
        }))
    }

    const locationOptions = [
        { key: 'all', label: 'Toutes les villes' },
        { key: 'london', label: 'London' },
        { key: 'manchester', label: 'Manchester' },
    ]

    const sortOptions = [
        { key: 'newest', label: 'Les plus récents' },
        { key: 'oldest', label: 'Les plus anciens' },
        { key: 'credits', label: 'Points (du plus bas au plus élevé)' },
    ]

    return (
        <>
            <div className="space-y-8">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        href={getVendorDashboardRoutePath()}
                        className={`block rounded-2xl border p-5 transition-colors cursor-pointer ${isActiveAvailable ? 'border-primaryColor bg-primaryColor/10' : 'border-borderDark bg-white hover:border-primaryColor/30 hover:bg-primaryColor/5'}`}
                    >
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#E8F4FD] mb-3">
                            <DocumentIconSVG className="size-5 text-primaryColor" />
                        </div>
                        <p className="text-2xl font-bold text-fontBlack">
                            {isLoading ? '—' : dashboard?.availableLeadsCount ?? 0}
                        </p>
                        <p className="text-sm text-darkSilver mt-0.5">Prospects Disponibles</p>
                    </Link>

                    <Link
                        href={getVendorDashboardRoutePath({ leads: 'available' })}
                        className={`block rounded-2xl border p-5 transition-colors cursor-pointer ${isActiveLocked ? 'border-primaryColor bg-primaryColor/10' : 'border-borderDark bg-white hover:border-primaryColor/30 hover:bg-primaryColor/5'}`}
                    >
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#E8F4FD] mb-3">
                            <LockPrimaryColorSVG className="size-5 text-primaryColor" />
                        </div>
                        <p className="text-2xl font-bold text-fontBlack">
                            {isLoading ? '—' : Math.max(0, (dashboard?.availableLeadsCount ?? 0) - (dashboard?.purchasedLeadsCount ?? 0))}
                        </p>
                        <p className="text-sm text-darkSilver mt-0.5">Prospects verrouillés</p>
                        <span className="inline-block mt-2 text-sm font-medium text-primaryColor">
                            Voir les prospects verrouillés →
                        </span>
                    </Link>

                    <Link
                        href={getVendorDashboardRoutePath({ leads: 'purchased' })}
                        className={`block rounded-2xl border p-5 transition-colors cursor-pointer ${isActivePurchased ? 'border-[#4CAF50] bg-[#4CAF50]/10' : 'border-borderDark bg-white hover:border-[#4CAF50]/30 hover:bg-[#4CAF50]/5'}`}
                    >
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#E8F5E9] mb-3">
                            <LockOpenGreenIconSVG className="size-5 text-[#4CAF50]" />
                        </div>
                        <p className="text-2xl font-bold text-fontBlack">
                            {isLoading ? '—' : dashboard?.purchasedLeadsCount ?? 0}
                        </p>
                        <p className="text-sm text-darkSilver mt-0.5">Mes Prospects</p>
                        <span className="inline-block mt-2 text-sm font-medium text-[#4CAF50]">
                            Voir les prospects →
                        </span>
                    </Link>

                    <Link href={getCreditsRoutePath()} className="block rounded-2xl border border-borderDark p-5 transition-colors hover:border-[#E17100]/30 hover:bg-[#FFF8F0] cursor-pointer">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#FFE4CC] mb-3">
                            <CreditCardIconSVG className="size-5 text-[#E17100]" />
                        </div>
                        <p className="text-2xl font-bold text-fontBlack">
                            {isLoading ? '—' : `${dashboard?.creditBalance ?? 0} points`}
                        </p>
                        <p className="text-sm text-darkSilver mt-0.5">Solde de points</p>
                        <span className="inline-block mt-2 text-sm font-medium text-[#E17100]">
                            Acheter des points →
                        </span>
                    </Link>

                    <Link href={getVendorAllQuotesRoutePath()} className="block rounded-2xl border border-borderDark bg-white p-5 transition-colors hover:border-[#9C27B0]/30 hover:bg-[#9C27B0]/5 cursor-pointer">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#F3E5F5] mb-3">
                            <DocumentArrowIconSVG className="size-5 text-[#9C27B0]" />
                        </div>
                        <p className="text-2xl font-bold text-fontBlack">
                            {isLoading ? '—' : dashboard?.quotesSentCount ?? 0}
                        </p>
                        <p className="text-sm text-darkSilver mt-0.5">Devis envoyés</p>
                        <span className="inline-block mt-2 text-sm font-medium text-[#9C27B0]">
                            Voir tout →
                        </span>
                    </Link>
                </div>

                {/* Available Leads / My Leads / Quotes Sent Section */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div>
                            <h2 className="header_text_md text-fontBlack">
                                {showQuotedOnly ? 'Devis envoyés' : showPurchasedOnly ? 'Mes Prospects' : showLockedOnly ? 'Prospects verrouillés' : 'Prospects Disponibles'}
                            </h2>
                            <p className="text-sm text-darkSilver mt-1">
                                {showQuotedOnly
                                    ? `${leads.length} prospect${leads.length !== 1 ? 's' : ''} avec devis • Voir les détails ci-dessous`
                                    : showPurchasedOnly
                                        ? `${leads.length} prospect${leads.length !== 1 ? 's' : ''} acheté(s) • Voir les détails ci-dessous`
                                        : showLockedOnly
                                            ? `${leads.length} prospect${leads.length !== 1 ? 's' : ''} verrouillé(s) • Débloquez pour voir tous les détails`
                                            : `${allLeads.length} prospect${allLeads.length !== 1 ? 's' : ''} disponibles • Débloquez pour voir tous les détails`}
                                {(showPurchasedOnly || showQuotedOnly || showLockedOnly) && (
                                    <>
                                        {' • '}
                                        <Link href={getVendorDashboardRoutePath()} className="text-primaryColor hover:underline font-medium">
                                            Voir les prospects disponibles
                                        </Link>
                                    </>
                                )}
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-end items-center gap-3">
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        className="btn_radius capitalize text-sm bg-white! border border-borderDark h-10 min-w-35 shadow-none"
                                        endContent={<MdKeyboardArrowDown className="text-lg text-fontBlack" />}
                                    >
                                        {locationOptions.find((o) => o.key === locationFilter)?.label ?? 'Toutes les villes'}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Location filter"
                                    items={locationOptions}
                                    selectedKeys={[locationFilter]}
                                    selectionMode="single"
                                    onSelectionChange={(keys) => {
                                        const key = Array.from(keys as Set<string>)[0]
                                        if (key) setLocationFilter(key)
                                    }}
                                >
                                    {(item) => <DropdownItem key={item.key}>{item.label}</DropdownItem>}
                                </DropdownMenu>
                            </Dropdown>
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        className="btn_radius capitalize text-sm bg-white! border border-borderDark h-10 min-w-35 shadow-none"
                                        endContent={<MdKeyboardArrowDown className="text-lg text-fontBlack" />}
                                    >
                                        {sortOptions.find((o) => o.key === sortFilter)?.label ?? 'Les plus récents'}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Sort filter"
                                    items={sortOptions}
                                    selectedKeys={[sortFilter]}
                                    selectionMode="single"
                                    onSelectionChange={(keys) => {
                                        const key = Array.from(keys as Set<string>)[0]
                                        if (key) setSortFilter(key)
                                    }}
                                >
                                    {(item) => <DropdownItem key={item.key}>{item.label}</DropdownItem>}
                                </DropdownMenu>
                            </Dropdown>
                            <span className="text-sm text-darkSilver">{leads.length} prospect{leads.length !== 1 ? 's' : ''} affiché{leads.length !== 1 ? 's' : ''}</span>
                        </div>
                    </div>

                    {/* Lead Cards */}
                    <div className="flex flex-col gap-4">
                        {(showPurchasedOnly || showQuotedOnly || showLockedOnly) && leads.length === 0 && (
                            <div className="rounded-2xl border border-borderDark bg-white p-8 text-center">
                                <p className="text-darkSilver">
                                    {showQuotedOnly
                                        ? "Vous n'avez pas encore envoyé de devis. Débloquez des prospects et envoyez des devis pour les voir ici."
                                        : showLockedOnly
                                            ? "Aucun prospect verrouillé pour le moment. Les prospects disponibles apparaîtront ici."
                                            : "Vous n'avez pas encore de prospects. Débloquez des prospects dans la liste pour voir leurs détails."}
                                </p>
                                <Link href={getVendorDashboardRoutePath()} className="inline-block mt-3 text-sm font-medium text-[#4CAF50] hover:underline">
                                    Voir les prospects disponibles →
                                </Link>
                            </div>
                        )}
                        {leads && leads?.length > 0 && leads?.map((lead, index) => (
                            <div
                                key={index}
                                className="rounded-2xl border border-borderDark bg-white p-6 flex flex-col lg:flex-row lg:items-start gap-4"
                            >
                                <Link
                                    href={generateLeadDetailRoutePath(lead?._id)}
                                    className="flex-1 min-w-0 space-y-3 cursor-pointer hover:opacity-90 transition-opacity block"
                                >
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-bold text-lg text-fontBlack">
                                                {lead.service_category.title}
                                            </h3>
                                            <span className="inline-flex items-center rounded-full bg-[#E8F4FD] border border-primary px-2.5 py-0.5 text-xs font-medium text-primaryColor">
                                                {/* {lead.businessType} */}
                                                {lead?.contact_details?.client_type === 'Individual' ? 'B2C' : 'B2B'}
                                            </span>

                                            {lead?.unlocked && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F5E9] px-2.5 py-0.5 text-xs font-medium text-[#4CAF50]">
                                                    <LockUnlockedIconSVG className="size-3.5 text-[#4CAF50]" />
                                                    Débloqué
                                                </span>
                                            )}
                                            <div className="flex items-center gap-2 text-sm text-darkSilver">
                                                <span>{lead?.quotes_count}/5 professionnel{lead?.quotes_count !== 1 ? 's ont' : ' a'} répondu</span>
                                                {!lead?.unlocked && (
                                                    <Tooltip content="This request will stay open for 7 days. After that, it will close automatically.">
                                                        <span className="inline-flex cursor-help"><InfoSVG /></span>
                                                    </Tooltip>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-sm text-darkSilver">
                                            <span className="flex items-center gap-1.5">
                                                <LocationSVG />
                                                {lead.country}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <TimeIconSVG />
                                                Posted {moment(lead.createdAt).fromNow()}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-sm">
                                            {/* {lead?.unlocked ? (
                                                <> */}
                                            <span className="flex items-center gap-1.5 text-fontBlack">
                                                <CheckGreenIconSVG />
                                                {lead?.contact_details?.phone}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-fontBlack">
                                                <EnvelopeIconSVG />
                                                {lead?.contact_details?.email}
                                            </span>
                                            {/* </>
                                            ) : (
                                                <>
                                                    <span className="flex items-center gap-1.5 text-fontBlack">
                                                        <CheckGreenIconSVG />
                                                        {lead?.contact_details?.phone}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-fontBlack">
                                                        <EnvelopeIconSVG />
                                                        {lead?.contact_details?.email}
                                                    </span>
                                                </>
                                            )} */}
                                        </div>
                                        <p className="text-sm text-darkSilver leading-relaxed">
                                            {lead.note}
                                        </p>
                                </Link>
                                <div className="flex flex-col items-start lg:items-end shrink-0 gap-2">
                                    {lead?.unlocked ? (
                                        <>
                                            <Button
                                                className="btn_radius font-medium bg-[#4CAF50] text-white hover:bg-[#45a049]"
                                                onPress={() => router.push(generateLeadDetailRoutePath(lead?._id))}
                                            >
                                                Voir les détails
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-right">
                                                <p className="font-bold text-fontBlack">
                                                    {lead?.creditsToUnlock} Points
                                                </p>
                                                <p className="text-xs text-darkSilver">pour débloquer</p>
                                            </div>
                                            <Button
                                                className="btn_radius btn_bg_blue font-medium disabled:opacity-60 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                                startContent={<LockPrimaryColorSVG className="size-4 text-white" />}
                                                disabled={!dashboard?.canPurchaseLeads}
                                                onPress={() => handleUnlockLeadClick(lead)}
                                            >
                                                Débloquer le prospect
                                            </Button>
                                            <p className="text-xs text-darkSilver">
                                                Détails complets après déblocage
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Support Banner */}
                <SupportAlert title="Besoin d'aide ?" content="Contactez l'assistance prestataire pour toute question sur les prospects, les devis ou votre compte." />
            </div>
        </>
    )
}
