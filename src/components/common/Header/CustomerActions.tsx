'use client'

import Link from 'next/link'
import { getRequestAServiceRoutePath } from '@/routes/routes'
import NotificationsPopover from './NotificationsPopover'
import ThemeToggle from '@/components/common/ThemeToggle'
import AccountMenuDropdown from './AccountMenuDropdown'

interface CustomerActionsProps {
    isAuthenticated?: boolean
}

export default function CustomerActions({ isAuthenticated = false }: CustomerActionsProps) {
    return (
        <div className="flex items-center gap-2">
            <NotificationsPopover isVendor={false} isAuthenticated={isAuthenticated} />

            <Link
                href={getRequestAServiceRoutePath()}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-primaryColor text-white text-[13px] font-bold rounded-lg shadow-[0_3px_10px_rgba(27,79,255,0.3)] hover:bg-blue-dark hover:-translate-y-px hover:shadow-[0_5px_14px_rgba(27,79,255,0.4)] transition-all"
            >
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Nouvelle demande
            </Link>

            <ThemeToggle />

            <AccountMenuDropdown isVendorView={false} />
        </div>
    )
}
