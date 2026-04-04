import { CalendarSVG, UsersIconSVG, TimeIconSVG, EnvelopeIconSVG, PhoneIconSVG } from '@/components/library/AllSVG';
import Link from 'next/link';
import { IVendorDetailsAPIResponseDataVendor } from '@/types/vendorDetails';

interface VendorAboutProps {
    profile?: IVendorDetailsAPIResponseDataVendor | null
}

export default function VendorAbout({ profile }: VendorAboutProps) {
    const aboutText = profile?.about_company || '-';
    const yearsOfActivity = profile?.years_of_activity || '-';
    const companySize = profile?.company_size || '-';
    const responseTime = profile?.response_time || '-';
    const email = profile?.email || '-';
    const phone = profile?.phone || '-';

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
