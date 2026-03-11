'use client'

import AccountSidebar, { customerNavItems } from '@/components/pages/my-account/AccountSidebar'
import AllRequests from '@/components/pages/my-request/AllRequests'


export default function MyRequestPage() {
    return (
        <div className="min-h-screen body_x_axis_padding navbar_y_axis_padding">
            <div className='text-center mb-8'>
                <h1 className="header_text font-bold">Mes demandes</h1>
                <p className='text-lightBlack'>Gérez et suivez vos demandes de service</p>
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
                <aside className="w-full lg:w-[320px] shrink-0 self-start sticky top-24 z-50">
                    <AccountSidebar navItems={customerNavItems} />
                </aside>
                <section className="relative flex-1 min-w-0">
                    <div className="flex flex-col gap-4">
                        <AllRequests />
                    </div>
                </section>
            </div>
        </div>
    )
}
