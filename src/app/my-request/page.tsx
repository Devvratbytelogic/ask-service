'use client'
import AllRequests from '@/components/pages/my-request/AllRequests'
import { getCreateRequestRoutePath } from '@/routes/routes'
import { Button } from '@heroui/react'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

export default function MyRequestPage() {
    return (
        <>
            <div className="navbar_y_axis_padding body_x_axis_padding">
                <div className='text-center'>
                    <h1 className="header_text font-bold">My Requests</h1>
                    <p className='text-lightBlack'>Manage and track your service requests</p>
                </div>
                <div className="container_y_padding pb-0! flex flex-col gap-4">
                    <div className="flex justify-end">
                        <Button
                            as={Link}
                            href={getCreateRequestRoutePath()}
                            className='btn_radius btn_bg_blue'
                            endContent={<FiArrowRight />}
                        >
                            Create a new request
                        </Button>
                    </div>
                    <AllRequests />
                </div>
            </div>
        </>
    )
}
