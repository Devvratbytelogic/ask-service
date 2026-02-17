'use client'

import { BackArrowSVG, CalendarSVG, LocationSVG, NoteIconSVG, StarRatingIconSVG, TimeIconSVG } from '@/components/library/AllSVG'
import { RootState } from '@/redux/appStore'
import { closeModal, openModal } from '@/redux/slices/allModalSlice'
import { Button, Select, SelectItem } from '@heroui/react'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'

const SORT_OPTIONS = [
    { key: 'price_low', label: 'Price : Low to High' },
    { key: 'price_high', label: 'Price : High to Low' },
    { key: 'rating', label: 'Rating' },
    { key: 'reviews', label: 'Most reviews' },
]

const DUMMY_QUOTES = [
    { id: '1', providerName: 'ProClean Services Ltd', rating: 4.9, reviews: 127, description: 'Weekly deep clean, eco-friendly products included', respondedIn: '2', visitHours: '3-4', price: 85, ignored: false },
    { id: '2', providerName: 'Sparkle Home Care', rating: 4.8, reviews: 89, description: 'Thorough cleaning with optional add-ons', respondedIn: '3', visitHours: '2-3', price: 72, ignored: false },
    { id: '3', providerName: 'Elite Cleaning Solutions', rating: 4.7, reviews: 204, description: 'Premium cleaning, same-day available', respondedIn: '1', visitHours: '4-5', price: 95, ignored: true },
    { id: '4', providerName: 'Fresh Start Cleaners', rating: 4.6, reviews: 56, description: 'Eco-friendly products, flexible scheduling', respondedIn: '4', visitHours: '2-3', price: 68, ignored: false },
    { id: '5', providerName: 'Clean & Tidy Co', rating: 4.9, reviews: 312, description: 'Regular and one-off cleans, insured', respondedIn: '2', visitHours: '3-4', price: 78, ignored: false },
]

const defaultRequest = {
    title: 'House Cleaning',
    requestId: 'REQ-A7X9K2',
    quotesCount: 5,
    date: '14 Jan 2026',
    location: 'London, SW1A 1AA',
}

export default function ViewQuoteModal() {
    const dispatch = useDispatch()
    const modalData = useSelector((state: RootState) => state.allCommonModal.data)
    const request = modalData ?? defaultRequest
    const [sortBy, setSortBy] = useState<string>('price_low')

    const handleClose = () => dispatch(closeModal())

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
                            <h2 className="font-bold text-xl text-fontBlack">{`Quotes for ${request?.title ?? defaultRequest.title}`}</h2>
                            <p className="text-xs text-darkSilver">
                                Request {request?.requestId ?? defaultRequest.requestId}
                                <span className="mx-1.5">•</span>
                                {request?.quotesCount ?? defaultRequest.quotesCount} quotes received
                            </p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-darkSilver">
                                <span className="flex items-center gap-1.5">
                                    <CalendarSVG />
                                    {request?.date ?? defaultRequest.date}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <LocationSVG />
                                    {request?.location ?? defaultRequest.location}
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
                                    data: { request: request ?? defaultRequest },
                                    modalSize: 'lg',
                                    modalPadding: 'p-0!',
                                })
                            )
                        }
                    >
                        Close request
                    </Button>
                </div>
                {/* Summary & Sort */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-2 border-b border-borderDark bg-[#F9FAFB] p-4 px-6">
                    <p className="text-sm text-fontBlack">
                        Showing {request?.quotesCount ?? 5} quotes • Compare and select the best for you
                    </p>
                    <div className="flex flex-nowrap items-center gap-2">
                        <span className="text-sm w-full text-fontBlack font-medium">Sort by:</span>
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
                {DUMMY_QUOTES && DUMMY_QUOTES?.length > 0 ? DUMMY_QUOTES?.map((quote) => (
                    <div
                        key={quote?.id}
                        className="border border-borderDark rounded-2xl p-5 bg-white shadow-none hover:border-primaryColor/30 transition-colors"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="font-bold text-base text-fontBlack">{quote?.providerName}</h3>
                                    {quote?.ignored && (
                                        <span className="rounded-full bg-red-500 text-white text-xs font-medium px-2 py-0.5">
                                            Ignored
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-darkSilver">
                                    <StarRatingIconSVG />
                                    <span className="font-medium text-fontBlack">{quote?.rating}</span>
                                    <span>({quote?.reviews} reviews)</span>
                                </div>
                                <p className="text-sm text-fontBlack">{quote?.description}</p>
                                <div className="flex flex-wrap gap-4 text-sm text-darkSilver">
                                    <span className="flex items-center gap-1.5">
                                        <TimeIconSVG />
                                        Responded in {quote?.respondedIn} hours
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <NoteIconSVG />
                                        {quote?.visitHours} hours per visit
                                    </span>
                                </div>
                            </div>
                            <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-borderDark sm:border-0">
                                <div className="text-left sm:text-right">
                                    <p className="font-bold text-xl text-fontBlack">€{quote?.price}</p>
                                    <p className="text-sm text-darkSilver">per visit</p>
                                </div>
                                <Button
                                    size="sm"
                                    className="btn_radius btn_bg_blue font-medium w-full sm:w-auto"
                                    onPress={() =>
                                        dispatch(
                                            openModal({
                                                componentName: 'QuoteDetailModal',
                                                data: { quote: { ...quote, price: quote?.price, providerName: quote?.providerName, rating: quote?.rating, reviews: quote?.reviews } },
                                                modalSize: '3xl',
                                                modalPadding: 'p-0!',
                                                hideCloseButton: true,
                                            })
                                        )
                                    }
                                >
                                    View details
                                </Button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-fontBlack">No quotes found</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 px-6 mt-auto border-t border-borderDark bg-[#F9FAFB]">
                <p className="text-sm text-darkSilver">Your contact details remain private until you accept a quote</p>
                <Button
                    onPress={handleClose}
                    className="btn_radius btn_bg_white"
                >
                    Back to dashboard
                </Button>
            </div>
        </>
    )
}
