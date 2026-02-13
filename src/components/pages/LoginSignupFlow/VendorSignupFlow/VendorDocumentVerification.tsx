"use client"

import DocumentUploadCard from "@/components/library/DocumentUploadCard"
import { RootState } from "@/redux/appStore"
import { closeModal, openModal } from "@/redux/slices/allModalSlice"
import { Button } from "@heroui/react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { IoArrowBackOutline } from "react-icons/io5"
import ImageComponent from "@/components/library/ImageComponent"

const DOCUMENT_CONFIGS = [
    {
        id: "identity-proof",
        title: "Identity Proof",
        description:
            "Valid passport, driver's license, or national ID card.",
        allowedTypes: "PDF, JPG, PNG (Max 5MB)",
        required: true,
    },
    {
        id: "trade-license",
        title: "Trade License",
        description:
            "Relevant professional licenses for your service category.",
        allowedTypes: "PDF, JPG, PNG (Max 5MB)",
        required: true,
    },
    {
        id: "insurance",
        title: "Insurance Documents",
        description:
            "Public liability insurance (minimum €1M coverage required).",
        allowedTypes: "PDF, JPG, PNG (Max 5MB)",
        required: true,
    },
    {
        id: "business-registration",
        title: "Business Registration Certificate",
        description:
            "Certificate of incorporation or business registration.",
        allowedTypes: "PDF, JPG, PNG (Max 5MB)",
        required: true,
    },
    {
        id: "compliance",
        title: "Compliance Declaration",
        description:
            "DBS check (for relevant services), health & safety certificates.",
        allowedTypes: "PDF, JPG, PNG (Max 5MB)",
        required: true,
    },
    {
        id: "additional",
        title: "Additional Documents",
        description:
            "Any other documents required for your service category.",
        allowedTypes: "PDF, JPG, PNG (Max 5MB)",
        required: false,
    },
] as const

type DocId = (typeof DOCUMENT_CONFIGS)[number]["id"]

const VendorDocumentVerification = () => {
    const dispatch = useDispatch()
    const { data } = useSelector((state: RootState) => state.allCommonModal)
    const [files, setFiles] = useState<Record<DocId, File | null>>({
        "identity-proof": null,
        "trade-license": null,
        insurance: null,
        "business-registration": null,
        compliance: null,
        additional: null,
    })

    const setFile = (id: DocId, file: File | null) => {
        setFiles((prev) => ({ ...prev, [id]: file }))
    }

    const requiredIds: DocId[] = [
        "identity-proof",
        "trade-license",
        "insurance",
        "business-registration",
        "compliance",
    ]
    const allRequiredUploaded = requiredIds.every((id) => files[id] !== null)

    const handleSubmit = () => {
        // TODO: upload files via API, then show success
        console.log(
            "Submit for verification",
            Object.fromEntries(
                Object.entries(files).filter(([, f]) => f !== null)
            ),
            data
        )
        dispatch(
            openModal({
                componentName: "LoginSignupIndex",
                data: {
                    componentName: 'ApplicationSuccessfull',
                    userData: null,
                },
                modalSize: "full",
            })
        )
    }

    const handleBack = () => {
        dispatch(
            openModal({
                componentName: "LoginSignupIndex",
                data: {
                    componentName: 'VendorServiceListPage',
                    userData: null,
                },
                modalSize: "full",
            })
        )
    }

    return (
        <div className="w-11/12 mx-auto space-y-[45px] pb-8">
            <div className="h-12 w-fit">
                <ImageComponent url="/images/navbar/ask_service_logo.png" img_title="ask service logo" />
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="space-y-5 w-full">
                    <div className="relative">
                        <span onClick={handleBack} className="flex items-center gap-1 text-darkSilver hover:text-fontBlack transition-colors text-sm btn_bg_white absolute top-0 left-0 w-fit! p-2 rounded-[10px]">
                            <IoArrowBackOutline className="size-5" />
                        </span>
                        <h1 className="header_text text-center w-full">
                            Verify <span className="text-darkSilver">documents</span>
                        </h1>
                    </div>


                    <p className="text-fontBlack text-base/[21px] max-w-xl text-center mx-auto">
                        Upload the required documents to complete your vendor
                        verification. All information is securely stored and
                        only used for verification purposes.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {DOCUMENT_CONFIGS.map((config) => (
                    <DocumentUploadCard
                        key={config.id}
                        title={config.title}
                        required={config.required}
                        description={config.description}
                        allowedTypes={config.allowedTypes}
                        value={files[config.id]}
                        onChange={(file) => setFile(config.id, file)}
                    />
                ))}
            </div>

            <div className="flex justify-center pt-4">
                <Button
                    type="button"
                    className="btn_bg_blue btn_radius btn_padding font-medium text-sm w-full max-w-sm"
                    isDisabled={!allRequiredUploaded}
                    onPress={handleSubmit}
                >
                    Submit for verification
                </Button>
            </div>
        </div>
    )
}

export default VendorDocumentVerification
