import React from 'react'
import CtaSection from '@/components/pages/HomePage/CtaSection'
import HeroSection from '@/components/pages/HomePage/HeroSection'
import HowDoesItWorkSection from '@/components/pages/HomePage/HowDoesItWorkSection'
import ServicesCarouselSection from '@/components/pages/HomePage/ServicesCarouselSection'
import StatsSection from '@/components/pages/HomePage/StatsSection'
import TestimonialsSection from '@/components/pages/HomePage/TestimonialsSection'
// import { getGlobalSettings } from '@/utils/getGlobalSettings'

export default function HomePage() {
  // const globalSettings = await getGlobalSettings();
  // const activeVendorsCount = globalSettings?.data?.total_active_vendors ?? 0
  // const activeRequestsCount = globalSettings?.data?.total_service_requests ?? 0
  // const averageRating = globalSettings?.data?.average_customer_satisfaction_score ?? 0
  // const averageResponseTime = globalSettings?.data?.average_time_to_receive_a_quote ?? 0
  return (
    <>
      <HeroSection />
      <ServicesCarouselSection />
      <HowDoesItWorkSection />
      {/* <StatsSection activeVendorsCount={activeVendorsCount} activeRequestsCount={activeRequestsCount} averageRating={averageRating} averageResponseTime={averageResponseTime} /> */}
      <StatsSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  )
}
