import React from 'react'

export default function TermsPage() {
    return (
        <div className="min-h-screen body_x_axis_padding container_y_padding_lg w-full max-w-2xl md:max-w-none md:w-2/3 mx-auto space-y-10">
            <section className="w-full md:w-2/4 md:mx-auto">
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-fontBlack mb-2 md:mb-4">
                    Terms & Service
                </h1>
                <p className="text-sm md:text-base text-darkSilver/90">
                    Please read these terms and conditions carefully before using Ask Service.
                </p>
            </section>
            <section className="w-full space-y-6 prose prose-sm max-w-none text-fontBlack">
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">1. Acceptance of Terms</h2>
                    <p className="text-sm text-darkSilver/90">
                        By accessing or using Ask Service, you agree to be bound by these Terms & Service. If you do not agree with any part of these terms, you may not use our service.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">2. Use of Service</h2>
                    <p className="text-sm text-darkSilver/90">
                        You agree to use the service only for lawful purposes and in accordance with these terms. You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">3. User Conduct</h2>
                    <p className="text-sm text-darkSilver/90">
                        You agree not to use the service to transmit any harmful, offensive, or illegal content. We reserve the right to suspend or terminate accounts that violate these guidelines.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">4. Changes to Terms</h2>
                    <p className="text-sm text-darkSilver/90">
                        We may update these terms from time to time. We will notify you of any changes by posting the new terms on this page. Your continued use of the service after any changes constitutes acceptance of the new terms.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">5. Contact</h2>
                    <p className="text-sm text-darkSilver/90">
                        If you have questions about these Terms & Service, please contact us through our Contact Us page.
                    </p>
                </div>
            </section>
        </div>
    )
}
