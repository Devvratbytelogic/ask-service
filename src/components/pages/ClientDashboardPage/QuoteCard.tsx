'use client'

export type QuoteData = {
    id: string
    vendorInitial: string
    vendorAvatarColor: string
    vendorName: string
    rating: number
    ratingCount: string
    amount: string
    unit: string
    description: string
    isBest?: boolean
    isAccepted?: boolean
}

type QuoteCardProps = QuoteData & {
    onAccept?: (e: React.MouseEvent) => void
    onIgnore?: (e: React.MouseEvent) => void
}

export default function QuoteCard({
    vendorInitial,
    vendorAvatarColor,
    vendorName,
    rating,
    ratingCount,
    amount,
    unit,
    description,
    isBest,
    isAccepted,
    onAccept,
    onIgnore,
}: QuoteCardProps) {
    const fullStars = Math.min(5, Math.floor(rating))
    const emptyStars = 5 - fullStars

    return (
        <div
            className={`rounded-xl p-3.5 border transition-all duration-200 ${
                isBest || isAccepted
                    ? 'bg-[#0D2018] border-trust-green/30'
                    : 'bg-[#161D2B] border-white/7 hover:border-white/12'
            }`}
        >
            {/* Vendor info + badge */}
            <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                    <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ backgroundColor: vendorAvatarColor }}
                    >
                        {vendorInitial}
                    </span>
                    <div>
                        <p className="text-[13px] font-bold text-white leading-none mb-0.5">{vendorName}</p>
                        <p className="text-[11px] flex items-center gap-0.5">
                            <span className="text-amber">
                                {'★'.repeat(fullStars)}
                                {'☆'.repeat(emptyStars)}
                            </span>
                            <span className="text-white/30 ml-1">{ratingCount}</span>
                        </p>
                    </div>
                </div>
                {isBest && !isAccepted && (
                    <span className="text-[9px] font-extrabold uppercase tracking-[0.5px] bg-trust-green/15 text-[#6EE7B7] border border-trust-green/20 px-[7px] py-[2px] rounded-[4px]">
                        Meilleur
                    </span>
                )}
                {isAccepted && (
                    <span className="text-[9px] font-extrabold uppercase tracking-[0.5px] bg-primaryColor/15 text-[#93C5FD] border border-primaryColor/20 px-[7px] py-[2px] rounded-[4px]">
                        Accepté
                    </span>
                )}
            </div>

            {/* Amount */}
            <p className="text-2xl font-extrabold tracking-tight text-white mb-1.5 leading-none">
                {amount}{' '}
                <span className="text-sm font-medium text-white/40">{unit}</span>
            </p>

            {/* Description */}
            <p className="text-xs text-white/40 leading-relaxed mb-3 line-clamp-2">{description}</p>

            {/* Action buttons */}
            {isAccepted ? (
                <div className="flex items-center gap-1 text-xs text-[#6EE7B7] px-2.5 py-2 bg-trust-green/8 rounded-lg">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <polyline points="20,6 9,17 4,12" />
                    </svg>
                    Devis accepté · Mission confirmée
                </div>
            ) : (
                <div className="flex gap-1.5">
                    <button
                        type="button"
                        onClick={onAccept}
                        className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-linear-to-br from-trust-green to-[#059669] text-white text-xs font-bold cursor-pointer transition-all duration-200 hover:-translate-y-px shadow-[0_2px_8px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_12px_rgba(16,185,129,0.35)]"
                    >
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <polyline points="20,6 9,17 4,12" />
                        </svg>
                        Accepter
                    </button>
                    <button
                        type="button"
                        onClick={onIgnore}
                        className="px-2.5 py-2 rounded-lg bg-white/4 border border-white/8 text-white/40 text-xs font-medium cursor-pointer transition-all duration-200 hover:bg-white/8 hover:text-white/70"
                    >
                        Ignorer
                    </button>
                </div>
            )}
        </div>
    )
}
