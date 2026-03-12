"use client"

import OtpInput from "@/components/library/OtpInput"
import { RootState } from "@/redux/appStore"
import { closeModal, openModal } from "@/redux/slices/allModalSlice"
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
import { getMyAccountRoutePath } from "@/routes/routes"

const OTP_LENGTH = 4
const RESEND_COOLDOWN_SEC = 59

const VerifyEmailPhoneNumberWithOtp = () => {
    const { data } = useSelector((state: RootState) => state.allCommonModal)
    const dispatch = useDispatch()
    const router = useRouter()

    const userSignupData = data?.userData as Record<string, unknown> | undefined

    const displayValue = (userSignupData?.email as string) || ""

    const [otpValue, setOtpValue] = useState("")
    const [resendCooldown, setResendCooldown] = useState(0)

    const [verifyEmail, { isLoading: isVerifyingEmail }] = useVerifyEmailMutation()
    const [resendEmailVerification, { isLoading: isResendingEmail }] = useResendEmailVerificationMutation()

    const handleResend = useCallback(async () => {
        if (resendCooldown > 0 || !displayValue) return
        try {
            await resendEmailVerification({ email: displayValue }).unwrap()
            setResendCooldown(RESEND_COOLDOWN_SEC)
            addToast({ title: "Verification Code sent", description: "Check your email.", color: "success", timeout: 2000 })
        } catch {
            // Error toast from rtkQuerieSetup
        }
    }, [resendCooldown, displayValue, resendEmailVerification])

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

    const handleVerify = useCallback(async (otp?: string) => {
        const toVerify = otp ?? otpValue
        if (toVerify.length !== OTP_LENGTH || !displayValue) return
        try {
            const res = await verifyEmail({ email: displayValue, otp: toVerify }).unwrap()
            const responseData = (res as { data?: unknown })?.data
            if (responseData && typeof responseData === "object") {
                setAuthAndRefetchProfile(responseData as AuthResponseData, dispatch)
                router.refresh()
            }
            addToast({
                title: "Success",
                description: "You're signed up!",
                color: "success",
                timeout: 3000,
            })
            dispatch(closeModal())
            router.push(getMyAccountRoutePath({section: 'profile'}))
        } catch {
            // Error toast from rtkQuerieSetup
        }
    }, [otpValue, displayValue, verifyEmail, dispatch, router])

    const canVerify = otpValue.length === OTP_LENGTH
    const isVerifying = isVerifyingEmail

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
                            <p className="text-fontBlack text-base">
                                We&apos;ve sent a Verification Code to the email above. Please enter it to complete verification.
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
                        onComplete={handleVerify}
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
                    onPress={() => handleVerify()}
                >
                    Vérifier et s'inscrire
                </Button>
                <p className="text-base text-fontBlack text-center flex justify-center gap-1">
                    Vous avez déjà un compte ?{" "}
                    <p onClick={() => dispatch(openModal({ componentName: 'LoginSignupIndex', data: { componentName: 'CustomerSignInIndex' }, modalSize: 'full' }))} className="text-primaryColor cursor-pointer underline underline-offset-2">
                        Se connecter
                    </p>
                </p>
            </div>
        </>
    )
}

export default VerifyEmailPhoneNumberWithOtp
