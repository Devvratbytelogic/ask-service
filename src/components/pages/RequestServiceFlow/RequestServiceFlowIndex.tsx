import { useFormik } from "formik"
import { useCallback, useState } from "react"
import ProgressStepBar from "@/components/library/ProgressStepBar"
import ContactInformation from "./ContactInformation"
import DesiredSchedule from "./DesiredSchedule"
import ReviewRequest from "./ReviewRequest"
import ServiceAndLocation from "./ServiceAndLocation"
import SubmissionSuccess from "./SubmissionSuccess"
import TaskRequired from "./TaskRequired"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/appStore"
import { closeModal, openModal } from "@/redux/slices/allModalSlice"

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

const RequestServiceFlowIndex = () => {

    const [getStepCount, setStepCount] = useState(1)
    const [submissionRef, setSubmissionRef] = useState<string | null>(null)
    const dispatch = useDispatch()
    const { data } = useSelector((state: RootState) => state.allCommonModal)

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

    const initialValues: RequestServiceFormValues = {
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
                console.log("values : ", values)
                const ref = "REQ-" + Math.random().toString(36).slice(2, 9).toUpperCase()
                setSubmissionRef(ref)
                dispatch(openModal({
                    componentName:'MobileOtpVerification',
                    data:{
                        ...values,
                        phoneNumber: values?.customerPhoneNumber,
                        parentCallBackModal: 'SubmissionSuccess',
                        codeRef:ref,
                        nextModalSize:'lg'
                    },
                    modalSize:'lg'
                }))
            } catch (error) {
                console.log("error : ", error)
            }
        },
    })


    return (
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
                getStepCount === 1 && <ServiceAndLocation formik={formik} setStepCount={setStepCountSafe} />
            }
            {
                getStepCount === 2 && <TaskRequired formik={formik} setStepCount={setStepCountSafe} />
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

    )
}

export default RequestServiceFlowIndex