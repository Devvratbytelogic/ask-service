"use client"

import OtpInput from "@/components/library/OtpInput"
import { RootState } from "@/redux/appStore"
import { closeModal, openModal } from "@/redux/slices/allModalSlice"
import {
    useResendEmailVerificationMutation,
    useResendPhoneOtpMutation,
    useVerifyEmailMutation,
    useVerifyPhoneMutation,
} from "@/redux/rtkQueries/authApi"
import { setAuthCookies, type AuthResponseData } from "@/utils/authCookies"
import { addToast, Button } from "@heroui/react"
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const OTP_LENGTH = 4
const RESEND_COOLDOWN_SEC = 59

const VerifyEmailPhoneNumberWithOtp = () => {
    const { data } = useSelector((state: RootState) => state.allCommonModal)
    const dispatch = useDispatch()

    const userSignupData = data?.userData as Record<string, unknown> | undefined
    const userSignupType = data?.userData?.userSignupType as string | undefined

    const [otpValue, setOtpValue] = useState("")
    const [resendCooldown, setResendCooldown] = useState(0)

    const [verifyEmail, { isLoading: isVerifyingEmail }] = useVerifyEmailMutation()
    const [verifyPhone, { isLoading: isVerifyingPhone }] = useVerifyPhoneMutation()
    const [resendEmailVerification, { isLoading: isResendingEmail }] = useResendEmailVerificationMutation()
    const [resendPhoneOtp, { isLoading: isResendingPhone }] = useResendPhoneOtpMutation()

    const isEmail = userSignupType === "email"
    const isPhone = userSignupType === "phoneNumber"

    const displayValue = isEmail
        ? (userSignupData?.email as string) || ""
        : isPhone
          ? (userSignupData?.phoneNumber as string) || ""
          : ""

    const instructionText = isEmail
        ? "We've sent a Verification Code to the email above. Please enter it to complete verification."
        : "We've sent a Verification Code to the phone number above. Please enter it to complete verification."

    const handleResend = useCallback(async () => {
        if (resendCooldown > 0) return
        try {
            if (isEmail && displayValue) {
                await resendEmailVerification({ email: displayValue }).unwrap()
            } else if (!isEmail && displayValue) {
                await resendPhoneOtp({ phone: displayValue, type: "SIGNUP" }).unwrap()
            } else return
            setResendCooldown(RESEND_COOLDOWN_SEC)
            addToast({ title: "Code sent", color: "success", timeout: 2000 })
        } catch {
            // Error toast from rtkQuerieSetup
        }
    }, [resendCooldown, isEmail, displayValue, resendEmailVerification, resendPhoneOtp])

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
                    componentName: "CustomerSignupDetails",
                    userData: { ...userSignupData },
                },
                modalSize: "full",
            })
        )
    }

    const handleVerify = useCallback(async () => {
        if (otpValue.length !== OTP_LENGTH || !displayValue) return
        try {
            let res: { data?: unknown }
            if (isEmail) {
                res = await verifyEmail({ email: displayValue, otp: otpValue }).unwrap()
            } else {
                res = await verifyPhone({ phone: displayValue, otp: otpValue }).unwrap()
            }
            const responseData = (res as { data?: unknown })?.data
            if (responseData && typeof responseData === "object") {
                setAuthCookies(responseData as AuthResponseData)
            }
            addToast({
                title: "Success",
                description: "You're signed up!",
                color: "success",
                timeout: 3000,
            })
            dispatch(closeModal())
        } catch {
            // Error toast from rtkQuerieSetup
        }
    }, [otpValue, isEmail, displayValue, verifyEmail, verifyPhone, dispatch])

    const canVerify = otpValue.length === OTP_LENGTH
    const isVerifying = isVerifyingEmail || isVerifyingPhone

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
                        classNames={{ wrapper: "flex gap-4 max-w-[200px]" }}
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
                                disabled={isResendingEmail || isResendingPhone}
                                className="text-primaryColor cursor-pointer underline underline-offset-2 disabled:opacity-50"
                            >
                                {isResendingEmail || isResendingPhone ? "Sending…" : "Send a new code"}
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
                    Verify & Sign Up
                </Button>
                <p className="text-base text-fontBlack text-center flex justify-center gap-1">
                    Already have an account?{" "}
                    <p onClick={() => dispatch(openModal({ componentName: 'LoginSignupIndex', data: { componentName: 'CustomerSignInIndex' }, modalSize: 'full' }))} className="text-primaryColor cursor-pointer underline underline-offset-2">
                        Sign In
                    </p>
                </p>
            </div>
        </>
    )
}

export default VerifyEmailPhoneNumberWithOtp
