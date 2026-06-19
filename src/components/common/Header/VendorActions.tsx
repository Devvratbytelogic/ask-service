'use client'

import Link from 'next/link'
import { getVendorWalletRoutePath } from '@/routes/routes'
import NotificationsPopover from './NotificationsPopover'

interface VendorActionsProps {
    userInitials?: string
    isAuthenticated?: boolean
    credits?: number
}

export default function VendorActions({
    userInitials = 'PD',
    isAuthenticated = false,
    credits = 0,
}: VendorActionsProps) {
    return (
        <div className="flex items-center gap-2">
            {/* Notification bell */}
            <NotificationsPopover isVendor isAuthenticated={isAuthenticated} />

            {/* Credits / wallet pill */}
            <Link
                href={getVendorWalletRoutePath()}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber/12 border border-amber/30 hover:bg-amber/20 transition-all"
            >
                <span aria-hidden="true">🪙</span>
                <strong className="text-[14px] font-extrabold text-amber leading-none">
                    {credits}
                </strong>
                <span className="text-[11px] text-amber/70 leading-none">crédits</span>
            </Link>

            {/* Avatar / initials */}
            <button
                type="button"
                aria-label="Account"
                className="w-8 h-8 rounded-full bg-primaryColor text-white text-[12px] font-bold flex items-center justify-center shrink-0 hover:shadow-[0_0_0_3px_rgba(27,79,255,0.25)] transition-all"
            >
                {userInitials}
            </button>
        </div>
    )
}
