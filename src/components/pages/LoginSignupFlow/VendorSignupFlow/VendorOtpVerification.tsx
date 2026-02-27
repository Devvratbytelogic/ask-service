"use client"

import OtpInput from "@/components/library/OtpInput"
import {
    useVendorResendOtpMutation,
    useVendorVerifyOtpMutation,
} from "@/redux/rtkQueries/authApi"
import { RootState } from "@/redux/appStore"
import { openModal } from "@/redux/slices/allModalSlice"
import { addToast, Button } from "@heroui/react"
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

    const [vendorVerifyOtp, { isLoading: isVerifying }] = useVendorVerifyOtpMutation()
    const [vendorResendOtp, { isLoading: isResendingOtp }] = useVendorResendOtpMutation()

    const handleEmailResend = useCallback(async () => {
        if (emailResendCooldown > 0 || !email) return
        try {
            await vendorResendOtp({
                identifier: email,
                identifierType: "EMAIL",
                type: "SIGNUP",
            }).unwrap()
            setEmailResendCooldown(RESEND_COOLDOWN_SEC)
            addToast({ title: "Code sent", description: "Check your email.", color: "success", timeout: 2000 })
        } catch {
            // Error toast from rtkQuerieSetup
        }
    }, [emailResendCooldown, email, vendorResendOtp])

    const handlePhoneResend = useCallback(async () => {
        if (phoneResendCooldown > 0 || !phoneNumber) return
        try {
            await vendorResendOtp({
                identifier: phoneNumber,
                identifierType: "PHONE",
                type: "SIGNUP",
            }).unwrap()
            setPhoneResendCooldown(RESEND_COOLDOWN_SEC)
            addToast({ title: "Code sent", description: "Check your phone.", color: "success", timeout: 2000 })
        } catch {
            // Error toast from rtkQuerieSetup
        }
    }, [phoneResendCooldown, phoneNumber, vendorResendOtp])

    const canVerify =
        emailOtp.length === OTP_LENGTH && phoneOtp.length === OTP_LENGTH

    const handleVerifyOtp = useCallback(async () => {
        if (!canVerify || !email) return
        try {
            await vendorVerifyOtp({
                type: "SIGNUP",
                email,
                otp_phone: phoneOtp,
                ...(emailOtp && { otp_email: emailOtp }),
            }).unwrap()
            addToast({
                title: "Success",
                description: "OTP verification complete. You're signed up!",
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
        } catch {
            // Error toast from rtkQuerieSetup
        }
    }, [canVerify, email, emailOtp, phoneOtp, userSignupData, vendorVerifyOtp, dispatch])

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
                                        disabled={isResendingOtp}
                                        className="text-primaryColor cursor-pointer underline underline-offset-2 disabled:opacity-50"
                                    >
                                        {isResendingOtp ? "Sending…" : "Send a new code"}
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
                                        disabled={isResendingOtp}
                                        className="text-primaryColor cursor-pointer underline underline-offset-2 disabled:opacity-50"
                                    >
                                        {isResendingOtp ? "Sending…" : "Send a new code"}
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
                    isDisabled={!canVerify || isVerifying}
                    isLoading={isVerifying}
                    onPress={handleVerifyOtp}
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
