"use client"

import { openModal } from "@/redux/slices/allModalSlice"
import { getLoginPageRoutePath, getRegistrationPageRoutePath } from "@/routes/routes"
import Link from "next/link"
import { useDispatch } from "react-redux"

type Step = {
    num: number
    title: string
    description: string
}

const CLIENT_STEPS: Step[] = [
    {
        num: 1,
        title: "Décrivez votre besoin",
        description:
            "Remplissez un formulaire simple : type de service, localisation, date souhaitée. Gratuit et sans engagement.",
    },
    {
        num: 2,
        title: "Recevez des devis",
        description:
            "Les professionnels vérifiés de votre secteur vous envoient leurs propositions en moins de 24h.",
    },
    {
        num: 3,
        title: "Choisissez le meilleur",
        description:
            "Comparez les offres, lisez les avis, et choisissez le professionnel qui vous convient. Aucun frais caché.",
    },
]

const VENDOR_STEPS: Step[] = [
    {
        num: 1,
        title: "Accédez aux demandes",
        description:
            "Consultez les leads disponibles dans votre secteur et votre zone d'intervention.",
    },
    {
        num: 2,
        title: "Déverrouillez avec des crédits",
        description:
            "Utilisez vos points pour accéder aux coordonnées du client. Pas d'abonnement — vous ne payez que ce que vous utilisez.",
    },
    {
        num: 3,
        title: "Contactez & remportez",
        description:
            "Envoyez votre devis directement au client et développez votre activité.",
    },
]

function StepItem({
    step,
    variant,
}: {
    step: Step
    variant: "client" | "vendor"
}) {
    const isClient = variant === "client"

    return (
        <div className="flex items-start gap-4">
            <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-[10px] text-[13px] font-extrabold ${
                    isClient
                        ? "bg-primaryColor text-white"
                        : "bg-amber-500 text-white"
                }`}
            >
                {step.num}
            </div>
            <div>
                <h4
                    className={`mb-1 text-[15px] font-bold ${
                        isClient ? "text-slate-900" : "text-white"
                    }`}
                >
                    {step.title}
                </h4>
                <p
                    className={`text-sm leading-[1.6] ${
                        isClient ? "text-slate-500" : "text-white/55"
                    }`}
                >
                    {step.description}
                </p>
            </div>
        </div>
    )
}

export default function HowDoesItWorkSection() {
    const dispatch = useDispatch()

    const openCustomerRequestModal = () => {
        dispatch(openModal({
            componentName: "RequestServiceFlowIndex",
            data: {},
            modalSize: "lg",
        }))
    }

    const openVendorSignupModal = () => {
        dispatch(openModal({
            componentName: "LoginSignupIndex",
            data: {
                componentName: "SelectUserType",
                preselectedUserType: "service",
            },
            modalSize: "full",
        }))
    }

    return (
        <section id="comment-ca-marche" className="px-[5%] py-[100px]">
            <div className="mb-[60px] text-center">
                <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full bg-blue-light px-3 py-1.5 text-xs font-bold tracking-[1px] text-primaryColor uppercase">
                    ✦ Fonctionnement
                </div>
                <h2 className="mb-4 text-[clamp(28px,3vw,42px)] leading-[1.15] font-extrabold tracking-[-0.8px] text-slate-900">
                    Simple pour tout le monde
                </h2>
                <p className="mx-auto max-w-[560px] text-[17px] leading-[1.65] text-slate-500">
                    Que vous soyez client ou professionnel, la plateforme s&apos;adapte à vos besoins en quelques étapes.
                </p>
            </div>

            <div className="mt-[60px] grid grid-cols-1 gap-10 lg:grid-cols-2">
                <div className="rounded-3xl border-[1.5px] border-slate-100 bg-slate-50 p-10">
                    <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-blue-light px-3 py-1.5 text-xs font-bold tracking-[1px] text-primaryColor uppercase">
                        👤 Pour les clients
                    </div>

                    <div className="flex flex-col gap-6">
                        {CLIENT_STEPS.map((step) => (
                            <StepItem key={step.num} step={step} variant="client" />
                        ))}
                    </div>

                    <div className="mt-8 flex flex-col gap-2">
                        <button
                            type="button"
                            onClick={openCustomerRequestModal}
                            className="inline-flex cursor-pointer items-center rounded-2xl bg-primaryColor px-8 py-3.5 text-base font-semibold text-white shadow-[0_4px_16px_rgba(27,79,255,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-dark hover:shadow-[0_8px_24px_rgba(27,79,255,0.35)]"
                        >
                            Poster ma demande →
                        </button>
                        <p className="text-[12px] text-slate-400">
                            Déjà un compte ?{' '}
                            <Link
                                href={getLoginPageRoutePath()}
                                className="font-semibold text-primaryColor no-underline hover:underline"
                            >
                                Se connecter →
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="rounded-3xl bg-linear-to-br from-[#1B0F00] to-[#2D1A00] p-10">
                    <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1.5 text-xs font-bold tracking-[1px] text-amber-500 uppercase">
                        🔧 Pour les professionnels
                    </div>

                    <div className="flex flex-col gap-6">
                        {VENDOR_STEPS.map((step) => (
                            <StepItem key={step.num} step={step} variant="vendor" />
                        ))}
                    </div>

                    <div className="mt-8 flex flex-col gap-2">
                        <Link
                            href={getRegistrationPageRoutePath()}
                            className="inline-flex cursor-pointer items-center rounded-2xl bg-amber-500 px-8 py-3.5 text-base font-semibold text-white shadow-[0_4px_16px_rgba(245,158,11,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-dark hover:shadow-[0_8px_24px_rgba(245,158,11,0.35)] no-underline"
                        >
                            Voir les demandes →
                        </Link>
                        <p className="text-[12px] text-white/40">
                            Déjà un compte ?{' '}
                            <Link
                                href={getLoginPageRoutePath()}
                                className="font-semibold text-white/60 no-underline transition-colors hover:text-white/90"
                            >
                                Se connecter →
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
