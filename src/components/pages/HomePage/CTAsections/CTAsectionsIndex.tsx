"use client"
import { Button } from "@heroui/react"
import { FiArrowRight } from "react-icons/fi"
import { useDispatch } from "react-redux"
import { openModal } from "@/redux/slices/allModalSlice"

const CTAsectionsIndex = () => {
    const dispatch = useDispatch()

    const scrollToBannerSearch = () => {
        document.getElementById("banner-search")?.scrollIntoView({ behavior: "smooth", block: "center" })
    }

    const openJoinAsProfessionalModal = () => {
        dispatch(openModal({
            componentName: "LoginSignupIndex",
            data: {
                componentName: "SelectUserType",
                preselectedUserType: "service",
            },
            modalSize: "full",
        }))
    }

    return (
        <>
            <div className="container_y_padding grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="col-span-1 rounded-2xl p-6 md:p-20 bg-linear-to-r from-[#030213] to-[#030213CC] space-y-6">
                    <div className="space-y-3">
                        <h3 className="text-xl md:text-2xl/[32px] font-semibold text-white">Besoin d'un service ?</h3>
                        <p className="text-white/90 text-sm md:text-base/[24px] leading-[-0.31px] w-full md:w-[80%]">
                            Indiquez votre besoin et recevez rapidement des devis de professionnels vérifiés dans votre région.
                        </p>
                    </div>
                    <Button
                        endContent={<FiArrowRight className="text-base xl:text-lg" />}
                        className="btn_radius bg-[#ECEEF2] border border-borderColor text-fontBlack text-xs md:text-base xl:text-lg xl:py-6"
                        onPress={scrollToBannerSearch}
                    >
                        Déposer une demande
                    </Button>
                </div>
                <div className="col-span-1 rounded-2xl p-6 md:p-20 bg-linear-to-r from-[#1E2939] to-[#101828] space-y-6">
                    <div className="space-y-3">
                        <h3 className="text-xl md:text-2xl/[32px] font-semibold text-white">Vous êtes professionnel ?</h3>
                        <p className="text-white/90 text-sm md:text-base/[24px] leading-[-0.31px] w-full md:w-[80%]">
                            Rejoignez notre réseau de professionnels vérifiés et développez votre activité avec des leads qualifiés.
                        </p>
                    </div>
                    <Button
                        endContent={<FiArrowRight className="text-base xl:text-lg" />}
                        className="btn_radius bg-transparent border border-borderColor text-white text-xs md:text-base xl:text-lg xl:py-6"
                        onPress={openJoinAsProfessionalModal}
                    >
                        Devenir prestataire
                    </Button>
                </div>
            </div>
        </>
    )
}

export default CTAsectionsIndex