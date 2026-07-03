import type { Metadata } from 'next'
import LoginPage from '@/components/pages/auth/login/LoginPage'
import { getGlobalSettings } from '@/utils/getGlobalSettings'

export const metadata: Metadata = {
  title: 'Ask-Service — Connexion',
  description: 'Connectez-vous à votre espace Ask-Service client ou prestataire.',
}

export default async function LoginRoute() {
  const globalSettings = await getGlobalSettings()
  const logoUrl = globalSettings?.data?.logo ?? null
  const vendorLogoUrl = globalSettings?.data?.vendor_logo ?? null
  const activeVendorsCount = globalSettings?.data?.activeVendorsCount ?? 0
  const activeClientsCount = globalSettings?.data?.activeClientsCount ?? 0
  const averageRating = globalSettings?.data?.averageRating ?? 0

  return (
    <LoginPage
      logoUrl={logoUrl}
      vendorLogoUrl={vendorLogoUrl}
      activeVendorsCount={activeVendorsCount}
      activeClientsCount={activeClientsCount}
      averageRating={averageRating}
    />
  )
}
