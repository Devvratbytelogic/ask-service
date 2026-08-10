"use client"
import { getLoginPageRoutePath, getRegistrationPageRoutePath } from "@/routes/routes"
import Link from "next/link"

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

export default function ServiceProviderHero({ activeVendorsCount, activeRequestsCount, averageRating }: { activeVendorsCount: number, activeRequestsCount: number, averageRating: number }) {
    const scrollToHowItWorks = () => {
        document.getElementById("comment-ca-marche")?.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-br from-amber-light via-[#FFF8ED] to-[#FAFBFF] dark:from-slate-900 dark:via-[#1B2040] dark:to-[#1A1000] px-[5%] pt-30 pb-20 text-center -mt-16">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[48px_48px]"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -top-20 left-1/2 h-125 w-225 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(245,158,11,0.08)_0%,transparent_65%)] dark:bg-[radial-gradient(ellipse,rgba(245,158,11,0.1)_0%,transparent_65%)]"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -right-25 -bottom-25 size-125 rounded-full bg-[radial-gradient(circle,rgba(27,79,255,0.05)_0%,transparent_65%)] dark:bg-[radial-gradient(circle,rgba(27,79,255,0.08)_0%,transparent_65%)]"
            />

            <div className="relative z-1 max-w-200">
                <div className="mb-7 inline-flex animate-hero-fade-down items-center gap-2 rounded-3xl border border-amber-500/25 bg-amber-500/12 px-4 py-1.5 text-xs font-semibold text-amber-500">
                    <span className="size-1.5 shrink-0 animate-hero-pulse rounded-full bg-amber-500" />
                    Trouver des professionnels vérifiés
                </div>

                <h1 className="mb-5 animate-hero-fade-up text-5xl leading-[1.05] font-extrabold tracking-[-2px] text-appText dark:text-white [animation-delay:0.1s]">
                    Trouvez des{" "}
                    <span className="relative inline-block text-amber-500">
                        clients qualifiés
                        <span
                            aria-hidden
                            className="absolute right-0 bottom-0.5 left-0 h-0.5 origin-left animate-hero-underline rounded-0.5 bg-amber-500/40"
                        />
                    </span>
                    <br />
                    près de chez vous
                </h1>

                <p className="mx-auto mb-10 max-w-135 animate-hero-fade-up text-lg leading-[1.7] text-appTextSec dark:text-white/50 [animation-delay:0.2s]">
                    Accédez à des demandes locales vérifiées, choisissez celles qui vous intéressent et développez votre activité. Sans abonnement — vous ne payez que les contacts qui vous intéressent.
                </p>

                <div className="flex animate-hero-fade-up flex-wrap justify-center gap-3 [animation-delay:0.3s]">
                    <Link
                        href={getRegistrationPageRoutePath({ role: 'vendor' })}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-amber-500 px-9 py-4 text-base font-bold text-appText shadow-[0_4px_20px_rgba(245,158,11,0.3)] transition-all duration-250 hover:-translate-y-0.5 hover:bg-amber-dark hover:shadow-[0_8px_28px_rgba(245,158,11,0.4)] no-underline"
                    >
                        Commencer gratuitement
                        <ArrowIcon />
                    </Link>
                    <button
                        type="button"
                        onClick={scrollToHowItWorks}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border-[1.5px] border-appBorder bg-appCard/80 text-appTextSec dark:border-white/12 dark:bg-white/6 dark:text-white/70 px-7 py-4 text-[15px] font-medium transition-all duration-200 hover:border-appBorder hover:bg-appCard hover:text-appText dark:hover:border-white/25 dark:hover:bg-appOverlay-5 dark:hover:text-white"
                    >
                        <InfoIcon />
                        Comment ça marche
                    </button>
                </div>
                <p className="mt-4 animate-hero-fade-up text-[13px] text-appTextMuted dark:text-white/35 [animation-delay:0.35s]">
                    Déjà un compte ?{' '}
                    <Link
                        href={getLoginPageRoutePath({ role: 'vendor' })}
                        className="font-semibold text-appTextSec dark:text-white/55 no-underline transition-colors hover:text-appText dark:hover:text-white/80"
                    >
                        Se connecter →
                    </Link>
                </p>

                <div className="mt-10 flex animate-hero-fade-up flex-wrap justify-center gap-6 [animation-delay:0.4s]">
                    {TRUST_ITEMS.map((item) => (
                        <div key={item} className="flex items-center gap-1.5 text-[13px] text-appTextSec dark:text-white/45">
                            <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full border border-trust-green/30 bg-trust-green/15">
                                <CheckIcon />
                            </span>
                            {item}
                        </div>
                    ))}
                </div>

                <div className="relative z-1 mt-16 animate-hero-fade-up [animation-delay:0.5s]">
                    <div className="mx-auto flex max-w-145 flex-col divide-y divide-slate-100 dark:divide-white/7 rounded-3xl border border-appBorder dark:border-white/8 bg-appCard dark:bg-white/4 backdrop-blur-md sm:flex-row sm:divide-x sm:divide-y-0">
                        {[
                            { value: <>{activeVendorsCount}<span className="text-amber-500">+</span></>, label: "Pros actifs" },
                            { value: <>{activeRequestsCount}<span className="text-amber-500">+</span></>, label: "Leads traités" },
                            { value: <>{averageRating}<span className="text-amber-500">/5</span></>, label: "Satisfaction" },
                        ].map((stat) => (
                            <div key={stat.label} className="flex-1 px-7 py-6 text-center">
                                <div className="text-[32px] leading-none font-extrabold tracking-[-1px] text-appText dark:text-white">
                                    {stat.value}
                                </div>
                                <div className="mt-1 text-xs text-appTextMuted dark:text-white/40">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
