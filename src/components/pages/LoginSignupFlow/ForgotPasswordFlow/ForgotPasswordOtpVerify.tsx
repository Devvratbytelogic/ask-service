"use client"

import OtpInput from "@/components/library/OtpInput"
import { RootState } from "@/redux/appStore"
import { openModal } from "@/redux/slices/allModalSlice"
import { Button } from "@heroui/react"
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const OTP_LENGTH = 4
const RESEND_COOLDOWN_SEC = 59

const ForgotPasswordOtpVerify = () => {
    const { data } = useSelector((state: RootState) => state.allCommonModal)
    const dispatch = useDispatch()

    const userData = data?.userData as Record<string, unknown> | undefined
    const recoveryType = data?.userData?.recoveryType as string | undefined
    const isEmail = recoveryType === "email"

    const [otpValue, setOtpValue] = useState("")
    const [resendCooldown, setResendCooldown] = useState(0)

    const displayValue = isEmail
        ? (userData?.email as string) || ""
        : (userData?.phoneNumber as string) || ""

    const instructionText = isEmail
        ? "We've sent a Verification Code to the email address above. Please enter the complete verification."
        : "We've sent a Verification Code to the mobile number above. Please enter the complete verification."

    const handleResend = useCallback(() => {
        if (resendCooldown > 0) return
        setResendCooldown(RESEND_COOLDOWN_SEC)
        // TODO: call resend OTP API
    }, [resendCooldown])

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
                },
                modalSize: "full",
            })
        )
    }

    const handleVerify = () => {
        if (otpValue.length !== OTP_LENGTH) return
        dispatch(
            openModal({
                componentName: "LoginSignupIndex",
                data: {
                    componentName: "ForgotPasswordSetNew",
                    userData: { ...userData },
                },
                modalSize: "full",
            })
        )
    }

    const canVerify = otpValue.length === OTP_LENGTH

    return (
        <>
            <div className="space-y-10">
                <div className="space-y-3 xl:space-y-6 w-11/12">
                    <h1 className="header_text">
                        Authentication <br /> <span className="text-darkSilver"> required</span>
                    </h1>
                    {displayValue && (
                        <>
                            <p className="text-fontBlack text-base">
                                {displayValue}{" "}
                                <button
                                    type="button"
                                    onClick={handleChangeContact}
                                    className="text-primaryColor cursor-pointer underline underline-offset-2"
                                >
                                    Change
                                </button>
                            </p>
                            <p className="text-fontBlack text-base">{instructionText}</p>
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
                                className="text-primaryColor cursor-pointer underline underline-offset-2"
                            >
                                Send a new code
                            </button>
                        )}
                    </p>
                </div>
            </div>

            <div className="space-y-6.25 w-11/12">
                <Button
                    type="button"
                    className="btn_bg_blue btn_radius btn_padding font-medium text-sm w-full"
                    isDisabled={!canVerify}
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
                                        userData: { signInType: recoveryType ?? "email" },
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
