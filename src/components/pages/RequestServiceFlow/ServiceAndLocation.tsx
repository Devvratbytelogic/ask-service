
import { SERVICE_FREQUENCY_TYPE } from "@/utils/constant_var"
import { SERVICE_LIST } from "@/utils/serviceList"
import { Button, Input, Select, SelectItem } from "@heroui/react"
import { FormikProps } from "formik"
import { RequestServiceFormValues } from "./RequestServiceFlowIndex"

interface ServiceAndLocationProps {
  formik: FormikProps<RequestServiceFormValues>
  setStepCount: React.Dispatch<React.SetStateAction<number>>
}

const STEP1_REQUIRED_FIELDS: (keyof RequestServiceFormValues)[] = ["parentServiceName", "serviceFrequency", "pincode"]

const ServiceAndLocation = ({ formik, setStepCount }: ServiceAndLocationProps) => {
  const { values, setFieldValue, touched, errors, handleBlur, handleChange, validateForm, setTouched } = formik

  const isOtherSelected = values.parentServiceName === "other"
  const step1FieldsToValidate = isOtherSelected
    ? [...STEP1_REQUIRED_FIELDS, "otherServiceName"]
    : STEP1_REQUIRED_FIELDS

  const isStep1Valid =
    STEP1_REQUIRED_FIELDS.every((field) => values[field]?.toString().trim() !== "") &&
    (!isOtherSelected || (values.otherServiceName?.toString().trim() ?? "") !== "")

  const handleNext = async () => {
    setTouched(
      step1FieldsToValidate.reduce(
        (acc, k) => ({ ...acc, [k]: true }),
        {} as Partial<Record<keyof RequestServiceFormValues, boolean>>
      )
    )
    const errs = await validateForm()
    const step1Errors = step1FieldsToValidate.some((k) => errs[k as keyof RequestServiceFormValues])
    if (!step1Errors) setStepCount((prev) => prev + 1)
  }

  return (
    <>
      <div className="space-y-1">
        <h2 className=" text-fontBlack text-xl/[26px] xl:text-2xl/[30px] font-semibold">Service & Location</h2>
        <p className="text-darkSilver text-sm/[18px]  xl:text-base/[30px]">Tell us what type of cleaning you need</p>
      </div>
      <div className="space-y-4 grid grid-cols-1">
        <div className="col-span-1">
          <Select
            name="parentServiceName"
            variant="bordered"
            label="Type of cleaning service"
            labelPlacement="outside"
            placeholder="Select Service"
            selectedKeys={values.parentServiceName ? [values.parentServiceName] : []}
            onSelectionChange={(keys) => {
              const key = Array.from(keys as Set<string>)[0]
              setFieldValue("parentServiceName", key ?? "")
              if (key !== "other") setFieldValue("otherServiceName", "")
            }}
            onBlur={handleBlur}
            isInvalid={!!(touched.parentServiceName && errors.parentServiceName)}
            errorMessage={touched.parentServiceName && errors.parentServiceName}
            classNames={{
              trigger: ['custom_input_design'],
              label: ['custom_label_text']
            }}
            isRequired
          >
            <>
              {SERVICE_LIST?.map((curr) => <SelectItem key={String(curr?._id)}>{curr?.service_name}</SelectItem>)}
              <SelectItem key="other">Other</SelectItem>
            </>
          </Select>
        </div>
        {isOtherSelected && (
          <div className="col-span-1">
            <Input
              name="otherServiceName"
              variant="bordered"
              placeholder="Please specify..."
              value={values.otherServiceName}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!(touched.otherServiceName && errors.otherServiceName)}
              errorMessage={touched.otherServiceName && errors.otherServiceName}
              classNames={{
                inputWrapper: ["custom_input_design"],
                label: ["custom_label_text"],
              }}
              isRequired
            />
          </div>
        )}
        <div className="col-span-1">
          <Select
            name="serviceFrequency"
            variant="bordered"
            label="Service frequency"
            labelPlacement="outside"
            placeholder="Select Frequency"
            selectedKeys={values.serviceFrequency ? [values.serviceFrequency] : []}
            onSelectionChange={(keys) => {
              const key = Array.from(keys as Set<string>)[0]
              setFieldValue("serviceFrequency", key ?? "")
            }}
            onBlur={handleBlur}
            isInvalid={!!(touched.serviceFrequency && errors.serviceFrequency)}
            errorMessage={touched.serviceFrequency && errors.serviceFrequency}
            classNames={{
              trigger: ['custom_input_design'],
              label: ['custom_label_text']
            }}
            isRequired
          >
            {SERVICE_FREQUENCY_TYPE?.map((curr) => <SelectItem key={curr}>{curr}</SelectItem>)}
          </Select>
        </div>
      </div>
      <div className="flex justify-between pt-4">
        <Button
          color="primary"
          onPress={handleNext}
          isDisabled={!isStep1Valid}
          className="btn_radius flex-1 bg-primaryColor text-white font-medium text-sm/[20px] leading-[-0.42px]"
        >
          Continue
        </Button>
      </div>
    </>
  )
}

export default ServiceAndLocation