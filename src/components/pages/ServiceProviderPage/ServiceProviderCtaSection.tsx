"use client"

import { openModal } from "@/redux/slices/allModalSlice"
import { getLoginPageRoutePath, getRegistrationPageRoutePath } from "@/routes/routes"
import Link from "next/link"
import { useDispatch } from "react-redux"

const ArrowIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
)

export default function ServiceProviderCtaSection() {
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

    return (
        <section className="relative overflow-hidden bg-linear-to-br from-amber-50 via-slate-50 to-white dark:from-[#1B0F00] dark:via-slate-900 dark:to-[#1B1040] px-[5%] py-[100px] text-center">
            <div
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(245,158,11,0.08)_0%,transparent_65%)] dark:bg-[radial-gradient(ellipse,rgba(245,158,11,0.12)_0%,transparent_65%)]"
            />

            <div className="relative z-1">
                <div className="mx-auto mb-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-500/15 px-3.5 py-1.5 text-[11px] font-bold tracking-[1.2px] text-amber-500 uppercase">
                    ✦ Rejoignez-nous
                </div>

                <h2 className="mb-3.5 text-[clamp(30px,4vw,50px)] leading-[1.1] font-extrabold tracking-[-1.5px] text-appText dark:text-white">
                    Prêt à trouver vos <span className="text-amber-500">prochains clients</span> ?
                </h2>

                <p className="mx-auto mb-9 max-w-[460px] text-base leading-[1.65] text-appTextSec dark:text-white/50">
                    Inscription gratuite en 2 minutes. Votre compte est validé sous 24h et vous accédez immédiatement aux leads de votre secteur.
                </p>

                <Link
                    href={getRegistrationPageRoutePath({ role: 'vendor' })}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-amber-500 px-9 py-4 text-base font-bold text-appText shadow-[0_4px_20px_rgba(245,158,11,0.3)] transition-all duration-250 hover:-translate-y-0.5 hover:bg-amber-dark hover:shadow-[0_8px_28px_rgba(245,158,11,0.4)] no-underline"
                >
                    Créer mon compte gratuitement
                    <ArrowIcon />
                </Link>
                <p className="mt-4 text-[13px] text-appTextMuted dark:text-white/35">
                    Déjà un compte ?{' '}
                    <Link
                        href={getLoginPageRoutePath({ role: 'vendor' })}
                        className="font-semibold text-appTextSec dark:text-white/55 no-underline transition-colors hover:text-appText dark:hover:text-white/80"
                    >
                        Se connecter →
                    </Link>
                </p>
            </div>
        </section>
    )
}
