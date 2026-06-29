'use client'

import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import { useGetCreatedServiceByIdQuery } from '@/redux/rtkQueries/clientSideGetApis'
import RequestAServiceForm from '@/components/pages/RequestAServicePage/RequestAServiceForm'
import AppLoader from '@/components/common/AppLoader'
import { getClientDashboardPageRoutePath } from '@/routes/routes'

export default function EditRequest({ requestId }: { requestId: string }) {
  const { data: response, isLoading, isError } = useGetCreatedServiceByIdQuery({ id: requestId })
  const request = response?.data

  if (isLoading) {
    return <AppLoader message="Chargement de votre demande…" />
  }

  if (isError || !request) {
    return (
      <section className="page-hero-bg flex min-h-screen flex-col items-center justify-center px-[4%] py-8">
        <div className="max-w-[480px] rounded-[24px] border border-appBorder bg-appCard p-8 text-center shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
          <h1 className="mb-2 text-[22px] font-extrabold text-appText">Demande introuvable</h1>
          <p className="mb-6 text-[14px] text-appTextSec">
            Cette demande n&apos;existe pas ou vous n&apos;y avez pas accès.
          </p>
          <Link
            href={getClientDashboardPageRoutePath()}
            className="inline-flex items-center gap-2 rounded-[12px] bg-primaryColor px-5 py-3 text-[14px] font-semibold text-white no-underline"
          >
            <FiArrowLeft size={14} />
            Retour à mes demandes
          </Link>
        </div>
      </section>
    )
  }


  return (
    <section className="page-hero-bg flex min-h-screen flex-col items-center px-[4%] py-8 sm:px-[5%] sm:py-12">
      <div className="mb-8 w-full max-w-[620px]">
        <Link
          href={getClientDashboardPageRoutePath()}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-appTextSec no-underline transition-colors hover:text-primaryColor"
        >
          <FiArrowLeft size={14} />
          Retour à mes demandes
        </Link>
      </div>

      <div className="mb-10 max-w-[580px] animate-hero-fade-down text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border-[1.5px] border-blue-light bg-appCard px-3.5 py-1.5 text-[12px] font-semibold text-primaryColor shadow-[0_2px_8px_rgba(27,79,255,0.1)]">
          <span className="size-1.5 shrink-0 rounded-full bg-primaryColor" />
          Modification
        </div>

        <h1 className="mb-3 text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.1] tracking-[-1.2px] text-appText">
          Modifier votre{' '}
          <span className="text-primaryColor">demande de service</span>
        </h1>

        <p className="text-[16px] leading-[1.65] text-appTextSec">
          Mettez à jour les détails de votre demande. Les professionnels verront vos modifications.
        </p>

        {request.reference_no && (
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-appBorder bg-appCard px-3 py-1 text-[12px] font-semibold text-appTextSec">
            <span>Référence :</span>
            <span className="font-bold text-appText">{request.reference_no}</span>
          </div>
        )}
      </div>

      <RequestAServiceForm
        mode="edit"
        requestId={requestId}
        data={request}
      />
    </section>
  )
}
