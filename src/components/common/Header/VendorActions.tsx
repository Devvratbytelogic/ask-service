'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HiOutlineCog6Tooth } from 'react-icons/hi2'
import { getVendorWalletRoutePath, getHomeRoutePath, getVendorAccountRoutePath } from '@/routes/routes'
import { clearAllCookiesAndReload } from '@/utils/authCookies'
import { ProfileIconSVG, SignOutIconSVG } from '@/components/library/AllSVG'
import NotificationsPopover from './NotificationsPopover'
import ThemeToggle from '@/components/common/ThemeToggle'

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
    const [menuOpen, setMenuOpen] = useState(false)

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
                <strong className="text-[14px] font-extrabold text-amber leading-none">{credits}</strong>
                <span className="text-[11px] text-amber/70 leading-none">crédits</span>
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
                    className="w-8 h-8 rounded-full bg-primaryColor text-white text-[12px] font-bold flex items-center justify-center shrink-0 hover:shadow-[0_0_0_3px_rgba(27,79,255,0.25)] transition-all"
                >
                    {userInitials}
                </button>

                {menuOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} aria-hidden="true" />
                        <div className="absolute top-full right-0 mt-2 w-44 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-borderDark dark:border-white/10 z-50 py-1.5 px-1.5">
                            <Link
                                href={getVendorAccountRoutePath('profile')}
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-fontBlack dark:text-slate-200 text-sm font-medium hover:bg-borderDark/50 dark:hover:bg-white/10 transition-colors"
                            >
                                <span className="size-4 shrink-0 flex text-darkSilver"><ProfileIconSVG /></span>
                                Profil
                            </Link>
                            <Link
                                href={getVendorAccountRoutePath('security')}
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-fontBlack dark:text-slate-200 text-sm font-medium hover:bg-borderDark/50 dark:hover:bg-white/10 transition-colors"
                            >
                                <HiOutlineCog6Tooth className="size-4 shrink-0 text-darkSilver" />
                                Paramètres
                            </Link>
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
