"use client"

import ImageComponent from "@/components/library/ImageComponent"
import { useVendorRegisterMutation } from "@/redux/rtkQueries/authApi"
import { RootState } from "@/redux/appStore"
import { closeModal, openModal } from "@/redux/slices/allModalSlice"
import { setAuthAndRefetchProfile } from "@/redux/authOnSuccess"
import type { AuthResponseData } from "@/utils/authCookies"
import { loginWithGoogle } from "@/firebase/GoogleLogin"
import { addToast, Button, Checkbox, Input } from "@heroui/react"
import { useFormik } from "formik"
import Link from "next/link"
import { getTermsRoutePath, getPrivacyRoutePath } from "@/routes/routes"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5"
import * as Yup from "yup"
import { BiArrowBack } from "react-icons/bi"
import { yupRequiredEmail } from "@/utils/validation"

export interface VendorSignupFormValues {
    firstName: string
    lastName: string
    email: string
    businessName: string
    phoneNumber: string
    password: string
    agreeToTerms: boolean
}

const vendorSignupValidationSchema = Yup.object({
    firstName: Yup.string().trim().required("This field is required"),
    lastName: Yup.string().trim().required("This field is required"),
    businessName: Yup.string().trim().required("This field is required"),
    email: yupRequiredEmail("This field is required"),
    phoneNumber: Yup.string().trim(),
    password: Yup.string().trim().required("This field is required"),
    agreeToTerms: Yup.boolean().oneOf([true], "You must agree to the terms").required(),
})

const initialValues: VendorSignupFormValues = {
    firstName: "",
    lastName: "",
    businessName: "",
    email: "",
    phoneNumber: "",
    password: "",
    agreeToTerms: true,
}

