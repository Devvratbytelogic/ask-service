'use client'

import { useEffect, useRef, useState } from 'react'
import { FaStar } from 'react-icons/fa6'
import { useGetTestimonialsQuery } from '@/redux/rtkQueries/clientSideGetApis'

const AVATAR_COLORS = ['#1B4FFF', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899', '#06B6D4']

export default function LoginTestimonialSlider() {
    const { data, isLoading } = useGetTestimonialsQuery()
    const testimonials = data?.data ?? []
    const [index, setIndex] = useState(0)
    const [height, setHeight] = useState<number>()
    const slidesRef = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        const slide = slidesRef.current[index]
        if (slide) setHeight(slide.offsetHeight)
    }, [index, testimonials])

    useEffect(() => {
        if (testimonials.length <= 1) return
        const timer = setInterval(() => {
            setIndex((i) => (i + 1) % testimonials.length)
        }, 4000)
        return () => clearInterval(timer)
    }, [testimonials.length, index])

    if (isLoading) {
        return <div className="mb-5 h-36 animate-pulse rounded-2xl bg-white/5" />
    }

    if (!testimonials.length) return null

    return (
        <div className="mb-5">
            <div
                className="overflow-hidden rounded-2xl transition-[height] duration-300 ease-in-out"
                style={{
                    height,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${index * 100}%)` }}
                >
                    {testimonials.map((t, i) => {
                        const role = t.company_name ? `${t.designation} · ${t.company_name}` : t.designation
                        const rating = t.rating ?? 5

                        return (
                            <div
                                key={t._id}
                                ref={(el) => { slidesRef.current[i] = el }}
                                className="w-full shrink-0 p-5"
                            >
                                <div className="mb-2.5 flex gap-0.5">
                                    {Array.from({ length: rating }).map((_, star) => (
                                        <FaStar key={star} className="size-3.5" style={{ color: 'var(--color-amber)' }} aria-hidden />
                                    ))}
                                </div>

                                <p
                                    className="mb-3.5"
                                    style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, fontStyle: 'italic' }}
                                >
                                    &ldquo;{t.message}&rdquo;
                                </p>

                                <div className="flex items-center gap-2.5">
                                    <div
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
                                        style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                                    >
                                        {t.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold text-white">{t.name}</p>
                                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>{role}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {testimonials.length > 1 && (
                <div className="mt-2 flex justify-center gap-0.5">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            aria-label={`Témoignage ${i + 1}`}
                            aria-current={i === index}
                            onClick={() => setIndex(i)}
                            className="flex h-4 w-4 cursor-pointer items-center justify-center"
                        >
                            <span
                                className="block rounded-full transition-all duration-300"
                                style={{
                                    height: 6,
                                    width: i === index ? 14 : 6,
                                    background: i === index ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)',
                                }}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
