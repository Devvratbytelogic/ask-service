'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    getVendorDashboardRoutePath,
    getVendorLeadsRoutePath,
    getVendorMessageRoutePath,
} from '@/routes/routes'

const NAV_LINKS = [
    { label: 'Tableau de bord', href: getVendorDashboardRoutePath() },
    { label: 'Trouver des prospects', href: getVendorLeadsRoutePath() },
    { label: 'Mes messages', href: getVendorMessageRoutePath() },
] as const

export default function VendorMenu() {
    const pathname = usePathname()

    return (
        <nav className="absolute left-1/2 -translate-x-1/2 flex gap-0.5">
            {NAV_LINKS.map(({ label, href }) => {
                const isActive = pathname === href || pathname.startsWith(href + '/')
                return (
                    <Link
                        key={href}
                        href={href}
                        className={`text-[13px] font-medium px-3 py-1.5 rounded-lg transition-all duration-200 ${
                            isActive
                                ? 'text-amber bg-amber/10'
                                : 'text-fontBlack/50 dark:text-slate-400 hover:text-fontBlack dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-white/8'
                        }`}
                    >
                        {label}
                    </Link>
                )
            })}
        </nav>
    )
}
