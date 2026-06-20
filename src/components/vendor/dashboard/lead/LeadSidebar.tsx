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
        default: 'bg-white/4 text-white/40',
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
        <aside className="bg-[#111827] border-r border-white/6 overflow-y-auto sticky top-[58px] h-[calc(100vh-58px)]">
            <div className="p-4 pb-2.5">
                <div className="text-[12px] font-bold uppercase tracking-[1px] text-white/30 mb-2.5">
                    Prospects disponibles
                </div>
                <div className="relative mb-2">
                    <select
                        className="w-full py-[9px] pr-[34px] pl-3 bg-white/5 border border-white/10 rounded-[8px] text-[13px] text-white/70 outline-none cursor-pointer transition-all duration-200 focus:border-amber appearance-none"
                        style={{
                            backgroundImage: CHEVRON_DOWN_SVG,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 10px center',
                        }}
                    >
                        <option value="">🔍 Tous les services</option>
                        <option value="securite">🔒 Sécurité</option>
                        <option value="nettoyage">🧹 Nettoyage</option>
                        <option value="jardinage">🌿 Jardinage</option>
                        <option value="demenagement">📦 Déménagement</option>
                        <option value="plomberie">🔧 Plomberie</option>
                    </select>
                </div>
            </div>

            <div className="text-[11px] font-semibold text-white/25 px-[14px] mb-1.5">
                {leads.length} prospects disponibles
            </div>

            {leads.map((lead) => (
                <button
                    key={lead.id}
                    type="button"
                    onClick={() => onSelect(lead.id)}
                    className={`w-full text-left px-[14px] py-3 border-b border-white/4 cursor-pointer transition-all duration-200 hover:bg-white/4 ${
                        selectedId === lead.id
                            ? 'bg-amber/8 border-l-[3px] border-l-amber'
                            : 'border-l-[3px] border-l-transparent'
                    }`}
                >
                    <div className="flex items-center justify-between mb-[5px] gap-2">
                        <div className="text-[13px] font-bold text-white flex items-center gap-[5px] min-w-0">
                            <LeadBadge type={lead.badge} />
                            <span className="truncate">{lead.title}</span>
                        </div>
                        <span className="text-[11px] font-bold text-amber bg-amber/12 border border-amber/20 px-[7px] py-[2px] rounded-full whitespace-nowrap shrink-0">
                            {lead.pts} pts
                        </span>
                    </div>
                    <div className="flex flex-col gap-[2px]">
                        <div className="flex items-center gap-1 text-[11px] text-white/40">
                            <span className="text-white/25 flex shrink-0">
                                <LocationPinIconSVG size={11} />
                            </span>
                            {lead.location}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-white/40">
                            <span className="text-white/25 flex shrink-0">
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
