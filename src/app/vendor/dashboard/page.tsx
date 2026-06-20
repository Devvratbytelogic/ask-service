import type { Metadata } from 'next'
import VendorDashboardOverview from '@/components/vendor/dashboard/VendorDashboardOverview'

export const metadata: Metadata = {
    title: 'Ask-Service — Tableau de bord',
    description: 'Gérez vos opportunités et suivez vos devis.',
}

export default function VendorDashboardPage() {
    return (
        <div className="min-h-screen bg-appBg">
            <VendorDashboardOverview />
        </div>
    )
}
