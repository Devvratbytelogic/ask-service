"use client"

import ImageComponent from "@/components/library/ImageComponent"
import { RootState } from "@/redux/appStore"
import { closeModal, openModal } from "@/redux/slices/allModalSlice"
import { Button, Checkbox } from "@heroui/react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { HiOutlineExternalLink } from "react-icons/hi"

const SERVICES = [
    {
        id: "security",
        title: "Security services",
        subtitle: "Security services",
        icon: "/images/home/Security.png",
    },
    {
        id: "gardening",
        title: "Gardening",
        subtitle: "Garden maintenance",
        icon: "/images/home/Gardening.png",
    },
    {
        id: "house-cleaning",
        title: "House cleaning",
        subtitle: "Cleaning services",
        icon: "/images/home/house_cleaning.png",
    },
] as const

type ServiceId = (typeof SERVICES)[number]["id"]

const VendorServiceListPage = () => {
    const dispatch = useDispatch()
    const { data } = useSelector((state: RootState) => state.allCommonModal)
    const [selectedIds, setSelectedIds] = useState<Set<ServiceId>>(new Set())

    const toggleService = (id: ServiceId) => {
        setSelectedIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const handleContinue = () => {
        // TODO: save selected services via API (e.g. with data?.userData), then next step
        const selected = SERVICES.filter((s) => selectedIds.has(s.id))
        console.log("Selected services", selected, data)

        dispatch(
            openModal({
            componentName: "VendorDocumentVerification",
            data: null,
            modalSize: "full",
        }))
    }

    return (
        <>
            <div className="space-y-10 w-11/12">
                <div className="space-y-3 xl:space-y-6">
                    <h1 className="header_text">
                        Tell us more about <span className="text-darkSilver">you</span>
                    </h1>
                    <p className="text-fontBlack text-base">
                        What services can you help with?
                    </p>
                </div>

                <ul className="space-y-4 list-none p-0 m-0">
                    {SERVICES.map((service) => {
                        const isSelected = selectedIds.has(service.id)
                        return (
                            <li key={service.id}>
                                <label
                                    className={`
                                        flex items-center justify-between gap-4 w-full p-4 rounded-2xl border cursor-pointer
                                        transition-colors custom_border_1px
                                    `}
                                >
                                    <div className="flex flex-col gap-5">
                                        <span className="size-11 shrink-0 flex items-center justify-center overflow-hidden rounded-xl bg-white p-1">
                                            <ImageComponent
                                                url={service.icon}
                                                img_title={service.title}
                                                object_contain
                                            />
                                        </span>
                                        <span className="flex-1 min-w-0">
                                            <span className="block font-semibold text-fontBlack text-base">
                                                {service.title}
                                            </span>
                                            <span className="flex items-center gap-1 text-darkSilver text-sm mt-0.5">
                                                {service.subtitle}
                                                <HiOutlineExternalLink className="size-3.5 shrink-0" aria-hidden />
                                            </span>
                                        </span>
                                    </div>
                                    <Checkbox
                                        isSelected={isSelected}
                                        onValueChange={() => toggleService(service.id)}
                                        onPointerDown={(e) => e.preventDefault()}
                                        classNames={{
                                            wrapper: "shrink-0 before:border-borderDark",
                                        }}
                                        aria-label={`Select ${service.title}`}
                                    />
                                </label>
                            </li>
                        )
                    })}
                </ul>
            </div>

            <div className="space-y-[25px] w-11/12">
                <Button
                    type="button"
                    className="btn_bg_blue btn_radius btn_padding font-medium text-sm w-full"
                    onPress={handleContinue}
                >
                    Continue
                </Button>
            </div>
        </>
    )
}

export default VendorServiceListPage
