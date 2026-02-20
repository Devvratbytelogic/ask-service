import VendorDashboard from '@/components/vendor/dashboard/VendorDashboard'

export default function VendorDashboardPage() {
    return (
        <>
            <div className='bg-[#FFFCF8] py-2 text-center text-fontBlack'>Your documents are currently under review for verification. You cannot purchase leads at this time.</div>
            <div className="body_x_axis_padding">
                <h1 className='header_text_md'>Vendor <span className='text-darkSilver'>Dashboard</span></h1>
                <p className='text-sm text-[#4A5565]'>Welcome back • Manage your leads and quotes</p>
                <VendorDashboard />
            </div>
        </>
    )
}
