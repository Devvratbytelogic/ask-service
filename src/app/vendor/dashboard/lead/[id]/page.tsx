import LeadFullDetails from '@/components/vendor/dashboard/lead/LeadFullDetails'

interface LeadDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
    const { id } = await params
   
   
    return (
        <div className="body_x_axis_padding ">
            <LeadFullDetails id={id} />
        </div>
    )
}
