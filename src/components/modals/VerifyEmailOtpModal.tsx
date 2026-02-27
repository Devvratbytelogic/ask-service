"use client"

import OtpInput from "@/components/library/OtpInput"
import { RootState } from "@/redux/appStore"
import { closeModal, openModal } from "@/redux/slices/allModalSlice"
import { useResendEmailVerificationMutation, useVerifyEmailMutation } from "@/redux/rtkQueries/authApi"
import { setAuthCookies, type AuthResponseData } from "@/utils/authCookies"
import { addToast, Button } from "@heroui/react"
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import ImageComponent from "../library/ImageComponent"

const OTP_LENGTH = 4
const RESEND_COOLDOWN_SEC = 59

export default function VerifyEmailOtpModal() {
    const dispatch = useDispatch()
    const { data } = useSelector((state: RootState) => state.allCommonModal)
    const email = (data?.email as string) || ""
    const returnToRequestFlow = (data as { returnToRequestFlow?: boolean })?.returnToRequestFlow
    const requestFlowData = (data as { requestFlowData?: unknown })?.requestFlowData

    const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation()
    const [resendEmailVerification, { isLoading: isResending }] = useResendEmailVerificationMutation()

    const [otpValue, setOtpValue] = useState("")
    const [resendCooldown, setResendCooldown] = useState(0)

    const handleVerify = useCallback(async () => {
        if (otpValue.length !== OTP_LENGTH || !email) return
        try {
            const res = await verifyEmail({ email, otp: otpValue }).unwrap()
            const responseData = (res as { data?: unknown })?.data
            if (responseData && typeof responseData === "object") {
                setAuthCookies(responseData as AuthResponseData)
            }
            addToast({ title: "Signed in successfully", color: "success", timeout: 2000 })
            if (returnToRequestFlow && requestFlowData) {
                dispatch(closeModal())
                dispatch(openModal({
                    componentName: "RequestServiceFlowIndex",
                    data: requestFlowData,
                    modalSize: "lg",
                }))
            } else {
                dispatch(closeModal())
            }
        } catch {
            // Error toast from rtkQuerieSetup
        }
    }, [email, otpValue, verifyEmail, dispatch, returnToRequestFlow, requestFlowData])

    const handleResend = useCallback(async () => {
        if (resendCooldown > 0 || !email) return
        try {
            await resendEmailVerification({ email }).unwrap()
            setResendCooldown(RESEND_COOLDOWN_SEC)
            addToast({ title: "Code sent", description: "Check your email.", color: "success", timeout: 2000 })
        } catch {
            // Error toast from rtkQuerieSetup
        }
    }, [email, resendCooldown, resendEmailVerification])

    useEffect(() => {
        if (resendCooldown <= 0) return
        const t = setInterval(() => setResendCooldown((c) => (c <= 0 ? 0 : c - 1)), 1000)
        return () => clearInterval(t)
    }, [resendCooldown])

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
                {resendCooldown > 0 ? (
                    <span className="text-primaryColor">Send a new code in {resendCooldown}s</span>
                ) : (
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending}
                        className="text-primaryColor font-medium cursor-pointer underline underline-offset-2 hover:opacity-90 disabled:opacity-50"
                    >
                        {isResending ? "Sending…" : "Send a new code"}
                    </button>
                )}
            </p>

            <Button
                type="button"
                className="btn_bg_blue btn_radius btn_padding font-medium text-sm w-full mt-6"
                isDisabled={!canVerify || isVerifying}
                isLoading={isVerifying}
                onPress={handleVerify}
            >
                Verify & Sign In
            </Button>
        </div>
    )
}
