'use client'

import { ArrowSendIconSVG, LockPrimaryColorSVG, MailOutlineIconSVG, PhoneOutlineIconSVG, } from '@/components/library/AllSVG'
import { IAvailableLeadByCategoryContactDetailsEntity, IAvailableLeadByCategoryLeadsEntity, } from '@/types/availableLeadByCategory'

type ButtonVariant = 'green' | 'blue' | 'amber'
type LeadActionType = 'unlock' | 'navigate'

interface LeadActionConfig {
    primary: { label: string; variant: ButtonVariant; action: LeadActionType }
    secondary?: { label: string }
}

function getLeadActionConfig(lead: IAvailableLeadByCategoryLeadsEntity): LeadActionConfig {
    switch (lead.lead_status) {
        case 'new':
            return {
                primary: { label: 'Débloquer le prospect', variant: 'blue', action: 'unlock' },
                secondary: { label: 'Voir les détails' },
            }
        case 'unlocked':
            return {
                primary: { label: 'Contacter le client', variant: 'green', action: 'navigate' },
                secondary: { label: 'Voir le contact' },
            }
        case 'pending':
            return {
                primary: { label: 'Relancer maintenant', variant: 'amber', action: 'navigate' },
                secondary: { label: 'Voir le contact' },
            }
        case 'accepted':
            return {
                primary: { label: 'Voir le devis', variant: 'green', action: 'navigate' },
                secondary: { label: 'Voir le contact' },
            }
        case 'ignored':
        case 'withdrawn':
            return {
                primary: { label: 'Voir les détails', variant: 'blue', action: 'navigate' },
            }
        default:
            return {
                primary: { label: 'Voir les détails', variant: 'blue', action: 'navigate' },
            }
    }
}

function ClientBlock({ client }: { client: IAvailableLeadByCategoryContactDetailsEntity }) {
    return (
        <div className="px-3 py-2.5 bg-black/3 dark:bg-white/3 border border-appBorder rounded-[10px] mb-3.5 space-y-[5px]">
            <div className="flex items-center gap-2 text-[13px] text-appText">
                <div
                    className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                    style={{ background: 'rgba(16,185,129,0.12)' }}
                >
                    {client?.first_name?.charAt(0)}
                </div>
                <span className="font-bold text-appText">{client?.first_name} {client?.last_name}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-appTextSec">
                <span className="text-appTextMuted shrink-0 flex"><PhoneOutlineIconSVG /></span>
                {client?.phone}
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-appTextSec">
                <span className="text-appTextMuted shrink-0 flex"><MailOutlineIconSVG /></span>
                {client?.email}
            </div>
        </div>
    )
}

function PrimaryButton({ label, variant, action, disabled, onClick, }: {
    label: string
    variant: ButtonVariant
    action: LeadActionType
    disabled?: boolean
    onClick: () => void
}) {
    const variantClasses: Record<ButtonVariant, string> = {
        green: 'bg-linear-to-br from-trust-green to-[#059669] shadow-[0_3px_12px_rgba(16,185,129,0.25)] hover:shadow-[0_5px_16px_rgba(16,185,129,0.35)]',
        blue: 'bg-linear-to-br from-primaryColor to-[#4F46E5] shadow-[0_3px_12px_rgba(27,79,255,0.25)] hover:shadow-[0_5px_16px_rgba(27,79,255,0.35)]',
        amber: 'bg-linear-to-br from-amber to-[#F97316] shadow-[0_3px_12px_rgba(245,158,11,0.25)] hover:shadow-[0_5px_16px_rgba(245,158,11,0.35)]',
    }
    const iconMap: Record<ButtonVariant, React.ReactNode> = {
        green: <PhoneOutlineIconSVG size={13} />,
        blue: action === 'unlock' ? <LockPrimaryColorSVG className="size-3.5 text-white" /> : <ArrowSendIconSVG />,
        amber: <ArrowSendIconSVG />,
    }

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-[9px] rounded-[9px] text-[13px] font-bold text-white transition-all duration-200 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${variantClasses[variant]}`}
        >
            {iconMap[variant]}
            {label}
        </button>
    )
}



// ─── OpportunityCard ──────────────────────────────────────────────────────────

export default function OpportunityCard({ lead }: { lead: IAvailableLeadByCategoryLeadsEntity }) {
    const actions = getLeadActionConfig(lead)
    return (
        <div className="p-[18px] bg-appCard hover:bg-appElevated transition-colors duration-200 h-full">
            <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2 text-[15px] font-extrabold text-appText">
                    <div
                        className="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center text-[14px] shrink-0"
                        style={{ background: 'rgba(16,185,129,0.12)' }}
                    >
                        🏠
                    </div>
                    Test
                </div>
                <button
                    type="button"
                    className="w-7 h-7 rounded-[7px] bg-black/5 dark:bg-white/5 text-appTextSec flex items-center justify-center tracking-widest transition-all duration-200 hover:bg-black/8 dark:hover:bg-white/10 hover:text-appText leading-none text-[16px]"
                    aria-label="Plus d'options"
                >
                    ···
                </button>
            </div>

            {lead.dynamic_answers && lead.dynamic_answers.length > 0 && (
                <div className="flex flex-col gap-[5px] mb-3">
                    {lead.dynamic_answers.slice(0, 3).map((answer) => (
                        <div key={answer._id} className="flex items-center gap-1.5 text-[12px] text-appTextSec">
                            <span className="text-appTextMuted shrink-0">{answer.label}:</span>
                            <span className="truncate">{answer.value || '—'}</span>
                        </div>
                    ))}
                    {lead.dynamic_answers.length > 3 && (
                        <div className="text-[12px] text-appTextMuted">
                            +{lead.dynamic_answers.length - 3} autres
                        </div>
                    )}
                </div>
            )}

            {/* <AlertTag type={card.alertType} text={card.alertText} /> */}
            <ClientBlock client={lead.contact_details} />

            <div className="flex items-center gap-2">
                <PrimaryButton
                    label={actions.primary.label}
                    variant={actions.primary.variant}
                    action={actions.primary.action}
                    disabled={actions.primary.action === 'unlock'}
                    onClick={() => {}}
                />
                {actions.secondary && (
                    <button
                        type="button"
                        onClick={() => {}}
                        className="px-3 py-[9px] rounded-[9px] bg-black/5 dark:bg-white/5 border border-appBorder text-appTextSec text-[12px] font-medium cursor-pointer transition-all duration-200 hover:bg-black/8 dark:hover:bg-white/9 hover:text-appText whitespace-nowrap"
                    >
                        {actions.secondary.label}
                    </button>
                )}
            </div>
        </div>
    )
}
