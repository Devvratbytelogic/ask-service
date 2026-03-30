'use client'

import { CalendarSVG, LocationSVG, WarningIconSVG } from '@/components/library/AllSVG'
import { useCloseServiceRequestMutation } from '@/redux/rtkQueries/allPostApi'
import { RootState } from '@/redux/appStore'
import { closeModal } from '@/redux/slices/allModalSlice'
import { Button, Checkbox, Spinner, Textarea } from '@heroui/react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const OTHER_REASON_KEY = 'Other reason'

function formatDate(isoDate?: string | null): string {
    if (!isoDate) return '—'
    const d = new Date(isoDate)
    if (Number.isNaN(d.getTime())) return '—'
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const CLOSE_REASONS = [
    { key: 'No longer need the service', label: 'Je n\'ai plus besoin de ce service' },
    { key: 'Found a provider elsewhere', label: 'J\'ai trouvé un prestataire ailleurs' },
    { key: 'Quotes are too expensive', label: 'Les devis sont trop chers' },
    { key: 'Changed my mind', label: 'J\'ai changé d\'avis' },
    { key: OTHER_REASON_KEY, label: 'Autre raison' },
]


export default function CloseRequestModal() {
    const dispatch = useDispatch()
    const modalData = useSelector((state: RootState) => state.allCommonModal.data)
    const request = modalData?.request
    const requestId = (request as { _id?: string; id?: string })?._id ?? (request as { id?: string })?.id
    const [selectedReason, setSelectedReason] = useState<string | null>(null)
    const [reasonComment, setReasonComment] = useState('')
    const [closeServiceRequest, { isLoading: isClosing }] = useCloseServiceRequestMutation()

    const handleCancel = () => dispatch(closeModal())

    const handleCloseRequest = async () => {
        if (!selectedReason || !requestId) return
        try {
            await closeServiceRequest({
                id: requestId,
                body: {
                    reason: selectedReason,
                    reason_comment: selectedReason === OTHER_REASON_KEY ? reasonComment : '',
                },
            }).unwrap()
            dispatch(closeModal())
        } catch {
            // Error toast is handled by RTK base query
        }
    }
    console.log('request', request);

    return (
        <>
            <div className="p-4 px-6 border-b border-borderDark space-y-1">
                <h2 className="font-bold text-xl text-fontBlack">Clôturer cette demande ?</h2>
                {/* Request summary */}
                <p className="text-sm text-darkSilver">
                    {request?.service_title}
                    <span className="mx-1.5">•</span>
                    {request?.request_id}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-darkSilver">
                    <span className="flex items-center gap-1.5">
                        <CalendarSVG />
                        {formatDate(request?.createdAt)}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <LocationSVG />
                        {request?.location}
                    </span>
                </div>
            </div>

            <div className='flex-1 overflow-y-auto px-6'>
                {/* Warning banner */}
                <div className="flex gap-3 p-4 rounded-xl bg-[#FFFBEB] border border-[#FEE685]">
                    <div className='min-w-max'><WarningIconSVG /></div>
                    <p className="text-sm text-[#7B3306]">
                        La fermeture de cette demande est définitive. Vous ne recevrez plus de nouveaux devis et les devis existants ne seront plus disponibles.
                    </p>
                </div>

                {/* Reason for closing */}
                <h3 className="font-medium text-sm text-fontBlack mt-6">
                    Pourquoi fermez-vous cette demande ?
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

                {/* Reason comment when "Other reason" is selected */}
                {selectedReason === OTHER_REASON_KEY && (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-fontBlack mb-2">
                            Veuillez préciser (facultatif)
                        </label>
                        <Textarea
                            placeholder="Décrivez votre raison"
                            value={reasonComment}
                            onValueChange={setReasonComment}
                            minRows={3}
                            classNames={{
                                input: 'text-sm',
                                inputWrapper: 'border border-borderDark rounded-xl bg-white',
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 px-6 mt-auto border-t border-borderDark bg-[#F9FAFB]">
                <Button
                    onPress={handleCancel}
                    className="btn_radius btn_bg_white w-full"
                >
                    Annuler
                </Button>
                <Button
                    onPress={handleCloseRequest}
                    isDisabled={!selectedReason || !requestId || isClosing}
                    className={`btn_radius ${selectedReason ? 'btn_bg_blue' : 'bg-gray-200! text-gray-600!'} w-full`}
                    isLoading={isClosing}
                    spinner={<Spinner size="sm" color="primary" />}
                >
                    Clôturer la demande
                </Button>
            </div>
        </>
    )
}
