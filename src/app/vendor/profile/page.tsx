import React from 'react'
import VendorProfileSidebar from '@/components/vendor/profile/VendorProfileSidebar'
import VendorProfileDetails from '@/components/vendor/profile/VendorProfileDetails'

export default function ProfilePage() {
    return (
        <>
            <div className="min-h-screen body_x_axis_padding">
                <div className="flex flex-col lg:flex-row gap-6">
                    <aside className="w-full lg:w-[320px] shrink-0 self-start sticky top-24">
                        <VendorProfileSidebar />
                    </aside>
                    <section className="relative flex-1 min-w-0">
                        <VendorProfileDetails />
                    </section>
                </div>
            </div>
        </>
    )
}
