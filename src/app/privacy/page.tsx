import React from 'react'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen body_x_axis_padding container_y_padding_lg w-full max-w-2xl md:max-w-none md:w-2/3 mx-auto space-y-10">
            <section className="w-full md:w-2/4 md:mx-auto">
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-fontBlack mb-2 md:mb-4">
                    Privacy Policy
                </h1>
                <p className="text-sm md:text-base text-darkSilver/90">
                    Your privacy is important to us. This policy explains how Ask Service collects, uses, and protects your information.
                </p>
            </section>
            <section className="w-full space-y-6 prose prose-sm max-w-none text-fontBlack">
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">1. Information We Collect</h2>
                    <p className="text-sm text-darkSilver/90">
                        We collect information you provide when you register, request a service, or contact us. This may include your name, email address, phone number, and address. We also collect usage data to improve our service.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">2. How We Use Your Information</h2>
                    <p className="text-sm text-darkSilver/90">
                        We use your information to provide and improve our services, process requests, communicate with you, and ensure the security of our platform. We do not sell your personal information to third parties.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">3. Data Security</h2>
                    <p className="text-sm text-darkSilver/90">
                        We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">4. Cookies and Tracking</h2>
                    <p className="text-sm text-darkSilver/90">
                        We may use cookies and similar technologies to enhance your experience, analyze usage, and deliver relevant content. You can manage cookie preferences in your browser settings.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">5. Your Rights</h2>
                    <p className="text-sm text-darkSilver/90">
                        You have the right to access, correct, or delete your personal data. You may also opt out of marketing communications. Contact us to exercise these rights.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">6. Contact Us</h2>
                    <p className="text-sm text-darkSilver/90">
                        If you have questions about this Privacy Policy, please contact us through our Contact Us page.
                    </p>
                </div>
            </section>
        </div>
    )
}
