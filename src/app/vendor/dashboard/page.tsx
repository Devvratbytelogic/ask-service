import VendorDashboard from '@/components/vendor/dashboard/VendorDashboard'
import VendorUnderReviewBanner from '@/components/vendor/dashboard/VendorUnderReviewBanner'

export default function VendorDashboardPage() {
    return (
        <>
            <VendorUnderReviewBanner />
            <div className="body_x_axis_padding">
                <h1 className='header_text_md'>Vendor <span className='text-darkSilver'>Dashboard</span></h1>
                <p className='text-sm text-[#4A5565]'>Welcome back • Manage your leads and quotes</p>
                <VendorDashboard />
            </div>
        </>
    )
}
