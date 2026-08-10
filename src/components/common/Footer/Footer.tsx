"use client"
import ImageComponent from '@/components/library/ImageComponent'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { BsFacebook, BsLinkedin } from 'react-icons/bs'
import { FaXTwitter } from 'react-icons/fa6'
import { useGetGlobalSettingsQuery, useGetServiceCategoriesQuery } from '@/redux/rtkQueries/clientSideGetApis'
import {
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
    getHomeRoutePath,
    getServiceProviderRoutePath,
    getRequestAServiceRoutePath,
} from '@/routes/routes'

const MESSAGE_PATHS = [
    getHomeRoutePath(),
    getCreateRequestRoutePath(),
    getServiceProviderRoutePath(),
    getCreateRequestRoutePath(),
    getHelpCenterRoutePath(),
    getCreditsRoutePath(),
    getContactUsRoutePath(),
    getTermsRoutePath(),
    getPrivacyRoutePath(),
    getCookiesRoutePath(),
    getFacebookUrl(),
    getTwitterUrl(),
    getLinkedinUrl(),
]

const FOOTER_SERVICES_LIMIT = 4
const SERVICES_SECTION_HREF = `${getHomeRoutePath()}#services`

const linkClass = "text-sm font-medium text-[#ffffff73] no-underline transition-colors duration-200 hover:text-white"


export default function Footer({ footerLogoUrl, platformDescription, marketplaceName }: { footerLogoUrl: string, platformDescription: string, marketplaceName: string }) {
    const pathname = usePathname()
    const { data: globalSettings } = useGetGlobalSettingsQuery()
    const { data: serviceCategoriesData } = useGetServiceCategoriesQuery()
    const settings = globalSettings?.data

    const footerServices = useMemo(
        () => (serviceCategoriesData?.data ?? [])
            .flatMap((category) => category.child_categories ?? [])
            .slice(0, FOOTER_SERVICES_LIMIT),
        [serviceCategoriesData?.data],
    )

    if (!MESSAGE_PATHS.some((path) => pathname === path)) {
        return null
    }
    
    const facebookUrl = settings?.facebook_link || getFacebookUrl()
    const twitterUrl = settings?.x_link || getTwitterUrl()
    const linkedinUrl = settings?.linkedin_link || getLinkedinUrl()

    return (
        <footer className="bg-slate-900 px-[5%] pt-15 pb-9 text-[#ffffff73]">
            <div className="grid grid-cols-1 gap-8 pb-12 mb-8 border-b border-white/[0.07] sm:grid-cols-2 sm:gap-12 lg:grid-cols-[2fr_1fr_1fr_1fr]">
                <div>
                    {/* Brand */}
                    <Link href="/" className="block h-14 w-fit mb-3.5">
                        <ImageComponent url={footerLogoUrl} object_contain img_title={`${marketplaceName} logo`} />
                    </Link>
                    {platformDescription && (
                        <p className="text-sm leading-[1.7] max-w-65 mb-4">
                            {platformDescription}
                        </p>
                    )}
                </div>

                {/* Services */}
                <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-[0.8px] mb-4">Services</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-2">
                        {footerServices.map((service) => (
                            <li key={service._id}>
                                <Link href={getRequestAServiceRoutePath(service._id)} className={linkClass}>
                                    {service.title}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <Link href={SERVICES_SECTION_HREF} className={linkClass}>
                                Voir plus
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Plateforme */}
                <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-[0.8px] mb-4">Plateforme</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-2">
                        <li><Link href={getHelpCenterRoutePath()} className={linkClass}>Comment ça marche</Link></li>
                        <li><Link href={getCreditsRoutePath()} className={linkClass}>Tarifs</Link></li>
                    </ul>
                </div>

                {/* Légal */}
                <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-[0.8px] mb-4">Légal</h4>
                    <ul className="list-none p-0 m-0 flex flex-col gap-2">
                        <li><Link href={getTermsRoutePath()} className={linkClass}>Mentions légales</Link></li>
                        {/* <li><Link href={getTermsRoutePath()} className={linkClass}>CGU</Link></li> */}
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
                        className="w-9 h-9 rounded-[10px] bg-white/[0.07] flex items-center justify-center text-base text-white/60 transition-colors duration-200 hover:bg-appCard/15">
                        <FaXTwitter />
                    </Link>
                    <Link href={linkedinUrl} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 rounded-[10px] bg-white/[0.07] flex items-center justify-center text-base text-white/60 transition-colors duration-200 hover:bg-appCard/15">
                        <BsLinkedin />
                    </Link>
                    <Link href={facebookUrl} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 rounded-[10px] bg-white/[0.07] flex items-center justify-center text-base text-white/60 transition-colors duration-200 hover:bg-appCard/15">
                        <BsFacebook />
                    </Link>
                </div>
            </div>
        </footer >
    )
}
