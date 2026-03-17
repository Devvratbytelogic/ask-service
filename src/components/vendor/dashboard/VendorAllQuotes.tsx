'use client'

import { BackArrowSVG, DocumentArrowIconSVG } from '@/components/library/AllSVG'
import { generateLeadDetailRoutePath, getVendorDashboardRoutePath } from '@/routes/routes'
import { Button } from '@heroui/react'
import Link from 'next/link'
import moment from 'moment'
import { useGetVendorAllQuotesQuery } from '@/redux/rtkQueries/clientSideGetApis'
import type { IAllQuotes } from '@/types/allquotes'
import SupportAlert from './SupportAlert'
import { useRouter } from 'next/navigation'

export default function VendorAllQuotes() {
    const router = useRouter()
    const { data, isLoading } = useGetVendorAllQuotesQuery()
    const quotes = data?.data ?? []

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

function QuoteCard({ quote }: { quote: IAllQuotes }) {
    return (
        <div className="rounded-2xl border border-borderDark bg-white p-6 flex flex-col lg:flex-row lg:items-start gap-4">
            <div className="flex-1 min-w-0 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-lg text-fontBlack">
                        {quote.service_description || 'Quote'}
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-[#F3E5F5] px-2.5 py-0.5 text-xs font-medium text-[#9C27B0]">
                        {quote.status}
                    </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-darkSilver">
                    <span>
                        <span className="font-medium text-fontBlack">{quote.quote_price}</span> {quote.currency}
                    </span>
                    {quote.available_start_date && (
                        <span>From {moment(quote.available_start_date).format('DD MMM YYYY')}</span>
                    )}
                    {quote.quote_valid_days != null && (
                        <span>Valid {quote.quote_valid_days} days</span>
                    )}
                </div>
                <p className="text-sm text-darkSilver">
                    Sent {moment(quote.createdAt).fromNow()}
                </p>
            </div>
            <div className="shrink-0">
                <Button
                    as={Link}
                    href={generateLeadDetailRoutePath(quote.service_request_id)}
                    className="btn_radius btn_bg_blue"
                >
                    View Lead
                </Button>
            </div>
        </div>
    )
}
