type Step = {
    label: string
    icon: string
    title: string
    description: string
}

const STEPS: Step[] = [
    {
        label: "Étape 01",
        icon: "📋",
        title: "Créez votre profil",
        description:
            "Inscrivez-vous en 2 minutes. Renseignez vos services, votre zone d'intervention et vos disponibilités. C'est gratuit.",
    },
    {
        label: "Étape 02",
        icon: "🔓",
        title: "Débloquez les contacts",
        description:
            "Consultez les demandes disponibles dans votre secteur. Utilisez vos crédits pour accéder aux coordonnées des clients qui vous intéressent.",
    },
    {
        label: "Étape 03",
        icon: "🤝",
        title: "Remportez le chantier",
        description:
            "Contactez le client, envoyez votre devis et remportez la mission. Votre réputation grandit avec chaque avis positif.",
    },
]

function StepCard({ step }: { step: Step }) {
    return (
        <article className="group relative overflow-hidden rounded-[20px] border-[1.5px] border-appBorderSub bg-appCard p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-none transition-all duration-250 hover:-translate-y-1 hover:border-appBorder dark:hover:border-white/15 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.3)]">
            <div
                aria-hidden
                className="absolute top-0 right-0 left-0 h-[3px] origin-left scale-x-0 bg-linear-to-r from-amber-500 to-[#FCD34D] transition-transform duration-300 group-hover:scale-x-100"
            />
            <div className="mb-3.5 flex items-center gap-2 text-[11px] font-extrabold tracking-[1px] text-amber-500 uppercase">
                <span className="size-6 rounded-lg bg-amber-light dark:bg-amber-500/15" />
                {step.label}
            </div>
            <div className="mb-3.5 text-[32px]">{step.icon}</div>
            <h3 className="mb-2 text-lg font-extrabold tracking-[-0.3px] text-appText">
                {step.title}
            </h3>
            <p className="text-sm leading-[1.65] text-appTextSec">{step.description}</p>
        </article>
    )
}

export default function ServiceProviderHowItWorks() {
    return (
        <section id="comment-ca-marche" className="bg-appSurface dark:bg-appBg px-[5%] py-[100px]">
            <div className="mb-[60px] text-center">
                <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full bg-amber-light dark:bg-amber-500/15 px-3.5 py-1.5 text-[11px] font-bold tracking-[1.2px] text-amber-500 uppercase">
                    ✦ Fonctionnement
                </div>
                <h2 className="mb-3.5 text-[clamp(28px,3.5vw,42px)] leading-[1.12] font-extrabold tracking-[-0.8px] text-appText">
                    Commencez à trouver des clients en 3 étapes
                </h2>
                <p className="mx-auto max-w-[520px] text-base leading-[1.65] text-appTextSec">
                    Simple, transparent et sans engagement. Vous contrôlez entièrement vos dépenses.
                </p>
            </div>

            <div className="mx-auto grid max-w-[960px] grid-cols-1 gap-6 lg:grid-cols-3">
                {STEPS.map((step) => (
                    <StepCard key={step.label} step={step} />
                ))}
            </div>
        </section>
    )
}
