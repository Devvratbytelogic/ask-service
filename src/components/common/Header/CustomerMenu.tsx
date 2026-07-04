'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getClientDashboardPageRoutePath, getMessageRoutePath, getRequestAServiceRoutePath } from '@/routes/routes'

export const CUSTOMER_NAV_LINKS = [
    { label: 'Mes demandes', shortLabel: 'Demandes', href: getClientDashboardPageRoutePath() },
    { label: 'Nouvelle demande', shortLabel: 'Nouvelle', href: getRequestAServiceRoutePath() },
    { label: 'Mes messages', shortLabel: 'Messages', href: getMessageRoutePath() },
] as const

interface CustomerMenuProps {
    onNavigate?: () => void
    className?: string
}

export default function CustomerMenu({ onNavigate, className = '' }: CustomerMenuProps) {
    const pathname = usePathname()

    return (
        <nav className={`flex min-w-0 items-center gap-0.5 ${className}`}>
            {CUSTOMER_NAV_LINKS.map(({ label, shortLabel, href }) => {
                const isActive = pathname === href || pathname.startsWith(href + '/')
                return (
                    <Link
                        key={href}
                        href={href}
                        onClick={onNavigate}
                        className={`whitespace-nowrap text-[12px] xl:text-[13px] font-medium px-2 lg:px-2.5 xl:px-3 py-1.5 rounded-lg transition-all duration-200 ${isActive
                            ? 'text-primaryColor bg-primaryColor/10'
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
