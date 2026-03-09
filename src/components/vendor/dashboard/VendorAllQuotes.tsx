'use client'

import { DocumentArrowIconSVG } from '@/components/library/AllSVG'
import { generateLeadDetailRoutePath } from '@/routes/routes'
import { Button } from '@heroui/react'
import Link from 'next/link'
import moment from 'moment'
import { useGetVendorAllQuotesQuery } from '@/redux/rtkQueries/clientSideGetApis'
import type { IAllQuotes } from '@/types/allquotes'
import SupportAlert from './SupportAlert'

export default function VendorAllQuotes() {
    const { data, isLoading } = useGetVendorAllQuotesQuery()
    const quotes = data?.data ?? []

    return (
        <div className="mt-8 space-y-8">
            <div className="space-y-4">
                <div>
                    <h2 className="header_text_md text-fontBlack">All Quotes</h2>
                    <p className="text-sm text-darkSilver mt-1">
                        {isLoading ? 'Loading…' : `${quotes.length} quote${quotes.length !== 1 ? 's' : ''} sent • View and manage below`}
                    </p>
                </div>

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
                                You haven&apos;t sent any quotes yet. Unlock leads and submit quotes to see them here.
                            </p>
                            <Link href="/vendor/dashboard" className="inline-block mt-3 text-sm font-medium text-[#9C27B0] hover:underline">
                                Go to dashboard →
                            </Link>
                        </div>
                    )}
                    {!isLoading && quotes.length > 0 && quotes.map((quote: IAllQuotes) => (
                        <QuoteCard key={quote._id} quote={quote} />
                    ))}
                </div>
            </div>

            <SupportAlert
                title="Need help?"
                content="Contact vendor support for assistance with quotes or your account"
            />
        </div>
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
