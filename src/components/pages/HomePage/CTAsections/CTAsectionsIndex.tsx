"use client"
import { Button } from "@heroui/react"
import { FiArrowRight } from "react-icons/fi"

const CTAsectionsIndex = () => {
    return (
        <>
            <div className="container_y_padding grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="col-span-1 rounded-2xl p-6 md:p-20 bg-linear-to-r from-[#030213] to-[#030213CC] space-y-6">
                    <div className="space-y-3">
                        <h3 className="text-xl md:text-2xl/[32px] font-semibold text-white">Need a service?</h3>
                        <p className="text-white/90 text-sm md:text-base/[24px] leading-[-0.31px] w-full md:w-[80%]">
                            Tell us what you need and get matched with trusted professionals in your area.
                        </p>
                    </div>
                    <Button
                        endContent={<FiArrowRight className="text-base xl:text-lg" />}
                        className="btn_radius bg-[#ECEEF2] border border-borderColor text-fontBlack text-xs md:text-base xl:text-lg xl:py-6"
                    >
                        Post a request
                    </Button>
                </div>
                <div className="col-span-1 rounded-2xl p-6 md:p-20 bg-linear-to-r from-[#1E2939] to-[#101828] space-y-6">
                    <div className="space-y-3">
                        <h3 className="text-xl md:text-2xl/[32px] font-semibold text-white">Are you a professional?</h3>
                        <p className="text-white/90 text-sm md:text-base/[24px] leading-[-0.31px] w-full md:w-[80%]">
                            Join our network of verified professionals and grow your business with quality leads.
                        </p>
                    </div>
                    <Button
                        endContent={<FiArrowRight className="text-base xl:text-lg" />}
                        className="btn_radius bg-transparent border border-borderColor text-white text-xs md:text-base xl:text-lg xl:py-6"
                    >
                        Join as a professional
                    </Button>
                </div>
            </div>
        </>
    )
}

export default CTAsectionsIndex