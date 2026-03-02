import { CalendarSVG, UsersIconSVG, TimeIconSVG, EnvelopeIconSVG, PhoneIconSVG } from '@/components/library/AllSVG';
import Link from 'next/link';
import type { IVendorProfileInfoData } from '@/types/vendorProfile';

interface VendorAboutProps {
    profile?: IVendorProfileInfoData | null
}

export default function VendorAbout({ profile }: VendorAboutProps) {
    const aboutText = profile?.about_company || 'Securatim is a leading private security and guarding company, offering a full range of security services for businesses. Our security officers are trained to handle all emergency situations, and we are committed to providing our clients with superior security solutions.';
    const yearsOfActivity = profile?.years_of_activity || '2 years';
    const companySize = profile?.company_size || '2-10';
    const responseTime = profile?.response_time || '17 hours';
    const email = profile?.email || 'contact@securatim.co.uk';
    const phone = profile?.phone || '020 7123 4567';

    return (
        <>
            <div className="space-y-6">
                <section>
                    <h2 className="mb-3 text-xl font-bold text-fontBlack">About</h2>
                    <p className="text-sm text-darkSilver">
                        {aboutText}
                    </p>
                </section>

                <section>
                    <h2 className="mb-3 text-xl font-bold text-fontBlack">Overview</h2>
                    <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-20">
                        <div className="flex items-start gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-customWhite">
                                <CalendarSVG />
                            </div>
                            <div>
                                <p className="text-sm text-darkSilver">
                                    In operation for
                                </p>
                                <p className="text-sm font-bold text-fontBlack">
                                    {yearsOfActivity}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-customWhite">
                                <UsersIconSVG />
                            </div>
                            <div>
                                <p className="text-sm text-darkSilver">
                                    Employees
                                </p>
                                <p className="text-sm font-bold text-fontBlack">
                                    {companySize}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-customWhite">
                                <TimeIconSVG />
                            </div>
                            <div>
                                <p className="text-sm text-darkSilver">
                                    Response time
                                </p>
                                <p className="text-sm font-bold text-fontBlack">
                                    {responseTime}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className='border border-[#EED] bg-customWhite p-4 rounded-2xl'>
                    <h2 className="mb-4 text-sm font-semibold text-fontBlack">
                        Contact Information
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-darkSilver">
                            <EnvelopeIconSVG />
                            <Link href={`mailto:${email}`} className="hover:underline" >{email}</Link>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-darkSilver">
                            <PhoneIconSVG />
                            <Link href={`tel:${phone}`} className="hover:underline" >{phone}</Link>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
