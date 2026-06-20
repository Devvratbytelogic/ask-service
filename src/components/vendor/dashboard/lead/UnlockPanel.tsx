'use client'

import { useCallback, useEffect } from 'react'
import Link from 'next/link'
import {
    CalendarOutlineIconSVG,
    CheckmarkIconSVG,
    ClockCircleIconSVG,
    LocationPinIconSVG,
    LockPrimaryColorSVG,
} from '@/components/library/AllSVG'
import { getVendorWalletRoutePath } from '@/routes/routes'
import type { LeadDetail } from './types'

// ─── Verified List Item ────────────────────────────────────────────────────────

function VerifiedListItem({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-[7px] text-[12px] text-appTextSec">
            <div className="w-[17px] h-[17px] rounded-full bg-trust-green/15 flex items-center justify-center shrink-0">
                <span className="text-trust-green flex">
                    <CheckmarkIconSVG size={9} />
                </span>
            </div>
            {children}
        </div>
    )
}

// ─── Unlock Modal ─────────────────────────────────────────────────────────────

interface ModalProps {
    lead: LeadDetail
    walletBalance: number
    onClose: () => void
    onConfirm: () => void
}

function UnlockModal({ lead, walletBalance, onClose, onConfirm }: ModalProps) {
    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [onClose])

    return (
        <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-200 flex items-center justify-center animate-fade-in"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div className="bg-appCard border border-appBorder rounded-[20px] p-7 max-w-[400px] w-[92%] shadow-[0_24px_60px_rgba(0,0,0,0.5)] animate-slide-up">
                <div className="w-14 h-14 rounded-2xl bg-primaryColor/15 border border-primaryColor/20 flex items-center justify-center text-[26px] mb-4">
                    🔓
                </div>
                <h3 className="text-[20px] font-extrabold text-appText mb-2 tracking-[-0.3px]">
                    Débloquer ce prospect ?
                </h3>
                <p className="text-[13px] text-appTextSec leading-[1.65] mb-4">
                    Vous accéderez immédiatement aux coordonnées complètes du client.{' '}
                    {lead.credits} crédits seront déduits de votre wallet.
                </p>

                <div className="bg-black/3 dark:bg-white/4 border border-appBorder rounded-[12px] p-3.5 mb-4 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[13px]">
                        <span className="text-appTextSec">Service</span>
                        <span className="font-semibold text-appText">{lead.serviceLabel}</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                        <span className="text-appTextSec">Localisation</span>
                        <span className="font-semibold text-appText">{lead.location}</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                        <span className="text-appTextSec">Date</span>
                        <span className="font-semibold text-appText">{lead.dateInfo}</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px]">
                        <span className="text-appTextSec">Votre solde</span>
                        <span className="font-semibold text-appText">{walletBalance} crédits</span>
                    </div>
                    <div className="flex justify-between items-center text-[13px] pt-2.5 mt-0.5 border-t border-appBorderSub">
                        <span className="text-appTextSec">Coût du déblocage</span>
                        <span className="font-extrabold text-amber text-[16px]">
                            🪙 {lead.credits} crédits
                        </span>
                    </div>
                </div>

                <div className="flex gap-2.5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 rounded-[10px] bg-black/5 dark:bg-white/7 text-appTextSec text-[13px] font-semibold transition-all duration-200 hover:bg-black/8 dark:hover:bg-white/12 hover:text-appText"
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-2 py-3 rounded-[10px] bg-linear-to-br from-primaryColor to-[#4F46E5] text-white text-[14px] font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(27,79,255,0.35)] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(27,79,255,0.45)]"
                    >
                        <CheckmarkIconSVG size={14} />
                        Confirmer · {lead.credits} crédits
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Unlock Panel ─────────────────────────────────────────────────────────────

interface Props {
    lead: LeadDetail
    isUnlocked: boolean
    walletBalance: number
    modalOpen: boolean
    onOpenModal: () => void
    onCloseModal: () => void
    onConfirmUnlock: () => void
}

export default function UnlockPanel({
    lead,
    isUnlocked,
    walletBalance,
    modalOpen,
    onOpenModal,
    onCloseModal,
    onConfirmUnlock,
}: Props) {
    const handleConfirm = useCallback(() => {
        onConfirmUnlock()
    }, [onConfirmUnlock])

    return (
        <>
            <aside className="bg-appBg border-l border-appBorder p-[18px_14px] sticky top-[58px] h-[calc(100vh-58px)] overflow-y-auto space-y-3">
                {/* ── Unlock Card ── */}
                <div className="bg-appCard border border-appBorder rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="px-[18px] py-3.5 bg-linear-to-r from-primaryColor/15 to-amber/8 border-b border-appBorderSub flex items-center justify-between">
                        <div className="flex items-center gap-[7px] text-[13px] font-bold text-appText">
                            <span className="text-appTextSec flex">
                                <LockPrimaryColorSVG className="w-[14px] h-[14px]" />
                            </span>
                            Déblocage sécurisé
                        </div>
                    </div>

                    <div className="p-4 flex flex-col gap-3.5">
                        {/* Price Display */}
                        <div className="text-center py-2">
                            {isUnlocked ? (
                                <div className="text-[26px] font-extrabold text-trust-green tracking-[-1px] leading-none flex items-center justify-center gap-2">
                                    ✅ Prospect débloqué !
                                </div>
                            ) : (
                                <>
                                    <div className="text-[40px] font-extrabold text-appText tracking-[-1.5px] leading-none flex items-center justify-center gap-1.5">
                                        <span className="text-[28px]">🪙</span>
                                        {lead.credits}
                                    </div>
                                    <div className="text-[12px] text-appTextMuted mt-1">
                                        crédits à déduire de votre wallet
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Wallet Row */}
                        <div className="flex items-center justify-between gap-3 px-3 py-2.5 bg-black/3 dark:bg-white/4 border border-appBorder rounded-[10px]">
                            <div className="flex items-center gap-1.5 min-w-0">
                                <span className="shrink-0 text-[14px]">🪙</span>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[11px] text-appTextSec">Votre solde</span>
                                    <span className="text-[13px] font-bold text-amber whitespace-nowrap">{walletBalance} crédits</span>
                                </div>
                            </div>
                            <Link
                                href={getVendorWalletRoutePath()}
                                className="text-[12px] font-semibold text-primaryColor bg-blue-light dark:bg-primaryColor/15 px-2.5 py-1.5 rounded-[8px] transition-all duration-200 hover:bg-primaryColor hover:text-white shrink-0 whitespace-nowrap"
                            >
                                + Recharger
                            </Link>
                        </div>

                        {/* Verified List */}
                        {!isUnlocked && (
                            <div className="flex flex-col gap-1.5">
                                <VerifiedListItem>Email client vérifié</VerifiedListItem>
                                <VerifiedListItem>Numéro de téléphone actif</VerifiedListItem>
                                <VerifiedListItem>Coordonnées complètes débloquées</VerifiedListItem>
                            </div>
                        )}

                        {/* Competitors Warning */}
                        {!isUnlocked && lead.competitorsCount > 0 && (
                            <div className="px-3 py-2.5 bg-linear-to-r from-orange-500/15 to-amber/10 border border-orange-500/30 rounded-[10px] flex items-center gap-2">
                                <span className="text-[18px] shrink-0">⚡</span>
                                <p className="text-[12px] font-semibold text-[#FDBA74] leading-[1.4]">
                                    {lead.competitorsCount} professionnels ont déjà consulté cette
                                    demande — ne perdez pas ce client !
                                </p>
                            </div>
                        )}

                        {/* CTA Button */}
                        {isUnlocked ? (
                            <div className="w-full py-[15px] bg-linear-to-br from-trust-green to-[#059669] text-white rounded-[12px] text-[15px] font-bold text-center shadow-[0_4px_20px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2">
                                <CheckmarkIconSVG size={15} />
                                Prospect débloqué !
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={onOpenModal}
                                className="w-full py-[15px] bg-linear-to-br from-primaryColor to-[#4F46E5] text-white rounded-[12px] text-[15px] font-bold cursor-pointer transition-all duration-250 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(27,79,255,0.4),0_1px_0_rgba(255,255,255,0.1)_inset] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(27,79,255,0.5)] hover:brightness-105 active:translate-y-0"
                            >
                                <span className="flex">
                                    <LockPrimaryColorSVG className="w-[15px] h-[15px]" />
                                </span>
                                Débloquer ce prospect
                            </button>
                        )}

                        {/* Limit Note */}
                        {!isUnlocked && (
                            <div className="flex items-center justify-center gap-1 text-[11px] text-appTextMuted">
                                <ClockCircleIconSVG size={11} />
                                Prospect limité dans le temps
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Mini Summary ── */}
                <div className="bg-black/3 dark:bg-white/3 border border-appBorder rounded-[12px] p-3.5">
                    <div className="text-[13px] font-bold text-appText mb-2.5 flex items-center gap-1.5">
                        {lead.serviceLabel}
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] text-appTextSec mb-[5px]">
                        <span className="text-appTextMuted flex shrink-0">
                            <LocationPinIconSVG size={11} />
                        </span>
                        {lead.location}
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] text-appTextSec mb-[5px]">
                        <span className="text-appTextMuted flex shrink-0">
                            <CalendarOutlineIconSVG size={11} />
                        </span>
                        {lead.dateInfo} · {lead.staffInfo}
                    </div>
                    <div className="flex items-center gap-[5px] text-[12px] font-bold text-amber pt-2.5 mt-2.5 border-t border-appBorderSub">
                        <span>🪙</span>
                        {lead.credits} crédits pour accéder
                    </div>
                </div>
            </aside>

            {/* ── Modal ── */}
            {modalOpen && (
                <UnlockModal
                    lead={lead}
                    walletBalance={walletBalance}
                    onClose={onCloseModal}
                    onConfirm={handleConfirm}
                />
            )}
        </>
    )
}
