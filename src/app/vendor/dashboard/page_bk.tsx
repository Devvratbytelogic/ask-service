import VendorDashboard from '@/components/vendor/dashboard/VendorDashboard'
import VendorUnderReviewBanner from '@/components/vendor/dashboard/VendorUnderReviewBanner'

export default async function VendorDashboardPage() {
    return (
        <>
            <VendorUnderReviewBanner />
            <div className="body_x_axis_padding min-h-screen">
                <div className="mt-8">
                    <section className="relative min-w-0">
                        <VendorDashboard />
                    </section>
                </div>
            </div>
        </>
    )
}
