'use client'

import { WarningIconSVG } from '@/components/library/AllSVG'
import { useGetVendorProfileInfoQuery } from '@/redux/rtkQueries/clientSideGetApis'
import { openModal } from '@/redux/slices/allModalSlice'
import { Button } from '@heroui/react'
import { useDispatch } from 'react-redux'

export default function VendorPhoneUnverifiedAlert() {
  const dispatch = useDispatch()
  const { data, isLoading } = useGetVendorProfileInfoQuery()
  const profile = data?.data

  const showAlert = !isLoading && profile?.is_phone_verified === false
  if (!showAlert) return null

  const handleVerifyPhone = () => {
    dispatch(
      openModal({
        componentName: 'VerifyPhoneOtpModal',
        data: {
          phoneNumber: profile.phone ?? '',
        },
        modalSize: 'md',
      }),
    )
  }

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-amber/30 bg-amber-light p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-start gap-3 sm:items-center">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full text-amber">
          <WarningIconSVG />
        </span>
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-bold text-fontBlack">
            Numéro de téléphone non vérifié
          </p>
          <p className="text-sm text-fontBlack/80">
            Vérifiez votre numéro pour sécuriser votre compte et recevoir les notifications importantes.
          </p>
        </div>
      </div>
      <Button className="btn_radius btn_bg_blue shrink-0" onPress={handleVerifyPhone}>
        Vérifier
      </Button>
    </div>
  )
}
