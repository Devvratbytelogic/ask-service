"use client"

import { openModal } from "@/redux/slices/allModalSlice"
import { useDispatch } from "react-redux"

const TRUST_ITEMS = [
    "Sans abonnement",
    "Vous payez seulement les contacts",
    "Demandes qualifiées",
] as const

const CheckIcon = () => (
    <svg width="10" height="10" fill="none" stroke="#10B981" strokeWidth="3" viewBox="0 0 24 24" aria-hidden="true">
        <polyline points="20,6 9,17 4,12" />
    </svg>
)

const ArrowIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
)

const InfoIcon = () => (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
    </svg>
)

export default function ServiceProviderHero() {
    const dispatch = useDispatch()

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

    const scrollToHowItWorks = () => {
        document.getElementById("comment-ca-marche")?.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-br from-slate-900 from-0% via-[#1B2040] via-45% to-[#1A1000] to-100% px-[5%] pt-[120px] pb-20 text-center">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[48px_48px]"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -top-20 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(245,158,11,0.1)_0%,transparent_65%)]"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -right-[100px] -bottom-[100px] size-[500px] rounded-full bg-[radial-gradient(circle,rgba(27,79,255,0.08)_0%,transparent_65%)]"
            />

            <div className="relative z-1 max-w-[760px]">
                <div className="mb-7 inline-flex animate-hero-fade-down items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/12 px-4 py-1.5 text-xs font-semibold text-amber-500">
                    <span className="size-1.5 shrink-0 animate-hero-pulse rounded-full bg-amber-500" />
                    +1 200 professionnels font confiance à Ask-Service
                </div>

                <h1 className="mb-5 animate-hero-fade-up text-[clamp(36px,5vw,64px)] leading-[1.05] font-extrabold tracking-[-2px] text-white [animation-delay:0.1s]">
                    Trouvez des{" "}
                    <span className="relative inline-block text-amber-500">
                        clients qualifiés
                        <span
                            aria-hidden
                            className="absolute right-0 bottom-[3px] left-0 h-[3px] origin-left animate-hero-underline rounded-sm bg-amber-500/40"
                        />
                    </span>
                    <br />
                    près de chez vous
                </h1>

                <p className="mx-auto mb-10 max-w-[540px] animate-hero-fade-up text-lg leading-[1.7] text-white/50 [animation-delay:0.2s]">
                    Accédez à des demandes locales vérifiées, choisissez celles qui vous intéressent et développez votre activité. Sans abonnement — vous ne payez que les contacts qui vous intéressent.
                </p>

                <div className="flex animate-hero-fade-up flex-wrap justify-center gap-3 [animation-delay:0.3s]">
                    <button
                        type="button"
                        onClick={openVendorSignupModal}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-amber-500 px-9 py-4 text-base font-bold text-slate-900 shadow-[0_4px_20px_rgba(245,158,11,0.3)] transition-all duration-250 hover:-translate-y-0.5 hover:bg-amber-dark hover:shadow-[0_8px_28px_rgba(245,158,11,0.4)]"
                    >
                        Commencer gratuitement
                        <ArrowIcon />
                    </button>
                    <button
                        type="button"
                        onClick={scrollToHowItWorks}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border-[1.5px] border-white/12 bg-white/6 px-7 py-4 text-[15px] font-medium text-white/70 transition-all duration-200 hover:border-white/25 hover:bg-white/10 hover:text-white"
                    >
                        <InfoIcon />
                        Comment ça marche
                    </button>
                </div>

                <div className="mt-10 flex animate-hero-fade-up flex-wrap justify-center gap-6 [animation-delay:0.4s]">
                    {TRUST_ITEMS.map((item) => (
                        <div key={item} className="flex items-center gap-1.5 text-[13px] text-white/45">
                            <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full border border-trust-green/30 bg-trust-green/15">
                                <CheckIcon />
                            </span>
                            {item}
                        </div>
                    ))}
                </div>

                <div className="relative z-1 mt-16 animate-hero-fade-up [animation-delay:0.5s]">
                    <div className="mx-auto flex max-w-[580px] flex-col divide-y divide-white/7 rounded-[20px] border border-white/8 bg-white/4 backdrop-blur-md sm:flex-row sm:divide-x sm:divide-y-0">
                        {[
                            { value: <>1<span className="text-amber-500">,</span>200<span className="text-amber-500">+</span></>, label: "Pros actifs" },
                            { value: <>8<span className="text-amber-500">k+</span></>, label: "Leads traités" },
                            { value: <>4<span className="text-amber-500">.</span>9<span className="text-amber-500">/5</span></>, label: "Satisfaction" },
                        ].map((stat) => (
                            <div key={stat.label} className="flex-1 px-7 py-6 text-center">
                                <div className="text-[32px] leading-none font-extrabold tracking-[-1px] text-white">
                                    {stat.value}
                                </div>
                                <div className="mt-1 text-xs text-white/40">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
