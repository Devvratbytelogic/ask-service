"use client"

import ImageComponent from "@/components/library/ImageComponent"
import { openModal } from "@/redux/slices/allModalSlice"
import { useGetServiceCategoriesQuery } from "@/redux/rtkQueries/clientSideGetApis"
import type { IAllServiceCategoriesDataEntity } from "@/types/services"
import { useDispatch } from "react-redux"

function ServiceCarouselCard({
    service,
    duplicate = false,
    onClick,
}: {
    service: IAllServiceCategoriesDataEntity
    duplicate?: boolean
    onClick: () => void
}) {
    return (
        <button
            type="button"
            aria-hidden={duplicate || undefined}
            tabIndex={duplicate ? -1 : 0}
            onClick={onClick}
            className="group flex shrink-0 cursor-pointer items-center gap-2.5 rounded-xl border-[1.5px] border-appBorderSub bg-appCard px-[18px] py-[11px] whitespace-nowrap text-appText transition-all duration-200 hover:-translate-y-0.5 hover:border-primaryColor/25 hover:bg-blue-light dark:hover:bg-primaryColor/10 hover:text-primaryColor hover:shadow-[0_4px_12px_rgba(27,79,255,0.1)]"
        >
            <span className="border-1 border-appBorderSub size-10 shrink-0 overflow-hidden rounded-full">
                <ImageComponent url={service.image} img_title={service.title} object_contain />
            </span>
            <span className="text-left">
                <span className="block text-sm font-semibold">{service.title}</span>
                {service.description && (
                    <span className="block max-w-[180px] truncate text-[11px] text-appTextMuted group-hover:text-primaryColor/70">
                        {service.description}
                    </span>
                )}
            </span>
        </button>
    )
}

const MIN_SCROLL_ITEMS = 4

export default function ServicesCarouselSection() {
    const dispatch = useDispatch()
    const { data } = useGetServiceCategoriesQuery()
    const services = data?.data ?? []

    const shouldScroll = services.length >= MIN_SCROLL_ITEMS
    const carouselItems = shouldScroll
        ? [...services, ...services]
        : services

    const openRequestFlow = (service: IAllServiceCategoriesDataEntity) => {
        dispatch(openModal({
            componentName: "RequestServiceFlowIndex",
            data: {
                grandParentServiceId: service._id ?? "",
                grandParentServiceName: service.title ?? "",
                child_services: service.child_categories ?? [],
            },
            modalSize: "lg",
        }))
    }

    return (
        <section className="overflow-hidden border-y border-appBorderSub dark:border-white/6 bg-appCard dark:bg-appSurface py-8">
            <p className="mb-[18px] text-center text-[11px] font-bold tracking-[1.5px] text-slate-300 dark:text-appTextSec uppercase">
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
                            ? "flex w-max animate-services-scroll gap-2.5 px-2.5 py-1 hover:[animation-play-state:paused]"
                            : "flex flex-wrap justify-center gap-2.5 px-2.5 py-1"
                    }
                >
                    {carouselItems.map((service, index) => (
                        <ServiceCarouselCard
                            key={`${service._id}-${index}`}
                            service={service}
                            duplicate={shouldScroll && index >= services.length}
                            onClick={() => openRequestFlow(service)}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
