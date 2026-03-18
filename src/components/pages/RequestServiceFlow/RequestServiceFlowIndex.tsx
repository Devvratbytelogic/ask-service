import { useFormik } from "formik"
import { useCallback, useMemo, useState } from "react"
import ProgressStepBar from "@/components/library/ProgressStepBar"
import ContactInformation from "./ContactInformation"
import DynamicQuestionsStep from "./DynamicQuestionsStep"
import ReviewRequest from "./ReviewRequest"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/appStore"
import { closeModal, openModal } from "@/redux/slices/allModalSlice"
import { useCreateServiceRequestMutation, useUpdateServiceRequestMutation } from "@/redux/rtkQueries/allPostApi"
import { useGetUserProfileInfoQuery, useGetServicesQuetionsQuery } from "@/redux/rtkQueries/clientSideGetApis"
import { useLazyGetAddressFromPincodeQuery } from "@/redux/geo-location/geoLocation"
import { getAuthToken } from "@/utils/authCookies"
import { parseGeocodeResponse } from "@/utils/pincodeToAddress"
import AppLoader from "@/components/common/AppLoader"
import type { ListEntity } from "@/types/serviceQuestions"
import type { ICreateServiceRequestPayload } from "@/types/serviceQuestions"
import { validateEmail } from "@/utils/validation"

const baseInitialValues = {
    pincode: "",
    parentServiceId: "",
    parentServiceName: "",
    otherServiceName: "",
    childServiceId: "",
    childServiceIds: [] as string[],
    serviceNote: "",
    customerFirstName: "",
    customerLastName: "",
    clientType: "",
    customerPhoneNumber: "",
    customerEmail: "",
    dynamicAnswers: {} as Record<string, string | string[]>,
}
export type RequestServiceFormValues = typeof baseInitialValues

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

/** Build empty dynamicAnswers from questions for form init */
function buildEmptyDynamicAnswers(questions: ListEntity[]): Record<string, string | string[]> {
    const out: Record<string, string | string[]> = {}
    questions.forEach((q) => {
        out[q._id] = q.is_multiple || q.type === "checkbox" ? [] : ""
    })
    return out
}

/** Clone dynamicAnswers so form state is never frozen (e.g. from Redux during edit). */
function cloneDynamicAnswers(raw: Record<string, string | string[]> | null | undefined): Record<string, string | string[]> {
    if (!raw || typeof raw !== "object") return {}
    const out: Record<string, string | string[]> = {}
    Object.keys(raw).forEach((key) => {
        const v = raw[key]
        out[key] = Array.isArray(v) ? [...v] : (v ?? "")
    })
    return out
}

