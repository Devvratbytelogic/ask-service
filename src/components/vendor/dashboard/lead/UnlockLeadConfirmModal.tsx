'use client'

import moment from 'moment'
import { CheckmarkIconSVG } from '@/components/library/AllSVG'
import { useUnlockLeadMutation } from '@/redux/rtkQueries/allPostApi'
import { RootState } from '@/redux/appStore'
import { closeModal } from '@/redux/slices/allModalSlice'
import { useGetSingleLeadQuery, useGetVendorDashboardDataQuery } from '@/redux/rtkQueries/clientSideGetApis'
import { addToast, Spinner } from '@heroui/react'
import { useDispatch, useSelector } from 'react-redux'

export default function UnlockLeadConfirmModal() {
    const dispatch = useDispatch()
    const modalData = useSelector((state: RootState) => state.allCommonModal.data) as {
        leadId?: string
        creditsToUnlock?: number
    } | undefined

    const leadId = modalData?.leadId ?? ''
    const { data: leadResponse } = useGetSingleLeadQuery({ id: leadId }, { skip: !leadId })
    const { data: dashboardData } = useGetVendorDashboardDataQuery()
    const [unlockLead, { isLoading }] = useUnlockLeadMutation()

    const lead = leadResponse?.data
    const creditsToUnlock = modalData?.creditsToUnlock ?? lead?.creditsToUnlock ?? 0
    const walletBalance = dashboardData?.data?.creditBalance ?? 0
    const serviceLabel = lead?.service_category?.title ?? '—'
    const location = lead?.cityOrPostalCode || lead?.city || '—'

    const dateInfo = lead?.desiredDate ? moment(lead?.desiredDate).locale('fr').format('DD MMM YYYY') : '—' + ' · ' + (lead?.timeSlot ?? '—')

    const handleCancel = () => dispatch(closeModal())

    const handleConfirm = async () => {
        if (!leadId) return
        try {
            await unlockLead(leadId).unwrap()
            addToast({ title: 'Prospect débloqué avec succès', color: 'success', timeout: 2000 })
            dispatch(closeModal())
        } catch {
            // Error toast handled by rtkQuerieSetup
        }
    }

    return (
        <div className="p-7">
            <div className="w-14 h-14 rounded-2xl bg-primaryColor/15 border border-primaryColor/20 flex items-center justify-center text-[26px] mb-4">
                🔓
            </div>
            <h3 className="text-[20px] font-extrabold text-appText mb-2 tracking-[-0.3px]">
                Débloquer ce prospect ?
            </h3>
            <p className="text-[13px] text-appTextSec leading-[1.65] mb-4">
                Vous accéderez immédiatement aux coordonnées complètes du client.{' '}
                {creditsToUnlock} crédits seront déduits de votre wallet.
            </p>

            <div className="bg-black/3 dark:bg-white/4 border border-appBorder rounded-3xl p-3.5 mb-4 flex flex-col gap-2">
                <div className="flex justify-between items-center text-[13px]">
                    <span className="text-appTextSec">Service</span>
                    <span className="font-semibold text-appText">{serviceLabel}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                    <span className="text-appTextSec">Localisation</span>
                    <span className="font-semibold text-appText">{location}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                    <span className="text-appTextSec">Date</span>
                    <span className="font-semibold text-appText">{dateInfo}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                    <span className="text-appTextSec">Votre solde</span>
                    <span className="font-semibold text-appText">{walletBalance} crédits</span>
                </div>
                <div className="flex justify-between items-center text-[13px] pt-2.5 mt-0.5 border-t border-appBorderSub">
                    <span className="text-appTextSec">Coût du déblocage</span>
                    <span className="font-extrabold text-amber text-[16px]">
                        🪙 {creditsToUnlock} crédits
                    </span>
                </div>
            </div>

            <div className="flex gap-2.5">
                <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="cursor-pointer flex-1 py-3 rounded-lg bg-black/5 dark:bg-white/7 text-appTextSec text-sm font-semibold transition-all duration-200 hover:bg-black/8 dark:hover:bg-appCard/12 hover:text-appText disabled:opacity-60"
                >
                    Annuler
                </button>
                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={!leadId || isLoading}
                    className="cursor-pointer flex-2 py-3 rounded-lg bg-linear-to-br from-primaryColor to-[#4F46E5] text-white text-base font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(27,79,255,0.35)] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(27,79,255,0.45)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                    {isLoading ? (
                        <Spinner size="sm" color="white" />
                    ) : (
                        <>
                            <CheckmarkIconSVG size={14} />
                            Confirmer · {creditsToUnlock} crédits
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
