'use client'

import { CheckGreenIconSVG } from '@/components/library/AllSVG'
import { RootState } from '@/redux/appStore'
import { closeModal } from '@/redux/slices/allModalSlice'
import { Button } from '@heroui/react'
import { useDispatch, useSelector } from 'react-redux'

const DEFAULT_REFERENCE = 'REQ-VOGC6WH'
const DEFAULT_EMAIL = 'yourxyz@example.com'

export default function ReportSubmittedModal() {
    const dispatch = useDispatch()
    const data = useSelector((state: RootState) => state.allCommonModal.data) as
        | { referenceId?: string; email?: string }
        | undefined
    const referenceId = data?.referenceId ?? DEFAULT_REFERENCE
    const email = data?.email?.trim() ? data.email.trim() : DEFAULT_EMAIL

    const handleClose = () => dispatch(closeModal())

    return (
        <div className="flex flex-col items-center text-center">
            {/* Success icon */}
            <div className="flex size-16 items-center justify-center rounded-full bg-[#D1FAE5]">
                <span className="[&_svg]:size-8 [&_svg]:text-[#00A63E]">
                    <CheckGreenIconSVG />
                </span>
            </div>

            {/* Title */}
            <h2 className="mt-5 text-xl font-bold text-fontBlack">Signalement envoyé</h2>

            {/* Message */}
            <p className="mt-3 max-w-sm text-sm font-normal text-[#6B7280]">
                Merci pour votre signalement. Notre équipe l&apos;examinera attentivement et prendra les mesures appropriées sous 24 à 48 heures.
            </p>

            {/* Reference */}
            {/* <p className="mt-3 text-sm text-[#6B7280]">
                Reference:{' '}
                <span className="font-bold text-primaryColor">{referenceId}</span>
            </p> */}

            {/* Email confirmation box */}
            <div className="mt-5 w-full rounded-xl bg-[#EFF6FF] px-4 py-3">
                <p className="text-sm text-fontBlack">
                    Nous avons envoyé un e-mail de confirmation à{' '}
                    <span className="font-medium text-primaryColor">{email}</span>
                </p>
            </div>

            {/* Close button */}
            <Button
                onPress={handleClose}
                className="btn_radius btn_bg_white mt-4 min-w-30">

                Fermer
            </Button>
        </div>
    )
}
