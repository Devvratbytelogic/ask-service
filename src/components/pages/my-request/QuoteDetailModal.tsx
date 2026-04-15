'use client'

import { BackArrowSVG, FileUploadIconSVG, StarRatingIconSVG } from '@/components/library/AllSVG'
import { RootState } from '@/redux/appStore'
import { useGetServiceRequestQuotesDetailQuery } from '@/redux/rtkQueries/clientSideGetApis'
import { useIgnoreQuoteMutation, useUserAccessChatMutation } from '@/redux/rtkQueries/allPostApi'
import { closeModal, openModal } from '@/redux/slices/allModalSlice'
import { addToast, Button, Spinner } from '@heroui/react'
import { useDispatch, useSelector } from 'react-redux'
import { HiOutlineArrowDownTray } from 'react-icons/hi2'
import moment from 'moment'
import 'moment/locale/fr'
import { useRouter } from 'next/navigation'
import { getMessageRoutePath, getVendorProfileRoutePath } from '@/routes/routes'

function formatQuoteDate(dateStr: string) {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function getValidUntilDate(availableStartDate: string, quoteValidDays: number | undefined): string {
    if (!availableStartDate) return '—'
    const start = new Date(availableStartDate)
    if (quoteValidDays == null || quoteValidDays <= 0) return formatQuoteDate(availableStartDate)
    const end = new Date(start)
    end.setDate(end.getDate() + quoteValidDays)
    return formatQuoteDate(end.toISOString())
}

export default function QuoteDetailModal() {
    const dispatch = useDispatch()
    const router = useRouter()
    const modalData = useSelector((state: RootState) => state.allCommonModal.data)
    const requestId = modalData?.requestId ?? modalData?.request?._id ?? null
    const quoteId = modalData?.quoteId ?? modalData?.quote?._id ?? null
    const { data: apiData, isLoading } = useGetServiceRequestQuotesDetailQuery(
        { requestId: requestId ?? '', quoteId: quoteId ?? '' },
        { skip: !requestId || !quoteId }
    )
    const [ignoreQuote, { isLoading: isIgnoring }] = useIgnoreQuoteMutation()
    const [userAccessChat, { isLoading: isAccessingChat }] = useUserAccessChatMutation()

    const handleClose = () => {
        const request = modalData?.request
        if (request) {
            dispatch(openModal({
                componentName: 'ViewQuoteModal',
                data: { request },
                modalSize: '3xl',
                modalPadding: 'p-0!',
                hideCloseButton: true,
            }))
        } else {
            dispatch(closeModal())
        }
    }

    const handleIgnoreQuote = async () => {
        if (!requestId || !quoteId) return
        try {
            await ignoreQuote({ requestId, quoteId }).unwrap()
            dispatch(closeModal())
        } catch {
            // Error handled by RTK Query / can add toast here
        }
    }

    const handleChatWithVendor = async () => {
        if (!requestId || !vendor._id) return addToast({ title: 'Erreur', description: 'Veuillez réessayer plus tard', color: 'danger' })
        try {
            const response = await userAccessChat({
                userId: vendor._id,
                quote_id: quoteId ?? '',
            }).unwrap()
            const chatId = response?.data?._id ?? response?._id
            dispatch(closeModal())
            const url = chatId
                ? `${getMessageRoutePath()}?chatId=${chatId}`
                : getMessageRoutePath()
            router.push(url)
        } catch {
            // Error handled by RTK Query / can add toast here
        }
    }

    const handleDownloadPdf = () => {
        const url = apiData?.data?.quote?.attachment_url
        if (url) window.open(url, '_blank')
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-75 p-6">
                <Spinner size="lg" />
                <p className="text-sm text-darkSilver mt-4">Chargement du devis…</p>
            </div>
        )
    }

    if (!apiData?.data?.quote || !apiData?.data?.vendor) {
        return (
            <div className="flex flex-col items-center justify-center min-h-75 p-6">
                <p className="text-sm text-fontBlack">Quote not found</p>
                <Button onPress={handleClose} className="btn_radius btn_bg_blue mt-4">
                    Close
                </Button>
            </div>
        )
    }

    const quote = apiData.data.quote
    const vendor = apiData.data.vendor
    return (
        <>
            {/* Header */}
            <div className="shrink-0 flex items-start gap-3 p-4 border-b border-borderDark">
                <Button onPress={handleClose} isIconOnly className="btn_radius btn_bg_transparent shrink-0">
                    <BackArrowSVG />
                </Button>
                <div className="min-w-0">
                    <h2 className="font-bold text-xl text-fontBlack cursor-pointer" onClick={() => {router.push(getVendorProfileRoutePath(vendor._id)), dispatch(closeModal())}}>{vendor.provider_name}</h2>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-sm text-darkSilver">
                        <span className="flex items-center gap-1.5">
                            <StarRatingIconSVG />
                            <span className="font-medium text-fontBlack">{vendor.rating}</span>
                            <span>({vendor.reviews_count} notes)</span>
                        </span>
                        {vendor.years_in_business && (
                            <>
                                <span className="text-darkSilver">•</span>
                                <span>{vendor.years_in_business}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
                <div className="shrink-0 mt-4 p-4 rounded-2xl border border-[#BEDBFF] bg-linear-to-br from-[#EFF6FF] to-[#EEF2FF] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-xs text-darkSilver">Prix du devis</p>
                        <p className="font-bold text-2xl text-fontBlack mt-0.5">
                            {quote.currency ? `${quote.quote_price} ${quote.currency}` : `${quote.quote_price} €`}
                        </p>
                    </div>
                    <div className="text-left sm:text-right">
                        <p className="text-xs text-darkSilver">Valide jusqu&apos;au</p>
                        <p className="text-sm text-fontBlack font-semibold mt-0.5">
                            {getValidUntilDate(quote.available_start_date, quote.quote_valid_days)}
                        </p>
                        {quote.quote_valid_days != null && (
                            <p className="text-xs text-darkSilver mt-1">Devis valable {quote.quote_valid_days} jours</p>
                        )}
                    </div>
                </div>

                {/* Service Description */}
                {quote.service_description && (
                    <div className="mt-6">
                        <h3 className="font-semibold text-base text-fontBlack">Description du service</h3>
                        <p className="text-sm text-darkSilver mt-2 leading-relaxed">{quote.service_description}</p>
                    </div>
                )}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                        <p className="text-xs text-darkSilver">Disponibilité</p>
                        <p className="text-sm text-fontBlack mt-1">{quote.available_start_date ? moment(quote.available_start_date).locale('fr').format('DD MMM YYYY') : '—'}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                        <p className="text-xs text-darkSilver">Devis valable pour</p>
                        <p className="text-sm text-fontBlack mt-1">{quote.quote_valid_days}</p>
                    </div>
                </div>

                {/* Quote from vendor (attachment) */}
                {quote.attachment_url && (
                    <div className="mt-6">
                        <h3 className="font-semibold text-base text-fontBlack">Proposition du prestataire</h3>
                        <button
                            type="button"
                            onClick={handleDownloadPdf}
                            className="mt-2 w-full flex items-center gap-4 p-4 rounded-xl bg-transparent border border-borderDark hover:border-primaryColor/40 transition-colors text-left"
                        >
                            <FileUploadIconSVG />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-fontBlack">Consulter le devis</p>
                                <p className="text-xs text-darkSilver">Cliquez pour ouvrir</p>
                            </div>
                            <HiOutlineArrowDownTray className="size-5 shrink-0 text-fontBlack" />
                        </button>
                    </div>
                )}
            </div>

            {/* Action buttons */}
            <div className="shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 px-6 mt-auto border-t border-borderDark bg-[#F9FAFB]">
                <Button
                    onPress={handleIgnoreQuote}
                    isDisabled={isIgnoring}
                    isLoading={isIgnoring}
                    className="btn_radius btn_bg_white w-full"
                >
                    Refuser le devis
                </Button>
                <Button
                    onPress={handleChatWithVendor}
                    isDisabled={isAccessingChat}
                    isLoading={isAccessingChat}
                    className="btn_radius btn_bg_blue w-full"
                >
                    Contacter le prestataire
                </Button>
            </div>
        </>
    )
}
