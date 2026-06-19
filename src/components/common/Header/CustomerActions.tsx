'use client'

import Link from 'next/link'
import { getCreateRequestRoutePath } from '@/routes/routes'
import NotificationsPopover from './NotificationsPopover'

interface CustomerActionsProps {
    userInitials?: string
    isAuthenticated?: boolean
}

export default function CustomerActions({
    userInitials = 'ML',
    isAuthenticated = false,
}: CustomerActionsProps) {
    return (
        <div className="flex items-center gap-2">
            {/* Notification bell */}
            <NotificationsPopover isVendor={false} isAuthenticated={isAuthenticated} />

            {/* New request button */}
            <Link
                href={getCreateRequestRoutePath()}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-primaryColor text-white text-[13px] font-bold rounded-lg shadow-[0_3px_10px_rgba(27,79,255,0.3)] hover:bg-blue-dark hover:-translate-y-px hover:shadow-[0_5px_14px_rgba(27,79,255,0.4)] transition-all"
            >
                <svg
                    width="13"
                    height="13"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New request
            </Link>

            {/* Avatar / initials */}
            <button
                type="button"
                aria-label="Account"
                className="w-8 h-8 rounded-full bg-primaryColor text-white text-[12px] font-bold border-2 border-primaryColor/40 hover:shadow-[0_0_0_3px_rgba(27,79,255,0.25)] transition-all flex items-center justify-center shrink-0"
            >
                {userInitials}
            </button>
        </div>
    )
}
