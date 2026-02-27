"use client"

import { RootState } from "@/redux/appStore"
import { closeModal, openModal } from "@/redux/slices/allModalSlice"
import { useLoginMutation, useLoginPhoneEmailMutation } from "@/redux/rtkQueries/authApi"
import { setAuthCookies, type AuthResponseData } from "@/utils/authCookies"
import { addToast, Button, Checkbox, Input } from "@heroui/react"
import { useFormik } from "formik"
import { useMemo, useState } from "react"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5"
import { useDispatch, useSelector } from "react-redux"
import * as Yup from "yup"
import { BiArrowBack } from "react-icons/bi"

export interface CustomerSignInFormValues {
    email: string
    phoneNumber: string
    password: string
    rememberMe: boolean
}

const getSignInValidationSchema = (signInType: string | undefined) => {
    const base = {
        password: Yup.string().trim().required("This field is required"),
        rememberMe: Yup.boolean(),
    }
    if (signInType === "email") {
        return Yup.object({
            ...base,
            email: Yup.string().trim().email("Enter a valid email").required("This field is required"),
            phoneNumber: Yup.string(),
        })
    }
    if (signInType === "phoneNumber") {
        return Yup.object({
            ...base,
            email: Yup.string(),
            phoneNumber: Yup.string().trim().required("This field is required"),
        })
    }
    return Yup.object({
        ...base,
        email: Yup.string(),
        phoneNumber: Yup.string(),
    })
}

