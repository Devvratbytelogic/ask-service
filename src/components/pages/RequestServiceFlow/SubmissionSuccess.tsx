"use client"

import { Button } from "@heroui/react"
import { useRouter } from "next/navigation"
import { FiCheck, FiMail } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { getHomeRoutePath } from "@/routes/routes"
import { closeModal, openModal } from "@/redux/slices/allModalSlice"
import { RootState } from "@/redux/appStore"

const WHAT_HAPPENS_NEXT = [
  {
    step: 1,
    title: "Nous vous mettons en relation avec des professionnels",
    description: "Nous notifions les professionnels vérifiés de votre région qui correspondent à vos besoins",
  },
  {
    step: 2,
    title: "Recevez des devis sous 24-48 heures",
    description: "Les professionnels intéressés vous enverront des devis personnalisés par e-mail",
  },
  {
    step: 3,
    title: "Comparez et choisissez",
    description: "Consultez les profils, évaluations et devis pour sélectionner le meilleur professionnel selon vos besoins",
  },
  {
    step: 4,
    title: "Le travail est fait",
    description: "Travaillez directement avec le professionnel choisi pour réaliser la prestation",
  },
]



const SubmissionSuccess = () => {

  const { data } = useSelector((state: RootState) => state.allCommonModal)

  const router = useRouter()
  const dispatch = useDispatch()

  const handleReturnHome = () => {
    dispatch(closeModal())
    router.push(getHomeRoutePath())
  }

  const handleSubmitAnother = () => {
    dispatch(openModal({
      componentName: 'RequestServiceFlowIndex',
      data: {
        pincode: data?.pincode
      },
      modalSize: 'lg'
    }))
  }

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-white">
          <FiCheck className="text-2xl text-emerald-600" strokeWidth={3} />
        </span>
      </div>
      <div>
        <h2 className="text-xl font-bold text-fontBlack xl:text-2xl">
          Demande soumise avec succès !
        </h2>
        <p className="mt-2 text-darkSilver text-sm xl:text-base">
          Votre demande a bien été reçue et est en cours de traitement
        </p>
        <p className="mt-1 text-sm xl:text-base">
          Référence :{" "}
          <span className="font-medium text-primaryColor">{data?.reference}</span>
        </p>
      </div>

      <div className="rounded-xl bg-primaryColor/10 p-4 text-left">
        <h3 className="mb-3 font-semibold text-fontBlack">Que se passe-t-il ensuite ?</h3>
        <ol className="space-y-3">
          {WHAT_HAPPENS_NEXT.map((item) => (
            <li key={item.step} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primaryColor text-xs font-medium text-white">
                {item.step}
              </span>
              <div>
                <p className="font-medium text-fontBlack">{item.title}</p>
                <p className="text-sm text-darkSilver">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex items-start gap-3 rounded-xl bg-primaryColor/10 p-4 text-left">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primaryColor/20 text-primaryColor">
          <FiMail className="text-lg" />
        </span>
        <div>
          <p className="font-semibold text-fontBlack">Vérifiez votre e-mail</p>
          <p className="text-sm text-darkSilver">
            Nous vous avons envoyé un e-mail de confirmation avec les détails de votre demande et votre numéro de référence
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <Button
          color="primary"
          size="lg"
          className="w-full font-medium btn_radius"
          onPress={handleReturnHome}
        >
          Retour au tableau de bord
        </Button>
        {/* <Button variant="bordered" onPress={handleSubmitAnother} className="w-full btn_radius">
          Submit another request
        </Button> */}
      </div>

      <p className="text-placeHolderText text-tiny">
        Besoin d&apos;aide ? Contactez-nous à{" "}
        <a
          href="mailto:support@example.com"
          className="text-primaryColor hover:underline"
        >
          support@example.com
        </a>
      </p>
    </div>
  )
}

export default SubmissionSuccess
