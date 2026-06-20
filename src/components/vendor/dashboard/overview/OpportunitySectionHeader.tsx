'use client'

import {
    ArrowSendIconSVG,
    CheckmarkIconSVG,
    LightningBoltIconSVG,
} from '@/components/library/AllSVG'
import { CHEVRON_DOWN_SVG, CITY_OPTIONS, SERVICE_OPTIONS } from './data'

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
    return (
        <div className="flex items-center justify-between flex-wrap gap-3 mb-[18px] animate-hero-fade-up">
            <div className="flex items-center gap-2.5 flex-wrap">
                <p className="text-[18px] font-extrabold text-white tracking-[-0.3px]">
                    Mes opportunités actives
                </p>
                <div className="flex gap-1.5 flex-wrap">
                    <span className="flex items-center gap-[5px] text-[11px] font-semibold px-2.5 py-1 rounded-full border text-[#FDBA74] bg-orange-500/10 border-orange-500/20">
                        <LightningBoltIconSVG size={10} />
                        {totalOpportunities} opportunités actives
                    </span>
                    <span className="flex items-center gap-[5px] text-[11px] font-semibold px-2.5 py-1 rounded-full border text-[#93C5FD] bg-primaryColor/10 border-primaryColor/20">
                        <ArrowSendIconSVG size={10} />
                        6 devis envoyés
                    </span>
                    <span className="flex items-center gap-[5px] text-[11px] font-semibold px-2.5 py-1 rounded-full border text-[#6EE7B7] bg-trust-green/10 border-trust-green/20">
                        <CheckmarkIconSVG />
                        3 clients gagnés
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                <select
                    value={cityFilter}
                    onChange={(e) => onCityChange(e.target.value)}
                    className="py-[7px] pl-2.5 pr-7 bg-white/5 border border-white/10 rounded-[8px] text-[12px] text-white/60 outline-none cursor-pointer transition-all duration-200 focus:border-amber appearance-none"
                    style={{
                        backgroundImage: CHEVRON_DOWN_SVG,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 8px center',
                    }}
                >
                    {CITY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} style={{ background: '#1E293B' }}>
                            {opt}
                        </option>
                    ))}
                </select>

                <select
                    value={serviceFilter}
                    onChange={(e) => onServiceChange(e.target.value)}
                    className="py-[7px] pl-2.5 pr-7 bg-white/5 border border-white/10 rounded-[8px] text-[12px] text-white/60 outline-none cursor-pointer transition-all duration-200 focus:border-amber appearance-none"
                    style={{
                        backgroundImage: CHEVRON_DOWN_SVG,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 8px center',
                    }}
                >
                    {SERVICE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} style={{ background: '#1E293B' }}>
                            {opt}
                        </option>
                    ))}
                </select>

                <span className="text-[11px] text-white/25 whitespace-nowrap">
                    1–{displayedOpportunities} sur {totalOpportunities} opportunités
                </span>
            </div>
        </div>
    )
}