const CustomerSignInDetails = () => {
    const { data } = useSelector((state: RootState) => state.allCommonModal)
    const dispatch = useDispatch()
    const signInType = data?.userData?.signInType as string | undefined

    const [login, { isLoading: isLoggingIn }] = useLoginMutation()
    const [loginPhoneEmail, { isLoading: isSendingOtp }] = useLoginPhoneEmailMutation()

    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [showOtpView, setShowOtpView] = useState(false)

    const signInValidationSchema = useMemo(
        () => getSignInValidationSchema(signInType),
        [signInType]
    )

    const initialValuesFromData = useMemo((): CustomerSignInFormValues => {
        const ud = data?.userData as Record<string, unknown> | undefined
        return {
            email: (ud?.email as string) ?? "",
            phoneNumber: (ud?.phoneNumber as string) ?? "",
            password: (ud?.password as string) ?? "",
            rememberMe: (ud?.rememberMe as boolean) ?? false,
        }
    }, [data?.userData])

    const formik = useFormik<CustomerSignInFormValues>({
        initialValues: initialValuesFromData,
        enableReinitialize: true,
        validationSchema: signInValidationSchema,
        onSubmit: async (values) => {
            const identifier = signInType === "email" ? values.email.trim() : values.phoneNumber
            if (!identifier || !values.password) return
            try {
                const res = await login({ identifier, password: values.password }).unwrap()
                const responseData = (res as { data?: unknown })?.data
                console.log("responseData", responseData)
                if (responseData && typeof responseData === 'object') {
                    setAuthCookies(responseData as AuthResponseData)
                }
                addToast({ title: "Signed in successfully", color: "success", timeout: 2000 })
                // dispatch(closeModal())
            } catch {
                // Error toast from rtkQuerieSetup
            }
        },
    })

    const { values, touched, errors, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched } = formik

    const goToSignInIndex = () => {
        if (showOtpView && signInType === "email") {
            setShowOtpView(false)
        } else {
            dispatch(openModal({ componentName: 'LoginSignupIndex', data: { componentName: 'CustomerSignInIndex' }, modalSize: 'full' }))
        }
    }

    const goToSignup = () => {
        dispatch(openModal({ componentName: 'LoginSignupIndex', data: { componentName: 'SelectUserType' }, modalSize: 'full' }))
    }

    const handleSendOtp = () => {
        setShowOtpView(true)
    }

    const handleContinueWithEmailOtp = async () => {
        setFieldTouched("email", true)
        if (errors.email || !values.email?.trim()) return
        try {
            await loginPhoneEmail({ email: values.email.trim() }).unwrap()
            addToast({ title: "Verification code sent", description: "Check your email.", color: "success", timeout: 2000 })
            dispatch(
                openModal({
                    componentName: "VerifyEmailOtpModal",
                    data: { email: values.email.trim() },
                    modalSize: "md",
                    modalPadding: "px-6 py-8",
                })
            )
        } catch {
            // Error toast from rtkQuerieSetup
        }
    }

    return (
        <>
            <div className="space-y-10">
                <div className="space-y-3 xl:space-y-6 w-11/12">
                    <h1 className="header_text flex items-center gap-0.5">
                        <BiArrowBack
                            className="modal_back_icon"
                            onClick={goToSignInIndex}
                            role="button"
                            aria-label="Go back"
                        />
                        Sign In <span className="text-darkSilver ml-1">now</span>
                    </h1>
                    <p className="text-fontBlack text-base">
                        Sign in to access Ask Service, manage your requests, and connect with the right support quickly and securely.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 w-11/12 xl:w-full">
                    {/* OTP view: email only + Continue + Sign in with password (matches attached image) */}
                    {showOtpView && signInType === "email" ? (
                        <>
                            <Input
                                name="email"
                                variant="bordered"
                                label="Email address"
                                labelPlacement="outside"
                                placeholder="example@xyz.com"
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
                            <div className="flex items-center gap-3 w-full">
                                <span className="flex-1 h-px bg-borderDark" aria-hidden="true" />
                                <span className="text-darkSilver text-sm font-medium">or</span>
                                <span className="flex-1 h-px bg-borderDark" aria-hidden="true" />
                            </div>
                            <Button
                                type="button"
                                className="btn_radius btn_bg_whiteSilver_border w-full"
                                onPress={() => setShowOtpView(false)}
                            >
                                Sign in with password
                            </Button>
                            <Button
                                type="button"
                                className="btn_bg_blue btn_radius btn_padding font-medium text-sm w-full"
                                isLoading={isSendingOtp}
                                isDisabled={isSendingOtp}
                                onPress={handleContinueWithEmailOtp}
                            >
                                Continue
                            </Button>
                        </>
                    ) : (
                        <>
                            {signInType === "email" && (
                                <Input
                                    name="email"
                                    variant="bordered"
                                    label="Email"
                                    labelPlacement="outside"
                                    placeholder="example@my.com"
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
                            {signInType === "phoneNumber" && (
                                <div className="w-full relative z-100">
                                    <p className="custom_label_text_light mb-1.5">Phone number</p>
                                    <div className="mt-1.5">
                                        <PhoneInput
                                            country="us"
                                            value={values.phoneNumber}
                                            onChange={(value) => setFieldValue("phoneNumber", value)}
                                            onBlur={() => setFieldTouched("phoneNumber", true)}
                                            inputProps={{
                                                name: "phoneNumber",
                                                "aria-label": "Phone number",
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

                            <Input
                                name="password"
                                variant="bordered"
                                label="Password"
                                labelPlacement="outside"
                                placeholder="Password"
                                type={isPasswordVisible ? "text" : "password"}
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={!!(touched.password && errors.password)}
                                errorMessage={touched.password && errors.password}
                                endContent={
                                    <button
                                        type="button"
                                        className="focus:outline-none text-lg text-placeHolderText"
                                        onClick={() => setIsPasswordVisible((prev) => !prev)}
                                        aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                                    >
                                        {isPasswordVisible ? <IoEyeOffOutline /> : <IoEyeOutline />}
                                    </button>
                                }
                                classNames={{
                                    inputWrapper: ["custom_input_design_dark"],
                                    label: ["custom_label_text_light"],
                                }}
                            />

                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <Checkbox
                                    name="rememberMe"
                                    isSelected={values.rememberMe}
                                    onValueChange={(checked) => setFieldValue("rememberMe", checked)}
                                    onBlur={handleBlur}
                                    classNames={{ wrapper: "before:border-borderDark" }}
                                >
                                    <span className="text-fontBlack text-sm">Remember me</span>
                                </Checkbox>
                                <button
                                    type="button"
                                    onClick={() =>
                                        dispatch(
                                            openModal({
                                                componentName: "LoginSignupIndex",
                                                data: {
                                                    componentName: "ForgotPasswordEnterIdentifier",
                                                    userData: { recoveryType: signInType === "phoneNumber" ? "phoneNumber" : "email" },
                                                },
                                                modalSize: "full",
                                            })
                                        )
                                    }
                                    className="text-primaryColor text-sm underline underline-offset-2 cursor-pointer"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            {signInType === "email" && (
                                <Button
                                    type="button"
                                    className="btn_radius btn_bg_whiteSilver_border w-full"
                                    onPress={handleSendOtp}
                                >
                                    Send an OTP on your email
                                </Button>
                            )}

                            <Button
                                type="submit"
                                className="btn_bg_blue btn_radius btn_padding font-medium text-sm w-full"
                                onPress={() => handleSubmit()}
                                isLoading={isLoggingIn}
                                isDisabled={isLoggingIn}
                            >
                                Sign In
                            </Button>
                        </>
                    )}
                </form>
            </div>
            <div className="w-11/12 space-y-6.25">
                <p className="text-base text-fontBlack text-center">
                    Don&apos;t have an account?{" "}
                    <span className="text-primaryColor cursor-pointer underline underline-offset-2" onClick={goToSignup} onKeyDown={(e) => e.key === 'Enter' && goToSignup()} role="button" tabIndex={0}>Sign up</span>
                </p>
            </div>
        </>
    )
}

export default CustomerSignInDetails
