import type { Metadata } from "next"
import ServiceProviderBenefits from "@/components/pages/ServiceProviderPage/ServiceProviderBenefits"
import ServiceProviderCtaSection from "@/components/pages/ServiceProviderPage/ServiceProviderCtaSection"
import ServiceProviderHero from "@/components/pages/ServiceProviderPage/ServiceProviderHero"
import ServiceProviderHowItWorks from "@/components/pages/ServiceProviderPage/ServiceProviderHowItWorks"
import ServiceProviderTestimonials from "@/components/pages/ServiceProviderPage/ServiceProviderTestimonials"
import { getGlobalSettings } from "@/utils/getGlobalSettings"

export const metadata: Metadata = {
    title: "Devenez Prestataire — Ask-Service",
    description:
        "Accédez à des demandes locales vérifiées, choisissez celles qui vous intéressent et développez votre activité. Sans abonnement.",
}

export default async function ServiceProviderPage() {
    const globalSettings = await getGlobalSettings()
    const activeVendorsCount = globalSettings?.data?.total_active_vendors ?? 0
    const activeRequestsCount = globalSettings?.data?.total_service_requests ?? 0
    const averageRating = globalSettings?.data?.average_customer_satisfaction_score ?? 0
    // const averageResponseTime = globalSettings?.data?.average_time_to_receive_a_quote ?? 0
    return (
        <>
            <ServiceProviderHero activeVendorsCount={activeVendorsCount} activeRequestsCount={activeRequestsCount} averageRating={averageRating}  />
            <ServiceProviderHowItWorks />
            <ServiceProviderBenefits />
            <ServiceProviderTestimonials />
            <ServiceProviderCtaSection />
        </>
    )
}
