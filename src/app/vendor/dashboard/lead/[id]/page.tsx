import type { Metadata } from 'next'
import LeadDetailView from '@/components/vendor/dashboard/lead/LeadDetailView'

export const metadata: Metadata = {
    title: 'Ask-Service — Détail prospect',
    description: 'Consultez et débloquez ce prospect.',
}

interface Props {
    params: Promise<{ id: string }>
}

export default async function LeadDetailPage({ params }: Props) {
    const { id } = await params
    return (
        <div className="min-h-screen bg-appBg">
            <LeadDetailView leadId={id} />
        </div>
    )
}
