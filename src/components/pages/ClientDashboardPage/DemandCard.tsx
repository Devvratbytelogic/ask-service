'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { IAllRequestsDataEntity } from '@/types/allRequests'
import QuoteCard from './QuoteCard'
import { LocationIconSVG, CalendarIconSVG, FileIconSVG, ClockCircleOutlineIconSVG, ChevronIconSVG } from '@/components/library/AllSVG'
import moment from 'moment'
import { getEditRequestRoutePath } from '@/routes/routes'
import { openModal } from '@/redux/slices/allModalSlice'
import { useGetServiceCategoriesQuery } from '@/redux/rtkQueries/clientSideGetApis'
import { useAcceptQuoteMutation, useIgnoreQuoteMutation } from '@/redux/rtkQueries/allPostApi'

type DemandCardProps = {
    demand: IAllRequestsDataEntity
    isExpanded: boolean
    onToggle: () => void
}

const STATUS_CONFIG: Record<string, { classes: string; icon: React.ReactNode }> = {
    open: {
        classes: 'bg-trust-green/15 text-[#6EE7B7] border border-trust-green/20',
        icon: (
            <svg width="8" height="8" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
            </svg>
        ),
    },
    hold: {
        classes: 'bg-amber/[0.12] text-[#FCD34D] border border-amber/20',
        icon: (
            <svg width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
            </svg>
        ),
    },
    accepted: {
        classes: 'bg-primaryColor/[0.12] text-[#93C5FD] border border-primaryColor/20',
        icon: (
            <svg width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="20,6 9,17 4,12" />
            </svg>
        ),
    },
    ignore: {
        classes: 'bg-black/[0.05] dark:bg-white/[0.05] text-appTextSec border border-appBorderSub',
        icon: null,
    },
    closed: {
        classes: 'bg-black/[0.05] dark:bg-white/[0.05] text-appTextSec border border-appBorderSub',
        icon: null,
    },
}

const MetaItem = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-[5px] text-xs text-appTextSec">{children}</div>
)

