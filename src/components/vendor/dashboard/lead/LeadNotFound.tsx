import Link from 'next/link'
import { FiSearch } from 'react-icons/fi'
import { ArrowLeftIconSVG, ChevronRightIconSVG } from '@/components/library/AllSVG'
import { getVendorDashboardRoutePath } from '@/routes/routes'

export default function LeadNotFound() {
    return (
        <section className="bg-appBg overflow-y-auto p-5">
            <div className="flex items-center gap-1.75 text-[12px] text-appTextMuted mb-4.5">
                <Link
                    href={getVendorDashboardRoutePath()}
                    className="text-appTextMuted hover:text-appTextSec transition-colors flex items-center"
                >
                    <ArrowLeftIconSVG size={13} />
                </Link>
                <Link
                    href={getVendorDashboardRoutePath()}
                    className="text-appTextMuted hover:text-appTextSec transition-colors"
                >
                    Prospects
                </Link>
                <span className="text-appTextMuted flex">
                    <ChevronRightIconSVG size={12} />
                </span>
                <span className="text-appTextSec font-semibold">Introuvable</span>
            </div>

            <div className="flex min-h-[min(420px,calc(100vh-140px))] items-center justify-center px-4 py-10">
                <div className="w-full max-w-md rounded-2xl border border-appBorder bg-appCard px-6 py-8 text-center shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
                    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primaryColor/10 text-2xl text-primaryColor">
                        <FiSearch className="size-7" aria-hidden />
                    </div>
                    <h1 className="mb-2 text-[20px] font-extrabold tracking-[-0.3px] text-appText">
                        Prospect introuvable
                    </h1>
                    <p className="mb-6 text-[13px] leading-relaxed text-appTextSec">
                        Ce prospect n&apos;existe pas, a été retiré, ou vous n&apos;y avez plus accès.
                    </p>
                    <Link
                        href={getVendorDashboardRoutePath()}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primaryColor px-5 py-3 text-[14px] font-semibold text-white no-underline transition-opacity hover:opacity-90"
                    >
                        <ArrowLeftIconSVG size={14} />
                        Retour aux prospects
                    </Link>
                </div>
            </div>
        </section>
    )
}
