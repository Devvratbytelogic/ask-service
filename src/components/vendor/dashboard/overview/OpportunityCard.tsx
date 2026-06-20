import Link from 'next/link'
import {
    ArrowRightIconSVG,
    ArrowSendIconSVG,
    CalendarOutlineIconSVG,
    ClockCircleIconSVG,
    DollarOutlineIconSVG,
    HomeOutlineIconSVG,
    LightningBoltIconSVG,
    LocationPinIconSVG,
    MailOutlineIconSVG,
    PhoneOutlineIconSVG,
    UserOutlineIconSVG,
} from '@/components/library/AllSVG'
import { getVendorLeadsRoutePath } from '@/routes/routes'
import type { AlertType, ButtonVariant, ClientInfo, MetaIconType, OppCardData } from './types'

// ─── MetaRowIcon ──────────────────────────────────────────────────────────────

function MetaRowIcon({ type }: { type: MetaIconType }) {
    const iconMap: Record<MetaIconType, React.ReactNode> = {
        location: <LocationPinIconSVG />,
        people: <UserOutlineIconSVG />,
        home: <HomeOutlineIconSVG />,
        dollar: <DollarOutlineIconSVG />,
        calendar: <CalendarOutlineIconSVG />,
    }
    return <>{iconMap[type]}</>
}

// ─── AlertTag ─────────────────────────────────────────────────────────────────

function AlertTag({ type, text }: { type: AlertType; text: string }) {
    const variants: Record<AlertType, { wrapperClass: string; icon: React.ReactNode }> = {
        urgent: {
            wrapperClass: 'bg-amber/10 border border-amber/20 text-[#FCD34D]',
            icon: <LightningBoltIconSVG />,
        },
        remind: {
            wrapperClass: 'bg-primaryColor/8 border border-primaryColor/15 text-[#93C5FD]',
            icon: <ClockCircleIconSVG />,
        },
        potential: {
            wrapperClass: 'bg-trust-green/8 border border-trust-green/15 text-[#6EE7B7]',
            icon: <DollarOutlineIconSVG size={13} />,
        },
    }
    const { wrapperClass, icon } = variants[type]
    return (
        <div className={`flex items-center gap-1.5 px-2.5 py-2 rounded-[8px] text-[12px] font-semibold mb-3.5 ${wrapperClass}`}>
            {icon}
            {text}
        </div>
    )
}

// ─── ClientBlock ──────────────────────────────────────────────────────────────

function ClientBlock({ client }: { client: ClientInfo }) {
    return (
        <div className="px-3 py-2.5 bg-black/3 dark:bg-white/3 border border-appBorder rounded-[10px] mb-3.5 space-y-[5px]">
            <div className="flex items-center gap-2 text-[13px] text-appText">
                <div
                    className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                    style={{ background: client.avatarColor }}
                >
                    {client.initial}
                </div>
                <span className="font-bold text-appText">{client.name}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-appTextSec">
                <span className="text-appTextMuted shrink-0 flex"><PhoneOutlineIconSVG /></span>
                {client.phone}
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-appTextSec">
                <span className="text-appTextMuted shrink-0 flex"><MailOutlineIconSVG /></span>
                {client.email}
            </div>
        </div>
    )
}

// ─── PrimaryButton ────────────────────────────────────────────────────────────

