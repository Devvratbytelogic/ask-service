import React from 'react'
import AccountSidebar from '@/components/pages/my-account/AccountSidebar'
import AccountDetails from '@/components/pages/my-account/AccountDetails'

export default function MyAccountPage() {
    return (
        <>
            <div className="min-h-screen body_x_axis_padding">
                <div className="flex flex-col lg:flex-row gap-6">
                    <aside className="w-full lg:w-[320px] shrink-0 self-start sticky top-24">
                        <AccountSidebar />
                    </aside>
                    <section className="relative flex-1 min-w-0">
                        <AccountDetails />
                    </section>
                </div>
            </div>
        </>
    )
}
