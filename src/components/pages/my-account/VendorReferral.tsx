'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { addToast, Button, Spinner } from '@heroui/react'
import { FiCheck, FiCopy } from 'react-icons/fi'
import { useGetVendorProfileInfoQuery } from '@/redux/rtkQueries/clientSideGetApis'
import { getVendorAccountRoutePath } from '@/routes/routes'
import { APP_URL } from '@/utils/config'

const STEPS = [
    {
        title: 'Partagez votre lien',
        description: 'Envoyez votre lien d\'invitation à un autre professionnel.',
    },
    {
        title: 'Il crée son compte',
        description: 'Il s\'inscrit sur Ask Service avec votre lien de parrainage.',
    },
    {
        title: 'Vous gagnez des points',
        description: 'Les points sont ajoutés à votre solde une fois son inscription confirmée.',
    },
]

function referralCodeFromId(id: string) {
    const compact = id.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()
    return compact ? `AS-${compact}` : ''
}

function CopyButton({
    label,
    copied,
    onPress,
}: {
    label: string
    copied: boolean
    onPress: () => void
}) {
    return (
        <Button
            className="btn_radius btn_bg_blue shrink-0"
            onPress={onPress}
            startContent={copied ? <FiCheck className="size-4" /> : <FiCopy className="size-4" />}
        >
            {copied ? 'Copié' : label}
        </Button>
    )
}

export default function VendorReferral({ compact = false }: { compact?: boolean }) {
    const { data, isLoading } = useGetVendorProfileInfoQuery()
    const [copied, setCopied] = useState(false)

    const vendorId = data?.data?._id ?? data?.data?.id ?? ''
    const code = useMemo(() => (vendorId ? referralCodeFromId(vendorId) : ''), [vendorId])

    const link = useMemo(() => {
        if (!code || !APP_URL) return ''
        const url = new URL(APP_URL)
        url.searchParams.set('code', code)
        return url.toString()
    }, [code])

    const copyLink = async () => {
        if (!link) return
        try {
            await navigator.clipboard.writeText(link)
            setCopied(true)
            addToast({ title: 'Lien copié', color: 'success', timeout: 2000 })
            window.setTimeout(() => setCopied(false), 2000)
        } catch {
            addToast({ title: 'Impossible de copier', color: 'danger', timeout: 2000 })
        }
    }

    if (compact) {
        return (
            <section className="mt-8 border-t border-appBorder pt-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-fontBlack">Parrainage</h2>
                        <p className="mt-1 text-sm text-darkSilver">
                            Invitez un professionnel et gagnez des points lorsqu&apos;il s&apos;inscrit.
                        </p>
                    </div>
                    <Link
                        href={getVendorAccountRoutePath('referral')}
                        className="text-sm font-medium text-primaryColor hover:underline"
                    >
                        Voir le parrainage
                    </Link>
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                        readOnly
                        value={isLoading ? '' : link}
                        placeholder={isLoading ? 'Chargement du lien…' : 'Lien d\'invitation'}
                        aria-label="Lien d'invitation"
                        className="min-w-0 flex-1 rounded-xl border border-appBorder bg-appCard px-4 py-3 text-sm text-appText outline-none"
                    />
                    <CopyButton
                        label="Copier le lien"
                        copied={copied}
                        onPress={copyLink}
                    />
                </div>
            </section>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold text-fontBlack">Parrainage</h2>
                <p className="mt-1 text-sm text-darkSilver">
                    Partagez votre lien avec un autre professionnel. Vous gagnez des points lorsqu&apos;il crée son compte.
                </p>
            </div>

            <div className="rounded-2xl border border-primaryColor/20 bg-primaryColor/5 p-4 sm:p-5">
                <label htmlFor="referral-link" className="mb-1.5 block text-sm font-medium text-fontBlack">
                    Lien d&apos;invitation
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                    {isLoading ? (
                        <div className="flex min-h-12 flex-1 items-center px-1">
                            <Spinner size="sm" />
                        </div>
                    ) : (
                        <input
                            id="referral-link"
                            readOnly
                            value={link}
                            placeholder="Chargement du lien…"
                            className="min-w-0 flex-1 rounded-xl border border-appBorder bg-appCard px-4 py-3 text-sm text-appText outline-none"
                        />
                    )}
                    <CopyButton
                        label="Copier le lien"
                        copied={copied}
                        onPress={copyLink}
                    />
                </div>
            </div>

            <div>
                <h3 className="text-sm font-bold text-fontBlack">Comment ça marche</h3>
                <ol className="mt-3 grid gap-3 sm:grid-cols-3">
                    {STEPS.map((step, index) => (
                        <li key={step.title} className="rounded-2xl border border-appBorder bg-appSurface p-4">
                            <span className="flex size-7 items-center justify-center rounded-full bg-primaryColor/10 text-xs font-bold text-primaryColor">
                                {index + 1}
                            </span>
                            <p className="mt-3 text-sm font-bold text-fontBlack">{step.title}</p>
                            <p className="mt-1 text-sm text-darkSilver">{step.description}</p>
                        </li>
                    ))}
                </ol>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-appBorder p-4">
                    <p className="text-sm text-darkSilver">Professionnels inscrits</p>
                    <p className="mt-1 text-2xl font-bold text-fontBlack">0</p>
                </div>
                <div className="rounded-2xl border border-appBorder p-4">
                    <p className="text-sm text-darkSilver">Points gagnés</p>
                    <p className="mt-1 text-2xl font-bold text-fontBlack">0</p>
                </div>
            </div>

            <div className="rounded-2xl border border-dashed border-appBorder px-4 py-10 text-center">
                <p className="text-sm font-medium text-fontBlack">Aucun filleul pour le moment</p>
                <p className="mt-1 text-sm text-darkSilver">
                    Les professionnels qui s&apos;inscrivent avec votre lien apparaîtront ici.
                </p>
            </div>
        </div>
    )
}
