'use client'

import { BackArrowSVG, DocumentArrowIconSVG } from '@/components/library/AllSVG'
import { generateLeadDetailRoutePath, getVendorDashboardRoutePath } from '@/routes/routes'
import { Button } from '@heroui/react'
import Link from 'next/link'
import moment from 'moment'
import 'moment/locale/fr'
import { useGetVendorAllQuotesQuery } from '@/redux/rtkQueries/clientSideGetApis'
import type { IAllQuotes } from '@/types/allquotes'
import SupportAlert from './SupportAlert'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const DESCRIPTION_TOGGLE_MIN_CHARS = 200

export default function VendorAllQuotes() {
    const router = useRouter()
    const { data, isLoading } = useGetVendorAllQuotesQuery()
    const rawQuotes = data?.data ?? []
    const quotes = [...rawQuotes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return (
        <>
            <div className="space-y-8">
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0">
                            <Button isIconOnly className="btn_radius btn_bg_white shrink-0" onPress={() => router.push(getVendorDashboardRoutePath({ leads: 'purchased' }))}>
                                <BackArrowSVG />
                            </Button>
                            <div>
                                <h2 className="header_text_md text-fontBlack">Mes Devis</h2>
                                <p className="text-sm text-darkSilver mt-1">
                                    {isLoading ? 'Chargement…' : `${quotes.length} devis envoyés • Consultez et gérez ci-dessous`}
                                </p>
                            </div>
                        </div>
                    </div>
                                {/* <div>
                                    <h2 className="header_text_md text-fontBlack">Mes Devis</h2>
                                    <p className="text-sm text-darkSilver mt-1">
                                        {isLoading ? 'Chargement…' : `${quotes.length} devis envoyés • Consultez et gérez ci-dessous`}
                                    </p>
                                </div> */}

                    <div className="flex flex-col gap-4">
                        {isLoading && (
                            <div className="rounded-2xl border border-borderDark bg-white p-8 text-center">
                                <p className="text-darkSilver">Loading quotes…</p>
                            </div>
                        )}
                        {!isLoading && quotes.length === 0 && (
                            <div className="rounded-2xl border border-borderDark bg-white p-8 text-center">
                                <div className="flex justify-center mb-3">
                                    <DocumentArrowIconSVG className="size-12 text-[#9C27B0]/50" />
                                </div>
                                <p className="text-darkSilver">
                                    Vous n'avez encore envoyé de devis. Débloquez des prospects et envoyez vos devis.
                                </p>
                                <Link href="/vendor/dashboard" className="inline-block mt-3 text-sm font-medium text-[#9C27B0] hover:underline">
                                    Retour au tableau de bord →
                                </Link>
                            </div>
                        )}
                        {!isLoading && quotes.length > 0 && quotes.map((quote: IAllQuotes) => (
                            <QuoteCard key={quote._id} quote={quote} />
                        ))}
                    </div>
                </div>

                <SupportAlert
                    title="Besoin d'aide ?"
                    content="Contactez le support prestataire si vous avez besoin d'aide avec vos devis ou votre compte."
                />
            </div>
        </>
    )
}

const STATUS_LABELS: Record<string, string> = {
    SENT: 'Envoyé',
    IGNORED: 'Réjeté',
    ACCEPTED: 'Accepté',
    REJECTED: 'Réjeté',
}

function translateStatus(status: string): string {
    return STATUS_LABELS[status] ?? status
}

function QuoteCard({ quote }: { quote: IAllQuotes }) {
    const currencySymbol = quote.currency === 'EUR' ? '€' : (quote.currency ?? '€')
    const [descriptionExpanded, setDescriptionExpanded] = useState(false)
    const descriptionText = quote.service_description || 'Devis'
    const showDescriptionToggle = descriptionText.length > DESCRIPTION_TOGGLE_MIN_CHARS
    return (
        <div className="rounded-2xl border border-borderDark bg-white p-6 flex flex-col lg:flex-row lg:items-start gap-4">
            <div className="flex-1 min-w-0 space-y-3">
                <div className="flex flex-wrap items-start gap-2">
                    <div className="min-w-0 flex-1">
                        <p
                            className={`font-bold text-lg text-fontBlack ${showDescriptionToggle && !descriptionExpanded ? 'line-clamp-4' : ''}`}
                        >
                            {descriptionText}
                        </p>
                        {showDescriptionToggle && (
                            <button
                                type="button"
                                onClick={() => setDescriptionExpanded((v) => !v)}
                                className="mt-1 text-sm cursor-pointer font-medium text-primaryColor hover:underline"
                            >
                                {descriptionExpanded ? 'Voir moins' : 'Voir plus'}
                            </button>
                        )}
                    </div>
                    <span className="inline-flex items-center rounded-full bg-[#F3E5F5] px-2.5 py-0.5 text-xs font-medium text-[#9C27B0] shrink-0">
                        {translateStatus(quote.status)}
                    </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-darkSilver">
                    <span>
                        <span className="font-medium text-fontBlack">{quote.quote_price}</span> {currencySymbol}
                    </span>
                    {quote.available_start_date && (
                        <span>Depuis {moment(quote.available_start_date).locale('fr').format('DD MMM YYYY')}</span>
                    )}
                    {quote.quote_valid_days != null && (
                        <span>Valable {quote.quote_valid_days} jours</span>
                    )}
                </div>
                <p className="text-sm text-darkSilver">
                    Envoyé {moment(quote.createdAt).locale('fr').fromNow()}
                </p>
            </div>
            <div className="shrink-0">
                <Button
                    as={Link}
                    href={generateLeadDetailRoutePath(quote.service_request_id)}
                    className="btn_radius btn_bg_blue"
                >
                    Voir le prospect
                </Button>
            </div>
        </div>
    )
}