function PrimaryButton({ label, variant }: { label: string; variant: ButtonVariant }) {
    const variantClasses: Record<ButtonVariant, string> = {
        green: 'bg-linear-to-br from-trust-green to-[#059669] shadow-[0_3px_12px_rgba(16,185,129,0.25)] hover:shadow-[0_5px_16px_rgba(16,185,129,0.35)]',
        blue: 'bg-linear-to-br from-primaryColor to-[#4F46E5] shadow-[0_3px_12px_rgba(27,79,255,0.25)] hover:shadow-[0_5px_16px_rgba(27,79,255,0.35)]',
        amber: 'bg-linear-to-br from-amber to-[#F97316] shadow-[0_3px_12px_rgba(245,158,11,0.25)] hover:shadow-[0_5px_16px_rgba(245,158,11,0.35)]',
    }
    const iconMap: Record<ButtonVariant, React.ReactNode> = {
        green: <PhoneOutlineIconSVG size={13} />,
        blue: <ArrowSendIconSVG />,
        amber: <ArrowSendIconSVG />,
    }
    return (
        <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-[9px] rounded-[9px] text-[13px] font-bold text-white transition-all duration-200 hover:-translate-y-px ${variantClasses[variant]}`}
        >
            {iconMap[variant]}
            {label}
        </button>
    )
}

// ─── Empty slots ──────────────────────────────────────────────────────────────

export function EmptySlotLeads() {
    return (
        <div className="p-[18px] bg-appCard flex items-center justify-center min-h-[200px]">
            <div className="text-center">
                <div className="text-[28px] mb-2.5">🔍</div>
                <p className="text-[13px] font-semibold text-appTextSec mb-1.5">26 nouveaux prospects</p>
                <p className="text-[12px] text-appTextMuted mb-3.5">disponibles dans votre zone</p>
                <Link
                    href={getVendorLeadsRoutePath()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primaryColor/15 border border-primaryColor/25 rounded-[8px] text-[12px] font-bold text-[#93C5FD] transition-all duration-200 hover:bg-primaryColor/20"
                >
                    Voir les prospects
                    <ArrowRightIconSVG />
                </Link>
            </div>
        </div>
    )
}

export function EmptySlotTip() {
    return (
        <div className="p-[18px] bg-appCard flex items-center justify-center min-h-[200px]">
            <div className="text-center">
                <div className="text-[28px] mb-2.5">💡</div>
                <p className="text-[13px] font-semibold text-appTextSec mb-1.5">Astuce</p>
                <p className="text-[12px] text-appTextMuted leading-relaxed max-w-[160px] mx-auto">
                    Complétez votre profil pour apparaître en tête de liste
                </p>
            </div>
        </div>
    )
}

// ─── OpportunityCard ──────────────────────────────────────────────────────────

export default function OpportunityCard({ card }: { card: OppCardData }) {
    return (
        <div className="p-[18px] bg-appCard hover:bg-appElevated transition-colors duration-200">
            <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2 text-[15px] font-extrabold text-appText">
                    <div
                        className="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center text-[14px] shrink-0"
                        style={{ background: card.iconBg }}
                    >
                        {card.icon}
                    </div>
                    {card.title}
                </div>
                <button
                    type="button"
                    className="w-7 h-7 rounded-[7px] bg-black/5 dark:bg-white/5 text-appTextSec flex items-center justify-center tracking-widest transition-all duration-200 hover:bg-black/8 dark:hover:bg-white/10 hover:text-appText leading-none text-[16px]"
                    aria-label="Plus d'options"
                >
                    ···
                </button>
            </div>

            <div className="flex flex-col gap-[5px] mb-3">
                {card.metaRows.map((row, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[12px] text-appTextSec">
                        <span className="text-appTextMuted shrink-0 flex">
                            <MetaRowIcon type={row.iconType} />
                        </span>
                        {row.text}
                    </div>
                ))}
            </div>

            <AlertTag type={card.alertType} text={card.alertText} />
            <ClientBlock client={card.client} />

            <div className="flex items-center gap-2">
                <PrimaryButton label={card.primaryBtn.label} variant={card.primaryBtn.variant} />
                <button
                    type="button"
                    className="px-3 py-[9px] rounded-[9px] bg-black/5 dark:bg-white/5 border border-appBorder text-appTextSec text-[12px] font-medium cursor-pointer transition-all duration-200 hover:bg-black/8 dark:hover:bg-white/9 hover:text-appText whitespace-nowrap"
                >
                    {card.secondaryBtn}
                </button>
            </div>
        </div>
    )
}
