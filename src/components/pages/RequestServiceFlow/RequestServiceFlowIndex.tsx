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
import { useCreateServiceRequestMutation, useUpdateServiceRequestMutation } from "@/redux/rtkQueries/allPostApi"
import { useGetUserProfileInfoQuery, useGetServiceCategoryQuery } from "@/redux/rtkQueries/clientSideGetApis"
import { useLazyGetAddressFromPincodeQuery } from "@/redux/geo-location/geoLocation"
import { getAuthToken } from "@/utils/authCookies"
import { parseGeocodeResponse } from "@/utils/pincodeToAddress"
import AppLoader from "@/components/common/AppLoader"
import type { IAllServiceCategoriesChildCategoriesEntity } from "@/types/services"
import { validateEmail } from "@/utils/validation"

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
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    serviceNote: "",
    customerFirstName: "",
    customerLastName: "",
    clientType: "",
    customerPhoneNumber: "",
    customerEmail: "",
}
export type RequestServiceFormValues = typeof baseInitialValues

export type ScheduleVisibility = {
    is_preferred_date_visible: boolean
    is_preferred_time_visible: boolean
    is_start_date_visible: boolean
    is_start_time_visible: boolean
    is_end_date_visible: boolean
    is_end_time_visible: boolean
}

const flowTypes = {
    PHONE_VERIFICATION_REQUIRED: 'PHONE_VERIFICATION_REQUIRED',
    EMAIL_VERIFICATION_REQUIRED: 'EMAIL_VERIFICATION_REQUIRED',
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
        isEditMode?: boolean
        request?: { _id: string; [key: string]: unknown }
        [key: string]: unknown
    } | undefined
    const data = modalData
    const initialStep = typeof modalData?.initialStep === "number" ? modalData.initialStep : 1

    const [getStepCount, setStepCount] = useState(initialStep)
    const [submissionRef, setSubmissionRef] = useState<string | null>(null)
    const dispatch = useDispatch()
    const [fetchAddressFromPincode] = useLazyGetAddressFromPincodeQuery()
    const [createServiceRequest, { isLoading: isCreateLoading }] = useCreateServiceRequestMutation()
    const [updateServiceRequest, { isLoading: isUpdateLoading }] = useUpdateServiceRequestMutation()
    const isLoading = isCreateLoading || isUpdateLoading
    const isClientAuthenticated = useSelector((state: RootState) => state.auth.isClientAuthenticated)
    const isAuthenticated = !!getAuthToken() || isClientAuthenticated
    const { data: profileResponse } = useGetUserProfileInfoQuery(undefined, {
        skip: !isAuthenticated,
    })
    const profile = profileResponse?.data
    const { data: serviceCategoryResponse, isLoading: isServiceCategoryLoading } = useGetServiceCategoryQuery(
        { id: data?.grandParentServiceId ?? "" },
        { skip: !data?.grandParentServiceId }
    )
    const isFrequencyVisible = serviceCategoryResponse?.data?.is_frequency_visible ?? true
    const isTasksRequiredVisible = serviceCategoryResponse?.data?.is_tasks_required_visible ?? true
    const scheduleVisibility: ScheduleVisibility = {
        is_preferred_date_visible: serviceCategoryResponse?.data?.is_preferred_date_visible ?? true,
        is_preferred_time_visible: serviceCategoryResponse?.data?.is_preferred_time_visible ?? true,
        is_start_date_visible: serviceCategoryResponse?.data?.is_start_date_visible ?? false,
        is_start_time_visible: serviceCategoryResponse?.data?.is_start_time_visible ?? false,
        is_end_date_visible: serviceCategoryResponse?.data?.is_end_date_visible ?? false,
        is_end_time_visible: serviceCategoryResponse?.data?.is_end_time_visible ?? false,
    }

    const totalSteps = isTasksRequiredVisible ? 5 : 4
    const displayStep = isTasksRequiredVisible ? getStepCount : (getStepCount >= 3 ? getStepCount - 1 : getStepCount)

    const setStepCountSafe = useCallback(
        (arg: React.SetStateAction<number>) => {
            if (typeof arg === "function") {
                setStepCount((prev) => {
                    let next = arg(prev)
                    if (next < 1) {
                        dispatch(closeModal())
                        return 1
                    }
                    if (!isTasksRequiredVisible && next === 2) {
                        next = prev < 2 ? 3 : 1
                    }
                    return next
                })
            } else {
                if (arg < 1) {
                    dispatch(closeModal())
                    setStepCount(1)
                } else {
                    setStepCount(!isTasksRequiredVisible && arg === 2 ? 3 : arg)
                }
            }
        },
        [dispatch, isTasksRequiredVisible]
    )

    const profilePrefill: Partial<RequestServiceFormValues> = profile
        ? {
            customerFirstName: profile.first_name ?? "",
            customerLastName: profile.last_name ?? "",
            customerEmail: profile.email ?? "",
            customerPhoneNumber: profile.phone ?? "",
        }
        : {}

    const initialValues: RequestServiceFormValues = {
        ...baseInitialValues,
        pincode: data?.pincode ?? baseInitialValues.pincode,
        ...profilePrefill,
        ...(modalData?.initialFormValues && typeof modalData.initialFormValues === "object"
            ? modalData.initialFormValues
            : {}),
    }

    const validate = (values: RequestServiceFormValues) => {
        const err: Partial<Record<keyof RequestServiceFormValues, string>> = {}
        const scheduleRequiredFields: (keyof RequestServiceFormValues)[] = [
            ...(scheduleVisibility.is_preferred_date_visible ? (["serviceStartDate"] as const) : []),
            ...(scheduleVisibility.is_preferred_time_visible ? (["serviceTimeOfDay"] as const) : []),
            ...(scheduleVisibility.is_start_date_visible ? (["start_date"] as const) : []),
            ...(scheduleVisibility.is_start_time_visible ? (["start_time"] as const) : []),
            ...(scheduleVisibility.is_end_date_visible ? (["end_date"] as const) : []),
            ...(scheduleVisibility.is_end_time_visible ? (["end_time"] as const) : []),
        ]
        const requiredFields: (keyof RequestServiceFormValues)[] = [
            "pincode", "parentServiceName",
            ...(isFrequencyVisible ? (["serviceFrequency"] as const) : []),
            ...scheduleRequiredFields,
            "customerFirstName", "customerLastName", "clientType", "customerPhoneNumber", "customerEmail",
        ]
        requiredFields.forEach((field) => {
            if (!values[field]?.toString().trim()) {
                err[field] = "Requis"
            }
        })
        if (values.customerEmail?.toString().trim() && !validateEmail(values.customerEmail.trim())) {
            err.customerEmail = "Veuillez entrer une adresse email valide"
        }
        if (values.parentServiceName === "other" && !values.otherServiceName?.toString().trim()) {
            err.otherServiceName = "Requis"
        }
        return err
    }

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        validate,
        onSubmit: async (values) => {
            try {
                let addressData = { address_1: "", address_2: "", city: "", state: "", country: "" }
                if (values.pincode?.trim()) {
                    try {
                        const geocodeResult = await fetchAddressFromPincode(values.pincode.trim()).unwrap()
                        addressData = parseGeocodeResponse(geocodeResult)
                    } catch {
                        // Fallback to empty if geocoding fails
                    }
                }
                const payload = {
                    service_category: data?.grandParentServiceId ?? "",
                    child_category: values.parentServiceName === "other" ? "" : (values.parentServiceName ?? ""),
                    manual_child_category: values.parentServiceName === "other" ? (values.otherServiceName ?? "") : "",
                    frequency: values.serviceFrequency ?? "",
                    selected_options: values.childServiceIds ?? [],
                    preferred_start_date: values.serviceStartDate ?? "",
                    preferred_time_of_day: values.serviceTimeOfDay ?? "",
                    start_date: values.start_date ?? "",
                    start_time: values.start_time ?? "",
                    end_date: values.end_date ?? "",
                    end_time: values.end_time ?? "",
                    note: values.serviceNote ?? "",
                    address_1: addressData.address_1,
                    address_2: addressData.address_2,
                    city: addressData.city,
                    state: addressData.state,
                    country: addressData.country,
                    pincode: values.pincode ?? "",
                    contact_details: {
                        first_name: values.customerFirstName ?? "",
                        last_name: values.customerLastName ?? "",
                        client_type: values.clientType ?? "",
                        phone: values.customerPhoneNumber ?? "",
                        email: values.customerEmail ?? "",
                    },
                }

                const requestId = data?.request?._id
                if (data?.isEditMode && requestId) {
                    await updateServiceRequest({ id: requestId, value: payload }).unwrap()
                    dispatch(closeModal())
                    return
                }

                const res = await createServiceRequest(payload).unwrap();
                console.log('res', res);
                const ref = res?.data?.request?.reference_no;
                setSubmissionRef(ref)
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
                if (res?.data?.flow === flowTypes.EMAIL_VERIFICATION_REQUIRED && values.customerEmail?.trim()) {
                    const requestFlowData = {
                        ...data,
                        initialFormValues: values,
                        initialStep: 5,
                    }
                    dispatch(openModal({
                        componentName: 'VerifyEmailOtpModal',
                        data: {
                            email: values.customerEmail.trim(),
                            returnToRequestFlow: true,
                            requestFlowData,
                        },
                        modalSize: 'md',
                        modalPadding: 'px-6 py-8',
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
                const err = error as { data?: { message?: string; flow?: string }; error?: string }
                const isPhoneVerificationRequired =
                    err?.data?.message === "Phone verification required" ||
                    err?.error === "Phone verification required"
                const isEmailVerificationRequired =
                    err?.data?.flow === flowTypes.EMAIL_VERIFICATION_REQUIRED ||
                    err?.data?.message === "Email verification required" ||
                    err?.error === "Email verification required"
                if (isEmailVerificationRequired && values.customerEmail?.trim()) {
                    const requestFlowData = {
                        ...data,
                        initialFormValues: values,
                        initialStep: 5,
                    }
                    dispatch(openModal({
                        componentName: 'VerifyEmailOtpModal',
                        data: {
                            email: values.customerEmail.trim(),
                            returnToRequestFlow: true,
                            requestFlowData,
                        },
                        modalSize: 'md',
                        modalPadding: 'px-6 py-8',
                    }))
                }
                if (isPhoneVerificationRequired) {
                    const ref = "REQ-" + Math.random().toString(36).slice(2, 9).toUpperCase()
                    setSubmissionRef(ref)
                    dispatch(openModal({
                        componentName: 'MobileOtpVerification',
                        data: {
                            ...data,
                            ...values,
                            initialStep: 5,
                            initialFormValues: values,
                            phoneNumber: values?.customerPhoneNumber,
                            parentCallBackModal: 'RequestServiceFlowIndex',
                            codeRef: ref,
                            nextModalSize: 'lg',
                            skipToCodeEntry: true,
                        },
                        modalSize: 'lg'
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
            {isLoading && <AppLoader message={data?.isEditMode ? "Mise à jour de la demande en cours..." : "Création de la demande en cours..."} />}
            <div className="space-y-5">
                <div className="space-y-2.5">
                    <p className="text-fontBlack text-sm/[20px] xl:text-lg/[22px] text-center">
                        Étape <span className="text-[#10B981] font-semibold">{displayStep}</span> sur {totalSteps}
                    </p>
                    <div className="w-full mx-auto px-4 py-6">
                        <ProgressStepBar currentStep={displayStep} totalSteps={totalSteps} />
                    </div>
                </div>
                {
                    getStepCount === 1 && <ServiceAndLocation isServiceCategoryLoading={isServiceCategoryLoading} isFrequencyVisible={isFrequencyVisible} grandParentServiceName={data?.grandParentServiceName} formik={formik} setStepCount={setStepCountSafe} childServices={(data?.child_services ?? []) as IAllServiceCategoriesChildCategoriesEntity[]} />
                }
                {
                    getStepCount === 2 && isTasksRequiredVisible && <TaskRequired formik={formik} setStepCount={setStepCountSafe} childCategories={(data?.child_services ?? []) as IAllServiceCategoriesChildCategoriesEntity[]} isTasksRequiredVisible={isTasksRequiredVisible} />
                }
                {
                    getStepCount === 3 && <DesiredSchedule formik={formik} setStepCount={setStepCountSafe} scheduleVisibility={scheduleVisibility} />
                }
                {
                    getStepCount === 4 && <ContactInformation formik={formik} setStepCount={setStepCountSafe} readOnly={!!data?.isEditMode} />
                }
                {
                    getStepCount === 5 && <ReviewRequest formik={formik} setStepCount={setStepCountSafe} isTasksRequiredVisible={isTasksRequiredVisible} childServices={(data?.child_services ?? []) as IAllServiceCategoriesChildCategoriesEntity[]} grandParentServiceName={data?.grandParentServiceName} />
                }

            </div>
        </>

    )
}

export default RequestServiceFlowIndex