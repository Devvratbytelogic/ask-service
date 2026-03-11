import AccountSidebar, { vendorNavItems } from '@/components/pages/my-account/AccountSidebar'
import VendorDashboard from '@/components/vendor/dashboard/VendorDashboard'
import VendorUnderReviewBanner from '@/components/vendor/dashboard/VendorUnderReviewBanner'

export default function VendorDashboardPage() {
    return (
        <>
            <VendorUnderReviewBanner />
            <div className="body_x_axis_padding min-h-screen">
                <h1 className='header_text_md'>Tableau de bord <span className='text-darkSilver'>prestataire</span></h1>
                <p className='text-sm text-[#4A5565]'>Bon retour • Gérez vos demandes et vos devis</p>
                <div className="flex flex-col lg:flex-row gap-6 mt-8">
                    <aside className="w-full lg:w-[320px] shrink-0 self-start sticky top-24 z-50">
                        <AccountSidebar navItems={vendorNavItems} />
                    </aside>
                    <section className="relative flex-1 min-w-0">
                        <VendorDashboard />
                    </section>
                </div>
            </div>
        </>
    )
}
