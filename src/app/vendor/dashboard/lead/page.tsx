import type { Metadata } from 'next'
import LeadListView from '@/components/vendor/dashboard/lead/LeadListView'

export const metadata: Metadata = {
    title: 'Ask-Service — Prospects disponibles',
    description: 'Parcourez les prospects disponibles et débloquez ceux qui vous intéressent.',
}

export default function LeadListPage() {
    return (
        <div className="min-h-screen bg-appBg">
            <LeadListView />
        </div>
    )
}
