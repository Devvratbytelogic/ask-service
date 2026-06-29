'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getHomeRoutePath, getRequestAServiceRoutePath } from '@/routes/routes'
import { clearAllCookiesAndReload } from '@/utils/authCookies'
import { SignOutIconSVG } from '@/components/library/AllSVG'
import NotificationsPopover from './NotificationsPopover'
import ThemeToggle from '@/components/common/ThemeToggle'

interface CustomerActionsProps {
    userInitials?: string
    isAuthenticated?: boolean
}

export default function CustomerActions({
    userInitials = 'ML',
    isAuthenticated = false,
}: CustomerActionsProps) {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <div className="flex items-center gap-2">
            {/* Notification bell */}
            <NotificationsPopover isVendor={false} isAuthenticated={isAuthenticated} />

            {/* New request button */}
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

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Avatar with logout dropdown */}
            <div className="relative">
                <button
                    type="button"
                    aria-label="Account menu"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(prev => !prev)}
                    className="w-8 h-8 rounded-full bg-primaryColor text-white text-[12px] font-bold border-2 border-primaryColor/40 hover:shadow-[0_0_0_3px_rgba(27,79,255,0.25)] transition-all flex items-center justify-center shrink-0"
                >
                    {userInitials}
                </button>

                {menuOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} aria-hidden="true" />
                        <div className="absolute top-full right-0 mt-2 w-44 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-borderDark dark:border-white/10 z-50 py-1.5 px-1.5">
                            <button
                                type="button"
                                onClick={() => clearAllCookiesAndReload(getHomeRoutePath())}
                                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-red-500 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                            >
                                <span className="size-4 shrink-0 flex"><SignOutIconSVG /></span>
                                Déconnexion
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
