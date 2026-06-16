type Testimonial = {
    quote: string
    name: string
    role: string
    initial: string
    avatarColor: string
}

const TESTIMONIALS: Testimonial[] = [
    {
        quote:
            "J'ai trouvé une entreprise de nettoyage sérieuse en moins d'une heure. 3 devis reçus dans la journée, c'est exactement ce dont j'avais besoin pour mon bureau.",
        name: "Marie L.",
        role: "Directrice RH · Paris",
        initial: "M",
        avatarColor: "#1B4FFF",
    },
    {
        quote:
            "Ask-Service m'a permis de trouver des missions régulières en jardinage près de chez moi. Simple, efficace, et les clients sont sérieux. Je recommande à tous les indépendants.",
        name: "Nicolas M.",
        role: "Jardinier indépendant · Lyon",
        initial: "N",
        avatarColor: "#F59E0B",
    },
    {
        quote:
            "Le système de crédits est parfait pour nous. On paie uniquement pour les contacts qui nous intéressent vraiment. Notre CA a augmenté de 40% depuis qu'on utilise la plateforme.",
        name: "Pascale T.",
        role: "Dirigeante · Société de nettoyage",
        initial: "P",
        avatarColor: "#10B981",
    },
]

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
    return (
        <article className="rounded-[20px] border-[1.5px] border-slate-100 bg-slate-50 p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-primaryColor hover:shadow-[0_8px_24px_rgba(27,79,255,0.1)]">
            <div className="mb-4 flex gap-[3px]">
                {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index} className="text-base text-amber-500">
                        ★
                    </span>
                ))}
            </div>

            <p className="mb-5 text-[15px] leading-[1.7] text-slate-700 italic">
                &ldquo;{testimonial.quote}&rdquo;
            </p>

            <div className="flex items-center gap-3">
                <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                    style={{ backgroundColor: testimonial.avatarColor }}
                >
                    {testimonial.initial}
                </div>
                <div>
                    <div className="text-sm font-bold text-slate-900">
                        {testimonial.name}
                    </div>
                    <div className="text-xs text-slate-500">
                        {testimonial.role}
                    </div>
                </div>
            </div>
        </article>
    )
}

export default function TestimonialsSection() {
    return (
        <section className="bg-white px-[5%] py-[100px]">
            <div className="mb-[60px] text-center">
                <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full bg-blue-light px-3 py-1.5 text-xs font-bold tracking-[1px] text-primaryColor uppercase">
                    ✦ Témoignages
                </div>
                <h2 className="mb-4 text-[clamp(28px,3vw,42px)] leading-[1.15] font-extrabold tracking-[-0.8px] text-slate-900">
                    Ce qu&apos;ils en disent
                </h2>
                <p className="mx-auto max-w-[560px] text-[17px] leading-[1.65] text-slate-500">
                    Des clients et des professionnels satisfaits de la plateforme au quotidien.
                </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {TESTIMONIALS.map((testimonial) => (
                    <TestimonialCard
                        key={testimonial.name}
                        testimonial={testimonial}
                    />
                ))}
            </div>
        </section>
    )
}
