import Link from 'next/link'
import { MagnifierIconSVG } from '@/components/library/AllSVG'
import { getVendorDashboardRoutePath } from '@/routes/routes'

export default function FindLeadsCTA({ availableLeadsCount }: { availableLeadsCount: number }) {
    return (
        <div className="bg-appSurface border border-dashed border-appBorder rounded-2xl px-10 py-10 text-center mt-2 animate-hero-fade-up">
            <h4 className="text-[16px] font-bold text-appText mb-2">
                Trouvez de nouveaux clients maintenant
            </h4>
            <p className="text-[13px] text-appTextSec mb-5">
                {availableLeadsCount} prospects disponibles dans votre zone — débloquez ceux qui vous intéressent.
            </p>
            <Link
                href={getVendorDashboardRoutePath({ leads: 'locked' })}
                className="inline-flex items-center gap-2 px-6 py-[11px] bg-linear-to-br from-primaryColor to-[#4F46E5] text-white rounded-[10px] text-[14px] font-bold transition-all duration-250 hover:-translate-y-px shadow-[0_4px_16px_rgba(27,79,255,0.3)] hover:shadow-[0_6px_20px_rgba(27,79,255,0.4)]"
            >
                <MagnifierIconSVG />
                Voir tous les prospects disponibles
            </Link>
        </div>
    )
}
