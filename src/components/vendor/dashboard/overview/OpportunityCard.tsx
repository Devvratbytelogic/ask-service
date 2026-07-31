'use client'

import { ArrowSendIconSVG, CalendarIconSVG, ChatOutlineIconSVG, LocationIconSVG, LockPrimaryColorSVG, MailOutlineIconSVG, PhoneOutlineIconSVG, } from '@/components/library/AllSVG'
import { Tooltip } from '@heroui/react'
import { IAvailableLeadByCategoryContactDetailsEntity, IAvailableLeadByCategoryDynamicAnswersEntity, IAvailableLeadByCategoryLeadsEntity, } from '@/types/availableLeadByCategory'
import { generateLeadDetailRoutePath, getVendorMessageRoutePath } from '@/routes/routes'
import { openModal } from '@/redux/slices/allModalSlice'
import { useVendorAccessChatMutation } from '@/redux/rtkQueries/allPostApi'
import { useDispatch } from 'react-redux'
import { useRouter } from 'nextjs-toploader/app';
import ImageComponent from '@/components/library/ImageComponent'
import moment from 'moment'

type ButtonVariant = 'green' | 'blue' | 'amber' | 'gray'
type LeadActionType = 'unlock' | 'send-quote' | 'view-quote' | 'contact' | 'ignored'
type LeadStatus = 'new' | 'unlocked' | 'pending' | 'accepted' | 'ignored' | 'withdrawn'

const LEAD_STATUS_VARIANT: Record<LeadStatus, ButtonVariant> = {
    new: 'blue',
    unlocked: 'green',
    pending: 'green',
    accepted: 'green',
    ignored: 'gray',
    withdrawn: 'gray',
}

const VARIANT_RIBBON_CLASS: Record<ButtonVariant, string> = {
    green: 'bg-trust-green text-white',
    blue: 'bg-primaryColor text-white',
    amber: 'bg-amber text-white',
    gray: 'bg-[#64748B] text-white',
}

const LEAD_STATUS_RIBBON_LABEL: Record<LeadStatus, string> = {
    new: 'Verrouillé',
    unlocked: 'Débloqué',
    pending: 'En attente',
    accepted: 'Accepté',
    ignored: 'Ignoré',
    withdrawn: 'Retiré',
}

function resolveLeadStatus(status: string | null | undefined): LeadStatus {
    switch ((status ?? '').toLowerCase()) {
        case 'unlocked':
            return 'unlocked'
        case 'pending':
            return 'pending'
        case 'accepted':
            return 'accepted'
        case 'ignored':
            return 'ignored'
        case 'withdrawn':
            return 'withdrawn'
        case 'new':
        default:
            return 'new'
    }
}

function getLeadStatusRibbonLabel(status: string | null | undefined, label?: string | null): string {
    const resolved = resolveLeadStatus(status || label)
    return LEAD_STATUS_RIBBON_LABEL[resolved]
}

function LeadStatusRibbon({ status, label }: { status: string; label?: string | null }) {
    const resolvedStatus = resolveLeadStatus(status || label)
    const ribbonClass = VARIANT_RIBBON_CLASS[LEAD_STATUS_VARIANT[resolvedStatus]]
    const displayLabel = getLeadStatusRibbonLabel(status, label)

    return (
        <div className="absolute top-0 right-0 size-24 overflow-hidden pointer-events-none z-10" aria-hidden>
            <span
                className={`absolute top-3.5 -right-7.5 w-30 rotate-45 py-0.75 text-center text-[9px] font-extrabold uppercase tracking-[0.6px] shadow-[0_2px_6px_rgba(15,23,42,0.15)] ${ribbonClass}`}
            >
                {displayLabel}
            </span>
        </div>
    )
}

const AVATAR_COLORS = ['#16A34A', '#2563EB', '#7C3AED', '#DC2626', '#0369A1', '#D97706', '#0891B2']

function getAvatarColor(seed: string): string {
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash)
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

interface LeadActionConfig {
    label: string
    variant: ButtonVariant
    action: LeadActionType
    disabled?: boolean
}

