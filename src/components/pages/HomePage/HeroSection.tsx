import { getRequestAServiceRoutePath, getServiceProviderRoutePath } from "@/routes/routes"
import { getGlobalSettings } from "@/utils/getGlobalSettings"
import Link from "next/link"
import { FiBriefcase, FiSearch } from "react-icons/fi"

const CheckIcon = () => (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
        <polyline points="20,6 9,17 4,12" />
    </svg>
)

const TRUST_ITEMS = [
    "Gratuit & sans engagement",
    "Réponse en 24h",
    "Pros vérifiés",
] as const

export function formatVerifiedProfessionalsLabel(count: number): string {
    if (count <= 0) return "Professionnels vérifiés"
    const formatted = new Intl.NumberFormat("fr-FR").format(count)
    return `+${formatted} professionnels vérifiés`
}

export default async function HeroSection({ activeVendorsCount }: { activeVendorsCount: number }) {
    return (
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-br from-[#FAFBFF] via-[#F0F4FF] to-[#FFF8ED] dark:from-slate-900 dark:via-[#0f172a] dark:to-slate-900 px-[4%] py-8 text-center sm:px-[5%] sm:py-12">
            <div
                aria-hidden
                className="pointer-events-none absolute -top-[200px] -right-[200px] size-[700px] rounded-full bg-[radial-gradient(circle,rgba(27,79,255,0.06)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(27,79,255,0.12)_0%,transparent_70%)]"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-[100px] -left-[100px] size-[500px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.07)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(245,158,11,0.12)_0%,transparent_70%)]"
            />

            <div className="relative z-1 w-full max-w-[720px]">
                <div className="mb-7 inline-flex animate-hero-fade-down items-center gap-2 rounded-full border-[1.5px] border-blue-light dark:border-primaryColor/30 bg-appCard px-3.5 py-1.5 text-[13px] font-semibold text-primaryColor shadow-[0_2px_8px_rgba(27,79,255,0.1)]">
                    <span className="size-1.5 shrink-0 animate-hero-pulse rounded-full bg-trust-green" />
                    {formatVerifiedProfessionalsLabel(activeVendorsCount)}
                </div>

                <h1 className="mb-5 animate-hero-fade-up text-[clamp(38px,4.5vw,56px)] leading-[1.1] font-extrabold tracking-[-1.5px] text-appText [animation-delay:0.1s]">
                    La plateforme qui connecte{" "}
                    <span className="relative text-primaryColor">
                        clients
                        <span
                            aria-hidden
                            className="absolute right-0 bottom-1 left-0 h-1 origin-left animate-hero-underline rounded-sm bg-linear-to-r from-primaryColor to-amber-500"
                        />
                    </span>{" "}
                    et professionnels
                </h1>

                <p className="mx-auto mb-9 max-w-[520px] animate-hero-fade-up text-[17px] leading-[1.65] text-appTextSec [animation-delay:0.2s]">
                    Nettoyage, sécurité, jardinage et plus encore — trouvez le bon prestataire en quelques clics, ou développez votre activité en accédant à des leads qualifiés.
                </p>

                <div className="grid animate-hero-fade-up grid-cols-1 gap-3 sm:grid-cols-2 [animation-delay:0.3s]">
                    <Link
                        href={getRequestAServiceRoutePath()}
                        className="group w-full cursor-pointer rounded-2xl border-2 border-transparent bg-appCard p-5 text-left shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] transition-all duration-250 hover:-translate-y-0.5 hover:border-primaryColor hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
                    >
                        <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-blue-light dark:bg-primaryColor/15 text-primaryColor">
                            <FiSearch className="size-5.5" aria-hidden />
                        </div>
                        <h3 className="mb-1 text-[15px] font-bold text-appText">
                            Je cherche un professionnel
                        </h3>
                        <p className="mb-3.5 text-[13px] leading-normal text-appTextSec">
                            Postez votre besoin gratuitement et recevez des devis en moins de 24h.
                        </p>
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-primaryColor px-4 py-2 text-[13px] font-semibold text-white transition-colors group-hover:bg-blue-dark">
                            Trouver un pro →
                        </span>
                    </Link>

                    <Link
                        href={getServiceProviderRoutePath()}
                        className="group w-full cursor-pointer rounded-2xl border-2 border-transparent bg-appCard p-5 text-left shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] transition-all duration-250 hover:-translate-y-0.5 hover:border-amber-500 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
                    >
                        <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-amber-light dark:bg-amber/15 text-amber-500">
                            <FiBriefcase className="size-5.5" aria-hidden />
                        </div>
                        <h3 className="mb-1 text-[15px] font-bold text-appText">
                            Je suis un professionnel
                        </h3>
                        <p className="mb-3.5 text-[13px] leading-normal text-appTextSec">
                            Accédez à des demandes qualifiées près de chez vous. Payez seulement ce que vous utilisez.
                        </p>
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-[13px] font-semibold text-white transition-colors group-hover:bg-amber-dark">
                            Trouver des clients →
                        </span>
                    </Link>
                </div>

                <div className="mt-6 flex animate-hero-fade-up flex-wrap items-center justify-center gap-5 [animation-delay:0.4s]">
                    {TRUST_ITEMS.map((item) => (
                        <div key={item} className="flex items-center gap-1.5 text-[13px] text-appTextSec">
                            <span className="shrink-0 text-trust-green">
                                <CheckIcon />
                            </span>
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
