'use client'

import { useEffect, useRef, useState } from 'react'
import { FaStar } from 'react-icons/fa6'
import { FiCheckCircle } from 'react-icons/fi'
import { HiOutlineMapPin } from 'react-icons/hi2'
import moment from 'moment'
import { useGetMixedCategoryLeadsQuery } from '@/redux/rtkQueries/clientSideGetApis'
import type { IMixedCategoryLeadEntity } from '@/types/mixedCategoryLeads'
import { MailOutlineIconSVG, PhoneOutlineIconSVG, UserOutlineIconSVG } from '@/components/library/AllSVG'
import ImageComponent from '@/components/library/ImageComponent'

function LeadSlide({ lead }: { lead: IMixedCategoryLeadEntity }) {
    const cityLabel = [lead.city, lead.pincode].filter(Boolean).join(' · ') || lead.cityOrPostalCode || '—'
    const desiredDateRaw = lead.dynamic_answers?.find((a) => a.key === 'desired_date')?.value ?? lead.desiredDate
    const desiredDate = desiredDateRaw ? moment(desiredDateRaw).locale('fr').format('DD MMM YYYY') : null
    const clientName =
        [lead.contact_details?.first_name, lead.contact_details?.last_name].filter(Boolean).join(' ') || '—'
    const stars = lead.lead_stars ?? 0

    return (
        <div className="w-full shrink-0 px-4 py-4">
            <div className="mb-2.5 flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2.5">
                    <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg"
                        style={{ background: 'rgba(245,158,11,0.12)' }}
                    >
                        {lead.service_category?.image ? (
                            <ImageComponent
                                url={lead.service_category.image}
                                img_title={lead.service_category.title}
                                object_cover
                            />
                        ) : (
                            <span className="text-sm font-bold" style={{ color: 'var(--color-amber)' }}>
                                {lead.service_category?.title?.charAt(0) ?? '?'}
                            </span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-[13px] font-bold text-white">
                            {lead.service_category?.title}
                        </p>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                            Réf. {lead.reference_no}
                        </p>
                    </div>
                </div>

                {lead.lead_stars_label && (
                    <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide"
                        style={{
                            color: 'var(--color-amber)',
                            background: 'rgba(245,158,11,0.12)',
                            border: '1px solid rgba(245,158,11,0.25)',
                        }}
                    >
                        {lead.lead_stars_label}
                    </span>
                )}
            </div>

            {stars > 0 && (
                <div className="mb-2.5 flex gap-0.5" aria-label={`${stars} sur 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                            key={i}
                            className="size-3"
                            style={{ color: i < stars ? 'var(--color-amber)' : 'rgba(255,255,255,0.15)' }}
                            aria-hidden
                        />
                    ))}
                </div>
            )}

            <div className="mb-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-1 text-[12px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <HiOutlineMapPin className="size-3.5 shrink-0" aria-hidden />
                    {cityLabel}
                </span>
                {desiredDate && (
                    <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        {desiredDate}
                    </span>
                )}
            </div>

            <div
                className="rounded-xl px-3 py-2.5"
                style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                <div className="mb-2 flex items-center gap-1.5">
                    <span
                        className="flex size-4 shrink-0 items-center justify-center rounded-full"
                        style={{ background: 'rgba(16,185,129,0.22)', color: '#6EE7B7' }}
                    >
                        <FiCheckCircle className="size-2.5" aria-hidden />
                    </span>
                    <span className="text-[12px] font-bold text-white">Client vérifié</span>
                </div>

                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <span className="flex w-3.5 shrink-0 justify-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
                            <UserOutlineIconSVG size={13} />
                        </span>
                        <span className="truncate text-[12px] select-none" style={{ color: 'rgba(255,255,255,0.5)' }}>
                            {clientName}
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                        <div className="flex min-w-0 items-center gap-2">
                            <span className="flex w-3.5 shrink-0 justify-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
                                <PhoneOutlineIconSVG size={13} />
                            </span>
                            <span className="truncate text-[12px] select-none" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                {lead.contact_details?.phone ?? '—'}
                            </span>
                        </div>
                        <div className="flex min-w-0 items-center gap-2">
                            <span className="flex w-3.5 shrink-0 justify-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
                                <MailOutlineIconSVG size={13} />
                            </span>
                            <span className="truncate text-[12px] select-none" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                {lead.contact_details?.email ?? '—'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function LoginMixedCategoryLeads() {
    const { data, isLoading, isError } = useGetMixedCategoryLeadsQuery({ limit: 10 })
    const leads = data?.data?.items ?? []
    const [index, setIndex] = useState(0)
    const [height, setHeight] = useState<number>()
    const slidesRef = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        const slide = slidesRef.current[index]
        if (slide) setHeight(slide.offsetHeight)
    }, [index, leads])

    useEffect(() => {
        if (leads.length <= 1) return
        const timer = setInterval(() => {
            setIndex((i) => (i + 1) % leads.length)
        }, 4500)
        return () => clearInterval(timer)
    }, [leads.length, index])

    if (isLoading) {
        return <div className="mb-5 h-44 animate-pulse rounded-2xl bg-white/5" />
    }

    if (isError || !leads.length) return null

    return (
        <div className="mb-5">
            <p
                className="mb-2.5 text-[11px] font-bold uppercase tracking-[1.2px]"
                style={{ color: 'rgba(255,255,255,0.35)' }}
            >
                Leads disponibles
            </p>

            <div
                className="overflow-hidden rounded-2xl transition-[height] duration-300 ease-in-out"
                style={{
                    height,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(245,158,11,0.22)',
                }}
            >
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${index * 100}%)` }}
                >
                    {leads.map((lead, i) => (
                        <div
                            key={lead._id}
                            ref={(el) => { slidesRef.current[i] = el }}
                            className="w-full shrink-0"
                        >
                            <LeadSlide lead={lead} />
                        </div>
                    ))}
                </div>
            </div>

            {leads.length > 1 && (
                <div className="mt-2 flex justify-center gap-0.5">
                    {leads.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            aria-label={`Lead ${i + 1}`}
                            aria-current={i === index}
                            onClick={() => setIndex(i)}
                            className="flex h-4 w-4 cursor-pointer items-center justify-center"
                        >
                            <span
                                className="block rounded-full transition-all duration-300"
                                style={{
                                    height: 6,
                                    width: i === index ? 14 : 6,
                                    background: i === index ? 'rgba(245,158,11,0.85)' : 'rgba(255,255,255,0.2)',
                                }}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
