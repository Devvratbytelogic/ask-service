'use client'

import Link from 'next/link'
import { FaCoins, FaStar } from 'react-icons/fa6'
import { ArrowLeftIconSVG } from '@/components/library/AllSVG'
import { getVendorLeadsListRoutePath } from '@/routes/routes'
import LeadStatusBadge from './LeadStatusBadge'

interface Props {
    title: string
    credits?: number
    stars?: number
    starsLabel?: string
    isNewToday?: boolean
}

export default function LeadMobileHeader({
    title,
    credits,
    stars,
    starsLabel,
    isNewToday,
}: Props) {
    return (
        <header className="lg:hidden sticky top-17 z-40 border-b border-appBorder bg-appSurface">
            <div className="px-4 py-3 flex items-center gap-3">
                <Link
                    href={getVendorLeadsListRoutePath()}
                    className="w-9 h-9 rounded-xl border border-appBorder bg-appCard flex items-center justify-center text-appText shrink-0 transition-colors active:scale-[0.97] hover:border-primaryColor/30"
                    aria-label="Retour aux prospects"
                >
                    <ArrowLeftIconSVG size={15} />
                </Link>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.8px] text-appTextMuted">
                            Prospect
                        </p>
                        {isNewToday && <LeadStatusBadge status="new" label="NEW" />}
                    </div>
                    <h1 className="text-[15px] font-extrabold text-appText tracking-[-0.2px] truncate leading-tight">
                        {title || '—'}
                    </h1>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                    {typeof credits === 'number' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber bg-amber/12 border border-amber/20 px-2 py-0.75 rounded-full">
                            <FaCoins className="size-3" aria-hidden />
                            {credits}
                        </span>
                    )}
                    {(stars != null || starsLabel) && (
                        <span className="inline-flex items-center gap-0.75 text-[10px] font-bold text-amber">
                            <FaStar className="size-2.5" aria-hidden />
                            {starsLabel ?? `${stars}/5`}
                        </span>
                    )}
                </div>
            </div>
        </header>
    )
}
