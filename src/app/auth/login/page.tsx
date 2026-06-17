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

  return <LoginPage logoUrl={logoUrl} />
}
