'use client'

import { MenuIconSVG, NotificationsIconSVG, ProfileIconSVG, SecurityIconSVG, VendorDocumentIconSVG, VendorPaymentHistoryIconSVG, VendorReviewIconSVG } from '@/components/library/AllSVG'
import { getMyAccountRoutePath, getVendorAccountRoutePath } from '@/routes/routes'
import { Drawer, DrawerBody, DrawerContent, DrawerHeader } from '@heroui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

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

export type NavItem = { id?: NavId; label: string; icon: React.ComponentType; href: string }

export const customerNavItems: NavItem[] = [
    { id: 'profile', label: 'Profil', icon: ProfileIconSVG, href: getMyAccountRoutePath('profile') },
    { id: 'security', label: 'Sécurité', icon: SecurityIconSVG, href: getMyAccountRoutePath('security') },
    { id: 'notifications', label: 'Notifications', icon: NotificationsIconSVG, href: getMyAccountRoutePath('notifications') },
]

export const vendorNavItems: NavItem[] = [
    { id: 'profile', label: 'Profil', icon: ProfileIconSVG, href: getVendorAccountRoutePath('profile') },
    { id: 'security', label: 'Sécurité', icon: SecurityIconSVG, href: getVendorAccountRoutePath('security') },
    { id: 'notifications', label: 'Notifications', icon: NotificationsIconSVG, href: getVendorAccountRoutePath('notifications') },
    { id: 'documents', label: 'Mes Documents', icon: VendorDocumentIconSVG, href: getVendorAccountRoutePath('documents') },
    { id: 'reviews', label: 'Mes Avis', icon: VendorReviewIconSVG, href: getVendorAccountRoutePath('reviews') },
    { id: 'payment-history', label: 'Mes Paiements', icon: VendorPaymentHistoryIconSVG, href: getVendorAccountRoutePath('payment-history') },
]

interface AccountSidebarProps {
    navItems?: NavItem[]
}

function NavLinks({
    navItems,
    pathname,
    onNavigate,
}: {
    navItems: NavItem[]
    pathname: string
    onNavigate?: () => void
}) {
    return (
        <nav className="flex flex-col gap-0.5" aria-label="Navigation du compte">
            {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                    <Link
                        key={item.id ?? item.href}
                        href={item.href}
                        onClick={onNavigate}
                        className={`cursor-pointer flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors w-full ${isActive
                            ? 'bg-primaryColor/10 text-primaryColor'
                            : 'text-appText hover:bg-appSurface'
                            }`}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        <span className={`shrink-0 ${isActive ? 'text-primaryColor' : 'text-appTextSec'}`}>
                            <Icon />
                        </span>
                        <span>{item.label}</span>
                    </Link>
                )
            })}
        </nav>
    )
}

export default function AccountSidebar({ navItems = customerNavItems }: AccountSidebarProps) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const activeItem = navItems.find((item) => item.href === pathname) ?? navItems[0]
    const ActiveIcon = activeItem?.icon

    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    useEffect(() => {
        const media = window.matchMedia('(min-width: 1024px)')
        const closeOnDesktop = () => {
            if (media.matches) setIsOpen(false)
        }
        media.addEventListener('change', closeOnDesktop)
        return () => media.removeEventListener('change', closeOnDesktop)
    }, [])

    return (
        <>
            <div className="hidden lg:block rounded-2xl border border-appBorder p-4 bg-appCard">
                <NavLinks navItems={navItems} pathname={pathname} />
            </div>

            <div className="lg:hidden">
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-appBorder bg-appCard px-4 py-3 text-sm font-medium text-appText"
                    aria-haspopup="dialog"
                    aria-expanded={isOpen}
                    aria-label="Ouvrir le menu du compte"
                >
                    {ActiveIcon && (
                        <span className="shrink-0 text-primaryColor">
                            <ActiveIcon />
                        </span>
                    )}
                    <span className="flex-1 text-left">{activeItem?.label ?? 'Menu'}</span>
                    <span className="shrink-0 text-appTextSec [&_svg]:size-5">
                        <MenuIconSVG />
                    </span>
                </button>
            </div>

            <Drawer
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                placement="left"
                size="xs"
                classNames={{
                    base: 'bg-appCard',
                    backdrop: 'bg-black/40',
                    closeButton: 'top-3 right-3 text-fontBlack hover:bg-appSurface rounded-full',
                }}
            >
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="text-lg font-bold text-fontBlack border-b border-appBorder">
                                Menu du compte
                            </DrawerHeader>
                            <DrawerBody className="pt-4">
                                <NavLinks navItems={navItems} pathname={pathname} onNavigate={onClose} />
                            </DrawerBody>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    )
}
