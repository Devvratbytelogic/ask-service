'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import {
    getVendorDashboardRoutePath,
    getVendorMessageRoutePath,
} from '@/routes/routes'

const DASHBOARD_PATH = getVendorDashboardRoutePath()

export const VENDOR_NAV_LINKS = [
    { label: 'Tableau de bord', shortLabel: 'Tableau', href: DASHBOARD_PATH },
    { label: 'Trouver des prospects', shortLabel: 'Prospects', href: getVendorDashboardRoutePath({ leads: 'locked' }) },
    { label: 'Mes messages', shortLabel: 'Messages', href: getVendorMessageRoutePath() },
] as const

function isNavLinkActive(href: string, pathname: string, leads: string | null) {
    const [hrefPath, hrefQuery] = href.split('?')
    const hrefLeads = new URLSearchParams(hrefQuery).get('leads')
    const pathMatches = pathname === hrefPath || pathname.startsWith(`${hrefPath}/`)

    if (!pathMatches) return false

    if (hrefPath === DASHBOARD_PATH) {
        return hrefLeads === 'locked' ? leads === 'locked' : leads !== 'locked'
    }

    return true
}

interface VendorMenuProps {
    onNavigate?: () => void
    className?: string
}

export default function VendorMenu({ onNavigate, className = '' }: VendorMenuProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const leads = searchParams.get('leads')

    return (
        <nav className={`flex min-w-0 items-center gap-0.5 ${className}`}>
            {VENDOR_NAV_LINKS.map(({ label, shortLabel, href }) => {
                const isActive = isNavLinkActive(href, pathname, leads)
                return (
                    <Link
                        key={href}
                        href={href}
                        onClick={onNavigate}
                        className={`whitespace-nowrap text-[12px] xl:text-[13px] font-medium px-2 lg:px-2.5 xl:px-3 py-1.5 rounded-lg transition-all duration-200 ${isActive
                                ? 'text-amber bg-amber/10'
                                : 'text-fontBlack/50 dark:text-appTextMuted hover:text-fontBlack dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-appCard/8'
                            }`}
                    >
                        <span className="xl:hidden">{shortLabel}</span>
                        <span className="hidden xl:inline">{label}</span>
                    </Link>
                )
            })}
        </nav>
    )
}
