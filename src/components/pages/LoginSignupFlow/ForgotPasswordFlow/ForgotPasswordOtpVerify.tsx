"use client"

import OtpInput from "@/components/library/OtpInput"
import { RootState } from "@/redux/appStore"
import { openModal } from "@/redux/slices/allModalSlice"
import {
    useResendEmailVerificationMutation,
    useVerifyEmailMutation,
} from "@/redux/rtkQueries/authApi"
import { getFcmTokenFromCookie } from "@/firebase/getFcmTokenn"
import { addToast, Button } from "@heroui/react"
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const OTP_LENGTH = 4
const RESEND_COOLDOWN_SEC = 59

const ForgotPasswordOtpVerify = () => {
    const { data } = useSelector((state: RootState) => state.allCommonModal)
    const dispatch = useDispatch()

    const userData = data?.userData as Record<string, unknown> | undefined
    const returnToRequestFlow = (data as { returnToRequestFlow?: boolean })?.returnToRequestFlow
    const requestFlowData = (data as { requestFlowData?: unknown })?.requestFlowData

    const email = (userData?.email as string) || ""
    const fcmToken = getFcmTokenFromCookie()

    const [verifyEmail, { isLoading: isVerifyingEmail }] = useVerifyEmailMutation()
    const [resendEmailVerification, { isLoading: isResendingEmail }] = useResendEmailVerificationMutation()

    const [otpValue, setOtpValue] = useState("")
    const [resendCooldown, setResendCooldown] = useState(0)

    const handleResend = useCallback(async () => {
        if (resendCooldown > 0 || !email) return
        try {
            await resendEmailVerification({ email }).unwrap()
            setResendCooldown(RESEND_COOLDOWN_SEC)
            addToast({ title: "Code de vérification envoyé", description: "Vérifiez votre e-mail.", color: "success", timeout: 2000 })
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

    const handleVerify = useCallback(async (otp?: string) => {
        const toVerify = otp ?? otpValue
        if (toVerify.length !== OTP_LENGTH || !email) return
        try {
            const res = await verifyEmail({
                email,
                otp: toVerify,
                ...(fcmToken && { fcm_token: fcmToken }),
            }).unwrap()
            const responseData = res?.data as Record<string, unknown> | undefined
            const resetToken =
                (responseData?.token as string) ?? (responseData?.access_token as string) ?? ""
            const roleName = (responseData?.role as { name?: string })?.name ?? ""
            const isVendor = String(roleName).toLowerCase() === "vendor"
            dispatch(
                openModal({
                    componentName: "LoginSignupIndex",
                    data: {
                        componentName: "ForgotPasswordSetNew",
                        userData: { ...userData, isVendor, resetToken },
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
    }, [otpValue, email, verifyEmail, userData, dispatch, returnToRequestFlow, requestFlowData, fcmToken])

    const canVerify = otpValue.length === OTP_LENGTH
    const isVerifying = isVerifyingEmail

    return (
        <>
            <div className="space-y-10">
                <div className="space-y-3 xl:space-y-6 w-11/12">
                    <h1 className="header_text">
                        Authentification <br /> <span className="text-darkSilver"> requise</span>
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
                                    Changer
                                </button>
                            </p>
                            <p className="text-fontBlack text-base">
                                Nous avons envoyé un code de vérification à l&apos;adresse e-mail ci-dessus. Veuillez le saisir pour terminer la vérification.
                            </p>
                        </>
                    )}
                </div>

                <div className="space-y-4 w-11/12">
                    <p className="custom_label_text_light">Entrez le code de vérification</p>
                    <OtpInput
                        value={otpValue}
                        onChange={setOtpValue}
                        length={OTP_LENGTH}
                        onComplete={handleVerify}
                        classNames={{ wrapper: "flex gap-2 md:gap-4 max-w-[280px]" }}
                        ariaLabelPrefix="Chiffre"
                    />

                    <p className="text-fontBlack text-sm">
                        Vous n&apos;avez pas reçu le code ?{" "}
                        {resendCooldown > 0 ? (
                            <span className="text-primaryColor">Renvoyer dans {resendCooldown}s</span>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={isResendingEmail}
                                className="text-primaryColor cursor-pointer underline underline-offset-2 disabled:opacity-50"
                            >
                                {isResendingEmail ? "Envoi…" : "Renvoyer"}
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
                    Vérifier
                </Button>
                <p className="text-base text-fontBlack text-center">
                    Mot de passe retrouvé ?{" "}
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
                        Connectez-vous
                    </span>
                </p>
            </div>
        </>
    )
}

export default ForgotPasswordOtpVerify
