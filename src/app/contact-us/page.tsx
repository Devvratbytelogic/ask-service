import React from 'react'
import ContactForm from '@/components/pages/contact-us/ContactForm'
import ContactFaq from '@/components/pages/contact-us/ContactFaq'
import AskQuestionCallout from '@/components/pages/contact-us/AskQuestionCallout'
import { AddressIconSVG, ClockIconSVG } from '@/components/library/AllSVG'

export default function ContactUsPage() {
    const ADDRESS = '1258 Maplewood Avenue, Suite 402'
    const OFFICE_HOURS = 'Monday to Friday: 9:00 AM - 6:00 PM'
    return (
        <>
            {/* <div style={{ backgroundImage: 'url(/images/home/banner_gradient.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}> */}
            <div className="min-h-screen body_x_axis_padding container_y_padding_lg w-full max-w-2xl md:max-w-none md:w-2/3 mx-auto space-y-10 sm:space-y-12 md:space-y-16">
                <section className="w-full md:w-2/4 md:mx-auto">
                    <div
                        className="absolute inset-0 top-0 left-0 h-48 sm:h-64 md:h-80 from-[#F8F9FC] to-transparent rounded-b-2xl pointer-events-none"
                        aria-hidden
                    />
                    <div className="relative">
                        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-fontBlack mb-2 md:mb-4">
                            Got questions?
                        </h1>
                        <p className="text-sm md:text-base text-darkSilver/90">
                            Reach out to us and we will try to help you with anything. Whether you&apos;re ready to begin or just have questions.
                        </p>
                    </div>
                </section>
                <section className="w-full md:w-2/4 md:mx-auto">
                    <ContactForm />
                </section>
                <section className="w-full flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-10 justify-center items-start sm:items-center">
                    <div className="flex gap-3 items-start w-full sm:w-auto min-w-0">
                        <span className="rounded-xl p-3 sm:p-4 bg-primary/10 text-darkSilver shrink-0">
                            <AddressIconSVG />
                        </span>
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-darkSilver mb-0.5">Address</p>
                            <p className="text-sm font-medium text-fontBlack wrap-break-word">{ADDRESS}</p>
                        </div>
                    </div>
                    <div className="flex gap-3 items-start w-full sm:w-auto min-w-0">
                        <span className="rounded-xl p-3 sm:p-4 bg-primary/10 text-darkSilver shrink-0">
                            <ClockIconSVG />
                        </span>
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-darkSilver mb-0.5">Office Hours</p>
                            <p className="text-sm font-medium text-fontBlack wrap-break-word">{OFFICE_HOURS}</p>
                        </div>
                    </div>
                </section>
                <section className="w-full min-w-0 overflow-hidden">
                    <ContactFaq />
                </section>
                <section className="w-full min-w-0">
                    <AskQuestionCallout />
                </section>
            </div>
            {/* </div> */}
        </>
    )
}
