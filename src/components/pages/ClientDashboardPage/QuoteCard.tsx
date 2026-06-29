'use client'

import moment from 'moment'
import { useRouter } from 'next/navigation'
import { QuotesEntity } from '@/types/allRequests'
import { useUserAccessChatMutation } from '@/redux/rtkQueries/allPostApi'
import { getMessageRoutePath } from '@/routes/routes'

interface QuoteCardProps {
    quoteData: QuotesEntity | null
    onAccept?: (e: React.MouseEvent) => void
    onIgnore?: (e: React.MouseEvent) => void
    onViewDetails?: (e: React.MouseEvent) => void
    isAccepting?: boolean
    isIgnoring?: boolean
}

const AVATAR_COLORS = ['#16A34A', '#2563EB', '#7C3AED', '#DC2626', '#0369A1', '#D97706', '#0891B2']

function getAvatarColor(seed: string): string {
    let hash = 0
    for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash)
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export default function QuoteCard({ onAccept, onIgnore, onViewDetails, quoteData, isAccepting, isIgnoring }: QuoteCardProps) {
    const router = useRouter()
    const [userAccessChat, { isLoading: isAccessingChat }] = useUserAccessChatMutation()

    if (!quoteData) return null

    const quoteId = quoteData._id ?? quoteData.quote_id
    const vendorId = quoteData.vendor_id ?? quoteData.vendor?._id ?? ''
    const isAccepted = quoteData?.status?.toLowerCase() === 'accepted'
    const isIgnored = quoteData?.status?.toLowerCase() === 'ignored'
    const isActionLoading = isAccepting || isIgnoring || isAccessingChat
    const vendorName = quoteData?.provider_name ||
        `${quoteData?.vendor?.first_name ?? ''} ${quoteData?.vendor?.last_name ?? ''}`.trim()
    const vendorInitial = vendorName.charAt(0).toUpperCase()
    const avatarColor = getAvatarColor(quoteData?.vendor_id || vendorName)
    const rating = quoteData?.rating as number | null
    const fullStars = rating ? Math.min(5, Math.floor(rating)) : 0
    const emptyStars = 5 - fullStars

    const handleChatWithVendor = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!vendorId || !quoteId) return
        try {
            const response = await userAccessChat({
                userId: vendorId,
                quote_id: quoteId,
            }).unwrap()
            const chatId = response?.data?._id;
            router.push(chatId ? `${getMessageRoutePath()}?chatId=${chatId}` : getMessageRoutePath())
        } catch(error) {
            console.error('error accessing chat', error);
        }
    }

    return (
        <div
            className={`rounded-xl p-3.5 border transition-all duration-200 ${isAccepted
                ? 'bg-trust-green/8 border-trust-green/30'
                : 'bg-appCard border-appBorder hover:border-appBorder hover:shadow-[0_4px_14px_rgba(0,0,0,0.07)] dark:hover:shadow-[0_4px_14px_rgba(0,0,0,0.25)]'
                }`}
        >
            {/* Vendor info + badge */}
            <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                    <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ backgroundColor: avatarColor }}
                    >
                        {vendorInitial}
                    </span>
                    <div>
                        <p className="text-[13px] font-bold text-appText leading-none mb-0.5">{vendorName}</p>
                        <p className="text-[11px] flex items-center gap-0.5">
                            {/* {rating !== null && ( */}
                            <span className="text-amber">
                                {'★'.repeat(fullStars)}{'☆'.repeat(emptyStars)}
                            </span>
                            {/* )} */}
                            <span className="text-appTextMuted ml-1">
                                {quoteData?.reviews_count > 0
                                    ? `${quoteData?.reviews_count} avis`
                                    : ''}

                            </span>
                        </p>
                    </div>
                </div>

                {isAccepted ? (
                    <span className="text-[9px] font-extrabold uppercase tracking-[0.5px] bg-primaryColor/15 text-primaryColor border border-primaryColor/20 px-[7px] py-[2px] rounded-[4px]">
                        Accepté
                    </span>
                ) : isIgnored ? (
                    <span className="text-[9px] font-extrabold uppercase tracking-[0.5px] bg-black/5 dark:bg-white/5 text-appTextSec border border-appBorderSub px-[7px] py-[2px] rounded-[4px]">
                        Ignoré
                    </span>
                ) : null}
            </div>

            {/* Price */}
            <p className="text-2xl font-extrabold tracking-tight text-appText mb-1 leading-none">
                {quoteData?.price_display}
            </p>

            {/* Availability */}
            {quoteData?.available_start_date && (
                <p className="text-[11px] text-appTextMuted mb-1.5">
                    Disponible le {moment(quoteData.available_start_date).format('D MMM YYYY')}
                </p>
            )}

            {/* Description */}
            <p className="text-xs text-appTextSec leading-relaxed mb-3 line-clamp-2">
                {quoteData?.service_description}
            </p>

            {/* Action buttons */}
            {isAccepted ? (
                <div className="space-y-1.5">
                    <div className="flex items-center gap-1 text-xs text-trust-green px-2.5 py-2 bg-trust-green/10 border border-trust-green/20 rounded-lg">
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <polyline points="20,6 9,17 4,12" />
                        </svg>
                        Devis accepté · Mission confirmée
                    </div>
                    <button
                        type="button"
                        onClick={handleChatWithVendor}
                        disabled={isAccessingChat}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primaryColor text-white text-xs font-bold cursor-pointer transition-all duration-200 hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(27,79,255,0.25)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        {isAccessingChat ? 'Ouverture…' : 'Contacter le prestataire'}
                    </button>
                </div>
            ) : isIgnored ? (
                <div className="space-y-1.5">
                    <div className="flex items-center gap-1 text-xs text-appTextSec px-2.5 py-2 bg-black/5 dark:bg-white/5 border border-appBorderSub rounded-lg">
                        Devis ignoré
                    </div>
                    {onViewDetails && (
                        <button
                            type="button"
                            onClick={onViewDetails}
                            className="w-full py-2 rounded-lg border border-appBorder bg-appCard text-appText text-xs font-semibold cursor-pointer transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5"
                        >
                            Voir les détails
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-1.5">
                    <div className="flex gap-1.5">
                        <button
                            type="button"
                            onClick={onAccept}
                            disabled={isActionLoading}
                            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-linear-to-br from-trust-green to-[#059669] text-white text-xs font-bold cursor-pointer transition-all duration-200 hover:-translate-y-px shadow-[0_2px_8px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_12px_rgba(16,185,129,0.35)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <polyline points="20,6 9,17 4,12" />
                            </svg>
                            {isAccepting ? 'Acceptation…' : 'Accepter'}
                        </button>
                        <button
                            type="button"
                            onClick={onIgnore}
                            disabled={isActionLoading}
                            className="px-2.5 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-appBorder text-appTextSec text-xs font-medium cursor-pointer transition-all duration-200 hover:bg-black/8 dark:hover:bg-white/8 hover:text-appText disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isIgnoring ? '…' : 'Ignorer'}
                        </button>
                    </div>
                    {onViewDetails && (
                        <button
                            type="button"
                            onClick={onViewDetails}
                            className="w-full py-2 rounded-lg border border-primaryColor/25 bg-primaryColor/5 text-primaryColor text-xs font-semibold cursor-pointer transition-all duration-200 hover:bg-primaryColor/10"
                        >
                            Voir les détails
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
