'use client'
import { CalendarSVG, HorizontalDotsSVG, InfoSVG, LocationSVG, RequestNumberSVG } from '@/components/library/AllSVG'
import RequestFilters from '@/components/pages/my-request/RequestFilters'
import { useGetCreatedServicesQuery, useGetGlobalSettingsQuery, useGetServiceCategoriesQuery } from '@/redux/rtkQueries/clientSideGetApis'
import { openModal } from '@/redux/slices/allModalSlice'
import { getCreateRequestRoutePath } from '@/routes/routes'
import type { RequestServiceFormValues } from '@/components/pages/RequestServiceFlow/RequestServiceFlowIndex'
import type { DataEntity } from '@/types/allRequests'
import Link from 'next/link'
import { FiArrowRight, FiEdit2 } from 'react-icons/fi'
import { Button, Pagination, Spinner, Tooltip } from '@heroui/react'
import { useEffect, useState } from 'react'
import { FiArrowUpRight, FiInfo } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import 'moment/locale/fr'

/** Format API ISO date (e.g. 2026-03-14T00:00:00.000Z) to yyyy-MM-dd for date inputs. */
function apiDateToInputValue(isoDate?: string | null): string {
    if (!isoDate?.trim()) return ''
    const d = new Date(isoDate)
    if (Number.isNaN(d.getTime())) return ''
    return d.toISOString().slice(0, 10)
}

/** Map a created-service request to RequestServiceFlowIndex initial form values (for Edit flow). */
function requestToInitialFormValues(request: DataEntity): RequestServiceFormValues {
    const cd = request?.contact_details
    const clientType = cd?.client_type === 'Entreprise' || cd?.client_type === 'Company' ? 'Company' : 'Individual'
    const childId = request?.child_category?._id
    const isOther = !!request?.manual_child_category
    const dynamicAnswers: Record<string, string | string[]> = {}
    if (request && 'dynamic_answers' in request && Array.isArray((request as { dynamic_answers?: { question_id: string; value: string }[] }).dynamic_answers)) {
        (request as { dynamic_answers: { question_id: string; value: string }[] }).dynamic_answers.forEach((a) => {
            dynamicAnswers[a.question_id] = a.value?.includes(',') ? a.value.split(',').map((s) => s.trim()) : a.value ?? ''
        })
    }
    return {
        pincode: request?.pincode ?? '',
        parentServiceId: childId ?? '',
        parentServiceName: isOther ? 'other' : (childId ?? ''),
        otherServiceName: typeof request?.manual_child_category === 'string' ? request.manual_child_category : '',
        childServiceId: '',
        childServiceIds: [],
        serviceNote: request?.note ?? '',
        customerFirstName: cd?.first_name ?? '',
        customerLastName: cd?.last_name ?? '',
        clientType,
        customerPhoneNumber: cd?.phone ?? '',
        customerEmail: cd?.email ?? '',
        dynamicAnswers,
    }
}

const ITEMS_PER_PAGE = 5


function formatRequestDate(dateStr: string) {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}


const SEARCH_DEBOUNCE_MS = 400

