"use client"

import { RootState } from "@/redux/appStore"
import { openModal } from "@/redux/slices/allModalSlice"
import { useForgotPasswordMutation } from "@/redux/rtkQueries/authApi"
import { addToast, Button, Input } from "@heroui/react"
import { useFormik } from "formik"
import { useMemo } from "react"
import { BiArrowBack } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import * as Yup from "yup"
import { yupRequiredEmail } from "@/utils/validation"

interface ForgotPasswordIdentifierValues {
    email: string
}

const forgotPasswordEmailSchema = Yup.object({
    email: yupRequiredEmail("Ce champ est obligatoire"),
})

const ForgotPasswordEnterIdentifier = () => {
    const { data } = useSelector((state: RootState) => state.allCommonModal)
    const dispatch = useDispatch()
    const [forgotPassword, { isLoading: isSending }] = useForgotPasswordMutation()

    const initialValues: ForgotPasswordIdentifierValues = useMemo(() => {
        const ud = data?.userData as Record<string, unknown> | undefined
        return {
            email: ud?.email != null ? String(ud.email).trim() : "",
        }
    }, [data?.userData])

    const formik = useFormik<ForgotPasswordIdentifierValues>({
        initialValues,
        enableReinitialize: true,
        validationSchema: forgotPasswordEmailSchema,
        onSubmit: async (submitValues) => {
            try {
                await forgotPassword({ email: submitValues.email.trim() }).unwrap()
                addToast({
                    title: "Verification code sent",
                    description: "Check your email.",
                    color: "success",
                    timeout: 2000,
                })
                dispatch(
                    openModal({
                        componentName: "LoginSignupIndex",
                        data: {
                            componentName: "ForgotPasswordOtpVerify",
                            userData: {
                                ...data?.userData,
                                recoveryType: "email",
                                email: submitValues.email.trim(),
                            },
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
        },
    })

    const { values, touched, errors, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched } = formik

    const returnToRequestFlow = (data as { returnToRequestFlow?: boolean })?.returnToRequestFlow
    const requestFlowData = (data as { requestFlowData?: unknown })?.requestFlowData

    const goBack = () => {
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

    const openSignIn = () => {
        dispatch(
            openModal({
                componentName: "LoginSignupIndex",
                data: {
                    componentName: "CustomerSignInIndex",
                    ...(returnToRequestFlow && requestFlowData
                        ? { returnToRequestFlow: true, requestFlowData }
                        : {}),
                },
                modalSize: "full",
            })
        )
    }

    return (
        <>
            <div className="space-y-10">
                <div className="space-y-3 xl:space-y-6 w-11/12">
                    <h2 className="header_text flex flex-wrap items-center gap-0.5">
                        <BiArrowBack
                            className="modal_back_icon"
                            onClick={goBack}
                            role="button"
                            aria-label="Go back"
                        />
                        Mot de passe oublié? <span className="text-darkSilver ml-1" />
                    </h2>
                    <p className="text-fontBlack text-base">
                        Enter your registered email address and we&apos;ll help you reset it securely.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 w-11/12 xl:w-full">
                    <Input
                        name="email"
                        variant="bordered"
                        label="Email"
                        labelPlacement="outside"
                        placeholder="name@example.com"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!(touched.email && errors.email)}
                        errorMessage={touched.email && errors.email}
                        classNames={{
                            inputWrapper: ["custom_input_design_dark"],
                            label: ["custom_label_text_light"],
                        }}
                    />
                    <Button
                        type="submit"
                        className="btn_bg_blue btn_radius btn_padding font-medium text-sm w-full"
                        onPress={() => handleSubmit()}
                        isLoading={isSending}
                        isDisabled={isSending}
                    >
                        Next
                    </Button>
                </form>
            </div>
            <div className="w-11/12 space-y-6.25">
                <p className="text-base text-fontBlack text-center">
                    Remembered your password?{" "}
                    <span
                        className="text-primaryColor cursor-pointer underline underline-offset-2"
                        onClick={openSignIn}
                        onKeyDown={(e) => e.key === "Enter" && openSignIn()}
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

export default ForgotPasswordEnterIdentifier
