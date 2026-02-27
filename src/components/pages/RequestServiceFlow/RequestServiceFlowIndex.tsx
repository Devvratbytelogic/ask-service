import { useFormik } from "formik"
import { useCallback, useState } from "react"
import ProgressStepBar from "@/components/library/ProgressStepBar"
import ContactInformation from "./ContactInformation"
import DesiredSchedule from "./DesiredSchedule"
import ReviewRequest from "./ReviewRequest"
import ServiceAndLocation from "./ServiceAndLocation"
import TaskRequired from "./TaskRequired"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/appStore"
import { closeModal, openModal } from "@/redux/slices/allModalSlice"
import { useCreateServiceRequestMutation } from "@/redux/rtkQueries/allPostApi"
import AppLoader from "@/components/common/AppLoader"
import type { IAllServiceCategoriesChildCategoriesEntity } from "@/types/services"


const baseInitialValues = {
    pincode: "",
    parentServiceId: "",
    parentServiceName: "",
    otherServiceName: "",
    serviceFrequency: "",
    childServiceId: "",
    childServiceIds: [] as string[],
    serviceStartDate: "",
    serviceTimeOfDay: "",
    serviceNote: "",
    customerFirstName: "",
    customerLastName: "",
    clientType: "",
    customerPhoneNumber: "",
    customerEmail: "",
}
export type RequestServiceFormValues = typeof baseInitialValues

const flowTypes = {
    PHONE_VERIFICATION_REQUIRED: 'PHONE_VERIFICATION_REQUIRED',
    LOGIN_REQUIRED: 'LOGIN_REQUIRED',
    REQUEST_CREATED: 'REQUEST_CREATED',
}

const LOGIN_REQUIRED_MESSAGES = {
    PHONE: "User already exists with phone. Please login.",
    EMAIL: "Email already associated with another account",
} as const

