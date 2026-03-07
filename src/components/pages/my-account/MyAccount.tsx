'use client'

import AccountDetails from '@/components/pages/my-account/AccountDetails'
import AccountSidebar, { type NavId, vendorNavItems } from '@/components/pages/my-account/AccountSidebar'
import { useSearchParams } from 'next/navigation'
import React, { useState } from 'react'

interface MyAccountProps {
    variant?: 'default' | 'vendor'
}

const VALID_SECTIONS: NavId[] = ['profile', 'security', 'notifications', 'documents', 'reviews', 'payment-history']

export default function MyAccount({ variant = 'default' }: MyAccountProps) {
    const searchParams = useSearchParams()
    const sectionParam = searchParams.get('section')
    const urlSection: NavId | null = sectionParam && VALID_SECTIONS.includes(sectionParam as NavId) ? (sectionParam as NavId) : null
    const [localSection, setLocalSection] = useState<NavId>('profile')
    const activeSection = variant === 'vendor' ? (urlSection ?? 'profile') : localSection
    return (
        <>
            <aside className="w-full lg:w-[320px] shrink-0 self-start sticky top-24">
                <AccountSidebar
                    activeSection={activeSection}
                    onSectionChange={variant === 'default' ? setLocalSection : undefined}
                    navItems={variant === 'vendor' ? vendorNavItems : undefined}
                />
            </aside>
            <section className="relative flex-1 min-w-0">
                <AccountDetails activeSection={activeSection} variant={variant} />
            </section>
        </>
    )
}
