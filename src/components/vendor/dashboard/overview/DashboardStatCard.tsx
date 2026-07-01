import Link from 'next/link'
import { ArrowRightIconSVG } from '@/components/library/AllSVG'

const HIGHLIGHT_STYLES = {
    green: 'border-trust-green/30 bg-emerald-50 dark:border-trust-green/50 dark:bg-trust-green/10 dark:shadow-[0_0_0_1px_rgba(16,185,129,0.25),0_8px_32px_rgba(16,185,129,0.12)] hover:border-trust-green/50 dark:hover:border-trust-green/65 hover:shadow-[0_8px_24px_rgba(16,185,129,0.1)] dark:hover:shadow-[0_0_0_1px_rgba(16,185,129,0.35),0_12px_40px_rgba(16,185,129,0.18)]',
    blue: 'border-primaryColor/30 bg-blue-50 dark:border-primaryColor/55 dark:bg-primaryColor/15 dark:shadow-[0_0_0_1px_rgba(27,79,255,0.35),0_8px_32px_rgba(27,79,255,0.18)] hover:border-primaryColor/50 dark:hover:border-primaryColor/70 hover:shadow-[0_8px_24px_rgba(27,79,255,0.1)] dark:hover:shadow-[0_0_0_1px_rgba(27,79,255,0.45),0_12px_40px_rgba(27,79,255,0.25)]',
} as const

export default function DashboardStatCard({
    icon,
    iconBg,
    value,
    label,
    linkText,
    linkColor,
    href,
    highlight,
    highlightColor = 'green',
}: {
    icon: string,
    iconBg: string,
    value: number,
    label: string,
    linkText: string,
    linkColor: string,
    href: string,
    highlight?: boolean,
    highlightColor?: keyof typeof HIGHLIGHT_STYLES,
}) {
    return (
        <Link
            href={href}
            className={`block rounded-2xl border p-5 cursor-pointer transition-all duration-250 hover:-translate-y-0.5 ${highlight
                    ? HIGHLIGHT_STYLES[highlightColor]
                    : 'border-appBorder bg-appCard hover:border-appBorder hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]'
                }`}
        >
            <div
                className="w-[38px] h-[38px] rounded-[11px] flex items-center justify-center text-[18px] mb-3.5"
                style={{ background: iconBg }}
            >
                {icon}
            </div>
            <p className={`text-[32px] font-extrabold tracking-[-1px] leading-none mb-1 text-appText`}>
                {value}
            </p>
            <p className="text-[13px] text-appTextSec mb-3">{label}</p>
            <span className={`text-[12px] font-semibold flex items-center gap-1 ${linkColor}`}>
                {linkText}
                <ArrowRightIconSVG />
            </span>
        </Link>
    )
}
