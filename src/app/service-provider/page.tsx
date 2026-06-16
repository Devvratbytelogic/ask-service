import type { Metadata } from "next"
import ServiceProviderBenefits from "@/components/pages/ServiceProviderPage/ServiceProviderBenefits"
import ServiceProviderCtaSection from "@/components/pages/ServiceProviderPage/ServiceProviderCtaSection"
import ServiceProviderHero from "@/components/pages/ServiceProviderPage/ServiceProviderHero"
import ServiceProviderHowItWorks from "@/components/pages/ServiceProviderPage/ServiceProviderHowItWorks"
import ServiceProviderTestimonials from "@/components/pages/ServiceProviderPage/ServiceProviderTestimonials"

export const metadata: Metadata = {
    title: "Devenez Prestataire — Ask-Service",
    description:
        "Accédez à des demandes locales vérifiées, choisissez celles qui vous intéressent et développez votre activité. Sans abonnement.",
}

export default function ServiceProviderPage() {
    return (
        <>
            <ServiceProviderHero />
            <ServiceProviderHowItWorks />
            <ServiceProviderBenefits />
            <ServiceProviderTestimonials />
            <ServiceProviderCtaSection />
        </>
    )
}
