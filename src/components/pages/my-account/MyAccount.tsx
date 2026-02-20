'use client'
import React, { useState } from 'react'
import AccountSidebar from '@/components/pages/my-account/AccountSidebar'
import AccountDetails from '@/components/pages/my-account/AccountDetails'

type NavId = 'profile' | 'security' | 'notifications'
export default function MyAccount() {
    const [activeSection, setActiveSection] = useState<NavId>('profile')
    return (
        <>
            <aside className="w-full lg:w-[320px] shrink-0 self-start sticky top-24">
                <AccountSidebar
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                />
            </aside>
            <section className="relative flex-1 min-w-0">
                <AccountDetails activeSection={activeSection} />
            </section>
        </>
    )
}