/** Build dynamic_answers payload from questions + form dynamicAnswers */
function buildDynamicAnswersPayload(
    questions: ListEntity[],
    dynamicAnswers: Record<string, string | string[]>
): ICreateServiceRequestPayload["dynamic_answers"] {
    return questions.map((q) => {
        const raw = dynamicAnswers[q._id]
        let value: string
        if (Array.isArray(raw)) {
            value = raw.filter(Boolean).join(",")
        } else {
            value = (raw ?? "").toString().trim()
        }
        return {
            question_id: q._id,
            key: q.key,
            label: q.label,
            type: q.type,
            value,
        }
    })
}

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
    const categoryId = data?.grandParentServiceId ?? ""
    const { data: questionsResponse, isLoading: isQuestionsLoading } = useGetServicesQuetionsQuery(
        { id: categoryId },
        { skip: !categoryId }
    )
    const questionsList = useMemo(() => questionsResponse?.data?.list ?? [], [questionsResponse?.data?.list])
    const questionSteps = useMemo(() => {
        const steps = Array.from(new Set(questionsList.map((q) => q.step))).sort((a, b) => a - b)
        return steps
    }, [questionsList])
    const questionsByStep = useMemo(() => {
        const map: Record<number, ListEntity[]> = {}
        questionSteps.forEach((step) => {
            map[step] = questionsList.filter((q) => q.step === step)
        })
        return map
    }, [questionsList, questionSteps])

    const totalSteps = questionSteps.length + 1 + 1 // dynamic steps + Contact + Review
    const contactStepIndex = questionSteps.length + 1
    const reviewStepIndex = contactStepIndex + 1
    const displayStep = getStepCount

    const setStepCountSafe = useCallback(
        (arg: React.SetStateAction<number>) => {
            if (typeof arg === "function") {
                setStepCount((prev) => {
                    const next = arg(prev)
                    if (next < 1) {
                        dispatch(closeModal())
                        return 1
                    }
                    if (next > totalSteps) return totalSteps
                    return next
                })
            } else {
                if (arg < 1) {
                    dispatch(closeModal())
                    setStepCount(1)
                } else {
                    setStepCount(Math.min(arg, totalSteps))
                }
            }
        },
        [dispatch, totalSteps]
    )

    const profilePrefill: Partial<RequestServiceFormValues> = profile
        ? {
            customerFirstName: profile.first_name ?? "",
            customerLastName: profile.last_name ?? "",
            customerEmail: profile.email ?? "",
            customerPhoneNumber: profile.phone ?? "",
        }
        : {}

    const initialDynamicAnswers = useMemo(
        () => buildEmptyDynamicAnswers(questionsList),
        [questionsList]
    )

    const initialValues: RequestServiceFormValues = useMemo(() => {
        const saved = modalData?.initialFormValues && typeof modalData.initialFormValues === "object" ? modalData.initialFormValues : null
        const { dynamicAnswers: savedDynamic, ...restSaved } = saved ?? {}
        return {
            ...baseInitialValues,
            pincode: data?.pincode ?? baseInitialValues.pincode,
            ...profilePrefill,
            ...restSaved,
            dynamicAnswers: {
                ...initialDynamicAnswers,
                ...cloneDynamicAnswers(savedDynamic),
            },
        }
    }, [data?.pincode, profilePrefill, initialDynamicAnswers, modalData?.initialFormValues])

    type FormErrors = Partial<Record<Exclude<keyof RequestServiceFormValues, "dynamicAnswers">, string>> & { dynamicAnswers?: Record<string, string> }

    const validate = useCallback(
        (values: RequestServiceFormValues): FormErrors => {
            const baseErr: Partial<Record<Exclude<keyof RequestServiceFormValues, "dynamicAnswers">, string>> = {}
            const requiredBase: (keyof RequestServiceFormValues)[] = [
                "pincode",
                "customerFirstName",
                "customerLastName",
                "clientType",
                "customerPhoneNumber",
                "customerEmail",
            ]
            requiredBase.forEach((field) => {
                if (!values[field]?.toString().trim()) {
                    baseErr[field as Exclude<keyof RequestServiceFormValues, "dynamicAnswers">] = "Requis"
                }
            })
            if (values.customerEmail?.toString().trim() && !validateEmail(values.customerEmail.trim())) {
                baseErr.customerEmail = "Veuillez entrer une adresse email valide"
            }
            const dynErr: Record<string, string> = {}
            questionsList.filter((q) => q.is_required).forEach((q) => {
                const v = values.dynamicAnswers?.[q._id]
                if (q.is_multiple || q.type === "checkbox") {
                    const hasValue = Array.isArray(v)
                        ? v.length > 0
                        : (v ?? "").toString().trim() !== ""
                    if (!hasValue) dynErr[q._id] = "Requis"
                } else {
                    if (!(v ?? "").toString().trim()) dynErr[q._id] = "Requis"
                }
            })
            const result: FormErrors = { ...baseErr }
            if (Object.keys(dynErr).length > 0) result.dynamicAnswers = dynErr
            return result
        },
        [questionsList]
    )

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
                const payload: ICreateServiceRequestPayload = {
                    service_category: data?.grandParentServiceId ?? "",
                    // child_category: "",
                    // manual_child_category: "",
                    note: values.serviceNote ?? "",
                    address_1: addressData.address_1,
                    address_2: addressData.address_2,
                    city: addressData.city,
                    state: addressData.state,
                    country: addressData.country,
                    pincode: values.pincode ?? "",
                    dynamic_answers: buildDynamicAnswersPayload(questionsList, values.dynamicAnswers ?? {}),
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

                const res = await createServiceRequest(payload).unwrap()
                const ref = res?.data?.request?.reference_no
                setSubmissionRef(ref ?? null)
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
                        initialStep: reviewStepIndex,
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
                    initialStep: reviewStepIndex,
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
                        initialStep: reviewStepIndex,
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
                            initialStep: reviewStepIndex,
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
                    initialStep: reviewStepIndex,
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

    const currentQuestionStep = questionSteps[getStepCount - 1]
    const questionsForStep = currentQuestionStep != null ? questionsByStep[currentQuestionStep] ?? [] : []
    const isQuestionsApiLoading = !!categoryId && isQuestionsLoading

    return (
        <>
            {isLoading && <AppLoader message={data?.isEditMode ? "Mise à jour de la demande en cours..." : "Création de la demande en cours..."} />}
            {isQuestionsApiLoading && (
                <AppLoader message="Chargement des questions..." fullScreen={false} />
            )}
            {!isQuestionsApiLoading && (
            <div className="space-y-5">
                <div className="space-y-2.5">
                    <p className="text-fontBlack text-sm/[20px] xl:text-lg/[22px] text-center">
                        Étape <span className="text-[#10B981] font-semibold">{displayStep}</span> sur {totalSteps}
                    </p>
                    <div className="w-full mx-auto px-4 py-6">
                        <ProgressStepBar currentStep={displayStep} totalSteps={totalSteps} />
                    </div>
                </div>
                {getStepCount >= 1 && getStepCount < contactStepIndex && questionsForStep.length > 0 && (
                    <DynamicQuestionsStep
                        questions={questionsForStep}
                        formik={formik}
                        setStepCount={setStepCountSafe}
                    />
                )}
                {getStepCount >= 1 && getStepCount < contactStepIndex && questionsForStep.length === 0 && !isQuestionsLoading && (
                    <div className="flex justify-between pt-6 gap-2">
                        <button
                            type="button"
                            onClick={() => setStepCountSafe((p) => p - 1)}
                            className="btn_radius font-medium text-sm border border-borderColor px-4 py-2 rounded-xl"
                        >
                            Précédent
                        </button>
                        <button
                            type="button"
                            onClick={() => setStepCountSafe((p) => p + 1)}
                            className="btn_radius flex-1 bg-primaryColor text-white font-medium text-sm px-4 py-2 rounded-xl"
                        >
                            Continuer
                        </button>
                    </div>
                )}
                {getStepCount === contactStepIndex && (
                    <ContactInformation formik={formik} setStepCount={setStepCountSafe} readOnly={!!data?.isEditMode} />
                )}
                {getStepCount === reviewStepIndex && (
                    <ReviewRequest
                        formik={formik}
                        setStepCount={setStepCountSafe}
                        questionsList={questionsList}
                        contactStepIndex={contactStepIndex}
                    />
                )}
            </div>
            )}
        </>
    )
}

export default RequestServiceFlowIndex
