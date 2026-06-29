'use client'

import Link from 'next/link'
import { getVendorWalletRoutePath } from '@/routes/routes'
import NotificationsPopover from './NotificationsPopover'
import ThemeToggle from '@/components/common/ThemeToggle'
import AccountMenuDropdown from './AccountMenuDropdown'

interface VendorActionsProps {
    isAuthenticated?: boolean
    credits?: number
}

export default function VendorActions({
    isAuthenticated = false,
    credits = 0,
}: VendorActionsProps) {
    return (
        <div className="flex items-center gap-2">
            <NotificationsPopover isVendor isAuthenticated={isAuthenticated} />

            <Link
                href={getVendorWalletRoutePath()}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber/12 border border-amber/30 hover:bg-amber/20 transition-all"
            >
                <span aria-hidden="true">🪙</span>
                <strong className="text-[14px] font-extrabold text-amber leading-none">{credits}</strong>
                <span className="text-[11px] text-amber/70 leading-none">crédits</span>
            </Link>

            <ThemeToggle />

            <AccountMenuDropdown isVendorView />
        </div>
    )
}