export default function AllRequests() {
    const dispatch = useDispatch()
    const [page, setPage] = useState(1)
    const [searchInput, setSearchInput] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'ACTIVE' | 'CANCELLED'>('all')
    const [serviceFilter, setServiceFilter] = useState<string>('all')
    const { data: serviceCategoriesData } = useGetServiceCategoriesQuery()
    const { data: globalSettings } = useGetGlobalSettingsQuery()
    const quoteExpired = globalSettings?.data?.quote_expired ?? 7

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), SEARCH_DEBOUNCE_MS)
        return () => clearTimeout(t)
    }, [searchInput])

    useEffect(() => {
        setPage(1)
    }, [debouncedSearch, statusFilter, serviceFilter])

    const { data, isLoading, isError } = useGetCreatedServicesQuery({
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(serviceFilter && serviceFilter !== 'all' && { service: serviceFilter }),
        page,
        limit: ITEMS_PER_PAGE,
    })
    const apiData = data?.data
    const requests = (apiData?.data ?? [])
    const totalPages = apiData?.pagination?.totalPages ?? 0
    const totalCount = apiData?.pagination?.total ?? 0



    if (isError) {
        return (
            <div className="text-center py-12 text-darkSilver">
                Échec du chargement des demandes. Veuillez réessayer.
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-12 gap-2 md:gap-4 items-center">
                <div className="col-span-full md:col-span-7">
                    <h2 className='header_text_md'>Nombre total de demandes : <span className='text-primaryColor'>{totalCount}</span></h2>
                </div>
                <div className="col-span-full md:col-span-5">
                    <div className="flex justify-end">
                        <Button
                            as={Link}
                            href={getCreateRequestRoutePath()}
                            className='btn_radius btn_bg_blue'
                            endContent={<FiArrowRight />}
                        >
                            Créer une nouvelle demande
                        </Button>
                    </div>
                </div>
                <div className="col-span-full">
                    <div className="flex flex-wrap gap-2 lg:justify-end items-center">
                        <RequestFilters
                            search={searchInput}
                            onSearchChange={setSearchInput}
                            statusFilter={statusFilter}
                            onStatusFilterChange={setStatusFilter}
                            serviceFilter={serviceFilter}
                            onServiceFilterChange={setServiceFilter}
                        />
                    </div>
                </div>
            </div>
            <hr className="custom_hr" />
            {isLoading
                ? <div className="flex justify-center items-center min-h-50">
                    <Spinner size="lg" color="primary" />
                </div>
                : <div className='space-y-4'>
                    <div className="flex flex-col gap-4">
                        {requests.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 text-darkSilver">
                                <p className="text-lg font-medium">Aucun résultat trouvé</p>
                                <p className="text-sm mt-1">Essayez de modifier vos filtres ou votre recherche.</p>
                            </div>
                        )}
                        {requests?.map((request, index) => (
                            <div key={index} className="border border-borderDark px-6 py-5 rounded-2xl shadow-none">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="flex-1 min-w-0 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-lg text-fontBlack">{request?.service_category?.title}</h3>
                                            {request?.status_label !== 'Quotes received' && <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-800 px-3 py-1.5 text-sm font-medium">
                                                <FiInfo size={14} />
                                                En attente de devis
                                            </span>}
                                            <Tooltip content={`This request will stay open for ${quoteExpired} days. After that, it will close automatically.`}>
                                                <span className="inline-flex cursor-help">
                                                    <InfoSVG />
                                                </span>
                                            </Tooltip>
                                        </div>
                                        <div className="flex flex-wrap gap-x-6 text-sm text-darkSilver">
                                            <span className="flex items-center gap-1.5">
                                                <CalendarSVG />
                                                Créée {moment(request?.createdAt ?? '').locale('fr').fromNow()} ({moment(request?.createdAt ?? '').locale('fr').format('DD MMM YYYY [à] HH:mm')})
                                            </span>
                                            {request?.preferred_start_date !== null && <span className="flex items-center gap-1.5">
                                                <CalendarSVG />
                                                Preferred start {formatRequestDate(request?.preferred_start_date ?? '')}
                                            </span>}
                                            <span className="flex items-center gap-1.5">
                                                <LocationSVG />
                                                {request?.location}
                                            </span>
                                            <span className="flex items-center gap-1.5 font-medium">
                                                <RequestNumberSVG className="text-darkSilver" />
                                                {request?.request_id}
                                            </span>
                                        </div>
                                        <p className="text-base text-fontBlack wrap-break-word">{request?.note}</p>
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
                                                Voir {request?.quotes_count} devis
                                            </Button>
                                        ) : (
                                            <>
                                                {/* <p className="text-sm text-darkSilver">Waiting for responses...</p> */}
                                                {request?._id && (
                                                    <Button
                                                        className="btn_radius btn_bg_white font-medium"
                                                        variant="faded"
                                                        startContent={<FiEdit2 size={18} />}
                                                        onPress={() => {
                                                            const grandParentId = request?.service_category?._id ?? ''
                                                            const childServices = serviceCategoriesData?.data?.find((c) => c._id === grandParentId)?.child_categories ?? []
                                                            dispatch(openModal({
                                                                componentName: 'RequestServiceFlowIndex',
                                                                data: {
                                                                    request,
                                                                    isEditMode: true,
                                                                    grandParentServiceId: grandParentId,
                                                                    grandParentServiceName: request?.service_category?.title ?? '',
                                                                    child_services: childServices,
                                                                    pincode: request?.pincode ?? '',
                                                                    initialFormValues: requestToInitialFormValues(request),
                                                                },
                                                                modalSize: 'lg',
                                                                // modalPadding: 'px-8 py-6.5',
                                                            }))
                                                        }}
                                                    >
                                                        Modifier
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                        <Button
                                            isIconOnly
                                            className="btn_radius btn_bg_white"
                                            variant="faded"
                                            onPress={() => dispatch(openModal({
                                                componentName: 'CloseRequestModal',
                                                data: { request },
                                                modalSize: 'lg',
                                                modalPadding: 'p-0!',
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
                </div >}
        </>
    )
}
