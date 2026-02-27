"use client"

import OtpInput from "@/components/library/OtpInput"
import { RootState } from "@/redux/appStore"
import { closeModal, openModal } from "@/redux/slices/allModalSlice"
import { useResendPhoneOtpMutation, useVerifyPhoneMutation } from "@/redux/rtkQueries/authApi"
import { setAuthCookies, type AuthResponseData } from "@/utils/authCookies"
import { addToast, Button } from "@heroui/react"
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { IoPencilOutline } from "react-icons/io5"

const OTP_LENGTH = 4
const RESEND_COOLDOWN_SEC = 59
const OTP_EXPIRY_SEC = 600 // 10 minutes, display as 9:59

const formatExpiry = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
}

const MobileOtpVerification = () => {

    const { data } = useSelector((state: RootState) => state.allCommonModal)
    const dispatch = useDispatch()
    const [verifyPhone, { isLoading: isVerifyingPhone }] = useVerifyPhoneMutation()
    const [resendPhoneOtp, { isLoading: isResendingPhone }] = useResendPhoneOtpMutation()

    const initialPhone = (data?.phoneNumber as string) || ""
    const skipToCodeEntry = !!(data as { skipToCodeEntry?: boolean })?.skipToCodeEntry
    const otpType = (data as { otpType?: string })?.otpType ?? "SERVICE_REQUEST"

    const [phoneNumber, setPhoneNumber] = useState(initialPhone)
    const [codeSent, setCodeSent] = useState(skipToCodeEntry)
    const [otpValue, setOtpValue] = useState("")
    const [resendCooldown, setResendCooldown] = useState(skipToCodeEntry ? RESEND_COOLDOWN_SEC : 0)
    const [otpExpirySeconds, setOtpExpirySeconds] = useState(skipToCodeEntry ? OTP_EXPIRY_SEC : 0)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const isPhoneValid = phoneNumber.length >= 10

    const handleSendCode = useCallback(async () => {
        if (!isPhoneValid) return
        setErrorMessage(null)
        try {
            await resendPhoneOtp({ phone: phoneNumber, type: otpType }).unwrap()
            setCodeSent(true)
            setOtpExpirySeconds(OTP_EXPIRY_SEC)
            setResendCooldown(RESEND_COOLDOWN_SEC)
        } catch (err: unknown) {
            const message = (err as { data?: { message?: string }; error?: string })?.data?.message ?? (err as { error?: string })?.error ?? "Failed to send code."
            setErrorMessage(message)
        }
    }, [isPhoneValid, phoneNumber, otpType, resendPhoneOtp])

    const handleResend = useCallback(async () => {
        if (resendCooldown > 0) return
        setErrorMessage(null)
        try {
            await resendPhoneOtp({ phone: phoneNumber, type: otpType }).unwrap()
            setResendCooldown(RESEND_COOLDOWN_SEC)
            setOtpExpirySeconds(OTP_EXPIRY_SEC)
        } catch (err: unknown) {
            const message = (err as { data?: { message?: string }; error?: string })?.data?.message ?? (err as { error?: string })?.error ?? "Failed to resend code."
            setErrorMessage(message)
        }
    }, [resendCooldown, phoneNumber, otpType, resendPhoneOtp])

    useEffect(() => {
        if (resendCooldown <= 0) return
        const t = setInterval(
            () => setResendCooldown((c) => (c <= 0 ? 0 : c - 1)),
            1000
        )
        return () => clearInterval(t)
    }, [resendCooldown])

    useEffect(() => {
        if (!codeSent || otpExpirySeconds <= 0) return
        const t = setInterval(
            () =>
                setOtpExpirySeconds((s) => (s <= 0 ? 0 : s - 1)),
            1000
        )
        return () => clearInterval(t)
    }, [codeSent, otpExpirySeconds])

    const handleChangePhone = () => {
        setCodeSent(false)
        setOtpValue("")
        setErrorMessage(null)
        setOtpExpirySeconds(0)
    }

    const handleVerify = useCallback(async () => {
        setErrorMessage(null)
        try {
            const res = await verifyPhone({ phone: phoneNumber, otp: otpValue }).unwrap()
            const responseData = (res as { data?: unknown })?.data ?? res
            if (responseData && typeof responseData === "object") {
                setAuthCookies(responseData as AuthResponseData)
            }
            if (data?.callBackModal || data?.parentCallBackModal) {
                dispatch(
                    openModal({
                        componentName: data?.parentCallBackModal ? data?.parentCallBackModal : "LoginSignupIndex",
                        data: {
                            ...data,
                            componentName: data?.callBackModal ? data?.callBackModal : null,
                        },
                        modalSize: data?.nextModalSize ? data?.nextModalSize : "full",
                    })
                )
            } else {
                dispatch(closeModal())
            }
            addToast({
                title: "Success",
                description: "OTP Verification completed.",
                color: "success",
                timeout: 3000,
            })
        } catch (err: unknown) {
            const message = (err as { data?: { message?: string }; error?: string })?.data?.message ?? (err as { error?: string })?.error ?? "The code you entered is incorrect. Please try again."
            setErrorMessage(message)
        }
    }, [phoneNumber, otpValue, data, dispatch, verifyPhone])

    const canVerify = otpValue.length === OTP_LENGTH

    // ——— State 1: Initial — phone entry, code not sent ———
    if (!codeSent) {
        return (
            <div className="space-y-6 w-full max-w-md mx-auto">
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-fontBlack">
                        Lets get you started
                    </h2>
                    <p className="text-darkSilver text-sm xl:text-base">
                        Enter your phone number and we&apos;ll send a verification
                        code to verify it.
                    </p>
                </div>

                <div className="space-y-2">
                    <p className="custom_label_text_light">Phone number</p>
                    <div className="mt-1.5">
                        <PhoneInput
                            country="us"
                            value={phoneNumber}
                            onChange={(value) => {
                                setPhoneNumber(value)
                                setErrorMessage(null)
                            }}
                            inputProps={{
                                name: "phoneNumber",
                                "aria-label": "Phone number",
                            }}
                            containerClass="!w-full"
                            inputClass="!w-full !rounded-[12px] !border-borderDark"
                            inputStyle={{ height: "52px" }}
                            dropdownClass="!z-[9999]"
                            dropdownStyle={{ zIndex: 9999 }}
                        />
                    </div>
                </div>

                <Button
                    type="button"
                    className="btn_bg_blue btn_radius btn_padding font-medium text-sm xl:text-base w-full"
                    isDisabled={!isPhoneValid || isResendingPhone}
                    isLoading={isResendingPhone}
                    onPress={handleSendCode}
                >
                    Send code
                </Button>
            </div>
        )
    }

    // ——— State 2: Code sent — Enter Verification Code ———
    return (
        <div className="space-y-6 w-full max-w-md mx-auto">
            <div className="space-y-2">
                <h2 className="text-xl font-semibold text-fontBlack">
                    Enter Verification Code
                </h2>
                <p className="text-darkSilver text-sm xl:text-base flex items-center flex-wrap">
                    <span>Enter the {OTP_LENGTH} digit code</span>, we&apos;ve sent to your
                    phone number
                    <div className="flex items-center gap-0.5">
                        <span className="text-primaryColor font-medium">
                            {phoneNumber}
                        </span>
                        <button
                            type="button"
                            onClick={handleChangePhone}
                            className="text-primaryColor p-1 rounded hover:bg-primaryColor/10"
                            aria-label="Change phone number"
                        >
                            <IoPencilOutline className="size-4" />
                        </button>
                    </div>
                </p>
            </div>

            <div className="space-y-4">
                <OtpInput
                    value={otpValue}
                    onChange={(value) => {
                        setOtpValue(value)
                        setErrorMessage(null)
                    }}
                    length={OTP_LENGTH}
                    classNames={{ wrapper: "flex gap-4 max-w-[200px]" }}
                    ariaLabelPrefix="Digit"
                />

                <ul className="text-darkSilver text-sm xl:text-base space-y-1 list-none">
                    <li>
                        The OTP will be expired in{" "}
                        <span className="font-semibold text-fontBlack">
                            {formatExpiry(otpExpirySeconds)}
                        </span>
                    </li>
                    <li>
                        Didn&apos;t receive the code?{" "}
                        {resendCooldown > 0 ? (
                            <span className="text-primaryColor">
                                Resend in {resendCooldown}s
                            </span>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={isResendingPhone}
                                className="text-primaryColor cursor-pointer underline underline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isResendingPhone ? "Sending…" : "Send a new code"}
                            </button>
                        )}
                    </li>
                </ul>

                {errorMessage && (
                    <div className="flex items-start gap-2 text-danger text-sm xl:text-base">
                        <span
                            className="size-5 rounded-full bg-danger/10 flex items-center justify-center shrink-0 mt-0.5 font-bold"
                            aria-hidden
                        >
                            !
                        </span>
                        <span>{errorMessage}</span>
                    </div>
                )}
            </div>

            <Button
                type="button"
                className="btn_bg_blue btn_radius btn_padding font-medium text-sm xl:text-base w-full"
                isDisabled={!canVerify || isVerifyingPhone}
                isLoading={isVerifyingPhone}
                onPress={handleVerify}
            >
                Continue
            </Button>
        </div>
    )
}

export default MobileOtpVerification
