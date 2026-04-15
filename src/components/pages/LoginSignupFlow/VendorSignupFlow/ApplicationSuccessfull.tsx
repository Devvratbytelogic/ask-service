"use client"

import { closeModal } from "@/redux/slices/allModalSlice"
import { Button } from "@heroui/react"
import Link from "next/link"
import { getVendorSupportRoutePath } from "@/routes/routes"
import { useDispatch } from "react-redux"
import { FiInfo } from "react-icons/fi"
import { FaCheck } from "react-icons/fa6"

const NEXT_STEPS = [
    "Notre équipe de vérification va examiner vos documents",
    "Vous recevrez une notification par e-mail une fois votre inscription approuvée",
    "Une fois votre inscription approuvée, vous pourrez commencer à voir et déverrouiller les leads",
    "Soumettre des devis et connecter avec les clients",
]

const ApplicationSuccessfull = () => {
    
    const dispatch = useDispatch()

    return (
        <>
            <div className="space-y-6 w-11/12">
                <div className="space-y-3">
                    <h1 className="header_text">
                        Application <span className="text-darkSilver">Envoyée</span>
                    </h1>
                    <p className="text-fontBlack text-base">
                        Merci pour la complétion de votre inscription en tant que professionnel. Notre équipe
                        est en train de revoir vos documents et vous reviendra dans un délai de{" "}
                        <span className="font-semibold">2 - 3 jours</span>.
                    </p>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-100 border border-amber-200 text-amber-800">
                        <span className="size-2 rounded-full bg-amber-500" aria-hidden />
                        Vérification en attente
                    </span>
                </div>

                <div className="rounded-2xl bg-primaryColor/10 border border-primaryColor/20 p-4 sm:p-5 space-y-4">
                    <h2 className="flex items-center gap-2 font-semibold text-fontBlack text-base">
                        <FiInfo className="size-5 text-primaryColor shrink-0" />
                        Que se passe-t-il ensuite ?
                    </h2>
                    <ul className="space-y-3 list-none p-0 m-0">
                        {NEXT_STEPS.map((step, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <FaCheck className="size-5 text-primaryColor shrink-0 mt-0.5" />
                                <span className="text-fontBlack text-sm">{step}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="text-darkSilver text-sm">
                    Nous vous enverrons des mises à jour à votre adresse e-mail enregistrée.
                </p>
            </div>
            <div className="space-y-6.25 pt-2 w-11/12">
                <Button
                    type="button"
                    className="btn_bg_blue btn_radius btn_padding font-medium text-sm w-full"
                    onPress={() => dispatch(closeModal())}
                >
                    Continuer
                </Button>
                <p className="text-base text-fontBlack text-center">
                    Vous avez des questions ?{" "}
                    <Link
                        href={getVendorSupportRoutePath()}
                        target="_blank"
                        className="text-primaryColor cursor-pointer underline underline-offset-2"
                    >
                        Contacter l'assistance
                    </Link>
                </p>
            </div>
        </>
    )
}

export default ApplicationSuccessfull
