import AccountSidebar, { vendorNavItems } from '@/components/pages/my-account/AccountSidebar'
import CreditsWallet from '@/components/vendor/credits/CreditsWallet'

export default function CreditsPage() {
    return (
        <div className="body_x_axis_padding min-h-screen">
            <h1 className="header_text_md">Credits <span className="text-darkSilver">Wallet</span></h1>
            <p className="text-sm text-[#4A5565]">Manage your credits and purchase more</p>
            <div className="flex flex-col lg:flex-row gap-6 mt-8">
                <aside className="w-full lg:w-[320px] shrink-0 self-start sticky top-24">
                    <AccountSidebar navItems={vendorNavItems} />
                </aside>
                <section className="relative flex-1 min-w-0">
                    <CreditsWallet />
                </section>
            </div>
        </div>
    )
}
