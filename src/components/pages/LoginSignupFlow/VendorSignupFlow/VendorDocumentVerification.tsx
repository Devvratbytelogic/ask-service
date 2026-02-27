"use client"

import DocumentUploadCard from "@/components/library/DocumentUploadCard"
import { useGetAllServicesDocumentsRequiredQuery } from "@/redux/rtkQueries/clientSideGetApis"
import { useUploadVendorDocumentsMutation } from "@/redux/rtkQueries/allPostApi"
import { RootState } from "@/redux/appStore"
import { openModal } from "@/redux/slices/allModalSlice"
import { Button } from "@heroui/react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { IoArrowBackOutline } from "react-icons/io5"
import ImageComponent from "@/components/library/ImageComponent"

const VendorDocumentVerification = () => {
    const dispatch = useDispatch()
    const { data } = useSelector((state: RootState) => state.allCommonModal)
    const { data: documentsResponse, isLoading, isError } = useGetAllServicesDocumentsRequiredQuery()
    const documents = documentsResponse?.data ?? []
    const [uploadVendorDocuments, { isLoading: isUploading }] = useUploadVendorDocumentsMutation()

    const [files, setFiles] = useState<Record<string, File | null>>({})

    const setFile = (id: string, file: File | null) => {
        setFiles((prev) => ({ ...prev, [id]: file }))
    }

    const requiredIds = documents.filter((doc) => doc.is_required).map((doc) => doc._id)
    const allRequiredUploaded = requiredIds.length > 0 && requiredIds.every((id) => files[id] !== null)

    const handleSubmit = async () => {
        const formData = new FormData()
        Object.entries(files).forEach(([docId, file]) => {
            if (file) formData.append(docId, file)
        })

        try {
            await uploadVendorDocuments(formData).unwrap()
            dispatch(
                openModal({
                    componentName: "LoginSignupIndex",
                    data: {
                        componentName: "ApplicationSuccessfull",
                        userData: null,
                    },
                    modalSize: "full",
                })
            )
        } catch (err) {
            console.error("Failed to upload vendor documents", err)
        }
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
        <div className="w-11/12 mx-auto space-y-11.25 pb-8">
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

            {isLoading && (
                <p className="text-darkSilver text-sm">Loading required documents...</p>
            )}
            {isError && (
                <p className="text-red-500 text-sm">Failed to load required documents. Please try again.</p>
            )}
            {!isLoading && !isError && documents.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                    {documents.map((doc) => (
                        <DocumentUploadCard
                            key={doc._id}
                            title={doc.name}
                            required={doc.is_required}
                            description={doc.description ?? ""}
                            allowedTypes={doc.allowed_formats}
                            value={files[doc._id] ?? null}
                            onChange={(file) => setFile(doc._id, file)}
                        />
                    ))}
                </div>
            )}

            <div className="flex justify-center pt-4">
                <Button
                    type="button"
                    className="btn_bg_blue btn_radius btn_padding font-medium text-sm w-full max-w-sm"
                    isDisabled={!allRequiredUploaded || isLoading || isUploading}
                    isLoading={isUploading}
                    onPress={handleSubmit}
                >
                    Submit for verification
                </Button>
            </div>
        </div>
    )
}

export default VendorDocumentVerification
