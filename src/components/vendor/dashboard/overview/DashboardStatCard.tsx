import Link from 'next/link'
import { ArrowRightIconSVG } from '@/components/library/AllSVG'
import type { StatData } from './types'

export default function DashboardStatCard({
    icon,
    iconBg,
    value,
    valueColor,
    label,
    linkText,
    linkColor,
    href,
    highlight,
}: StatData) {
    return (
        <Link
            href={href}
            className={`block rounded-2xl border p-5 cursor-pointer transition-all duration-250 hover:-translate-y-0.5 ${
                highlight
                    ? 'border-trust-green/30 bg-emerald-50 dark:bg-linear-to-br dark:from-[#0D2018] dark:to-[#111D14] hover:border-trust-green/50 hover:shadow-[0_8px_24px_rgba(16,185,129,0.1)]'
                    : 'border-appBorder bg-appCard hover:border-appBorder hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]'
            }`}
        >
            <div
                className="w-[38px] h-[38px] rounded-[11px] flex items-center justify-center text-[18px] mb-3.5"
                style={{ background: iconBg }}
            >
                {icon}
            </div>
            <p className={`text-[32px] font-extrabold tracking-[-1px] leading-none mb-1 ${valueColor ?? 'text-appText'}`}>
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
