"use client"

import { Button } from "@heroui/react"
import { useRouter } from "next/navigation"
import { FiCheck, FiMail } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { closeModal, openModal } from "@/redux/slices/allModalSlice"
import { RootState } from "@/redux/appStore"

const WHAT_HAPPENS_NEXT = [
  {
    step: 1,
    title: "We match you with professionals",
    description: "We're notifying verified professionals in your area who match your requirements",
  },
  {
    step: 2,
    title: "Receive quotes within 24-48 hours",
    description: "Interested professionals will send you personalized quotes via email",
  },
  {
    step: 3,
    title: "Compare and choose",
    description: "Review profiles, ratings, and quotes to select the best professional for your needs",
  },
  {
    step: 4,
    title: "Get the job done",
    description: "Work directly with your chosen professional to complete the service",
  },
]



const SubmissionSuccess = () => {

  const { data } = useSelector((state: RootState) => state.allCommonModal)

  const router = useRouter()
  const dispatch = useDispatch()

  const handleReturnHome = () => {
    dispatch(closeModal())
    router.push("/")
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
          Request Submitted Successfully!
        </h2>
        <p className="mt-2 text-darkSilver text-sm xl:text-base">
          Your request has been received and is being processed
        </p>
        <p className="mt-1 text-sm xl:text-base">
          Reference:{" "}
          <span className="font-medium text-primaryColor">{data?.reference}</span>
        </p>
      </div>

      <div className="rounded-xl bg-primaryColor/10 p-4 text-left">
        <h3 className="mb-3 font-semibold text-fontBlack">What happens next?</h3>
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
          <p className="font-semibold text-fontBlack">Check your email</p>
          <p className="text-sm text-darkSilver">
            We&apos;ve sent a confirmation email with your request details and reference number
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
          Return to homepage
        </Button>
        <Button variant="bordered" onPress={handleSubmitAnother} className="w-full btn_radius">
          Submit another request
        </Button>
      </div>

      <p className="text-placeHolderText text-tiny">
        Need help? Contact us at{" "}
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
