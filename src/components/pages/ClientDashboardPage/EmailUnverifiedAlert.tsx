'use client'

import { WarningIconSVG } from '@/components/library/AllSVG'
import { useGetUserProfileInfoQuery } from '@/redux/rtkQueries/clientSideGetApis'
import { useResendEmailVerificationMutation } from '@/redux/rtkQueries/authApi'
import { openModal } from '@/redux/slices/allModalSlice'
import { addToast, Button } from '@heroui/react'
import { useDispatch } from 'react-redux'
import { useState } from 'react'

export default function EmailUnverifiedAlert() {
  const dispatch = useDispatch()
  const { data, isLoading } = useGetUserProfileInfoQuery()
  const [resendEmailVerification, { isLoading: isResending }] = useResendEmailVerificationMutation()
  const [isOpening, setIsOpening] = useState(false)
  const profile = data?.data

  const showAlert = !isLoading && profile?.is_email_verified === false
  if (!showAlert) return null

  const handleVerifyEmail = async () => {
    const email = (profile.email ?? '').trim()
    if (!email) return
    setIsOpening(true)
    try {
      await resendEmailVerification({ email }).unwrap()
      addToast({
        title: 'Code de vérification envoyé',
        description: 'Vérifiez votre e-mail.',
        color: 'success',
        timeout: 2000,
      })
      dispatch(
        openModal({
          componentName: 'VerifyEmailOtpModal',
          data: { email },
          modalSize: 'md',
        }),
      )
    } catch {
      // Error toast from rtkQuerieSetup
    } finally {
      setIsOpening(false)
    }
  }

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-amber/30 bg-amber-light p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-start gap-3 sm:items-center">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full text-amber">
          <WarningIconSVG />
        </span>
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-bold text-fontBlack">
            Adresse e-mail non vérifiée
          </p>
          <p className="text-sm text-fontBlack/80">
            Vérifiez votre e-mail pour sécuriser votre compte et recevoir les notifications importantes.
          </p>
        </div>
      </div>
      <Button
        className="btn_radius btn_bg_blue shrink-0"
        onPress={handleVerifyEmail}
        isLoading={isResending || isOpening}
        isDisabled={isResending || isOpening || !profile.email}
      >
        Vérifier
      </Button>
    </div>
  )
}
