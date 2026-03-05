"use client"

import { TIME_OF_DAY_OPTIONS } from "@/utils/constant_var"
import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react"
import { FiInfo } from "react-icons/fi"
import { FormikProps } from "formik"
import { RequestServiceFormValues } from "./RequestServiceFlowIndex"

interface DesiredScheduleProps {
  formik: FormikProps<RequestServiceFormValues>
  setStepCount: React.Dispatch<React.SetStateAction<number>>
}

const STEP3_REQUIRED_FIELDS: (keyof RequestServiceFormValues)[] = ["serviceStartDate", "serviceTimeOfDay"]

const today = () => new Date().toISOString().slice(0, 10)

const DesiredSchedule = ({ formik, setStepCount }: DesiredScheduleProps) => {
  const { values, setFieldValue, touched, errors, handleBlur, handleChange, setTouched, validateForm } = formik

  const isStep3Valid = STEP3_REQUIRED_FIELDS.every(
    (field) => values[field]?.toString().trim() !== ""
  )

  const handleBack = () => setStepCount((prev) => prev - 1)
  const handleContinue = async () => {
    setTouched(
      STEP3_REQUIRED_FIELDS.reduce(
        (acc, k) => ({ ...acc, [k]: true }),
        {} as Partial<Record<keyof RequestServiceFormValues, boolean>>
      )
    )
    const errs = await validateForm()
    const hasStep3Errors = STEP3_REQUIRED_FIELDS.some((k) => errs[k])
    if (!hasStep3Errors) setStepCount((prev) => prev + 1)
  }

  return (
    <>
      <div className="space-y-1">
        <h2 className="text-fontBlack text-xl/[26px] xl:text-2xl/[30px] font-semibold">
          Planning souhaité
        </h2>
        <p className="text-darkSilver text-sm/[18px] xl:text-base/[30px]">
          Quand souhaitez-vous l'intervention ?
        </p>
      </div>

      <div className="space-y-4 grid grid-cols-1 pt-2">
        <div className="col-span-1">
          <Input
            name="serviceStartDate"
            type="date"
            variant="bordered"
            label="Date de début"
            labelPlacement="outside"
            value={values.serviceStartDate}
            onChange={handleChange}
            onBlur={handleBlur}
            min={today()}
            isInvalid={!!(touched.serviceStartDate && errors.serviceStartDate)}
            errorMessage={touched.serviceStartDate && errors.serviceStartDate}
            classNames={{
              inputWrapper: ["custom_input_design"],
              label: ["custom_label_text"],
            }}
            isRequired
          />
        </div>
        <div className="col-span-1">
          <Select
            name="serviceTimeOfDay"
            variant="bordered"
            label="Moment de la journée souhaité"
            labelPlacement="outside"
            placeholder="Sélectionnez le moment"
            selectedKeys={values.serviceTimeOfDay ? [values.serviceTimeOfDay] : []}
            onSelectionChange={(keys) => {
              const key = Array.from(keys as Set<string>)[0]
              setFieldValue("serviceTimeOfDay", key ?? "")
            }}
            onBlur={handleBlur}
            isInvalid={!!(touched.serviceTimeOfDay && errors.serviceTimeOfDay)}
            errorMessage={touched.serviceTimeOfDay && errors.serviceTimeOfDay}
            classNames={{
              trigger: ["custom_input_design"],
              label: ["custom_label_text"],
            }}
            isRequired
          >
            {TIME_OF_DAY_OPTIONS.map((opt) => (
              <SelectItem key={opt}>{opt}</SelectItem>
            ))}
          </Select>
          <div className="mt-2 flex items-start gap-2 rounded-lg bg-primaryColor/10 px-3 py-2 text-primaryColor">
            <FiInfo className="mt-0.5 shrink-0 text-lg" aria-hidden />
            <p className="text-sm">
              Note : L'heure sera confirmée avec le prestataire choisi.
            </p>
          </div>
        </div>
        <div className="col-span-1">
          <Textarea
            name="serviceNote"
            variant="bordered"
            label="Donnez plus de détails"
            labelPlacement="outside"
            placeholder="Écrivez ici..."
            value={values.serviceNote}
            onChange={handleChange}
            onBlur={handleBlur}
            classNames={{
              inputWrapper: ["custom_input_design"],
              label: ["custom_label_text"],
            }}
            minRows={3}
          />
        </div>
      </div>

      <div className="flex justify-between pt-6 gap-2">
        <Button variant="bordered" className="btn_radius font-medium text-sm/[20px] leading-[-0.42px]" onPress={handleBack}>
          Précédent
        </Button>
        <Button
          color="primary"
          className="btn_radius flex-1 bg-primaryColor text-white font-medium text-sm/[20px] leading-[-0.42px]"
          onPress={handleContinue}
          isDisabled={!isStep3Valid}
        >
          Continuer
        </Button>
      </div>
    </>
  )
}

export default DesiredSchedule
