export type AlertType = 'urgent' | 'remind' | 'potential'
export type OppStatus = 'new' | 'inprogress' | 'sent'
export type ButtonVariant = 'green' | 'blue' | 'amber'
export type MetaIconType = 'location' | 'people' | 'home' | 'dollar' | 'calendar'

export interface StatData {
    icon: string
    iconBg: string
    value: string | number
    valueColor?: string
    label: string
    linkText: string
    linkColor: string
    href: string
    highlight?: boolean
}

export interface ClientInfo {
    initial: string
    avatarColor: string
    name: string
    phone: string
    email: string
}

export interface MetaRow {
    iconType: MetaIconType
    text: string
}

export interface OppCardData {
    id: string
    icon: string
    iconBg: string
    title: string
    metaRows: MetaRow[]
    alertType: AlertType
    alertText: string
    client: ClientInfo
    primaryBtn: { label: string; variant: ButtonVariant }
    secondaryBtn: string
}

export interface OppGroupData {
    id: string
    status: OppStatus
    statusLabel: string
    serviceName: string
    locationTag?: string
    extraTag?: string
    cards: OppCardData[]
    showEmptySlots?: boolean
}
