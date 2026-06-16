"use client"
import ImageComponent from "@/components/library/ImageComponent";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getContactUsRoutePath, getHelpCenterRoutePath, getFaqRoutePath, getTermsRoutePath, getPrivacyRoutePath, getCookiesRoutePath, getFacebookUrl, getTwitterUrl, getInstagramUrl, getLinkedinUrl, getMessageRoutePath, getVendorMessageRoutePath } from "@/routes/routes";
import { BiBuilding, BiShield, BiCookie } from "react-icons/bi";
import { BsFacebook, BsInstagram, BsLinkedin } from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";
import { IoDocumentSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
// import { PiPhone } from "react-icons/pi";
import { useGetGlobalSettingsQuery } from "@/redux/rtkQueries/clientSideGetApis";

const MESSAGE_PATHS = [getMessageRoutePath(), getVendorMessageRoutePath()];

function FooterDynamicSkeleton() {
    return (
        <>
            <div className="h-14 w-44 max-w-full rounded-md bg-white/15 animate-pulse" aria-hidden />
            <div className="space-y-3">
                <div className="h-3.5 max-w-md rounded bg-white/15 animate-pulse" />
                <div className="h-3.5 max-w-md rounded bg-white/15 animate-pulse" />
                <div className="h-3.5 w-4/5 max-w-md rounded bg-white/15 animate-pulse" />
            </div>
            <div className="flex items-center gap-3">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="size-10 shrink-0 rounded-full bg-white/15 animate-pulse" aria-hidden />
                ))}
            </div>
        </>
    );
}

function FooterContactSkeleton() {
    return (
        <div className="space-y-2 footer_nav_item">
            <div className="h-4 w-52 max-w-full rounded bg-white/15 animate-pulse" aria-hidden />
            <div className="h-16 w-full max-w-xs rounded bg-white/15 animate-pulse" aria-hidden />
        </div>
    );
}

const Footer = () => {
    const pathname = usePathname();
    const { data: globalSettings, isLoading: isGlobalSettingsLoading } = useGetGlobalSettingsQuery();
    const settings = globalSettings?.data;

    if (MESSAGE_PATHS.some((path) => pathname === path)) {
        return null;
    }

    const logoUrl = settings?.footer_logo || "/images/footer/ask_service_white.png";
    const platformDescription = settings?.platformDescription || "";
    const facebookUrl = settings?.facebook_link || getFacebookUrl();
    const twitterUrl = settings?.x_link || getTwitterUrl();
    const instagramUrl = settings?.instagram_link || getInstagramUrl();
    const linkedinUrl = settings?.linkedin_link || getLinkedinUrl();
    const email = settings?.email || "";
    // const phone = settings?.phone || "01 987654321"
    const address = settings?.address || "";
    const marketplaceName = globalSettings?.data?.marketplace_name || "Ask Service";

    return (
        <>
            <div className="py-6.75 px-10 bg-pinkBlack space-y-21.25">
                <div className="flex flex-col xl:flex-row justify-between items-start px-0 lg:px-7.5 pt-5 lg:pt-16.25 gap-y-10">
                    <div className="space-y-8 max-w-fit">
                        <div className="space-y-6">
                            {isGlobalSettingsLoading ? (
                                <FooterDynamicSkeleton />
                            ) : (
                                <>
                                    <div className="h-14 w-fit">
                                        <ImageComponent url={logoUrl} object_contain img_title={`${marketplaceName} logo`} />
                                    </div>
                                    <p className="text-footerSilver text-sm xl:text-[15px] font-normal">
                                        {platformDescription}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <Link href={facebookUrl} className="footer_icons" target="_blank" rel="noopener noreferrer">
                                            <BsFacebook />
                                        </Link>
                                        <Link href={twitterUrl} className="footer_icons" target="_blank" rel="noopener noreferrer">
                                            <FaXTwitter />
                                        </Link>
                                        <Link href={instagramUrl} className="footer_icons" target="_blank" rel="noopener noreferrer">
                                            <BsInstagram />
                                        </Link>
                                        <Link href={linkedinUrl} className="footer_icons" target="_blank" rel="noopener noreferrer">
                                            <BsLinkedin />
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between xl:justify-end gap-auto lg:gap-35 w-full flex-wrap gap-y-10">
                        <div className="space-y-3 col-span-2">
                            <div className="footer_nav_heading text-nowrap">Assistance</div>
                            <div className="space-y-2 footer_nav_item">
                                <Link href={getHelpCenterRoutePath()} className="text-footerSilver hover:text-customWhite hover:underline cursor-pointer transition-colors">Centre d'aide</Link>
                                <Link href={getFaqRoutePath()} className="text-footerSilver hover:text-customWhite hover:underline cursor-pointer transition-colors">Foire aux questions</Link>
                                <Link href={getContactUsRoutePath()} className="text-footerSilver hover:text-customWhite hover:underline cursor-pointer transition-colors">Contactez-nous</Link>
                            </div>
                        </div>
    
                        <div className="space-y-3 col-span-2">
                            <div className="footer_nav_heading text-nowrap">Contact</div>
                            {isGlobalSettingsLoading ? (
                                <FooterContactSkeleton />
                            ) : (
                                <div className="space-y-2 footer_nav_item">
                                    <Link href={`mailto:${email}`} className="flex items-center gap-2"><span><MdEmail /></span>{email}</Link>
                                    {/* <Link href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-2"><span><PiPhone /></span>{phone}</Link> */}
                                    <p className="flex items-start gap-2"><span className="mt-1.5"><BiBuilding /></span>{address}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="border-t-1 border-[#8A8A8A66] pt-6 flex justify-between items-center flex-wrap gap-y-4">
                    <p className="text-customWhite text-sm/[20px] text-wrap max-w-full md:max-w-1/2">
                        © {new Date().getFullYear()} Ask Service. Tous droits réservés.<br />
                    </p>
                    <div className="flex items-center justify-between gap-auto md:gap-12.5">
                        <Link href={getTermsRoutePath()} className="text-customWhite flex items-center text-sm gap-2 hover:underline cursor-pointer transition-colors">
                            <span><IoDocumentSharp /></span>
                            Conditions d’utilisations
                        </Link>
                        <Link href={getPrivacyRoutePath()} className="text-customWhite flex items-center text-sm gap-2 hover:underline cursor-pointer transition-colors">
                            <span><BiShield /></span>
                            Politique De Confidentialité
                        </Link>
                        <Link href={getCookiesRoutePath()} className="text-customWhite flex items-center text-sm gap-2 hover:underline cursor-pointer transition-colors">
                            <span><BiCookie /></span>
                            Politique cookies
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Footer;