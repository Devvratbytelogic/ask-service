"use client"
import ImageComponent from "@/components/library/ImageComponent"
import { Autocomplete, AutocompleteItem, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@heroui/react"
import { useMemo, useState } from "react"
import { BiSearch } from "react-icons/bi"
import { FiArrowRight } from "react-icons/fi"
import { FaLocationDot } from "react-icons/fa6"
import { MdKeyboardArrowDown } from "react-icons/md"
import { useDispatch } from "react-redux"
import { openModal } from "@/redux/slices/allModalSlice"
import { SERVICE_LIST } from "@/utils/serviceList"
import { useGetServiceCategoriesQuery } from "@/redux/rtkQueries/clientSideGetApis"

const PIN_CODES = ["10001", "10002", "10003", "10004", "10005"]

const HomeBanner = () => {

    const [selectedPinCode, setSelectedPinCode] = useState("10001")
    const { data } = useGetServiceCategoriesQuery();
    const grandParentServicesList = data?.data ?? [];
    const [searchValue, setSearchValue] = useState("");
    const [selectedServiceKey, setSelectedServiceKey] = useState<string | null>(null);

    const filteredServicesList = useMemo(() => {
        if (!searchValue.trim()) return grandParentServicesList;
        const query = searchValue.toLowerCase().trim();
        return grandParentServicesList.filter((item) =>
            item.title.toLowerCase().includes(query)
        );
    }, [grandParentServicesList, searchValue]);

    const dispatch = useDispatch()

    const selectedService = selectedServiceKey
        ? grandParentServicesList.find((c) => c._id === selectedServiceKey)
        : null;

    const startServiceRegisterationRequest = () => {
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
        <div className=" mx-auto w-11/12 flex flex-col justify-center items-center h-auto xl:h-[70vh] xl:min-h-[70svh] 2xl:h-[75vh] 2xl:min-h-[75svh] gap-8 relative home-banner-bg pt-30 md:pt-40">
            <div className="flex justify-center items-center flex-col text-fontBlack text-[30px] md:text-[35px]/[44px] xl:text-[54px]/[74px] font-bold tracking-[-2px]">
                <h2 className="text-center">
                    Find Trusted Professionals for
                </h2>
                <div className="flex items-center gap-4 flex-wrap justify-center">
                    <span>any service</span>
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
                            super fast
                        </span>
                    </span>
                </div>
            </div>
            <p className="text-center text-lightBlack text-lg xl:text-xl w-11/12 md:w-1/2 2xl:w-[40vw] 2xl:max-w-[40svw]">
                Tell us what you need and receive quotes from verified professionals in your area. No calls. No spam. Just the right help.
            </p>
            <div className="flex gap-2 flex-wrap justify-center">
                <div className="w-[90vw] md:w-[30vw] max-w-full mx-auto">
                    <Autocomplete
                        variant="bordered"
                        placeholder="What service do you need?"
                        allowsCustomValue
                        items={filteredServicesList}
                        inputValue={searchValue}
                        onInputChange={setSearchValue}
                        selectedKey={selectedServiceKey}
                        onSelectionChange={(key) => {
                            const keyStr = key != null ? String(key) : null;
                            setSelectedServiceKey(keyStr);
                            const item = keyStr ? grandParentServicesList.find((c) => c._id === keyStr) : null;
                            setSearchValue(item?.title ?? '');
                        }}
                        classNames={{
                            base: "w-full",
                            listboxWrapper: "max-h-[200px]",
                        }}
                        listboxProps={{
                            emptyContent: searchValue.trim() ? "No data found" : "No items.",
                        }}
                        inputProps={{
                            classNames: {
                                inputWrapper: ['custom_input_large_design btn_radius h-[60px]!'],
                            },
                        }}
                    >
                        {(item) => (
                            <AutocompleteItem key={item._id} textValue={item.title}>
                                {item.title}
                            </AutocompleteItem>
                        )}
                    </Autocomplete>
                </div>
                <span className="w-[50vw] md:w-auto max-w-full">
                    <Dropdown>
                        <DropdownTrigger>
                            <Button
                                className="btn_radius text-placeHolderText capitalize text-base bg-white! border-1 border-borderDark h-15! w-full"
                                endContent={<MdKeyboardArrowDown className="text-xl text-fontBlack ml-10" />}
                                startContent={<FaLocationDot className="text-xl text-primaryColor " />}
                            >
                                {selectedPinCode}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Select city"
                            items={[...PIN_CODES.map((code) => ({ key: code, label: code }))]}
                            selectionMode="single"
                            selectedKeys={[selectedPinCode]}
                            onSelectionChange={(keys) => {
                                const key = Array.from(keys as Set<string>)[0];
                                if (key) setSelectedPinCode(key);
                            }}
                        >
                            {(item) => <DropdownItem key={item.key}>{item.label}</DropdownItem>}
                        </DropdownMenu>
                    </Dropdown>
                </span>
                <Button className="size-15 min-w-14 min-h-14 p-0! rounded-full! bg-primaryColor flex items-center justify-center text-white shrink-0" onPress={() => startServiceRegisterationRequest()}>
                    <BiSearch className="text-xl" />
                </Button>
            </div>
            <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
                {SERVICE_LIST?.map((curr) =>
                    <Button
                        endContent={<FiArrowRight className="text-base xl:text-lg" />}
                        className="btn_radius bg-[#F2F2F21A] border border-borderColor text-darkSilver text-xs md:text-base xl:text-lg py-0! xl:py-6! px-3 md:px-4"
                        key={curr._id}
                    >
                        {curr.service_name}
                    </Button>
                )}
            </div>
        </div>
    )
}

export default HomeBanner