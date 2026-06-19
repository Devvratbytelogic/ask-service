import type { Metadata } from 'next'
import ClientDashboard from '@/components/pages/ClientDashboardPage/ClientDashboard'

export const metadata: Metadata = {
    title: 'Ask-Service — Mes demandes',
    description: 'Suivez vos demandes et gérez les devis reçus.',
}

export default function ClientDashboardPage() {
    return (
        <div className="min-h-screen bg-[#0D1117]">
            <ClientDashboard />
        </div>
    )
}
