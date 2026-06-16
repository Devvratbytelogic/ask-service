"use client"

import { openModal } from "@/redux/slices/allModalSlice"
import { useDispatch } from "react-redux"

export default function CtaSection() {
    const dispatch = useDispatch()

    const openCustomerRequestModal = () => {
        dispatch(openModal({
            componentName: "RequestServiceFlowIndex",
            data: {},
            modalSize: "lg",
        }))
    }

    const openVendorSignupModal = () => {
        dispatch(openModal({
            componentName: "LoginSignupIndex",
            data: {
                componentName: "SelectUserType",
                preselectedUserType: "service",
            },
            modalSize: "full",
        }))
    }

    return (
        <section className="relative overflow-hidden bg-linear-to-br from-blue-light to-[#FFF8ED] px-[5%] py-[100px] text-center">
            <div
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(27,79,255,0.08)_0%,transparent_70%)]"
            />

            <div className="relative z-1">
                <div className="mx-auto mb-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-blue-light px-3 py-1.5 text-xs font-bold tracking-[1px] text-primaryColor uppercase">
                    ✦ Rejoignez-nous
                </div>

                <h2 className="mb-4 text-[clamp(32px,4vw,52px)] leading-[1.1] font-extrabold tracking-[-1.5px] text-slate-900">
                    Prêt à commencer ?
                </h2>

                <p className="mx-auto mb-10 max-w-[500px] text-[17px] leading-[1.65] text-slate-500">
                    Que vous cherchiez un professionnel ou des clients, Ask-Service est fait pour vous. Inscription gratuite en 2 minutes.
                </p>

                <div className="flex flex-wrap justify-center gap-3.5">
                    <button
                        type="button"
                        onClick={openCustomerRequestModal}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-primaryColor px-8 py-3.5 text-base font-semibold text-white shadow-[0_4px_16px_rgba(27,79,255,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-dark hover:shadow-[0_8px_24px_rgba(27,79,255,0.35)]"
                    >
                        🔍 Je cherche un professionnel
                    </button>
                    <button
                        type="button"
                        onClick={openVendorSignupModal}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-amber-500 px-8 py-3.5 text-base font-semibold text-white shadow-[0_4px_16px_rgba(245,158,11,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-dark hover:shadow-[0_8px_24px_rgba(245,158,11,0.35)]"
                    >
                        💼 Je suis un professionnel
                    </button>
                </div>
            </div>
        </section>
    )
}
