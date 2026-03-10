'use client'
import { CalendarSVG, HorizontalDotsSVG, InfoSVG, LocationSVG, RequestNumberSVG } from '@/components/library/AllSVG'
import RequestFilters from '@/components/pages/my-request/RequestFilters'
import { useGetCreatedServicesQuery } from '@/redux/rtkQueries/clientSideGetApis'
import { openModal } from '@/redux/slices/allModalSlice'
import type { DataEntity } from '@/types/allRequests'
import { Button, Pagination, Spinner, Tooltip } from '@heroui/react'
import { useEffect, useState } from 'react'
import { FiArrowUpRight, FiInfo } from 'react-icons/fi'
import { useDispatch } from 'react-redux'

const ITEMS_PER_PAGE = 5

/** Maps UI filter key to API status param. Omit status for 'all' so backend can return all. */
function statusFilterToApi(statusFilter: string): string | undefined {
    if (statusFilter === 'all') return 'ACTIVE'
    if (statusFilter === 'pending') return 'PENDING'
    if (statusFilter === 'completed') return 'COMPLETED'
    return 'ACTIVE'
}

function formatRequestDate(dateStr: string) {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}


const SEARCH_DEBOUNCE_MS = 400

export default function AllRequests() {
    const dispatch = useDispatch()
    const [page, setPage] = useState(1)
    const [searchInput, setSearchInput] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all')
    const [serviceFilter, setServiceFilter] = useState<string>('all')

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), SEARCH_DEBOUNCE_MS)
        return () => clearTimeout(t)
    }, [searchInput])

    useEffect(() => {
        setPage(1)
    }, [debouncedSearch, statusFilter, serviceFilter])

    const { data, isLoading, isError } = useGetCreatedServicesQuery({
        ...(debouncedSearch && { search: debouncedSearch }),
        status: statusFilterToApi(statusFilter),
        ...(serviceFilter && serviceFilter !== 'all' && { service: serviceFilter }),
        page,
        limit: ITEMS_PER_PAGE,
    })
    const apiData = data?.data
    const requests = (apiData?.data ?? [])
    const totalPages = apiData?.pagination?.totalPages ?? 0
    const totalCount = apiData?.pagination?.total ?? 0

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-50">
                <Spinner size="lg" color="primary" />
            </div>
        )
    }

    if (isError) {
        return (
            <div className="text-center py-12 text-darkSilver">
                Failed to load requests. Please try again.
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-6 lg:grid-cols-12 gap-4 items-center">
                <div className="col-span-4">
                    <h2 className='header_text_md'>Total Requests: <span className='text-primaryColor'>{totalCount}</span></h2>
                </div>
                <div className="col-span-8">
                    <div className="flex flex-wrap gap-4 lg:justify-end items-center">
                        <RequestFilters
                            search={searchInput}
                            onSearchChange={setSearchInput}
                            statusFilter={statusFilter}
                            onStatusFilterChange={(key) => setStatusFilter(key as 'all' | 'pending' | 'completed')}
                            serviceFilter={serviceFilter}
                            onServiceFilterChange={setServiceFilter}
                        />
                    </div>
                </div>
            </div>
            <hr className="custom_hr" />
            <div className="flex flex-col gap-4">
                {requests?.map((request, index) => (
                    <div key={index} className="border border-borderDark px-6 py-5 rounded-2xl shadow-none">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg text-fontBlack">{request?.service_category?.title}</h3>
                                    {request?.status_label !== 'Quotes received' && <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-800 px-3 py-1.5 text-sm font-medium">
                                        <FiInfo size={14} />
                                        Waiting for quotes
                                    </span>}
                                    <Tooltip content="This request will stay open for 7 days. After that, it will close automatically.">
                                        <span className="inline-flex cursor-help">
                                            <InfoSVG />
                                        </span>
                                    </Tooltip>
                                </div>
                                <p className="text-base text-fontBlack">{request?.note}</p>
                                <div className="flex flex-wrap gap-4 sm:gap-6 text-sm text-darkSilver">
                                    <span className="flex items-center gap-1.5">
                                        <CalendarSVG />
                                        {formatRequestDate(request?.preferred_start_date ?? '')}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <LocationSVG />
                                        {request?.location}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-fontBlack font-medium">
                                        <RequestNumberSVG />
                                        {request?.request_id}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-2 shrink-0">
                                {request?.status_label === 'Quotes received' ? (
                                    <Button
                                        className="btn_radius btn_bg_blue font-medium"
                                        endContent={<FiArrowUpRight size={20} />}
                                        onPress={() => dispatch(openModal({
                                            componentName: 'ViewQuoteModal',
                                            data: {
                                                request: request,
                                                rawRequest: request,
                                            },
                                            modalSize: '3xl',
                                            modalPadding: 'p-0!',
                                            hideCloseButton: true,
                                        }))}
                                    >
                                        View {request?.quotes_count} quotes
                                    </Button>
                                ) : (
                                    <p className="text-sm text-darkSilver">Waiting for responses...</p>
                                )}
                                <Button
                                    isIconOnly
                                    className="btn_radius btn_bg_white"
                                    variant="faded"
                                    onPress={() => dispatch(openModal({
                                        componentName: 'CloseRequestModal',
                                        data: { request },
                                        modalSize: 'md',
                                    }))}
                                >
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
