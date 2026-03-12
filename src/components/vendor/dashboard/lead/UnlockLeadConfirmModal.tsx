'use client'

import { LockPrimaryColorSVG } from '@/components/library/AllSVG'
import { generateLeadDetailRoutePath } from '@/routes/routes'
import { useUnlockLeadMutation } from '@/redux/rtkQueries/allPostApi'
import { RootState } from '@/redux/appStore'
import { closeModal } from '@/redux/slices/allModalSlice'
import { addToast } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Spinner } from '@heroui/react'

export default function UnlockLeadConfirmModal() {
    const dispatch = useDispatch()
    const router = useRouter()
    const modalData = useSelector((state: RootState) => state.allCommonModal.data) as {
        leadId?: string
        creditsToUnlock?: number
    } | undefined

    const [unlockLead, { isLoading }] = useUnlockLeadMutation()
    const leadId = modalData?.leadId
    const creditsToUnlock = modalData?.creditsToUnlock ?? 0

    const handleCancel = () => dispatch(closeModal())

    const handleConfirm = async () => {
        if (!leadId) return
        try {
            await unlockLead(leadId).unwrap()
            addToast({ title: 'Lead unlocked successfully', color: 'success', timeout: 2000 })
            dispatch(closeModal())
            // router.push(generateLeadDetailRoutePath(leadId))
        } catch {
            // Error toast handled by rtkQuerieSetup
        }
    }

    return (
        <>
            <div className="p-4 px-6 border-b border-borderDark space-y-4">
                <h2 className="font-bold text-xl text-fontBlack">Unlock this lead?</h2>
                <p className="text-sm text-darkSilver">
                    This will use <span className="font-semibold text-fontBlack">{creditsToUnlock} credits</span> from your balance to unlock the full lead details. This action cannot be undone.
                </p>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primaryColor/5 border border-primaryColor/20">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primaryColor/10">
                        <LockPrimaryColorSVG className="size-5 text-primaryColor" />
                    </span>
                    <p className="text-sm text-fontBlack">
                        You will get access to full contact details and can send a quote to the customer.
                    </p>
                </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 p-4 px-6 mt-4">
                <Button
                    onPress={handleCancel}
                    className="btn_radius btn_bg_white"
                    isDisabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    onPress={handleConfirm}
                    className="btn_radius btn_bg_blue font-medium"
                    startContent={!isLoading ? <LockPrimaryColorSVG className="size-4 text-white" /> : null}
                    isLoading={isLoading}
                    spinner={<Spinner size="sm" color="white" />}
                    isDisabled={!leadId}
                >
                    Unlock Lead
                </Button>
            </div>
        </>
    )
}
