"use client"

import { CHILD_SERVICE_LIST, SERVICE_LIST } from "@/utils/serviceList"
import type { IAllServiceCategoriesChildCategoriesEntity } from "@/types/services"
import { Button } from "@heroui/react"
import { FormikProps } from "formik"
import { FiCheck } from "react-icons/fi"
import { RequestServiceFormValues } from "./RequestServiceFlowIndex"

interface ReviewRequestProps {
  formik: FormikProps<RequestServiceFormValues>
  setStepCount: React.Dispatch<React.SetStateAction<number>>
  isTasksRequiredVisible?: boolean
  childServices?: IAllServiceCategoriesChildCategoriesEntity[] | null
}

const formatDate = (dateStr: string) => {
  if (!dateStr?.trim()) return "—"
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
}

const getServiceName = (
  value: string,
  otherName?: string,
  childServices?: IAllServiceCategoriesChildCategoriesEntity[] | null
) => {
  if (!value) return ""
  if (value === "other") return otherName?.trim() || "Autre"
  const fromApi = childServices?.find((c) => String(c._id) === value)?.title
  if (fromApi) return fromApi
  const found = SERVICE_LIST.find((s) => String(s._id) === value)
  return found?.service_name ?? ""
}

const getTaskNames = (ids: string[]) => {
  if (!ids?.length) return "—"
  return ids
    .map((id) => CHILD_SERVICE_LIST.find((c) => String(c._id) === id)?.service_name ?? id)
    .join(", ")
}

const ReviewRequest = ({ formik, setStepCount, isTasksRequiredVisible = true, childServices = null }: ReviewRequestProps) => {
  const { values, handleSubmit } = formik

  const handleBack = () => setStepCount((prev) => prev - 1)

  const summaryCards = [
    {
      title: "Service et fréquence",
      step: 1,
      rows: [
        ...(values.parentServiceName
          ? [{ label: "Service:", value: getServiceName(values.parentServiceName, values.otherServiceName, childServices) || "—" }]
          : []),
        ...(values.serviceFrequency ? [{ label: "Fréquence:", value: values.serviceFrequency }] : []),
      ],
    },
    ...(isTasksRequiredVisible
      ? [{
          title: "Missions",
          step: 2,
          rows: [
            { label: "Missions:", value: getTaskNames(values.childServiceIds ?? []) },
          ],
        }]
      : []),
    {
      title: "Planning",
      step: 3,
      rows: [
        ...(values.serviceStartDate ? [{ label: "Date préférée:", value: formatDate(values.serviceStartDate) }] : []),
        ...(values.serviceTimeOfDay ? [{ label: "Moment souhaité:", value: values.serviceTimeOfDay }] : []),
        ...(values.start_date ? [{ label: "Date de début:", value: formatDate(values.start_date) }] : []),
        ...(values.start_time ? [{ label: "Heure de début:", value: values.start_time }] : []),
        ...(values.end_date ? [{ label: "Date de fin:", value: formatDate(values.end_date) }] : []),
        ...(values.end_time ? [{ label: "Heure de fin:", value: values.end_time }] : []),
        { label: "Détails:", value: values.serviceNote?.trim() || "—" },
      ],
    },
    {
      title: "Vos coordonnées",
      step: 4,
      rows: [
        {
          label: "Nom:",
          value: [values.customerFirstName, values.customerLastName].filter(Boolean).join(" ") || "—",
        },
        { label: "Type:", value: (values.clientType === "Individual" ? "Particulier" : values.clientType === "Company" ? "Entreprise" : values.clientType) || "—" },
        { label: "Téléphone:", value: values.customerPhoneNumber || "—" },
        { label: "Email:", value: values.customerEmail || "—" },
      ],
    },
  ]

  return (
    <>
      <div className="space-y-1">
        <h2 className="text-fontBlack text-xl/[26px] xl:text-2xl/[30px] font-semibold">
          Vérifiez votre demande
        </h2>
        <p className="text-darkSilver text-sm/[18px] xl:text-base/[30px]">
          Veuillez vérifier vos informations avant de soumettre votre demande.
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
                className="text-primaryColor text-sm cursor-pointer font-medium hover:underline"
              >
                Modifier
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
          Vos informations sont sécurisées et ne seront partagées qu'avec des professionnels vérifiés
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
          Envoyer la demande et recevoir des devis
        </Button>
        <Button variant="bordered" onPress={handleBack} className="w-full btn_radius">
          Précédent
        </Button>
      </div>

      <p className="text-center text-placeHolderText text-tiny mt-4">
        En soumettant, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité.
      </p>
    </>
  )
}

export default ReviewRequest
