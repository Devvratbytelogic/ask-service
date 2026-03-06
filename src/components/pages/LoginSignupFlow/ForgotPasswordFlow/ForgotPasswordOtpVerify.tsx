"use client"

import OtpInput from "@/components/library/OtpInput"
import { RootState } from "@/redux/appStore"
import { openModal } from "@/redux/slices/allModalSlice"
import {
    useResendEmailVerificationMutation,
    useVerifyEmailMutation,
} from "@/redux/rtkQueries/authApi"
import { setAuthAndRefetchProfile } from "@/redux/authOnSuccess"
import type { AuthResponseData } from "@/utils/authCookies"
import { addToast, Button } from "@heroui/react"
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"

const OTP_LENGTH = 4
const RESEND_COOLDOWN_SEC = 59

const ForgotPasswordOtpVerify = () => {
    const { data } = useSelector((state: RootState) => state.allCommonModal)
    const dispatch = useDispatch()
    const router = useRouter()

    const userData = data?.userData as Record<string, unknown> | undefined
    const returnToRequestFlow = (data as { returnToRequestFlow?: boolean })?.returnToRequestFlow
    const requestFlowData = (data as { requestFlowData?: unknown })?.requestFlowData

    const email = (userData?.email as string) || ""

    const [verifyEmail, { isLoading: isVerifyingEmail }] = useVerifyEmailMutation()
    const [resendEmailVerification, { isLoading: isResendingEmail }] = useResendEmailVerificationMutation()

    const [otpValue, setOtpValue] = useState("")
    const [resendCooldown, setResendCooldown] = useState(0)

    const handleResend = useCallback(async () => {
        if (resendCooldown > 0 || !email) return
        try {
            await resendEmailVerification({ email }).unwrap()
            setResendCooldown(RESEND_COOLDOWN_SEC)
            addToast({ title: "Code sent", color: "success", timeout: 2000 })
        } catch {
            // Error toast from rtkQuerieSetup
        }
    }, [resendCooldown, email, resendEmailVerification])

    useEffect(() => {
        if (resendCooldown <= 0) return
        const t = setInterval(() => setResendCooldown((c) => (c <= 0 ? 0 : c - 1)), 1000)
        return () => clearInterval(t)
    }, [resendCooldown])

    const handleChangeContact = () => {
        dispatch(
            openModal({
                componentName: "LoginSignupIndex",
                data: {
                    componentName: "ForgotPasswordEnterIdentifier",
                    userData: { ...userData },
                    ...(returnToRequestFlow && requestFlowData
                        ? { returnToRequestFlow: true, requestFlowData }
                        : {}),
                },
                modalSize: "full",
            })
        )
    }

    const handleVerify = useCallback(async () => {
        if (otpValue.length !== OTP_LENGTH || !email) return
        try {
            const res = await verifyEmail({ email, otp: otpValue }).unwrap()
            const responseData = res?.data
            if (responseData && typeof responseData === "object") {
                setAuthAndRefetchProfile(responseData as AuthResponseData, dispatch)
                router.refresh()
            }
            const roleName = responseData?.role?.name ?? ""
            const isVendor = roleName.toLowerCase() === "vendor"
            dispatch(
                openModal({
                    componentName: "LoginSignupIndex",
                    data: {
                        componentName: "ForgotPasswordSetNew",
                        userData: { ...userData, isVendor },
                        ...(returnToRequestFlow && requestFlowData
                            ? { returnToRequestFlow: true, requestFlowData }
                            : {}),
                    },
                    modalSize: "full",
                })
            )
        } catch {
            // Error toast from rtkQuerieSetup
        }
    }, [otpValue, email, verifyEmail, userData, dispatch, returnToRequestFlow, requestFlowData])

    const canVerify = otpValue.length === OTP_LENGTH
    const isVerifying = isVerifyingEmail

    return (
        <>
            <div className="space-y-10">
                <div className="space-y-3 xl:space-y-6 w-11/12">
                    <h1 className="header_text">
                        Authentication <br /> <span className="text-darkSilver"> required</span>
                    </h1>
                    {email && (
                        <>
                            <p className="text-fontBlack text-base">
                                {email}{" "}
                                <button
                                    type="button"
                                    onClick={handleChangeContact}
                                    className="text-primaryColor cursor-pointer underline underline-offset-2"
                                >
                                    Change
                                </button>
                            </p>
                            <p className="text-fontBlack text-base">
                                We&apos;ve sent a Verification Code to the email address above. Please enter the complete verification.
                            </p>
                        </>
                    )}
                </div>

                <div className="space-y-4 w-11/12">
                    <p className="custom_label_text_light">Enter verification code</p>
                    <OtpInput
                        value={otpValue}
                        onChange={setOtpValue}
                        length={OTP_LENGTH}
                        classNames={{ wrapper: "flex gap-2 md:gap-4 max-w-[280px]" }}
                        ariaLabelPrefix="Digit"
                    />

                    <p className="text-fontBlack text-sm">
                        Didn&apos;t get your code?{" "}
                        {resendCooldown > 0 ? (
                            <span className="text-primaryColor">Send a new code in {resendCooldown}s</span>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={isResendingEmail}
                                className="text-primaryColor cursor-pointer underline underline-offset-2 disabled:opacity-50"
                            >
                                {isResendingEmail ? "Sending…" : "Send a new code"}
                            </button>
                        )}
                    </p>
                </div>
            </div>

            <div className="space-y-6.25 w-11/12">
                <Button
                    type="button"
                    className="btn_bg_blue btn_radius btn_padding font-medium text-sm w-full"
                    isDisabled={!canVerify || isVerifying}
                    isLoading={isVerifying}
                    onPress={handleVerify}
                >
                    Verify
                </Button>
                <p className="text-base text-fontBlack text-center">
                    Remembered your password?{" "}
                    <span
                        className="text-primaryColor cursor-pointer underline underline-offset-2"
                        onClick={() =>
                            dispatch(
                                openModal({
                                    componentName: "LoginSignupIndex",
                                    data: {
                                        componentName: "CustomerSignInDetails",
                                        userData: { signInType: "email" },
                                        ...(returnToRequestFlow && requestFlowData
                                            ? { returnToRequestFlow: true, requestFlowData }
                                            : {}),
                                    },
                                    modalSize: "full",
                                })
                            )
                        }
                        role="button"
                        tabIndex={0}
                    >
                        Sign in
                    </span>
                </p>
            </div>
        </>
    )
}

export default ForgotPasswordOtpVerify
