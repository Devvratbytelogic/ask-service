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
            <aside className="w-full lg:w-[320px] shrink-0 self-start sticky top-24 z-40">
                <AccountSidebar navItems={variant === 'vendor' ? vendorNavItems : customerNavItems} />
            </aside>
            <section className="relative flex-1 min-w-0">
                <div className="rounded-2xl border border-appBorder p-4 bg-appCard">{children}</div>
            </section>
        </>
    )
}
