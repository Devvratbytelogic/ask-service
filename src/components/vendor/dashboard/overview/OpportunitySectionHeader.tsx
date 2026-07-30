'use client'

import ReactSelect from 'react-select'
import { LightningBoltIconSVG, } from '@/components/library/AllSVG'
import { buildDashboardFilterSelectStyles, type FilterOption } from '@/components/pages/ClientDashboardPage/selectStyles'
import { useGetAllServiceRequestCitiesQuery, useGetServiceCategoriesQuery, } from '@/redux/rtkQueries/clientSideGetApis'

interface OpportunitySectionHeaderProps {
    totalOpportunities: number
    displayedOpportunities: number
    cityFilter: string
    serviceFilter: string
    onCityChange: (value: string) => void
    onServiceChange: (value: string) => void
}

export default function OpportunitySectionHeader({
    totalOpportunities,
    displayedOpportunities,
    cityFilter,
    serviceFilter,
    onCityChange,
    onServiceChange,
}: OpportunitySectionHeaderProps) {
    const { data: serviceCategoriesData } = useGetServiceCategoriesQuery()
    const { data: allServiceRequestCitiesData } = useGetAllServiceRequestCitiesQuery()

    const serviceOptions = [
        { value: '', label: 'Tous les services' },
        ...(serviceCategoriesData?.data ?? []).map((cat) => ({
            value: cat._id,
            label: cat.title,
        })),
    ]

    const cityOptions = [
        { value: '', label: 'Toutes les villes' },
        ...(allServiceRequestCitiesData?.data?.cities ?? []).map((city) => ({
            value: city,
            label: city
        })),
    ]

    const selectedServiceOption = serviceOptions.find((o) => o.value === serviceFilter) ?? serviceOptions[0]
    const selectedCityOption = cityOptions.find((o) => o.value === cityFilter) ?? cityOptions[0]

    return (
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4.5 animate-hero-fade-up">
            <div className="flex items-center gap-2.5 flex-wrap">
                <p className="text-2xl font-extrabold text-appText tracking-[-0.3px]">
                    Mes opportunités actives
                </p>
                {/* <div className="flex gap-1.5 flex-wrap">
                    <span className="flex items-center gap-[5px] text-[11px] font-semibold px-2.5 py-1 rounded-full border text-[#FDBA74] bg-orange-500/10 border-orange-500/20">
                        <LightningBoltIconSVG size={10} /> {totalOpportunities} opportunités actives
                    </span>
                </div> */}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                {/* <ReactSelect
                    instanceId="vendor-overview-service-filter"
                    options={serviceOptions}
                    value={selectedServiceOption}
                    onChange={(opt) => onServiceChange(opt?.value ?? 'Tous services')}
                    isSearchable={false}
                    styles={buildDashboardFilterSelectStyles()}
                    menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                    menuPosition="fixed"
                /> */}

                <ReactSelect
                    instanceId="vendor-overview-city-filter"
                    options={cityOptions}
                    value={selectedCityOption}
                    onChange={(opt) => onCityChange(opt?.value ?? 'Toutes les villes')}
                    isSearchable
                    placeholder="Toutes les villes"
                    noOptionsMessage={() => 'Aucune ville'}
                    styles={buildDashboardFilterSelectStyles()}
                    menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                    menuPosition="fixed"
                />

                <span className="text-[11px] text-appTextMuted whitespace-nowrap">
                    1–{displayedOpportunities} sur {totalOpportunities} opportunités
                </span>
            </div>
        </div>
    )
}
