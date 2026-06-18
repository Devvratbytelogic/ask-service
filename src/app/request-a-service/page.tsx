import type { Metadata } from 'next'
import RequestAServicePage from '@/components/pages/RequestAServicePage/RequestAServicePage'

export const metadata: Metadata = {
  title: 'Ask-Service — Trouver un professionnel',
  description:
    "Décrivez votre besoin en quelques secondes et recevez jusqu'à 5 devis de pros vérifiés sous 24h.",
}

export default function RequestAServiceRoute() {
  return <RequestAServicePage />
}
