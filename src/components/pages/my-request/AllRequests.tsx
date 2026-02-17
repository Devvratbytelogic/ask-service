'use client'
import { CalendarSVG, HorizontalDotsSVG, InfoSVG, LocationSVG, RequestNumberSVG } from '@/components/library/AllSVG'
import RequestFilters from '@/components/pages/my-request/RequestFilters'
import { openModal } from '@/redux/slices/allModalSlice'
import { Button, Pagination } from '@heroui/react'
import { useState } from 'react'
import { FiArrowUpRight, FiInfo } from 'react-icons/fi'
import { useDispatch } from 'react-redux'

const ITEMS_PER_PAGE = 5

const DUMMY_REQUESTS = [
    { id: '1', title: 'House Cleaning', description: 'Regular weekly cleaning for 3-bedroom house', date: '14 Jan 2026', location: 'London, SW1A 1AA', requestId: 'REQ-A7X9K2', quotesCount: 5, status: 'has_quotes' as const },
    { id: '2', title: 'Gardening', description: 'Lawn mowing and hedge trimming for front garden', date: '12 Jan 2026', location: 'London, E1 6AN', requestId: 'REQ-B2K4M1', quotesCount: 0, status: 'waiting' as const },
    { id: '3', title: 'House Cleaning', description: 'Deep clean before moving in', date: '18 Jan 2026', location: 'Manchester, M1 1AD', requestId: 'REQ-C8N3P9', quotesCount: 3, status: 'has_quotes' as const },
    { id: '4', title: 'Gardening', description: 'Full garden redesign and planting', date: '10 Jan 2026', location: 'Birmingham, B1 1AA', requestId: 'REQ-D1Q5R2', quotesCount: 0, status: 'waiting' as const },
    { id: '5', title: 'House Cleaning', description: 'One-off end of tenancy cleaning', date: '20 Jan 2026', location: 'London, NW1 2DB', requestId: 'REQ-E9S7T4', quotesCount: 7, status: 'has_quotes' as const },
    { id: '6', title: 'Gardening', description: 'Monthly maintenance and weeding', date: '15 Jan 2026', location: 'Leeds, LS1 1UR', requestId: 'REQ-F4U2V8', quotesCount: 0, status: 'waiting' as const },
    { id: '7', title: 'House Cleaning', description: 'Regular weekly cleaning for 2-bedroom flat', date: '16 Jan 2026', location: 'London, SE1 9SG', requestId: 'REQ-G6W3X1', quotesCount: 4, status: 'has_quotes' as const },
]

export default function AllRequests() {
    const dispatch = useDispatch()
    const [page, setPage] = useState(1)
    const totalPages = Math.ceil(DUMMY_REQUESTS.length / ITEMS_PER_PAGE)
    const paginatedRequests = DUMMY_REQUESTS.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    return (
        <>
            <div className="grid grid-cols-6 lg:grid-cols-12 gap-4 items-center">
                <div className="col-span-6">
                    <h2 className='header_text_md'>Total Requests: <span className='text-primaryColor'>{DUMMY_REQUESTS.length}</span></h2>
                </div>
                <div className="col-span-6">
                    <div className="flex flex-wrap gap-4 lg:justify-end items-center">
                        <RequestFilters />
                    </div>
                </div>
            </div>
            <hr className="custom_hr" />
            <div className="flex flex-col gap-4">
                {paginatedRequests?.map((request) => (
                    <div key={request.id} className="border border-borderDark px-6 py-5 rounded-2xl shadow-none">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg text-fontBlack">{request?.title}</h3>
                                    {request?.status === 'waiting' && <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-800 px-3 py-1.5 text-sm font-medium">
                                        <FiInfo size={14} />
                                        Waiting for quotes
                                    </span>}
                                    <span><InfoSVG /></span>
                                </div>
                                <p className="text-base text-fontBlack">{request?.description}</p>
                                <div className="flex flex-wrap gap-4 sm:gap-6 text-sm text-darkSilver">
                                    <span className="flex items-center gap-1.5">
                                        <CalendarSVG />
                                        {request?.date}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <LocationSVG />
                                        {request?.location}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-fontBlack font-medium">
                                        <RequestNumberSVG />
                                        {request?.requestId}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-2 shrink-0">
                                {request?.status === 'has_quotes' ? (
                                    <Button
                                        className="btn_radius btn_bg_blue font-medium"
                                        endContent={<FiArrowUpRight size={20} />}
                                        onPress={() => dispatch(openModal({
                                            componentName: 'ViewQuoteModal',
                                            data: {
                                                request: request
                                            },
                                            modalSize: '3xl',
                                            modalPadding: 'p-0!',
                                            hideCloseButton: true,
                                        }))}
                                    >
                                        View {request?.quotesCount} quotes
                                    </Button>
                                ) : (
                                    <p className="text-sm text-darkSilver">Waiting for responses...</p>
                                )}
                                <Button isIconOnly className="btn_radius btn_bg_white" variant="faded">
                                    <HorizontalDotsSVG />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <Pagination
                        total={totalPages}
                        page={page}
                        onChange={setPage}
                        showControls
                        color="primary"
                        radius="full"
                        classNames={{
                            cursor: 'bg-primaryColor text-white',
                        }}
                    />
                </div>
            )}
        </>
    )
}
