import { Suspense } from 'react'
import type { Metadata } from 'next'
import ResetPasswordPage from '@/components/pages/auth/reset-password/ResetPasswordPage'
import { getGlobalSettings } from '@/utils/getGlobalSettings'

export const metadata: Metadata = {
  title: 'Ask-Service — Réinitialiser le mot de passe',
  description: 'Définissez un nouveau mot de passe pour votre compte Ask-Service.',
}

export default async function ResetPasswordRoute() {
  const globalSettings = await getGlobalSettings()
  const logoUrl = globalSettings?.data?.logo ?? null
  const logoDarkUrl = globalSettings?.data?.footer_logo ?? null
  const activeVendorsCount = globalSettings?.data?.total_active_vendors ?? 0
  const activeClientsCount = globalSettings?.data?.total_service_requests ?? 0
  const averageRating = globalSettings?.data?.average_customer_satisfaction_score ?? 0

  return (
    <Suspense>
      <ResetPasswordPage
        logoUrl={logoUrl}
        logoDarkUrl={logoDarkUrl}
        activeVendorsCount={activeVendorsCount}
        activeClientsCount={activeClientsCount}
        averageRating={averageRating}
      />
    </Suspense>
  )
}
