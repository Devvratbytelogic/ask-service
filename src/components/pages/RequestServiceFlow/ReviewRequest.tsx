"use client"

import type { ListEntity } from "@/types/serviceQuestions"
import { formatPhoneWithCountryCode, type FormattedPhone } from "@/utils/formatPhone"
import { Button } from "@heroui/react"
import { FormikProps } from "formik"
import { FiCheck } from "react-icons/fi"
import { useMemo } from "react"
import { RequestServiceFormValues } from "./RequestServiceFlowIndex"

const formatDate = (dateStr: string) => {
  if (!dateStr?.trim()) return "—"
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
}

function formatDynamicValue(value: string | string[], question: ListEntity): string {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ") || "—"
  const s = (value ?? "").toString().trim()
  if (!s) return "—"
  if (question.type === "date") return formatDate(s)
  return s
}

interface ReviewRequestProps {
  formik: FormikProps<RequestServiceFormValues>
  setStepCount: React.Dispatch<React.SetStateAction<number>>
  questionsList: ListEntity[]
  contactStepIndex: number
}

const ReviewRequest = ({
  formik,
  setStepCount,
  questionsList,
  contactStepIndex,
}: ReviewRequestProps) => {
  const { values, handleSubmit } = formik
  const dynamicAnswers = values.dynamicAnswers ?? {}

  const handleBack = () => setStepCount((prev) => prev - 1)

  const firstDynamicStepIndex = 1

  const summaryCards = useMemo(() => {
    const cards: {
      title: string
      step: number
      rows: { label: string; value: string; phoneParts?: FormattedPhone | null }[]
    }[] = []
    const dynamicRows = [...questionsList]
      .sort((a, b) => a.step - b.step || a.order - b.order)
      .map((q) => ({
        label: `${q.label}:`,
        value: formatDynamicValue(dynamicAnswers[q._id] ?? "", q),
      }))
    if (dynamicRows.length > 0) {
      cards.push({
        title: "Détails du service",
        step: firstDynamicStepIndex,
        rows: dynamicRows,
      })
    }
    cards.push({
      title: "Vos coordonnées",
      step: contactStepIndex,
      rows: [
        { label: "Code postal:", value: values.pincode?.trim() || "—" },
        {
          label: "Nom:",
          value: [values.customerFirstName, values.customerLastName].filter(Boolean).join(" ") || "—",
        },
        {
          label: "Type:",
          value:
            values.clientType === "Individual"
              ? "Particulier"
              : values.clientType === "Company"
                ? "Entreprise"
                : values.clientType || "—",
        },
        {
          label: "Téléphone:",
          value: values.customerPhoneNumber || "—",
          phoneParts: values.customerPhoneNumber
            ? formatPhoneWithCountryCode(values.customerPhoneNumber, "FR")
            : null,
        },
        { label: "Email:", value: values.customerEmail || "—" },
        { label: "Détails:", value: values.serviceNote?.trim() || "—" },
      ],
    })
    return cards
  }, [
    values.pincode,
    values.customerFirstName,
    values.customerLastName,
    values.clientType,
    values.customerPhoneNumber,
    values.customerEmail,
    values.serviceNote,
    questionsList,
    dynamicAnswers,
    contactStepIndex,
  ])

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
        {summaryCards.map((card, idx) => (
          <div
            key={`${card.title}-${card.step}-${idx}`}
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
                <div key={row.label} className="flex gap-2 text-sm flex-wrap">
                  <dt className="text-darkSilver shrink-0">{row.label}</dt>
                  <dd className="text-fontBlack wrap-break-word">
                    {row.phoneParts ? (
                      <>
                        <span className="font-medium">{row.phoneParts.countryCode}</span>
                        {row.phoneParts.nationalNumber && (
                          <>
                            {" "}
                            <span>{row.phoneParts.nationalNumber}</span>
                          </>
                        )}
                      </>
                    ) : (
                      row.value
                    )}
                  </dd>
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
