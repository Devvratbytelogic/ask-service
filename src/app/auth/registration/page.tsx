import type { Metadata } from 'next'
import RegistrationPage from '@/components/pages/auth/registration/RegistrationPage'
import { getGlobalSettings } from '@/utils/getGlobalSettings'

export const metadata: Metadata = {
  title: 'Ask-Service — Créer un compte',
  description: 'Créez votre compte Ask-Service en quelques minutes et accédez à tous les services de la plateforme.',
}

export default async function InscriptionRoute() {
  const globalSettings = await getGlobalSettings()
  const logoUrl = globalSettings?.data?.logo ?? null
  const vendorLogoUrl = globalSettings?.data?.vendor_logo ?? null

  return <RegistrationPage logoUrl={logoUrl} vendorLogoUrl={vendorLogoUrl} />
}
