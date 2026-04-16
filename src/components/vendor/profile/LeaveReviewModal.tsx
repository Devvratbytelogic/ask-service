'use client'

import { StarRatingIconSVG, StarOutlineIconSVG } from '@/components/library/AllSVG'
import { useGetCreatedServicesQuery } from '@/redux/rtkQueries/clientSideGetApis'
import { closeModal } from '@/redux/slices/allModalSlice'
import type { DataEntity } from '@/types/allRequests'
import { addToast, Autocomplete, AutocompleteItem, Avatar, Button, Spinner, Textarea } from '@heroui/react'
import { useDispatch, useSelector } from 'react-redux'
import { useMemo, useState } from 'react'
import { useSubmitReviewMutation } from '@/redux/rtkQueries/allPostApi'
import { RootState } from '@/redux/appStore'

const CREATED_SERVICES_SELECT_LIMIT = 500

const MIN_REVIEW_LENGTH = 20

export default function LeaveReviewModal() {
    const dispatch = useDispatch()
    const modalData = useSelector((state: RootState) => state.allCommonModal.data)
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [selectedServiceRequestId, setSelectedServiceRequestId] = useState<string | null>(null)
    const [requestInput, setRequestInput] = useState('')
    const [reviewText, setReviewText] = useState('')
    const [submitReview, { isLoading: isSubmitting }] = useSubmitReviewMutation()
    const vendorId = modalData?.vendorId

    const { data, isLoading, isError } = useGetCreatedServicesQuery({
        page: 1,
        limit: CREATED_SERVICES_SELECT_LIMIT,
    })
    const requests = data?.data?.data ?? []

    const filteredRequests = useMemo(() => {
        const q = requestInput.trim().toLowerCase()
        if (!q) return requests
        return requests.filter((r) => (r.request_id ?? '').toLowerCase().includes(q))
    }, [requests, requestInput])

    const displayRating = hoverRating || rating
    const charCount = reviewText.length
    const canSubmit =
        selectedServiceRequestId &&
        reviewText.length >= MIN_REVIEW_LENGTH &&
        rating > 0

    const selectPlaceholder = isLoading
        ? 'Chargement des demandes…'
        : isError
            ? 'Impossible de charger les demandes'
            : requests.length === 0
                ? 'Aucune demande pour l\'instant'
                : 'Sélectionner un ID de demande'

    const handleCancel = () => dispatch(closeModal())
    const handleSubmit = async () => {
        try {
            await submitReview({
                service_request_id: selectedServiceRequestId,
                vendor: vendorId,
                rating,
                review: reviewText.trim(),
            }).unwrap()
            addToast({ title: 'Avis soumis avec succès', color: 'success', timeout: 2000 })
            dispatch(closeModal())
        } catch {
            // Error toast handled by RTK base query
        }
    }

    return (
        <div className="flex flex-col">
            {/* Header */}
            <h2 className="text-xl font-bold text-fontBlack">Laisser un avis</h2>

            {/* Star rating */}
            <div className="mt-3 flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className="p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primaryColor/50 rounded"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label={`Attribuer ${star} étoile${star > 1 ? 's' : ''}`}
                    >
                        <span className="inline-block scale-150 origin-center">
                            {star <= displayRating ? (
                                <StarRatingIconSVG />
                            ) : (
                                <StarOutlineIconSVG />
                            )}
                        </span>
                    </button>
                ))}
            </div>

            {/* Select request ID */}
            <div className="mt-3">
                <label className="text-sm text-fontBlack font-medium flex items-center gap-2 mb-1">
                    <span>
                        Sélectionnez votre ID de demande <span className="text-red-500">*</span>
                    </span>
                    {isLoading && <Spinner size="sm" color="primary" />}
                </label>
                <Autocomplete<DataEntity>
                    placeholder={selectPlaceholder}
                    inputValue={requestInput}
                    onInputChange={(value) => {
                        setRequestInput(value)
                        const sel =
                            selectedServiceRequestId &&
                            requests.find((r) => r._id === selectedServiceRequestId)
                        if (sel && value !== sel.request_id) {
                            setSelectedServiceRequestId(null)
                        }
                    }}
                    selectedKey={selectedServiceRequestId}
                    onSelectionChange={(key) => {
                        const id = key != null ? String(key) : null
                        setSelectedServiceRequestId(id)
                        if (id) {
                            const item = requests.find((r) => r._id === id)
                            setRequestInput(item?.request_id ?? '')
                        }
                    }}
                    items={filteredRequests}
                    isDisabled={isLoading || isError || requests.length === 0}
                    variant="bordered"
                    aria-label="Sélectionner un ID de demande"
                    allowsEmptyCollection
                    onClear={() => {
                        setSelectedServiceRequestId(null)
                        setRequestInput('')
                    }}
                    isVirtualized={filteredRequests.length > 50}
                    itemHeight={40}
                    maxListboxHeight={280}
                    classNames={{
                        base: 'w-full',
                        listboxWrapper: 'max-h-[280px]',
                    }}
                    inputProps={{
                        classNames: {
                            inputWrapper: [
                                'shadow-none rounded-xl',
                                'border border-borderDark bg-white',
                                'data-[hover=true]:bg-white',
                                'group-data-[focus=true]:bg-white',
                            ],
                            input: 'text-fontBlack placeholder:text-[#9CA3AF]',
                        },
                    }}
                    listboxProps={{
                        emptyContent: isError
                            ? 'Impossible de charger les demandes.'
                            : requests.length === 0
                                ? 'Aucune demande pour l\'instant.'
                                : 'Aucun ID de demande correspondant.',
                    }}
                >
                    {(item) => (
                        <AutocompleteItem key={item._id} textValue={item.request_id ?? ''}>
                            {item.request_id}
                        </AutocompleteItem>
                    )}
                </Autocomplete>
            </div>

            {/* Your Review */}
            <div className="mt-3">
                <label className="text-sm text-fontBlack font-medium block mb-1">
                    Votre avis <span className="text-red-500">*</span>
                </label>
                <Textarea
                    placeholder="Partagez votre expérience avec ce prestataire..."
                    value={reviewText}
                    onValueChange={setReviewText}
                    minRows={4}
                    classNames={{
                        inputWrapper: 'custom_input_design rounded-xl border border-borderDark bg-white min-h-[100px]',
                        input: 'text-fontBlack placeholder:text-[#9CA3AF]',
                    }}
                />
                <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-[#9CA3AF]">
                        Minimum {MIN_REVIEW_LENGTH} caractères ({charCount})
                    </span>
                    <div className="flex -space-x-2">
                        <Avatar
                            name="A"
                            size="sm"
                            className="h-7 w-7 border-2 border-white text-[10px] font-medium bg-[#E0F2FE] text-[#0369A1]"
                            showFallback
                        />
                        <Avatar
                            name="B"
                            size="sm"
                            className="h-7 w-7 border-2 border-white text-[10px] font-medium bg-[#E0F2FE] text-[#0369A1]"
                            showFallback
                        />
                    </div>
                </div>
            </div>

            {/* Info banner */}
            <div className="mt-3 rounded-xl bg-[#EFF6FF] border border-[#BEDBFF] px-4 py-3">
                <p className="text-sm text-fontBlack">
                    Votre avis aide les autres à prendre des décisions éclairées. Soyez honnête et constructif.
                </p>
            </div>

            {/* Actions */}
            <div className="mt-3 flex flex-wrap items-center justify-end gap-3">
                <Button
                    onPress={handleCancel}
                    className="btn_radius min-w-25 border border-[#E5E7EB] bg-white text-fontBlack font-medium"
                >
                    Annuler
                </Button>
                <Button
                    onPress={handleSubmit}
                    isDisabled={!canSubmit}
                    className="btn_radius btn_bg_blue min-w-35 font-medium"
                >
                    {isSubmitting ? 'Envoi en cours...' : 'Soumettre l\'avis'}
                </Button>
            </div>
        </div>
    )
}
