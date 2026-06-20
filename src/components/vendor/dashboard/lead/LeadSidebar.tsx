'use client'

import { CalendarOutlineIconSVG, LocationPinIconSVG } from '@/components/library/AllSVG'
import { CHEVRON_DOWN_SVG } from './data'
import type { LeadBadgeType, LeadNoteType, SidebarLead } from './types'

function LeadBadge({ type }: { type: LeadBadgeType }) {
    if (type === 'new') {
        return (
            <span className="text-[8px] font-extrabold uppercase tracking-[0.5px] bg-red-500 text-white px-[5px] py-[2px] rounded-[3px] shrink-0">
                NEW
            </span>
        )
    }
    if (type === 'hot') {
        return (
            <span className="text-[8px] font-extrabold uppercase bg-orange-500 text-white px-[5px] py-[2px] rounded-[3px] shrink-0">
                FORT
            </span>
        )
    }
    return null
}

function LeadNote({ type, text }: { type: LeadNoteType; text: string }) {
    const cls: Record<LeadNoteType, string> = {
        default: 'bg-black/4 dark:bg-white/4 text-appTextSec',
        warn: 'bg-amber/10 text-amber/80',
        danger: 'bg-red-500/10 text-red-400/80',
    }
    return (
        <div className={`mt-[7px] px-2 py-[5px] rounded-[6px] text-[11px] leading-[1.4] flex items-center gap-1 ${cls[type]}`}>
            {text}
        </div>
    )
}

interface Props {
    leads: SidebarLead[]
    selectedId: string
    onSelect: (id: string) => void
}

export default function LeadSidebar({ leads, selectedId, onSelect }: Props) {
    return (
        <aside className="bg-appSurface border-r border-appBorder overflow-y-auto sticky top-[58px] h-[calc(100vh-58px)]">
            <div className="p-4 pb-2.5">
                <div className="text-[12px] font-bold uppercase tracking-[1px] text-appTextMuted mb-2.5">
                    Prospects disponibles
                </div>
                <div className="relative mb-2">
                    <select
                        className="w-full py-[9px] pr-[34px] pl-3 bg-appCard border border-appBorder rounded-[8px] text-[13px] text-appTextSec outline-none cursor-pointer transition-all duration-200 focus:border-amber appearance-none"
                        style={{
                            backgroundImage: CHEVRON_DOWN_SVG,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 10px center',
                        }}
                    >
                        <option value="" className="bg-appSurface">🔍 Tous les services</option>
                        <option value="securite" className="bg-appSurface">🔒 Sécurité</option>
                        <option value="nettoyage" className="bg-appSurface">🧹 Nettoyage</option>
                        <option value="jardinage" className="bg-appSurface">🌿 Jardinage</option>
                        <option value="demenagement" className="bg-appSurface">📦 Déménagement</option>
                        <option value="plomberie" className="bg-appSurface">🔧 Plomberie</option>
                    </select>
                </div>
            </div>

            <div className="text-[11px] font-semibold text-appTextMuted px-[14px] mb-1.5">
                {leads.length} prospects disponibles
            </div>

            {leads.map((lead) => (
                <button
                    key={lead.id}
                    type="button"
                    onClick={() => onSelect(lead.id)}
                    className={`w-full text-left px-[14px] py-3 border-b border-appBorderSub cursor-pointer transition-all duration-200 hover:bg-black/3 dark:hover:bg-white/4 ${
                        selectedId === lead.id
                            ? 'bg-amber/8 border-l-[3px] border-l-amber'
                            : 'border-l-[3px] border-l-transparent'
                    }`}
                >
                    <div className="flex items-center justify-between mb-[5px] gap-2">
                        <div className="text-[13px] font-bold text-appText flex items-center gap-[5px] min-w-0">
                            <LeadBadge type={lead.badge} />
                            <span className="truncate">{lead.title}</span>
                        </div>
                        <span className="text-[11px] font-bold text-amber bg-amber/12 border border-amber/20 px-[7px] py-[2px] rounded-full whitespace-nowrap shrink-0">
                            {lead.pts} pts
                        </span>
                    </div>
                    <div className="flex flex-col gap-[2px]">
                        <div className="flex items-center gap-1 text-[11px] text-appTextSec">
                            <span className="text-appTextMuted flex shrink-0">
                                <LocationPinIconSVG size={11} />
                            </span>
                            {lead.location}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-appTextSec">
                            <span className="text-appTextMuted flex shrink-0">
                                <CalendarOutlineIconSVG size={11} />
                            </span>
                            {lead.dateInfo}
                        </div>
                    </div>
                    <LeadNote type={lead.noteType} text={lead.noteText} />
                </button>
            ))}
        </aside>
    )
}
