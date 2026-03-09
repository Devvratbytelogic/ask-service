'use client'

import { BriefcaseIconSVG, ChatBubbleLeftRightIconSVG, NotificationsIconSVG, ProfileIconSVG, SecurityIconSVG, VendorDocumentIconSVG, VendorPaymentHistoryIconSVG, VendorReviewIconSVG } from '@/components/library/AllSVG'
import { HiPlus } from 'react-icons/hi2'
import { getCreateRequestRoutePath, getMyAccountRoutePath, getMyRequestRoutePath, getVendorAccountRoutePath, getVendorDashboardRoutePath, getVendorMessageRoutePath } from '@/routes/routes'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React from 'react'

export type NavId =
    | 'create-request'
    | 'dashboard'
    | 'my-requests'
    | 'profile'
    | 'security'
    | 'notifications'
    | 'documents'
    | 'reviews'
    | 'payment-history'
    | 'messages'

export type NavItem = { id?: NavId; label: string; icon: React.ReactNode; href?: string }

const defaultNavItems: NavItem[] = [
    { id: 'profile', label: 'Profile', icon: <ProfileIconSVG /> },
    { id: 'security', label: 'Security', icon: <SecurityIconSVG /> },
    { id: 'notifications', label: 'Notifications', icon: <NotificationsIconSVG /> },
]

export const customerNavItems: NavItem[] = [
    { id: 'my-requests', label: 'My Requests', icon: <BriefcaseIconSVG />, href: getMyRequestRoutePath() },
    { id: 'profile', label: 'Profile', icon: <ProfileIconSVG />, href: getMyAccountRoutePath({ section: 'profile' }) },
    { id: 'security', label: 'Security', icon: <SecurityIconSVG />, href: getMyAccountRoutePath({ section: 'security' }) },
    { id: 'notifications', label: 'Notifications', icon: <NotificationsIconSVG />, href: getMyAccountRoutePath({ section: 'notifications' }) },
    { id: 'create-request', label: 'Create a new request', icon: <HiPlus className="size-5 shrink-0" />, href: getCreateRequestRoutePath() },
]

export const vendorNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Leads', icon: <BriefcaseIconSVG />, href: getVendorDashboardRoutePath() },
    { id: 'profile', label: 'Profile', icon: <ProfileIconSVG />, href: getVendorAccountRoutePath({ section: 'profile' }) },
    { id: 'security', label: 'Security', icon: <SecurityIconSVG />, href: getVendorAccountRoutePath({ section: 'security' }) },
    { id: 'notifications', label: 'Notifications', icon: <NotificationsIconSVG />, href: getVendorAccountRoutePath({ section: 'notifications' }) },
    { id: 'documents', label: 'My Documents', icon: <VendorDocumentIconSVG />, href: getVendorAccountRoutePath({ section: 'documents' }) },
    { id: 'reviews', label: 'My Reviews', icon: <VendorReviewIconSVG />, href: getVendorAccountRoutePath({ section: 'reviews' }) },
    { id: 'payment-history', label: 'Payment History', icon: <VendorPaymentHistoryIconSVG />, href: getVendorAccountRoutePath({ section: 'payment-history' }) },
    { id: 'messages', label: 'Messages', icon: <ChatBubbleLeftRightIconSVG />, href: getVendorMessageRoutePath() },
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
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const navItems = customNavItems ?? defaultNavItems
    return (
        <div className="rounded-2xl border border-borderDark p-4">
            <nav className="flex flex-col gap-0.5">
                {navItems.map((item, idx) => {
                    const isLink = Boolean(item.href)
                    const urlSection = searchParams.get('section')
                    const isDashboardActive = isLink && item.id === 'dashboard' && (pathname === '/vendor/dashboard' || pathname.startsWith('/vendor/dashboard/'))
                    const isAccountSectionActive = isLink && item.id && item.id !== 'dashboard' && item.id !== 'messages' && pathname === '/vendor/account' && urlSection === item.id
                    const isMessagesActive = isLink && item.id === 'messages' && pathname === '/vendor/message'
                    const isCreateRequestActive = isLink && item.id === 'create-request' && pathname === '/create-request'
                    const isMyRequestsActive = isLink && item.id === 'my-requests' && pathname === '/my-request'
                    const isMyAccountSectionActive = isLink && item.id && item.id !== 'my-requests' && item.id !== 'create-request' && pathname === '/my-account' && urlSection === item.id
                    const isLinkActive = isLink && (isDashboardActive || isAccountSectionActive || isMessagesActive || isCreateRequestActive || isMyRequestsActive || isMyAccountSectionActive)
                    const isSectionActive = !isLink && activeSection === item.id
                    const isActive = isLinkActive || isSectionActive
                    const key = item.id ?? `link-${idx}`
                    const baseClassName = `cursor-pointer flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors w-full ${isActive
                        ? 'bg-primaryColor/10 text-primaryColor'
                        : 'text-fontBlack hover:bg-[#F9FAFB]'
                        }`
                    if (isLink) {
                        return (
                            <Link
                                key={key}
                                href={item.href!}
                                className={baseClassName}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                <span className={isActive ? 'text-primaryColor' : 'text-darkSilver'}>{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        )
                    }
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => item.id && onSectionChange?.(item.id)}
                            className={baseClassName}
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
