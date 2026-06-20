import {
    getCreditsRoutePath,
    getVendorAllQuotesRoutePath,
    getVendorDashboardRoutePath,
    getVendorLeadsRoutePath,
} from '@/routes/routes'
import type { OppGroupData, StatData } from './types'

export const STATS: StatData[] = [
    {
        icon: '🔓',
        iconBg: 'rgba(16,185,129,0.15)',
        value: 13,
        label: 'Opportunités actives',
        linkText: 'Voir mes opportunités actives',
        linkColor: 'text-[#6EE7B7]',
        href: getVendorDashboardRoutePath({ leads: 'purchased' }),
        highlight: true,
    },
    {
        icon: '🔍',
        iconBg: 'rgba(27,79,255,0.15)',
        value: 26,
        label: 'Prospects disponibles',
        linkText: 'Voir les prospects disponibles',
        linkColor: 'text-[#93C5FD]',
        href: getVendorLeadsRoutePath(),
    },
    {
        icon: '🪙',
        iconBg: 'rgba(245,158,11,0.15)',
        value: 903,
        valueColor: 'text-amber',
        label: 'Solde de crédits',
        linkText: 'Acheter des crédits',
        linkColor: 'text-amber',
        href: getCreditsRoutePath(),
    },
    {
        icon: '📋',
        iconBg: 'rgba(139,92,246,0.15)',
        value: 6,
        label: 'Devis envoyés',
        linkText: 'Voir en cours, gagnés…',
        linkColor: 'text-[#C4B5FD]',
        href: getVendorAllQuotesRoutePath(),
    },
]

export const OPPORTUNITY_GROUPS: OppGroupData[] = [
    {
        id: 'g1',
        status: 'new',
        statusLabel: 'Nouveau',
        serviceName: '🔒 Sécurité Privée',
        locationTag: 'Parinentiel',
        extraTag: 'Adonéts',
        cards: [
            {
                id: 'c1',
                icon: '🏠',
                iconBg: 'rgba(16,185,129,0.12)',
                title: 'Villepinte',
                metaRows: [
                    { iconType: 'location', text: 'France · 1 Avril · Après-midi' },
                    { iconType: 'people', text: '2 agents · 1 jour' },
                ],
                alertType: 'urgent',
                alertText: 'À traiter rapidement',
                client: {
                    initial: 'N',
                    avatarColor: '#16A34A',
                    name: 'Nicolas Boirel',
                    phone: '+33 6 55 89 ···',
                    email: 'nicolas.boirel00@gmail.com',
                },
                primaryBtn: { label: 'Contacter le client', variant: 'green' },
                secondaryBtn: 'Déjà traité',
            },
            {
                id: 'c2',
                icon: '📦',
                iconBg: 'rgba(245,158,11,0.12)',
                title: 'En cours · Déménagement',
                metaRows: [
                    { iconType: 'location', text: 'Villette 83420 · Paris 14e' },
                    { iconType: 'home', text: 'Volume : T3 · Appartement' },
                    { iconType: 'dollar', text: 'Potentiel : 400€ – 800€' },
                ],
                alertType: 'potential',
                alertText: 'Potentiel élevé · 400€ – 800€',
                client: {
                    initial: 'K',
                    avatarColor: '#2563EB',
                    name: 'Karim Boubacer',
                    phone: '+33 7 59 27 ···',
                    email: 'boubacer.dad@gmail.com',
                },
                primaryBtn: { label: 'Envoyer un devis', variant: 'blue' },
                secondaryBtn: 'Voir le contact',
            },
            {
                id: 'c3',
                icon: '🧹',
                iconBg: 'rgba(139,92,246,0.12)',
                title: 'Devis envoyé · Nettoyage',
                metaRows: [
                    { iconType: 'location', text: 'Pantin 93300' },
                    { iconType: 'home', text: 'Tertiaire · 50 m²' },
                ],
                alertType: 'remind',
                alertText: 'Relancer demain',
                client: {
                    initial: 'P',
                    avatarColor: '#DC2626',
                    name: 'Pascale Thomas',
                    phone: '+33 6 00 61 ···',
                    email: 'pascalthomas@gmail.com',
                },
                primaryBtn: { label: 'Relancer maintenant', variant: 'amber' },
                secondaryBtn: 'Voir le contact',
            },
        ],
    },
    {
        id: 'g2',
        status: 'inprogress',
        statusLabel: 'En cours',
        serviceName: '🌿 Jardinage',
        locationTag: 'Versailles',
        showEmptySlots: true,
        cards: [
            {
                id: 'c4',
                icon: '🌿',
                iconBg: 'rgba(16,185,129,0.12)',
                title: 'Entretien jardin',
                metaRows: [
                    { iconType: 'location', text: 'Versailles 78000' },
                    { iconType: 'calendar', text: '2 Mai · Matin · Flexible' },
                    { iconType: 'home', text: '800 m² · Taille haies' },
                ],
                alertType: 'potential',
                alertText: 'Potentiel : 150€ – 300€',
                client: {
                    initial: 'M',
                    avatarColor: '#7C3AED',
                    name: 'Marie Leconte',
                    phone: '+33 6 78 45 ···',
                    email: 'm.leconte@gmail.com',
                },
                primaryBtn: { label: 'Envoyer un devis', variant: 'blue' },
                secondaryBtn: 'Voir le contact',
            },
        ],
    },
]

export const CITY_OPTIONS = ['Toutes les villes', 'Paris', 'Lyon', 'Marseille']
export const SERVICE_OPTIONS = ['Tous services', 'Sécurité', 'Nettoyage', 'Déménagement', 'Jardinage']

export const CHEVRON_DOWN_SVG =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2.5' viewBox='0 0 24 24'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")"
