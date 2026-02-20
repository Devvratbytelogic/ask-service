import LeadFullDetails from '@/components/vendor/dashboard/lead/LeadFullDetails'

interface LeadDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
    const { id } = await params
    // TODO: Fetch lead data by id from API
    const lead = {
        id,
        title: 'House Cleaning Request',
        postedAt: 'Posted 8 hours ago',
        creditsToUnlock: 3,
        clientName: 'Sarah Johnson',
        clientInitials: 'SJ',
        memberSince: 'Jan 2024',
        businessType: 'B2C',
        phoneMasked: '09XXXXXXXX',
        emailMasked: 'eXXXXXX@example.com',
        location: 'East London • E14 9XX',
        serviceType: 'Residential cleaning',
        frequency: 'Weekly',
        clientType: 'Individual',
        tasks: ['General cleaning', 'Floor cleaning', 'Kitchen / breakroom'],
        preferredStartDate: '1 February 2026',
        preferredTime: 'Morning (8am-12pm)',
    }
    return (
        <div className="body_x_axis_padding ">
            <LeadFullDetails lead={lead} />
        </div>
    )
}
