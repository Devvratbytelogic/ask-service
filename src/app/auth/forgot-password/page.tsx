import type { Metadata } from 'next'
import ForgotPasswordPage from '@/components/pages/auth/forgot-password/ForgotPasswordPage'
import { getGlobalSettings } from '@/utils/getGlobalSettings'

export const metadata: Metadata = {
  title: 'Ask-Service — Mot de passe oublié',
  description: 'Réinitialisez votre mot de passe Ask-Service.',
}

export default async function ForgotPasswordRoute() {
  const globalSettings = await getGlobalSettings()
  const logoUrl = globalSettings?.data?.logo ?? null
  const logoDarkUrl = globalSettings?.data?.footer_logo ?? null
  const vendorLogoUrl = globalSettings?.data?.vendor_logo ?? null
  const vendorLogoDarkUrl = globalSettings?.data?.vendor_dark_logo ?? null
  const activeVendorsCount = globalSettings?.data?.total_active_vendors ?? 0
  const activeClientsCount = globalSettings?.data?.total_service_requests ?? 0
  const averageRating = globalSettings?.data?.average_customer_satisfaction_score ?? 0

  return (
    <ForgotPasswordPage
      logoUrl={logoUrl}
      logoDarkUrl={logoDarkUrl}
      vendorLogoUrl={vendorLogoUrl}
      vendorLogoDarkUrl={vendorLogoDarkUrl}
      activeVendorsCount={activeVendorsCount}
      activeClientsCount={activeClientsCount}
      averageRating={averageRating}
    />
  )
}
