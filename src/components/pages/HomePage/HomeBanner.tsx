"use client"
import ImageComponent from "@/components/library/ImageComponent"
import { Autocomplete, AutocompleteItem, Button, Select, SelectItem } from "@heroui/react"
import { useMemo, useState } from "react"
import { BiSearch } from "react-icons/bi"
import { FiArrowRight } from "react-icons/fi"
import { FaLocationDot } from "react-icons/fa6"
import { useDispatch } from "react-redux"
import { openModal } from "@/redux/slices/allModalSlice"
import { SERVICE_LIST } from "@/utils/serviceList"
import { useGetServiceCategoriesQuery } from "@/redux/rtkQueries/clientSideGetApis"
import francePostalCodes from "@/data/france-postal-codes.json"

type PostalEntry = { code: string; name: string }

const getPostalKey = (item: PostalEntry) => `${item.code}|${item.name}`

const HomeBanner = () => {
    const defaultKey = useMemo(() => {
        const first = (francePostalCodes as PostalEntry[]).find((p) => p.code === "75001")
        return first ? getPostalKey(first) : null
    }, [])
    const [selectedPostalKey, setSelectedPostalKey] = useState<string | null>(defaultKey)
    const selectedPinCode = selectedPostalKey ? selectedPostalKey.split("|")[0] : ""
    const { data } = useGetServiceCategoriesQuery();
    const grandParentServicesList = data?.data ?? [];
    const [selectedServiceKey, setSelectedServiceKey] = useState<string | null>(null);

    const dispatch = useDispatch()

    const selectedService = selectedServiceKey
        ? grandParentServicesList.find((c) => c._id === selectedServiceKey)
        : null;

    const hasService = !!selectedServiceKey?.toString().trim()
    const hasPincode = !!selectedPinCode?.toString().trim()
    const canStartRequest = hasService && hasPincode

    const startServiceRegisterationRequest = () => {
        if (!canStartRequest) return
        dispatch(openModal({
            componentName: 'RequestServiceFlowIndex',
            data: {
                pincode: selectedPinCode,
                grandParentServiceId: selectedService?._id ?? '',
                grandParentServiceName: selectedService?.title ?? '',
                child_services: selectedService?.child_categories ?? [],
            },
            modalSize: 'lg'
        }))
    }

    return (
       <>
            <div className="mx-auto w-11/12 flex flex-col items-center gap-8 relative home-banner-bg py-10">
                <div className="flex justify-center items-center flex-col text-fontBlack text-[30px] md:text-[35px]/[44px] xl:text-[54px]/[74px] font-bold tracking-[-2px]">
                    <div className="flex items-center gap-4 flex-wrap justify-center">
                        <h2 className="text-center">
                            Trouvez rapidement des professionnels de confiance pour tous vos besoins
                        </h2>
                        {/* <span></span> */}
                        <span className="relative border border-dashed border-borderColor rounded-lg flex items-center px-4 py-1 gap-2 min-h-9 bg-white/80">
                            {/* Corner circular icons */}
                            <span className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full border border-borderColor bg-customWhite" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-borderColor bg-customWhite" />
                            <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 rounded-full border border-borderColor bg-customWhite" />
                            <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border border-borderColor bg-customWhite" />
                            <span className="h-7 w-7 shrink-0 flex items-center justify-center overflow-hidden">
                                <ImageComponent url="/images/home/logo_light_black.png" img_title="logo_light_black" object_contain />
                            </span>
                            <span className="text-lightBlack font-semibold">
                                Rapide et simple
                            </span>
                        </span>
                    </div>
                </div>
                <p className="text-center text-lightBlack text-lg xl:text-xl w-11/12 md:w-1/2 2xl:w-[40vw] 2xl:max-w-[40svw]">
                    Indiquez votre besoin et recevez rapidement des devis de professionnels vérifiés dans votre région. Sans appels indésirables. Sans spam. Juste les bons experts.
                </p>
                <div id="banner-search" className="flex gap-2 flex-wrap justify-center">
                    <div className="w-[90vw] md:w-[30vw] max-w-full mx-auto">
                        <Select
                            variant="bordered"
                            placeholder="Quel service recherchez-vous?"
                            selectedKeys={selectedServiceKey ? [selectedServiceKey] : []}
                            onSelectionChange={(keys) => {
                                const key = Array.from(keys as Set<string>)[0];
                                setSelectedServiceKey(key ?? null);
                            }}
                            classNames={{
                                trigger: "custom_input_large_design btn_radius h-[60px]! min-h-[60px]!",
                            }}
                            listboxProps={{
                                emptyContent: "Aucun élément.",
                            }}
                        >
                            {grandParentServicesList.map((item) => (
                                <SelectItem key={item._id} textValue={item.title}>
                                    {item.title}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                    <span className="w-[50vw] md:w-auto max-w-full min-w-0">
                        <Autocomplete
                            placeholder="Code postal"
                            selectedKey={selectedPostalKey}
                            onSelectionChange={(key) => setSelectedPostalKey(key as string | null)}
                            defaultItems={francePostalCodes as PostalEntry[]}
                            variant="bordered"
                            isVirtualized
                            itemHeight={40}
                            maxListboxHeight={280}
                            classNames={{
                                base: "w-full",
                                listboxWrapper: "max-h-[280px]",
                            }}
                            inputProps={{
                                classNames: {
                                    inputWrapper: [
                                        "btn_radius h-[60px]! min-h-[60px]!",
                                        "bg-transparent",
                                        "border-borderDark border-1",
                                        "data-[hover=true]:bg-transparent",
                                        "group-data-[focus=true]:bg-transparent",
                                    ],
                                    input: "text-fontBlack text-base",
                                },
                            }}
                            startContent={<FaLocationDot className="text-xl text-primaryColor shrink-0" />}
                            listboxProps={{
                                emptyContent: "Aucun code postal trouvé.",
                            }}
                        >
                            {(item) => (
                                <AutocompleteItem key={getPostalKey(item)} textValue={`${item.code} - ${item.name}`}>
                                    {item.code} - {item.name}
                                </AutocompleteItem>
                            )}
                        </Autocomplete>
                    </span>
                    <Button className="size-15 min-w-14 min-h-14 p-0! rounded-full! bg-primaryColor flex items-center justify-center text-white shrink-0" isDisabled={!canStartRequest} onPress={() => startServiceRegisterationRequest()}>
                        <BiSearch className="text-xl" />
                    </Button>
                </div>
                {/* <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
                    {grandParentServicesList && grandParentServicesList.length > 0 && grandParentServicesList?.map((curr) =>
                        <Button
                            endContent={<FiArrowRight className="text-base xl:text-lg" />}
                            className="btn_radius bg-[#F2F2F21A] border border-borderColor text-darkSilver text-xs md:text-base xl:text-lg py-0! xl:py-6! px-3 md:px-4"
                            key={curr._id}
                            onPress={() => {
                                dispatch(openModal({
                                    componentName: "RequestServiceFlowIndex",
                                    data: {
                                        pincode: selectedPinCode,
                                        grandParentServiceId: curr._id ?? "",
                                        grandParentServiceName: curr.title ?? "",
                                        child_services: curr.child_categories ?? [],
                                    },
                                    modalSize: "lg",
                                }));
                            }}
                        >
                            {curr.title}
                        </Button>
                    )}
                </div> */}
            </div>
       </>
    )
}

export default HomeBanner