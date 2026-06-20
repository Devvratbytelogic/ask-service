type Benefit = {
    icon: string
    title: string
    description: string
}

const BENEFITS: Benefit[] = [
    {
        icon: "🎯",
        title: "Leads hyper-ciblés",
        description:
            "Filtrez par catégorie, zone géographique et type de client. Vous ne voyez que les opportunités pertinentes.",
    },
    {
        icon: "💳",
        title: "Aucun abonnement",
        description:
            "Rechargez votre portefeuille à la demande. Vos crédits n'expirent jamais.",
    },
    {
        icon: "⚡",
        title: "Accès immédiat",
        description:
            "Dès votre inscription validée, consultez les leads disponibles dans votre secteur en temps réel.",
    },
    {
        icon: "⭐",
        title: "Réputation en ligne",
        description:
            "Collectez des avis vérifiés après chaque mission. Votre profil devient votre meilleur commercial.",
    },
    {
        icon: "🔒",
        title: "Clients sérieux",
        description:
            "Chaque demande est soumise par un client réel identifié. Fini les prospects non qualifiés.",
    },
    {
        icon: "📊",
        title: "Tableau de bord complet",
        description:
            "Suivez vos leads, devis, missions et dépenses depuis un seul espace clair et intuitif.",
    },
]

function BenefitItem({ benefit }: { benefit: Benefit }) {
    return (
        <div className="flex items-start gap-3.5 rounded-2xl border border-slate-100 dark:border-white/7 bg-slate-50 dark:bg-white/4 p-5 transition-all duration-200 hover:border-amber-500/40 dark:hover:border-amber-500/20 hover:bg-white dark:hover:bg-white/7">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/12 text-xl">
                {benefit.icon}
            </div>
            <div>
                <strong className="mb-1 block text-sm font-bold text-slate-900 dark:text-white">
                    {benefit.title}
                </strong>
                <span className="text-[13px] leading-[1.6] text-slate-500 dark:text-white/45">
                    {benefit.description}
                </span>
            </div>
        </div>
    )
}

export default function ServiceProviderBenefits() {
    return (
        <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-900 px-[5%] py-[100px]">
            <div
                aria-hidden
                className="pointer-events-none absolute -top-[200px] -right-[100px] size-[600px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.06)_0%,transparent_65%)] dark:bg-[radial-gradient(circle,rgba(245,158,11,0.08)_0%,transparent_65%)]"
            />

            <div className="relative z-1 mb-[60px] text-center">
                <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3.5 py-1.5 text-[11px] font-bold tracking-[1.2px] text-amber-500 uppercase">
                    ✦ Pourquoi Ask-Service
                </div>
                <h2 className="text-[clamp(28px,3.5vw,42px)] leading-[1.12] font-extrabold tracking-[-0.8px] text-slate-900 dark:text-white">
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
