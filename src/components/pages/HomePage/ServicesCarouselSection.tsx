"use client"

import { openModal } from "@/redux/slices/allModalSlice"
import { useGetServiceCategoriesQuery } from "@/redux/rtkQueries/clientSideGetApis"
import type { IAllServiceCategoriesDataEntity } from "@/types/services"
import { useDispatch } from "react-redux"

type ServiceItem = {
    slug: string
    emoji: string
    name: string
    count: string
}

const SERVICE_ITEMS: ServiceItem[] = [
    { slug: "nettoyage", emoji: "🧹", name: "Nettoyage", count: "486 pros" },
    { slug: "securite", emoji: "🔒", name: "Sécurité", count: "312 pros" },
    { slug: "jardinage", emoji: "🌿", name: "Jardinage", count: "241 pros" },
    { slug: "demenagement", emoji: "📦", name: "Déménagement", count: "178 pros" },
    { slug: "plomberie", emoji: "🔧", name: "Plomberie", count: "203 pros" },
    { slug: "electricite", emoji: "⚡", name: "Électricité", count: "156 pros" },
    { slug: "peinture", emoji: "🎨", name: "Peinture", count: "134 pros" },
    { slug: "informatique", emoji: "💻", name: "Informatique", count: "97 pros" },
    { slug: "menuiserie", emoji: "🪵", name: "Menuiserie", count: "88 pros" },
    { slug: "climatisation", emoji: "❄️", name: "Climatisation", count: "72 pros" },
]

const normalizeTitle = (value: string) =>
    value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

const findMatchingService = (
    services: IAllServiceCategoriesDataEntity[],
    item: ServiceItem,
) =>
    services.find((service) => {
        const title = normalizeTitle(service.title)
        const slug = normalizeTitle(item.slug)
        const name = normalizeTitle(item.name)

        return title.includes(slug) || title.includes(name) || name.includes(title)
    })

function ServiceCarouselCard({
    item,
    duplicate = false,
    onClick,
}: {
    item: ServiceItem
    duplicate?: boolean
    onClick: () => void
}) {
    return (
        <button
            type="button"
            aria-hidden={duplicate || undefined}
            tabIndex={duplicate ? -1 : 0}
            onClick={onClick}
            className="group flex shrink-0 cursor-pointer items-center gap-2.5 rounded-xl border-[1.5px] border-slate-100 dark:border-white/8 bg-slate-50 dark:bg-appCard px-[18px] py-[11px] whitespace-nowrap text-slate-700 dark:text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-primaryColor/25 hover:bg-blue-light dark:hover:bg-primaryColor/10 hover:text-primaryColor hover:shadow-[0_4px_12px_rgba(27,79,255,0.1)]"
        >
            <span className="text-xl">{item.emoji}</span>
            <span className="text-left">
                <span className="block text-sm font-semibold">{item.name}</span>
                <span className="block text-[11px] text-slate-400 dark:text-slate-500 group-hover:text-primaryColor/70">
                    {item.count}
                </span>
            </span>
        </button>
    )
}

const MIN_SCROLL_ITEMS = 5

export default function ServicesCarouselSection() {
    const dispatch = useDispatch()
    const { data } = useGetServiceCategoriesQuery()
    const services = data?.data ?? []

    const shouldScroll = SERVICE_ITEMS.length >= MIN_SCROLL_ITEMS
    const carouselItems = shouldScroll
        ? [...SERVICE_ITEMS, ...SERVICE_ITEMS]
        : SERVICE_ITEMS

    const openRequestFlow = (item: ServiceItem) => {
        const matchedService = findMatchingService(services, item)

        dispatch(openModal({
            componentName: "RequestServiceFlowIndex",
            data: matchedService
                ? {
                    grandParentServiceId: matchedService._id ?? "",
                    grandParentServiceName: matchedService.title ?? "",
                    child_services: matchedService.child_categories ?? [],
                }
                : {},
            modalSize: "lg",
        }))
    }

    return (
        <section className="overflow-hidden border-y border-slate-100 dark:border-white/6 bg-white dark:bg-appSurface py-8">
            <p className="mb-[18px] text-center text-[11px] font-bold tracking-[1.5px] text-slate-300 dark:text-slate-600 uppercase">
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
                    {carouselItems.map((item, index) => (
                        <ServiceCarouselCard
                            key={`${item.slug}-${index}`}
                            item={item}
                            duplicate={shouldScroll && index >= SERVICE_ITEMS.length}
                            onClick={() => openRequestFlow(item)}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
