'use client'

import { NotificationsIconSVG, ProfileIconSVG, SecurityIconSVG, VendorDocumentIconSVG, VendorPaymentHistoryIconSVG, VendorReviewIconSVG } from '@/components/library/AllSVG'
import React from 'react'

export type NavId =
    | 'profile'
    | 'security'
    | 'notifications'
    | 'documents'
    | 'reviews'
    | 'payment-history'

export type NavItem = { id: NavId; label: string; icon: React.ReactNode }

const defaultNavItems: NavItem[] = [
    { id: 'profile', label: 'Profile', icon: <ProfileIconSVG /> },
    { id: 'security', label: 'Security', icon: <SecurityIconSVG /> },
    { id: 'notifications', label: 'Notifications', icon: <NotificationsIconSVG /> },
]

export const vendorNavItems: NavItem[] = [
    ...defaultNavItems,
    { id: 'documents', label: 'My Documents', icon: <VendorDocumentIconSVG /> },
    { id: 'reviews', label: 'My Reviews', icon: <VendorReviewIconSVG /> },
    { id: 'payment-history', label: 'Payment History', icon: <VendorPaymentHistoryIconSVG /> },
]

interface AccountSidebarProps {
    activeSection?: NavId
    onSectionChange?: (id: NavId) => void
    navItems?: NavItem[]
}

export default function AccountSidebar({
    activeSection = 'profile',
    onSectionChange,
    navItems: customNavItems,
}: AccountSidebarProps) {
    const navItems = customNavItems ?? defaultNavItems
    return (
        <div className="rounded-2xl border border-borderDark p-4">
            <nav className="flex flex-col gap-0.5">
                {navItems.map((item) => {
                    const isActive = activeSection === item.id
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => onSectionChange?.(item.id)}
                            className={`cursor-pointer flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${isActive
                                ? 'bg-primaryColor/10 text-primaryColor'
                                : 'text-fontBlack hover:bg-[#F9FAFB]'
                                }`}
                        >
                            <span className={isActive ? 'text-primaryColor' : 'text-darkSilver'}>
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </button>
                    )
                })}
            </nav>
        </div>
    )
}
