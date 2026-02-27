"use client"

import { Button, Input } from "@heroui/react"
import { FormikProps } from "formik"
import { FiInfo } from "react-icons/fi"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { RequestServiceFormValues } from "./RequestServiceFlowIndex"

const CLIENT_TYPES = ["Individual", "Company"] as const

const STEP4_REQUIRED_FIELDS: (keyof RequestServiceFormValues)[] = [
  "customerFirstName",
  "customerLastName",
  "clientType",
  "customerPhoneNumber",
  "customerEmail",
]

interface ContactInformationProps {
  formik: FormikProps<RequestServiceFormValues>
  setStepCount: React.Dispatch<React.SetStateAction<number>>
}

const ContactInformation = ({ formik, setStepCount }: ContactInformationProps) => {

  const { values, setFieldValue, setFieldTouched, touched, errors, handleBlur, handleChange, setTouched, validateForm } = formik

  const isStep4Valid = STEP4_REQUIRED_FIELDS.every(
    (field) => values[field]?.toString().trim() !== ""
  )

  const handleBack = () => setStepCount((prev) => prev - 1)
  const handleContinue = async () => {
    setTouched(
      STEP4_REQUIRED_FIELDS.reduce(
        (acc, k) => ({ ...acc, [k]: true }),
        {} as Partial<Record<keyof RequestServiceFormValues, boolean>>
      )
    )
    const errs = await validateForm()
    const hasStep4Errors = STEP4_REQUIRED_FIELDS.some((k) => errs[k])
    if (!hasStep4Errors) setStepCount((prev) => prev + 1)
  }

  return (
    <>
      <div className="space-y-1">
        <h2 className="text-fontBlack text-xl/[26px] xl:text-2xl/[30px] font-semibold">
          Your Contact Information
        </h2>
        <p className="text-darkSilver text-sm/[18px] xl:text-base/[30px]">
          How can provider reach you?
        </p>
      </div>

      <div className="space-y-4 grid grid-cols-1 pt-2">
        <div className="col-span-1">
          <Input
            name="customerFirstName"
            variant="bordered"
            label="First name"
            labelPlacement="outside"
            placeholder="John"
            value={values.customerFirstName}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={!!(touched.customerFirstName && errors.customerFirstName)}
            errorMessage={touched.customerFirstName && errors.customerFirstName}
            classNames={{
              inputWrapper: ["custom_input_design"],
              label: ["custom_label_text"],
            }}
            isRequired
          />
        </div>
        <div className="col-span-1">
          <Input
            name="customerLastName"
            variant="bordered"
            label="Last name"
            labelPlacement="outside"
            placeholder="Smith"
            value={values.customerLastName}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={!!(touched.customerLastName && errors.customerLastName)}
            errorMessage={touched.customerLastName && errors.customerLastName}
            classNames={{
              inputWrapper: ["custom_input_design"],
              label: ["custom_label_text"],
            }}
            isRequired
          />
        </div>
        <div className="col-span-1">
          <p className="custom_label_text mb-2">
            Client type <span className="text-danger">*</span>
          </p>
          <div className="flex gap-3">
            {CLIENT_TYPES.map((type) => {
              const isSelected = values.clientType === type
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFieldValue("clientType", type)}
                  onBlur={handleBlur}
                  className={`
                    flex-1 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-colors
                    ${isSelected
                      ? "border-primaryColor bg-primaryColor/10 text-primaryColor"
                      : "border-borderColor bg-white text-fontBlack hover:border-primaryColor/50"
                    }
                  `}
                >
                  {type}
                </button>
              )
            })}
          </div>
          {touched.clientType && errors.clientType && (
            <p className="text-danger text-tiny mt-1">{errors.clientType}</p>
          )}
        </div>
        <div className="col-span-1 w-full relative z-100">
          <p className="custom_label_text mb-1.5">
            Phone number <span className="text-danger">*</span>
          </p>
          <div className="mt-1.5">
            <PhoneInput
              country="us"
              value={values.customerPhoneNumber}
              onChange={(value) => setFieldValue("customerPhoneNumber", value)}
              onBlur={() => setFieldTouched("customerPhoneNumber", true)}
              inputProps={{
                name: "customerPhoneNumber",
                "aria-label": "Phone number",
              }}
              containerClass="!w-full"
              inputClass="!w-full !rounded-[12px] !border-borderDark"
              inputStyle={{ height: "52px" }}
              dropdownClass="!z-[9999]"
              dropdownStyle={{ zIndex: 9999 }}
            />
          </div>
          {touched.customerPhoneNumber && errors.customerPhoneNumber && (
            <p className="text-danger text-tiny mt-1">{errors.customerPhoneNumber}</p>
          )}
        </div>
        <div className="col-span-1">
          <Input
            name="customerEmail"
            variant="bordered"
            label="Email address"
            labelPlacement="outside"
            placeholder="email@example.com"
            type="email"
            value={values.customerEmail}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={!!(touched.customerEmail && errors.customerEmail)}
            errorMessage={touched.customerEmail && errors.customerEmail}
            classNames={{
              inputWrapper: ["custom_input_design"],
              label: ["custom_label_text"],
            }}
            isRequired
          />
        </div>
        <div className="col-span-1 flex items-start gap-2 rounded-lg bg-primaryColor/10 px-3 py-2 text-primaryColor">
          <FiInfo className="mt-0.5 shrink-0 text-lg" aria-hidden />
          <p className="text-sm">
            Privacy notice: Your contact details will be hidden from providers until they purchase this lead.
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-6 gap-2">
        <Button variant="bordered" className="btn_radius font-medium text-sm/[20px] leading-[-0.42px]" onPress={handleBack}>
          Back
        </Button>
        <Button
          color="primary"
          className="btn_radius flex-1 bg-primaryColor text-white font-medium text-sm/[20px] leading-[-0.42px]"
          onPress={handleContinue}
          isDisabled={!isStep4Valid}
        >
          Continue
        </Button>
      </div>
    </>
  )
}

export default ContactInformation
