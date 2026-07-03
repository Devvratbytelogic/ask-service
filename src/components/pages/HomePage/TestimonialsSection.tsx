'use client'

import { useGetTestimonialsQuery } from '@/redux/rtkQueries/clientSideGetApis'
import type { IAllTestimonialsData } from '@/types/testimonial'

const AVATAR_COLORS = ['#1B4FFF', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899', '#06B6D4']

function TestimonialCard({ t, index }: { t: IAllTestimonialsData; index: number }) {
    const role = t.company_name ? `${t.designation} · ${t.company_name}` : t.designation
    const rating = t.rating ?? 5
    const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length]

    return (
        <article className="rounded-[20px] border-[1.5px] border-slate-100 dark:border-white/8 bg-slate-50 dark:bg-appCard p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-primaryColor hover:shadow-[0_8px_24px_rgba(27,79,255,0.1)]">
            <div className="mb-4 flex gap-[3px]">
                {Array.from({ length: rating }).map((_, index) => (
                    <span key={index} className="text-base text-amber-500">★</span>
                ))}
            </div>

            <p className="mb-5 text-[15px] leading-[1.7] text-slate-700 dark:text-slate-300 italic">
                &ldquo;{t.message}&rdquo;
            </p>

            <div className="flex items-center gap-3">
                <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                    style={{ backgroundColor: avatarColor }}
                >
                    {t.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{t.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{role}</div>
                </div>
            </div>
        </article>
    )
}

export default function TestimonialsSection() {
    const { data, isLoading } = useGetTestimonialsQuery()
    const testimonials = data?.data ?? []

    if (!isLoading && testimonials.length === 0) return null

    return (
        <section className="bg-white dark:bg-appBg px-[5%] py-[100px]">
            <div className="mb-[60px] text-center">
                <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full bg-blue-light dark:bg-primaryColor/15 px-3 py-1.5 text-xs font-bold tracking-[1px] text-primaryColor uppercase">
                    ✦ Témoignages
                </div>
                <h2 className="mb-4 text-[clamp(28px,3vw,42px)] leading-[1.15] font-extrabold tracking-[-0.8px] text-slate-900 dark:text-slate-100">
                    Ce qu&apos;ils en disent
                </h2>
                <p className="mx-auto max-w-[560px] text-[17px] leading-[1.65] text-slate-500 dark:text-slate-400">
                    Des clients et des professionnels satisfaits de la plateforme au quotidien.
                </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {isLoading
                    ? [1, 2, 3].map((i) => (
                          <div key={i} className="h-52 animate-pulse rounded-[20px] bg-slate-100 dark:bg-white/5" />
                      ))
                    : testimonials.map((t, index) => <TestimonialCard key={t._id} t={t} index={index} />)}
            </div>
        </section>
    )
}
