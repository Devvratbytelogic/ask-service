'use client'

import { useEffect, useState } from 'react'
import {
    FiClipboard,
    FiCreditCard,
    FiSearch,
    FiUnlock,
} from 'react-icons/fi'
import DashboardStatCard from './overview/DashboardStatCard'
import OpportunityGroup from './overview/OpportunityGroup'
import OpportunitySectionHeader from './overview/OpportunitySectionHeader'
import FindLeadsCTA from './overview/FindLeadsCTA'
import VendorKycStatusAlert from './VendorKycStatusAlert'
import VendorPhoneUnverifiedAlert from './VendorPhoneUnverifiedAlert'
import VendorDashboardOverviewSkeleton from '@/components/skeletons/VendorDashboardOverviewSkeleton'
import { useGetVendorAvailableLeadsByServiceCategoryQuery, useGetVendorAvailableLeadsQuery } from '@/redux/rtkQueries/clientSideGetApis'
import { generateLeadDetailRoutePath, getCreditsRoutePath, getVendorAllQuotesRoutePath, getVendorDashboardRoutePath, getVendorLeadsListRoutePath } from '@/routes/routes'
import { useSearchParams } from 'next/navigation'

export default function VendorDashboardOverview() {
    const searchParams = useSearchParams()
    const leadsParam = searchParams.get('leads')
    // Default dashboard + explicit unlocked both show unlocked leads
    const isUnlocked = leadsParam !== 'locked'
    // Hide stat cards after clicking "Opportunités actives" (?leads=unlocked)
    const showStatCards = leadsParam !== 'unlocked'

    const [cityFilter, setCityFilter] = useState('')
    const [serviceFilter, setServiceFilter] = useState('')
    const [leadsPage, setLeadsPage] = useState(1)
    const [leadsLimit, setLeadsLimit] = useState(6)
    const [paginateServiceCategory, setPaginateServiceCategory] = useState('')
    const [isMobile, setIsMobile] = useState(false)

    const { data: response, isLoading } = useGetVendorAvailableLeadsByServiceCategoryQuery({
        service: serviceFilter || undefined,
        city: cityFilter || undefined,
        page: leadsPage || undefined,
        limit: leadsLimit || undefined,
        paginate_service: paginateServiceCategory || undefined,
        unlocked: isUnlocked,
    }, { pollingInterval: 15000 })
    const data = response?.data?.data;
    const stats = response?.data?.summary;

    // Desktop: first locked lead for sidebar detail. Mobile: list page.
    const { data: lockedLeadsResponse } = useGetVendorAvailableLeadsQuery(
        {
            page: 1,
            limit: 20,
            unlocked: false,
        },
        { skip: !showStatCards },
    )

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 1023px)')
        const update = () => setIsMobile(mq.matches)
        update()
        mq.addEventListener('change', update)
        return () => mq.removeEventListener('change', update)
    }, [])

    useEffect(() => {
        setCityFilter('')
        setServiceFilter('')
        setLeadsPage(1)
        setLeadsLimit(6)
        setPaginateServiceCategory('')
    }, [isUnlocked]);

    const totalOpportunities = data?.length ?? 0
    const displayedOpportunities = data?.length ?? 0
    const canPurchaseLeads = stats?.canPurchaseLeads ?? false;

    if (isLoading) {
        return <VendorDashboardOverviewSkeleton showStatCards={showStatCards} />
    }

    const firstLeadId = lockedLeadsResponse?.data?.items?.[0]?._id
    const availableLeadsHref = isMobile
        ? getVendorLeadsListRoutePath()
        : firstLeadId
            ? generateLeadDetailRoutePath(firstLeadId)
            : getVendorDashboardRoutePath({ leads: 'locked' })

    return (
        <div className="page_container">
            {/* Page header */}
            <div className="mb-7 animate-hero-fade-up">
                <h1 className="text-[26px] font-extrabold tracking-[-0.5px] text-appText mb-1">
                    Tableau de bord <span className="text-amber">prestataire</span>
                </h1>
                <p className="text-[14px] text-appTextSec flex items-center gap-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-appBorder">
                    Bon retour · Gérez vos opportunités et suivez vos devis
                </p>
            </div>

            <VendorPhoneUnverifiedAlert />

            <VendorKycStatusAlert
                kycStatus={stats?.kyc_status}
                canPurchaseLeads={stats?.canPurchaseLeads}
            />

            {/* Hidden after clicking "Opportunités actives" (?leads=unlocked) */}
            {showStatCards && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
                    <DashboardStatCard icon={<FiUnlock className="text-trust-green" />} iconBg="rgba(16,185,129,0.15)" value={stats?.purchasedLeadsCount ?? 0} label="Opportunités actives" linkText="Voir mes opportunités actives" linkColor="text-[#6EE7B7]" href={getVendorDashboardRoutePath({ leads: 'unlocked' })} highlight={isUnlocked} />
                    <DashboardStatCard icon={<FiSearch className="text-primaryColor" />} iconBg="rgba(27,79,255,0.15)" value={stats?.availableLeadsCount ?? 0} label="Prospects disponibles" linkText="Voir les prospects disponibles" linkColor="text-[#93C5FD]" href={availableLeadsHref} highlight={!isUnlocked} highlightColor="blue" />
                    <DashboardStatCard icon={<FiCreditCard className="text-amber" />} iconBg="rgba(245,158,11,0.15)" value={stats?.creditBalance ?? 0} label="Solde de crédits" linkText="Acheter des crédits" linkColor="text-amber" href={getCreditsRoutePath()} />
                    <DashboardStatCard icon={<FiClipboard className="text-[#8B5CF6]" />} iconBg="rgba(139,92,246,0.15)" value={stats?.quotesSentCount ?? 0} label="Devis envoyés" linkText="Voir en cours, gagnés…" linkColor="text-[#C4B5FD]" href={getVendorAllQuotesRoutePath()} />
                </div>
            )}

            {/* Section header + filters */}
            <OpportunitySectionHeader
                totalOpportunities={totalOpportunities}
                displayedOpportunities={displayedOpportunities}
                cityFilter={cityFilter}
                serviceFilter={serviceFilter}
                onCityChange={setCityFilter}
                onServiceChange={setServiceFilter}
            />

            {/* Opportunity groups */}
            <>
                {data && data?.length > 0 ? (data?.map((item, index) => (
                    <OpportunityGroup
                        key={index}
                        item={item}
                        setLeadsPage={setLeadsPage}
                        setLeadsLimit={setLeadsLimit}
                        setPaginateServiceCategory={setPaginateServiceCategory}
                        canPurchaseLeads={canPurchaseLeads}
                    />
                ))
                ) : (
                    <div className="bg-appSurface border border-appBorder rounded-2xl p-8 text-center mb-4">
                        <div className="text-[32px] mb-3 flex justify-center text-appTextMuted">
                            {isUnlocked ? <FiUnlock className="size-8" aria-hidden /> : <FiSearch className="size-8" aria-hidden />}
                        </div>
                        <p className="text-[14px] text-appTextSec">{isUnlocked ? 'Aucune opportunité active pour ce filtre.' : 'Aucun prospect disponible pour ce filtre.'}</p>
                    </div>
                )}
            </>

            {/* Find new leads CTA */}
            {isUnlocked ? <FindLeadsCTA availableLeadsCount={stats?.availableLeadsCount ?? 0} href={availableLeadsHref} /> : null}
        </div>
    )
}
