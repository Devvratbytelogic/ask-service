'use client'

import { DocumentIconSVG, ProfileIconSVG, SignOutIconSVG } from '@/components/library/AllSVG'
import { clientSideGetApis } from '@/redux/rtkQueries/clientSideGetApis'
import { useGetUserProfileInfoQuery, useGetVendorProfileInfoQuery } from '@/redux/rtkQueries/clientSideGetApis'
import { setUserRole } from '@/redux/slices/authSlice'
import {
    getClientDashboardPageRoutePath,
    getHomeRoutePath,
    getMyAccountRoutePath,
    getVendorAccountRoutePath,
    getVendorDashboardPageRoutePath,
} from '@/routes/routes'
import { clearAllCookiesAndReload, setUserRoleCookie } from '@/utils/authCookies'
import Link from 'next/link'
import React, { useState } from 'react'
import { HiChevronDown, HiOutlineCog6Tooth } from 'react-icons/hi2'
import { useDispatch } from 'react-redux'

interface AccountMenuDropdownProps {
    isVendorView: boolean
}

const menuItemClassName =
    'flex items-center justify-start gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors'

function MenuIcon({ children }: { children: React.ReactNode }) {
    return (
        <span className="size-4 shrink-0 flex items-center justify-center text-darkSilver [&_svg]:size-4">
            {children}
        </span>
    )
}

function getProfileHandle(firstName?: string, lastName?: string, email?: string) {
    if (firstName || lastName) {
        return [firstName, lastName].filter(Boolean).join('.').toLowerCase().replace(/\s+/g, '.')
    }
    return email?.split('@')[0] ?? ''
}

export default function AccountMenuDropdown({ isVendorView }: AccountMenuDropdownProps) {
    const [menuOpen, setMenuOpen] = useState(false)
    const dispatch = useDispatch()

    const { data: userProfile } = useGetUserProfileInfoQuery(undefined, { skip: isVendorView })
    const { data: vendorProfile } = useGetVendorProfileInfoQuery(undefined, { skip: !isVendorView })

    const profile = isVendorView ? vendorProfile?.data : userProfile?.data
    const displayName = profile ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim() : ''
    const email = profile?.email ?? ''
    const handle = getProfileHandle(profile?.first_name, profile?.last_name, email)
    const initials = profile
        ? `${profile.first_name?.[0] ?? ''}${profile.last_name?.[0] ?? ''}`.toUpperCase() || '?'
        : '?'

    const profilePath = isVendorView ? getVendorAccountRoutePath('profile') : getMyAccountRoutePath('profile')
    const settingsPath = isVendorView ? getVendorAccountRoutePath('security') : getMyAccountRoutePath('security')

    function handleSwitchAccount() {
        setMenuOpen(false)
        const newRole = isVendorView ? 'User' : 'Vendor'
        setUserRoleCookie(newRole)
        dispatch(setUserRole(newRole))
        dispatch(clientSideGetApis.util.invalidateTags(['UserProfile', 'VendorProfile']))
        window.location.href =
            newRole === 'Vendor' ? getVendorDashboardPageRoutePath() : getClientDashboardPageRoutePath()
    }

    return (
        <div className="relative">
            <button
                type="button"
                aria-label="Account menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(prev => !prev)}
                className="flex items-center gap-2 rounded-full pl-1 pr-2.5 py-1 hover:bg-borderDark/40 dark:hover:bg-white/8 transition-colors"
            >
                <span className="w-8 h-8 rounded-full bg-primaryColor/15 text-primaryColor text-[12px] font-bold flex items-center justify-center shrink-0">
                    {initials}
                </span>
                <span className="hidden xl:inline text-[13px] font-semibold text-fontBlack dark:text-slate-200 max-w-[120px] truncate">
                    {handle || 'Compte'}
                </span>
                <HiChevronDown className={`size-4 text-darkSilver transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            {menuOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} aria-hidden="true" />
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-borderDark dark:border-white/10 z-50 py-2 px-2">
                        <div className="px-3 py-2">
                            <p className="text-sm font-semibold text-fontBlack dark:text-slate-100 truncate">
                                {displayName || 'Mon compte'}
                            </p>
                            {email && (
                                <p className="text-xs text-darkSilver dark:text-slate-400 truncate mt-0.5">{email}</p>
                            )}
                        </div>

                        <div className="my-1 border-t border-borderDark/60 dark:border-white/10" />

                        <Link
                            href={profilePath}
                            onClick={() => setMenuOpen(false)}
                            className={`${menuItemClassName} text-fontBlack dark:text-slate-200 hover:bg-borderDark/50 dark:hover:bg-white/10`}
                        >
                            <MenuIcon><ProfileIconSVG /></MenuIcon>
                            <span>Profil</span>
                        </Link>
                        <Link
                            href={settingsPath}
                            onClick={() => setMenuOpen(false)}
                            className={`${menuItemClassName} text-fontBlack dark:text-slate-200 hover:bg-borderDark/50 dark:hover:bg-white/10`}
                        >
                            <MenuIcon><HiOutlineCog6Tooth className="size-4" /></MenuIcon>
                            <span>Paramètres</span>
                        </Link>

                        <div className="my-1 border-t border-borderDark/60 dark:border-white/10" />

                        <button
                            type="button"
                            onClick={handleSwitchAccount}
                            className={`${menuItemClassName} text-primaryColor hover:bg-primaryColor/10`}
                        >
                            <MenuIcon><DocumentIconSVG className="size-4" /></MenuIcon>
                            <span>{isVendorView ? 'Passer en compte client' : 'Passer en compte prestataire'}</span>
                        </button>

                        <div className="my-1 border-t border-borderDark/60 dark:border-white/10" />

                        <button
                            type="button"
                            onClick={() => clearAllCookiesAndReload(getHomeRoutePath())}
                            className={`${menuItemClassName} text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10`}
                        >
                            <MenuIcon><SignOutIconSVG /></MenuIcon>
                            <span>Déconnexion</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
