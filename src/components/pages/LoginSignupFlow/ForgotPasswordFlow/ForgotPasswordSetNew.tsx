"use client"

import { RootState } from "@/redux/appStore"
import { openModal } from "@/redux/slices/allModalSlice"
import { useNewPasswordMutation, useVendorNewPasswordMutation } from "@/redux/rtkQueries/authApi"
import { addToast, Button, Input } from "@heroui/react"
import { useFormik } from "formik"
import { useState } from "react"
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5"
import { useDispatch, useSelector } from "react-redux"
import * as Yup from "yup"

interface ForgotPasswordSetNewValues {
    password: string
    confirmPassword: string
}

const validationSchema = Yup.object({
    password: Yup.string()
        .trim()
        .min(8, "Your new password must have at least 8 characters to keep your account secure.")
        .required("This field is required"),
    confirmPassword: Yup.string()
        .trim()
        .oneOf([Yup.ref("password")], "Passwords do not match.")
        .required("This field is required"),
})

const ForgotPasswordSetNew = () => {
    const { data } = useSelector((state: RootState) => state.allCommonModal)
    const dispatch = useDispatch()
    const userData = data?.userData as Record<string, unknown> | undefined
    const isVendor = Boolean(userData?.isVendor)
    const returnToRequestFlow = (data as { returnToRequestFlow?: boolean })?.returnToRequestFlow
    const requestFlowData = (data as { requestFlowData?: unknown })?.requestFlowData

    const [newPassword, { isLoading: isSubmittingUser }] = useNewPasswordMutation()
    const [vendorNewPassword, { isLoading: isSubmittingVendor }] = useVendorNewPasswordMutation()

    const isSubmitting = isSubmittingUser || isSubmittingVendor
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [isConfirmVisible, setIsConfirmVisible] = useState(false)

    const formik = useFormik<ForgotPasswordSetNewValues>({
        initialValues: { password: "", confirmPassword: "" },
        validationSchema,
        onSubmit: async (values) => {
            const payload = { password: values.password, confirm_password: values.confirmPassword }
            try {
                if (isVendor) {
                    await vendorNewPassword(payload).unwrap()
                } else {
                    await newPassword(payload).unwrap()
                }
                addToast({
                    title: "Password updated",
                    description: "You can sign in with your new password.",
                    color: "success",
                    timeout: 3000,
                })
                openSignIn()
            } catch {
                // Error toast from rtkQuerieSetup
            }
        },
    })

    const { values, touched, errors, handleChange, handleBlur, handleSubmit } = formik

    const openSignIn = () => {
        if (returnToRequestFlow && requestFlowData) {
            dispatch(
                openModal({
                    componentName: "LoginSignupIndex",
                    data: {
                        componentName: "CustomerSignInDetails",
                        userData: {
                            signInType: (userData?.recoveryType as string) ?? "email",
                            email: userData?.email,
                            phoneNumber: userData?.phoneNumber,
                        },
                        returnToRequestFlow: true,
                        requestFlowData,
                    },
                    modalSize: "full",
                })
            )
        } else {
            dispatch(
                openModal({
                    componentName: "LoginSignupIndex",
                    data: { componentName: "CustomerSignInIndex" },
                    modalSize: "full",
                })
            )
        }
    }

    return (
        <>
            <div className="space-y-10">
                <div className="space-y-3 xl:space-y-6 w-11/12">
                    <h1 className="header_text">
                        Set new password <span className="text-darkSilver" />
                    </h1>
                    <p className="text-fontBlack text-base">
                        Your new password must have at least 8 characters to keep your account secure.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 w-11/12 xl:w-full">
                    <Input
                        name="password"
                        variant="bordered"
                        label="Create password"
                        labelPlacement="outside"
                        placeholder="Create password"
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
                    <Input
                        name="confirmPassword"
                        variant="bordered"
                        label="Confirm password"
                        labelPlacement="outside"
                        placeholder="Confirm password"
                        type={isConfirmVisible ? "text" : "password"}
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!(touched.confirmPassword && errors.confirmPassword)}
                        errorMessage={touched.confirmPassword && errors.confirmPassword}
                        endContent={
                            <button
                                type="button"
                                className="focus:outline-none text-lg text-placeHolderText"
                                onClick={() => setIsConfirmVisible((prev) => !prev)}
                                aria-label={isConfirmVisible ? "Hide password" : "Show password"}
                            >
                                {isConfirmVisible ? <IoEyeOffOutline /> : <IoEyeOutline />}
                            </button>
                        }
                        classNames={{
                            inputWrapper: ["custom_input_design_dark"],
                            label: ["custom_label_text_light"],
                        }}
                    />
                    <Button
                        type="submit"
                        className="btn_bg_blue btn_radius btn_padding font-medium text-sm w-full"
                        onPress={() => handleSubmit()}
                        isLoading={isSubmitting}
                        isDisabled={isSubmitting}
                    >
                        Reset password
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

export default ForgotPasswordSetNew