function getLeadActionConfig(lead: IAvailableLeadByCategoryLeadsEntity): LeadActionConfig | null {
    const status = resolveLeadStatus(lead.lead_status)
    const variant = LEAD_STATUS_VARIANT[status]

    switch (lead.lead_status) {
        case 'new':
            return {
                label: 'Débloquer le prospect',
                variant,
                action: 'unlock',
            }
        case 'unlocked':
            return {
                label: 'Envoyer un devis',
                variant,
                action: 'send-quote',
            }
        case 'pending':
            return {
                label: 'Voir le devis',
                variant,
                action: 'view-quote',
            }
        case 'accepted':
            return {
                label: 'Contacter le client',
                variant,
                action: 'contact',
            }
        case 'ignored':
        case 'withdrawn':
            return {
                label: 'Devis ignoré',
                variant,
                action: 'ignored',
            }
        default:
            return null
    }
}

function ClientBlock({ client }: { client: IAvailableLeadByCategoryContactDetailsEntity }) {
    const clientName = `${client?.first_name ?? ''} ${client?.last_name ?? ''}`.trim()
    const clientInitial = (client?.first_name?.charAt(0) ?? client?.last_name?.charAt(0) ?? '?').toUpperCase()
    const avatarColor = getAvatarColor(client?.email || client?.phone || clientName || 'client')

    return (
        <div className="px-3 py-2.5 bg-black/3 dark:bg-white/3 border border-appBorder rounded-md mb-1.25 space-y-1.25">
            <div className="flex items-center gap-2 text-[13px] text-appText">
                <div
                    className="w-6.5 h-6.5 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                    style={{ backgroundColor: avatarColor }}
                >
                    {clientInitial}
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

function MetaItem({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-1.25 text-[12px] text-appTextSec capitalize">{children}</div>
    )
}

function PrimaryButton({ label, variant, action, disabled, onClick, }: {
    label: string
    variant: ButtonVariant
    action: LeadActionType
    disabled?: boolean
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}) {
    const variantClasses: Record<ButtonVariant, string> = {
        green: 'cursor-pointer bg-linear-to-br from-trust-green to-[#059669] shadow-[0_3px_12px_rgba(16,185,129,0.25)] hover:shadow-[0_5px_16px_rgba(16,185,129,0.35)]',
        blue: 'cursor-pointer bg-linear-to-br from-primaryColor to-[#4F46E5] shadow-[0_3px_12px_rgba(27,79,255,0.25)] hover:shadow-[0_5px_16px_rgba(27,79,255,0.35)]',
        amber: 'cursor-pointer bg-linear-to-br from-amber to-[#F97316] shadow-[0_3px_12px_rgba(245,158,11,0.25)] hover:shadow-[0_5px_16px_rgba(245,158,11,0.35)]',
        gray: 'cursor-pointer bg-linear-to-br from-[#64748B] to-[#475569] shadow-[0_3px_12px_rgba(100,116,139,0.25)] hover:shadow-[0_5px_16px_rgba(100,116,139,0.35)]',
    }
    const iconMap: Record<LeadActionType, React.ReactNode> = {
        unlock: <LockPrimaryColorSVG className="size-3.5 text-white" />,
        'send-quote': <ArrowSendIconSVG />,
        'view-quote': <ArrowSendIconSVG />,
        contact: <ChatOutlineIconSVG size={13} />,
        ignored: null,
    }

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.25 rounded-md text-[13px] font-bold text-white transition-all duration-200 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${variantClasses[variant]}`}
        >
            {iconMap[action]}
            {label}
        </button>
    )
}

function DirectContactButton({ phone, disabled, onClick }: {
    phone?: string | null
    disabled?: boolean
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}) {
    const isDisabled = disabled || !phone

    return (
        <button
            type="button"
            disabled={isDisabled}
            onClick={onClick}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.25 rounded-md text-[13px] font-bold text-appText bg-transparent border border-appBorder transition-all duration-200 hover:-translate-y-px hover:bg-black/3 dark:hover:bg-white/3 hover:border-primaryColor/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
            <PhoneOutlineIconSVG size={13} />
            Contact
        </button>
    )
}

function HiddenAnswersTooltip({ answers }: { answers: IAvailableLeadByCategoryDynamicAnswersEntity[] }) {
    return (
        <Tooltip
            placement="top-start"
            delay={100}
            offset={8}
            classNames={{
                content: 'p-0 bg-transparent border-0 shadow-none overflow-visible',
            }}
            content={
                <div className="w-67 px-3 py-2.5 bg-appElevated border border-appBorder rounded-md shadow-[0_4px_16px_rgba(15,23,42,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                    <div className="flex flex-col gap-2.5">
                        {answers.map((answer) => (
                            <div key={answer._id} className="space-y-0.5">
                                <p className="text-[11px] text-appTextMuted leading-snug">{answer.label}</p>
                                <p className="text-[12px] text-appText leading-snug">{answer.value || '—'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            }
        >
            <span className="inline-flex items-center w-fit mt-0.5 px-2 py-0.75 rounded-md text-[11px] font-semibold text-primaryColor/80 bg-primaryColor/6 border border-primaryColor/15 cursor-help transition-colors duration-200 hover:bg-primaryColor/10 hover:border-primaryColor/25">
                +{answers.length} autre{answers.length > 1 ? 's' : ''}
            </span>
        </Tooltip>
    )
}


// ─── OpportunityCard ──────────────────────────────────────────────────────────

export default function OpportunityCard({ lead, canPurchaseLeads }: { lead: IAvailableLeadByCategoryLeadsEntity, canPurchaseLeads: boolean }) {
    const dispatch = useDispatch()
    const router = useRouter()
    const [vendorAccessChat, { isLoading: isAccessingChat }] = useVendorAccessChatMutation()
    const action = getLeadActionConfig(lead)
    const leadStatus = resolveLeadStatus(lead.lead_status)
    const isLockedLead = leadStatus === 'new'
    // const showDirectContact = !isLockedLead
    const clientPhone = lead?.contact_details?.phone ?? ''
    const hiddenAnswers = lead.dynamic_answers?.slice(3) ?? []
    const isButtonDisabled = !canPurchaseLeads
    const leadDetailPath = generateLeadDetailRoutePath(lead._id)
    // const postalCodeRaw = lead?.dynamic_answers?.find((a) => a.key === 'postal_code')?.value ?? ''
    const cityAndPostalCode = lead?.city && lead?.pincode ? `${lead.city} - ${lead.pincode}` : ''
    const desiredDateRaw = lead?.dynamic_answers?.find((a) => a.key === 'desired_date')?.value ?? ''
    const desiredDate = desiredDateRaw ? moment(desiredDateRaw).locale('fr').format('DD MMM YYYY') : ''
    const timeSlotRaw = lead?.dynamic_answers?.find((a) => a.key === 'time_slot')?.value ?? ''

    const handleCardClick = () => {
        router.push(leadDetailPath)
    }

    const handlePrimaryAction = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        event.stopPropagation()

        if (!action || isButtonDisabled) return

        switch (action.action) {
            case 'unlock':
                dispatch(openModal({
                    componentName: 'UnlockLeadConfirmModal',
                    data: { leadId: lead?._id, creditsToUnlock: lead?.creditsToUnlock },
                    modalSize: 'sm',
                    modalPadding: 'p-0',
                }))
                break
            case 'contact': {
                const clientUserId = lead.user
                const quoteId = lead.quote_id
                if (!clientUserId || !quoteId) return
                try {
                    const response = await vendorAccessChat({
                        userId: clientUserId,
                        quote_id: quoteId,
                    }).unwrap()
                    const chatId = response?.data?._id
                    router.push(chatId ? `${getVendorMessageRoutePath()}?chatId=${chatId}` : getVendorMessageRoutePath())
                } catch (error) {
                    console.error('error accessing chat', error)
                }
                break
            }
            case 'send-quote':
            case 'view-quote':
            case 'ignored':
                router.push(leadDetailPath)
                break
            default:
                break
        }
    }

    const handleDirectContact = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        event.stopPropagation()
        if (!clientPhone) return
        window.open(`tel:${clientPhone.replace(/\s/g, '')}`, '_self')
    }

    return (
        <div
            className="relative overflow-hidden p-4.5 bg-appCard hover:bg-appElevated transition-colors duration-200 h-full cursor-pointer"
            onClick={handleCardClick}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    handleCardClick()
                }
            }}
            role="link"
            tabIndex={0}
        >
            {(lead.lead_status || lead.lead_status_label) && (
                <LeadStatusRibbon status={lead?.lead_status} label={lead?.lead_status_label} />
            )}

            <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2 text-[15px] font-extrabold text-appText pr-10">
                    <div
                        className="w-7.5 h-7.5 rounded-md flex items-center justify-center text-[14px] shrink-0"
                        style={{ background: 'rgba(16,185,129,0.12)' }}
                    >
                        {lead?.service_category?.image ? (
                            <ImageComponent
                                url={lead?.service_category?.image || ''}
                                img_title={lead?.service_category?.title ?? ''}
                                object_cover={true}
                            />
                        ) : (
                            <span className="text-[18px]">
                                {lead?.service_category?.title?.charAt(0)}
                            </span>
                        )}
                    </div>
                    {lead?.service_category?.title}
                </div>
                {/* <button
                    type="button"
                    onClick={(event) => event.stopPropagation()}
                    className="relative z-20 w-7 h-7 rounded-[7px] bg-black/5 dark:bg-white/5 text-appTextSec flex items-center justify-center tracking-widest transition-all duration-200 hover:bg-black/8 dark:hover:bg-appOverlay-5 hover:text-appText leading-none text-[16px]"
                    aria-label="Plus d'options"
                >
                    ···
                </button> */}
            </div>

            <div className="flex items-center gap-1.5 text-[12px] text-appTextSec mb-3">
                <span className="text-appTextMuted shrink-0">Réf.:</span>
                <span className="font-semibold text-appText truncate">{lead?.reference_no}</span>
            </div>

            <div className="flex items-center gap-3.5 flex-wrap mb-3">
                <MetaItem>
                    <LocationIconSVG />
                    {cityAndPostalCode ?? '—'}
                </MetaItem>
                <MetaItem>
                    <CalendarIconSVG />
                    {desiredDate ?? '—'} · {timeSlotRaw ?? '—'}
                </MetaItem>
            </div>

            {lead.dynamic_answers && lead.dynamic_answers.length > 0 && (
                <div className="flex flex-col gap-1.25 mb-3">
                    {lead?.dynamic_answers?.slice(0, 3).map((answer) => (
                        <div key={answer._id} className="flex items-center gap-1.5 text-[12px] text-appTextSec">
                            <span className="text-appTextMuted shrink-0">{answer.label}:</span>
                            <span className="truncate">{answer.type === 'date' ? moment(answer.value).locale('fr').format('DD MMM YYYY') : answer.value || '—'}</span>
                        </div>
                    ))}
                    {lead?.dynamic_answers?.length > 3 ? (
                        <HiddenAnswersTooltip answers={hiddenAnswers} />
                    ) : null}
                </div>
            )}

            <ClientBlock client={lead?.contact_details} />

            {action && (
                <div className="flex items-center gap-2" onClick={(event) => event.stopPropagation()}>
                    <PrimaryButton
                        label={isAccessingChat && action.action === 'contact' ? 'Ouverture…' : action.label}
                        variant={action.variant}
                        action={action.action}
                        disabled={isButtonDisabled || (action.action === 'contact' && isAccessingChat)}
                        onClick={handlePrimaryAction}
                    />
                    {!isLockedLead && (
                        <DirectContactButton
                            phone={clientPhone}
                            disabled={isButtonDisabled}
                            onClick={handleDirectContact}
                        />
                    )}
                </div>
            )}
        </div>
    )
}
