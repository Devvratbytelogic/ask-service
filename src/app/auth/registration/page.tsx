import type { Metadata } from 'next'
import RegistrationPage from '@/components/pages/auth/registration/RegistrationPage'

export const metadata: Metadata = {
  title: 'Ask-Service — Créer un compte',
  description: 'Créez votre compte Ask-Service en quelques minutes et accédez à tous les services de la plateforme.',
}

export default function InscriptionRoute() {
  return <RegistrationPage />
}
