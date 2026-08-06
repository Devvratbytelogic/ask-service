"use client"

import ImageComponent from "@/components/library/ImageComponent"
import { useGetServiceCategoriesQuery } from "@/redux/rtkQueries/clientSideGetApis"
import { getRequestAServiceRoutePath } from "@/routes/routes"
import type { IAllServiceCategoriesChildCategoriesEntity } from "@/types/services"
import Link from "next/link"
import { useMemo } from "react"

function ServiceCarouselCard({
    service,
    duplicate = false,
}: {
    service: IAllServiceCategoriesChildCategoriesEntity
    duplicate?: boolean
}) {
    return (
        <Link
            href={getRequestAServiceRoutePath(service._id)}
            aria-hidden={duplicate || undefined}
            tabIndex={duplicate ? -1 : 0}
            className="group flex shrink-0 cursor-pointer items-center gap-2.5 rounded-xl border-[1.5px] border-appBorderSub bg-appCard px-4.5 py-2.75 whitespace-nowrap text-appText transition-all duration-200 hover:-translate-y-0.5 hover:border-primaryColor/25 hover:bg-blue-light dark:hover:bg-primaryColor/10 hover:text-primaryColor hover:shadow-[0_4px_12px_rgba(27,79,255,0.1)]"
        >
            <span className="border-1 border-appBorderSub size-10 p-1 shrink-0 overflow-hidden rounded-full">
                <ImageComponent url={service.image} img_title={service.title} object_contain />
            </span>
            <span className="text-left">
                <span className="block text-sm font-semibold">{service.title}</span>
                {service.description && (
                    <span className="block max-w-45 truncate text-[11px] text-appTextMuted group-hover:text-primaryColor/70">
                        {service.description}
                    </span>
                )}
            </span>
        </Link>
    )
}

const MIN_ITEMS_PER_HALF = 8

export default function ServicesCarouselSection() {
    const { data } = useGetServiceCategoriesQuery()
    const services = useMemo(
        () => (data?.data ?? []).flatMap((category) => category.child_categories ?? []),
        [data?.data],
    )

    const carouselItems = useMemo(() => {
        if (services.length === 0) return []

        const repeats = Math.max(1, Math.ceil(MIN_ITEMS_PER_HALF / services.length))
        const half = Array.from({ length: repeats }, () => services).flat()

        return [...half, ...half]
    }, [services])

    const shouldScroll = carouselItems.length > 0
    const halfLength = carouselItems.length / 2

    return (
        <section className="overflow-hidden border-y border-appBorderSub dark:border-white/6 bg-appCard dark:bg-appSurface py-8">
            <p className="mb-4.5 text-center text-[11px] font-bold tracking-[1.5px] text-slate-300 dark:text-appTextSec uppercase">
                Nos domaines d&apos;intervention
            </p>

            <div className={shouldScroll ? "relative overflow-hidden" : undefined}>
                {shouldScroll && (
                    <>
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-y-0 left-0 z-2 w-20 bg-linear-to-r from-white dark:from-appSurface to-transparent"
                        />
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-y-0 right-0 z-2 w-20 bg-linear-to-l from-white dark:from-appSurface to-transparent"
                        />
                    </>
                )}

                <div
                    className={
                        shouldScroll
                            ? "flex w-max animate-services-scroll gap-2.5 px-2.5 py-1 motion-reduce:animate-none hover:[animation-play-state:paused]"
                            : undefined
                    }
                >
                    {carouselItems.map((service, index) => (
                        <ServiceCarouselCard
                            key={`${service._id}-${index}`}
                            service={service}
                            duplicate={index >= halfLength}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
