'use client'

import AccountSidebar, { customerNavItems, vendorNavItems } from '@/components/pages/my-account/AccountSidebar'
import React from 'react'

interface MyAccountLayoutProps {
    variant?: 'default' | 'vendor'
    children: React.ReactNode
}

export default function MyAccountLayout({ variant = 'default', children }: MyAccountLayoutProps) {
    return (
        <>
            <aside className="w-full lg:w-[320px] shrink-0 self-start sticky top-17 z-30 bg-appBg py-2 lg:py-0 lg:top-24 lg:z-40 lg:bg-transparent">
                <AccountSidebar navItems={variant === 'vendor' ? vendorNavItems : customerNavItems} />
            </aside>
            <section className="relative flex-1 min-w-0">
                <div className="rounded-2xl border border-appBorder p-4 bg-appCard">{children}</div>
            </section>
        </>
    )
}
