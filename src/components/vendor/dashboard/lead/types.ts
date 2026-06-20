export type LeadBadgeType = 'new' | 'hot' | 'none'
export type LeadNoteType = 'default' | 'warn' | 'danger'
export type ServiceVariant = 'security' | 'cleaning'
export type ClientType = 'b2b' | 'b2c'
export type NeedIconType = 'shield' | 'clock' | 'users'

export interface SidebarLead {
    id: string
    badge: LeadBadgeType
    title: string
    pts: number
    location: string
    dateInfo: string
    noteType: LeadNoteType
    noteText: string
}

export interface NeedItem {
    iconType: NeedIconType
    text: string
}

export interface LeadDetail {
    id: string
    serviceLabel: string
    serviceVariant: ServiceVariant
    isNew: boolean
    clientType: ClientType
    isUrgent: boolean
    urgencyLabel: string
    location: string
    dateInfo: string
    staffInfo: string
    venueType: string
    qualityLabel: string
    qualityDots: number
    credits: number
    needs: NeedItem[]
    competitorsCount: number
    phoneBlurred: string
    emailBlurred: string
    phoneRevealed: string
    emailRevealed: string
}
