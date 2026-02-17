'use client'

import { BackArrowSVG, CheckGreenIconSVG, CircleXmarkIconSVG, FileUploadIconSVG, StarRatingIconSVG } from '@/components/library/AllSVG'
import { RootState } from '@/redux/appStore'
import { closeModal } from '@/redux/slices/allModalSlice'
import { Button } from '@heroui/react'
import { useDispatch, useSelector } from 'react-redux'
import { FaCheck, FaFilePdf, FaRegCircleXmark } from 'react-icons/fa6'
import { HiOutlineArrowDownTray } from 'react-icons/hi2'

const DEFAULT_QUOTE_DETAIL = {
    providerName: 'ProClean Services Ltd',
    rating: 4.9,
    reviews: 127,
    yearsInBusiness: '12 years in business',
    price: 85,
    perVisit: 'per visit',
    validUntil: '21 Jan 2026',
    serviceDescription:
        'We offer a comprehensive weekly deep cleaning service for your 3-bedroom property. Our service includes all rooms, kitchen deep clean, bathroom sanitization, and we use eco-friendly, non-toxic cleaning products that are safe for children and pets.',
    whatsIncluded: [
        'Deep cleaning of all rooms',
        'Kitchen appliances and surfaces',
        'Bathroom sanitization',
        'Vacuuming and mopping',
        'Dusting and polishing',
        'Window cleaning (interior)',
        'Eco-friendly products included',
    ],
    notIncluded: [
        'Exterior window cleaning',
        'Carpet deep cleaning',
        'Oven deep clean (available as add-on)',
    ],
    availability: 'Monday to Friday, 9:00 AM - 5:00 PM',
    quoteValidFor: '7 days',
    pdfFileName: 'Quote.pdf',
    pdfSize: '5.3MB',
}

export default function QuoteDetailModal() {
    const dispatch = useDispatch()
    const modalData = useSelector((state: RootState) => state.allCommonModal.data)
    const quote = modalData?.quote ?? null
    const detail = { ...DEFAULT_QUOTE_DETAIL, ...quote }

    const handleClose = () => dispatch(closeModal())

    const handleIgnoreQuote = () => {
        // TODO: mark quote as ignored, then close or go back
        handleClose()
    }

    const handleChatWithVendor = () => {
        // TODO: open chat
        handleClose()
    }

    const handleDownloadPdf = () => {
        // TODO: trigger PDF download
    }

    return (
        <>
            {/* Header */}
            <div className="shrink-0 flex items-start gap-3 p-4 border-b border-borderDark">
                <Button onPress={handleClose} isIconOnly className="btn_radius btn_bg_transparent shrink-0">
                    <BackArrowSVG />
                </Button>
                <div className="min-w-0">
                    <h2 className="font-bold text-xl text-fontBlack">{detail.providerName}</h2>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-sm text-darkSilver">
                        <span className="flex items-center gap-1.5">
                            <StarRatingIconSVG />
                            <span className="font-medium text-fontBlack">{detail.rating}</span>
                            <span>({detail.reviews} reviews)</span>
                        </span>
                        <span className="text-darkSilver">•</span>
                        <span>{detail.yearsInBusiness}</span>
                    </div>
                </div>
            </div>

            <div className='flex-1 overflow-y-auto px-6'>
                {/* Quote price card */}
                <div className="shrink-0 mt-4 p-4 rounded-2xl border border-[#BEDBFF] bg-linear-to-br from-[#EFF6FF] to-[#EEF2FF] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-xs text-darkSilver">Quote price</p>
                        <p className="font-bold text-2xl text-fontBlack mt-0.5">€{detail.price}</p>
                        <p className="text-xs text-darkSilver">{detail.perVisit}</p>
                    </div>
                    <div className="text-left sm:text-right">
                        <p className="text-xs text-darkSilver">Valid until</p>
                        <p className="text-sm text-fontBlack font-semibold mt-0.5">{detail.validUntil}</p>
                    </div>
                </div>

                {/* Service Description */}
                <div className="mt-6">
                    <h3 className="font-semibold text-base text-fontBlack">Service Description</h3>
                    <p className="text-sm text-darkSilver mt-2 leading-relaxed">{detail.serviceDescription}</p>
                </div>

                {/* What's Included */}
                <div className="mt-6">
                    <h3 className="font-semibold text-base text-fontBlack">What&apos;s Included</h3>
                    <ul className="mt-2 space-y-2">
                        {detail.whatsIncluded.map((item: string, i: number) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-fontBlack">
                                <CheckGreenIconSVG />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Not Included */}
                <div className="mt-6">
                    <h3 className="font-semibold text-base text-fontBlack">Not Included</h3>
                    <ul className="mt-2 space-y-2">
                        {detail.notIncluded.map((item: string, i: number) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-darkSilver">
                                <CircleXmarkIconSVG />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Availability & Quote validity */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                        <p className="text-xs text-darkSilver">Availability</p>
                        <p className="text-sm text-fontBlack mt-1">{detail.availability}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                        <p className="text-xs text-darkSilver">Quote valid for</p>
                        <p className="text-sm text-fontBlack mt-1">{detail.quoteValidFor}</p>
                    </div>
                </div>

                {/* Quote from vendor (PDF) */}
                <div className="mt-6">
                    <h3 className="font-semibold text-base text-fontBlack">Quote from the vendor</h3>
                    <button
                        type="button"
                        onClick={handleDownloadPdf}
                        className="mt-2 w-full flex items-center gap-4 p-4 rounded-xl bg-transparent border border-borderDark hover:border-primaryColor/40 transition-colors text-left"
                    >
                        <FileUploadIconSVG />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-fontBlack">{detail.pdfFileName}</p>
                            <p className="text-xs text-darkSilver">{detail.pdfSize}</p>
                        </div>
                        <HiOutlineArrowDownTray className="size-5 shrink-0 text-fontBlack" />
                    </button>
                </div>
            </div>

            {/* Action buttons */}
            {/* <div className="mt-8 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                <Button
                    onPress={handleIgnoreQuote}
                    className="btn_radius btn_bg_white font-medium flex-1 sm:flex-initial"
                >
                    Ignore quote
                </Button>
                <Button
                    onPress={handleChatWithVendor}
                    className="btn_radius btn_bg_blue font-medium flex-1 sm:flex-initial"
                >
                    Chat with vendor
                </Button>
            </div> */}
            <div className="shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 px-6 mt-auto border-t border-borderDark bg-[#F9FAFB]">
                <Button
                    onPress={handleIgnoreQuote}
                    className="btn_radius btn_bg_white w-full"
                >
                    Ignore quote
                </Button>
                <Button
                    onPress={handleChatWithVendor}
                    className="btn_radius btn_bg_blue w-full"
                >
                    Chat with vendor
                </Button>
            </div>
        </>
    )
}
