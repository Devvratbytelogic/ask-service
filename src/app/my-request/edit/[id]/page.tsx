import EditRequest from '@/components/pages/editRequest/EditRequest'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ask-Service — Modifier ma demande',
  description: 'Modifiez les détails de votre demande de service.',
}

export default async function EditRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="min-h-screen bg-appBg">
      <EditRequest requestId={id} />
    </div>
  )
}
