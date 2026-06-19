'use client'

import QuoteCard, { QuoteData } from './QuoteCard'

export type DemandStatus = 'open' | 'pending' | 'accepted' | 'closed'

export type AcceptedBanner = {
    vendorName: string
    amount: string
    confirmedText: string
}

export type DemandData = {
    id: string
    icon: string
    iconBg: string
    title: string
    status: DemandStatus
    location: string
    date: string
    type?: string
    timeAgo: string
    quotesCount: number
    newQuotesCount?: number
    acceptedBanner?: AcceptedBanner
    emptyQuotesMessage?: string
    quotes: QuoteData[]
}

type DemandCardProps = {
    demand: DemandData
    isExpanded: boolean
    onToggle: () => void
}

const STATUS_CONFIG: Record<
    DemandStatus,
    { label: string; classes: string; icon: React.ReactNode }
> = {
    open: {
        label: 'Ouverte',
        classes: 'bg-trust-green/15 text-[#6EE7B7] border border-trust-green/20',
        icon: (
            <svg width="8" height="8" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
            </svg>
        ),
    },
    pending: {
        label: 'En attente',
        classes: 'bg-amber/[0.12] text-[#FCD34D] border border-amber/20',
        icon: (
            <svg width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
            </svg>
        ),
    },
    accepted: {
        label: 'Devis accepté',
        classes: 'bg-primaryColor/[0.12] text-[#93C5FD] border border-primaryColor/20',
        icon: (
            <svg width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="20,6 9,17 4,12" />
            </svg>
        ),
    },
    closed: {
        label: 'Fermée',
        classes: 'bg-white/[0.05] text-white/35 border border-white/[0.08]',
        icon: null,
    },
}

const MetaItem = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-[5px] text-xs text-white/40">{children}</div>
)

const LocationIcon = () => (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-white/25 shrink-0">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    </svg>
)

const CalendarIcon = () => (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-white/25 shrink-0">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
)

const FileIcon = () => (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-white/25 shrink-0">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v13a2 2 0 0 1-2 2z" />
    </svg>
)

const ClockIcon = () => (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-white/25 shrink-0">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
    </svg>
)

const ChevronIcon = () => (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path d="m6 9 6 6 6-6" />
    </svg>
)

