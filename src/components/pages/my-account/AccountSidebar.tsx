'use client'

import { NotificationsIconSVG, ProfileIconSVG, SecurityIconSVG, VendorDocumentIconSVG, VendorPaymentHistoryIconSVG, VendorReviewIconSVG } from '@/components/library/AllSVG'
import { getMyAccountRoutePath, getVendorAccountRoutePath } from '@/routes/routes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export type NavId =
    | 'all-quotes'
    | 'create-request'
    | 'dashboard'
    | 'my-leads'
    | 'profile'
    | 'prospects'
    | 'security'
    | 'notifications'
    | 'documents'
    | 'reviews'
    | 'payment-history'
    | 'messages'

export type NavItem = { id?: NavId; label: string; icon: React.ReactNode; href: string }

export const customerNavItems: NavItem[] = [
    { id: 'profile', label: 'Profil', icon: <ProfileIconSVG />, href: getMyAccountRoutePath('profile') },
    { id: 'security', label: 'Sécurité', icon: <SecurityIconSVG />, href: getMyAccountRoutePath('security') },
    { id: 'notifications', label: 'Notifications', icon: <NotificationsIconSVG />, href: getMyAccountRoutePath('notifications') },
]

export const vendorNavItems: NavItem[] = [
    { id: 'profile', label: 'Profil', icon: <ProfileIconSVG />, href: getVendorAccountRoutePath('profile') },
    { id: 'security', label: 'Sécurité', icon: <SecurityIconSVG />, href: getVendorAccountRoutePath('security') },
    { id: 'notifications', label: 'Notifications', icon: <NotificationsIconSVG />, href: getVendorAccountRoutePath('notifications') },
    { id: 'documents', label: 'Mes Documents', icon: <VendorDocumentIconSVG />, href: getVendorAccountRoutePath('documents') },
    { id: 'reviews', label: 'Mes Avis', icon: <VendorReviewIconSVG />, href: getVendorAccountRoutePath('reviews') },
    { id: 'payment-history', label: 'Mes Paiements', icon: <VendorPaymentHistoryIconSVG />, href: getVendorAccountRoutePath('payment-history') },
]

interface AccountSidebarProps {
    navItems?: NavItem[]
}

export default function AccountSidebar({ navItems = customerNavItems }: AccountSidebarProps) {
    const pathname = usePathname()

    return (
        <div className="rounded-2xl border border-borderDark p-4 bg-white">
            <nav className="flex flex-col gap-0.5">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    const baseClassName = `cursor-pointer flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors w-full ${isActive
                        ? 'bg-primaryColor/10 text-primaryColor'
                        : 'text-fontBlack hover:bg-[#F9FAFB]'
                        }`

                    return (
                        <Link
                            key={item.id ?? item.href}
                            href={item.href}
                            className={baseClassName}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <span className={isActive ? 'text-primaryColor' : 'text-darkSilver'}>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
