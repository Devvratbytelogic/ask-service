"use client"

import { CHILD_SERVICE_LIST } from "@/utils/serviceList"
import { Button, Checkbox } from "@heroui/react"
import { FormikProps } from "formik"
import { RequestServiceFormValues } from "./RequestServiceFlowIndex"

interface TaskRequiredProps {
  formik: FormikProps<RequestServiceFormValues>
  setStepCount: React.Dispatch<React.SetStateAction<number>>
}

const TaskRequired = ({ formik, setStepCount }: TaskRequiredProps) => {
  const { values, setFieldValue } = formik
  const selectedIds = values.childServiceIds ?? []

  const handleToggle = (id: string) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id]
    setFieldValue("childServiceIds", next)
  }

  const handleBack = () => setStepCount((prev) => prev - 1)
  const handleContinue = () => setStepCount((prev) => prev + 1)

  return (
    <>
      <div className="space-y-1">
        <h2 className="text-fontBlack text-xl/[26px] xl:text-2xl/[30px] font-semibold">
          Cleaning tasks required
        </h2>
        <p className="text-darkSilver text-sm/[18px] xl:text-base/[30px]">
          Optional – Select all that apply to help providers better understand your needs
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {CHILD_SERVICE_LIST.map((item) => {
          const id = String(item._id)
          const isSelected = selectedIds.includes(id)
          return (
            <label
              key={id}
              className={`
                flex items-center gap-3 p-4 rounded-xl border cursor-pointer
                bg-white border-borderColor hover:border-primaryColor/50
                transition-colors
                ${isSelected ? "border-primaryColor bg-primaryColor/5" : ""}
              `}
            >
              <Checkbox
                isSelected={isSelected}
                onValueChange={() => handleToggle(id)}
                classNames={{
                  base: "max-w-full",
                  wrapper: "rounded-md",
                }}
                aria-label={item.service_name}
              />
              <span className="text-fontBlack text-sm xl:text-base truncate">
                {item.service_name}
              </span>
            </label>
          )
        })}
      </div>
      <div className="flex justify-between pt-6 gap-2">
        <Button variant="bordered" className="btn_radius font-medium text-sm/[20px] leading-[-0.42px]" onPress={handleBack}>
          Back
        </Button>
        <Button color="primary" className="btn_radius flex-1 bg-primaryColor text-white font-medium text-sm/[20px] leading-[-0.42px]" onPress={handleContinue}>
          Continue
        </Button>
      </div>
    </>
  )
}

export default TaskRequired
