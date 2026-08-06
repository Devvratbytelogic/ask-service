"use client"

import { getRequestAServiceRoutePath, getServiceProviderRoutePath } from "@/routes/routes"
import Link from "next/link"
import { FiBriefcase, FiSearch } from "react-icons/fi"
import { HiSparkles } from "react-icons/hi2"

export default function CtaSection() {
    return (
        <section className="relative overflow-hidden bg-linear-to-br from-blue-light to-[#FFF8ED] dark:from-slate-900 dark:to-[#1a1200] px-[5%] py-[100px] text-center">
            <div
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(27,79,255,0.08)_0%,transparent_70%)]"
            />

            <div className="relative z-1">
                <div className="mx-auto mb-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-blue-light dark:bg-primaryColor/15 px-3 py-1.5 text-xs font-bold tracking-[1px] text-primaryColor uppercase">
                    <HiSparkles className="size-3.5" aria-hidden />
                    Rejoignez-nous
                </div>

                <h2 className="mb-4 text-[clamp(32px,4vw,52px)] leading-[1.1] font-extrabold tracking-[-1.5px] text-appText">
                    Prêt à commencer ?
                </h2>

                <p className="mx-auto mb-10 max-w-[500px] text-[17px] leading-[1.65] text-appTextSec">
                    Que vous cherchiez un professionnel ou des clients, Ask-Service est fait pour vous. Inscription gratuite en 2 minutes.
                </p>

                <div className="flex flex-wrap justify-center gap-3.5">
                    <Link
                        href={getRequestAServiceRoutePath()}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-primaryColor px-8 py-3.5 text-base font-semibold text-white shadow-[0_4px_16px_rgba(27,79,255,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-dark hover:shadow-[0_8px_24px_rgba(27,79,255,0.35)]"
                    >
                        <FiSearch className="size-4 shrink-0" aria-hidden />
                        Je cherche un professionnel
                    </Link>
                    <Link
                        href={getServiceProviderRoutePath()}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-amber-500 px-8 py-3.5 text-base font-semibold text-white shadow-[0_4px_16px_rgba(245,158,11,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-dark hover:shadow-[0_8px_24px_rgba(245,158,11,0.35)]"
                    >
                        <FiBriefcase className="size-4 shrink-0" aria-hidden />
                        Je suis un professionnel
                    </Link>
                </div>
            </div>
        </section>
    )
}
