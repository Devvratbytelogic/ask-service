import React from 'react'
import ContactFaq from '@/components/pages/contact-us/ContactFaq'
import Link from 'next/link'
import { getContactUsRoutePath } from '@/routes/routes'

export default function FaqPage() {
    return (
        <div className="min-h-screen body_x_axis_padding container_y_padding_lg w-full max-w-2xl md:max-w-none md:w-2/3 mx-auto space-y-10">
            <section className="w-full md:w-2/4 md:mx-auto">
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-fontBlack mb-2 md:mb-4">
                    Frequently Asked Questions
                </h1>
                <p className="text-sm md:text-base text-darkSilver/90">
                    Quick answers to common questions. Can&apos;t find what you need?{' '}
                    <Link href={getContactUsRoutePath()} className="text-primary font-medium hover:underline">
                        Contact us
                    </Link>
                    .
                </p>
            </section>
            <section className="w-full min-w-0 overflow-hidden">
                <ContactFaq />
            </section>
        </div>
    )
}
