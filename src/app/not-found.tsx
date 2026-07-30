import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import { getHomeRoutePath } from '@/routes/routes'

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-[4%]">
      <div className="max-w-120 rounded-2xl border border-appBorder bg-appCard p-8 text-center shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
        <p className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-primaryColor">Erreur 404</p>
        <h1 className="mb-2 text-[22px] font-extrabold text-appText">Page introuvable</h1>
        <p className="mb-6 text-[14px] text-appTextSec">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href={getHomeRoutePath()}
          className="inline-flex items-center gap-2 rounded-xl bg-primaryColor px-5 py-3 text-[14px] font-semibold text-white no-underline"
        >
          <FiArrowLeft size={14} />
          Retour à l&apos;accueil
        </Link>
      </div>
    </section>
  )
}
