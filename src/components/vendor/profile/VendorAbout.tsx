import { CalendarSVG, UsersIconSVG, TimeIconSVG, EnvelopeIconSVG, PhoneIconSVG } from '@/components/library/AllSVG';
import Link from 'next/link';

export default function VendorAbout() {
    return (
        <>
            <div className="space-y-6">
                <section>
                    <h2 className="mb-3 text-xl font-bold text-fontBlack">About</h2>
                    <p className="text-sm text-darkSilver">
                        Securatim is a leading private security and guarding
                        company, offering a full range of security services for
                        businesses. Our security officers are trained to handle
                        all emergency situations, and we are committed to
                        providing our clients with superior security solutions.
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
                                    2 years
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
                                    2-10
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
                                    17 hours
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
                            <Link href="mailto:contact@securatim.co.uk" className="hover:underline" >contact@securatim.co.uk</Link>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-darkSilver">
                            <PhoneIconSVG />
                            <Link href={`tel:02071234567`} className="hover:underline" >020 7123 4567</Link>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
