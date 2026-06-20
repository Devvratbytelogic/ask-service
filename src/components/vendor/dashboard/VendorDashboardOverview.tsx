'use client'

import { useState, useMemo } from 'react'
import { OPPORTUNITY_GROUPS, STATS } from './overview/data'
import DashboardStatCard from './overview/DashboardStatCard'
import OpportunityGroup from './overview/OpportunityGroup'
import OpportunitySectionHeader from './overview/OpportunitySectionHeader'
import FindLeadsCTA from './overview/FindLeadsCTA'

export default function VendorDashboardOverview() {
    const [cityFilter, setCityFilter] = useState('Toutes les villes')
    const [serviceFilter, setServiceFilter] = useState('Tous services')

    const filteredGroups = useMemo(() => {
        if (serviceFilter === 'Tous services') return OPPORTUNITY_GROUPS
        return OPPORTUNITY_GROUPS.filter((g) =>
            g.serviceName.toLowerCase().includes(serviceFilter.toLowerCase()),
        )
    }, [serviceFilter])

    const totalOpportunities = OPPORTUNITY_GROUPS.reduce((sum, g) => sum + g.cards.length, 0)
    const displayedOpportunities = filteredGroups.reduce((sum, g) => sum + g.cards.length, 0)

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
                {STATS.map((stat) => (
                    <DashboardStatCard key={stat.label} {...stat} />
                ))}
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
            <div>
                {filteredGroups.length > 0 ? (
                    filteredGroups.map((group) => (
                        <OpportunityGroup key={group.id} group={group} />
                    ))
                ) : (
                    <div className="bg-appSurface border border-appBorder rounded-2xl p-8 text-center mb-4">
                        <div className="text-[32px] mb-3">🔍</div>
                        <p className="text-[14px] text-appTextSec">Aucune opportunité pour ce filtre.</p>
                    </div>
                )}
            </div>

            {/* Find new leads CTA */}
            <FindLeadsCTA />
        </div>
    )
}
