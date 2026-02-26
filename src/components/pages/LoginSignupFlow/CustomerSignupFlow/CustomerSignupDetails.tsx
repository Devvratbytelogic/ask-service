"use client"

import { RootState } from "@/redux/appStore"
import { openModal } from "@/redux/slices/allModalSlice"
import { Button, Checkbox, Input } from "@heroui/react"
import { useFormik } from "formik"
import Link from "next/link"
import { useMemo, useState } from "react"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5"
import { useDispatch, useSelector } from "react-redux"
import * as Yup from "yup"
import { BiArrowBack } from "react-icons/bi"

export interface CustomerSignupFormValues {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    password: string
    agreeToTerms: boolean
}

const getSignupValidationSchema = (userSignupType: string | undefined) => {
    const base = {
        firstName: Yup.string().trim().required("This field is required"),
        lastName: Yup.string().trim().required("This field is required"),
        password: Yup.string().trim().required("This field is required"),
        agreeToTerms: Yup.boolean().oneOf([true], "You must agree to the terms").required(),
    }
    if (userSignupType === "email") {
        return Yup.object({
            ...base,
            email: Yup.string().trim().email("Enter a valid email").required("This field is required"),
            phoneNumber: Yup.string(),
        })
    }
    if (userSignupType === "phoneNumber") {
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

const CustomerSignupDetails = () => {

    const { data } = useSelector((state: RootState) => state.allCommonModal)
    const dispatch = useDispatch();

    const userSignupType = data?.userData?.userSignupType as string | undefined

    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const signupValidationSchema = useMemo(
        () => getSignupValidationSchema(userSignupType),
        [userSignupType]
    )

    const initialValuesFromData = useMemo((): CustomerSignupFormValues => {
        const ud = data?.userData as Record<string, unknown> | undefined
        return {
            firstName: (ud?.firstName as string) ?? "",
            lastName: (ud?.lastName as string) ?? "",
            email: (ud?.email as string) ?? "",
            phoneNumber: (ud?.phoneNumber as string) ?? "",
            password: (ud?.password as string) ?? "",
            agreeToTerms: (ud?.agreeToTerms as boolean) ?? true,
        }
    }, [data?.userData])

    const formik = useFormik<CustomerSignupFormValues>({
        initialValues: initialValuesFromData,
        enableReinitialize: true,
        validationSchema: signupValidationSchema,
        onSubmit: (values) => {
            console.log("Signup submit", values)

            dispatch(openModal({
                componentName: 'LoginSignupIndex',
                data: {
                    componentName: 'VerifyEmailPhoneNumberWithOtp',
                    userData: {
                        ...data?.userData,
                        ...values
                    }
                },
                modalSize: 'full'
            }))
        },
    })

    const { values, touched, errors, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched } = formik


    return (
        <>
            <div className="space-y-10">
                <div className="space-y-3 xl:space-y-6 w-11/12">
                    <h1 className="header_text flex items-center gap-0.5">
                        <BiArrowBack
                            className="modal_back_icon"
                            onClick={() => dispatch(openModal({ componentName: 'LoginSignupIndex', data: { componentName: 'CustomerSignupIndex' }, modalSize: 'full' }))}
                            role="button"
                            aria-label="Go back"
                        />
                        Sign up <span className="text-darkSilver ml-1">{' ' + 'now'} </span>
                    </h1>
                    <p className="text-fontBlack text-base">
                        By creating an account, I am also consenting to receive SMS messages and emails.
                    </p>
                </div>
                <div className="space-y-4 w-11/12 xl:w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            name="firstName"
                            variant="bordered"
                            label="First name"
                            labelPlacement="outside"
                            placeholder="First name"
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
                            label="Last name"
                            labelPlacement="outside"
                            placeholder="Last name"
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

                    {userSignupType === "email" && (
                        <div className="">
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
                        </div>
                    )}
                    {userSignupType === "phoneNumber" && (
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

                    <div className="">
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
                    </div>
                </div>
            </div>

            <div className="space-y-6.25 w-11/12">
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
                            <Link href="/terms" className="text-primaryColor underline underline-offset-2">
                                Terms of use
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-primaryColor underline underline-offset-2">
                                Privacy Policy
                            </Link>
                        </span>
                    </Checkbox>
                    {touched.agreeToTerms && errors.agreeToTerms && (
                        <p className="text-danger text-tiny mt-1">{errors.agreeToTerms}</p>
                    )}
                </div>
                <div className="w-11/12">
                    <Button
                        type="submit"
                        className="btn_bg_blue btn_radius btn_padding font-medium text-sm w-full"
                        onPress={() => handleSubmit()}
                    >
                        Continue
                    </Button>
                </div>
                <p className="text-base text-fontBlack text-center flex justify-center gap-1">
                    Already have an account?{" "}
                    <p onClick={() => dispatch(openModal({ componentName: 'LoginSignupIndex', data: { componentName: 'CustomerSignInIndex' }, modalSize: 'full' }))} className="text-primaryColor cursor-pointer underline underline-offset-2">
                        Sign In
                    </p>
                </p>
            </div>
        </>
    )
}

export default CustomerSignupDetails
