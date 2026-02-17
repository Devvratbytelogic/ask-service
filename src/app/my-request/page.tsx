import AllRequests from '@/components/pages/my-request/AllRequests'

export default function MyRequestPage() {
    return (
        <>
            <div className="container_y_padding_lg body_x_axis_padding pb-10!">
                <div className='text-center'>
                    <h1 className="header_text font-bold">My Requests</h1>
                    <p className='text-lightBlack'>Manage and track your service requests</p>
                </div>
                <div className="container_y_padding pb-0!">
                    <AllRequests />
                </div>
            </div>
        </>
    )
}
