"use client"
import ImageComponent from '@/components/library/ImageComponent'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BsFacebook, BsLinkedin } from 'react-icons/bs'
import { FaXTwitter } from 'react-icons/fa6'
import { useGetGlobalSettingsQuery } from '@/redux/rtkQueries/clientSideGetApis'
import {
    getMessageRoutePath,
    getVendorMessageRoutePath,
    getCreateRequestRoutePath,
    getHelpCenterRoutePath,
    getCreditsRoutePath,
    getContactUsRoutePath,
    getTermsRoutePath,
    getPrivacyRoutePath,
    getCookiesRoutePath,
    getFacebookUrl,
    getTwitterUrl,
    getLinkedinUrl,
} from '@/routes/routes'

const MESSAGE_PATHS = [getMessageRoutePath(), getVendorMessageRoutePath()]

const linkClass = "text-sm font-medium text-[#ffffff73] no-underline transition-colors duration-200 hover:text-white"


export default function Footer({ footerLogoUrl, platformDescription, marketplaceName }: { footerLogoUrl: string, platformDescription: string, marketplaceName: string }) {
    const pathname = usePathname()
    const { data: globalSettings, isLoading } = useGetGlobalSettingsQuery()
    const settings = globalSettings?.data

    if (MESSAGE_PATHS.some((path) => pathname === path)) {
        return null
    }

    const facebookUrl = settings?.facebook_link || getFacebookUrl()
    const twitterUrl = settings?.x_link || getTwitterUrl()
    const linkedinUrl = settings?.linkedin_link || getLinkedinUrl()

    return (
        <footer className="bg-[#0F172A] px-[5%] pt-[60px] pb-9 text-[#ffffff73]">
            <div className="grid grid-cols-1 gap-8 pb-12 mb-8 border-b border-white/[0.07] sm:grid-cols-2 sm:gap-12 lg:grid-cols-[2fr_1fr_1fr_1fr]">
                <div>
                    {/* Brand */}
                    <Link href="/" className="block h-14 w-fit mb-3.5">
                        <ImageComponent url={footerLogoUrl} object_contain img_title={`${marketplaceName} logo`} />
                    </Link>
                    {platformDescription && (
                        <p className="text-sm leading-[1.7] max-w-[260px] mb-4">
                            {platformDescription}
                        </p>
                    )}
                </div>

                {/* Services */}
                <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-[0.8px] mb-4">Services</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-2">
                        <li><Link href={getCreateRequestRoutePath()} className={linkClass}>Nettoyage</Link></li>
                        <li><Link href={getCreateRequestRoutePath()} className={linkClass}>Sécurité</Link></li>
                        <li><Link href={getCreateRequestRoutePath()} className={linkClass}>Jardinage</Link></li>
                        <li><Link href={getCreateRequestRoutePath()} className={linkClass}>Déménagement</Link></li>
                        <li><Link href={getCreateRequestRoutePath()} className={linkClass}>Plomberie</Link></li>
                    </ul>
                </div>

                {/* Plateforme */}
                <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-[0.8px] mb-4">Plateforme</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-2">
                        <li><Link href={getHelpCenterRoutePath()} className={linkClass}>Comment ça marche</Link></li>
                        <li><Link href={getContactUsRoutePath()} className={linkClass}>Annuaire pros</Link></li>
                        <li><Link href={getCreditsRoutePath()} className={linkClass}>Tarifs</Link></li>
                    </ul>
                </div>

                {/* Légal */}
                <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-[0.8px] mb-4">Légal</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-2">
                        <li><Link href={getTermsRoutePath()} className={linkClass}>Mentions légales</Link></li>
                        <li><Link href={getTermsRoutePath()} className={linkClass}>CGU</Link></li>
                        <li><Link href={getPrivacyRoutePath()} className={linkClass}>Confidentialité</Link></li>
                        <li><Link href={getCookiesRoutePath()} className={linkClass}>Cookies</Link></li>
                    </ul>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="flex justify-between items-center text-sm flex-wrap gap-y-3">
                <span>© {new Date().getFullYear()} {marketplaceName}. Tous droits réservés.</span>
                <div className="flex gap-3">
                    <Link href={twitterUrl} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 rounded-[10px] bg-white/[0.07] flex items-center justify-center text-base text-white/60 transition-colors duration-200 hover:bg-white/15">
                        <FaXTwitter />
                    </Link>
                    <Link href={linkedinUrl} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 rounded-[10px] bg-white/[0.07] flex items-center justify-center text-base text-white/60 transition-colors duration-200 hover:bg-white/15">
                        <BsLinkedin />
                    </Link>
                    <Link href={facebookUrl} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 rounded-[10px] bg-white/[0.07] flex items-center justify-center text-base text-white/60 transition-colors duration-200 hover:bg-white/15">
                        <BsFacebook />
                    </Link>
                </div>
            </div>
        </footer >
    )
}
