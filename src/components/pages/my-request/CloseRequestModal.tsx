'use client'

import { CalendarSVG, LocationSVG, WarningIconSVG } from '@/components/library/AllSVG'
import { RootState } from '@/redux/appStore'
import { closeModal } from '@/redux/slices/allModalSlice'
import { Button, Checkbox } from '@heroui/react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoWarning } from 'react-icons/io5'

const CLOSE_REASONS = [
    { key: 'no_longer_need', label: 'No longer need the service' },
    { key: 'found_elsewhere', label: 'Found a provider elsewhere' },
    { key: 'too_expensive', label: 'Quotes are too expensive' },
    { key: 'changed_mind', label: 'Changed my mind' },
    { key: 'other', label: 'Other reason' },
]

const defaultRequest = {
    title: 'House Cleaning',
    requestId: 'REQ-A7X9K2',
    date: '14 Jan 2026',
    location: 'London, SW1A 1AA',
}

export default function CloseRequestModal() {
    const dispatch = useDispatch()
    const modalData = useSelector((state: RootState) => state.allCommonModal.data)
    const request = modalData?.request ?? modalData ?? defaultRequest
    const [selectedReason, setSelectedReason] = useState<string | null>(null)

    const handleCancel = () => dispatch(closeModal())

    const handleCloseRequest = () => {
        if (!selectedReason) return
        // TODO: API call to close request, then close modal
        dispatch(closeModal())
    }

    return (
        <>
            <div className="p-4 px-6 border-b border-borderDark space-y-1">
                <h2 className="font-bold text-xl text-fontBlack">Close this request?</h2>
                {/* Request summary */}
                <p className="text-sm text-darkSilver">
                    {request?.title ?? defaultRequest.title}
                    <span className="mx-1.5">•</span>
                    {request?.requestId ?? defaultRequest.requestId}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-darkSilver">
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

            <div className='flex-1 overflow-y-auto px-6'>
                {/* Warning banner */}
                <div className="flex gap-3 p-4 rounded-xl bg-[#FFFBEB] border border-[#FEE685]">
                    <div className='min-w-max'><WarningIconSVG /></div>
                    <p className="text-sm text-[#7B3306]">
                        Closing this request will permanently end it. You won&apos;t receive any new quotes, and
                        existing quotes will no longer be available.
                    </p>
                </div>

                {/* Reason for closing */}
                <h3 className="font-medium text-sm text-fontBlack mt-6">
                    Why are you closing this request?
                </h3>
                <div className="mt-3 space-y-2">
                    {CLOSE_REASONS.map((reason) => (
                        <label
                            key={reason.key}
                            className={`
                                flex items-center gap-3 p-4 rounded-xl border cursor-pointer
                                bg-white border-borderDark hover:border-primaryColor/50
                                transition-colors
                                ${selectedReason === reason.key ? 'border-primaryColor bg-primaryColor/5' : ''}
                            `}
                        >
                            <Checkbox
                                isSelected={selectedReason === reason.key}
                                onValueChange={() =>
                                    setSelectedReason(selectedReason === reason.key ? null : reason.key)
                                }
                                classNames={{
                                    base: 'max-w-full',
                                    wrapper: 'rounded-md',
                                }}
                                aria-label={reason.label}
                            />
                            <span className="text-fontBlack font-medium text-sm">{reason.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 px-6 mt-auto border-t border-borderDark bg-[#F9FAFB]">
                <Button
                    onPress={handleCancel}
                    className="btn_radius btn_bg_white w-full"
                >
                    Cancel
                </Button>
                <Button
                    onPress={handleCloseRequest}
                    isDisabled={!selectedReason}
                    className={`btn_radius ${selectedReason ? 'btn_bg_blue' : 'bg-gray-200! text-gray-600!'} w-full`}
                >
                    Close request
                </Button>
            </div>
        </>
    )
}
