'use client'

import { BriefcaseIconSVG, ChatBubbleLeftRightIconSVG, DocumentArrowIconSVG, LockGreenIconSVG, LockOpenGreenIconSVG, LockPrimaryColorSVG, NotificationsIconSVG, ProfileIconSVG, SecurityIconSVG, VendorDocumentIconSVG, VendorPaymentHistoryIconSVG, VendorReviewIconSVG } from '@/components/library/AllSVG'
import { HiPlus } from 'react-icons/hi2'
import { getCreateRequestRoutePath, getMyAccountRoutePath, getMyRequestRoutePath, getVendorAccountRoutePath, getVendorAllQuotesRoutePath, getVendorDashboardRoutePath, getVendorMessageRoutePath } from '@/routes/routes'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React from 'react'

export type NavId =
    | 'all-quotes'
    | 'create-request'
    | 'dashboard'
    | 'my-leads'
    | 'my-requests'
    | 'profile'
    | 'prospects'
    | 'security'
    | 'notifications'
    | 'documents'
    | 'reviews'
    | 'payment-history'
    | 'messages'

export type NavItem = { id?: NavId; label: string; icon: React.ReactNode; href?: string }

const defaultNavItems: NavItem[] = [
    { id: 'profile', label: 'Profil', icon: <ProfileIconSVG /> },
    { id: 'security', label: 'Sécurité', icon: <SecurityIconSVG /> },
    { id: 'notifications', label: 'Notifications', icon: <NotificationsIconSVG /> },
]

export const customerNavItems: NavItem[] = [
    // { id: 'my-requests', label: 'Mes demandes', icon: <BriefcaseIconSVG />, href: getMyRequestRoutePath() },
    { id: 'profile', label: 'Profil', icon: <ProfileIconSVG />, href: getMyAccountRoutePath({ section: 'profile' }) },
    { id: 'security', label: 'Sécurité', icon: <SecurityIconSVG />, href: getMyAccountRoutePath({ section: 'security' }) },
    { id: 'notifications', label: 'Notifications', icon: <NotificationsIconSVG />, href: getMyAccountRoutePath({ section: 'notifications' }) },
    // { id: 'create-request', label: 'Créer une nouvelle demande', icon: <HiPlus className="size-5 shrink-0" />, href: getCreateRequestRoutePath() },
]

export const vendorNavItems: NavItem[] = [
    // { id: 'dashboard', label: 'Tableau de bord', icon: <BriefcaseIconSVG />, href: getVendorDashboardRoutePath() },
    // { id: 'prospects', label: 'Trouver des prospects', icon: <LockPrimaryColorSVG className="size-5 shrink-0" />, href: getVendorDashboardRoutePath({ leads: 'available' }) },
    // { id: 'my-leads', label: 'Mes Prospects', icon: <LockOpenGreenIconSVG className="size-5 shrink-0" />, href: getVendorDashboardRoutePath({ leads: 'purchased' }) },
    // { id: 'all-quotes', label: 'Mes Devis', icon: <DocumentArrowIconSVG className="size-5 shrink-0" />, href: getVendorAllQuotesRoutePath() },
    { id: 'profile', label: 'Profil', icon: <ProfileIconSVG />, href: getVendorAccountRoutePath({ section: 'profile' }) },
    { id: 'security', label: 'Sécurité', icon: <SecurityIconSVG />, href: getVendorAccountRoutePath({ section: 'security' }) },
    { id: 'notifications', label: 'Notifications', icon: <NotificationsIconSVG />, href: getVendorAccountRoutePath({ section: 'notifications' }) },
    { id: 'documents', label: 'Mes Documents', icon: <VendorDocumentIconSVG />, href: getVendorAccountRoutePath({ section: 'documents' }) },
    { id: 'reviews', label: 'Mes Avis', icon: <VendorReviewIconSVG />, href: getVendorAccountRoutePath({ section: 'reviews' }) },
    { id: 'payment-history', label: 'Mes Paiements', icon: <VendorPaymentHistoryIconSVG />, href: getVendorAccountRoutePath({ section: 'payment-history' }) },
    // { id: 'messages', label: 'Messages', icon: <ChatBubbleLeftRightIconSVG />, href: getVendorMessageRoutePath() },
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
        <div className="rounded-2xl border border-borderDark p-4 bg-white">
            <nav className="flex flex-col gap-0.5">
                {navItems.map((item, idx) => {
                    const isLink = Boolean(item.href)
                    const urlSection = searchParams.get('section')
                    // const isDashboardActive = isLink && item.id === 'dashboard' && (pathname === '/vendor/dashboard' || pathname.startsWith('/vendor/dashboard/')) && searchParams.get('leads') !== 'purchased' && searchParams.get('leads') !== 'available'
                    const isDashboardActive = isLink && item.id === 'dashboard' && (pathname === '/vendor/dashboard' || pathname.startsWith('/vendor/dashboard/')) && searchParams.get('leads') !== 'purchased'
                    const isProspectsActive = isLink && item.id === 'prospects' && (pathname === '/vendor/dashboard' || pathname.startsWith('/vendor/dashboard/')) && searchParams.get('leads') === 'available'
                    const isMyLeadsActive = isLink && item.id === 'my-leads' && (pathname === '/vendor/dashboard' || pathname.startsWith('/vendor/dashboard/')) && searchParams.get('leads') === 'purchased'
                    const isAllQuotesActive = isLink && item.id === 'all-quotes' && pathname === '/vendor/all-quotes'
                    const isAccountSectionActive = isLink && item.id && item.id !== 'dashboard' && item.id !== 'prospects' && item.id !== 'messages' && item.id !== 'all-quotes' && pathname === '/vendor/account' && urlSection === item.id
                    const isMessagesActive = isLink && item.id === 'messages' && pathname === '/vendor/message'
                    const isCreateRequestActive = isLink && item.id === 'create-request' && pathname === '/create-request'
                    const isMyRequestsActive = isLink && item.id === 'my-requests' && pathname === '/my-request'
                    const isMyAccountSectionActive = isLink && item.id && item.id !== 'my-requests' && item.id !== 'create-request' && pathname === '/my-account' && urlSection === item.id
                    const isLinkActive = isLink && (isDashboardActive || isProspectsActive || isMyLeadsActive || isAllQuotesActive || isAccountSectionActive || isMessagesActive || isCreateRequestActive || isMyRequestsActive || isMyAccountSectionActive)
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
