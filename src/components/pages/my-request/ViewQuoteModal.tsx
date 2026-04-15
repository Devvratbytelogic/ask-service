'use client'

import moment from 'moment'
import { BackArrowSVG, CalendarSVG, LocationSVG, NoteIconSVG, StarRatingIconSVG, TimeIconSVG } from '@/components/library/AllSVG'
import { RootState } from '@/redux/appStore'
import { closeModal, openModal } from '@/redux/slices/allModalSlice'
import { Button, Select, SelectItem, Spinner } from '@heroui/react'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { useGetServiceRequestQuotesQuery } from '@/redux/rtkQueries/clientSideGetApis'

const SORT_OPTIONS = [
    { key: 'price_low', label: 'Prix croissant' },
    { key: 'price_high', label: 'Prix décroissant' },
    { key: 'rating', label: 'Mieux notés' },
    { key: 'reviews', label: 'Le plus d\'avis' },
]

export default function ViewQuoteModal() {
    const dispatch = useDispatch()
    const modalData = useSelector((state: RootState) => state.allCommonModal.data)
    const modalRequest = modalData?.request;
    const requestId = modalRequest?._id ?? null
    const [sortBy, setSortBy] = useState<string>('price_low')

    const { data: apiData, isLoading } = useGetServiceRequestQuotesQuery(
        { requestId: requestId ?? '', sort: sortBy },
        { skip: !requestId }
    )
    const quotes = apiData?.data?.quotes ?? [];

    const request = apiData?.data?.request ?? null
    const handleClose = () => dispatch(closeModal())
    // console.log ('apiData in view quote modal', apiData);
    // console.log('Vendor up', quote?.responded_in_hours);
    
    return (
        <>
            {/* Header */}
            <div className="shrink-0">
                <div className="flex items-start justify-between gap-4 p-4 border-b border-borderDark">
                    <div className="flex items-start gap-3 min-w-0">
                        <Button
                            onPress={handleClose}
                            isIconOnly
                            className="btn_radius btn_bg_transparent"
                        >
                            <BackArrowSVG />
                        </Button>
                        <div className="space-y-1">
                            <h2 className="font-bold text-xl text-fontBlack">{`Devis – ${request?.service_title ?? 'Unknown Service'}`}</h2>
                            <p className="text-xs text-darkSilver">
                                Demande {request?.request_id ?? 'Unknown Request'}
                                <span className="mx-1.5">•</span>
                                {request?.quotes_count ?? 0} devis reçu
                            </p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-darkSilver">
                                <span className="flex items-center gap-1.5">
                                    <CalendarSVG />
                                    {request?.date ? moment(request.date).format('DD-MM-YYYY [à] HH:mm') : 'Unknown Date'}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <LocationSVG />
                                    {request?.location ?? 'Unknown Location'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <Button
                        className="btn_radius btn_bg_white"
                        onPress={() =>
                            dispatch(
                                openModal({
                                    componentName: 'CloseRequestModal',
                                    data: { request: request ?? null },
                                    modalSize: 'lg',
                                    modalPadding: 'p-0!',
                                })
                            )
                        }
                    >
                        Clôturer la demande
                    </Button>
                </div>
                {/* Summary & Sort */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-2 border-b border-borderDark bg-[#F9FAFB] p-4 px-6">
                    <p className="text-sm text-fontBlack">
                        {request?.quotes_count ?? 0} devis reçu • Comparez et choisissez le Meilleur
                    </p>
                    <div className="flex flex-nowrap items-center gap-2">
                        <span className="text-sm w-full text-fontBlack font-medium">Trier par :</span>
                        <Select
                            className="min-w-50"
                            selectedKeys={[sortBy]}
                            onSelectionChange={(keys) => {
                                const key = Array.from(keys as Set<string>)[0]
                                if (key) setSortBy(key)
                            }}
                            classNames={{
                                trigger: 'border border-borderDark bg-white shadow-none min-h-9',
                            }}
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <SelectItem key={opt.key}>{opt.label}</SelectItem>
                            ))}
                        </Select>
                    </div>
                </div>
            </div>


            {/* Quote cards */}
            <div className="flex-1 overflow-y-auto px-6 py-3 space-y-4">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : quotes && quotes?.length > 0 ? quotes?.map((quote) => (
                    <div
                        key={quote?._id}
                        className="border border-borderDark rounded-2xl p-5 bg-white shadow-none hover:border-primaryColor/30 transition-colors"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="font-bold text-base text-fontBlack">{quote?.provider_name}</h3>
                                    {quote?.status === 'IGNORED' && (
                                        <span className="rounded-full bg-red-500 text-white text-xs font-medium px-2 py-0.5">
                                            Refusé
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-darkSilver">
                                    <StarRatingIconSVG />
                                    <span className="font-medium text-fontBlack">{quote?.rating}</span>
                                    <span>({quote?.reviews_count} avis)</span>
                                </div>
                                <p className="text-sm text-fontBlack">{quote?.service_description}</p>
                                <div className="flex flex-wrap gap-4 text-sm text-darkSilver">
                                    {/* <span className="flex items-center gap-1.5">
                                        <TimeIconSVG />
                                        répondu il y a {(() => {
                                            const h = parseFloat(quote?.responded_in_hours ?? '0')
                                            if (h < 1) return `${Math.round(h * 60)} min`
                                            if (h < 24) return `${Math.round(h)} h`
                                            const days = Math.round(h / 24)
                                            return `${days} jour${days > 1 ? 's' : ''}`
                                        })()}
                                    </span> */}
                                    <span className="flex items-center gap-1.5">
                                        <NoteIconSVG />
                                        {quote?.price_display}
                                    </span>
                                </div>
                            </div>
                            <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-borderDark sm:border-0">
                                <div className="text-left sm:text-right">
                                    <p className="font-bold text-xl text-fontBlack">{quote?.price} €</p>
                                </div>
                                <Button
                                    size="sm"
                                    className="btn_radius btn_bg_blue font-medium w-full sm:w-auto"
                                    onPress={() =>
                                        dispatch(
                                            openModal({
                                                componentName: 'QuoteDetailModal',
                                                data: {
                                                    requestId: request?._id,
                                                    quoteId: quote?._id ?? quote?._id,
                                                    request,
                                                    quote: { ...quote, price: quote?.price, providerName: quote?.provider_name, rating: quote?.rating, reviews: quote?.reviews_count },
                                                },
                                                modalSize: '3xl',
                                                modalPadding: 'p-0!',
                                                hideCloseButton: true,
                                            })
                                        )
                                    }
                                >
                                    Voir les détails
                                </Button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-fontBlack">Aucun devis trouvé</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 px-6 mt-auto border-t border-borderDark bg-[#F9FAFB]">
                <p className="text-sm text-darkSilver">Vos coordonnées restent confidentielles jusqu&apos;à l&apos;acceptation d&apos;un devis</p>
                <Button
                    onPress={handleClose}
                    className="btn_radius btn_bg_white"
                >
                    Retour au tableau de bord
                </Button>
            </div>
        </>
    )
}
