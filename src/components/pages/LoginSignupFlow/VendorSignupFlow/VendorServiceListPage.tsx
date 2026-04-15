"use client"

import ImageComponent from "@/components/library/ImageComponent"
import { useGetAllServicesQuery } from "@/redux/rtkQueries/clientSideGetApis"
import { RootState } from "@/redux/appStore"
import { openModal } from "@/redux/slices/allModalSlice"
import { Button, Checkbox } from "@heroui/react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { HiOutlineExternalLink } from "react-icons/hi"
import { useUpdateVendorServicesMutation } from "@/redux/rtkQueries/allPostApi"

const VendorServiceListPage = () => {
    const dispatch = useDispatch()
    const { data: modalData } = useSelector((state: RootState) => state.allCommonModal)
    const { data: servicesResponse, isLoading, isError } = useGetAllServicesQuery()
    const services = servicesResponse?.data ?? []
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [updateVendorServices, { isLoading: isUpdatingServices }] = useUpdateVendorServicesMutation()

    const selectService = (id: string) => {
        setSelectedId((prev) => (prev === id ? null : id))
    }
    const handleContinue = async () => {
        const singleSelectedId = selectedId
        if (!singleSelectedId) return

        try {
            await updateVendorServices({ service: singleSelectedId }).unwrap()
            dispatch(
                openModal({
                    componentName: "VendorDocumentVerification",
                    data: null,
                    modalSize: "full",
                }),
            )
        } catch (err) {
            console.error("Failed to update vendor services", err)
        }
    }

    return (
        <>
            <div className="space-y-10 w-full">
                <div className="space-y-3 xl:space-y-6">
                    <h1 className="header_text">
                        Parlez-nous de <span className="text-darkSilver">vous</span>
                    </h1>
                    <p className="text-fontBlack text-base">
                        Quels services souhaitez-vous proposer ?
                    </p>
                </div>

                {isLoading && (
                    <p className="text-darkSilver text-sm">Loading services...</p>
                )}
                {isError && (
                    <p className="text-red-500 text-sm">Failed to load services. Please try again.</p>
                )}
                <ul className="space-y-4 list-none p-0 m-0">
                    {services && services?.length > 0 && services?.map((service) => {
                        const isSelected = selectedId === service._id
                        return (
                            <li key={service._id}>
                                <label
                                    className={`
                                        flex items-center justify-between gap-4 w-full p-4 rounded-2xl border cursor-pointer
                                        transition-colors custom_border_1px
                                    `}
                                >
                                    <div className="flex flex-col gap-5">
                                        <span className="size-11 shrink-0 flex items-center justify-center overflow-hidden rounded-xl bg-customWhite p-1">
                                            <ImageComponent
                                                url={service.image}
                                                img_title={service.title}
                                                object_contain
                                            />
                                        </span>
                                        <span className="flex-1 min-w-0">
                                            <span className="block font-semibold text-fontBlack text-base">
                                                {service.title}
                                            </span>
                                            <span className="flex items-center gap-1 text-darkSilver text-sm mt-0.5">
                                                {service.description}
                                                <HiOutlineExternalLink className="size-3.5 shrink-0" aria-hidden />
                                            </span>
                                        </span>
                                    </div>
                                    <Checkbox
                                        isSelected={isSelected}
                                        onValueChange={() => selectService(service._id)}
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

            <div className="space-y-2 w-full">
                <Button
                    type="button"
                    className="btn_bg_blue btn_radius btn_padding font-medium text-sm w-full"
                    onPress={handleContinue}
                    isLoading={isUpdatingServices}
                    isDisabled={!selectedId || isUpdatingServices}
                >
                    Continuer
                </Button>
            </div>
        </>
    )
}

export default VendorServiceListPage
