"use client"

import { CHILD_SERVICE_LIST, SERVICE_LIST } from "@/utils/serviceList"
import { Button } from "@heroui/react"
import { FormikProps } from "formik"
import { FiCheck } from "react-icons/fi"
import { RequestServiceFormValues } from "./RequestServiceFlowIndex"

interface ReviewRequestProps {
  formik: FormikProps<RequestServiceFormValues>
  setStepCount: React.Dispatch<React.SetStateAction<number>>
}

const formatDate = (dateStr: string) => {
  if (!dateStr?.trim()) return "—"
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

const getServiceName = (value: string, otherName?: string) => {
  if (!value) return "—"
  if (value === "other") return (otherName?.trim() || "Other")
  const found = SERVICE_LIST.find((s) => String(s._id) === value)
  return found?.service_name ?? value
}

const getTaskNames = (ids: string[]) => {
  if (!ids?.length) return "—"
  return ids
    .map((id) => CHILD_SERVICE_LIST.find((c) => String(c._id) === id)?.service_name ?? id)
    .join(", ")
}

const ReviewRequest = ({ formik, setStepCount }: ReviewRequestProps) => {
  
  const { values, handleSubmit } = formik

  const handleBack = () => setStepCount((prev) => prev - 1)

  const summaryCards = [
    {
      title: "Service & Frequency",
      step: 1,
      rows: [
        { label: "Service:", value: getServiceName(values.parentServiceName, values.otherServiceName) },
        { label: "Cleaning frequency:", value: values.serviceFrequency || "—" },
      ],
    },
    {
      title: "Tasks",
      step: 2,
      rows: [
        { label: "Tasks:", value: getTaskNames(values.childServiceIds ?? []) },
      ],
    },
    {
      title: "Schedule",
      step: 3,
      rows: [
        { label: "Preferred date:", value: formatDate(values.serviceStartDate) },
        { label: "Preferred time:", value: values.serviceTimeOfDay || "—" },
        { label: "Note:", value: values.serviceNote?.trim() || "—" },
      ],
    },
    {
      title: "Contact Information",
      step: 4,
      rows: [
        {
          label: "Name:",
          value: [values.customerFirstName, values.customerLastName].filter(Boolean).join(" ") || "—",
        },
        { label: "Type:", value: values.clientType || "—" },
        { label: "Phone:", value: values.customerPhoneNumber || "—" },
        { label: "Email:", value: values.customerEmail || "—" },
      ],
    },
  ]

  return (
    <>
      <div className="space-y-1">
        <h2 className="text-fontBlack text-xl/[26px] xl:text-2xl/[30px] font-semibold">
          Review Your Request
        </h2>
        <p className="text-darkSilver text-sm/[18px] xl:text-base/[30px]">
          Please review your details before submitting
        </p>
      </div>

      <div className="space-y-4 pt-2 max-h-[35svh] overflow-y-scroll">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-borderColor bg-gray-100/80 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-fontBlack text-base font-semibold">{card.title}</h3>
              <button
                type="button"
                onClick={() => setStepCount(card.step)}
                className="text-primaryColor text-sm font-medium hover:underline"
              >
                Edit
              </button>
            </div>
            <dl className="space-y-1.5">
              {card.rows.map((row) => (
                <div key={row.label} className="flex gap-2 text-sm">
                  <dt className="text-darkSilver shrink-0">{row.label}</dt>
                  <dd className="text-fontBlack wrap-break-word">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-primaryColor/10 px-3 py-2 text-primaryColor mt-4">
        <FiCheck className="mt-0.5 shrink-0 text-lg" aria-hidden />
        <p className="text-sm">
          Your details are secure and will only be shared with verified professionals
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          color="primary"
          size="lg"
          className="w-full font-medium btn_radius"
          onPress={() => handleSubmit()}
        >
          Submit request & get quotes
        </Button>
        <Button variant="bordered" onPress={handleBack} className="w-full btn_radius">
          Back
        </Button>
      </div>

      <p className="text-center text-placeHolderText text-tiny mt-4">
        By submitting, you agree to our Terms of Service and Privacy Policy
      </p>
    </>
  )
}

export default ReviewRequest
