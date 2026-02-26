"use client"

import OtpInput from "@/components/library/OtpInput"
import { RootState } from "@/redux/appStore"
import { closeModal, openModal } from "@/redux/slices/allModalSlice"
import { addToast, Button } from "@heroui/react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const OTP_LENGTH = 4
const RESEND_COOLDOWN_SEC = 59

const VendorOtpVerification = () => {
    const { data } = useSelector((state: RootState) => state.allCommonModal)
    const dispatch = useDispatch()

    const userSignupData = data?.userData as Record<string, unknown> | undefined
    const email = (userSignupData?.email as string) || ""
    const phoneNumber = (userSignupData?.phoneNumber as string) || ""

    const [emailOtp, setEmailOtp] = useState("")
    const [phoneOtp, setPhoneOtp] = useState("")
    const [emailResendCooldown, setEmailResendCooldown] = useState(0)
    const [phoneResendCooldown, setPhoneResendCooldown] = useState(0)

    const handleEmailResend = useCallback(() => {
        if (emailResendCooldown > 0) return
        setEmailResendCooldown(RESEND_COOLDOWN_SEC)
        // TODO: call resend email OTP API
    }, [emailResendCooldown])

    const handlePhoneResend = useCallback(() => {
        if (phoneResendCooldown > 0) return
        setPhoneResendCooldown(RESEND_COOLDOWN_SEC)
        // TODO: call resend phone OTP API
    }, [phoneResendCooldown])

    useEffect(() => {
        if (emailResendCooldown <= 0) return
        const t = setInterval(
            () => setEmailResendCooldown((c) => (c <= 0 ? 0 : c - 1)),
            1000
        )
        return () => clearInterval(t)
    }, [emailResendCooldown])

    useEffect(() => {
        if (phoneResendCooldown <= 0) return
        const t = setInterval(
            () => setPhoneResendCooldown((c) => (c <= 0 ? 0 : c - 1)),
            1000
        )
        return () => clearInterval(t)
    }, [phoneResendCooldown])

    const handleChangeContact = () => {
        dispatch(
            openModal({
                componentName: "LoginSignupIndex",
                data: {
                    componentName: "VendorSignupDetails",
                    userData: { ...userSignupData },
                },
                modalSize: "full",
            })
        )
    }

    const canVerify =
        emailOtp.length === OTP_LENGTH && phoneOtp.length === OTP_LENGTH

    return (
        <>
            <div className="space-y-10">
                <div className="space-y-3 xl:space-y-6 w-11/12">
                    <h1 className="header_text">
                        Authentication <br />{" "}
                        <span className="text-darkSilver"> required</span>
                    </h1>
                </div>

                <div className="space-y-8 w-11/12">
                    {/* Email verification */}
                    {email && (
                        <div className="space-y-4">
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
                                We&apos;ve sent a Verification Code to the email
                                above. Please enter it to complete verification.
                            </p>
                            <OtpInput
                                value={emailOtp}
                                onChange={setEmailOtp}
                                length={OTP_LENGTH}
                                classNames={{ wrapper: "flex gap-4 max-w-[280px]" }}
                                ariaLabelPrefix="Email digit"
                            />
                            <p className="text-fontBlack text-sm">
                                Didn&apos;t get your code?{" "}
                                {emailResendCooldown > 0 ? (
                                    <span className="text-primaryColor">
                                        Send a new code in {emailResendCooldown}s
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleEmailResend}
                                        className="text-primaryColor cursor-pointer underline underline-offset-2"
                                    >
                                        Send a new code
                                    </button>
                                )}
                            </p>
                        </div>
                    )}

                    {/* Phone verification */}
                    {phoneNumber && (
                        <div className="space-y-4">
                            <p className="text-fontBlack text-base">
                                {phoneNumber}{" "}
                                <button
                                    type="button"
                                    onClick={handleChangeContact}
                                    className="text-primaryColor cursor-pointer underline underline-offset-2"
                                >
                                    Change
                                </button>
                            </p>
                            <p className="text-fontBlack text-base">
                                We&apos;ve sent a Verification Code to the phone
                                number above. Please enter it to complete
                                verification.
                            </p>
                            <OtpInput
                                value={phoneOtp}
                                onChange={setPhoneOtp}
                                length={OTP_LENGTH}
                                classNames={{ wrapper: "flex gap-4 max-w-[280px]" }}
                                ariaLabelPrefix="Phone digit"
                            />
                            <p className="text-fontBlack text-sm">
                                Didn&apos;t get your code?{" "}
                                {phoneResendCooldown > 0 ? (
                                    <span className="text-primaryColor">
                                        Send a new code in {phoneResendCooldown}s
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handlePhoneResend}
                                        className="text-primaryColor cursor-pointer underline underline-offset-2"
                                    >
                                        Send a new code
                                    </button>
                                )}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-6.25 w-11/12">
                <Button
                    type="button"
                    className="btn_bg_blue btn_radius btn_padding font-medium text-sm w-full"
                    isDisabled={!canVerify}
                    onPress={() => {
                        // TODO: verify both OTPs via API then sign up
                        console.log("Verify vendor OTPs", { emailOtp, phoneOtp })
                        addToast({
                            title: "Success",
                            description:
                                "OTP Verification complete. You're signed up!",
                            color: "success",
                            timeout: 3000,
                        })
                        dispatch(
                            openModal({
                                componentName: "LoginSignupIndex",
                                data: {
                                    componentName: "VendorServiceListPage",
                                    userData: { ...userSignupData },
                                },
                                modalSize: "full",
                            })
                        )
                    }}
                >
                    Continue
                </Button>
                <p className="text-base text-fontBlack text-center">
                    Don&apos;t have an account?{" "}
                    <p
                        onClick={() => dispatch(openModal({ componentName: 'LoginSignupIndex', data: { componentName: 'CustomerSignInIndex' }, modalSize: 'full' }))}
                        className="text-primaryColor cursor-pointer underline underline-offset-2"
                    >
                        Sign up
                    </p>
                </p>
            </div>
        </>
    )
}

export default VendorOtpVerification
