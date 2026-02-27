"use client"

import { Button, Checkbox } from "@heroui/react"
import { FormikProps } from "formik"
import { useMemo } from "react"
import { IAllServiceCategoriesChildCategoriesEntity } from "@/types/services"
import { RequestServiceFormValues } from "./RequestServiceFlowIndex"

interface TaskRequiredProps {
  formik: FormikProps<RequestServiceFormValues>
  setStepCount: React.Dispatch<React.SetStateAction<number>>
  childCategories?: IAllServiceCategoriesChildCategoriesEntity[] | null
}

const TaskRequired = ({ formik, setStepCount, childCategories = [] }: TaskRequiredProps) => {
  const { values, setFieldValue } = formik
  const selectedIds = values.childServiceIds ?? []
  console.log('values', values);
  
  const selectedChild = useMemo(
    () => (childCategories ?? []).find((c) => c._id === values.parentServiceName),
    [childCategories, values.parentServiceName]
  )
  const optionsList = selectedChild?.options ?? []

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
        {optionsList.map((item, index) => {
          const id = item.label ?? `option-${index}`
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
                aria-label={item.label}
              />
              <span className="text-fontBlack text-sm xl:text-base truncate">
                {item.label}
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
