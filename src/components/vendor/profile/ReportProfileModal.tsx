'use client'

import { closeModal, openModal } from '@/redux/slices/allModalSlice'
import { Button, Select, SelectItem, Textarea } from '@heroui/react'
import { useDispatch } from 'react-redux'
import { useState } from 'react'

const REPORT_REASONS = [
    { key: 'spam', label: 'Spam' },
    { key: 'inappropriate', label: 'Inappropriate content' },
    { key: 'fake', label: 'Fake profile' },
    { key: 'harassment', label: 'Harassment' },
    { key: 'fraud', label: 'Fraud or scam' },
    { key: 'other', label: 'Other' },
]

const MIN_DETAILS_LENGTH = 20

export default function ReportProfileModal() {
    const dispatch = useDispatch()
    const [reason, setReason] = useState<string | null>(null)
    const [details, setDetails] = useState('')

    const charCount = details.length
    const canSubmit = reason && details.length >= MIN_DETAILS_LENGTH

    const handleCancel = () => dispatch(closeModal())
    const handleSubmit = () => {
        if (!canSubmit) return
        // TODO: API call to submit report; use response for referenceId and email
        dispatch(closeModal())
        dispatch(
            openModal({
                componentName: 'ReportSubmittedModal',
                data: { referenceId: 'REQ-VOGC6WH', email: 'yourxyz@example.com' },
                modalSize: 'xl',
                modalPadding: 'px-6 py-8',
            })
        )
    }

    return (
        <div className="flex flex-col">
            {/* Header */}
            <h2 className="text-xl font-bold text-fontBlack">Report this profile</h2>

            {/* Reason for reporting */}
            <div className="mt-5">
                <label className="text-sm text-fontBlack font-medium block mb-1">
                    Reason for reporting <span className="text-red-500">*</span>
                </label>
                <Select
                    placeholder="Select a reason"
                    selectedKeys={reason ? [reason] : []}
                    onSelectionChange={(keys) => {
                        const key = Array.from(keys as Set<string>)[0]
                        setReason(key ?? null)
                    }}
                    classNames={{
                        trigger: 'border border-borderDark bg-white shadow-none',
                        value: 'text-placeHolderText data-[placeholder=true]:text-[#9CA3AF]',
                        label: 'hidden',
                    }}
                    aria-label="Select a reason"
                >
                    {REPORT_REASONS.map((opt) => (
                        <SelectItem key={opt.key}>{opt.label}</SelectItem>
                    ))}
                </Select>
            </div>

            {/* Additional Details */}
            <div className="mt-5">
                <label className="text-sm text-fontBlack font-medium block mb-1">
                    Additional Details <span className="text-red-500">*</span>
                </label>
                <Textarea
                    placeholder="Please provide specific details about why you're reporting this profile. Include any relevant information that will help us investigate."
                    value={details}
                    onValueChange={setDetails}
                    minRows={4}
                    classNames={{
                        inputWrapper: 'custom_input_design rounded-xl border border-[#E5E7EB] bg-white min-h-[100px]',
                        input: 'text-fontBlack placeholder:text-[#9CA3AF]',
                    }}
                />
                <p className="mt-2 text-xs text-[#9CA3AF]">
                    Minimum {MIN_DETAILS_LENGTH} characters ({charCount}/{MIN_DETAILS_LENGTH})
                </p>
            </div>

            {/* Important warning */}
            <div className="mt-5 rounded-xl border border-[#E5C231] bg-[#FEF9E7] px-4 py-3">
                <p className="text-sm font-bold text-fontBlack">Important</p>
                <p className="mt-1 text-sm text-fontBlack">
                    False reports may result in action being taken against your account. Submit genuine concerns only.
                </p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
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
                    Submit
                </Button>
            </div>
        </div>
    )
}
