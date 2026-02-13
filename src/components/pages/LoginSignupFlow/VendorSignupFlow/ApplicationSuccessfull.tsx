"use client"

import { closeModal } from "@/redux/slices/allModalSlice"
import { Button } from "@heroui/react"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { FiInfo } from "react-icons/fi"
import { FaCheck } from "react-icons/fa6"

const NEXT_STEPS = [
    "Our verification team will review your documents",
    "You'll receive an email notification once approved",
    "Once approved, you can start viewing and unlocking leads",
    "Submit quotes and connect with customers",
]

const ApplicationSuccessfull = () => {
    
    const dispatch = useDispatch()

    return (
        <>
            <div className="space-y-6 w-11/12">
                <div className="space-y-3">
                    <h1 className="header_text">
                        Application <span className="text-darkSilver">Submitted</span>
                    </h1>
                    <p className="text-fontBlack text-base">
                        Thank you for completing your vendor registration. Our team
                        is reviewing your documents and will get back to you within{" "}
                        <span className="font-semibold">2 - 3 days</span>.
                    </p>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-100 border border-amber-200 text-amber-800">
                        <span className="size-2 rounded-full bg-amber-500" aria-hidden />
                        Verification Pending
                    </span>
                </div>

                <div className="rounded-2xl bg-primaryColor/10 border border-primaryColor/20 p-4 sm:p-5 space-y-4">
                    <h2 className="flex items-center gap-2 font-semibold text-fontBlack text-base">
                        <FiInfo className="size-5 text-primaryColor shrink-0" />
                        What happens next?
                    </h2>
                    <ul className="space-y-3 list-none p-0 m-0">
                        {NEXT_STEPS.map((step, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <FaCheck className="size-5 text-primaryColor shrink-0 mt-0.5" />
                                <span className="text-fontBlack text-sm">{step}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="text-darkSilver text-sm">
                    We&apos;ll send updates to your registered email address.
                </p>
            </div>
            <div className="space-y-[25px] pt-2 w-11/12">
                <Button
                    type="button"
                    className="btn_bg_blue btn_radius btn_padding font-medium text-sm w-full"
                    onPress={() => dispatch(closeModal())}
                >
                    Continue
                </Button>
                <p className="text-base text-fontBlack text-center">
                    Have questions?{" "}
                    <Link
                        href="/vendor-support"
                        className="text-primaryColor cursor-pointer underline underline-offset-2"
                    >
                        Contact vendor support
                    </Link>
                </p>
            </div>
        </>
    )
}

export default ApplicationSuccessfull
