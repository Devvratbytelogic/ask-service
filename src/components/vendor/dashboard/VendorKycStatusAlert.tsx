'use client'

import Link from 'next/link'
import { WarningIconSVG } from '@/components/library/AllSVG'
import { getVendorAccountRoutePath } from '@/routes/routes'

type KycAlertContent = {
    title: string
    description: string
    badge: string
    showDocumentsLink: boolean
}

function getKycAlertContent(
    status: string,
    documentVerificationMessage?: string | null,
): KycAlertContent {
    const normalized = status.toUpperCase()

    if (normalized === 'PENDING' || !normalized) {
        return {
            title: 'Vérification de compte en cours',
            description:
                'Vos documents sont en cours d\'examen. Vous pourrez débloquer des prospects dès que votre compte aura été vérifié.',
            badge: 'En attente',
            showDocumentsLink: false,
        }
    }

    if (normalized === 'REJECTED') {
        return {
            title: 'Vérification de compte refusée',
            description:
                'Votre vérification a été refusée. Veuillez mettre à jour vos documents pour activer votre compte et débloquer des prospects.',
            badge: 'Action requise',
            showDocumentsLink: true,
        }
    }

    return {
        title: 'Documents non vérifiés',
        description:
            documentVerificationMessage?.trim() ||
            'Vos documents doivent être vérifiés avant de pouvoir débloquer des prospects. Complétez votre vérification pour accéder à toutes les fonctionnalités.',
        badge: 'Non actif',
        showDocumentsLink: true,
    }
}

interface VendorKycStatusAlertProps {
    kycStatus?: string | null
    canPurchaseLeads?: boolean
    documentVerified?: boolean
    documentVerificationMessage?: string | null
}

export default function VendorKycStatusAlert({
    kycStatus,
    canPurchaseLeads,
    documentVerified,
    documentVerificationMessage,
}: VendorKycStatusAlertProps) {
    const isActive = kycStatus?.toUpperCase() === 'ACTIVE'
    const isBlocked =
        canPurchaseLeads === false ||
        documentVerified === false ||
        (!!kycStatus && !isActive)

    if (!isBlocked) return null

    const { title, description, badge, showDocumentsLink } = getKycAlertContent(
        kycStatus ?? '',
        documentVerificationMessage,
    )

    return (
        <div
            role="alert"
            className="mb-6 flex flex-col sm:flex-row sm:items-start gap-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 animate-hero-fade-up"
        >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15">
                <WarningIconSVG />
            </div>
            <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[14px] font-bold text-appText">{title}</p>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                        <span className="size-1.5 rounded-full bg-amber-500" aria-hidden />
                        {badge}
                    </span>
                </div>
                <p className="text-[13px] leading-relaxed text-appTextSec">{description}</p>
                {showDocumentsLink && (
                    <Link
                        href={getVendorAccountRoutePath('documents')}
                        className="inline-flex items-center gap-1 text-[13px] font-semibold text-amber-700 hover:text-amber-600 dark:text-amber-300 dark:hover:text-amber-200 transition-colors"
                    >
                        Voir mes documents →
                    </Link>
                )}
            </div>
        </div>
    )
}
