"use client"

import OtpInput from "@/components/library/OtpInput"
import { RootState } from "@/redux/appStore"
import { closeModal } from "@/redux/slices/allModalSlice"
import { Button } from "@heroui/react"
import { useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import ImageComponent from "../library/ImageComponent"

const OTP_LENGTH = 4

export default function VerifyEmailOtpModal() {
    const dispatch = useDispatch()
    const { data } = useSelector((state: RootState) => state.allCommonModal)
    const email = (data?.email as string) || "example@xyz.com"

    const [otpValue, setOtpValue] = useState("")
    const [isResending, setIsResending] = useState(false)

    const handleVerify = useCallback(() => {
        if (otpValue.length !== OTP_LENGTH) return
        // TODO: call verify OTP API, then sign in or close
        dispatch(closeModal())
    }, [dispatch, otpValue])

    const handleResend = useCallback(() => {
        if (isResending) return
        setIsResending(true)
        // TODO: call resend OTP API
        setTimeout(() => setIsResending(false), 2000)
    }, [isResending])

    const canVerify = otpValue.length === OTP_LENGTH

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto py-2">
            {/* Email icon - open envelope in blue */}
            <div className="flex justify-center mb-4" aria-hidden>
                <ImageComponent url="/images/signup/email.svg" img_title="Email icon" />
            </div>

            <h2 className="text-xl font-bold text-fontBlack text-center">
                Verify Your Email
            </h2>
            <p className="text-darkSilver text-sm text-center mt-2">
                A 6-digit code has been sent to{" "}
                <span className="text-fontBlack font-medium">{email}</span>
            </p>

            <div className="mt-6">
                <OtpInput
                    value={otpValue}
                    onChange={setOtpValue}
                    length={OTP_LENGTH}
                    classNames={{ wrapper: "flex gap-4 justify-center" }}
                    ariaLabelPrefix="Digit"
                />
            </div>

            <p className="text-darkSilver text-sm text-center mt-4">
                Didn&apos;t get your code?{" "}
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="text-primaryColor font-medium cursor-pointer underline underline-offset-2 hover:opacity-90 disabled:opacity-50"
                >
                    Send a new code
                </button>
            </p>

            <Button
                type="button"
                className="btn_bg_blue btn_radius btn_padding font-medium text-sm w-full mt-6"
                isDisabled={!canVerify}
                onPress={handleVerify}
            >
                Verify & Sign In
            </Button>
        </div>
    )
}
