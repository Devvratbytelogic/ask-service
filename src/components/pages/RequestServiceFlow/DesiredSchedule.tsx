"use client"

import { TIME_OF_DAY_OPTIONS } from "@/utils/constant_var"
import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react"
import { FiInfo } from "react-icons/fi"
import { FormikProps } from "formik"
import { RequestServiceFormValues, ScheduleVisibility } from "./RequestServiceFlowIndex"

interface DesiredScheduleProps {
  formik: FormikProps<RequestServiceFormValues>
  setStepCount: React.Dispatch<React.SetStateAction<number>>
  scheduleVisibility: ScheduleVisibility
}

const getStep3RequiredFields = (visibility: ScheduleVisibility): (keyof RequestServiceFormValues)[] => {
  const fields: (keyof RequestServiceFormValues)[] = []
  if (visibility.is_preferred_date_visible) fields.push("serviceStartDate")
  if (visibility.is_preferred_time_visible) fields.push("serviceTimeOfDay")
  if (visibility.is_start_date_visible) fields.push("start_date")
  if (visibility.is_start_time_visible) fields.push("start_time")
  if (visibility.is_end_date_visible) fields.push("end_date")
  if (visibility.is_end_time_visible) fields.push("end_time")
  return fields
}

const today = () => new Date().toISOString().slice(0, 10)

const DesiredSchedule = ({ formik, setStepCount, scheduleVisibility }: DesiredScheduleProps) => {
  const { values, setFieldValue, touched, errors, handleBlur, handleChange, setTouched, validateForm } = formik
  const STEP3_REQUIRED_FIELDS = getStep3RequiredFields(scheduleVisibility)

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
        {scheduleVisibility.is_preferred_date_visible && (
          <div className="col-span-1">
            <Input
              name="serviceStartDate"
              type="date"
              variant="bordered"
              label="Date de début préférée"
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
        )}
        {scheduleVisibility.is_preferred_time_visible && (
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
                <SelectItem key={opt.value}>{opt.label}</SelectItem>
              ))}
            </Select>
            <div className="mt-2 flex items-start gap-2 rounded-lg bg-primaryColor/10 px-3 py-2 text-primaryColor">
              <FiInfo className="mt-0.5 shrink-0 text-lg" aria-hidden />
              <p className="text-sm">
                Note : L'heure sera confirmée avec le prestataire choisi.
              </p>
            </div>
          </div>
        )}
        {scheduleVisibility.is_start_date_visible && (
          <div className="col-span-1">
            <Input
              name="start_date"
              type="date"
              variant="bordered"
              label="Date de début"
              labelPlacement="outside"
              value={values.start_date}
              onChange={handleChange}
              onBlur={handleBlur}
              min={today()}
              isInvalid={!!(touched.start_date && errors.start_date)}
              errorMessage={touched.start_date && errors.start_date}
              classNames={{
                inputWrapper: ["custom_input_design"],
                label: ["custom_label_text"],
              }}
              isRequired
            />
          </div>
        )}
        {scheduleVisibility.is_start_time_visible && (
          <div className="col-span-1">
            <Input
              name="start_time"
              type="time"
              variant="bordered"
              label="Heure de début"
              labelPlacement="outside"
              value={values.start_time}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!(touched.start_time && errors.start_time)}
              errorMessage={touched.start_time && errors.start_time}
              classNames={{
                inputWrapper: ["custom_input_design"],
                label: ["custom_label_text"],
              }}
              isRequired
            />
          </div>
        )}
        {scheduleVisibility.is_end_date_visible && (
          <div className="col-span-1">
            <Input
              name="end_date"
              type="date"
              variant="bordered"
              label="Date de fin"
              labelPlacement="outside"
              value={values.end_date}
              onChange={handleChange}
              onBlur={handleBlur}
              min={today()}
              isInvalid={!!(touched.end_date && errors.end_date)}
              errorMessage={touched.end_date && errors.end_date}
              classNames={{
                inputWrapper: ["custom_input_design"],
                label: ["custom_label_text"],
              }}
              isRequired
            />
          </div>
        )}
        {scheduleVisibility.is_end_time_visible && (
          <div className="col-span-1">
            <Input
              name="end_time"
              type="time"
              variant="bordered"
              label="Heure de fin"
              labelPlacement="outside"
              value={values.end_time}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!(touched.end_time && errors.end_time)}
              errorMessage={touched.end_time && errors.end_time}
              classNames={{
                inputWrapper: ["custom_input_design"],
                label: ["custom_label_text"],
              }}
              isRequired
            />
          </div>
        )}
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
