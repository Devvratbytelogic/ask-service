import { FaStar } from 'react-icons/fa6'
import { HiSparkles } from 'react-icons/hi2'

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
            "J'ai multiplié mon chiffre d'affaires par 2 en 6 mois. Les leads sont vraiment qualifiés et les clients sérieux. Je recommande à tous les indépendants.",
        name: "Nicolas M.",
        role: "Jardinier indépendant · Lyon · 56 missions",
        initial: "N",
        avatarColor: "#F59E0B",
    },
    {
        quote:
            "Le système de Points est parfait. On ne paie que pour les contacts qui nous intéressent vraiment. Notre équipe a gagné 3 nouveaux clients réguliers ce mois.",
        name: "Pascale T.",
        role: "Société de nettoyage · Paris · 23 missions",
        initial: "P",
        avatarColor: "#1B4FFF",
    },
    {
        quote:
            "Simple, rapide et efficace. Je consulte les nouvelles demandes chaque matin avant de partir en chantier. C'est devenu indispensable pour mon activité.",
        name: "Karim B.",
        role: "Agent de sécurité · Marseille · 41 missions",
        initial: "K",
        avatarColor: "#10B981",
    },
]

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
    return (
        <article className="rounded-[20px] border-[1.5px] border-appBorderSub bg-appCard p-7 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-[0_8px_24px_rgba(245,158,11,0.1)]">
            <div className="mb-3.5 flex gap-[3px] text-[15px] text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} className="size-[15px]" aria-hidden />
                ))}
            </div>
            <p className="mb-5 text-sm leading-[1.7] text-appTextSec dark:text-slate-300 italic">
                &ldquo;{testimonial.quote}&rdquo;
            </p>
            <div className="flex items-center gap-3">
                <div
                    className="flex size-[38px] shrink-0 items-center justify-center rounded-full text-base font-bold text-white"
                    style={{ backgroundColor: testimonial.avatarColor }}
                >
                    {testimonial.initial}
                </div>
                <div>
                    <div className="text-[13px] font-bold text-appText">
                        {testimonial.name}
                    </div>
                    <div className="mt-px text-[11px] text-appTextSec">
                        {testimonial.role}
                    </div>
                </div>
            </div>
        </article>
    )
}

export default function ServiceProviderTestimonials() {
    return (
        <section className="bg-appBg px-[5%] py-[100px]">
            <div className="mb-12 text-center">
                <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full bg-amber-light dark:bg-amber-500/15 px-3.5 py-1.5 text-[11px] font-bold tracking-[1.2px] text-amber-500 uppercase">
                    <HiSparkles className="size-3.5" aria-hidden />
                    Témoignages
                </div>
                <h2 className="mb-3.5 text-[clamp(28px,3.5vw,42px)] leading-[1.12] font-extrabold tracking-[-0.8px] text-appText">
                    Ils ont développé leur activité
                </h2>
                <p className="mx-auto max-w-[520px] text-base leading-[1.65] text-appTextSec">
                    Des professionnels qui utilisent Ask-Service au quotidien.
                </p>
            </div>

            <div className="mx-auto grid max-w-[960px] grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
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
