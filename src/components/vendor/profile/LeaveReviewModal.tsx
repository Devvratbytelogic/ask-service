'use client'

import { StarRatingIconSVG, StarOutlineIconSVG } from '@/components/library/AllSVG'
import { closeModal } from '@/redux/slices/allModalSlice'
import { Avatar, Button, Select, SelectItem, Textarea } from '@heroui/react'
import { useDispatch } from 'react-redux'
import { useState } from 'react'

const REQUEST_IDS = [
    { key: 'REQ-A7X9K2', label: 'REQ-A7X9K2' },
    { key: 'REQ-B2K4M8', label: 'REQ-B2K4M8' },
    { key: 'REQ-C9P1L3', label: 'REQ-C9P1L3' },
]

const MIN_REVIEW_LENGTH = 20

export default function LeaveReviewModal() {
    const dispatch = useDispatch()
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [requestId, setRequestId] = useState<string | null>(null)
    const [reviewText, setReviewText] = useState('')

    const displayRating = hoverRating || rating
    const charCount = reviewText.length
    const canSubmit = requestId && reviewText.length >= MIN_REVIEW_LENGTH && rating > 0

    const handleCancel = () => dispatch(closeModal())
    const handleSubmit = () => {
        if (!canSubmit) return
        // TODO: API call to submit review
        dispatch(closeModal())
    }

    return (
        <div className="flex flex-col">
            {/* Header */}
            <h2 className="text-xl font-bold text-fontBlack">Leave a Review</h2>

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
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
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
                <label className="text-sm text-fontBlack font-medium block mb-1">
                    Select your request ID <span className="text-red-500">*</span>
                </label>
                <Select
                    placeholder="Select request ID"
                    selectedKeys={requestId ? [requestId] : []}
                    onSelectionChange={(keys) => {
                        const key = Array.from(keys as Set<string>)[0]
                        setRequestId(key ?? null)
                    }}
                    classNames={{
                        trigger: 'border border-borderDark bg-white shadow-none',
                        value: 'text-placeHolderText data-[placeholder=true]:text-[#9CA3AF]',
                        label: 'hidden',
                    }}
                    aria-label="Select request ID"
                >
                    {REQUEST_IDS.map((opt) => (
                        <SelectItem key={opt.key}>{opt.label}</SelectItem>
                    ))}
                </Select>
            </div>

            {/* Your Review */}
            <div className="mt-3">
                <label className="text-sm text-fontBlack font-medium block mb-1">
                    Your Review <span className="text-red-500">*</span>
                </label>
                <Textarea
                    placeholder="Share your experience with this vendor..."
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
                        Minimum {MIN_REVIEW_LENGTH} characters ({charCount})
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
                    Your review helps others make informed decisions. Please be honest and constructive.
                </p>
            </div>

            {/* Actions */}
            <div className="mt-3 flex flex-wrap items-center justify-end gap-3">
                <Button
                    onPress={handleCancel}
                    className="btn_radius min-w-25 border border-[#E5E7EB] bg-white text-fontBlack font-medium"
                >
                    Cancel
                </Button>
                <Button
                    onPress={handleSubmit}
                    isDisabled={!canSubmit}
                    className="btn_radius btn_bg_blue min-w-35 font-medium"
                >
                    Submit review
                </Button>
            </div>
        </div>
    )
}
