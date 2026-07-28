'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useGetVendorAvailableLeadsByServiceCategoryQuery } from '@/redux/rtkQueries/clientSideGetApis'
import {
    generateLeadDetailRoutePath,
    getVendorDashboardRoutePath,
    getVendorMessageRoutePath,
} from '@/routes/routes'

const DASHBOARD_PATH = getVendorDashboardRoutePath()

interface VendorMenuProps {
    onNavigate?: () => void
    className?: string
    /** `row` = desktop nav, `stack` = mobile menu */
    layout?: 'row' | 'stack'
}

export default function VendorMenu({ onNavigate, className = '', layout = 'row' }: VendorMenuProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const leadsFilter = searchParams.get('leads')

    // Same query as the "Prospects disponibles" dashboard card
    const { data: response } = useGetVendorAvailableLeadsByServiceCategoryQuery({
        page: 1,
        limit: 6,
        unlocked: false,
    })

    const firstLeadId = response?.data?.data
        ?.flatMap((group) => group.leads ?? [])
        .find((lead) => lead._id)?._id

    // Same href as DashboardStatCard: open the first available lead
    const prospectsHref = firstLeadId
        ? generateLeadDetailRoutePath(firstLeadId)
        : getVendorDashboardRoutePath({ leads: 'locked' })

    const links = [
        { label: 'Tableau de bord', shortLabel: 'Tableau', href: DASHBOARD_PATH },
        { label: 'Trouver des prospects', shortLabel: 'Prospects', href: prospectsHref },
        { label: 'Mes messages', shortLabel: 'Messages', href: getVendorMessageRoutePath() },
    ]

    const isOnLeadPage = pathname.startsWith(`${DASHBOARD_PATH}/lead/`)
    const isStack = layout === 'stack'

    return (
        <nav className={`${isStack ? 'flex flex-col' : 'flex min-w-0 items-center gap-0.5'} ${className}`}>
            {links.map(({ label, shortLabel, href }) => {
                let isActive = false
                if (label === 'Trouver des prospects') {
                    // Highlight on lead detail page, or locked leads list (fallback)
                    isActive = isOnLeadPage || leadsFilter === 'locked'
                } else if (label === 'Tableau de bord') {
                    isActive = pathname === DASHBOARD_PATH && leadsFilter !== 'locked'
                } else {
                    isActive = pathname === href || pathname.startsWith(`${href}/`)
                }

                const activeClass = isActive
                    ? 'text-amber bg-amber/10'
                    : isStack
                        ? 'text-appText hover:bg-appOverlay-5'
                        : 'text-fontBlack/50 dark:text-appTextMuted hover:text-fontBlack dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-appCard/8'

                return (
                    <Link
                        key={label}
                        href={href}
                        onClick={onNavigate}
                        className={
                            isStack
                                ? `flex items-center w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeClass}`
                                : `whitespace-nowrap text-[12px] xl:text-[13px] font-medium px-2 lg:px-2.5 xl:px-3 py-1.5 rounded-lg transition-all duration-200 ${activeClass}`
                        }
                    >
                        {isStack ? (
                            label
                        ) : (
                            <>
                                <span className="xl:hidden">{shortLabel}</span>
                                <span className="hidden xl:inline">{label}</span>
                            </>
                        )}
                    </Link>
                )
            })}
        </nav>
    )
}
