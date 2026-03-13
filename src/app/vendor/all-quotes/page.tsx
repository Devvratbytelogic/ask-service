import AccountSidebar, { vendorNavItems } from '@/components/pages/my-account/AccountSidebar'
import VendorAllQuotes from '@/components/vendor/dashboard/VendorAllQuotes'

export default function VendorAllQuotesPage() {
    return (
        <div className="body_x_axis_padding min-h-screen">
            <h1 className="header_text_md">Vendor <span className="text-darkSilver">All Quotes</span></h1>
            <p className="text-sm text-[#4A5565]">View and manage all quotes you&apos;ve sent</p>
            <div className="flex flex-col lg:flex-row gap-6 mt-8">
                <aside className="w-full lg:w-[320px] shrink-0 self-start sticky top-24 z-40">
                    <AccountSidebar navItems={vendorNavItems} />
                </aside>
                <section className="relative flex-1 min-w-0">
                    <VendorAllQuotes />
                </section>
            </div>
        </div>
    )
}
