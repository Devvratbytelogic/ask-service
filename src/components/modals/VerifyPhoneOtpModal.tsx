"use client"

import OtpInput from "@/components/library/OtpInput"
import { PhoneIconSVG } from "@/components/library/AllSVG"
import { RootState } from "@/redux/appStore"
import { closeModal } from "@/redux/slices/allModalSlice"
import {
    useUpdateUserProfileInfoMutation,
    useUpdateVendorProfileInfoMutation,
} from "@/redux/rtkQueries/allPostApi"
import { useResendPhoneOtpMutation, useVerifyPhoneMutation } from "@/redux/rtkQueries/authApi"
import { setAuthAndRefetchProfile } from "@/redux/authOnSuccess"
import type { AuthResponseData } from "@/utils/authCookies"
import { addToast, Button } from "@heroui/react"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"

const OTP_LENGTH = 4
const RESEND_COOLDOWN_SEC = 59

function getErrorMessage(err: unknown, fallback: string) {
    return (
        (err as { data?: { message?: string } })?.data?.message ??
        (err as { error?: string })?.error ??
        fallback
    )
}

export default function VerifyPhoneOtpModal() {
    const dispatch = useDispatch()
    const router = useRouter()
    const { data } = useSelector((state: RootState) => state.allCommonModal)
    const authRole = useSelector((state: RootState) => state.auth.userRole)
    const role = (authRole || Cookies.get("user_role") || "").toLowerCase()
    const isVendor = role === "vendor"
    const initialPhone = ((data?.phoneNumber as string) || "").trim()
    const skipToCodeEntry = !!(data as { skipToCodeEntry?: boolean })?.skipToCodeEntry

    const [verifyPhone, { isLoading: isVerifying }] = useVerifyPhoneMutation()
    const [resendPhoneOtp, { isLoading: isSending }] = useResendPhoneOtpMutation()
    const [updateUserProfileInfo, { isLoading: isUpdatingUserProfile }] = useUpdateUserProfileInfoMutation()
    const [updateVendorProfileInfo, { isLoading: isUpdatingVendorProfile }] =
        useUpdateVendorProfileInfoMutation()

    const [phoneNumber, setPhoneNumber] = useState(initialPhone)
    const [savedPhone, setSavedPhone] = useState(initialPhone)
    const [codeSent, setCodeSent] = useState(skipToCodeEntry)
    const [otpValue, setOtpValue] = useState("")
    const [resendCooldown, setResendCooldown] = useState(skipToCodeEntry ? RESEND_COOLDOWN_SEC : 0)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const trimmedPhone = phoneNumber.trim()
    const isPhoneValid = trimmedPhone.length >= 5
    const phoneChanged = trimmedPhone !== savedPhone
    const isSendingCode = isSending || isUpdatingUserProfile || isUpdatingVendorProfile

    useEffect(() => {
        if (resendCooldown <= 0) return
        const timer = setInterval(() => {
            setResendCooldown((seconds) => (seconds <= 1 ? 0 : seconds - 1))
        }, 1000)
        return () => clearInterval(timer)
    }, [resendCooldown])

    const sendOtp = async () => {
        if (!isPhoneValid || resendCooldown > 0) return
        setErrorMessage(null)
        try {
            // If the user changed the prefilled number, update profile first
            if (phoneChanged) {
                if (isVendor) {
                    await updateVendorProfileInfo({ phone: trimmedPhone }).unwrap()
                } else {
                    await updateUserProfileInfo({ phone: trimmedPhone }).unwrap()
                }
                setSavedPhone(trimmedPhone)
            } else {
                await resendPhoneOtp({ phone: trimmedPhone, type: "VERIFY_PHONE" }).unwrap()
            }

            setCodeSent(true)
            setOtpValue("")
            setResendCooldown(RESEND_COOLDOWN_SEC)
            addToast({
                title: "Code envoyé",
                description: "Un code de vérification a été envoyé par SMS.",
                color: "success",
                timeout: 2000,
            })
        } catch (err: unknown) {
            setErrorMessage(
                getErrorMessage(
                    err,
                    phoneChanged
                        ? "Échec de la mise à jour du profil."
                        : "Échec de l'envoi du code.",
                ),
            )
        }
    }

    const submitOtp = async (otp = otpValue) => {
        if (otp.length !== OTP_LENGTH || !isPhoneValid) return
        setErrorMessage(null)
        try {
            const res = await verifyPhone({ phone: trimmedPhone, otp }).unwrap()
            const responseData = (res as { data?: unknown })?.data ?? res

            if (responseData && typeof responseData === "object") {
                setAuthAndRefetchProfile(responseData as AuthResponseData, dispatch)
                router.refresh()
            }

            addToast({
                title: "Succès",
                description: "Votre numéro de téléphone a été vérifié.",
                color: "success",
                timeout: 3000,
            })
            dispatch(closeModal())
        } catch (err: unknown) {
            setErrorMessage(getErrorMessage(err, "Le code saisi est incorrect. Veuillez réessayer."))
        }
    }

    return (
        <div className="mx-auto flex w-full max-w-md flex-col items-center py-2">
            <div
                className="mb-5 flex size-14 items-center justify-center rounded-full bg-primaryColor/10 text-primaryColor"
                aria-hidden
            >
                <span className="scale-150">
                    <PhoneIconSVG />
                </span>
            </div>

            <h2 className="text-center text-xl font-bold text-fontBlack">
                Vérifiez votre numéro
            </h2>

            {!codeSent ? (
                <>
                    <p className="mt-2 text-center text-sm text-darkSilver">
                        Saisissez votre numéro de téléphone et nous vous enverrons un code de vérification.
                    </p>

                    <div className="mt-5 w-full">
                        <label htmlFor="verify-phone-input" className="custom_label_text_light mb-1.5 block">
                            Numéro de téléphone
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primaryColor">
                                <PhoneIconSVG />
                            </span>
                            <input
                                id="verify-phone-input"
                                type="tel"
                                name="phoneNumber"
                                value={phoneNumber}
                                onChange={(e) => {
                                    setPhoneNumber(e.target.value)
                                    setErrorMessage(null)
                                }}
                                placeholder="+33 6 12 34 56 78"
                                autoComplete="tel"
                                className="h-13 w-full rounded-xl border border-appBorder bg-appSurface pl-11 pr-4 text-sm text-appText outline-none transition-colors placeholder:text-placeHolderText focus:border-primaryColor focus:bg-appCard focus:ring-2 focus:ring-primaryColor/20"
                            />
                        </div>
                    </div>

                    {errorMessage && (
                        <p className="mt-3 text-center text-sm text-danger" role="alert">
                            {errorMessage}
                        </p>
                    )}

                    <Button
                        type="button"
                        className="btn_bg_blue btn_radius btn_padding mt-6 w-full text-sm font-medium"
                        isDisabled={!isPhoneValid || isSendingCode}
                        isLoading={isSendingCode}
                        onPress={sendOtp}
                    >
                        Envoyer le code
                    </Button>
                </>
            ) : (
                <>
                    <p className="mt-2 text-center text-sm text-darkSilver">
                        Saisissez le code à {OTP_LENGTH} chiffres envoyé au{" "}
                        <span className="font-medium text-fontBlack">{trimmedPhone || "—"}</span>
                    </p>

                    <div className="mt-6">
                        <OtpInput
                            value={otpValue}
                            onChange={(value) => {
                                setOtpValue(value)
                                setErrorMessage(null)
                            }}
                            length={OTP_LENGTH}
                            onComplete={submitOtp}
                            classNames={{ wrapper: "flex justify-center gap-4" }}
                            ariaLabelPrefix="Digit"
                        />
                    </div>

                    {errorMessage && (
                        <p className="mt-3 text-center text-sm text-danger" role="alert">
                            {errorMessage}
                        </p>
                    )}

                    <p className="mt-4 text-center text-sm text-darkSilver">
                        Vous n&apos;avez pas reçu le code ?{" "}
                        {resendCooldown > 0 ? (
                            <span className="text-primaryColor">Renvoyer dans {resendCooldown}s</span>
                        ) : (
                            <button
                                type="button"
                                onClick={sendOtp}
                                disabled={isSendingCode}
                                className="cursor-pointer font-medium text-primaryColor underline underline-offset-2 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSendingCode ? "Envoi…" : "Renvoyer"}
                            </button>
                        )}
                    </p>

                    <Button
                        type="button"
                        className="btn_bg_blue btn_radius btn_padding mt-6 w-full text-sm font-medium"
                        isDisabled={otpValue.length !== OTP_LENGTH || isVerifying}
                        isLoading={isVerifying}
                        onPress={() => submitOtp()}
                    >
                        Vérifier
                    </Button>
                </>
            )}
        </div>
    )
}
