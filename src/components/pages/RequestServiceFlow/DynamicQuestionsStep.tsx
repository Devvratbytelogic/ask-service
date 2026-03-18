"use client"

import { Button, Checkbox, Input, Select, SelectItem } from "@heroui/react"
import { FormikProps } from "formik"
import type { ListEntity } from "@/types/serviceQuestions"
import { RequestServiceFormValues } from "./RequestServiceFlowIndex"

const today = () => new Date().toISOString().slice(0, 10)

interface DynamicQuestionsStepProps {
  questions: ListEntity[]
  formik: FormikProps<RequestServiceFormValues>
  setStepCount: React.Dispatch<React.SetStateAction<number>>
}

const DynamicQuestionsStep = ({ questions, formik, setStepCount }: DynamicQuestionsStepProps) => {
  const { values, setFieldValue, touched, errors, handleBlur, setTouched, validateForm } = formik
  const dynamicAnswers = values.dynamicAnswers ?? {}

  const requiredIds = questions.filter((q) => q.is_required).map((q) => q._id)
  const isStepValid = requiredIds.every((id) => {
    const v = dynamicAnswers[id]
    if (Array.isArray(v)) return v.length > 0
    return (v ?? "").toString().trim() !== ""
  })

  const handleBack = () => setStepCount((prev) => prev - 1)
  const handleContinue = async () => {
    const prevTouched = (formik.touched.dynamicAnswers as Record<string, boolean>) ?? {}
    const nextTouched = { ...prevTouched }
    requiredIds.forEach((id) => { nextTouched[id] = true })
    setTouched({ ...formik.touched, dynamicAnswers: nextTouched })
    const errs = await validateForm()
    const dynErr = (errs as { dynamicAnswers?: Record<string, string> }).dynamicAnswers
    const hasErrors = requiredIds.some((id) => dynErr?.[id])
    if (!hasErrors) setStepCount((prev) => prev + 1)
  }

  return (
    <>
      <div className="space-y-1">
        <h2 className="text-fontBlack text-xl/[26px] xl:text-2xl/[30px] font-semibold">
          Détails du service
        </h2>
        <p className="text-darkSilver text-sm/[18px] xl:text-base/[30px]">
          Répondez aux questions pour préciser votre demande.
        </p>
      </div>

      <div className="space-y-4 grid grid-cols-1 pt-2">
        {[...questions]
          .sort((a, b) => a.order - b.order)
          .map((q) => {
            const fieldKey = `dynamicAnswers.${q._id}` as keyof RequestServiceFormValues
            const value = dynamicAnswers[q._id]
            const dynErrors = (formik.errors as { dynamicAnswers?: Record<string, string> })?.dynamicAnswers
            const fieldError = dynErrors?.[q._id]
            const isTouched = (touched.dynamicAnswers as Record<string, boolean> | undefined)?.[q._id]

            if (q.type === "dropdown" && q.options?.length) {
              const strValue = Array.isArray(value) ? (value[0] ?? "") : (value ?? "").toString()
              return (
                <div key={q._id} className="col-span-1">
                  <Select
                    label={q.label}
                    labelPlacement="outside"
                    placeholder={q.placeholder ?? "Sélectionnez"}
                    selectedKeys={strValue ? [strValue] : []}
                    onSelectionChange={(keys) => {
                      const k = Array.from(keys as Set<string>)[0]
                      setFieldValue("dynamicAnswers", { ...dynamicAnswers, [q._id]: k ?? "" })
                    }}
                    onBlur={handleBlur}
                    isInvalid={!!(isTouched && fieldError)}
                    errorMessage={isTouched && fieldError ? fieldError : undefined}
                    classNames={{
                      trigger: ["custom_input_design"],
                      label: ["custom_label_text"],
                    }}
                    isRequired={q.is_required}
                  >
                    {q.options
                      .filter((o): o is NonNullable<typeof o> => o != null)
                      .map((opt) => (
                        <SelectItem key={opt.value}>{opt.label}</SelectItem>
                      ))}
                  </Select>
                </div>
              )
            }

            if ((q.type === "checkbox" || q.is_multiple) && q.options?.length) {
              const arrValue = Array.isArray(value) ? value : value ? [value].filter(Boolean) : []
              return (
                <div key={q._id} className="col-span-1">
                  <p className="custom_label_text mb-2">
                    {q.label}
                    {q.is_required && <span className="text-danger"> *</span>}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options
                      .filter((o): o is NonNullable<typeof o> => o != null)
                      .map((opt) => {
                        const isSelected = arrValue.includes(opt.value)
                        return (
                          <label
                            key={opt._id}
                            className={`
                              flex items-center gap-3 p-4 rounded-xl border cursor-pointer
                              bg-white border-borderColor hover:border-primaryColor/50
                              transition-colors
                              ${isSelected ? "border-primaryColor bg-primaryColor/5" : ""}
                            `}
                          >
                            <Checkbox
                              isSelected={isSelected}
                              onValueChange={() => {
                                const next = isSelected
                                  ? arrValue.filter((x) => x !== opt.value)
                                  : [...arrValue, opt.value]
                                setFieldValue("dynamicAnswers", { ...dynamicAnswers, [q._id]: next })
                              }}
                              classNames={{
                                base: "max-w-full",
                                wrapper: "rounded-md",
                              }}
                              aria-label={opt.label}
                            />
                            <span className="text-fontBlack text-sm xl:text-base truncate">
                              {opt.label}
                            </span>
                          </label>
                        )
                      })}
                  </div>
                  {isTouched && fieldError && (
                    <p className="text-danger text-tiny mt-1">{fieldError}</p>
                  )}
                </div>
              )
            }

            if (q.type === "date") {
              const strValue = Array.isArray(value) ? "" : (value ?? "").toString()
              return (
                <div key={q._id} className="col-span-1">
                  <Input
                    type="date"
                    label={q.label}
                    labelPlacement="outside"
                    placeholder={q.placeholder ?? ""}
                    value={strValue}
                    onChange={(e) => setFieldValue("dynamicAnswers", { ...dynamicAnswers, [q._id]: e.target.value })}
                    onBlur={handleBlur}
                    min={today()}
                    isInvalid={!!(isTouched && fieldError)}
                    errorMessage={isTouched && fieldError ? fieldError : undefined}
                    classNames={{
                      inputWrapper: ["custom_input_design"],
                      label: ["custom_label_text"],
                    }}
                    isRequired={q.is_required}
                  />
                </div>
              )
            }

            // text, textarea, or fallback
            const strValue = Array.isArray(value) ? "" : (value ?? "").toString()
            return (
              <div key={q._id} className="col-span-1">
                <Input
                  label={q.label}
                  labelPlacement="outside"
                  placeholder={q.placeholder ?? ""}
                  value={strValue}
                  onChange={(e) => setFieldValue("dynamicAnswers", { ...dynamicAnswers, [q._id]: e.target.value })}
                  onBlur={handleBlur}
                  isInvalid={!!(isTouched && fieldError)}
                  errorMessage={isTouched && fieldError ? fieldError : undefined}
                  classNames={{
                    inputWrapper: ["custom_input_design"],
                    label: ["custom_label_text"],
                  }}
                  isRequired={q.is_required}
                />
              </div>
            )
          })}
      </div>

      <div className="flex justify-between pt-6 gap-2">
        <Button variant="bordered" className="btn_radius font-medium text-sm/[20px] leading-[-0.42px]" onPress={handleBack}>
          Précédent
        </Button>
        <Button
          color="primary"
          className="btn_radius flex-1 bg-primaryColor text-white font-medium text-sm/[20px] leading-[-0.42px]"
          onPress={handleContinue}
          isDisabled={!isStepValid}
        >
          Continuer
        </Button>
      </div>
    </>
  )
}

export default DynamicQuestionsStep