export default function DemandCard({ demand, isExpanded, onToggle }: DemandCardProps) {
    const dispatch = useDispatch()
    const { data: serviceCategoriesData } = useGetServiceCategoriesQuery()
    const [menuOpen, setMenuOpen] = useState(false)
    const [actionQuoteId, setActionQuoteId] = useState<string | null>(null)
    const [actionType, setActionType] = useState<'accept' | 'ignore' | null>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const [acceptQuote] = useAcceptQuoteMutation()
    const [ignoreQuote] = useIgnoreQuoteMutation()

    const statusCfg = STATUS_CONFIG[demand?.quotes_status]
    const isClosed = demand?.quotes_status === 'closed'
    const isAccepted = demand?.quotes_status === 'accepted'
    const totalQuotesCount = demand?.total_quotes_count ?? 0
    const canEdit = !isClosed && !isAccepted && demand?.status_label !== 'Quotes received'
    const canClose = !isClosed
    const showActionsMenu = canEdit || canClose

    useEffect(() => {
        if (!menuOpen) return
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [menuOpen])

    const handleCloseRequest = () => {
        setMenuOpen(false)
        dispatch(openModal({
            componentName: 'CloseRequestModal',
            data: { request: demand },
            modalSize: 'lg',
            modalPadding: 'p-0!',
        }))
    }

    const handleAcceptQuote = async (e: React.MouseEvent, quoteId: string) => {
        e.stopPropagation()
        setActionQuoteId(quoteId)
        setActionType('accept')
        try {
            await acceptQuote({ requestId: demand._id, quoteId }).unwrap()
        } catch {
            // Error handled by RTK Query
        } finally {
            setActionQuoteId(null)
            setActionType(null)
        }
    }

    const handleIgnoreQuote = async (e: React.MouseEvent, quoteId: string) => {
        e.stopPropagation()
        setActionQuoteId(quoteId)
        setActionType('ignore')
        try {
            await ignoreQuote({ requestId: demand._id, quoteId }).unwrap()
        } catch {
            // Error handled by RTK Query
        } finally {
            setActionQuoteId(null)
            setActionType(null)
        }
    }

    const viewBtnClasses = isAccepted
        ? 'text-[#6EE7B7] bg-trust-green/10 border-trust-green/20'
        : isClosed
            ? 'text-appTextSec bg-black/3 dark:bg-white/3 border-appBorderSub'
            : totalQuotesCount === 0
                ? 'text-appTextSec bg-black/4 dark:bg-white/4 border-appBorder'
                : 'text-[#7BA3E8] bg-blue-light border-[#B8CEF7] hover:bg-[#E5EBFF] hover:border-[#A8C3F5]'

    const viewBtnLabel = isClosed ? 'Historique' : isAccepted ? 'Voir le détail' : 'Voir les devis'

    return (
        <div
            className={`bg-appCard rounded-2xl transition-all duration-250 cursor-pointer 
                ${menuOpen ? 'overflow-visible' : 'overflow-hidden'}
                ${isClosed ? 'opacity-60' : ''}
                ${isExpanded
                    ? 'border border-primaryColor/25'
                    : 'border border-appBorder hover:border-appBorder hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)]'
                }`}
            onClick={onToggle}
        >
            {/* Main row */}
            <div className="p-5 grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto_auto] gap-3 md:gap-4 items-center">
                {/* Service icon */}
                <div className="w-11 h-11 rounded-[13px] overflow-hidden shrink-0 bg-appBorder flex items-center justify-center">
                    {demand?.service_category?.image ? (
                        <Image
                            src={demand.service_category.image}
                            alt={demand.service_category.title ?? ''}
                            width={44}
                            height={44}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-[22px]">
                            {demand?.service_category?.title?.charAt(0)}
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span
                            className={`text-base font-extrabold tracking-[-0.2px] ${isClosed ? 'text-appTextSec' : 'text-appText'
                                }`}
                        >
                            {demand?.service_category?.title}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-[0.5px] px-2 py-[3px] rounded-[5px] ${statusCfg?.classes}`}>
                            {statusCfg?.icon}
                            {demand?.quotes_status_label}
                        </span>
                        {demand?.reference_no && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-appTextSec border border-appBorderSub bg-black/3 dark:bg-white/3 px-2 py-[3px] rounded-[5px]">
                                <span className="text-appTextMuted">Réf.</span>
                                <span className="font-bold text-appText">{demand.reference_no}</span>
                            </span>
                        )}
                        {demand?.new_quotes_count && demand?.new_quotes_count > 0 ? (
                            <span className="text-[10px] font-bold text-[#FCD34D] bg-amber/10 border border-amber/20 px-[7px] py-[2px] rounded-[4px] uppercase tracking-[0.5px]">
                                {demand?.new_quotes_count} nouveaux
                            </span>
                        ) : null}
                    </div>
                    <div className="flex items-center gap-3.5 flex-wrap">
                        <MetaItem>
                            <LocationIconSVG />
                            {demand?.location}
                        </MetaItem>
                        <MetaItem>
                            <CalendarIconSVG />
                            {demand?.preferred_start_date}
                        </MetaItem>
                        {demand?.child_category?.title && (
                            <MetaItem>
                                <FileIconSVG />
                                {demand?.child_category?.title}
                            </MetaItem>
                        )}
                        <MetaItem>
                            <ClockCircleOutlineIconSVG />
                            Créée {moment(demand?.createdAt ?? '').locale('fr').fromNow()} ({moment(demand?.createdAt ?? '').locale('fr').format('DD MMM YYYY [à] HH:mm')})                        </MetaItem>
                    </div>
                </div>

                {/* Quotes count — hidden on mobile */}
                <div className="hidden md:block shrink-0 text-center">
                    <p
                        className={`text-[22px] font-extrabold leading-none ${isAccepted
                            ? 'text-[#6EE7B7]'
                            : totalQuotesCount === 0
                                ? 'text-appTextMuted'
                                : 'text-appText'
                            }`}
                    >
                        {totalQuotesCount}
                    </p>
                    <p className="text-[10px] text-appTextMuted mt-[2px]">devis reçus</p>
                    {demand?.new_quotes_count && demand?.new_quotes_count > 0 ? (
                        <p className="flex items-center gap-[3px] text-[10px] font-bold text-[#6EE7B7] mt-[3px]">
                            <svg width="8" height="8" fill="currentColor" viewBox="0 0 8 8">
                                <circle cx="4" cy="4" r="4" />
                            </svg>
                            {demand.new_quotes_count} nouveaux
                        </p>
                    ) : isAccepted ? (
                        <p className="flex items-center gap-[3px] text-[10px] font-bold text-[#6EE7B7] mt-[3px]">
                            <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <polyline points="20,6 9,17 4,12" />
                            </svg>
                            {demand.accepted_quotes_count ?? 1} accepté{(demand.accepted_quotes_count ?? 1) > 1 ? 's' : ''}
                        </p>
                    ) : totalQuotesCount === 0 ? (
                        <p className="text-[10px] text-appTextMuted mt-[3px]">Bientôt…</p>
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
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-[10px] border text-xs font-semibold cursor-pointer transition-all duration-200 ${viewBtnClasses}`}
                    >
                        {viewBtnLabel}
                        <span className={`inline-flex transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                            <ChevronIconSVG />
                        </span>
                    </button>
                    {showActionsMenu && (
                        <div ref={menuRef} className="relative">
                            <button
                                type="button"
                                onClick={() => setMenuOpen((prev) => !prev)}
                                className="w-8 h-8 rounded-[8px] bg-black/5 dark:bg-white/5 border border-appBorder text-appTextSec flex items-center justify-center text-[14px] cursor-pointer transition-all duration-200 hover:bg-black/8 dark:hover:bg-white/10 hover:text-appText"
                                aria-label="Options"
                                aria-haspopup="menu"
                                aria-expanded={menuOpen}
                            >
                                ···
                            </button>
                            {menuOpen && (
                                <div
                                    role="menu"
                                    className="absolute right-0 top-full z-50 mt-1.5 min-w-[190px] rounded-[10px] border border-appBorder bg-appCard py-1 shadow-[0_8px_24px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
                                >
                                    {canEdit && (
                                        <Link
                                            href={getEditRequestRoutePath(demand._id)}
                                            role="menuitem"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setMenuOpen(false)
                                            }}
                                            className="flex w-full items-center px-3.5 py-2.5 text-[13px] font-medium text-appText no-underline cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                                        >
                                            Modifier
                                        </Link>
                                    )}
                                    {canClose && (
                                        <button
                                            type="button"
                                            role="menuitem"
                                            onClick={handleCloseRequest}
                                            className="flex w-full items-center px-3.5 py-2.5 text-[13px] font-medium text-appTextSec cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                                        >
                                            Clôturer la demande
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Expanded quotes panel */}
            {isExpanded && (
                <div className="border-t border-appBorderSub bg-appSurface px-5 py-4 animate-hero-fade-up">
                    {/* Accepted banner — shown when a quote was accepted */}
                    {isAccepted && (() => {
                        const acceptedQuote = demand?.quotes?.find((q) => q?.status?.toLowerCase() === 'accepted')
                        if (!acceptedQuote) return null
                        return (
                            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-trust-green/8 border border-trust-green/20 rounded-[10px] mb-3">
                                <div className="w-7 h-7 rounded-[8px] bg-trust-green/15 flex items-center justify-center shrink-0">
                                    <svg width="14" height="14" fill="none" stroke="#6EE7B7" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <polyline points="20,6 9,17 4,12" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-[#6EE7B7] leading-none mb-0.5">
                                        Devis de {acceptedQuote.provider_name} accepté · {acceptedQuote.price_display}
                                    </p>
                                    <p className="text-[11px] text-appTextSec">Mission confirmée · Contact transmis</p>
                                </div>
                            </div>
                        )
                    })()}

                    {/* Panel header */}
                    {totalQuotesCount > 0 && (
                        <div className="flex items-center justify-between mb-3.5">
                            <p className="text-[13px] font-bold text-appText">
                                {totalQuotesCount} devis reçus
                                {!isAccepted && ' · choisissez le meilleur professionnel'}
                            </p>
                            {!isAccepted && (
                                <p className="text-xs text-appTextMuted">
                                    Comparez et acceptez le devis qui vous convient
                                </p>
                            )}
                        </div>
                    )}

                    {/* Quotes grid */}
                    {totalQuotesCount > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                            {demand?.quotes && demand?.quotes?.length > 0 && demand?.quotes?.map((quote) => {
                                if (!quote?._id) return null
                                return (
                                <QuoteCard
                                    key={quote._id}
                                    quoteData={quote}
                                    onAccept={(e) => handleAcceptQuote(e, quote._id)}
                                    onIgnore={(e) => handleIgnoreQuote(e, quote._id)}
                                    isAccepting={actionQuoteId === quote._id && actionType === 'accept'}
                                    isIgnoring={actionQuoteId === quote._id && actionType === 'ignore'}
                                />
                                )
                            })}
                        </div>
                    ) :
                        <div className="text-center py-6 text-appTextMuted text-[13px]">
                            <div className="text-2xl mb-2">⏳</div>
                            Votre demande a été transmise aux professionnels. Les devis arriveront sous 24h.
                        </div>
                    }
                </div>
            )}
        </div>
    )
}
