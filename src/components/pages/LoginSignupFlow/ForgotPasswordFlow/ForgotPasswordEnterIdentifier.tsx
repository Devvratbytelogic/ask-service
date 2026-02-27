"use client"

import { RootState } from "@/redux/appStore"
import { openModal } from "@/redux/slices/allModalSlice"
import { useForgotPasswordMutation } from "@/redux/rtkQueries/authApi"
import { addToast, Button, Input } from "@heroui/react"
import { useFormik } from "formik"
import { useMemo } from "react"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { BiArrowBack } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import * as Yup from "yup"

interface ForgotPasswordIdentifierValues {
    email: string
    phoneNumber: string
}

const getValidationSchema = (recoveryType: string | undefined) => {
    if (recoveryType === "email") {
        return Yup.object({
            email: Yup.string().trim().email("Enter a valid email address").required("This field is required"),
            phoneNumber: Yup.string(),
        })
    }
    if (recoveryType === "phoneNumber") {
        return Yup.object({
            email: Yup.string(),
            phoneNumber: Yup.string().trim().required("This field is required"),
        })
    }
    return Yup.object({ email: Yup.string(), phoneNumber: Yup.string() })
}

const ForgotPasswordEnterIdentifier = () => {
    const { data } = useSelector((state: RootState) => state.allCommonModal)
    const dispatch = useDispatch()
    const [forgotPassword, { isLoading: isSending }] = useForgotPasswordMutation()

    const recoveryType = (data?.userData?.recoveryType as string | undefined) ?? "email"
    const isEmail = recoveryType === "email"

    const validationSchema = useMemo(() => getValidationSchema(recoveryType), [recoveryType])

    const initialValues: ForgotPasswordIdentifierValues = useMemo(() => {
        const ud = data?.userData as Record<string, unknown> | undefined
        return {
            email: ud?.email != null ? String(ud.email).trim() : "",
            phoneNumber: ud?.phoneNumber != null ? String(ud.phoneNumber) : "",
        }
    }, [data?.userData])

    const formik = useFormik<ForgotPasswordIdentifierValues>({
        initialValues,
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (submitValues) => {
            const payload = isEmail
                ? { email: submitValues.email.trim() }
                : { phone: submitValues.phoneNumber }
            try {
                await forgotPassword(payload).unwrap()
                addToast({
                    title: "Verification code sent",
                    description: isEmail ? "Check your email." : "Check your phone.",
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
                                recoveryType,
                                ...submitValues,
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
                    userData: { signInType: recoveryType },
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

    const instruction = isEmail
        ? "Enter your registered email address and we'll help you reset it securely."
        : "Enter your registered mobile number and we'll help you reset it securely."

    return (
        <>
            <div className="space-y-10">
                <div className="space-y-3 xl:space-y-6 w-11/12">
                    <h2 className="header_text flex items-center gap-0.5">
                        <BiArrowBack
                            className="modal_back_icon"
                            onClick={goBack}
                            role="button"
                            aria-label="Go back"
                        />
                        Forgot password? <span className="text-darkSilver ml-1" />
                    </h2>
                    <p className="text-fontBlack text-base">{instruction}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 w-11/12 xl:w-full">
                    {isEmail && (
                        <Input
                            name="email"
                            variant="bordered"
                            label="Email address"
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
                    )}
                    {!isEmail && (
                        <div className="w-full relative z-100">
                            <p className="custom_label_text_light mb-1.5">Mobile number</p>
                            <div className="mt-1.5">
                                <PhoneInput
                                    country="us"
                                    value={values.phoneNumber}
                                    onChange={(value) => setFieldValue("phoneNumber", value)}
                                    onBlur={() => setFieldTouched("phoneNumber", true)}
                                    inputProps={{
                                        name: "phoneNumber",
                                        "aria-label": "Mobile number",
                                    }}
                                    containerClass="!w-full"
                                    inputClass="!w-full !rounded-[12px] !border-borderDark"
                                    inputStyle={{ height: "52px" }}
                                />
                            </div>
                            {touched.phoneNumber && errors.phoneNumber && (
                                <p className="text-danger text-tiny mt-1">{errors.phoneNumber}</p>
                            )}
                        </div>
                    )}
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
