'use client'

import { useState } from 'react'
import DashboardStatCard from './overview/DashboardStatCard'
import OpportunityGroup from './overview/OpportunityGroup'
import OpportunitySectionHeader from './overview/OpportunitySectionHeader'
import FindLeadsCTA from './overview/FindLeadsCTA'
import VendorDashboardOverviewSkeleton from '@/components/skeletons/VendorDashboardOverviewSkeleton'
import { useGetVendorAvailableLeadsByServiceCategoryQuery } from '@/redux/rtkQueries/clientSideGetApis'

export default function VendorDashboardOverview() {
    const [cityFilter, setCityFilter] = useState('')
    const [serviceFilter, setServiceFilter] = useState('')
    const [leadsPage, setLeadsPage] = useState(1)
    const [leadsLimit, setLeadsLimit] = useState(6)
    const [paginateServiceCategory, setPaginateServiceCategory] = useState('')

    const { data: response, isLoading, isFetching } = useGetVendorAvailableLeadsByServiceCategoryQuery({
        service: serviceFilter || undefined,
        city: cityFilter || undefined,
        page: leadsPage || undefined,
        limit: leadsLimit || undefined,
        paginate_service: paginateServiceCategory || undefined,
    })
    const data = response?.data?.data;
    const stats = response?.data?.summary;

    const totalOpportunities = data?.length ?? 0
    const displayedOpportunities = data?.length ?? 0

    if (isLoading || isFetching) {
        return <VendorDashboardOverviewSkeleton />
    }

    return (
        <div className="max-w-[1400px] mx-auto px-7 py-7">
            {/* Page header */}
            <div className="mb-7 animate-hero-fade-up">
                <h1 className="text-[26px] font-extrabold tracking-[-0.5px] text-appText mb-1">
                    Tableau de bord <span className="text-amber">prestataire</span>
                </h1>
                <p className="text-[14px] text-appTextSec flex items-center gap-1.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-appBorder">
                    Bon retour · Gérez vos opportunités et suivez vos devis
                </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
                <DashboardStatCard icon="🔓" iconBg="rgba(16,185,129,0.15)" value={stats?.availableLeadsCount ?? 0} label="Opportunités actives" linkText="Voir mes opportunités actives" linkColor="text-[#6EE7B7]" href={`#`} highlight={true} />
                <DashboardStatCard icon="🔍" iconBg="rgba(27,79,255,0.15)" value={stats?.purchasedLeadsCount ?? 0} label="Prospects disponibles" linkText="Voir les prospects disponibles" linkColor="text-[#93C5FD]" href={`#`} />
                <DashboardStatCard icon="🪙" iconBg="rgba(245,158,11,0.15)" value={stats?.creditBalance ?? 0} label="Solde de crédits" linkText="Acheter des crédits" linkColor="text-amber" href={`#`} />
                <DashboardStatCard icon="📋" iconBg="rgba(139,92,246,0.15)" value={stats?.quotesSentCount ?? 0} label="Devis envoyés" linkText="Voir en cours, gagnés…" linkColor="text-[#C4B5FD]" href={`#`} />
            </div>

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
                    />
                ))
                ) : (
                    <div className="bg-appSurface border border-appBorder rounded-2xl p-8 text-center mb-4">
                        <div className="text-[32px] mb-3">🔍</div>
                        <p className="text-[14px] text-appTextSec">Aucune opportunité pour ce filtre.</p>
                    </div>
                )}
            </>

            {/* Find new leads CTA */}
            <FindLeadsCTA />
        </div>
    )
}
