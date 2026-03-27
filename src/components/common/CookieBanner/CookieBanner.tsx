'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCookiesRoutePath } from '@/routes/routes'

const COOKIE_CONSENT_KEY = 'cookie_consent'

type ConsentValue = 'accepted' | 'refused' | null

export default function CookieBanner() {
    const [consent, setConsent] = useState<ConsentValue | 'loading'>('loading')

    useEffect(() => {
        const stored = localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentValue | null
        setConsent(stored)
    }, [])

    const handleAccept = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
        setConsent('accepted')
    }

    const handleRefuse = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'refused')
        setConsent('refused')
    }

    if (consent !== null) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-999 bg-pinkBlack border-t border-[#8A8A8A66] px-4 py-4 md:px-10">
            <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <p className="text-sm text-footerSilver leading-relaxed max-w-3xl">
                    Nous utilisons des cookies pour améliorer votre expérience et vous proposer des
                    services adaptés à vos besoins. Vous pouvez accepter, refuser ou personnaliser
                    vos préférences à tout moment.{' '}
                    <Link
                        href={getCookiesRoutePath()}
                        className="text-customWhite underline underline-offset-2 hover:text-primaryColor transition-colors"
                    >
                        Notre Avis sur les cookies.
                    </Link>
                </p>
                <div className="flex shrink-0 items-center gap-3">
                    <button
                        onClick={handleRefuse}
                        className="px-5 py-2 rounded-xl text-sm font-medium border border-[#8A8A8A66] text-footerSilver hover:text-customWhite hover:border-customWhite transition-colors"
                    >
                        Refuser
                    </button>
                    <button
                        onClick={handleAccept}
                        className="px-5 py-2 rounded-xl text-sm font-medium bg-primaryColor text-white hover:opacity-90 transition-opacity"
                    >
                        Accepter
                    </button>
                </div>
            </div>
        </div>
    )
}
