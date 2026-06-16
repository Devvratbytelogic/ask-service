import type { ReactNode } from "react"

type Stat = {
    value: ReactNode
    description: ReactNode
}

const STATS: Stat[] = [
    {
        value: (
            <>
                1<span className="text-primaryColor">,</span>200
                <span className="text-primaryColor">+</span>
            </>
        ),
        description: (
            <>
                Professionnels actifs
                <br />
                sur la plateforme
            </>
        ),
    },
    {
        value: (
            <>
                8<span className="text-primaryColor">,</span>400
                <span className="text-primaryColor">+</span>
            </>
        ),
        description: (
            <>
                Demandes traitées
                <br />
                avec succès
            </>
        ),
    },
    {
        value: (
            <>
                4<span className="text-primaryColor">.</span>9
                <span className="text-primaryColor">/5</span>
            </>
        ),
        description: (
            <>
                Note de satisfaction
                <br />
                client moyenne
            </>
        ),
    },
    {
        value: (
            <>
                &lt;<span className="text-primaryColor">24</span>h
            </>
        ),
        description: (
            <>
                Délai moyen pour
                <br />
                recevoir un devis
            </>
        ),
    },
]

export default function StatsSection() {
    return (
        <section className="relative overflow-hidden bg-slate-900 px-[5%] py-20">
            <div
                aria-hidden
                className="pointer-events-none absolute -top-[100px] left-1/2 h-[400px] w-[800px] -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(27,79,255,0.2)_0%,transparent_70%)]"
            />

            <div className="relative z-1 grid grid-cols-2 gap-0.5 lg:grid-cols-4">
                {STATS.map((stat, index) => (
                    <div
                        key={index}
                        className="border-r border-white/7 px-8 py-10 text-center last:border-r-0"
                    >
                        <div className="mb-2 text-[48px] leading-none font-extrabold tracking-[-2px] text-white">
                            {stat.value}
                        </div>
                        <div className="text-sm leading-normal text-white/45">
                            {stat.description}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
