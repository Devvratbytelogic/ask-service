import { SERVICE_FREQUENCY_TYPE } from "@/utils/constant_var"
import { Button, Input, Select, SelectItem } from "@heroui/react"
import { FormikProps } from "formik"
import { IAllServiceCategoriesChildCategoriesEntity } from "@/types/services"
import { RequestServiceFormValues } from "./RequestServiceFlowIndex"

interface ServiceAndLocationProps {
  formik: FormikProps<RequestServiceFormValues>
  setStepCount: React.Dispatch<React.SetStateAction<number>>
  childServices?: IAllServiceCategoriesChildCategoriesEntity[] | null
  grandParentServiceName?: string | null
  isFrequencyVisible?: boolean
  isServiceCategoryLoading?: boolean
}

const STEP1_REQUIRED_FIELDS_WITH_FREQUENCY: (keyof RequestServiceFormValues)[] = ["parentServiceName", "serviceFrequency", "pincode"]
const STEP1_REQUIRED_FIELDS_WITHOUT_FREQUENCY: (keyof RequestServiceFormValues)[] = ["parentServiceName", "pincode"]

const ServiceAndLocation = ({ formik, setStepCount, grandParentServiceName, isFrequencyVisible, isServiceCategoryLoading, childServices = [] }: ServiceAndLocationProps) => {
  const { values, setFieldValue, touched, errors, handleBlur, handleChange, validateForm, setTouched } = formik

  const isOtherSelected = values.parentServiceName === "other"
  const step1RequiredFields = isFrequencyVisible ? STEP1_REQUIRED_FIELDS_WITH_FREQUENCY : STEP1_REQUIRED_FIELDS_WITHOUT_FREQUENCY
  const step1FieldsToValidate = isOtherSelected
    ? [...step1RequiredFields, "otherServiceName"]
    : step1RequiredFields

  const isStep1Valid =
    step1RequiredFields.every((field) => values[field]?.toString().trim() !== "") &&
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
        <h2 className=" text-fontBlack text-xl/[26px] xl:text-2xl/[30px] font-semibold">Service et lieu</h2>
        <p className="text-darkSilver text-sm/[18px]  xl:text-base/[30px]">
          {grandParentServiceName?.toLowerCase().includes("security") || grandParentServiceName?.toLowerCase().includes("sécurité")
            ? "Quel type de service de sécurité recherchez-vous?"
            : grandParentServiceName?.toLowerCase().includes("cleaning") || grandParentServiceName?.toLowerCase().includes("nettoyage")
              ? "Quel type de service de nettoyage recherchez-vous ?"
              : grandParentServiceName?.toLowerCase().includes("garden") || grandParentServiceName?.toLowerCase().includes("jardin")
                ? "Quel type de service de jardinage recherchez-vous ?"
                : "Quel type de service recherchez-vous ?"}
        </p>
      </div>
      <div className="space-y-4 grid grid-cols-1">
        <div className="col-span-1">
          <Select
            name="parentServiceName"
            variant="bordered"
            label={grandParentServiceName?.toLowerCase().includes("security") || grandParentServiceName?.toLowerCase().includes("sécurité") ? "Type de service de sécurité" : grandParentServiceName?.toLowerCase().includes("cleaning") || grandParentServiceName?.toLowerCase().includes("nettoyage") ? "Type de service de nettoyage" : grandParentServiceName?.toLowerCase().includes("garden") || grandParentServiceName?.toLowerCase().includes("jardin") ? "Type de service de jardinage" : `Type de service ${grandParentServiceName ?? ""}`}
            labelPlacement="outside"
            placeholder="Sélectionnez un service"
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
              {(childServices ?? []).map((curr) => (
                <SelectItem key={String(curr?._id)}>{curr?.title}</SelectItem>
              ))}
              <SelectItem key="other">Autre</SelectItem>
            </>
          </Select>
        </div>
        {isOtherSelected && (
          <div className="col-span-1">
            <Input
              name="otherServiceName"
              variant="bordered"
              placeholder="Précisez..."
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
        {!values.pincode?.toString().trim() && (
          <div className="col-span-1">
            <Input
              name="pincode"
              variant="bordered"
              label="Postal Code"
              labelPlacement="outside"
              placeholder="Entrez votre code postal"
              value={values.pincode}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!(touched.pincode && errors.pincode)}
              errorMessage={touched.pincode && errors.pincode}
              classNames={{
                inputWrapper: ["custom_input_design"],
                label: ["custom_label_text"],
              }}
              isRequired
            />
          </div>
        )}
        {isFrequencyVisible && !isServiceCategoryLoading && (
          <div className="col-span-1">
            <Select
              name="serviceFrequency"
              variant="bordered"
              label="Fréquence de la prestation"
              labelPlacement="outside"
              placeholder="Sélectionnez la fréquence"
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
              {SERVICE_FREQUENCY_TYPE?.map((curr) => (
                <SelectItem key={curr.value}>{curr.label}</SelectItem>
              ))}
            </Select>
          </div>
        )}
      </div>
      <div className="flex justify-between pt-4">
        <Button
          color="primary"
          onPress={handleNext}
          isDisabled={!isStep1Valid}
          className="btn_radius flex-1 bg-primaryColor text-white font-medium text-sm/[20px] leading-[-0.42px]"
        >
          Continuer
        </Button>
      </div>
    </>
  )
}

export default ServiceAndLocation