export default function DemandCard({ demand, isExpanded, onToggle }: DemandCardProps) {
    const statusCfg = STATUS_CONFIG[demand.status]
    const isClosed = demand.status === 'closed'
    const isAccepted = demand.status === 'accepted'
    const hasPendingQuotes = demand.status === 'open' && demand.quotesCount > 0
    const viewBtnClasses = isAccepted
        ? 'text-[#6EE7B7] bg-trust-green/10 border-trust-green/20'
        : isClosed
          ? 'text-white/35 bg-white/3 border-white/7'
          : demand.quotesCount === 0
            ? 'text-white/40 bg-white/4 border-white/8'
            : 'text-[#93C5FD] bg-primaryColor/[0.12] border-primaryColor/20 hover:bg-primaryColor/20 hover:text-white'

    const viewBtnLabel = isClosed ? 'Historique' : isAccepted ? 'Voir le détail' : 'Voir les devis'

    return (
        <div
            className={`bg-[#161D2B] rounded-2xl overflow-hidden transition-all duration-250 cursor-pointer ${
                isClosed ? 'opacity-60' : ''
            } ${
                isExpanded
                    ? 'border border-primaryColor/25'
                    : 'border border-white/7 hover:border-white/13 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)]'
            }`}
            onClick={onToggle}
        >
            {/* Main row */}
            <div className="p-5 grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto_auto] gap-3 md:gap-4 items-center">
                {/* Service icon */}
                <div
                    className="w-11 h-11 rounded-[13px] flex items-center justify-center text-[22px] shrink-0"
                    style={{ background: demand.iconBg }}
                >
                    {demand.icon}
                </div>

                {/* Content */}
                <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span
                            className={`text-base font-extrabold tracking-[-0.2px] ${
                                isClosed ? 'text-white/50' : 'text-white'
                            }`}
                        >
                            {demand.title}
                        </span>
                        <span
                            className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-[0.5px] px-2 py-[3px] rounded-[5px] ${statusCfg.classes}`}
                        >
                            {statusCfg.icon}
                            {statusCfg.label}
                        </span>
                        {demand.newQuotesCount && demand.newQuotesCount > 0 && (
                            <span className="text-[10px] font-bold text-[#FCD34D] bg-amber/10 border border-amber/20 px-[7px] py-[2px] rounded-[4px] uppercase tracking-[0.5px]">
                                {demand.newQuotesCount} nouveaux
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3.5 flex-wrap">
                        <MetaItem>
                            <LocationIcon />
                            {demand.location}
                        </MetaItem>
                        <MetaItem>
                            <CalendarIcon />
                            {demand.date}
                        </MetaItem>
                        {demand.type && (
                            <MetaItem>
                                <FileIcon />
                                {demand.type}
                            </MetaItem>
                        )}
                        <MetaItem>
                            <ClockIcon />
                            {demand.timeAgo}
                        </MetaItem>
                    </div>
                </div>

                {/* Quotes count — hidden on mobile */}
                <div className="hidden md:block shrink-0 text-center">
                    <p
                        className={`text-[22px] font-extrabold leading-none ${
                            isAccepted
                                ? 'text-[#6EE7B7]'
                                : demand.quotesCount === 0
                                  ? 'text-white/30'
                                  : 'text-white'
                        }`}
                    >
                        {demand.quotesCount}
                    </p>
                    <p className="text-[10px] text-white/30 mt-[2px]">devis reçus</p>
                    {demand.newQuotesCount && demand.newQuotesCount > 0 ? (
                        <p className="flex items-center gap-[3px] text-[10px] font-bold text-[#6EE7B7] mt-[3px]">
                            <svg width="8" height="8" fill="currentColor" viewBox="0 0 8 8">
                                <circle cx="4" cy="4" r="4" />
                            </svg>
                            {demand.newQuotesCount} nouveaux
                        </p>
                    ) : isAccepted ? (
                        <p className="flex items-center gap-[3px] text-[10px] font-bold text-[#6EE7B7] mt-[3px]">
                            <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <polyline points="20,6 9,17 4,12" />
                            </svg>
                            1 accepté
                        </p>
                    ) : demand.quotesCount === 0 ? (
                        <p className="text-[10px] text-white/20 mt-[3px]">Bientôt…</p>
                    ) : null}
                </div>

                {/* Actions */}
                <div
                    className="col-span-full md:col-span-1 flex items-center gap-1.5 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        type="button"
                        onClick={onToggle}
                        className={`flex items-center gap-[5px] px-3.5 py-2 rounded-[8px] border text-xs font-semibold transition-all duration-200 ${viewBtnClasses} ${
                            hasPendingQuotes ? 'hover:bg-primaryColor/20 hover:text-white' : ''
                        }`}
                    >
                        {viewBtnLabel}
                        <ChevronIcon />
                    </button>
                    <button
                        type="button"
                        className="w-8 h-8 rounded-[8px] bg-white/5 border border-white/8 text-white/40 flex items-center justify-center text-[14px] transition-all duration-200 hover:bg-white/10 hover:text-white"
                        aria-label="Options"
                    >
                        ···
                    </button>
                </div>
            </div>

            {/* Expanded quotes panel */}
            {isExpanded && (
                <div className="border-t border-white/6 bg-[#111827] px-5 py-4 animate-hero-fade-up">
                    {/* Accepted banner */}
                    {demand.acceptedBanner && (
                        <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-trust-green/8 border border-trust-green/20 rounded-[10px] mb-3">
                            <div className="w-7 h-7 rounded-[8px] bg-trust-green/15 flex items-center justify-center shrink-0">
                                <svg width="14" height="14" fill="none" stroke="#6EE7B7" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <polyline points="20,6 9,17 4,12" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[13px] font-bold text-[#6EE7B7] leading-none mb-0.5">
                                    Devis de {demand.acceptedBanner.vendorName} accepté ·{' '}
                                    {demand.acceptedBanner.amount}
                                </p>
                                <p className="text-[11px] text-white/35">{demand.acceptedBanner.confirmedText}</p>
                            </div>
                        </div>
                    )}

                    {/* Panel header */}
                    {demand.quotes.length > 0 && (
                        <div className="flex items-center justify-between mb-3.5">
                            <p className="text-[13px] font-bold text-white">
                                {demand.quotes.length} devis reçus
                                {!demand.acceptedBanner && ' · choisissez le meilleur professionnel'}
                            </p>
                            {!demand.acceptedBanner && (
                                <p className="text-xs text-white/30">
                                    Comparez et acceptez le devis qui vous convient
                                </p>
                            )}
                        </div>
                    )}

                    {/* Quotes grid */}
                    {demand.quotes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                            {demand.quotes.map((quote) => (
                                <QuoteCard
                                    key={quote.id}
                                    {...quote}
                                    onAccept={(e) => e.stopPropagation()}
                                    onIgnore={(e) => e.stopPropagation()}
                                />
                            ))}
                        </div>
                    ) : demand.emptyQuotesMessage ? (
                        <div className="text-center py-6 text-white/25 text-[13px]">
                            <div className="text-2xl mb-2">⏳</div>
                            {demand.emptyQuotesMessage}
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    )
}
