import React from 'react'
import CtaSection from '@/components/pages/HomePage/CtaSection'
import HeroSection from '@/components/pages/HomePage/HeroSection'
import HowDoesItWorkSection from '@/components/pages/HomePage/HowDoesItWorkSection'
import ServicesCarouselSection from '@/components/pages/HomePage/ServicesCarouselSection'
import StatsSection from '@/components/pages/HomePage/StatsSection'
import TestimonialsSection from '@/components/pages/HomePage/TestimonialsSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesCarouselSection />
      <HowDoesItWorkSection />
      <StatsSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  )
}
