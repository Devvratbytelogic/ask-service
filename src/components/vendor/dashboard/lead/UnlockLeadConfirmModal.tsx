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
                <h2 className="font-bold text-xl text-fontBlack">Débloquer ce prospect?</h2>
                <p className="text-sm text-darkSilver">
                    Cette action utilisera <span className="font-semibold text-fontBlack">{creditsToUnlock} points</span> pour accéder aux détails complets de la demande. Cette action est irréversible.
                </p>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primaryColor/5 border border-primaryColor/20">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primaryColor/10">
                        <LockPrimaryColorSVG className="size-5 text-primaryColor" />
                    </span>
                    <p className="text-sm text-fontBlack">
                        Vous aurez accès aux coordonnées complètes du client et pourrez lui envoyer un devis.
                    </p>
                </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 p-4 px-6 mt-4">
                <Button
                    onPress={handleCancel}
                    className="btn_radius btn_bg_white"
                    isDisabled={isLoading}
                >
                    Annuler
                </Button>
                <Button
                    onPress={handleConfirm}
                    className="btn_radius btn_bg_blue font-medium"
                    startContent={!isLoading ? <LockPrimaryColorSVG className="size-4 text-white" /> : null}
                    isLoading={isLoading}
                    spinner={<Spinner size="sm" color="white" />}
                    isDisabled={!leadId}
                >
                    Débloquer le prospect
                </Button>
            </div>
        </>
    )
}