const VendorSignupDetails = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const { data } = useSelector((state: RootState) => state.allCommonModal)
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const [vendorRegister, { isLoading: isRegistering }] = useVendorRegisterMutation()

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true)
        try {
            const res = await loginWithGoogle("Vendor")
            const responseData = res?.data
            if (responseData && typeof responseData === "object") {
                const authData = responseData as AuthResponseData
                if (authData.token ?? authData.access_token) {
                    setAuthAndRefetchProfile(authData, dispatch)
                    router.refresh()
                    addToast({ title: "Account created successfully", color: "success", timeout: 2000 })
                    dispatch(closeModal())
                    return
                }
            }
            addToast({ title: "Sign up completed", color: "success", timeout: 2000 })
            dispatch(closeModal())
        } catch (err: unknown) {
            const e = err as Error & { responseData?: { message?: string }; message?: string }
            const message = e.responseData?.message ?? e.message ?? "Google sign up failed"
            addToast({ title: message, color: "danger", timeout: 3000 })
        } finally {
            setIsGoogleLoading(false)
        }
    }

    const formik = useFormik<VendorSignupFormValues>({
        initialValues: {
            ...initialValues,
            ...(data?.userData as Partial<VendorSignupFormValues> | undefined),
        },
        enableReinitialize: true,
        validationSchema: vendorSignupValidationSchema,
        onSubmit: async (values) => {
            try {
                await vendorRegister({
                    first_name: values.firstName,
                    last_name: values.lastName,
                    email: values.email,
                    phone: values.phoneNumber,
                    password: values.password,
                    businessName: values.businessName,
                }).unwrap()
                addToast({
                    title: "Verification code sent",
                    description: "Check your email for Verification Code.",
                    color: "success",
                    timeout: 3000,
                })
                dispatch(
                    openModal({
                        componentName: "LoginSignupIndex",
                        data: {
                            componentName: "VendorOtpVerification",
                            userData: { ...values },
                        },
                        modalSize: "full",
                    })
                )
            } catch {
                // Error toast is shown by rtkQuerieSetup
            }
        },
    })

    const { values, touched, errors, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched } = formik

    return (
        <>
            <div className="space-y-2 w-full">
                <div className="space-y-2">
                    <h1 className="header_text flex items-center gap-0.5">
                        <BiArrowBack
                            className="modal_back_icon"
                            onClick={() => dispatch(openModal({ componentName: 'LoginSignupIndex', data: { componentName: 'SelectUserType' }, modalSize: 'full' }))}
                            role="button"
                            aria-label="Go back"
                        />
                        S'inscrire <span className="text-darkSilver ml-1"> maintenant</span>
                    </h1>
                    <p className="text-fontBlack text-base">
                        En créant un compte, j'accepte également de recevoir des SMS et des emails.
                    </p>
                </div>

                <div className="space-y-2">
                    {/* Continue with Google */}
                    {/* <Button
                        type="button"
                        className="btn_bg_white btn_radius btn_padding w-full font-medium"
                        onPress={handleGoogleLogin}
                        isLoading={isGoogleLoading}
                        isDisabled={isGoogleLoading}
                    >
                        <span className="size-4.5">
                            <ImageComponent url="/images/signup/google_icon.png" img_title="Google login icon" />
                        </span>
                        Se connecter avec Google
                    </Button> */}

                    {/* Divider */}
                    {/* <div className="flex items-center gap-3 w-full">
                        <span className="flex-1 h-px bg-borderDark" aria-hidden="true" />
                        <span className="text-darkSilver text-sm font-medium">or</span>
                        <span className="flex-1 h-px bg-borderDark" aria-hidden="true" />
                    </div> */}

                    {/* Form fields */}
                    <form id="vendor-signup-form" onSubmit={handleSubmit} className="space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                name="firstName"
                                variant="bordered"
                                label="Prénom"
                                labelPlacement="outside"
                                isRequired
                                placeholder="Prénom"
                                value={values.firstName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={!!(touched.firstName && errors.firstName)}
                                errorMessage={touched.firstName && errors.firstName}
                                classNames={{
                                    inputWrapper: ["custom_input_design_dark"],
                                    label: ["custom_label_text_light"],
                                }}
                            />
                            <Input
                                name="lastName"
                                variant="bordered"
                                label="Nom"
                                labelPlacement="outside"
                                isRequired
                                placeholder="Nom"
                                value={values.lastName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={!!(touched.lastName && errors.lastName)}
                                errorMessage={touched.lastName && errors.lastName}
                                classNames={{
                                    inputWrapper: ["custom_input_design_dark"],
                                    label: ["custom_label_text_light"],
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                name="businessName"
                                variant="bordered"
                                label="Company Name"
                                labelPlacement="outside"
                                isRequired
                                placeholder="Company Name"
                                value={values.businessName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={!!(touched.businessName && errors.businessName)}
                                errorMessage={touched.businessName && errors.businessName}
                                classNames={{
                                    inputWrapper: ["custom_input_design_dark"],
                                    label: ["custom_label_text_light"],
                                }}
                            />
                            <Input
                                name="email"
                                variant="bordered"
                                label="Email address"
                                labelPlacement="outside"
                                isRequired
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
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                            <Input
                                name="password"
                                variant="bordered"
                                label="Password"
                                isRequired
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

                            <div className="w-full relative z-100">
                                <p className="custom_label_text_light text-darkSilver font-medium mb-1.5">Phone number</p>
                                <div className="mt-1.5">
                                    <PhoneInput
                                        country="fr"
                                        countryCodeEditable={false}
                                        enableSearch
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
                        </div>
                    </form>
                </div>
            </div>

            <div className="space-y-2 w-full">
                <div className="mx-auto">
                    <Checkbox
                        name="agreeToTerms"
                        isSelected={values.agreeToTerms}
                        onValueChange={(checked) => setFieldValue("agreeToTerms", checked)}
                        onBlur={handleBlur}
                        classNames={{
                            wrapper: "before:border-borderDark",
                        }}
                    >
                        <span className="text-fontBlack text-sm">
                            By creating an account, I agree to our{" "}
                            <Link href={getTermsRoutePath()} className="text-primaryColor underline underline-offset-2">
                                Terms of use
                            </Link>{" "}
                            and{" "}
                            <Link href={getPrivacyRoutePath()} className="text-primaryColor underline underline-offset-2">
                                Privacy Policy
                            </Link>
                        </span>
                    </Checkbox>
                    {touched.agreeToTerms && errors.agreeToTerms && (
                        <p className="text-danger text-tiny mt-1">{errors.agreeToTerms}</p>
                    )}
                </div>
                <Button
                    type="submit"
                    form="vendor-signup-form"
                    className="btn_bg_blue btn_radius btn_padding font-medium text-sm w-full"
                    onPress={() => handleSubmit()}
                    isLoading={isRegistering}
                    isDisabled={isRegistering}
                >
                    Continuer
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

export default VendorSignupDetails