const RequestServiceFlowIndex = () => {

    const modalData = useSelector((state: RootState) => state.allCommonModal.data) as {
        initialStep?: number
        initialFormValues?: RequestServiceFormValues
        pincode?: string
        grandParentServiceId?: string
        grandParentServiceName?: string
        child_services?: unknown[]
        [key: string]: unknown
    } | undefined
    const data = modalData
    const initialStep = typeof modalData?.initialStep === "number" ? modalData.initialStep : 1

    const [getStepCount, setStepCount] = useState(initialStep)
    const [submissionRef, setSubmissionRef] = useState<string | null>(null)
    const dispatch = useDispatch()
    const [createServiceRequest, { isLoading }] = useCreateServiceRequestMutation()

    const setStepCountSafe = useCallback(
        (arg: React.SetStateAction<number>) => {
            if (typeof arg === "function") {
                setStepCount((prev) => {
                    const next = arg(prev)
                    if (next < 1) {
                        dispatch(closeModal())
                        return 1
                    }
                    return next
                })
            } else {
                if (arg < 1) {
                    dispatch(closeModal())
                    setStepCount(1)
                } else {
                    setStepCount(arg)
                }
            }
        },
        [dispatch]
    )

    const initialValues: RequestServiceFormValues =
        modalData?.initialFormValues && typeof modalData.initialFormValues === "object"
            ? { ...baseInitialValues, ...modalData.initialFormValues }
            : {
                ...baseInitialValues,
                pincode: data?.pincode ?? baseInitialValues.pincode,
            }

    const validate = (values: RequestServiceFormValues) => {
        const err: Partial<Record<keyof RequestServiceFormValues, string>> = {}
        const requiredFields: (keyof RequestServiceFormValues)[] = [
            //1st step (parentServiceId not collected in UI)
            "pincode", "parentServiceName", "serviceFrequency",
            //2nd step (childServiceIds optional)
            //3rd step (serviceNote optional)
            "serviceStartDate", "serviceTimeOfDay",
            //4th step
            "customerFirstName", "customerLastName", "clientType", "customerPhoneNumber", "customerEmail",
        ]
        requiredFields.forEach((field) => {
            if (!values[field]?.toString().trim()) {
                err[field] = "Required"
            }
        })
        if (values.parentServiceName === "other" && !values.otherServiceName?.toString().trim()) {
            err.otherServiceName = "Required"
        }
        return err
    }

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        validate,
        onSubmit: async (values) => {
            try {
                const payload = {
                    service_category: data?.grandParentServiceId ?? "",
                    child_category: values.parentServiceName === "other" ? "" : (values.parentServiceName ?? ""),
                    manual_child_category: values.parentServiceName === "other" ? (values.otherServiceName ?? "") : "",
                    frequency: values.serviceFrequency ?? "",
                    selected_options: values.childServiceIds ?? [],
                    preferred_start_date: values.serviceStartDate ?? "",
                    preferred_time_of_day: values.serviceTimeOfDay ?? "",
                    note: values.serviceNote ?? "",
                    address_1: "123, Main Road",
                    address_2: "Sector 12, Noida",
                    city: "Noida",
                    state: "Uttar Pradesh",
                    country: "India",
                    pincode: values.pincode ?? "",
                    contact_details: {
                        first_name: values.customerFirstName ?? "",
                        last_name: values.customerLastName ?? "",
                        client_type: values.clientType ?? "",
                        phone: values.customerPhoneNumber ?? "",
                        email: values.customerEmail ?? "",
                    },
                }
                const res = await createServiceRequest(payload).unwrap();
                const ref = "REQ-" + Math.random().toString(36).slice(2, 9).toUpperCase()
                setSubmissionRef(ref)
                console.log('res', res);
                if (res?.data?.flow === flowTypes.PHONE_VERIFICATION_REQUIRED) {
                    dispatch(openModal({
                        componentName: 'MobileOtpVerification',
                        data: {
                            ...values,
                            phoneNumber: values?.customerPhoneNumber,
                            parentCallBackModal: 'SubmissionSuccess',
                            codeRef: ref,
                            nextModalSize: 'lg',
                            skipToCodeEntry: true,
                        },
                        modalSize: 'lg'
                    }))
                }
                if (res?.data?.flow === flowTypes.REQUEST_CREATED) {
                    dispatch(openModal({
                        componentName: 'SubmissionSuccess',
                        data: {
                            ...values,
                            reference: ref
                        },
                        modalSize: 'lg'
                    }))
                }
                const resMessage = (res as { message?: string })?.message ?? (res as { data?: { message?: string } })?.data?.message
                const requestFlowData = {
                    ...data,
                    initialFormValues: values,
                    initialStep: 5,
                }
                if (resMessage === LOGIN_REQUIRED_MESSAGES.PHONE) {
                    dispatch(openModal({
                        componentName: 'LoginSignupIndex',
                        data: {
                            componentName: 'CustomerSignInDetails',
                            userData: {
                                signInType: 'phoneNumber',
                                phoneNumber: values.customerPhoneNumber ?? '',
                            },
                            returnToRequestFlow: true,
                            requestFlowData,
                        },
                        modalSize: 'full',
                    }))
                }
                if (resMessage === LOGIN_REQUIRED_MESSAGES.EMAIL) {
                    dispatch(openModal({
                        componentName: 'LoginSignupIndex',
                        data: {
                            componentName: 'CustomerSignInDetails',
                            userData: {
                                signInType: 'email',
                                email: values.customerEmail ?? '',
                            },
                            returnToRequestFlow: true,
                            requestFlowData,
                        },
                        modalSize: 'full',
                    }))
                }
            } catch (error: unknown) {
                console.log("error : ", error)
                const err = error as { data?: { message?: string }; error?: string }
                const isPhoneVerificationRequired =
                    err?.data?.message === "Phone verification required" ||
                    err?.error === "Phone verification required"
                if (isPhoneVerificationRequired) {
                    const ref = "REQ-" + Math.random().toString(36).slice(2, 9).toUpperCase()
                    setSubmissionRef(ref)
                    dispatch(openModal({
                        componentName: 'MobileOtpVerification',
                        data: {
                            ...values,
                            phoneNumber: values?.customerPhoneNumber,
                            parentCallBackModal: 'SubmissionSuccess',
                            codeRef: ref,
                            nextModalSize: 'lg',
                            skipToCodeEntry: true,
                        },
                        modalSize: 'lg',
                    }))
                }
                const errMessage = err?.data?.message ?? err?.error
                const requestFlowData = {
                    ...data,
                    initialFormValues: values,
                    initialStep: 5,
                }
                if (errMessage === LOGIN_REQUIRED_MESSAGES.PHONE) {
                    dispatch(openModal({
                        componentName: 'LoginSignupIndex',
                        data: {
                            componentName: 'CustomerSignInDetails',
                            userData: {
                                signInType: 'phoneNumber',
                                phoneNumber: values.customerPhoneNumber ?? '',
                            },
                            returnToRequestFlow: true,
                            requestFlowData,
                        },
                        modalSize: 'full',
                    }))
                }
                if (errMessage === LOGIN_REQUIRED_MESSAGES.EMAIL) {
                    dispatch(openModal({
                        componentName: 'LoginSignupIndex',
                        data: {
                            componentName: 'CustomerSignInDetails',
                            userData: {
                                signInType: 'email',
                                email: values.customerEmail ?? '',
                            },
                            returnToRequestFlow: true,
                            requestFlowData,
                        },
                        modalSize: 'full',
                    }))
                }
            }
        },
    })


    return (
        <>
            {isLoading && <AppLoader message="Creating service request..." />}
            <div className="space-y-5">
                <div className="space-y-2.5">
                    <p className="text-fontBlack text-sm/[20px] xl:text-lg/[22px] text-center">
                        Step <span className="text-[#10B981] font-semibold">{getStepCount}</span> of 5
                    </p>
                    <div className="w-full mx-auto px-4 py-6">
                        <ProgressStepBar currentStep={getStepCount} totalSteps={5} />
                    </div>
                </div>
                {
                    getStepCount === 1 && <ServiceAndLocation formik={formik} setStepCount={setStepCountSafe} childServices={(data?.child_services ?? []) as IAllServiceCategoriesChildCategoriesEntity[]} />
                }
                {
                    getStepCount === 2 && <TaskRequired formik={formik} setStepCount={setStepCountSafe} childCategories={(data?.child_services ?? []) as IAllServiceCategoriesChildCategoriesEntity[]} />
                }
                {
                    getStepCount === 3 && <DesiredSchedule formik={formik} setStepCount={setStepCountSafe} />
                }
                {
                    getStepCount === 4 && <ContactInformation formik={formik} setStepCount={setStepCountSafe} />
                }
                {
                    getStepCount === 5 && <ReviewRequest formik={formik} setStepCount={setStepCountSafe} />
                }

            </div>
        </>

    )
}

export default RequestServiceFlowIndex