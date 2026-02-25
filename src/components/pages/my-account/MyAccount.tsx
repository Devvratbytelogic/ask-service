'use client'
import React, { useState } from 'react'
import AccountSidebar, { type NavId, vendorNavItems } from '@/components/pages/my-account/AccountSidebar'
import AccountDetails from '@/components/pages/my-account/AccountDetails'

interface MyAccountProps {
    variant?: 'default' | 'vendor'
}

export default function MyAccount({ variant = 'default' }: MyAccountProps) {
    const [activeSection, setActiveSection] = useState<NavId>('profile')
    return (
        <>
            <aside className="w-full lg:w-[320px] shrink-0 self-start sticky top-24">
                <AccountSidebar
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                    navItems={variant === 'vendor' ? vendorNavItems : undefined}
                />
            </aside>
            <section className="relative flex-1 min-w-0">
                <AccountDetails activeSection={activeSection} variant={variant} />
            </section>
        </>
    )
}
