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

  return <ForgotPasswordPage logoUrl={logoUrl} />
}
