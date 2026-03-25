'use client'

import AllRequests from '@/components/pages/my-request/AllRequests'


export default function MyRequestPage() {
    return (
        <div className="min-h-screen body_x_axis_padding navbar_y_axis_padding">
            <div className='text-center mb-8'>
                <h1 className="header_text font-bold">Mes demandes</h1>
                <p className='text-lightBlack'>Gérez et suivez vos demandes de service</p>
            </div>
            <AllRequests />
        </div>
    )
}
