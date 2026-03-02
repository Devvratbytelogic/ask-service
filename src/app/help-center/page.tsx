import React from 'react'
import Link from 'next/link'
import { getFaqRoutePath, getContactUsRoutePath } from '@/routes/routes'

export default function HelpCenterPage() {
    return (
        <div className="min-h-screen body_x_axis_padding container_y_padding_lg w-full max-w-2xl md:max-w-none md:w-2/3 mx-auto space-y-10">
            <section className="w-full md:w-2/4 md:mx-auto">
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-fontBlack mb-2 md:mb-4">
                    Help Center
                </h1>
                <p className="text-sm md:text-base text-darkSilver/90">
                    Find answers, get support, and learn how to get the most out of Ask Service.
                </p>
            </section>
            <section className="w-full grid gap-4 sm:grid-cols-2">
                <Link
                    href={getFaqRoutePath()}
                    className="block p-6 rounded-xl border border-[#E5E7EB] bg-white hover:border-primary/50 hover:shadow-md transition-all"
                >
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">FAQ</h2>
                    <p className="text-sm text-darkSilver">
                        Browse frequently asked questions and quick answers.
                    </p>
                </Link>
                <Link
                    href={getContactUsRoutePath()}
                    className="block p-6 rounded-xl border border-[#E5E7EB] bg-white hover:border-primary/50 hover:shadow-md transition-all"
                >
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">Contact Us</h2>
                    <p className="text-sm text-darkSilver">
                        Reach out to our team for personalized support.
                    </p>
                </Link>
            </section>
        </div>
    )
}
