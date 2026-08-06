import type { ReactNode } from 'react'
import { FiBarChart2, FiCreditCard, FiLock, FiZap } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa6'
import { HiSparkles } from 'react-icons/hi2'
import { MdOutlineGpsFixed } from 'react-icons/md'

type Benefit = {
    icon: ReactNode
    title: string
    description: string
}

const BENEFITS: Benefit[] = [
    {
        icon: <MdOutlineGpsFixed className="size-5" aria-hidden />,
        title: "Leads hyper-ciblés",
        description:
            "Filtrez par catégorie, zone géographique et type de client. Vous ne voyez que les opportunités pertinentes.",
    },
    {
        icon: <FiCreditCard className="size-5" aria-hidden />,
        title: "Aucun abonnement",
        description:
            "Rechargez votre portefeuille à la demande. Vos crédits n'expirent jamais.",
    },
    {
        icon: <FiZap className="size-5" aria-hidden />,
        title: "Accès immédiat",
        description:
            "Dès votre inscription validée, consultez les leads disponibles dans votre secteur en temps réel.",
    },
    {
        icon: <FaStar className="size-5" aria-hidden />,
        title: "Réputation en ligne",
        description:
            "Collectez des avis vérifiés après chaque mission. Votre profil devient votre meilleur commercial.",
    },
    {
        icon: <FiLock className="size-5" aria-hidden />,
        title: "Clients sérieux",
        description:
            "Chaque demande est soumise par un client réel identifié. Fini les prospects non qualifiés.",
    },
    {
        icon: <FiBarChart2 className="size-5" aria-hidden />,
        title: "Tableau de bord complet",
        description:
            "Suivez vos leads, devis, missions et dépenses depuis un seul espace clair et intuitif.",
    },
]

function BenefitItem({ benefit }: { benefit: Benefit }) {
    return (
        <div className="flex items-start gap-3.5 rounded-2xl border border-appBorderSub dark:border-white/7 bg-appSurface dark:bg-white/4 p-5 transition-all duration-200 hover:border-amber-500/40 dark:hover:border-amber-500/20 hover:bg-appCard dark:hover:bg-appCard/7">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/12 text-amber-500">
                {benefit.icon}
            </div>
            <div>
                <strong className="mb-1 block text-sm font-bold text-appText dark:text-white">
                    {benefit.title}
                </strong>
                <span className="text-[13px] leading-[1.6] text-appTextSec dark:text-white/45">
                    {benefit.description}
                </span>
            </div>
        </div>
    )
}

export default function ServiceProviderBenefits() {
    return (
        <section className="relative overflow-hidden bg-appSurface dark:bg-slate-900 px-[5%] py-[100px]">
            <div
                aria-hidden
                className="pointer-events-none absolute -top-[200px] -right-[100px] size-[600px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.06)_0%,transparent_65%)] dark:bg-[radial-gradient(circle,rgba(245,158,11,0.08)_0%,transparent_65%)]"
            />

            <div className="relative z-1 mb-[60px] text-center">
                <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3.5 py-1.5 text-[11px] font-bold tracking-[1.2px] text-amber-500 uppercase">
                    <HiSparkles className="size-3.5" aria-hidden />
                    Pourquoi Ask-Service
                </div>
                <h2 className="text-[clamp(28px,3.5vw,42px)] leading-[1.12] font-extrabold tracking-[-0.8px] text-appText dark:text-white">
                    Tout ce dont vous avez besoin
                    <br />
                    pour développer votre activité
                </h2>
            </div>

            <div className="relative z-1 mx-auto grid max-w-[800px] grid-cols-1 gap-4 md:grid-cols-2">
                {BENEFITS.map((benefit) => (
                    <BenefitItem key={benefit.title} benefit={benefit} />
                ))}
            </div>
        </section>
    )
}
